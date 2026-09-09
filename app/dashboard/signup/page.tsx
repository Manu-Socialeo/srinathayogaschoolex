'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signUpWithEmail, updateProfile } from '@/lib/auth'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signUpWithEmail(email, password, name)
      await updateProfile({ password_set: true }).catch(() => {})
      try { const { default: posthog } = await import('posthog-js'); posthog.capture('signup') } catch {}
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-[#264020]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#264020]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="font-serif text-2xl text-[#264020] mb-2">Check Your Email</h1>
          <p className="text-[#264020]/60 mb-6">We sent a confirmation link to <strong>{email}</strong>. Please click it to activate your account.</p>
          <Link href="/dashboard/login"><button className="text-[#264020] font-medium hover:underline">Back to Login</button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <Image src="/images/logo.png" alt="Srinatha Yoga School" width={48} height={48} className="h-12 w-auto" />
            <span className="font-serif text-xl font-semibold text-[#264020]">Srinatha Yoga School</span>
          </Link>
          <h1 className="font-serif text-2xl text-[#264020] text-center mb-2">Create Account</h1>
          <p className="text-[#264020]/60 text-center mb-8">Begin your yoga journey</p>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#264020] hover:bg-[#3a5a30] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#264020]/60 text-sm">Already have an account?{' '}
              <Link href="/dashboard/login" className="text-[#264020] font-medium hover:underline">Log in</Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E5E5] text-center">
            <Link href="/" className="text-[#264020]/60 text-sm hover:text-[#264020]">{'← Back to Home'}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
