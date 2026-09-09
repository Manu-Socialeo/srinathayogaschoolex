'use client'

import { ChevronRight, Award, Sparkles } from 'lucide-react'
import { SectionHeader, HorizontalScroll } from '@/components/app/section'
import { CourseCard } from '@/components/app/course-card'
import { WorkshopCard } from '@/components/app/workshop-card'
import { ProductCard } from '@/components/app/product-card'
import { TeacherCard } from '@/components/app/teacher-card'
import { teachers, announcements } from '@/lib/app-data'
import { fetchCourses, fetchWorkshops, fetchProducts, getEnrollments } from '@/lib/supabase-queries'
import { useAuth } from '@/components/auth-provider'
import type { Course, Workshop, Product } from '@/lib/app-data'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { HorizontalScrollSkeleton } from '@/components/app/ui-states'

export function HomeScreen() {
  const { profile } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set())
  const [enrollments, setEnrollments] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    Promise.all([fetchCourses(), fetchWorkshops(), fetchProducts()])
      .then(([c, w, p]) => {
        setCourses(c)
        setWorkshops(w)
        setProducts(p)
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

  const purchasedCourses = courses.filter(c => enrolledIds.has(c.id)).map(c => ({
    ...c,
    isPurchased: true,
    progress: enrollments.get(c.id) ?? 0,
  }))
  const continueLearning = purchasedCourses.filter(c => c.progress && c.progress > 0 && c.progress < 100)
  const completedCourses = purchasedCourses.filter(c => c.progress === 100)
  const recommendedCourses = courses.filter(c => !enrolledIds.has(c.id)).slice(0, 4)
  const featuredProducts = products.slice(0, 4)
  const featuredTeachers = teachers.slice(0, 4)
  const upcomingWorkshops = workshops.slice(0, 3)

  if (isLoading) {
    return (
      <div className="pb-4 space-y-6">
        <div className="px-4 pt-4">
          <div className="h-40 bg-muted rounded-2xl animate-pulse" />
        </div>
        <HorizontalScrollSkeleton count={3} type="course" />
        <HorizontalScrollSkeleton count={3} type="course" />
        <HorizontalScrollSkeleton count={2} type="workshop" />
        <HorizontalScrollSkeleton count={2} type="product" />
      </div>
    )
  }

  return (
    <div className="pb-4 space-y-6">
      {/* Welcome Banner */}
      <div className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary-foreground/80" />
              <span className="text-xs text-primary-foreground/80 font-medium">Yoga Alliance Certified</span>
            </div>
            <h1 className="font-serif text-2xl text-primary-foreground leading-tight">
              Traditional Mysore Yoga
            </h1>
            <p className="text-sm text-primary-foreground/80 mt-2">
              Taught online for the modern world by certified masters
            </p>
            <button className="mt-4 px-5 py-2 bg-white text-primary rounded-full text-sm font-medium flex items-center gap-1">
              Explore Programs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
              <path d="M50 10 C50 10 70 30 70 50 C70 65 60 75 50 85 C40 75 30 65 30 50 C30 30 50 10 50 10Z" />
              <circle cx="50" cy="90" r="5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      {continueLearning.length > 0 && (
        <section className="animate-fade-in">
          <SectionHeader
            title="Continue Learning"
            subtitle="Pick up where you left off"
          />
          <HorizontalScroll>
            {continueLearning.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                variant="compact"
                showProgress
              />
            ))}
          </HorizontalScroll>
        </section>
      )}

      {/* Purchased Courses */}
      {purchasedCourses.length > 0 && (
        <section className="animate-fade-in">
          <SectionHeader
            title="My Courses"
            subtitle={`${purchasedCourses.length} courses purchased`}
            showViewAll
          />
          <div className="px-4 space-y-3">
            {purchasedCourses.slice(0, 3).map(course => (
              <CourseCard
                key={course.id}
                course={course}
                variant="wide"
                showProgress
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <section className="animate-fade-in">
          <SectionHeader
            title="Completed"
            subtitle={`${completedCourses.length} courses finished`}
            showViewAll
          />
          <HorizontalScroll>
            {completedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                variant="compact"
              />
            ))}
          </HorizontalScroll>
        </section>
      )}

      {/* Stats Banner */}
      <div className="px-4">
        <div className="bg-ivory rounded-2xl p-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-serif text-2xl text-primary">200k+</p>
              <p className="text-xs text-muted-foreground mt-1">Lives Transformed</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-primary">1M+</p>
              <p className="text-xs text-muted-foreground mt-1">Participated</p>
            </div>
            <div>
              <p className="font-serif text-2xl text-primary">10+</p>
              <p className="text-xs text-muted-foreground mt-1">Years Teaching</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Workshops */}
      <section className="animate-fade-in">
        <SectionHeader
          title="Upcoming Workshops"
          subtitle="Live yoga programs"
          showViewAll
        />
        <HorizontalScroll>
          {upcomingWorkshops.map(workshop => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              variant="compact"
            />
          ))}
        </HorizontalScroll>
      </section>

      {/* Recommended Programs */}
      <section className="animate-fade-in">
        <SectionHeader
          title="Recommended For You"
          subtitle="Based on your interests"
          showViewAll
        />
        <HorizontalScroll>
          {recommendedCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </HorizontalScroll>
      </section>

      {/* Announcements */}
      <section className="animate-fade-in">
        <SectionHeader title="Announcements" />
        <HorizontalScroll>
          {announcements.map(announcement => (
            <div
              key={announcement.id}
              className="flex-shrink-0 w-72 snap-start bg-card rounded-xl overflow-hidden border border-border/50"
            >
              <div className="relative aspect-[2/1]">
                <Image
                  src={announcement.image}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[10px] text-white/80 uppercase tracking-wider">{announcement.date}</span>
                  <h3 className="font-serif text-base text-white">{announcement.title}</h3>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{announcement.description}</p>
              </div>
            </div>
          ))}
        </HorizontalScroll>
      </section>

      {/* Featured Products */}
      <section className="animate-fade-in">
        <SectionHeader
          title="Yoga Store"
          subtitle="Books, mats & more"
          showViewAll
        />
        <HorizontalScroll>
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              variant="compact"
            />
          ))}
        </HorizontalScroll>
      </section>

      {/* Meet The Teachers */}
      <section className="animate-fade-in">
        <SectionHeader
          title="Meet The Educators"
          subtitle="Leading Srinatha Yoga School"
          showViewAll
        />
        <HorizontalScroll>
          {featuredTeachers.map(teacher => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
            />
          ))}
        </HorizontalScroll>
      </section>

      {/* Certifications */}
      <div className="px-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-full border border-border/50">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Yoga Alliance RYS</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-full border border-border/50">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-foreground">YACP Certified</span>
          </div>
        </div>
      </div>
    </div>
  )
}
