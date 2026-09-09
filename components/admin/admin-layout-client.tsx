'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  ExternalLink,
  GraduationCap,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { signOut } from '@/lib/auth'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Don't render admin chrome on login / reset password pages inside dashboard
  if (pathname === '/dashboard/login' || pathname === '/dashboard/forgot-password' || pathname === '/dashboard/reset-password') {
    return <>{children}</>
  }

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Layers },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  ]

  const handleLogout = async () => {
    await signOut().catch(() => {})
    router.push('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F9F6] flex">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#1F361A] text-white flex flex-col transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center p-1">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="h-8 w-auto" />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-wide block leading-tight">Srinatha</span>
              <span className="text-[11px] text-[#A8C7A0] tracking-wider uppercase font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin Dashboard
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
            Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white shadow-xs font-semibold'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#8AD679]' : 'text-white/60'}`} />
                {item.name}
              </Link>
            )
          })}

          {/* Quick Portals Switch */}
          <div className="pt-6 mt-6 border-t border-white/10">
            <p className="px-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">
              Cross Navigation
            </p>
            <Link
              href="/app"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-[#A8C7A0]" />
              Student App
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#A8C7A0]" />
              View Public Website
            </Link>
          </div>
        </div>

        {/* User / Sign Out Footer */}
        <div className="p-4 border-t border-white/10 bg-black/10 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-white truncate">{profile?.name || user?.email || 'Admin User'}</p>
            <p className="text-[11px] text-white/50 truncate">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 text-white/60 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-16 bg-white border-b border-[#E5E5E5] px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-[#264020] hover:bg-[#FAF8F5] rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-serif font-semibold text-[#264020]">Admin Dashboard</span>
          </div>
          <Link
            href="/app"
            className="text-xs font-medium text-[#264020] bg-[#264020]/10 px-3 py-1.5 rounded-lg hover:bg-[#264020]/20 transition-colors"
          >
            Web App
          </Link>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
