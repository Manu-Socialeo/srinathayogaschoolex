"use client"

import Image from "next/image"
import Link from "next/link"

import { ChevronLeft, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { fetchProducts } from "@/lib/supabase-queries"
import { useCart } from "@/components/cart/cart-context"
import type { Product as AppProduct } from "@/lib/app-data"

interface ShopProduct {
  id: string
  name: string
  category: string
  price: number
  image: string
  rating: number
  reviews: number
  description: string
}

const categoryLabels: Record<string, string> = {
  books: "Books",
  apparel: "Apparel",
  'sound-healing': "Sound Healing",
  'mattress-cushions': "Mattress & Cushions",
  accessories: "Accessories",
}

const categorySlugs = ["All", "books", "apparel", "sound-healing", "mattress-cushions", "accessories"]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [addedId, setAddedId] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data.map(p => ({
        id: p.id,
        name: p.title,
        category: categoryLabels[p.category] || p.category,
        price: p.price,
        image: p.image,
        rating: p.rating,
        reviews: p.reviews,
        description: p.description,
      })))
      setIsLoading(false)
    }).catch(() => setIsLoading(false))
  }, [])

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === (categoryLabels[activeCategory] || activeCategory))

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="bg-[#FAF8F5] py-16">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[#264020]/60 hover:text-[#264020] mb-6 transition-colors">
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </Link>
            
            <div className="text-center">
              <h1 className="font-serif text-4xl lg:text-5xl text-[#264020] mb-4">Yoga Shop</h1>
              <p className="text-[#264020]/70 max-w-2xl mx-auto">
                Enhance your practice with authentic yoga products. Books, apparel, sound healing tools, and quality equipment to support your journey.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categorySlugs.map((slug) => (
                <button
                  key={slug}
                  onClick={() => setActiveCategory(slug)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    activeCategory === slug
                      ? "bg-[#264020] text-white"
                      : "bg-[#FAF8F5] text-[#264020] hover:bg-[#264020]/10"
                  }`}
                >
                  {slug === "All" ? "All" : categoryLabels[slug]}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading && (
                <div className="col-span-full flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
                </div>
              )}
              {!isLoading && filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up bg-white rounded overflow-hidden shadow-sm border border-[#E5E5E5] hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative aspect-square bg-[#FAF8F5]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#264020] text-white text-xs px-2 py-1 rounded">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-serif text-[#264020] font-medium mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[#264020]/60 text-xs mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-[#264020] text-[#264020]" : "text-[#E5E5E5]"}`} />
                      ))}
                      <span className="text-xs text-[#264020]/60 ml-1">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#264020] font-bold text-lg">₹{product.price}</span>
                      <Button
                        onClick={() => {
                          addItem({ id: product.id, type: 'product', title: product.name, price: product.price, image: product.image, quantity: 1 })
                          setAddedId(product.id)
                          setTimeout(() => setAddedId(null), 1500)
                        }}
                        className="bg-[#264020] hover:bg-[#3a5a30] text-white text-sm py-1.5 px-3"
                      >
                        {addedId === product.id ? 'Added!' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#264020]/60">No products found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-serif text-[#264020] font-medium mb-2">Free Shipping</h3>
                <p className="text-[#264020]/60 text-sm">On orders above ₹999</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="font-serif text-[#264020] font-medium mb-2">Easy Returns</h3>
                <p className="text-[#264020]/60 text-sm">30-day return policy</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💚</span>
                </div>
                <h3 className="font-serif text-[#264020] font-medium mb-2">Eco-Friendly</h3>
                <p className="text-[#264020]/60 text-sm">Sustainable products</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}