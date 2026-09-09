'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Package, ShoppingBag, Users, BookOpen, GraduationCap,
  MessageSquare, TrendingUp, ArrowRight, RefreshCw, DollarSign, Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashStats {
  revenue: number
  totalOrders: number
  pendingOrders: number
  totalUsers: number
  publishedCourses: number
  totalCourses: number
  totalWorkshops: number
  totalProducts: number
  totalLeads: number
  recentOrders: {
    id: string
    total: number
    status: string
    created_at: string
    profiles?: { name: string; email: string }
  }[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

export default function AdminDashboardOverviewPage() {
  const [stats, setStats] = useState<DashStats | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [orders, users, courses, workshops, products, leads] = await Promise.all([
        fetch('/api/admin/orders').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/courses').then(r => r.json()),
        fetch('/api/admin/workshops').then(r => r.json()),
        fetch('/api/admin/products').then(r => r.json()),
        fetch('/api/admin/leads').then(r => r.json()),
      ])

      const ordersData = orders.data || []
      const completedOrders = ordersData.filter((o: any) => o.status === 'completed')
      const revenue = completedOrders.reduce((s: number, o: any) => s + (o.total || 0), 0)

      setStats({
        revenue,
        totalOrders: ordersData.length,
        pendingOrders: ordersData.filter((o: any) => o.status === 'pending').length,
        totalUsers: (users.data || []).length,
        publishedCourses: (courses.data || []).filter((c: any) => c.published).length,
        totalCourses: (courses.data || []).length,
        totalWorkshops: (workshops.data || []).length,
        totalProducts: (products.data || []).length,
        totalLeads: (leads.data || []).length,
        recentOrders: ordersData.slice(0, 5),
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const kpis = stats ? [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, sub: `${stats.totalOrders} orders`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/dashboard/orders' },
    { label: 'Pending Orders', value: stats.pendingOrders, sub: 'Awaiting fulfillment', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50', href: '/dashboard/orders' },
    { label: 'Registered Students', value: stats.totalUsers, sub: 'All users', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', href: '/dashboard/users' },
    { label: 'Published Courses', value: `${stats.publishedCourses} / ${stats.totalCourses}`, sub: 'Live vs. total', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', href: '/dashboard/courses' },
    { label: 'Workshops', value: stats.totalWorkshops, sub: 'Active workshops', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/dashboard/workshops' },
    { label: 'Open Inquiries', value: stats.totalLeads, sub: 'Contact messages', icon: MessageSquare, color: 'text-pink-600', bg: 'bg-pink-50', href: '/dashboard/leads' },
  ] : []

  const quickLinks = [
    { label: 'Courses', href: '/dashboard/courses', icon: BookOpen },
    { label: 'Workshops', href: '/dashboard/workshops', icon: GraduationCap },
    { label: 'Products', href: '/dashboard/products', icon: Package },
    { label: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { label: 'Students', href: '/dashboard/users', icon: Users },
    { label: 'Leads', href: '/dashboard/leads', icon: MessageSquare },
    { label: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    { label: 'Export', href: '/dashboard/export', icon: Activity },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">
            Welcome back 🌿
          </h1>
          <p className="text-[#264020]/60 text-sm mt-1">
            Here&apos;s your school&apos;s live performance overview.
          </p>
        </div>
        <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#264020]/10 p-5 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-[#264020]/8 mb-4" />
              <div className="h-8 w-16 bg-[#264020]/8 rounded-lg mb-2" />
              <div className="h-4 w-24 bg-[#264020]/5 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Link key={kpi.label} href={kpi.href}
                className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-5 hover:shadow-md transition-all hover:border-[#264020]/20 group">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#264020]">{kpi.value}</p>
                <p className="font-semibold text-[#264020]/80 text-sm mt-1">{kpi.label}</p>
                <p className="text-xs text-[#264020]/40 mt-0.5">{kpi.sub}</p>
              </Link>
            )
          })}
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h2 className="font-serif font-bold text-[#264020] text-lg mb-3">Quick Access</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link key={link.label} href={link.href}
                className="bg-white rounded-xl border border-[#264020]/10 p-3 text-center hover:bg-[#264020] hover:text-white group transition-all shadow-sm">
                <Icon className="w-5 h-5 mx-auto mb-1.5 text-[#264020] group-hover:text-white transition-colors" />
                <span className="text-[11px] font-medium text-[#264020] group-hover:text-white transition-colors">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif font-bold text-[#264020] text-lg">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs font-medium text-[#264020]/60 hover:text-[#264020] flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-6 h-6 text-[#264020]/30 animate-spin mx-auto mb-2" />
              <p className="text-[#264020]/40 text-sm">Loading…</p>
            </div>
          ) : !stats?.recentOrders?.length ? (
            <div className="py-12 text-center">
              <ShoppingBag className="w-8 h-8 text-[#264020]/20 mx-auto mb-2" />
              <p className="text-[#264020]/40 text-sm">No orders yet. They&apos;ll appear here when students purchase.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#264020]/5">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-4 flex items-center justify-between hover:bg-[#F7F9F6]/70 transition-colors">
                  <div>
                    <p className="font-medium text-[#264020] text-sm">{order.profiles?.name || 'Guest'}</p>
                    <p className="text-xs text-[#264020]/50">{order.profiles?.email || '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#264020] text-sm">₹{(order.total || 0).toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
