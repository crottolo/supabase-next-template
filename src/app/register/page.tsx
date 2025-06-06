"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSignupAvailability } from "@/lib/hooks/useSignupAvailability"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function RegisterPage() {
  // Hook per verificare disponibilità signup
  const { available: signupAvailable, loading: signupLoading, error, config } = useSignupAvailability()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {signupLoading ? "Verifica disponibilità..." : 
             signupAvailable ? "Registrazione Disponibile" : 
             "Registrazione Non Disponibile"}
          </CardTitle>
          <CardDescription>
            {signupLoading ? "Controllo configurazione Odoo in corso..." :
             signupAvailable ? "Puoi creare un nuovo account Odoo" :
             "La registrazione self-service non è abilitata"}
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
        
        <CardContent className="space-y-6">
          {signupLoading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Verifica della disponibilità del signup...</p>
            </div>
          ) : signupAvailable ? (
            // Signup available
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="font-semibold">✅ Registrazione Self-Service Attiva</span>
                </div>
                <p className="text-sm text-green-700">
                  L'istanza Odoo permette la creazione di nuovi account. 
                  Sarai reindirizzato alla pagina di registrazione ufficiale di Odoo.
                </p>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full" size="lg">
                  <a href={`${config.url}/web/signup`} target="_blank" rel="noopener noreferrer">
                    🚀 Vai alla Registrazione Odoo
                  </a>
                </Button>
                
                <p className="text-xs text-center text-gray-600">
                  Si aprirà in una nuova scheda la pagina di registrazione ufficiale
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 text-xs mb-1">📋 Dopo la registrazione:</h4>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  <li>• Torna su questa applicazione</li>
                  <li>• Usa le credenziali appena create per il login</li>
                  <li>• Avrai accesso immediato alle funzionalità</li>
                </ul>
              </div>
            </div>
          ) : (
            // Signup not available
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-800 mb-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="font-semibold">📧 Registrazione Amministrata</span>
                </div>
                <p className="text-sm text-orange-700">
                  L'istanza Odoo non permette la registrazione self-service. 
                  Gli account vengono creati solo dall'amministratore.
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">📞 Come ottenere un account:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Contatta l'amministratore del sistema Odoo</li>
                  <li>• Richiedi la creazione di un nuovo utente</li>
                  <li>• Fornisci i tuoi dati e il motivo della richiesta</li>
                  <li>• Attendi l'email con le credenziali</li>
                </ul>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Errore di verifica:</strong> {error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="pt-4 border-t">
            <div className="flex justify-center gap-4 text-sm">
              <Button asChild variant="outline">
                <Link href="/login">
                  ← Torna al Login
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/">
                  🏠 Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Info tecnica */}
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 text-xs mb-1">🔧 Info Tecnica</h4>
            <ul className="text-xs text-purple-700 space-y-0.5">
              <li>• Verifica automatica della configurazione Odoo</li>
              <li>• Controllo real-time della disponibilità signup</li>
              <li>• Aggiornamento ogni 5 minuti in background</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 