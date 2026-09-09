'use client'

import { useState, useEffect } from 'react'
import { BarChart3, RefreshCw, ShoppingBag, Users, BookOpen, GraduationCap, TrendingUp, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  totalOrders: number
  revenue: number
  pendingOrders: number
  completedOrders: number
  totalUsers: number
  totalCourses: number
  publishedCourses: number
  totalWorkshops: number
  totalLeads: number
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const [orders, users, courses, workshops, leads] = await Promise.all([
        fetch('/api/admin/orders').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json()),
        fetch('/api/admin/courses').then(r => r.json()),
        fetch('/api/admin/workshops').then(r => r.json()),
        fetch('/api/admin/leads').then(r => r.json()),
      ])

      const ordersData = orders.data || []
      const usersData = users.data || []
      const coursesData = courses.data || []
      const workshopsData = workshops.data || []
      const leadsData = leads.data || []

      setData({
        totalOrders: ordersData.length,
        revenue: ordersData.filter((o: any) => o.status === 'completed').reduce((s: number, o: any) => s + (o.total || 0), 0),
        pendingOrders: ordersData.filter((o: any) => o.status === 'pending').length,
        completedOrders: ordersData.filter((o: any) => o.status === 'completed').length,
        totalUsers: usersData.length,
        totalCourses: coursesData.length,
        publishedCourses: coursesData.filter((c: any) => c.published).length,
        totalWorkshops: workshopsData.length,
        totalLeads: leadsData.length,
      })
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const stats = data ? [
    { label: 'Total Revenue', value: `₹${data.revenue.toLocaleString()}`, sub: `${data.completedOrders} completed orders`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Orders', value: data.totalOrders, sub: `${data.pendingOrders} pending`, icon: ShoppingBag, color: 'bg-amber-50 text-amber-600' },
    { label: 'Students Enrolled', value: data.totalUsers, sub: 'Registered profiles', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Courses', value: `${data.publishedCourses}/${data.totalCourses}`, sub: 'Published vs total', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Workshops', value: data.totalWorkshops, sub: 'All workshops', icon: GraduationCap, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Leads / Inquiries', value: data.totalLeads, sub: 'Contact form submissions', icon: TrendingUp, color: 'bg-pink-50 text-pink-600' },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Analytics</h1>
          <p className="text-[#264020]/60 text-sm mt-1">Live overview of your school's performance</p>
        </div>
        <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
          <p className="text-[#264020]/50 text-sm">Compiling analytics…</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#264020]">{stat.value}</p>
                  <p className="font-semibold text-[#264020]/80 text-sm mt-1">{stat.label}</p>
                  <p className="text-xs text-[#264020]/40 mt-0.5">{stat.sub}</p>
                </div>
              )
            })}
          </div>

          {/* Revenue vs Orders Summary */}
          {data && (
            <div className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-6">
              <h2 className="font-serif font-bold text-[#264020] text-lg mb-4">Order Status Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: 'Completed', count: data.completedOrders, total: data.totalOrders, color: 'bg-emerald-500' },
                  { label: 'Pending', count: data.pendingOrders, total: data.totalOrders, color: 'bg-amber-400' },
                  { label: 'Failed/Refunded', count: data.totalOrders - data.completedOrders - data.pendingOrders, total: data.totalOrders, color: 'bg-red-400' },
                ].map((row) => {
                  const pct = data.totalOrders > 0 ? (row.count / data.totalOrders) * 100 : 0
                  return (
                    <div key={row.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#264020]/70 font-medium">{row.label}</span>
                        <span className="text-[#264020] font-semibold">{row.count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-[#264020]/8 rounded-full overflow-hidden">
                        <div className={`h-full ${row.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="bg-[#264020] rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-[#8AD679]" />
              <h2 className="font-serif font-bold text-lg">Deeper Analytics</h2>
            </div>
            <p className="text-white/60 text-sm">
              For detailed charts and trend analysis, integrate with Google Analytics or connect to your Supabase Studio dashboard for full SQL-level reporting.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
