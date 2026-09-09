'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError] Root layout error caught:', error)
  }, [error])

  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#FAF8F5] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5E5]">
          <p className="font-serif text-6xl text-[#264020] font-bold mb-3">Srinatha</p>
          <h2 className="text-xl font-semibold text-[#264020] mb-2">Something went wrong</h2>
          <p className="text-[#264020]/70 text-sm mb-6">
            We encountered a temporary issue while loading the application.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="bg-[#264020] hover:bg-[#3a5a30] text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="border border-[#264020] text-[#264020] hover:bg-[#FAF8F5] px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
