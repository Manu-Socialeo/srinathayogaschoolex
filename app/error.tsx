'use client'

import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 flex items-center justify-center min-h-[70vh]">
        <div className="text-center px-4">
          <p className="font-serif text-8xl text-[#264020] font-bold mb-4">500</p>
          <h1 className="font-serif text-2xl text-[#264020] mb-2">Something Went Wrong</h1>
          <p className="text-[#264020]/60 mb-8 max-w-md">An unexpected error occurred. Please try again.</p>
          <div className="flex gap-4 justify-center">
            <button onClick={reset} className="bg-[#264020] hover:bg-[#3a5a30] text-white px-8 py-3 rounded-xl font-medium transition-colors">
              Try Again
            </button>
            <Link href="/" className="border border-[#264020] text-[#264020] hover:bg-[#264020] hover:text-white px-8 py-3 rounded-xl font-medium transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
