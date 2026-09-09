'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { ShoppingBag, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentProfile } from '@/lib/auth'
import { getOrders } from '@/lib/supabase-queries'
import type { Database } from '@/lib/supabase-types'

type OrderItem = Database['public']['Tables']['order_items']['Row'] & { itemTitle?: string }
type Order = Database['public']['Tables']['orders']['Row'] & { items?: OrderItem[] }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const profile = await getCurrentProfile()
      if (profile) {
        const data = await getOrders(profile.id)
        setOrders(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const statusColor = (s: string) => {
    switch (s) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-amber-100 text-amber-700'
      case 'failed': return 'bg-red-100 text-red-700'
      case 'refunded': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-8 h-8 text-[#264020]" />
          <h1 className="font-serif text-3xl text-[#264020]">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-[#264020]/20 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-[#264020] mb-2">No orders yet</h2>
            <p className="text-[#264020]/60 mb-6">Your purchases will appear here</p>
            <Link href="/shop"><Button className="bg-[#264020] hover:bg-[#3a5a30] text-white">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id}
                className="animate-fade-in-up bg-white rounded-xl p-5 border border-[#E5E5E5]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#264020]/40 font-mono">#{order.id.slice(0, 8)}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#264020]/70">{item.itemTitle || 'Item'}</span>
                      <span className="font-medium text-[#264020]">₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                  <div>
                    <span className="text-xs text-[#264020]/40">Total</span>
                    <p className="font-bold text-[#264020]">₹{order.total.toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-[#264020]/40">{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-[#264020]/60 text-sm hover:text-[#264020]">{'← Back to Dashboard'}</Link>
        </div>
      </div>
    </div>
  )
}
