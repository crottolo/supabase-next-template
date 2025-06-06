'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LogoutButton from "@/components/ui/logout-button"
import { useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

function DashboardPageContent() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [fetchTime, setFetchTime] = useState(0)
  const searchParams = useSearchParams()
  const urlMessage = searchParams.get('message')

  // Gestisci messaggi dalla URL
  useEffect(() => {
    if (urlMessage === 'welcome-new-user') {
      setMessage('🎉 Benvenuto! Il tuo account è stato creato con successo e sei ora loggato.')
    }
  }, [urlMessage])

  // Aggiorna tempo di risposta ogni 2 secondi
  useEffect(() => {
    if (!session) return // Non fare polling se non siamo loggati

    const interval = setInterval(async () => {
      const startTime = Date.now()
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-cache'
        })
        
        if (response.ok) {
          const endTime = Date.now()
          const responseTime = endTime - startTime
          setFetchTime(responseTime)
          console.log(`🔄 Updated response time: ${responseTime}ms`)
        }
      } catch (error) {
        console.error('Response time update failed:', error)
      }
    }, 30000) // Ogni 2 secondi

    return () => clearInterval(interval)
  }, [session])

  // Fetch session data
  useEffect(() => {
    const fetchSession = async () => {
      const startTime = Date.now()
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-cache' // Evita cache problematiche ma non duplicati
        })
        
        if (!response.ok) {
          window.location.href = '/login'
          return
        }
        
        const data = await response.json()
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        console.log('📊 Dashboard session data:', JSON.stringify(data, null, 2))
        console.log(`⚡ API response time: ${responseTime}ms`)
        
        setSession(data)
        setFetchTime(responseTime)
      } catch (error) {
        console.error('Session fetch error:', error)
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    // Evita fetch multipli se già in loading
    if (!loading) return
    
    fetchSession()
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }
  
  const user = session.user
  const partner = session.partner

  // Calcolo durata sessione corretta
  const sessionStartTime = session.sessionInfo?.iat ? session.sessionInfo.iat * 1000 : Date.now()
  const sessionDurationMinutes = Math.floor((Date.now() - sessionStartTime) / 1000 / 60)
  
  const mockData = {
    total_visits: Math.floor(Math.random() * 100) + 1,
    last_activity: new Date().toISOString(),
    cache_hits: Math.floor(Math.random() * 500) + 100,
    performance_score: 95.8,
    session_duration: Math.max(0, sessionDurationMinutes) // Assicura che non sia negativo
  }

  // Usa il tempo di fetch reale
  const responseTime = fetchTime

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">🔗 Odoo Dashboard</h1>
          <LogoutButton />
        </div>

        {/* Welcome Message */}
        {message && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Stats */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">⚡ Connessione Odoo Attiva</CardTitle>
            <CardDescription>
              Dati caricati correttamente dall&apos;integrazione Odoo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{responseTime}ms</div>
                <div className="text-sm text-gray-600">Tempo di Risposta</div>
                <div className="text-xs text-gray-500 mt-1">Caricamento dati dashboard</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">
                  {mockData.session_duration >= 60 
                    ? `${Math.floor(mockData.session_duration / 60)}h ${mockData.session_duration % 60}min`
                    : `${mockData.session_duration}min`
                  }
                </div>
                <div className="text-sm text-gray-600">Durata Sessione</div>
                <div className="text-xs text-gray-500 mt-1">Tempo dall&apos;ultimo login</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User & Partner Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info Card */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl">👤 User Information</CardTitle>
              <CardDescription>
                Account details from Odoo res.users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Login</p>
                    <p className="font-medium">{user.login}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Email</p>
                    <p className="font-medium">{user.email || 'N/A'}</p>
                  </div>
                  {user.active !== undefined && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Stato Account</p>
                      <p className="font-medium">
                        {user.active ? '✅ Attivo' : '❌ Disattivato'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner Info Card */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl">🏢 Partner Information</CardTitle>
              <CardDescription>
                Contact details from Odoo res.partner
              </CardDescription>
            </CardHeader>
            <CardContent>
              {partner ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Name</p>
                      <p className="font-medium">{partner.name}</p>
                    </div>
                    {partner.email && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Email</p>
                        <p className="font-medium">{partner.email}</p>
                      </div>
                    )}
                    {(partner.phone || partner.mobile) && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Phone</p>
                        <p className="font-medium">
                          {partner.phone && partner.mobile 
                            ? `${partner.phone} / ${partner.mobile}`
                            : partner.phone || partner.mobile}
                        </p>
                      </div>
                    )}
                    {(partner.street || partner.city || partner.zip) && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Address</p>
                        <p className="font-medium">
                          {[partner.street, partner.city, partner.zip].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                    {partner.country_id && Array.isArray(partner.country_id) && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Country</p>
                        <p className="font-medium">{partner.country_id[1]}</p>
                      </div>
                    )}
                    {partner.website && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-600">Website</p>
                        <a 
                          href={partner.website.startsWith('http') ? partner.website : `https://${partner.website}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {partner.website}
                        </a>
                      </div>
                    )}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">Type</p>
                      <p className="font-medium">
                        {partner.is_company ? '🏢 Company' : '👤 Individual'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <p className="text-gray-600">No partner data available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    This user doesn&apos;t have associated partner information
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Odoo Integration Info */}
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="text-xl">🔗 Integrazione Odoo</CardTitle>
            <CardDescription>
              Connessione sicura alla tua istanza Odoo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-3">✨ Funzionalità Disponibili</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-indigo-700 space-y-2">
                  <li>🔒 Autenticazione sicura XML-RPC</li>
                  <li>👤 Sincronizzazione dati utente</li>
                  <li>🏢 Informazioni partner complete</li>
                </ul>
                <ul className="text-sm text-indigo-700 space-y-2">
                  <li>🛡️ Protezione route automatica</li>
                  <li>🍪 Cookie sicuri HttpOnly</li>
                  <li>⚡ Sessioni JWT veloci</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  )
}