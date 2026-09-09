import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="bg-[#FAF8F5] py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="font-serif text-4xl text-[#264020] mb-6">Privacy Policy</h1>
            <div className="prose max-w-none text-[#264020]/80 space-y-4">
              <p>Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.</p>
              <h2 className="font-serif text-xl text-[#264020]">Information We Collect</h2>
              <p>We collect information you provide when creating an account, making a purchase, or contacting us — including your name, email address, phone number, and shipping address.</p>
              <h2 className="font-serif text-xl text-[#264020]">How We Use Your Information</h2>
              <p>We use your information to process orders, deliver course access, send updates about your learning, and improve our services.</p>
              <h2 className="font-serif text-xl text-[#264020]">Data Security</h2>
              <p>Your data is stored securely on Supabase with row-level security. We do not share your personal information with third parties except as necessary to process payments (Razorpay/Stripe).</p>
              <h2 className="font-serif text-xl text-[#264020]">Contact</h2>
              <p>For privacy-related inquiries, contact us at <a href="mailto:info@srinathayoga.com" className="text-[#264020] underline">info@srinathayoga.com</a>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
