import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your_supabase_project_url' || 
      supabaseAnonKey === 'your_supabase_anon_key') {
    throw new Error(`
🔧 Supabase configuration required!

To use authentication, you need to configure environment variables in .env.local:

1. Go to https://supabase.com and create a new project
2. In the project dashboard, go to Settings > API  
3. Copy the project URL and anonymous key
4. Update the .env.local file with your values:

NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anonymous_key
    `)
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
} 