import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="bg-[#FAF8F5] py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="font-serif text-4xl text-[#264020] mb-6">Terms of Service</h1>
            <div className="prose max-w-none text-[#264020]/80 space-y-4">
              <p>By using Srinatha Yoga School, you agree to these terms. Please read them carefully.</p>
              <h2 className="font-serif text-xl text-[#264020]">Account Registration</h2>
              <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your login credentials.</p>
              <h2 className="font-serif text-xl text-[#264020]">Course Access</h2>
              <p>Purchased courses grant you lifetime access to the content. Course materials are for personal use only and may not be redistributed.</p>
              <h2 className="font-serif text-xl text-[#264020]">Payments & Refunds</h2>
              <p>All payments are processed securely through Razorpay. Refund requests are handled on a case-by-case basis. See our refund policy for details.</p>
              <h2 className="font-serif text-xl text-[#264020]">Limitation of Liability</h2>
              <p>Srinatha Yoga School is not liable for any injuries sustained during the practice of yoga. Always consult a physician before beginning any exercise program.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
