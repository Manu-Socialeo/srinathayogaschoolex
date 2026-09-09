'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Clock, Award, Star, CheckCircle, Loader2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCourse, getLessons, getEnrollments } from '@/lib/supabase-queries'
import { getCurrentProfile } from '@/lib/auth'
import { useCart } from '@/components/cart/cart-context'
import type { Database } from '@/lib/supabase-types'

type Course = Database['public']['Tables']['courses']['Row']
type Lesson = Database['public']['Tables']['lessons']['Row']

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    async function load() {
      const [courseData, lessonsData] = await Promise.all([
        getCourse(courseId),
        getLessons(courseId),
      ])
      setCourse(courseData)
      setLessons(lessonsData)

      const profile = await getCurrentProfile()
      if (profile) {
        const enrollments = await getEnrollments(profile.id)
        setIsEnrolled(enrollments.some(e => e.course_id === courseId))
      }

      setLoading(false)
    }
    load()
  }, [courseId])

  const handleEnroll = () => {
    if (!course) return
    setAdding(true)
    addItem({
      id: course.id,
      type: 'course',
      title: course.title,
      price: course.price,
      image: course.image,
      quantity: 1,
    })
    setAddedToCart(true)
    setAdding(false)
    router.push('/dashboard/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#264020]/60 mb-4">Course not found</p>
          <Link href="/courses"><Button className="bg-[#264020] text-white">Browse Courses</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/courses" className="inline-flex items-center gap-2 text-[#264020]/60 hover:text-[#264020] mb-6 transition-colors">
          <ChevronLeft size={20} /><span>Back to Courses</span>
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
              <Image src={course.image} alt={course.title} fill className="object-cover" />
            </div>

            <h1 className="font-serif text-3xl text-[#264020] mb-2">{course.title}</h1>
            {course.subtitle && (
              <p className="text-[#264020]/60 text-lg mb-4">{course.subtitle}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#264020]/70 mb-6">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-[#264020] text-[#264020]" /> {course.rating} ({course.reviews_count} reviews)</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
              <span className="flex items-center gap-1"><Award className="w-4 h-4" /> {course.level}</span>
              <span>{course.instructor}</span>
            </div>

            {course.certificate_eligible && (
              <div className="flex items-center gap-2 bg-[#264020]/5 text-[#264020] text-sm px-4 py-2 rounded-xl mb-6">
                <Award className="w-4 h-4" />
                Certificate eligible on completion
              </div>
            )}

            <div className="prose max-w-none mb-8">
              <p className="text-[#264020]/80 leading-relaxed">{course.description}</p>
            </div>

            {lessons.length > 0 && (
              <div>
                <h2 className="font-serif text-xl text-[#264020] mb-4">Course Content ({lessons.length} lessons)</h2>
                <div className="space-y-2">
                  {lessons.map((lesson, i) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl">
                      <span className="w-7 h-7 bg-[#264020] text-white text-xs rounded-full flex items-center justify-center font-medium">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#264020]">{lesson.title}</p>
                        {lesson.description && (
                          <p className="text-xs text-[#264020]/60">{lesson.description}</p>
                        )}
                      </div>
                      {lesson.video_url && <Play className="w-4 h-4 text-[#264020]/40" />}
                      {lesson.duration_seconds > 0 && (
                        <span className="text-xs text-[#264020]/40">{Math.floor(lesson.duration_seconds / 60)} min</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="bg-[#FAF8F5] rounded-2xl p-6 sticky top-24">
              <p className="text-3xl font-bold text-[#264020] mb-2">₹{course.price.toLocaleString()}</p>

              {isEnrolled ? (
                <Link href={`/learn/${courseId}`}>
                  <Button className="w-full bg-[#264020] hover:bg-[#3a5a30] text-white py-4 text-lg mt-4">
                    <Play className="w-5 h-5 mr-2" /> Continue Learning
                  </Button>
                </Link>
              ) : addedToCart ? (
                <Link href="/dashboard/checkout">
                  <Button className="w-full bg-[#264020] hover:bg-[#3a5a30] text-white py-4 text-lg mt-4">
                    Proceed to Checkout
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleEnroll}
                  disabled={adding}
                  className="w-full bg-[#264020] hover:bg-[#3a5a30] text-white py-4 text-lg mt-4"
                >
                  {adding ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Enroll Now'}
                </Button>
              )}

              <ul className="space-y-3 mt-6">
                {course.certificate_eligible && (
                  <li className="flex items-center gap-2 text-sm text-[#264020]/70"><CheckCircle className="w-4 h-4 text-[#264020]" /> Yoga Alliance Certified</li>
                )}
                <li className="flex items-center gap-2 text-sm text-[#264020]/70"><CheckCircle className="w-4 h-4 text-[#264020]" /> {lessons.length} video lessons</li>
                <li className="flex items-center gap-2 text-sm text-[#264020]/70"><CheckCircle className="w-4 h-4 text-[#264020]" /> Full lifetime access</li>
                <li className="flex items-center gap-2 text-sm text-[#264020]/70"><CheckCircle className="w-4 h-4 text-[#264020]" /> Access on mobile & desktop</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
