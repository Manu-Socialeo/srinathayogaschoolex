'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Header />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[75vh]">
        <div className="text-center px-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#264020]/10 flex items-center justify-center mx-auto mb-6 text-2xl">
            🌿
          </div>
          <p className="font-serif text-7xl sm:text-8xl text-[#264020] font-bold mb-3 tracking-tight">500</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#264020] mb-3">Something Went Unexpectedly</h1>
          <p className="text-[#264020]/70 mb-8 text-sm sm:text-base leading-relaxed">
            A temporary disturbance occurred. Take a deep breath and try reloading the page, or return to the sanctuary.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={reset}
              className="bg-[#264020] hover:bg-[#3a5a30] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors shadow-xs"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="border border-[#264020]/20 bg-white hover:bg-[#FAF8F5] text-[#264020] px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/app"
              className="border border-[#264020]/20 bg-white hover:bg-[#FAF8F5] text-[#264020] px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              Student App
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
