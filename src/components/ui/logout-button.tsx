"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Props interface for the logout button component
interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function LogoutButton({ 
  variant = "outline", 
  size = "default",
  className 
}: LogoutButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // Chiama l'API di logout Odoo
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        // Redirect alla home page dopo il logout
        window.location.href = "/"
      } else {
        console.error('Logout failed')
        // Fallback: redirect comunque
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: redirect comunque
      router.push("/")
      router.refresh()
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleSignOut}
    >
      Logout
    </Button>
  )
} 