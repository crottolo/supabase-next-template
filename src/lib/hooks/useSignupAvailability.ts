'use client'

import { useState, useEffect, useCallback } from 'react'

interface SignupStatus {
  available: boolean
  loading: boolean
  error: string | null
  lastChecked: Date | null
  config: {
    url: string | null
    db: string | null
  }
}

interface SignupCheckResponse {
  available: boolean
  lastChecked: string
  error: string | null
  config: {
    url: string | null
    db: string | null
  }
}

export function useSignupAvailability(checkInterval: number = 5 * 60 * 1000) { // Default: 5 minuti
  const [status, setStatus] = useState<SignupStatus>({
    available: false,
    loading: true,
    error: null,
    lastChecked: null,
    config: {
      url: null,
      db: null
    }
  })

  const checkSignupAvailability = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }))

      const response = await fetch('/api/auth/signup-check', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: SignupCheckResponse = await response.json()

      setStatus({
        available: data.available,
        loading: false,
        error: data.error,
        lastChecked: new Date(data.lastChecked),
        config: data.config
      })

      console.log(`🔄 Signup availability check completed: ${data.available ? 'Available' : 'Not available'}`)

    } catch (error) {
      console.error('❌ Signup availability check failed:', error)
      
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    }
  }, [])

  // Effect per il check iniziale
  useEffect(() => {
    checkSignupAvailability()
  }, [checkSignupAvailability])

  // Effect per il background check periodico
  useEffect(() => {
    if (checkInterval <= 0) return

    const interval = setInterval(() => {
      checkSignupAvailability()
    }, checkInterval)

    return () => clearInterval(interval)
  }, [checkSignupAvailability, checkInterval])

  return {
    ...status,
    refresh: checkSignupAvailability
  }
} 