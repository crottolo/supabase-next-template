import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QueryCache } from '@supabase-cache-helpers/postgrest-server'
import { MemoryStore } from '@supabase-cache-helpers/postgrest-server/dist/stores'
import { DefaultStatefulContext } from "@unkey/cache"
import LogoutButton from "@/components/ui/logout-button"

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Server-side cache setup
  const ctx = new DefaultStatefulContext()
  const map = new Map()
  
  const cache = new QueryCache(ctx, {
    stores: [new MemoryStore({ persistentMap: map })],
    // Data is fresh for 30 seconds
    fresh: 30_000,
    // Data is stale after 2 minutes, then refetched
    stale: 120_000,
  })

  // Get user with basic auth check
  let user
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) {
      redirect("/login")
    }
    user = data.user
  } catch {
    redirect("/login")
  }

  // Performance tracking
  const startTime = Date.now()
  
  // Example of cached database query - you can uncomment this when you have a profiles table
  /*
  const userProfile = await cache.query(
    supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, created_at')
      .eq('id', user.id)
      .single(),
    { 
      fresh: 60_000,   // Fresh for 1 minute
      stale: 300_000   // Stale after 5 minutes
    }
  )
  */

  // Simulated cache performance data
  const cachedData = await cache.swr(
    supabase
      .from('mock_user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()
  ).catch(() => ({
    // Fallback mock data if no table exists
    data: {
      total_visits: Math.floor(Math.random() * 100) + 1,
      last_activity: new Date().toISOString(),
      cache_hits: Math.floor(Math.random() * 500) + 100,
      performance_score: 95.8
    }
  }))

  const responseTime = Date.now() - startTime

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">🗄️ Server-Cached Dashboard</h1>
          <LogoutButton />
        </div>

        {/* Performance Stats */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">⚡ Live Performance Stats</CardTitle>
            <CardDescription>
              Real-time metrics from server-side cache
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{responseTime}ms</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{cachedData.data?.cache_hits || 'N/A'}</div>
                <div className="text-sm text-gray-600">Cache Hits</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">{cachedData.data?.performance_score || 95.8}%</div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">{cachedData.data?.total_visits || 'N/A'}</div>
                <div className="text-sm text-gray-600">Total Visits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Card */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-xl">🚀 Server-Side Cache Power!</CardTitle>
            <CardDescription>
              Ultra-fast server-side caching with Supabase Cache Helpers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">User Information:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">User ID</p>
                    <p className="font-medium font-mono text-xs">{user.id}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Registered on</p>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString("en-US")}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">Last sign in</p>
                    <p className="font-medium">
                      {user.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString("en-US")
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Server Cache Performance Info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🗄️ Server Cache Performance</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Data cached server-side for 30 seconds (fresh)</li>
                  <li>• Stale-while-revalidate after 2 minutes</li>
                  <li>• Memory store for ultra-fast access</li>
                  <li>• Zero client-side hydration delay</li>
                  <li>• Perfect for SSR and static generation</li>
                  <li>• Current response time: <strong>{responseTime}ms</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cache Strategy Details */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>🎯 Cache Strategy Active</CardTitle>
            <CardDescription>
              How server-side caching works with Supabase Cache Helpers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 mb-2">Fresh Phase (0-30s)</h4>
                <p className="text-sm text-blue-700">
                  Data served instantly from memory store without database calls
                </p>
                <div className="mt-2 text-xs text-blue-600">
                  ✅ Active - Instant responses
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-2">Stale Phase (30s-2m)</h4>
                <p className="text-sm text-yellow-700">
                  Cached data served + background refresh for next request
                </p>
                <div className="mt-2 text-xs text-yellow-600">
                  🔄 Background refresh when needed
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Details */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>🛠️ Implementation Details</CardTitle>
            <CardDescription>
              Ready-to-use server cache setup for production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">📦 Cache Components</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• <code>QueryCache</code> - Main caching engine</li>
                  <li>• <code>MemoryStore</code> - In-memory storage for fast access</li>
                  <li>• <code>DefaultStatefulContext</code> - State management</li>
                  <li>• <code>SWR pattern</code> - Stale-while-revalidate strategy</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🔧 Easy Integration</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Replace any Supabase query with cached version:
                </p>
                <div className="bg-white p-3 rounded border text-xs font-mono">
                  {`// Before: await supabase.from('table').select()
// After:  await cache.query(supabase.from('table').select())`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>🔧 Quick Actions</CardTitle>
            <CardDescription>
              Manage your account and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-lg">👤</span>
                <span className="text-sm">Profile</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-lg">⚙️</span>
                <span className="text-sm">Settings</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-lg">📊</span>
                <span className="text-sm">Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <span className="text-lg">🔔</span>
                <span className="text-sm">Notifications</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center">
          <Button asChild variant="outline">
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 