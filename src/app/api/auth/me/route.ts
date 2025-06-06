import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/odoo/session'

export async function GET(request: NextRequest) {
  try {
    // Leggi il cookie di sessione
    const cookieHeader = request.headers.get('cookie') || ''
    const session = await getSessionFromCookie(cookieHeader)

    if (!session) {
      return NextResponse.json(
        { error: 'No valid session found' },
        { status: 401 }
      )
    }

    // Ritorna i dati dell'utente e del partner dalla sessione
    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        login: session.user.login,
        active: session.user.active,
        partner_id: session.user.partner_id
      },
      partner: session.user.partner ? {
        id: session.user.partner.id,
        name: session.user.partner.name,
        email: session.user.partner.email,
        phone: session.user.partner.phone,
        mobile: session.user.partner.mobile,
        street: session.user.partner.street,
        city: session.user.partner.city,
        zip: session.user.partner.zip,
        country_id: session.user.partner.country_id,
        state_id: session.user.partner.state_id,
        website: session.user.partner.website,
        is_company: session.user.partner.is_company,
        parent_id: session.user.partner.parent_id
      } : null,
      username: session.username,
      sessionInfo: {
        iat: session.iat,
        exp: session.exp
      }
    })

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    )
  }
} 