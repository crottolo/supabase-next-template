import { NextResponse, type NextRequest } from 'next/server'
import { getSessionFromCookie } from '@/lib/odoo/session'

// Lista delle route che richiedono autenticazione
// Supporta wildcard con * (es: /dashboard/* per tutte le sottorotte di dashboard)
const protectedRoutes = [
  '/dashboard/*',     // Include /dashboard, /dashboard/client, /dashboard/optimized, etc.
  '/profile/*',       // Include /profile e tutte le sue sottorotte
  '/settings/*',      // Include /settings e tutte le sue sottorotte
  '/admin/*',         // Esempio: route admin protette
  // Aggiungi qui altre route protette
]

// Route pubbliche che non richiedono autenticazione
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/setup',
  '/api/auth/*',      // API routes per autenticazione
  '/api/health/*',    // Health check
]

// Funzione per verificare se una route richiede autenticazione
function requiresAuth(pathname: string): boolean {
  // Prima controlla se è una route pubblica
  const isPublic = publicRoutes.some(route => {
    if (route.endsWith('/*')) {
      const basePath = route.slice(0, -2)
      return pathname === basePath || pathname.startsWith(basePath + '/')
    } else {
      return pathname === route
    }
  })

  if (isPublic) {
    return false
  }

  // Poi controlla se è esplicitamente protetta
  return protectedRoutes.some(route => {
    if (route.endsWith('/*')) {
      // Pattern con wildcard: verifica se il pathname inizia con la base del pattern
      const basePath = route.slice(0, -2) // Rimuove '/*'
      return pathname === basePath || pathname.startsWith(basePath + '/')
    } else {
      // Pattern esatto
      return pathname === route || pathname.startsWith(route + '/')
    }
  })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verifica se la route corrente richiede autenticazione
  if (!requiresAuth(pathname)) {
    // Route pubblica, non serve autenticazione
    return NextResponse.next()
  }

  // Controlla se Odoo è configurato
  const odooUrl = process.env.NEXT_PUBLIC_ODOO_URL
  const odooDb = process.env.NEXT_PUBLIC_ODOO_DB

  if (!odooUrl || !odooDb) {
    console.warn('⚠️ Odoo environment variables not configured. Authentication will not work.')
    return NextResponse.next()
  }

  // Leggi il cookie di sessione
  const cookieHeader = request.headers.get('cookie') || ''
  const session = await getSessionFromCookie(cookieHeader)

  // Se non c'è sessione valida, reindirizza al login
  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Aggiungi il redirect URL come parametro per tornare alla pagina originale dopo il login
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Se c'è una sessione valida, continua
  const response = NextResponse.next()

  // Aggiungi headers con informazioni utente per le API routes
  response.headers.set('x-user-id', session.user.id.toString())
  response.headers.set('x-user-login', session.username)
  response.headers.set('x-user-name', session.user.name)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp (static images)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 