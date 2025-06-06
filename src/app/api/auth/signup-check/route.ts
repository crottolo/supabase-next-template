import { NextRequest, NextResponse } from 'next/server'
import { odooAuth } from '@/lib/odoo/client'

export async function GET(request: NextRequest) {
  try {
    // Verifica se Odoo è configurato
    if (!odooAuth.isConfigured()) {
      return NextResponse.json(
        { 
          available: false, 
          error: 'Odoo configuration not available',
          lastChecked: new Date().toISOString()
        },
        { status: 503 }
      )
    }

    // Controlla la disponibilità del signup
    const signupStatus = await odooAuth.checkSignupAvailability()

    return NextResponse.json({
      available: signupStatus.available,
      lastChecked: signupStatus.lastChecked.toISOString(),
      error: signupStatus.error || null,
      config: {
        url: odooAuth.getConfig()?.url || null,
        db: odooAuth.getConfig()?.db || null
      }
    })

  } catch (error) {
    console.error('Signup check error:', error)
    
    return NextResponse.json(
      { 
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 