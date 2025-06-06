import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/odoo/session'

export async function POST() {
  try {
    // Crea la risposta di logout
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Cancella il cookie di sessione
    response.headers.set('Set-Cookie', clearSessionCookie())

    return response

  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
} 