import { OdooClient } from 'odoo-xmlrpc-ts'

export interface OdooPartner {
  id: number
  name: string
  email?: string
  phone?: string
  mobile?: string
  street?: string
  city?: string
  zip?: string
  country_id?: [number, string] | false
  state_id?: [number, string] | false
  website?: string
  is_company: boolean
  parent_id?: [number, string] | false
  category_id?: number[]
  // image_1920 escluso per evitare headers_too_big
}

export interface OdooUser {
  id: number
  name: string
  login: string
  email?: string
  active?: boolean
  partner_id?: [number, string] | false
  partner?: OdooPartner // Dati completi del partner
}

export interface OdooConfig {
  url: string
  db: string
  database?: string  // Compatibilità con odoo-xmlrpc-ts
}

export interface SignupAvailability {
  available: boolean
  lastChecked: Date
  error?: string
}

export class OdooAuth {
  private client: OdooClient | null = null
  private config: OdooConfig | null = null

  constructor() {
    // La configurazione viene impostata dinamicamente dal form di login
    this.loadConfigFromEnv()
  }

  private loadConfigFromEnv() {
    const url = process.env.NEXT_PUBLIC_ODOO_URL
    const db = process.env.NEXT_PUBLIC_ODOO_DB

    if (url && db) {
      this.config = { url, db, database: db }
      console.log(`🔗 Odoo config loaded: ${url} (DB: ${db})`)
    }
  }

  isConfigured(): boolean {
    return this.config !== null
  }

  getConfig(): OdooConfig | null {
    return this.config
  }

  async authenticate(username: string, password: string): Promise<OdooUser> {
    if (!this.config) {
      throw new Error('Odoo configuration not available')
    }

    // Crea un nuovo client per ogni tentativo di autenticazione
    const authClient = new OdooClient({
      url: this.config.url,
      db: this.config.db,
      username: username,
      password: password
    })

    try {
      // Tenta l'autenticazione
      const uid = await authClient.authenticate()
      
      // Se l'autenticazione è riuscita, ottieni i dati dell'utente incluso partner_id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [user]: any[] = await authClient.read<any>('res.users', [uid], [
        'id', 'name', 'login', 'email', 'active', 'partner_id'
      ])

      if (!user) {
        throw new Error('User data not found')
      }

      console.log(`✅ Odoo authentication successful for user: ${user.name} (${user.login})`)

      // Se l'utente ha un partner_id, recupera i dati completi del partner
      let partnerData: OdooPartner | undefined = undefined

      if (user.partner_id && Array.isArray(user.partner_id) && user.partner_id[0]) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [partner]: any[] = await authClient.read<any>('res.partner', [user.partner_id[0]], [
            'id', 'name', 'email', 'phone', 'mobile', 'street', 'city', 'zip', 
            'country_id', 'state_id', 'website', 'is_company', 'parent_id', 
            'category_id'
            // Escludo image_1920 per evitare headers_too_big (immagine base64 troppo grande)
          ])

          if (partner) {
            partnerData = {
              id: partner.id,
              name: partner.name,
              email: partner.email,
              phone: partner.phone,
              mobile: partner.mobile,
              street: partner.street,
              city: partner.city,
              zip: partner.zip,
              country_id: partner.country_id,
              state_id: partner.state_id,
              website: partner.website,
              is_company: partner.is_company,
              parent_id: partner.parent_id,
              category_id: partner.category_id
              // image_1920 rimosso per evitare headers_too_big
            }
            console.log(`📋 Partner data loaded for: ${partner.name}`)
          }
        } catch (partnerError) {
          console.warn('⚠️ Could not load partner data:', partnerError)
          // Non blocchiamo l'autenticazione se non riusciamo a caricare i dati del partner
        }
      }

      return {
        id: user.id,
        name: user.name,
        login: user.login,
        email: user.email,
        active: user.active,
        partner_id: user.partner_id,
        partner: partnerData
      }

    } catch (error) {
      console.error('Odoo authentication failed:', error)
      throw new Error('Invalid credentials')
    }
  }

  async getUser(uid: number, username: string, password: string): Promise<OdooUser | null> {
    if (!this.config) {
      throw new Error('Odoo configuration not available')
    }

    try {
      const client = new OdooClient({
        ...this.config,
        username,
        password
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [user] = await client.read<any>('res.users', [uid], [
        'name',
        'email',
        'login'
      ])

      return {
        id: uid,
        name: user.name,
        email: user.email,
        login: user.login
      }
    } catch (error) {
      console.error('Failed to get user:', error)
      return null
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async searchUsers(username: string, password: string, domain: any[] = []): Promise<OdooUser[]> {
    if (!this.config) {
      throw new Error('Odoo configuration not available')
    }

    try {
      const client = new OdooClient({
        ...this.config,
        username,
        password
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const users = await client.searchRead<any>('res.users', domain, {
        fields: ['name', 'email', 'login'],
        limit: 50
      })

      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login
      }))
    } catch (error) {
      console.error('Failed to search users:', error)
      return []
    }
  }

  /**
   * Verifica se l'istanza Odoo permette la registrazione self-service
   * controllando la presenza del link signup nella pagina /web/login
   */
  async checkSignupAvailability(): Promise<SignupAvailability> {
    if (!this.config) {
      return {
        available: false,
        lastChecked: new Date(),
        error: 'Odoo configuration not available'
      }
    }

    try {
      const loginUrl = `${this.config.url}/web/login`
      console.log(`🔍 Checking signup availability at: ${loginUrl}`)

      const response = await fetch(loginUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Odoo-Next-Checker/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        // Timeout di 10 secondi
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      
      // Cerca pattern comuni per signup in Odoo
      const signupPatterns = [
        /signup/i,                    // Link o testo "signup"
        /registra/i,                  // Italiano "registrati"
        /sign up/i,                   // Inglese "sign up"
        /create.*account/i,           // "Create account"
        /new.*user/i,                 // "New user"
        /don't.*have.*account/i,      // "Don't have an account?"
        /non.*ho.*account/i           // Italiano "Non ho un account"
      ]

      const hasSignup = signupPatterns.some(pattern => pattern.test(html))

      console.log(`${hasSignup ? '✅' : '❌'} Signup availability: ${hasSignup}`)

      return {
        available: hasSignup,
        lastChecked: new Date(),
        error: undefined
      }

    } catch (error) {
      console.error('❌ Error checking signup availability:', error)
      
      return {
        available: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Istanza globale condivisa
export const odooAuth = new OdooAuth() 