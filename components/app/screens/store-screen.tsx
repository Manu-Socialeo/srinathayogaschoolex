'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, ShoppingCart, Star, Heart, X } from 'lucide-react'
import { EmptySearchState, LoadingScreen } from '@/components/app/ui-states'
import { fetchProducts } from '@/lib/supabase-queries'
import type { Product } from '@/lib/app-data'
import { cn, formatPrice } from '@/lib/utils'
import Image from 'next/image'

const productCategories = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'sound-healing', label: 'Sound Healing' },
  { id: 'mattress-cushions', label: 'Mattress & Cushions' },
  { id: 'accessories', label: 'Accessories' },
]

export function StoreScreen() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
      .then(p => {
        setProducts(p)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filteredProducts = useMemo(() => products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }), [activeCategory, searchQuery, products])

  const toggleWishlist = (id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const clearSearch = () => setSearchQuery('')

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="pb-4 space-y-6">
      {/* Header */}
      <div className="px-4 pt-2">
        <h1 className="font-serif text-2xl text-foreground">Yoga Store</h1>
        <p className="text-sm text-muted-foreground mt-1">Books, accessories & wellness products</p>
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-10 bg-secondary rounded-full text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted-foreground/20 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto hide-scrollbar momentum-scroll">
        <div className="flex gap-2 px-4">
          {productCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 touch-target',
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground active:bg-secondary/80'
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 stagger-children">
            {filteredProducts.map(product => {
              const discount = product.originalPrice > 0 ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0
              const isWishlisted = wishlist.includes(product.id)

              return (
                <div
                  key={product.id}
                  className="bg-card rounded-xl overflow-hidden border border-border/50 card-interactive"
                >
                  <div className="relative aspect-[3/4] bg-ivory">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-[10px] font-medium">
                        -{discount}%
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={cn(
                        "absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm touch-target transition-transform active:scale-95",
                        isWishlisted && "bookmark-animate"
                      )}
                    >
                      <Heart className={cn(
                        "w-4 h-4 transition-colors",
                        isWishlisted ? "text-red-500 fill-red-500" : "text-foreground"
                      )} />
                    </button>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-foreground line-clamp-2 min-h-[40px]">{product.title}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
                      {product.originalPrice > 0 && (
                        <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    <button className="w-full mt-3 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-medium flex items-center justify-center gap-1.5 touch-target transition-transform active:scale-98">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : searchQuery ? (
          <EmptySearchState query={searchQuery} />
        ) : (
          <div className="text-center py-12 text-muted-foreground">No products found</div>
        )}
      </div>
    </div>
  )
}
