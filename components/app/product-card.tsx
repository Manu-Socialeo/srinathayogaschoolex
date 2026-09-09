'use client'

import Image from 'next/image'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useState } from 'react'
import type { Product } from '@/lib/app-data'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
  onClick?: () => void
}

export function ProductCard({ product, variant = 'default', onClick }: ProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="flex-shrink-0 w-36 snap-start text-left"
      >
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-ivory">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-accent text-accent-foreground rounded text-[10px] font-medium">
              -{discount}%
            </div>
          )}
          <button
            onClick={toggleWishlist}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm",
              isWishlisted && "bookmark-animate"
            )}
          >
            <Heart className={cn(
              "w-4 h-4 transition-colors",
              isWishlisted ? "text-red-500 fill-red-500" : "text-foreground"
            )} />
          </button>
        </div>
        <h3 className="font-medium text-sm text-foreground line-clamp-2">{product.title}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-muted-foreground">{product.rating}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
        </div>
      </button>
    )
  }

  return (
    <div
      onClick={onClick}
      className="flex gap-3 p-3 bg-card rounded-xl border border-border/50 text-left w-full card-interactive cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <div className="relative w-24 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-ivory">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-foreground line-clamp-2">{product.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          {discount > 0 && (
            <span className="text-xs text-accent font-medium">{discount}% off</span>
          )}
        </div>
      </div>
    </div>
  )
}
