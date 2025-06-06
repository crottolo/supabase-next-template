import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🔧 Setup Supabase</h1>
          <p className="text-gray-600">Configura il tuo progetto Supabase per abilitare l'autenticazione</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Crea un progetto Supabase</CardTitle>
            <CardDescription>
              Vai su Supabase e crea un nuovo progetto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>1. Vai su <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></p>
              <p>2. Clicca su "Start your project"</p>
              <p>3. Crea un nuovo progetto e attendi che sia pronto</p>
              <Button asChild className="w-full">
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  Apri Supabase →
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Ottieni le credenziali API</CardTitle>
            <CardDescription>
              Copia URL e chiave anonima dal tuo progetto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>1. Nella dashboard del tuo progetto, vai su <strong>Settings → API</strong></p>
              <p>2. Copia l'<strong>URL</strong> dalla sezione "Project URL"</p>
              <p>3. Copia la <strong>anon key</strong> dalla sezione "Project API keys"</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Importante:</strong> Non condividere mai la "service_role" key! Usa solo la "anon" key.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Configura le variabili d'ambiente</CardTitle>
            <CardDescription>
              Aggiorna il file .env.local con le tue credenziali
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Nel file <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code>, sostituisci i placeholder:</p>
              <div className="bg-gray-50 border rounded-lg p-4">
                <pre className="text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=https://tuoprogetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua_chiave_anonima`}
                </pre>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>✅ Suggerimento:</strong> Dopo aver salvato le modifiche, riavvia il server di sviluppo con <code>pnpm dev</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Testa l'autenticazione</CardTitle>
            <CardDescription>
              Verifica che tutto funzioni correttamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Una volta configurato Supabase:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Vai alla pagina di registrazione</li>
                <li>Crea un nuovo account</li>
                <li>Controlla la tua email per la verifica</li>
                <li>Effettua il login e accedi alla dashboard</li>
              </ol>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/register">Registrati</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Accedi</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔗 Risorse Utili</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://supabase.com/docs/guides/auth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold">📚 Docs Supabase Auth</h3>
                <p className="text-sm text-gray-600">Documentazione ufficiale per l'autenticazione</p>
              </a>
              <a 
                href="https://supabase.com/docs/guides/getting-started/quickstarts/nextjs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold">⚡ Next.js Quickstart</h3>
                <p className="text-sm text-gray-600">Guida rapida per Next.js + Supabase</p>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/">← Torna alla Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 