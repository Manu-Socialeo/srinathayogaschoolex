import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Globe } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Workshop } from '@/lib/app-data'

interface WorkshopCardProps {
  workshop: Workshop
  variant?: 'default' | 'compact'
  onClick?: () => void
}

export function WorkshopCard({ workshop, variant = 'default', onClick }: WorkshopCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex-shrink-0 w-72 snap-start text-left bg-card rounded-2xl overflow-hidden border border-border/50">
        <div className="relative aspect-[16/9]">
          <Image
            src={workshop.image}
            alt={workshop.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 rounded-lg shadow-sm">
            <span className="text-[10px] text-muted-foreground">Starts in</span>
            <p className="text-sm font-semibold text-primary">{workshop.startsIn} Days</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg text-foreground italic">{workshop.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{workshop.description}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {workshop.startDate}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {workshop.duration}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
              <Globe className="w-3 h-3" />
              {workshop.language}
            </span>
          </div>

          <Link href="/dashboard">
            <button
              className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium"
            >
              Register Now {formatPrice(workshop.price)}
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border/50">
      <div className="relative aspect-[16/9]">
        <Image
          src={workshop.image}
          alt={workshop.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 rounded-lg shadow-sm">
          <span className="text-[10px] text-muted-foreground">Starts in</span>
          <p className="text-sm font-semibold text-primary">{workshop.startsIn} Days</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-xl text-foreground italic">{workshop.title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{workshop.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {workshop.startDate}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {workshop.duration}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            {workshop.language}
          </span>
        </div>

        <Link href="/dashboard">
          <button
            className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium"
          >
            Register Now {formatPrice(workshop.price)}
          </button>
        </Link>
      </div>
    </div>
  )
}
