import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 flex items-center justify-center min-h-[70vh]">
        <div className="text-center px-4">
          <p className="font-serif text-8xl text-[#264020] font-bold mb-4">404</p>
          <h1 className="font-serif text-2xl text-[#264020] mb-2">Page Not Found</h1>
          <p className="text-[#264020]/60 mb-8 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link href="/" className="inline-block bg-[#264020] hover:bg-[#3a5a30] text-white px-8 py-3 rounded-xl font-medium transition-colors">
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
