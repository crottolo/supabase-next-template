import { NextRequest, NextResponse } from 'next/server'
import { odooAuth } from '@/lib/odoo/client'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, confirmPassword } = await request.json()

    // Validazione input
    if (!email || !name || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Le password non corrispondono' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La password deve essere di almeno 8 caratteri' },
        { status: 400 }
      )
    }

    // Verifica configurazione Odoo
    if (!odooAuth.isConfigured()) {
      return NextResponse.json(
        { error: 'Configurazione Odoo non disponibile' },
        { status: 500 }
      )
    }

    const config = odooAuth.getConfig()!

    // Usa l'API custom /api/create_user del modulo create_user_api
    const createUserUrl = `${config.url}/api/create_user`
    
    console.log(`🔗 Tentativo registrazione su API custom: ${createUserUrl}`)

    // Prepara i dati per l'API custom Odoo
    const requestData = {
      username: email,        // Usa email come username
      password: password,
      email: email,
      name: name,
      user_type: 'portal',    // Solo utenti portal per sicurezza
      phone: ''               // Opzionale, vuoto per ora
    }

    const response = await fetch(createUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Odoo-Next-API/1.0)',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    console.log(`📊 Risposta Odoo API: ${response.status} ${response.statusText}`)

    // Gestione risposta dell'API custom (formato JSON-RPC)
    if (response.ok) {
      const responseData = await response.json()
      
      // Estrai il risultato dal formato JSON-RPC
      const result = responseData.result || responseData
      
      console.log(`🔍 Parsing risposta API:`, { responseData, result })
      
      if (result.status === 'success') {
        console.log(`✅ Utente creato con successo: ${result.user_login} (ID: ${result.user_id})`)
        
        return NextResponse.json({
          success: true,
          message: 'Account creato con successo! Ora puoi effettuare il login.',
          user_id: result.user_id,
          user_login: result.user_login,
          user_email: result.user_email
        })
      } else {
        // Errore dall'API Odoo
        console.error(`❌ Errore API Odoo:`, result)
        
        // Gestisci errori specifici
        const errorMessage = result.message || result.error || 'Errore sconosciuto'
        
        if (errorMessage.includes('already exists') || errorMessage.includes('duplicate') || errorMessage.includes('esistente')) {
          return NextResponse.json(
            { error: 'Un utente con questa email o username esiste già' },
            { status: 409 }
          )
        } else if (errorMessage.includes('Access denied') || errorMessage.includes('denied')) {
          return NextResponse.json(
            { error: 'Accesso negato: server non autorizzato. Contatta l\'amministratore.' },
            { status: 403 }
          )
        } else if (errorMessage.includes('invalid') || errorMessage.includes('formato')) {
          return NextResponse.json(
            { error: 'Dati non validi: ' + errorMessage },
            { status: 400 }
          )
        } else {
          return NextResponse.json(
            { error: errorMessage },
            { status: 400 }
          )
        }
      }
    } else {
      // Errore HTTP
      const errorText = await response.text()
      console.error(`❌ Errore HTTP ${response.status}: ${errorText}`)
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Accesso negato: IP non autorizzato per la registrazione' },
          { status: 403 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { error: 'API di registrazione non disponibile. Contatta l\'amministratore.' },
          { status: 404 }
        )
      } else {
        return NextResponse.json(
          { error: 'Errore del server durante la registrazione. Riprova più tardi.' },
          { status: 500 }
        )
      }
    }

  } catch (error) {
    console.error('Registration error:', error)
    
    // Gestisci errori di rete
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Impossibile connettersi al server Odoo. Controlla la configurazione.' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 