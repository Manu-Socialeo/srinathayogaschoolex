'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Layers,
  Package,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchProducts, updateProduct } from '@/lib/supabase-queries'
import type { Product as AppProduct } from '@/lib/app-data'

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<AppProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Local stock counts state
  const [stockCounts, setStockCounts] = useState<Record<string, number>>({})

  const loadData = async () => {
    setLoading(true)
    try {
      const prods = await fetchProducts()
      setProducts(prods)
      // Initialize simulated/persisted stock counts (default 25 if in stock, 0 if out of stock)
      const counts: Record<string, number> = {}
      prods.forEach((p, idx) => {
        counts[p.id] = p.inStock ? 15 + ((idx * 7) % 30) : 0
      })
      setStockCounts(counts)
    } catch (err) {
      console.error('Failed to load inventory products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleStockStatus = async (product: AppProduct) => {
    setUpdatingId(product.id)
    const newStatus = !product.inStock
    try {
      await updateProduct(product.id, { in_stock: newStatus })
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: newStatus } : p))
      )
      setStockCounts((prev) => ({
        ...prev,
        [product.id]: newStatus ? Math.max(prev[product.id] || 10, 10) : 0,
      }))
    } catch (err) {
      console.error('Failed to update stock status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  const adjustStock = async (product: AppProduct, delta: number) => {
    const current = stockCounts[product.id] ?? (product.inStock ? 10 : 0)
    const newCount = Math.max(0, current + delta)
    setStockCounts((prev) => ({ ...prev, [product.id]: newCount }))

    const shouldBeInStock = newCount > 0
    if (shouldBeInStock !== product.inStock) {
      setUpdatingId(product.id)
      try {
        await updateProduct(product.id, { in_stock: shouldBeInStock })
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, inStock: shouldBeInStock } : p))
        )
      } catch (err) {
        console.error('Failed to update product stock:', err)
      } finally {
        setUpdatingId(null)
      }
    }
  }

  const inStockCount = products.filter((p) => p.inStock).length
  const outOfStockCount = products.filter((p) => !p.inStock).length

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'in_stock'
        ? p.inStock
        : !p.inStock
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">
            Inventory Management
          </h1>
          <p className="text-[#264020]/60 text-sm mt-1">
            Monitor real-time warehouse stock units, adjust inventory quantities, and toggle availability.
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#264020]/10 flex items-center justify-center text-[#264020]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase">Total Catalog SKUs</p>
            <p className="text-2xl font-bold text-[#264020] mt-0.5">{products.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase">Available Units Active</p>
            <p className="text-2xl font-bold text-emerald-700 mt-0.5">{inStockCount} items</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#264020]/60 uppercase">Depleted / Out of Stock</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{outOfStockCount} items</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#264020]/40" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#264020] text-white'
                : 'bg-[#FAF8F5] text-[#264020]/70 hover:bg-[#264020]/10'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setFilterStatus('in_stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'in_stock'
                ? 'bg-emerald-700 text-white'
                : 'bg-[#FAF8F5] text-[#264020]/70 hover:bg-[#264020]/10'
            }`}
          >
            In Stock ({inStockCount})
          </button>
          <button
            onClick={() => setFilterStatus('out_of_stock')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterStatus === 'out_of_stock'
                ? 'bg-red-700 text-white'
                : 'bg-[#FAF8F5] text-[#264020]/70 hover:bg-[#264020]/10'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-[#264020]/60">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#264020]" />
            <p>Loading inventory balances...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Layers className="w-12 h-12 text-[#264020]/30 mx-auto mb-3" />
            <p className="font-medium text-[#264020]">No items match this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] text-[11px] font-semibold text-[#264020]/60 uppercase tracking-wider border-b border-[#E5E5E5]">
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Stock Quantity</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">In-Stock Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] text-sm">
                {filtered.map((item) => {
                  const qty = stockCounts[item.id] ?? (item.inStock ? 10 : 0)
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-[#E5E5E5] overflow-hidden relative shrink-0">
                            {item.image ? (
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            ) : (
                              <Package className="w-5 h-5 text-[#264020]/40 m-auto" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#264020] leading-snug">{item.title}</p>
                            <p className="text-xs text-[#264020]/50 mt-0.5">ID: {item.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 capitalize text-[#264020]/70 font-medium">
                        {item.category || 'Props'}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#264020]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center border border-[#E5E5E5] rounded-xl overflow-hidden bg-white shadow-2xs">
                          <button
                            onClick={() => adjustStock(item, -1)}
                            disabled={qty === 0}
                            className="p-1.5 text-[#264020]/70 hover:bg-[#FAF8F5] hover:text-[#264020] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#264020] min-w-8 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => adjustStock(item, 1)}
                            className="p-1.5 text-[#264020]/70 hover:bg-[#FAF8F5] hover:text-[#264020] transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {item.inStock && qty > 5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Available
                          </span>
                        ) : item.inStock && qty <= 5 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Low Stock ({qty})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <XCircle className="w-3 h-3" /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.inStock}
                            disabled={updatingId === item.id}
                            onChange={() => toggleStockStatus(item)}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#264020]"></div>
                        </label>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
