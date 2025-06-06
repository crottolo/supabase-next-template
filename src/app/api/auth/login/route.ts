import { NextRequest, NextResponse } from 'next/server'
import { odooAuth } from '@/lib/odoo/client'
import { SessionManager, createSessionCookie } from '@/lib/odoo/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validazione input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Verifica configurazione Odoo
    if (!odooAuth.isConfigured()) {
      return NextResponse.json(
        { error: 'Odoo configuration not available' },
        { status: 500 }
      )
    }

    // Tenta l'autenticazione con Odoo
    const user = await odooAuth.authenticate(username, password)

    // Crea la sessione JWT (ora async)
    const sessionToken = await SessionManager.createSession(user, username)

    // Crea la risposta con il cookie di sessione
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        login: user.login
      }
    })

    // Imposta il cookie di sessione
    response.headers.set('Set-Cookie', createSessionCookie(sessionToken))

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    // Gestione errori specifici
    if (error instanceof Error) {
      if (error.message === 'Invalid credentials') {
        return NextResponse.json(
          { error: 'Invalid username or password' },
          { status: 401 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
} 