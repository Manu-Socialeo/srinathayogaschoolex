'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { createBrowserClient } from '@/lib/supabase'

function ResetForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      const params = new URLSearchParams(hash.replace('#', '?'))
      const accessToken = params.get('access_token')
      if (accessToken) {
        const sb = createBrowserClient()
        sb.auth.setSession({ access_token: accessToken, refresh_token: '' })
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const sb = createBrowserClient()
      const { error } = await sb.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => router.push('/dashboard/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <h1 className="font-serif text-2xl text-[#264020] mb-2">Password Updated</h1>
          <p className="text-[#264020]/60">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 max-w-md w-full">
        <h1 className="font-serif text-2xl text-[#264020] text-center mb-2">Set New Password</h1>
        <p className="text-[#264020]/60 text-center mb-8">Enter your new password below</p>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#264020] hover:bg-[#3a5a30] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center"><p className="text-[#264020]/60">Loading...</p></div>}>
      <ResetForm />
    </Suspense>
  )
}
