import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  showViewAll?: boolean
  onViewAll?: () => void
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  showViewAll,
  onViewAll,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between px-4 mb-3', className)}>
      <div>
        <h2 className="font-serif text-xl text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {showViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium text-primary touch-target"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

interface HorizontalScrollProps {
  children: ReactNode
  className?: string
  gap?: 'sm' | 'md' | 'lg'
}

export function HorizontalScroll({ children, className, gap = 'md' }: HorizontalScrollProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  }

  return (
    <div className={cn(
      'flex overflow-x-auto px-4 pb-2 hide-scrollbar snap-x snap-mandatory momentum-scroll',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface SectionListProps {
  children: ReactNode
  className?: string
  columns?: 1 | 2
}

export function SectionList({ children, className, columns = 1 }: SectionListProps) {
  return (
    <div className={cn(
      'px-4',
      columns === 2 ? 'grid grid-cols-2 gap-3' : 'space-y-3',
      className
    )}>
      {children}
    </div>
  )
}
