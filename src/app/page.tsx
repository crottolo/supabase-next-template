import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LogoutButton from "@/components/ui/logout-button"

// Force dynamic rendering to check authentication
export const dynamic = 'force-dynamic'

export default async function Home() {
  let user = null
  
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    // If Supabase is not configured, user remains null
    console.log('Supabase not configured or error:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {user ? `Hello, ${user.email?.split('@')[0]}!` : 'Welcome'}
          </CardTitle>
          <CardDescription>
            {user ? 'You are authenticated and ready to start' : 'Choose an option to continue'}
          </CardDescription>
          {user && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Authenticated</span>
              </div>
              <p className="text-xs text-green-600 mt-1">{user.email}</p>
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
                  Sign In
                </Button>
              </Link>
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Sign Up
                </Button>
              </Link>
              <div className="pt-2">
                <Link href="/dashboard" className="block">
                  <Button variant="secondary" className="w-full" size="sm">
                    Dashboard (Login required)
                  </Button>
                </Link>
              </div>
            </>
          )}
          
          <div className="pt-4 border-t">
            <Link href="/setup" className="block">
              <Button variant="ghost" className="w-full" size="sm">
                🔧 Setup Supabase
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
