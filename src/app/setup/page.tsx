import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🔧 Setup Supabase</h1>
          <p className="text-gray-600">Configure your Supabase project to enable authentication</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Create a Supabase project</CardTitle>
            <CardDescription>
              Go to Supabase and create a new project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>1. Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a></p>
              <p>2. Click on &quot;Start your project&quot;</p>
              <p>3. Create a new project and wait for it to be ready</p>
              <Button asChild className="w-full">
                <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                  Open Supabase →
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Get API credentials</CardTitle>
            <CardDescription>
              Copy URL and anonymous key from your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>1. In your project dashboard, go to <strong>Settings → API</strong></p>
              <p>2. Copy the <strong>URL</strong> from the &quot;Project URL&quot; section</p>
              <p>3. Copy the <strong>anon key</strong> from the &quot;Project API keys&quot; section</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Never share the &quot;service_role&quot; key! Use only the &quot;anon&quot; key.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Configure environment variables</CardTitle>
            <CardDescription>
              Update the .env.local file with your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>In the <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file, replace the placeholders:</p>
              <div className="bg-gray-50 border rounded-lg p-4">
                <pre className="text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anonymous_key`}
                </pre>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>✅ Tip:</strong> After saving the changes, restart the development server with <code>pnpm dev</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Test authentication</CardTitle>
            <CardDescription>
              Verify that everything works correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Once Supabase is configured:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to the registration page</li>
                <li>Create a new account</li>
                <li>Check your email for verification</li>
                <li>Log in and access the dashboard</li>
              </ol>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔗 Useful Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                href="https://supabase.com/docs/guides/auth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold">📚 Supabase Auth Docs</h3>
                <p className="text-sm text-gray-600">Official documentation for authentication</p>
              </a>
              <a 
                href="https://supabase.com/docs/guides/getting-started/quickstarts/nextjs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold">⚡ Next.js Quickstart</h3>
                <p className="text-sm text-gray-600">Quick guide for Next.js + Supabase</p>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 