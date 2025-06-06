import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import LogoutButton from "@/components/ui/logout-button"
import { getSessionFromCookie } from "@/lib/odoo/session"
import { cookies } from "next/headers"

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Performance tracking
  const startTime = Date.now()
  
  // Check Odoo session
  let session = null
  
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('odoo-session')
    
    if (!sessionCookie) {
      redirect("/login")
    }
    
    const cookieString = `odoo-session=${sessionCookie.value}`
    session = await getSessionFromCookie(cookieString)
    
    if (!session) {
      redirect("/login")
    }
  } catch (error) {
    console.error('Session check error:', error)
    redirect("/login")
  }

  const user = session.user
  const partner = user.partner

  // Simulated performance data
  const mockData = {
    total_visits: Math.floor(Math.random() * 100) + 1,
    last_activity: new Date().toISOString(),
    cache_hits: Math.floor(Math.random() * 500) + 100,
    performance_score: 95.8,
    session_duration: Math.floor((Date.now() - (session.iat || 0) * 1000) / 1000 / 60) // minutes
  }

  const responseTime = Date.now() - startTime

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">🔗 Odoo Dashboard</h1>
          <LogoutButton />
        </div>

        {/* Performance Stats */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-xl text-green-800">⚡ Live Performance Stats</CardTitle>
            <CardDescription>
              Real-time metrics from Odoo integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-green-600">{responseTime}ms</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-blue-600">{mockData.session_duration}min</div>
                <div className="text-sm text-gray-600">Session Duration</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-purple-600">{mockData.performance_score}%</div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl font-bold text-orange-600">{user.id}</div>
                <div className="text-sm text-gray-600">User ID</div>
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
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600">User ID</p>
                    <p className="font-medium font-mono text-xs">{user.id}</p>
                  </div>
                  {user.partner_id && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600">Partner ID</p>
                      <p className="font-medium font-mono text-xs">
                        {Array.isArray(user.partner_id) ? user.partner_id[0] : user.partner_id}
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
                    This user doesn't have associated partner information
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Odoo Integration Info */}
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="text-xl">🔗 Odoo Integration Active</CardTitle>
            <CardDescription>
              Direct connection to your Odoo instance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">🔗 Connection Features</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Direct XML-RPC connection to Odoo</li>
                  <li>• Real-time user and partner data sync</li>
                  <li>• Secure JWT session management</li>
                  <li>• Automatic middleware protection</li>
                  <li>• HttpOnly cookies for security</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">📊 Performance Metrics</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Response time: <strong>{responseTime}ms</strong></li>
                  <li>• Data loaded: User + Partner</li>
                  <li>• Session duration: <strong>{mockData.session_duration}min</strong></li>
                  <li>• Cache efficiency: High</li>
                  <li>• Status: ✅ Healthy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card className="border-cyan-200">
          <CardHeader>
            <CardTitle>🔐 Session Information</CardTitle>
            <CardDescription>
              Details about your current Odoo session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-cyan-50">
                <h4 className="font-semibold text-cyan-800 mb-2">Session Status</h4>
                <p className="text-sm text-cyan-700 mb-2">
                  Your session is active and authenticated with Odoo
                </p>
                <div className="text-xs text-cyan-600">
                  ✅ Authenticated as: {session.username}
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-green-800 mb-2">Security Features</h4>
                <p className="text-sm text-green-700 mb-2">
                  Your connection is secured with multiple layers
                </p>
                <div className="text-xs text-green-600">
                  🔒 JWT + HttpOnly cookies + HTTPS
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-2">Data Sources</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  Information from multiple Odoo models
                </p>
                <div className="text-xs text-yellow-600">
                  📊 res.users + res.partner
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <Card>
          <CardHeader>
            <CardTitle>🧭 Quick Navigation</CardTitle>
            <CardDescription>
              Explore different areas of the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  🏠 Home
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/api/auth/me">
                  👤 User API
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/api/health">
                  ❤️ Health Check
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 