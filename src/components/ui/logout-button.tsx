"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
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
  const supabase = createClient()

  const handleSignOut = async () => {
    // Sign out the user and redirect to home page
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
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