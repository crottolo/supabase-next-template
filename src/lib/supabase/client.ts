import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your_supabase_project_url' || 
      supabaseAnonKey === 'your_supabase_anon_key') {
    throw new Error(`
🔧 Configurazione Supabase richiesta!

Per utilizzare l'autenticazione, devi configurare le variabili d'ambiente in .env.local:

1. Vai su https://supabase.com e crea un nuovo progetto
2. Nella dashboard del progetto, vai su Settings > API  
3. Copia l'URL del progetto e la chiave anonima
4. Aggiorna il file .env.local con i tuoi valori:

NEXT_PUBLIC_SUPABASE_URL=https://tuoprogetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tua_chiave_anonima
    `)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
} 