import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Header />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-[75vh]">
        <div className="text-center px-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#264020]/10 flex items-center justify-center mx-auto mb-6 text-2xl">
            🧘
          </div>
          <p className="font-serif text-7xl sm:text-8xl text-[#264020] font-bold mb-3 tracking-tight">404</p>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#264020] mb-3">Pathway Not Found</h1>
          <p className="text-[#264020]/70 mb-8 text-sm sm:text-base leading-relaxed">
            The page you are looking for may have moved or no longer exists. Return to your practice or explore our offerings below.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#264020] hover:bg-[#3a5a30] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors shadow-xs"
            >
              Return Home
            </Link>
            <Link
              href="/courses"
              className="border border-[#264020]/20 bg-white hover:bg-[#FAF8F5] text-[#264020] px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              Browse Courses
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
