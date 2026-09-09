'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'
import { getCurrentProfile, updateProfile } from '@/lib/auth'
import { createBrowserClient } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase-types'

export default function DashboardCheckoutPage() {
  const router = useRouter()
  const { state, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' })
  const hasProducts = state.items.some(i => i.type === 'product')

  useEffect(() => {
    getCurrentProfile().then(async p => {
      setProfile(p)
      if (p?.id) {
        setForm(f => ({ ...f, name: p.name || '', phone: p.phone || '' }))
        const sb = createBrowserClient()
        const { data: addrs } = await sb.from('shipping_addresses').select('*').eq('user_id', p.id).order('created_at', { ascending: false }).limit(1)
        if (addrs?.length) {
          const a = addrs[0]
          setForm({ name: a.name || p.name, phone: a.phone || p.phone || '', address: a.address, city: a.city, state: a.state, pincode: a.pincode })
        }
      }
      setPageLoading(false)
    })
  }, [])

  useEffect(() => {
    if (form.pincode.length !== 6) return
    fetch(`https://api.postalpincode.in/pincode/${form.pincode}`)
      .then(r => r.json())
      .then(data => {
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length) {
          const po = data[0].PostOffice[0]
          setForm(f => ({ ...f, city: po.District || po.Name || '', state: po.State || '' }))
        }
      })
      .catch(() => {})
  }, [form.pincode])

  const handlePayment = async () => {
    if (state.items.length === 0) return
    setLoading(true)
    setError('')
    await saveOrder('completed')
  }

  async function saveOrder(status: string) {
    const sb = createBrowserClient()
    const p = profile
    if (!p?.id) {
      setError('Please sign in to complete your order')
      setLoading(false)
      return
    }

    let addressId: string | null = null
    if (hasProducts && form.name && form.address) {
      const { data: addr } = await sb.from('shipping_addresses').insert({
        user_id: p.id,
        name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        country: 'India',
      }).select('id').single()
      if (addr) addressId = addr.id
    }

    const addressStr = [form.address, form.city, form.state, form.pincode].join('|')
    await updateProfile({ phone: form.phone || null, address: addressStr }).catch(() => {})

    const { data: order } = await sb.from('orders').insert({
      user_id: p.id,
      total: totalPrice,
      status,
      shipping_address_id: addressId,
    }).select('id').single()

    if (order) {
      for (const item of state.items) {
        const col = item.type === 'course' ? 'course_id' : item.type === 'workshop' ? 'workshop_id' : 'product_id'
        await sb.from('order_items').insert({
          order_id: order.id,
          [col]: item.id,
          price: item.price,
        })

        if (item.type === 'course') {
          await sb.from('enrollments').insert({
            user_id: p.id,
            course_id: item.id,
            progress: 0,
          })
        }
        if (item.type === 'workshop') {
          await sb.from('workshop_registrations').insert({
            user_id: p.id,
            workshop_id: item.id,
            status: 'registered',
          })
        }
      }
    }

    try {
      const { default: posthog } = await import('posthog-js')
      posthog.capture('purchase', {
        total: totalPrice,
        items: state.items.map(i => ({ title: i.title, type: i.type, price: i.price })),
      })
    } catch {}
    setSuccess(true)
    clearCart()
    setTimeout(() => router.push('/dashboard/orders'), 1500)
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
      </div>
    )
  }

  if (state.items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#264020]/60 mb-4">Your cart is empty</p>
          <Link href="/dashboard"><Button className="bg-[#264020] text-white">Back to Dashboard</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-[#264020]/60 hover:text-[#264020] mb-6 transition-colors">
          <ChevronLeft size={20} /><span>Back to Cart</span>
        </Link>
        <h1 className="font-serif text-3xl text-[#264020] mb-8">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="bg-[#FAF8F5] rounded-xl p-6">
              <h2 className="font-serif text-lg text-[#264020] mb-2">{profile?.name || 'Your Account'}</h2>
              <p className="text-sm text-[#264020]/60 mb-4">{profile?.email}</p>
            </div>

            {hasProducts && (
              <div className="bg-[#FAF8F5] rounded-xl p-6">
                <h2 className="font-serif text-lg text-[#264020] mb-4">Shipping Details</h2>
                <div className="space-y-4">
                  <input placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
                  <input placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
                  <textarea placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020] resize-none" rows={2} />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
                    <input placeholder="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
                  </div>
                  <input placeholder="Pincode" value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]" />
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="bg-[#FAF8F5] rounded-xl p-6 sticky top-24">
              <h2 className="font-serif text-lg text-[#264020] mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {state.items.map(item => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                    <span className="text-[#264020]/70 truncate max-w-[180px]">{item.title} x{item.quantity}</span>
                    <span className="font-medium text-[#264020]">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E5E5E5] pt-4">
                <div className="flex justify-between text-lg font-bold text-[#264020]">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

              {success ? (
                <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-medium">Payment Successful!</p>
                    <p className="text-sm text-green-600">Redirecting to your orders...</p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-[#264020] hover:bg-[#3a5a30] text-white py-4 mt-6 text-lg"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Pay ₹${totalPrice.toLocaleString()}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
