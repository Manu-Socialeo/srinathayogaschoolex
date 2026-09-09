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
  BookOpen,
  Users,
  MessageSquare,
  Megaphone,
  BarChart3,
  History,
  FileSpreadsheet,
  User,
  Key,
  Image as ImageIcon,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { signOut } from '@/lib/auth'

interface NavSection {
  label: string
  items: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Core',
    items: [
      { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { name: 'Courses', href: '/dashboard/courses', icon: BookOpen },
      { name: 'Workshops', href: '/dashboard/workshops', icon: GraduationCap },
      { name: 'Products', href: '/dashboard/products', icon: Package },
      { name: 'Teachers', href: '/dashboard/teachers', icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
      { name: 'Inventory', href: '/dashboard/inventory', icon: Layers },
      { name: 'Students', href: '/dashboard/users', icon: User },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
      { name: 'Banners', href: '/dashboard/banners', icon: ImageIcon },
      { name: 'Leads / CRM', href: '/dashboard/leads', icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Media Library', href: '/dashboard/media', icon: ImageIcon },
      { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: History },
      { name: 'Data Export', href: '/dashboard/export', icon: FileSpreadsheet },
      { name: 'Profile', href: '/dashboard/profile', icon: Key },
    ],
  },
]

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Don't render admin chrome on auth pages
  if (
    pathname === '/dashboard/login' ||
    pathname === '/dashboard/forgot-password' ||
    pathname === '/dashboard/reset-password'
  ) {
    return <>{children}</>
  }

  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const handleLogout = async () => {
    await signOut().catch(() => {})
    router.push('/dashboard/login')
  }

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

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
                <ShieldCheck className="w-3 h-3" /> Admin Panel
              </span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {NAV_SECTIONS.map((section) => {
            const collapsed = collapsedSections.has(section.label)
            return (
              <div key={section.label} className="mb-2">
                <button
                  onClick={() => toggleSection(section.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors"
                >
                  {section.label}
                  <ChevronRight
                    className={`w-3 h-3 transition-transform ${collapsed ? '' : 'rotate-90'}`}
                  />
                </button>

                {!collapsed && (
                  <div className="space-y-0.5 mt-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            active
                              ? 'bg-white/15 text-white font-semibold'
                              : 'text-white/65 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#8AD679]' : 'text-white/50'}`} />
                          <span className="truncate">{item.name}</span>
                          {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8AD679]" />}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {/* Cross Navigation */}
          <div className="pt-4 mt-4 border-t border-white/10">
            <p className="px-3 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Portals</p>
            <Link
              href="/app"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/65 hover:bg-white/10 hover:text-white transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-[#A8C7A0]" />
              Student App
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/65 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#A8C7A0]" />
              Public Website
            </Link>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 bg-black/10 flex items-center justify-between">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-white truncate">{profile?.name || user?.email || 'Admin'}</p>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-14 bg-[#1F361A] px-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="p-2 text-white hover:bg-white/10 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-serif font-semibold text-white text-sm">Admin Panel</span>
          </div>
          <Link href="/app" className="text-xs font-medium text-[#8AD679] bg-white/10 px-3 py-1.5 rounded-lg">
            Student App
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
