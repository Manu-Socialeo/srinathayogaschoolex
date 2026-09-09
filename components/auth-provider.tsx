'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import { getCurrentUser, getCurrentProfile } from '@/lib/auth'
import type { Profile } from '@/lib/supabase-types'

interface AuthState {
  user: { id: string; email: string } | null
  profile: Profile | null
  loading: boolean
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  refresh: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    const u = await getCurrentUser()
    setUser(u ? { id: u.id, email: u.email ?? '' } : null)
    if (u) {
      const p = await getCurrentProfile()
      setProfile(p)
    } else {
      setProfile(null)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('code')
      if (code && !window.location.pathname.startsWith('/auth/callback')) {
        const next = window.location.pathname.startsWith('/dashboard') ? '/dashboard' : '/app'
        window.location.href = `/auth/callback?code=${encodeURIComponent(code)}&next=${next}`
        return
      }
    }

    try {
      refresh().catch(() => {}).finally(() => setLoading(false))

      const supabase = createBrowserClient()
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          refresh().catch(() => {})
          if (typeof window !== 'undefined') {
            const path = window.location.pathname
            const hasAuthTokens = window.location.search.includes('code') || window.location.hash.includes('access_token')
            if (path === '/app/login' || (path === '/' && hasAuthTokens)) {
              window.location.href = '/app'
            } else if (path === '/dashboard/login') {
              window.location.href = '/dashboard'
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      })

      return () => data?.subscription?.unsubscribe()
    } catch (err) {
      console.warn('[AuthProvider] Auth listener setup failed:', err)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
