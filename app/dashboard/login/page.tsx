'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmail, signInWithOtp } from '@/lib/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signInWithEmail(email, password)
      try { const { default: posthog } = await import('posthog-js'); posthog.capture('login', { method: 'email' }) } catch {}
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) { setError("Enter your email first"); return }
    setLoading(true)
    setError("")
    try {
      await signInWithOtp(email)
      try { const { default: posthog } = await import('posthog-js'); posthog.capture('magic_link_sent') } catch {}
      setMagicSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send magic link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-8">
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <Image src="/images/logo.png" alt="Srinatha Yoga School" width={48} height={48} className="h-12 w-auto" />
            <span className="font-serif text-xl font-semibold text-[#264020]">Srinatha Yoga School</span>
          </Link>

          <h1 className="font-serif text-2xl text-[#264020] text-center mb-2">Welcome Back</h1>
          <p className="text-[#264020]/60 text-center mb-8">Login to continue your yoga journey</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
              />
            </div>

              <div className="flex items-center justify-between">
                <div />
                <Link href="/dashboard/forgot-password" className="text-sm text-[#264020] hover:underline">Forgot password?</Link>
              </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#264020] hover:bg-[#3a5a30] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E5E5]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#264020]/60">Or login without password</span>
              </div>
            </div>

            {magicSent ? (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-sm text-center">
                Magic link sent! Check your email inbox.
              </div>
            ) : (
              <button
                onClick={handleMagicLink}
                disabled={loading || !email}
                className="w-full mt-4 flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-xl py-3 text-[#264020] hover:bg-[#FAF8F5] transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#264020]/60 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/dashboard/signup" className="text-[#264020] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E5E5] text-center">
            <Link href="/" className="text-[#264020]/60 text-sm hover:text-[#264020]">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#264020] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
