"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSignupAvailability } from "@/lib/hooks/useSignupAvailability"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  
  // Hook per verificare disponibilità signup
  const { available: signupAvailable, loading: signupLoading, config } = useSignupAvailability()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validazione client-side
    if (password !== confirmPassword) {
      setError("Le password non corrispondono")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri")
      setIsLoading(false)
      return
    }

    try {
      // Prima verifica se l'utente esiste già
      const checkResponse = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          username: email 
        })
      })

      if (checkResponse.ok) {
        const checkData = await checkResponse.json()
        
        if (checkData.success && checkData.exists) {
          setError(`Un utente con questa email esiste già: ${checkData.user_info?.name || 'Utente esistente'}`)
          setIsLoading(false)
          return
        }
      }
      // Se il check fallisce, continua comunque con la registrazione

      // Procedi con la registrazione
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          name, 
          password, 
          confirmPassword 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registrazione fallita')
      }

      if (data.success) {
        setSuccess(`${data.message}\n\nUtente creato: ${data.user_login || email}\n\nAccesso automatico in corso...`)
        
        // Auto-login dopo registrazione riuscita
        setTimeout(async () => {
          try {
            const loginResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                username: email, 
                password: password 
              })
            })

            if (loginResponse.ok) {
              // Login automatico riuscito, vai alla dashboard
              router.push('/dashboard?message=welcome-new-user')
            } else {
              // Login automatico fallito, vai al login manuale
              router.push('/login?message=registration-success')
            }
          } catch (err) {
            // Errore nell'auto-login, vai al login manuale
            console.error('Auto-login failed:', err)
            router.push('/login?message=registration-success')
          }
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante la registrazione')
    } finally {
      setIsLoading(false)
    }
  }

  // Se signup non è disponibile, mostra messaggio
  if (!signupLoading && !signupAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">📧 Registrazione Non Disponibile</CardTitle>
            <CardDescription>
              La registrazione self-service non è attualmente abilitata
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-700">
                <strong>Registrazione disabilitata</strong><br/>
                La tua istanza Odoo non permette la registrazione automatica degli utenti.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 text-center">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💬 Come ottenere un account</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Contatta l'amministratore di sistema per richiedere un nuovo account Odoo.
                </p>
                {config.url && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`${config.url}/web/login`} target="_blank" rel="noopener noreferrer">
                      🔗 Vai a Odoo
                    </a>
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/login">← Accedi</Link>
                </Button>
                <Button asChild variant="ghost" className="flex-1">
                  <Link href="/">Home</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">✨ Crea Nuovo Account</CardTitle>
          <CardDescription>
            Registrati per accedere al tuo account Odoo
          </CardDescription>
          
          {/* Indicatore connessione Odoo */}
          {config.url && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Registrazione Odoo Attiva</span>
              </div>
              <p className="text-xs text-green-600 mt-1">{config.url}</p>
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

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tua.email@esempio.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Il tuo nome completo"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Almeno 8 caratteri"
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Conferma Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ripeti la password"
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registrazione in corso...' : '✨ Registrati'}
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

            {/* Link login */}
            <div className="text-center">
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">
                  👤 Ho già un account
                </Link>
              </Button>
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

          {/* Info Registrazione */}
          <div className="mt-6 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 text-xs mb-1">📝 Registrazione Odoo</h4>
            <ul className="text-xs text-purple-700 space-y-0.5">
              <li>• L'account verrà creato direttamente su Odoo</li>
              <li>• Riceverai una email di conferma</li>
              <li>• Usa le stesse credenziali per accedere</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 