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

    // Invio richiesta di registrazione all'endpoint Odoo signup
    const signupUrl = `${config.url}/web/signup`
    
    console.log(`🔗 Tentativo registrazione su: ${signupUrl}`)

    // Prepara i dati del form come li aspetta Odoo
    const formData = new URLSearchParams({
      'csrf_token': '', // Odoo gestirà il CSRF
      'name': name,
      'login': email,
      'password': password,
      'confirm_password': confirmPassword,
      'redirect': '/web',
      'token': '',
      'db': config.db
    })

    const response = await fetch(signupUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; Odoo-Next-Signup/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      body: formData,
      // Non seguire redirect automaticamente per gestire la risposta
      redirect: 'manual'
    })

    console.log(`📊 Risposta Odoo signup: ${response.status} ${response.statusText}`)

    // Controlla il risultato
    if (response.status === 302 || response.status === 200) {
      // Registrazione riuscita (redirect o success page)
      const location = response.headers.get('location')
      
      if (location && location.includes('/web')) {
        console.log(`✅ Registrazione completata, redirect a: ${location}`)
        return NextResponse.json({
          success: true,
          message: 'Registrazione completata con successo!',
          redirectUrl: `${config.url}${location}`
        })
      } else {
        // Controllo se c'è un messaggio di errore nella risposta
        const responseText = await response.text()
        
        if (responseText.includes('already exists') || responseText.includes('già esiste')) {
          return NextResponse.json(
            { error: 'Un utente con questa email esiste già' },
            { status: 409 }
          )
        }
        
        return NextResponse.json({
          success: true,
          message: 'Registrazione inviata. Controlla la tua email per confermare l\'account.',
          needsConfirmation: true
        })
      }
    } else if (response.status === 400) {
      return NextResponse.json(
        { error: 'Dati di registrazione non validi' },
        { status: 400 }
      )
    } else {
      console.error(`❌ Errore registrazione Odoo: ${response.status}`)
      return NextResponse.json(
        { error: 'Errore durante la registrazione. Riprova più tardi.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 