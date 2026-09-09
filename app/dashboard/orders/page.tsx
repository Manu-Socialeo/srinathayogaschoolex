'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, RefreshCw, Search, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Order {
  id: string
  user_id: string
  total: number
  status: string
  created_at: string
  profiles?: { name: string; email: string; phone?: string }
  order_items?: { id: string; price: number }[]
}

const STATUS_FLOW = ['pending', 'completed', 'failed', 'refunded']
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const json = await res.json()
      setOrders(json.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (order: Order, newStatus: string) => {
    setUpdatingId(order.id)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o))
      }
    } catch (e) { console.error(e) }
    finally { setUpdatingId(null) }
  }

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const matchSearch = !searchQuery ||
      o.profiles?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.total || 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Orders</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{orders.length} orders · ₹{totalRevenue.toLocaleString()} revenue · {pendingCount} pending</p>
        </div>
        <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATUS_FLOW.map((status) => {
          const count = orders.filter(o => o.status === status).length
          return (
            <button key={status} onClick={() => setFilterStatus(filterStatus === status ? 'all' : status)}
              className={`bg-white rounded-xl border p-4 text-left transition-all ${filterStatus === status ? 'border-[#264020] ring-2 ring-[#264020]/20' : 'border-[#264020]/10 hover:border-[#264020]/30'}`}>
              <p className="text-2xl font-bold text-[#264020]">{count}</p>
              <p className={`text-xs font-semibold mt-1 capitalize px-2 py-0.5 rounded-full inline-block ${STATUS_COLORS[status]}`}>{status}</p>
            </button>
          )
        })}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#264020]/40" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, email, or order ID…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20">
          <option value="all">All Statuses</option>
          {STATUS_FLOW.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#264020]/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">Loading orders…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">No orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#264020]/8 bg-[#F7F9F6]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#264020]/5">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F7F9F6]/70 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-[#264020]/60">#{order.id.slice(0, 8).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#264020]">{order.profiles?.name || 'Guest'}</p>
                      <p className="text-xs text-[#264020]/50">{order.profiles?.email || '—'}</p>
                    </td>
                    <td className="px-5 py-4 text-[#264020]/60 text-xs whitespace-nowrap">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-4 font-bold text-[#264020]">₹{(order.total || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {STATUS_FLOW.filter((s) => s !== order.status).map((newStatus) => (
                          <button
                            key={newStatus}
                            onClick={() => updateStatus(order, newStatus)}
                            disabled={updatingId === order.id}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                              updatingId === order.id ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                            } ${STATUS_COLORS[newStatus]}`}
                          >
                            → {newStatus}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
