'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Search as SearchIcon, X, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { fetchCourses, fetchProducts, fetchWorkshops } from '@/lib/supabase-queries'
import type { Course, Product, Workshop } from '@/lib/app-data'

type ResultItem = (Course | Product | Workshop) & { _type: string; _label: string; _image: string; _price?: number }

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const cache = useRef<{ courses: Course[]; products: Product[]; workshops: Workshop[] } | null>(null)

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setSearched(false); return }
    setLoading(true)
    setSearched(true)

    const lower = q.toLowerCase()
    if (!cache.current) {
      try {
        const [courses, products, workshops] = await Promise.all([
          fetchCourses(),
          fetchProducts(),
          fetchWorkshops(),
        ])
        cache.current = { courses, products, workshops }
      } catch {
        setLoading(false)
        return
      }
    }

    const { courses, products, workshops } = cache.current
    const matched: ResultItem[] = [
      ...courses.filter(c => c.title.toLowerCase().includes(lower)).map(c => ({ ...c, _type: 'Course', _label: c.title, _image: c.image, _price: c.price })),
      ...products.filter(p => p.title.toLowerCase().includes(lower)).map(p => ({ ...p, _type: 'Product', _label: p.title, _image: p.image, _price: p.price })),
      ...workshops.filter(w => w.title.toLowerCase().includes(lower)).map(w => ({ ...w, _type: 'Workshop', _label: w.title, _image: w.image, _price: w.price })),
    ]

    setResults(matched)
    setLoading(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300)
    return () => clearTimeout(timer)
  }, [query, doSearch])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20">
        <section className="bg-[#FAF8F5] py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#264020]/40" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search courses, products, workshops..."
                autoFocus
                className="w-full pl-12 pr-10 py-4 bg-white border border-[#E5E5E5] rounded-xl text-[#264020] text-lg focus:outline-none focus:border-[#264020]"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-5 h-5 text-[#264020]/40 hover:text-[#264020]" />
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-2xl mx-auto px-4">
            {loading && <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#264020] animate-spin" /></div>}

            {!loading && searched && results.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon className="w-12 h-12 text-[#264020]/20 mx-auto mb-4" />
                <p className="text-[#264020]/60">No results found for &quot;{query}&quot;</p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-[#264020]/40">{results.length} result{results.length > 1 ? 's' : ''} for &quot;{query}&quot;</p>
                {results.map((item) => (
                  <div key={`${item._type}-${item.id}`}
                    className="animate-fade-in-up flex gap-4 bg-card rounded-xl p-4 border border-border/50 hover:border-[#264020]/20 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image src={item._image} alt={item._label} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#264020]/40 uppercase">{item._type}</p>
                      <Link href={item._type === 'Course' ? `/dashboard/courses/${item.id}` : item._type === 'Product' ? '/shop' : '/dashboard'} className="font-medium text-[#264020] hover:underline truncate block">
                        {item._label}
                      </Link>
                      {'rating' in item && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-[#264020] text-[#264020]" />
                          <span className="text-xs text-[#264020]/60">{(item as Course).rating}</span>
                        </div>
                      )}
                    </div>
                    {item._price !== undefined && (
                      <div className="text-right shrink-0">
                        <p className="font-bold text-[#264020]">₹{item._price.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!loading && !searched && (
              <div className="text-center py-12">
                <SearchIcon className="w-16 h-16 text-[#264020]/10 mx-auto mb-4" />
                <p className="text-[#264020]/40">Search across courses, products, and workshops</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
