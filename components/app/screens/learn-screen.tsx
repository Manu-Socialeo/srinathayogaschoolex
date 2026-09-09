'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Filter, X } from 'lucide-react'
import { SectionHeader, HorizontalScroll } from '@/components/app/section'
import { CourseCard } from '@/components/app/course-card'
import { EmptySearchState, EmptyCoursesState, LoadingScreen } from '@/components/app/ui-states'
import { fetchCourses, fetchCategories, getEnrollments } from '@/lib/supabase-queries'
import { useAuth } from '@/components/auth-provider'
import type { Course, Category } from '@/lib/app-data'
import { cn } from '@/lib/utils'

export function LearnScreen() {
  const router = useRouter()
  const { profile } = useAuth()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set())
  const [enrollments, setEnrollments] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    Promise.all([fetchCourses(), fetchCategories()])
      .then(([c, cats]) => {
        setCourses(c)
        setCategories(cats)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (!profile?.id) return
    getEnrollments(profile.id).then(enrolls => {
      const ids = new Set<string>()
      const progress = new Map<string, number>()
      enrolls.forEach(e => {
        ids.add(e.course_id)
        progress.set(e.course_id, e.progress)
      })
      setEnrolledIds(ids)
      setEnrollments(progress)
    })
  }, [profile?.id])

  const purchasedCourses = useMemo(() =>
    courses.filter(c => enrolledIds.has(c.id)).map(c => ({
      ...c,
      isPurchased: true,
      progress: enrollments.get(c.id) ?? 0,
    })),
    [courses, enrolledIds, enrollments]
  )
  const continueLearning = useMemo(() =>
    purchasedCourses.filter(c => c.progress && c.progress > 0 && c.progress < 100),
    [purchasedCourses]
  )
  const completedCourses = useMemo(() =>
    purchasedCourses.filter(c => c.progress === 100),
    [purchasedCourses]
  )

  const filteredCourses = useMemo(() => courses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }), [activeCategory, searchQuery, courses])

  const browseCoursesFiltered = useMemo(() =>
    filteredCourses.filter(c => !enrolledIds.has(c.id)),
    [filteredCourses, enrolledIds]
  )

  const clearSearch = () => {
    setSearchQuery('')
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="pb-4 space-y-6">
      {/* Search Bar */}
      <div className="px-4 pt-2">
        <div className="flex gap-2">
          <div className={cn(
            "flex-1 relative transition-all duration-200",
            isSearchFocused && "ring-2 ring-primary/20 rounded-full"
          )}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search courses, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-11 pl-10 pr-10 bg-secondary rounded-full text-sm placeholder:text-muted-foreground focus:outline-none"
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
          <button className="w-11 h-11 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 touch-target">
            <Filter className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="overflow-x-auto hide-scrollbar momentum-scroll">
        <div className="flex gap-2 px-4">
          {categories.map(category => (
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

      {/* Search Results */}
      {searchQuery && browseCoursesFiltered.length === 0 && purchasedCourses.length === 0 && (
        <EmptySearchState query={searchQuery} />
      )}

      {/* Continue Learning */}
      {!searchQuery && continueLearning.length > 0 && (
        <section className="animate-fade-in">
          <SectionHeader
            title="Continue Learning"
            subtitle={`${continueLearning.length} in progress`}
          />
          <div className="px-4 space-y-3">
            {continueLearning.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                variant="wide"
                showProgress
                onClick={() => router.push(`/learn/${course.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* My Purchased Courses */}
      {!searchQuery && purchasedCourses.length > 0 && (
        <section className="animate-fade-in">
          <SectionHeader
            title="My Courses"
            subtitle={`${purchasedCourses.length} purchased`}
            showViewAll
          />
          <HorizontalScroll>
            {purchasedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                variant="compact"
                showProgress
                onClick={() => router.push(`/learn/${course.id}`)}
              />
            ))}
          </HorizontalScroll>
        </section>
      )}

      {/* Completed Courses */}
      {!searchQuery && completedCourses.length > 0 && (
        <section className="animate-fade-in">
          <SectionHeader
            title="Completed"
            subtitle={`${completedCourses.length} courses`}
          />
          <HorizontalScroll>
            {completedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                variant="compact"
                onClick={() => router.push(`/learn/${course.id}`)}
              />
            ))}
          </HorizontalScroll>
        </section>
      )}

      {/* Browse Courses */}
      <section className="animate-fade-in">
        <SectionHeader
          title={searchQuery ? 'Search Results' : 'Browse Courses'}
          subtitle={`${browseCoursesFiltered.length} courses available`}
        />
        {browseCoursesFiltered.length > 0 ? (
          <div className="px-4 space-y-4 stagger-children">
            {browseCoursesFiltered.map(course => (
              <div
                key={course.id}
                className="bg-card rounded-xl border border-border/50 overflow-hidden card-interactive"
              >
                <div className="relative aspect-[2/1]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block px-2 py-0.5 bg-white/90 rounded-full text-[10px] font-medium text-foreground">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-accent text-accent-foreground rounded-lg text-xs font-medium">
                    {course.lessons} Lessons
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{course.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-semibold text-primary">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        }).format(course.price)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">{course.duration}</span>
                    </div>
                    <button
                      onClick={() => router.push(`/learn/${course.id}`)}
                      className="px-4 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium touch-target"
                    >
                      {course.isPurchased ? 'Continue' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !searchQuery && <EmptyCoursesState />
        )}
      </section>
    </div>
  )
}
