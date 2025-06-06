import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Lista delle route che richiedono autenticazione
// Supporta wildcard con * (es: /dashboard/* per tutte le sottorotte di dashboard)
const protectedRoutes = [
  '/dashboard/*',     // Include /dashboard, /dashboard/client, /dashboard/optimized, etc.
  '/profile/*',       // Include /profile e tutte le sue sottorotte
  '/settings/*',      // Include /settings e tutte le sue sottorotte
  '/admin/*',         // Esempio: route admin protette
  // Aggiungi qui altre route protette
]

// Funzione per verificare se una route richiede autenticazione
function requiresAuth(pathname: string): boolean {
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
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Verifica se la route corrente richiede autenticazione
  if (!requiresAuth(request.nextUrl.pathname)) {
    // Route pubblica, non serve autenticazione
    return supabaseResponse
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are not configured correctly, skip authentication
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your_supabase_project_url' || 
      supabaseAnonKey === 'your_supabase_anon_key') {
    console.warn('⚠️  Supabase environment variables not configured. Authentication will not work.')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
                 setAll(cookiesToSet) {
           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
           supabaseResponse = NextResponse.next({
             request,
           })
           cookiesToSet.forEach(({ name, value, options }) =>
             supabaseResponse.cookies.set(name, value, options)
           )
         },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Solo per route protette: se non c'è utente, reindirizza al login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object instead of the supabaseResponse object

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 