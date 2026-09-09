"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !email || !message) return
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, subject, message }),
      })
      if (!res.ok) throw new Error('Server error')
      setSent(true)
      setFirstName("")
      setLastName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Failed to send. Please try again later.')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        <section className="bg-[#FAF8F5] py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl lg:text-5xl text-[#264020] mb-4">Get in Touch</h1>
              <p className="text-[#264020]/70 max-w-2xl mx-auto text-lg">
                We&apos;d love to hear from you. Reach out with questions about our programs, 
                partnerships, or anything else.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="animate-fade-in-up space-y-8">
                <h2 className="font-serif text-2xl text-[#264020]">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#264020]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#264020] mb-1">Email</h3>
                      <a href="mailto:info@srinathayoga.com" className="text-[#264020]/70 hover:text-[#264020]">
                        info@srinathayoga.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#264020]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#264020] mb-1">Phone</h3>
                      <a href="tel:+919886512083" className="text-[#264020]/70 hover:text-[#264020]">
                        +91 98865 12083
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#264020]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#264020] mb-1">Address</h3>
                      <p className="text-[#264020]/70">
                        Srinatha Yoga School<br />
                        Mysuru, Karnataka, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-[#264020]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#264020] mb-1">Office Hours</h3>
                      <p className="text-[#264020]/70">
                        Monday - Saturday: 9:00 AM - 6:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="animate-fade-in-up bg-[#FAF8F5] rounded-2xl p-8">
                <h2 className="font-serif text-2xl text-[#264020] mb-6">Send a Message</h2>
                {sent ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-[#264020] mx-auto mb-4" />
                    <h3 className="font-serif text-xl text-[#264020] mb-2">Message Sent!</h3>
                    <p className="text-[#264020]/60 mb-6">We&apos;ll get back to you soon.</p>
                    <Button
                      onClick={() => setSent(false)}
                      className="bg-[#264020] hover:bg-[#3a5a30] text-white"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                      <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>
                    )}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#264020] mb-2">First Name *</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#264020] mb-2">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#264020] mb-2">Email *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#264020] mb-2">Subject</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#264020] mb-2">Message *</label>
                      <textarea
                        rows={5}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020] resize-none"
                        placeholder="Your message..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={sending}
                      className="bg-[#264020] hover:bg-[#3a5a30] text-white w-full disabled:opacity-50"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {sending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
