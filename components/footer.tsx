"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Mail, MapPin, Phone, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const footerLinks = {
  main: [
    { name: "About Us", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Teachers", href: "/teachers" },
    { name: "Contact Us", href: "/contact" },
  ],
  secondary: [
    { name: "Meet The Team", href: "/teachers" },
    { name: "Shop", href: "/shop" },
    { name: "Student Login", href: "/dashboard/login" },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (!email) return
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="bg-white border-t border-[#E5E5E5] glass">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/images/logo.png"
                alt="Srinatha Yoga School"
                width={48}
                height={48}
              />
              <span className="font-serif text-xl text-[#264020] font-semibold">
                Srinatha Yoga School
              </span>
            </Link>
            <p className="text-[#264020]/60 text-sm leading-relaxed mb-6">
              Traditional Mysore Yoga, taught online for the modern world. 
              Experience authentic yogic wisdom from certified masters.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/yogawithsrinatha/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[#264020] hover:bg-[#264020] hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/yogawithsrinath/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#FAF8F5] rounded-full flex items-center justify-center text-[#264020] hover:bg-[#264020] hover:text-white transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-[#264020] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.main.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#264020]/60 hover:text-[#264020] text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-serif text-[#264020] font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.secondary.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#264020]/60 hover:text-[#264020] text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="font-serif text-[#264020] font-semibold mb-4">Stay Connected</h4>
            <p className="text-[#264020]/60 text-sm mb-4">
              Subscribe to receive updates on new courses and yogic wisdom.
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-[#264020]"
              />
              <Button onClick={handleSubscribe} disabled={subscribed} className="bg-[#264020] hover:bg-[#3a5a30] text-white px-4">
                {subscribed ? <Check size={16} /> : <Mail size={16} />}
              </Button>
            </div>
            {subscribed && <p className="text-green-600 text-xs -mt-4 mb-4">Thanks for subscribing!</p>}
            
            <div className="space-y-3 text-sm text-[#264020]/60">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0" />
                <span>Mysore, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                <span>+91 98865 12083</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#264020]/60">
              &copy; 2026 Srinatha Yoga School. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-sm text-[#264020]/60">
              <Link href="/privacy" className="hover:text-[#264020] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-[#264020] transition-colors">
                Terms of Use
              </Link>
              <Link href="/refund" className="hover:text-[#264020] transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
