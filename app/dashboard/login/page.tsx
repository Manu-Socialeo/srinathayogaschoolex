'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signInWithEmail, signInWithOtp } from '@/lib/auth'

function AdminLoginForm() {
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
    setError('')
    try {
      await signInWithEmail(email, password)
      router.push(redirect)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setError('Please enter your admin email address first.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://srinathayogaschoolex.vercel.app'
      await signInWithOtp(email.trim(), `${baseUrl}/auth/callback?next=/dashboard`)
      setMagicSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send admin magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1F361A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#264020]/10 flex items-center justify-center mx-auto mb-4 p-2">
              <Image src="/images/logo.png" alt="Srinatha Logo" width={48} height={48} className="h-10 w-auto" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#264020]/10 text-[#264020] mb-2">
              <Shield className="w-3.5 h-3.5" /> Administrator Access
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Admin Dashboard</h1>
            <p className="text-[#264020]/60 text-xs mt-1">Sign in to manage catalog, inventory, and products</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl mb-6 leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#264020]/80 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#264020]/40" />
                <input
                  type="email"
                  required
                  placeholder="admin@srinathayogaschool.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#264020]/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#264020]/40" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#264020] hover:bg-[#3a5a30] text-white py-3 rounded-xl font-medium mt-2 shadow-xs transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In with Password'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E5E5]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-[#264020]/60 uppercase tracking-wider font-semibold">Or sign in with email link</span>
              </div>
            </div>

            {magicSent ? (
              <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl text-xs text-center border border-green-200">
                ✨ Admin login link sent! Please check your email inbox.
              </div>
            ) : (
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading || !email}
                className="w-full mt-4 flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-xl py-2.5 text-xs font-semibold text-[#264020] hover:bg-[#FAF8F5] transition-colors disabled:opacity-50"
              >
                <Mail className="w-4 h-4" />
                {loading ? 'Sending link...' : 'Send Magic Link to Email'}
              </button>
            )}
          </div>

          {/* Cross portal links */}
          <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex flex-col gap-2.5 text-center text-xs text-[#264020]/70">
            <Link href="/app/login" className="hover:text-[#264020] font-medium transition-colors">
              Looking for student portal? <span className="underline">Go to Student Web App</span>
            </Link>
            <Link href="/" className="hover:text-[#264020] inline-flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Main Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F361A] flex items-center justify-center text-white text-sm">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}
