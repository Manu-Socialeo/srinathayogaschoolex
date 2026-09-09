'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Trash2, ShoppingBag, ChevronLeft, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/components/cart/cart-context'

export default function CartPage() {
  const { state, removeItem, updateQuantity, totalItems, totalPrice } = useCart()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="bg-[#FAF8F5] py-12">
          <div className="max-w-3xl mx-auto px-4">
            <Link href="/shop" className="inline-flex items-center gap-2 text-[#264020]/60 hover:text-[#264020] mb-6 transition-colors">
              <ChevronLeft size={20} />
              <span>Continue Shopping</span>
            </Link>
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#264020]" />
              <h1 className="font-serif text-3xl text-[#264020]">Cart ({totalItems})</h1>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            {state.items.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 text-[#264020]/20 mx-auto mb-4" />
                <h2 className="font-serif text-xl text-[#264020] mb-2">Your cart is empty</h2>
                <p className="text-[#264020]/60 mb-6">Add products or courses to get started</p>
                <Link href="/shop">
                  <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white">Browse Store</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="animate-fade-in-up flex gap-4 bg-card rounded-xl p-4 border border-border/50"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#264020]/60 uppercase tracking-wide">{item.type}</p>
                      <h3 className="font-medium text-[#264020] truncate">{item.title}</h3>
                      <p className="text-[#264020] font-bold mt-1">₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id, item.type)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 border border-border/50 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.type, Math.max(1, item.quantity - 1))}
                          className="p-1.5 hover:bg-secondary rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                          className="p-1.5 hover:bg-secondary rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-card rounded-xl p-6 border border-border/50 mt-6">
                  <div className="flex justify-between text-lg mb-2">
                    <span className="text-[#264020]/60">Subtotal</span>
                    <span className="font-bold text-[#264020]">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-[#264020]/40 mb-4">Shipping calculated at checkout</p>
                  <Link href="/dashboard/checkout">
                    <Button className="w-full bg-[#264020] hover:bg-[#3a5a30] text-white py-6 text-lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
