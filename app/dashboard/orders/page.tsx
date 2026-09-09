'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  TrendingUp,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminOrder {
  id: string
  customerName: string
  customerEmail: string
  item: string
  type: 'course' | 'product' | 'workshop'
  amount: number
  status: 'completed' | 'pending' | 'refunded'
  date: string
}

const SAMPLE_ORDERS: AdminOrder[] = [
  {
    id: 'ORD-9842',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.s@gmail.com',
    item: 'Mysore Yoga Sadhana (Beginner)',
    type: 'course',
    amount: 14999,
    status: 'completed',
    date: '09 Sep 2026',
  },
  {
    id: 'ORD-9841',
    customerName: 'David Miller',
    customerEmail: 'david.m@outlook.com',
    item: 'Organic Cotton Mysore Yoga Rug',
    type: 'product',
    amount: 2499,
    status: 'completed',
    date: '08 Sep 2026',
  },
  {
    id: 'ORD-9840',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@gmail.com',
    item: 'Pranayama & Breathwork Masterclass',
    type: 'workshop',
    amount: 3499,
    status: 'completed',
    date: '08 Sep 2026',
  },
  {
    id: 'ORD-9839',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@yahoo.com',
    item: 'Handcrafted Cork Yoga Blocks (Pair)',
    type: 'product',
    amount: 1299,
    status: 'pending',
    date: '07 Sep 2026',
  },
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(SAMPLE_ORDERS)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.amount, 0)

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.item.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'all' || o.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">
            Store & Course Orders
          </h1>
          <p className="text-[#264020]/60 text-sm mt-1">
            Track customer purchases across yoga courses, merchandise, and workshop enrollments.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase">Total Revenue</p>
            <p className="text-2xl font-bold text-[#264020] mt-0.5">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#264020]/10 flex items-center justify-center text-[#264020]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase">Total Orders</p>
            <p className="text-2xl font-bold text-[#264020] mt-0.5">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase">Completed Deliveries</p>
            <p className="text-2xl font-bold text-blue-700 mt-0.5">
              {orders.filter((o) => o.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#264020]/40" />
          <input
            type="text"
            placeholder="Search by customer, email, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'course', 'product', 'workshop'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterType === t
                  ? 'bg-[#264020] text-white'
                  : 'bg-[#FAF8F5] text-[#264020]/70 hover:bg-[#264020]/10'
              }`}
            >
              {t === 'all' ? 'All Types' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[11px] font-semibold text-[#264020]/60 uppercase tracking-wider border-b border-[#E5E5E5]">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Purchased Item</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-sm">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-[#264020] text-xs">
                    {order.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-[#264020]">{order.customerName}</p>
                    <p className="text-xs text-[#264020]/50">{order.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-[#264020]">{order.item}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#264020]/10 text-[#264020]">
                      {order.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#264020]/70">{order.date}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#264020]">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {order.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3" /> Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
