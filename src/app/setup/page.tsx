import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🔧 Setup Odoo Integration</h1>
          <p className="text-gray-600">Configure your Odoo connection to enable authentication</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Configure Environment Variables</CardTitle>
            <CardDescription>
              Set up your Odoo connection parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Required Environment Variables</h4>
              <p className="text-sm text-blue-700 mb-3">
                Create or update your <code className="bg-white px-2 py-1 rounded text-xs">.env.local</code> file:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
{`NEXT_PUBLIC_ODOO_URL=https://your-odoo-instance.com
NEXT_PUBLIC_ODOO_DB=your-database-name
JWT_SECRET=your-super-secret-jwt-key`}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Odoo Instance Requirements</CardTitle>
            <CardDescription>
              Ensure your Odoo instance is properly configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-green-800 mb-2">✅ XML-RPC Enabled</h4>
                <p className="text-sm text-green-700">
                  Your Odoo instance must have XML-RPC API enabled (default for most installations)
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-yellow-50">
                <h4 className="font-semibold text-yellow-800 mb-2">👤 User Access</h4>
                <p className="text-sm text-yellow-700">
                  Users need valid Odoo accounts with appropriate permissions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Configuration Details</CardTitle>
            <CardDescription>
              Detailed explanation of each environment variable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">NEXT_PUBLIC_ODOO_URL</h4>
                <p className="text-sm text-gray-600">
                  The complete URL of your Odoo instance (e.g., https://mycompany.odoo.com)
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">NEXT_PUBLIC_ODOO_DB</h4>
                <p className="text-sm text-gray-600">
                  The database name of your Odoo instance (usually your company name)
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">JWT_SECRET</h4>
                <p className="text-sm text-gray-600">
                  A secret key for signing JWT tokens (generate a strong random string)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Test Your Configuration</CardTitle>
            <CardDescription>
              Verify that everything is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">Once Odoo is configured:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild size="lg" className="h-auto p-4 flex flex-col gap-2">
                  <Link href="/login">
                    <span className="text-lg">🔑</span>
                    <span>Test Login</span>
                    <span className="text-xs opacity-75">Try logging in with Odoo credentials</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-auto p-4 flex flex-col gap-2">
                  <Link href="/dashboard">
                    <span className="text-lg">📊</span>
                    <span>View Dashboard</span>
                    <span className="text-xs opacity-75">Access protected content</span>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📚 Additional Resources</CardTitle>
            <CardDescription>
              Helpful links and documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a 
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                href="https://www.odoo.com/documentation/17.0/developer/reference/external_api.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="font-semibold">🔗 Odoo External API</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Official documentation for Odoo&apos;s external API
                </p>
              </a>
              <a 
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                href="https://github.com/iraycd/odoo-xmlrpc-ts"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="font-semibold">📦 odoo-xmlrpc-ts</h3>
                <p className="text-sm text-gray-600 mt-1">
                  TypeScript library used for Odoo integration
                </p>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">🔒 Security Notes</CardTitle>
            <CardDescription>
              Important security considerations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• Never commit your <code>.env.local</code> file to version control</li>
              <li>• Use strong, randomly generated JWT secrets in production</li>
              <li>• Ensure your Odoo instance uses HTTPS in production</li>
              <li>• Regularly rotate your JWT secret for enhanced security</li>
              <li>• Consider using environment-specific configurations</li>
            </ul>
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