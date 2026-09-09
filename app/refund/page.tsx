import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="bg-[#FAF8F5] py-20">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="font-serif text-4xl text-[#264020] mb-6">Refund Policy</h1>
            <div className="prose max-w-none text-[#264020]/80 space-y-4">
              <p>We want you to be satisfied with your purchase. Here is our refund policy for courses and products.</p>
              <h2 className="font-serif text-xl text-[#264020]">Digital Courses</h2>
              <p>Due to the digital nature of our courses, refunds are offered within 7 days of purchase if less than 30% of the course content has been accessed.</p>
              <h2 className="font-serif text-xl text-[#264020]">Physical Products</h2>
              <p>Physical products can be returned within 14 days of delivery in unused condition. Shipping costs for returns are borne by the customer.</p>
              <h2 className="font-serif text-xl text-[#264020]">Workshop Registrations</h2>
              <p>Workshop registrations can be cancelled up to 48 hours before the start time for a full refund. Cancellations within 48 hours are non-refundable.</p>
              <h2 className="font-serif text-xl text-[#264020]">How to Request a Refund</h2>
              <p>Contact us at <a href="mailto:info@srinathayoga.com" className="text-[#264020] underline">info@srinathayoga.com</a> with your order details and reason for refund.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
