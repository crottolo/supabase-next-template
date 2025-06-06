import { NextRequest, NextResponse } from 'next/server'
import { odooAuth } from '@/lib/odoo/client'

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json()

    // Validazione input
    if (!email && !username) {
      return NextResponse.json(
        { error: 'Fornire almeno email o username' },
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
    const checkUserUrl = `${config.url}/api/check_user`
    
    console.log(`🔍 Verifica esistenza utente: ${checkUserUrl}`)

    // Prepara i dati per l'API check_user
    const requestData: any = {}
    if (username) requestData.username = username
    if (email) requestData.email = email

    const response = await fetch(checkUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; Odoo-Next-Check/1.0)',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    console.log(`📊 Risposta check user API: ${response.status} ${response.statusText}`)

    if (response.ok) {
      const responseData = await response.json()
      
      // Estrai il risultato dal formato JSON-RPC
      const result = responseData.result || responseData
      
      if (result.status === 'success') {
        return NextResponse.json({
          success: true,
          exists: result.exists,
          message: result.message,
          user_info: result.user_info || null
        })
      } else {
        return NextResponse.json(
          { error: result.message || 'Errore durante la verifica utente' },
          { status: 400 }
        )
      }
    } else {
      const errorText = await response.text()
      console.error(`❌ Errore HTTP check user: ${response.status} - ${errorText}`)
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Accesso negato: IP non autorizzato' },
          { status: 403 }
        )
      } else {
        return NextResponse.json(
          { error: 'Errore del server durante la verifica utente' },
          { status: 500 }
        )
      }
    }

  } catch (error) {
    console.error('Check user error:', error)
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
} 