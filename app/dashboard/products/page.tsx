'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  X,
  ExternalLink,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/supabase-queries'
import type { Product as AppProduct } from '@/lib/app-data'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'sound-healing', label: 'Sound Healing' },
  { id: 'mattress-cushions', label: 'Mattress & Cushions' },
  { id: 'accessories', label: 'Accessories' },
]

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1545205597-3d9d02c29547?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=600&fit=crop',
  'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=600&fit=crop',
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AppProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AppProduct | null>(null)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [category, setCategory] = useState('books')
  const [image, setImage] = useState(SAMPLE_IMAGES[0])
  const [inStock, setInStock] = useState(true)

  const loadProducts = async () => {
    setLoading(true)
    try {
      const prods = await fetchProducts()
      setProducts(prods)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPrice('')
    setOriginalPrice('')
    setCategory('books')
    setImage(SAMPLE_IMAGES[0])
    setInStock(true)
    setFormError('')
    setEditingProduct(null)
  }

  const openAddModal = () => {
    resetForm()
    setIsAddModalOpen(true)
  }

  const openEditModal = (p: AppProduct) => {
    setEditingProduct(p)
    setTitle(p.title)
    setDescription(p.description)
    setPrice(p.price.toString())
    setOriginalPrice(p.originalPrice ? p.originalPrice.toString() : '')
    setCategory(p.category || 'books')
    setImage(p.image || SAMPLE_IMAGES[0])
    setInStock(p.inStock)
    setFormError('')
    setIsAddModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !price) {
      setFormError('Please enter a product title and price.')
      return
    }

    setSubmitting(true)
    setFormError('')

    const numPrice = parseFloat(price)
    const numOriginalPrice = originalPrice ? parseFloat(originalPrice) : numPrice

    try {
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, {
          title: title.trim(),
          description: description.trim(),
          price: numPrice,
          original_price: numOriginalPrice,
          image,
          in_stock: inStock,
          category,
        })
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  title: title.trim(),
                  description: description.trim(),
                  price: numPrice,
                  originalPrice: numOriginalPrice,
                  image,
                  inStock,
                  category,
                }
              : p
          )
        )
      } else {
        // Create new product
        const res = await createProduct({
          title: title.trim(),
          description: description.trim(),
          price: numPrice,
          original_price: numOriginalPrice,
          image,
          in_stock: inStock,
          category,
        })

        const newId = res.data?.id || `prod_${Date.now()}`
        const newProd: AppProduct = {
          id: newId,
          title: title.trim(),
          description: description.trim(),
          price: numPrice,
          originalPrice: numOriginalPrice,
          image,
          inStock,
          category,
          rating: 5.0,
          reviews: 0,
        }
        setProducts((prev) => [newProd, ...prev])
      }

      setIsAddModalOpen(false)
      resetForm()
    } catch (err) {
      console.error('Failed to save product:', err)
      setFormError('Failed to save product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product from the catalog?')) return
    setIsDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product')
    } finally {
      setIsDeletingId(null)
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat =
      selectedCategory === 'all' || p.category?.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">
            Products Management
          </h1>
          <p className="text-[#264020]/60 text-sm mt-1">
            Add new products to your online yoga store, edit pricing, or remove items.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadProducts}
            variant="outline"
            className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={openAddModal}
            className="bg-[#264020] hover:bg-[#3a5a30] text-white gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E5] shadow-xs flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#264020]/40" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAF8F5] border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#264020] text-white'
                  : 'bg-[#FAF8F5] text-[#264020]/70 hover:bg-[#264020]/10 hover:text-[#264020]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid / Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-16 text-center text-[#264020]/60">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#264020]" />
          <p className="font-medium text-base">Loading product catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-16 text-center">
          <Package className="w-12 h-12 text-[#264020]/30 mx-auto mb-3" />
          <p className="font-medium text-lg text-[#264020]">No products match your filter</p>
          <p className="text-sm text-[#264020]/60 mt-1 mb-6">Try adjusting your search query or add a new item.</p>
          <Button onClick={openAddModal} className="bg-[#264020] text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="aspect-4/3 bg-[#FAF8F5] relative overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#264020]/30">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.inStock ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> In Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-600/90 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                        <XCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </div>
                  {product.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-white backdrop-blur-xs capitalize flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {product.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif font-bold text-lg text-[#264020] mb-1 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#264020]/60 line-clamp-2 leading-relaxed mb-4">
                    {product.description || 'Authentic Mysore yoga product craft.'}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#264020]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-[#264020]/40 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 pt-2 border-t border-[#F0EFEB] flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(product)}
                  className="flex-1 border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 text-xs h-9 gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isDeletingId === product.id}
                  onClick={() => handleDelete(product.id)}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs h-9 px-3"
                  title="Delete product"
                >
                  {isDeletingId === product.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#E5E5E5]">
            <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-serif text-xl font-bold text-[#264020]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#264020]/60 hover:text-[#264020] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-[#264020]/70 mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cotton Mysore Yoga Rug"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#264020]/70 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="2499"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#264020]/70 mb-1.5">
                    Original / MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="2999"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#264020]/70 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020] bg-white"
                >
                  <option value="books">Books & Sacred Texts</option>
                  <option value="apparel">Yoga Apparel & Clothing</option>
                  <option value="sound-healing">Tibetan Singing Bowls & Sound Healing</option>
                  <option value="mattress-cushions">Yoga Mats, Cushions & Bolsters</option>
                  <option value="accessories">Sacred Malas, Straps & Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#264020]/70 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the material, origin, and practice benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#264020]/70 mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-[#264020] text-[#264020] mb-2"
                />
                <div className="flex gap-2">
                  {SAMPLE_IMAGES.map((imgUrl, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setImage(imgUrl)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 relative ${
                        image === imgUrl ? 'border-[#264020]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={imgUrl} alt="Sample" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#E5E5E5]">
                <div>
                  <p className="text-sm font-semibold text-[#264020]">Stock Status</p>
                  <p className="text-xs text-[#264020]/60">Allow students to purchase this item</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#264020]"></div>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 border-[#264020]/20 text-[#264020]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#264020] hover:bg-[#3a5a30] text-white"
                >
                  {submitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  {editingProduct ? 'Update Product' : 'Add to Catalog'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
