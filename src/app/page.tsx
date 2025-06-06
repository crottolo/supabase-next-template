import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Benvenuto</CardTitle>
                     <CardDescription>
             Scegli un&apos;opzione per continuare
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full" size="lg">
              Accedi
            </Button>
          </Link>
          <Link href="/register" className="block">
            <Button variant="outline" className="w-full" size="lg">
              Registrati
            </Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button variant="secondary" className="w-full" size="lg">
              Dashboard (Privata)
            </Button>
          </Link>
          <div className="pt-4 border-t">
            <Link href="/setup" className="block">
              <Button variant="ghost" className="w-full" size="sm">
                🔧 Setup Supabase
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
