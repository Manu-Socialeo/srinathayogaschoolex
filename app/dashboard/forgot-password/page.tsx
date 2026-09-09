'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { resetPassword } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-[#264020]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#264020]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h1 className="font-serif text-2xl text-[#264020] mb-2">Check Your Email</h1>
          <p className="text-[#264020]/60 mb-6">We sent a password reset link to <strong>{email}</strong></p>
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
          <h1 className="font-serif text-2xl text-[#264020] text-center mb-2">Reset Password</h1>
          <p className="text-[#264020]/60 text-center mb-8">Enter your email and we'll send you a reset link</p>

          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#264020] hover:bg-[#3a5a30] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/dashboard/login" className="text-[#264020]/60 text-sm hover:text-[#264020]">{'← Back to Login'}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
