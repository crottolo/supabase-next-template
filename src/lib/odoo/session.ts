import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { OdooUser } from './client'

export interface SessionData extends JWTPayload {
  user: OdooUser
  username: string
  // NON memorizziamo la password nel JWT per sicurezza
}

export interface DecodedSession extends SessionData {
  exp: number
  iat: number
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-dev-secret-change-in-production'
)
// const JWT_EXPIRES_IN = '7d' // Sessione valida per 7 giorni - not used but kept for reference

export class SessionManager {
  static async createSession(user: OdooUser, username: string): Promise<string> {
    const payload: SessionData = {
      user,
      username
    }

    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer('odoo-next-app')
      .setExpirationTime('7d')
      .sign(JWT_SECRET)
  }

  static async verifySession(token: string): Promise<DecodedSession | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        issuer: 'odoo-next-app'
      })
      
      return payload as DecodedSession
    } catch (error) {
      console.error('JWT verification failed:', error)
      return null
    }
  }

  static async refreshSession(token: string): Promise<string | null> {
    const decoded = await this.verifySession(token)
    if (!decoded) {
      return null
    }

    // Crea un nuovo token con i dati esistenti
    return this.createSession(decoded.user, decoded.username)
  }

  static isSessionExpired(token: string): boolean {
    try {
      // Decodifica il token senza verificare la firma per controllare l'exp
      const parts = token.split('.')
      if (parts.length !== 3) return true
      
      const payload = JSON.parse(atob(parts[1]))
      if (!payload.exp) return true

      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch {
      return true
    }
  }
}

// Helper functions per cookies
export const SESSION_COOKIE_NAME = 'odoo-session'

export async function getSessionFromCookie(cookieString: string): Promise<DecodedSession | null> {
  const cookies = cookieString.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)

  const sessionToken = cookies[SESSION_COOKIE_NAME]
  if (!sessionToken) {
    return null
  }

  return SessionManager.verifySession(sessionToken)
}

export function createSessionCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60 // 7 giorni in secondi
  return `${SESSION_COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production'}`
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`
} 