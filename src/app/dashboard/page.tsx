import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LogoutButton from "./logout-button"

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>

        {/* Benvenuto Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Benvenuto nella Dashboard!</CardTitle>
            <CardDescription>
              Questa è una pagina privata accessibile solo agli utenti autenticati.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Informazioni Utente:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">ID Utente</p>
                    <p className="font-medium font-mono text-xs">{user.id}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Registrato il</p>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Ultimo accesso</p>
                    <p className="font-medium">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString("it-IT")
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Card */}
        <Card>
          <CardHeader>
            <CardTitle>Funzionalità Disponibili</CardTitle>
            <CardDescription>
              Ecco cosa puoi fare in questa dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🔐</div>
                <h3 className="font-semibold">Autenticazione Sicura</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Powered by Supabase Auth
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold">Next.js 15</h3>
                <p className="text-sm text-gray-600 mt-1">
                  App Router con SSR
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold">Shadcn/ui</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Design system moderno
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Card */}
        <Card>
          <CardHeader>
            <CardTitle>Navigazione</CardTitle>
          </CardHeader>
          <CardContent>
                         <div className="flex gap-4">
               <Button asChild variant="outline">
                 <Link href="/">← Torna alla Home</Link>
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 