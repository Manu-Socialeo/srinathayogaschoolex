'use client'

import Image from 'next/image'
import { Play, Clock, BookOpen, Bookmark } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useState } from 'react'
import type { Course } from '@/lib/app-data'

interface CourseCardProps {
  course: Course
  variant?: 'default' | 'compact' | 'wide'
  showProgress?: boolean
  onClick?: () => void
}

export function CourseCard({
  course,
  variant = 'default',
  showProgress = false,
  onClick
}: CourseCardProps) {
  const [isSaved, setIsSaved] = useState(course.isSaved || false)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="flex-shrink-0 w-40 snap-start text-left card-interactive"
      >
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-2">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
          {showProgress && course.progress !== undefined && course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          )}
          {course.isPurchased && (
            <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Play className="w-4 h-4 text-primary fill-primary" />
            </div>
          )}
        </div>
        <h3 className="font-medium text-sm text-foreground line-clamp-1">{course.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
        {showProgress && course.progress !== undefined && course.progress > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-accent font-medium">{course.progress}%</span>
          </div>
        )}
      </button>
    )
  }

  if (variant === 'wide') {
    return (
      <div
        onClick={onClick}
        className="flex gap-3 p-3 bg-card rounded-xl border border-border/50 text-left w-full card-interactive touch-target cursor-pointer"
        role="button"
        tabIndex={0}
      >
        <div className="relative w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
          {showProgress && course.progress !== undefined && course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div
                className="h-full bg-accent"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm text-foreground line-clamp-1">{course.title}</h3>
            <button
              onClick={handleSave}
              className={cn(
                "w-6 h-6 flex items-center justify-center flex-shrink-0",
                isSaved && "bookmark-animate"
              )}
              aria-label={isSaved ? "Remove from saved" : "Save course"}
            >
              <Bookmark className={cn(
                "w-4 h-4 transition-colors",
                isSaved ? "text-accent fill-accent" : "text-muted-foreground"
              )} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{course.subtitle}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              {course.lessons} lessons
            </span>
          </div>
          {showProgress && course.progress !== undefined && course.progress > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-accent font-semibold">{course.progress}%</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-64 snap-start text-left card-interactive cursor-pointer"
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className={cn(
            'inline-block px-2 py-0.5 rounded-full text-[10px] font-medium',
            'bg-white/90 text-foreground'
          )}>
            {course.level}
          </span>
          <button
            onClick={handleSave}
            className={cn(
              "w-8 h-8 rounded-full bg-white/90 flex items-center justify-center",
              isSaved && "bookmark-animate"
            )}
            aria-label={isSaved ? "Remove from saved" : "Save course"}
          >
            <Bookmark className={cn(
              "w-4 h-4 transition-colors",
              isSaved ? "text-accent fill-accent" : "text-foreground"
            )} />
          </button>
        </div>
      </div>
      <h3 className="font-serif text-base text-foreground">{course.title}</h3>
      <p className="text-sm text-muted-foreground mt-0.5">{course.subtitle}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-semibold text-primary">
          {formatPrice(course.price)}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {course.duration}
        </span>
      </div>
    </div>
  )
}
