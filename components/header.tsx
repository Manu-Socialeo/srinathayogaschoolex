"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Menu, X, Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Courses", href: "/courses" },
  { name: "Teachers", href: "/teachers" },
  { name: "Contact", href: "/contact" },
  { name: "Shop", href: "/shop" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-sm" : "glass"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Srinatha Yoga School"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <span className="font-serif text-xl font-semibold text-[#264020]">
              Srinatha Yoga School
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  pathname === item.href
                    ? "text-[#264020]"
                    : "text-[#264020]/60 hover:text-[#264020]"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/search" className="p-2 text-[#264020]/60 hover:text-[#264020] transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 text-[#264020]/60 hover:text-[#264020] transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <Link href="/dashboard/login">
              <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white px-6">
                Student Login
              </Button>
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#264020]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

        {isMenuOpen && (
          <div className="animate-fade-in-up md:hidden glass border-t">
            <nav className="flex flex-col p-4 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium py-2 ${
                    pathname === item.href
                      ? "text-[#264020]"
                      : "text-[#264020]/60"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-2">
                <Link href="/search" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-xl py-3 text-[#264020]/60 hover:text-[#264020]">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Search</span>
                  </div>
                </Link>
                <Link href="/cart" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center justify-center gap-2 border border-[#E5E5E5] rounded-xl py-3 text-[#264020]/60 hover:text-[#264020]">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-sm">Cart</span>
                  </div>
                </Link>
              </div>
              <Link href="/dashboard/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white w-full">
                  Student Login
                </Button>
              </Link>
            </nav>
          </div>
        )}
      
    </header>
  )
}
