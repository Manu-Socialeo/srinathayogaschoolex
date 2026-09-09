'use client'

import { ReactNode } from 'react'
import { BookOpen, ShoppingBag, Calendar, Search, Bookmark, Heart } from 'lucide-react'

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-lg ${className}`} />
  )
}

export function CourseCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'wide' }) {
  if (variant === 'compact') {
    return (
      <div className="flex-shrink-0 w-40 snap-start">
        <Skeleton className="aspect-[4/3] rounded-xl mb-2" />
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    )
  }

  if (variant === 'wide') {
    return (
      <div className="flex gap-3 p-3 bg-card rounded-xl border border-border/50">
        <Skeleton className="w-24 h-20 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0 w-64 snap-start">
      <Skeleton className="aspect-[16/10] rounded-xl mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-2" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}

export function WorkshopCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 snap-start bg-card rounded-2xl overflow-hidden border border-border/50">
      <Skeleton className="aspect-[16/9]" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-full rounded-full mt-4" />
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 snap-start">
      <Skeleton className="aspect-[3/4] rounded-xl mb-2" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function TeacherCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-32 snap-start text-center">
      <Skeleton className="w-24 h-24 rounded-2xl mx-auto mb-2" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-1" />
      <Skeleton className="h-3 w-1/2 mx-auto" />
    </div>
  )
}

export function ErrorScreen({ message = 'Something went wrong' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <span className="text-2xl text-destructive">!</span>
      </div>
      <h3 className="font-serif text-lg text-foreground">Error</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export function EmptyCoursesState({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon={<BookOpen className="w-7 h-7 text-primary" />}
      title="No Courses Yet"
      description="Start your yoga journey by exploring our curated courses from certified masters."
      action={onExplore ? { label: 'Explore Courses', onClick: onExplore } : undefined}
    />
  )
}

export function EmptyWorkshopsState({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="w-7 h-7 text-primary" />}
      title="No Upcoming Workshops"
      description="Check back soon for new live workshops and retreats with our teachers."
      action={onExplore ? { label: 'View Schedule', onClick: onExplore } : undefined}
    />
  )
}

export function EmptyCartState({ onShop }: { onShop?: () => void }) {
  return (
    <EmptyState
      icon={<ShoppingBag className="w-7 h-7 text-primary" />}
      title="Your Cart is Empty"
      description="Explore our yoga store for books, mats, and wellness products."
      action={onShop ? { label: 'Browse Store', onClick: onShop } : undefined}
    />
  )
}

export function EmptySearchState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<Search className="w-7 h-7 text-muted-foreground" />}
      title="No Results Found"
      description={query ? `We couldn't find anything matching "${query}". Try different keywords.` : 'Try searching with different keywords.'}
    />
  )
}

export function EmptySavedState({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon={<Bookmark className="w-7 h-7 text-primary" />}
      title="Nothing Saved Yet"
      description="Save courses, workshops, and products to access them quickly later."
      action={onExplore ? { label: 'Start Exploring', onClick: onExplore } : undefined}
    />
  )
}

export function EmptyWishlistState({ onShop }: { onShop?: () => void }) {
  return (
    <EmptyState
      icon={<Heart className="w-7 h-7 text-primary" />}
      title="Your Wishlist is Empty"
      description="Add items you love to your wishlist and come back to them anytime."
      action={onShop ? { label: 'Browse Products', onClick: onShop } : undefined}
    />
  )
}

export function HorizontalScrollSkeleton({ count = 3, type = 'course' }: { count?: number, type?: 'course' | 'workshop' | 'product' | 'teacher' }) {
  const SkeletonComponent = {
    course: CourseCardSkeleton,
    workshop: WorkshopCardSkeleton,
    product: ProductCardSkeleton,
    teacher: TeacherCardSkeleton,
  }[type]

  return (
    <div className="flex gap-3 overflow-hidden px-4 pb-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  )
}
