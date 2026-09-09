'use client'

import { useState, useMemo, useEffect } from 'react'
import { Calendar, Clock, Globe, ChevronRight, Bell } from 'lucide-react'
import { EmptyWorkshopsState, LoadingScreen } from '@/components/app/ui-states'
import { fetchWorkshops } from '@/lib/supabase-queries'
import type { Workshop } from '@/lib/app-data'
import { cn, formatPrice } from '@/lib/utils'
import Image from 'next/image'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'this-week', label: 'This Week' },
  { id: 'online', label: 'Online' },
]

export function WorkshopsScreen() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [reminders, setReminders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [workshops, setWorkshops] = useState<Workshop[]>([])

  useEffect(() => {
    fetchWorkshops()
      .then(w => {
        setWorkshops(w)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filteredWorkshops = useMemo(() => workshops.filter(workshop => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'upcoming') return workshop.startsIn > 3
    if (activeFilter === 'this-week') return workshop.startsIn <= 7
    if (activeFilter === 'online') return workshop.format === 'Online Live'
    return true
  }), [activeFilter, workshops])

  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="pb-4 space-y-6">
      {/* Header */}
      <div className="px-4 pt-2">
        <h1 className="font-serif text-2xl text-foreground">Upcoming Programs</h1>
        <p className="text-sm text-muted-foreground mt-1">Deepen your learnings through live workshops</p>
      </div>

      {/* Filter Tabs */}
      <div className="overflow-x-auto hide-scrollbar momentum-scroll">
        <div className="flex gap-2 px-4">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 touch-target',
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground active:bg-secondary/80'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workshops List */}
      {filteredWorkshops.length > 0 ? (
        <div className="px-4 space-y-5 stagger-children">
          {filteredWorkshops.map(workshop => {
            const hasReminder = reminders.includes(workshop.id)

            return (
              <div
                key={workshop.id}
                className="bg-card rounded-2xl overflow-hidden border border-border/50 card-interactive"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={workshop.image}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-white/95 rounded-lg shadow-sm">
                    <span className="text-[10px] text-muted-foreground block">Starts in</span>
                    <p className="text-sm font-bold text-primary">{workshop.startsIn} Days</p>
                  </div>
                  <button
                    onClick={() => toggleReminder(workshop.id)}
                    className={cn(
                      "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-sm touch-target transition-all",
                      hasReminder ? "bg-accent text-accent-foreground" : "bg-white/95 text-foreground"
                    )}
                  >
                    <Bell className={cn("w-4 h-4", hasReminder && "fill-current")} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-xl text-foreground">{workshop.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{workshop.description}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {workshop.startDate}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {workshop.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs text-muted-foreground">
                      <Globe className="w-3.5 h-3.5" />
                      {workshop.language}
                    </span>
                  </div>

                  <button className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium flex items-center justify-center gap-2 touch-target transition-transform active:scale-98">
                    Register Now {formatPrice(workshop.price)}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyWorkshopsState />
      )}

      {filteredWorkshops.length > 0 && (
        <div className="px-4">
          <button className="w-full py-3 border border-border rounded-full text-sm font-medium text-foreground flex items-center justify-center gap-2 touch-target transition-colors active:bg-secondary">
            View All Programs
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
