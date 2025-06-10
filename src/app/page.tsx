import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LogoutButton from "@/components/ui/logout-button"
import { getSessionFromCookie } from "@/lib/odoo/session"
import { cookies } from "next/headers"
import FlowiseChat from "@/components/FloweiseChat"

// Force dynamic rendering to check authentication
export const dynamic = 'force-dynamic'

export default async function Home() {
  let user = null
  
  try {
    // Controlla la sessione Odoo dai cookies
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('odoo-session')
    
    if (sessionCookie) {
      const cookieString = `odoo-session=${sessionCookie.value}`
      const session = await getSessionFromCookie(cookieString)
      user = session?.user || null
    }
  } catch (error) {
    // Se c'è un errore, l'utente rimane null
    console.log('Session check error:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {user ? `Hello, ${user.name}!` : 'Welcome to Odoo Next'}
          </CardTitle>
          <CardDescription>
            {user ? 'You are authenticated and ready to start' : 'Sign in with your Odoo credentials to continue'}
          </CardDescription>
          {user && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Authenticated</span>
              </div>
              <p className="text-xs text-green-600 mt-1">{user.email || user.login}</p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            // Authenticated user
            <>
              <Link href="/dashboard" className="block">
                <Button className="w-full" size="lg">
                  Go to Dashboard
                </Button>
              </Link>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/dashboard">Profile</Link>
                </Button>
                <LogoutButton variant="ghost" size="sm" />
              </div>
            </>
          ) : (
            // Unauthenticated user
            <>
              <Link href="/login" className="block">
                <Button className="w-full" size="lg">
                  Sign In with Odoo
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/dashboard" className="block">
                  <Button variant="secondary" className="w-full" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/setup" className="block">
                  <Button variant="outline" className="w-full" size="sm">
                    🔧 Setup
                  </Button>
                </Link>
              </div>
            </>
          )}
          
          <div className="pt-4 border-t">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 text-xs mb-1">🔗 Odoo Integration</h4>
              <ul className="text-xs text-blue-700 space-y-0.5">
                <li>• Direct authentication with Odoo</li>
                <li>• Secure session management</li>
                <li>• Protected routes middleware</li>
              </ul>
            </div>
            
            {/* Setup link sempre visibile */}
            <div className="mt-3">
              <Link href="/setup" className="block">
                <Button variant="ghost" className="w-full" size="sm">
                  🔧 Configure Odoo Integration
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* BubbleChat come componente client */}
      <FlowiseChat
        chatflowid="3795676a-b660-4501-84cd-d93aff361609"
        apiHost="https://flowise.fl1.it"
      />
    </div>
  )
}
