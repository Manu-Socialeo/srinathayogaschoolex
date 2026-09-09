'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  Layers,
  ShoppingBag,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchProducts, updateProduct } from '@/lib/supabase-queries'
import type { Product as AppProduct } from '@/lib/app-data'

export default function AdminDashboardOverviewPage() {
  const [products, setProducts] = useState<AppProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const prods = await fetchProducts()
      setProducts(prods)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleStock = async (product: AppProduct) => {
    setUpdatingId(product.id)
    try {
      const newStatus = !product.inStock
      await updateProduct(product.id, { in_stock: newStatus })
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: newStatus } : p))
      )
    } catch (err) {
      console.error('Error updating stock status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const inStockCount = products.filter((p) => p.inStock).length
  const outOfStockCount = products.filter((p) => !p.inStock).length
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">
            Admin Dashboard
          </h1>
          <p className="text-[#264020]/60 text-sm mt-1">
            Manage your store catalog, real-time inventory, and product listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadData}
            variant="outline"
            className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/dashboard/products">
            <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase tracking-wider">
              Total Products
            </p>
            <p className="text-2xl font-bold text-[#264020] mt-1">{products.length}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3" /> Live in catalog
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#264020]/10 flex items-center justify-center text-[#264020]">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase tracking-wider">
              In Stock Items
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{inStockCount}</p>
            <p className="text-xs text-[#264020]/60 mt-1">Available for order</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase tracking-wider">
              Out of Stock
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{outOfStockCount}</p>
            <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Needs restocking
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase tracking-wider">
              Catalog Avg Price
            </p>
            <p className="text-2xl font-bold text-[#264020] mt-1">
              ₹{products.length > 0 ? Math.round(totalValue / products.length).toLocaleString('en-IN') : 0}
            </p>
            <p className="text-xs text-[#264020]/60 mt-1">Per product item</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-[#264020] to-[#1a2d16] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/15 text-[#A8C7A0] mb-4">
              <Package className="w-3.5 h-3.5" /> Product Management
            </span>
            <h3 className="font-serif text-xl font-bold mb-2">Manage Store Catalog</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Create new products, upload images, update descriptions, set promotional pricing, or remove discontinued inventory items.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/products">
              <Button className="bg-white text-[#264020] hover:bg-white/90 font-medium">
                Open Products List
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 mb-4 border border-amber-200">
              <Layers className="w-3.5 h-3.5" /> Real-Time Inventory
            </span>
            <h3 className="font-serif text-xl font-bold text-[#264020] mb-2">Inventory Control</h3>
            <p className="text-[#264020]/70 text-sm leading-relaxed mb-6">
              Quickly toggle in-stock availability, review out-of-stock items, and update stock status with one click to keep your online store in sync.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/inventory">
              <Button variant="outline" className="border-[#264020] text-[#264020] hover:bg-[#264020]/5 font-medium">
                Open Inventory Control
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Catalog Quick Management Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E5E5E5] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#264020]">Products Quick Status</h2>
            <p className="text-xs text-[#264020]/60 mt-0.5">Quickly toggle stock availability for online shoppers</p>
          </div>
          <Link href="/dashboard/products" className="text-xs font-semibold text-[#264020] hover:underline flex items-center gap-1">
            View All ({products.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#264020]/60 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#264020]" />
            Loading catalog products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-[#264020]/20 mx-auto mb-3" />
            <p className="font-medium text-[#264020]">No products found in catalog</p>
            <p className="text-sm text-[#264020]/60 mt-1 mb-4">Add your first yoga product to get started</p>
            <Link href="/dashboard/products">
              <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white">Add Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-[11px] font-semibold text-[#264020]/60 uppercase tracking-wider border-b border-[#E5E5E5]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-sm">
                {products.slice(0, 6).map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] overflow-hidden relative shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#264020]/40 m-auto" />
                          )}
                        </div>
                        <span className="font-medium text-[#264020]">{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#264020]/70 capitalize">{item.category || 'Store Item'}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#264020]">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.inStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingId === item.id}
                        onClick={() => toggleStock(item)}
                        className={`text-xs h-8 ${
                          item.inStock
                            ? 'border-red-200 text-red-600 hover:bg-red-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {updatingId === item.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : item.inStock ? (
                          'Mark Out of Stock'
                        ) : (
                          'Mark In Stock'
                        )}
                      </Button>
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
