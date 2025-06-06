"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSignupAvailability } from "@/lib/hooks/useSignupAvailability"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const urlMessage = searchParams.get('message')
  
  // Hook per verificare disponibilità signup
  const { available: signupAvailable, loading: signupLoading, config } = useSignupAvailability()

  // Gestisci messaggi dalla URL
  useEffect(() => {
    if (urlMessage === 'registration-success') {
      setMessage('🎉 Registrazione completata con successo! Ora puoi effettuare il login.')
    } else if (urlMessage === 'registration-pending') {
      setMessage('📧 Registrazione inviata. Controlla la tua email per attivare l\'account.')
    }
  }, [urlMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to the intended page
      router.push(redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Accedi con Odoo</CardTitle>
          <CardDescription>
            Inserisci le tue credenziali Odoo per continuare
          </CardDescription>
          
          {/* Indicatore connessione Odoo */}
          {config.url && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Connesso a Odoo</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">{config.url}</p>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Il tuo username Odoo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="La tua password Odoo"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Oppure
                  </span>
                </div>
              </div>
            </div>

            {/* Bottone registrazione condizionale */}
            <div className="text-center space-y-2">
              {signupLoading ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  Verifica disponibilità registrazione...
                </div>
              ) : signupAvailable ? (
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/register">
                      ✨ Crea nuovo account
                    </Link>
                  </Button>
                  <p className="text-xs text-green-600">
                    ✅ Registrazione self-service disponibile
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    📧 Registrazione non disponibile
                    <p className="text-xs text-gray-500 mt-1">
                      Contatta l'amministratore per ottenere un account
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Link utili */}
            <div className="text-center space-y-2">
              <div className="flex justify-center gap-4 text-sm">
                <Link href="/" className="text-blue-600 hover:underline">
                  ← Home
                </Link>
                <Link href="/setup" className="text-blue-600 hover:underline">
                  🔧 Setup
                </Link>
              </div>
            </div>
          </div>

          {/* Info Odoo */}
          <div className="mt-6 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 text-xs mb-1">🔗 Autenticazione Odoo</h4>
            <ul className="text-xs text-purple-700 space-y-0.5">
              <li>• Usa le stesse credenziali dell'interfaccia web Odoo</li>
              <li>• Le sessioni sono sicure e crittografate</li>
              <li>• Accesso automatico alle funzionalità autorizzate</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 