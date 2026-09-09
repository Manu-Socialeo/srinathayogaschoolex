'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { ChevronLeft, CheckCircle, Play, Lock, Clock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@/lib/supabase'
import { getCurrentProfile } from '@/lib/auth'
import type { Database } from '@/lib/supabase-types'

type Lesson = Database['public']['Tables']['lessons']['Row']

export default function CoursePlayerPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<{ id: string; title: string; image: string; instructor: string } | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const sb = createBrowserClient()
      const [courseData, lessonsData, profile] = await Promise.all([
        sb.from('courses').select('id,title,image,instructor').eq('id', courseId).single(),
        sb.from('lessons').select('*').eq('course_id', courseId).order('order_index', { ascending: true }),
        getCurrentProfile(),
      ])

      if (courseData.data) setCourse(courseData.data)
      if (lessonsData.data) setLessons(lessonsData.data)

      if (profile) {
        const { data: enrollment } = await sb.from('enrollments').select('id').eq('user_id', profile.id).eq('course_id', courseId).maybeSingle()
        setIsEnrolled(!!enrollment)

        const { data: lp } = await sb.from('lesson_progress').select('lesson_id,completed').eq('user_id', profile.id).eq('course_id', courseId)
        if (lp) {
          const p: Record<string, boolean> = {}
          lp.forEach(l => { p[l.lesson_id] = l.completed })
          setProgress(p)
        }
      }

      if (lessonsData.data?.[0]) setCurrentLesson(lessonsData.data[0])
      setLoading(false)
    }
    load()
  }, [courseId])

  const handleLessonClick = async (lesson: Lesson) => {
    setCurrentLesson(lesson)

    const profile = await getCurrentProfile()
    if (!profile || progress[lesson.id]) return

    const sb = createBrowserClient()
    await sb.from('lesson_progress').upsert({
      user_id: profile.id,
      lesson_id: lesson.id,
      course_id: courseId,
      watched_seconds: 0,
      completed: false,
    }, { onConflict: 'user_id,lesson_id' })
  }

  const markComplete = async (lessonId: string) => {
    const profile = await getCurrentProfile()
    if (!profile) return
    const sb = createBrowserClient()
    await sb.from('lesson_progress').update({ completed: true }).eq('user_id', profile.id).eq('lesson_id', lessonId)
    setProgress(p => ({ ...p, [lessonId]: true }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
      </div>
    )
  }

  if (!course) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <p className="text-[#264020]/60">Course not found</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="bg-white border-b border-[#E5E5E5] px-4 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-[#264020]"><ChevronLeft size={24} /></Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-lg text-[#264020] truncate">{course.title}</h1>
          <p className="text-xs text-[#264020]/60">{course.instructor}</p>
        </div>
        {!isEnrolled && (
          <Link href={`/dashboard/courses/${courseId}`}>
            <Button className="bg-[#264020] hover:bg-[#3a5a30] text-white text-sm">Enroll Now</Button>
          </Link>
        )}
      </header>

      <div className="max-w-5xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {currentLesson ? (
            <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              {currentLesson.video_url ? (
                <iframe src={currentLesson.video_url} className="w-full h-full" allowFullScreen />
              ) : (
                <div className="text-center text-white/60">
                  <Play className="w-16 h-16 mx-auto mb-4 opacity-40" />
                  <p>{currentLesson.title}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-2xl aspect-video flex items-center justify-center border border-border/50">
              <Image src={course.image} alt={course.title} fill className="object-cover rounded-2xl" />
            </div>
          )}

          {currentLesson && (
            <div className="mt-4 bg-white rounded-xl p-6 border border-[#E5E5E5]">
              {progress[currentLesson.id] ? (
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <Button
                  onClick={() => markComplete(currentLesson.id)}
                  className="bg-[#264020] hover:bg-[#3a5a30] text-white text-sm mb-3"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" /> Mark as Complete
                </Button>
              )}
              <h2 className="font-serif text-xl text-[#264020] mb-2">{currentLesson.title}</h2>
              {currentLesson.description && (
                <p className="text-[#264020]/70 text-sm">{currentLesson.description}</p>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm text-[#264020]/60">
                <Clock className="w-4 h-4" />
                <span>{Math.floor((currentLesson.duration_seconds || 0) / 60)} min</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden lg:max-h-[70vh] lg:overflow-y-auto">
          <div className="p-4 border-b border-[#E5E5E5]">
            <h3 className="font-serif text-[#264020]">Course Content</h3>
            <p className="text-xs text-[#264020]/60">{lessons.length} lessons</p>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {lessons.map((lesson, i) => {
              const completed = progress[lesson.id]
              const isActive = currentLesson?.id === lesson.id
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`animate-fade-in-up w-full flex items-center gap-3 p-4 text-left transition-colors ${
                    isActive ? 'bg-[#264020]/5' : 'hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    completed ? 'bg-green-100 text-green-600' :
                    isActive ? 'bg-[#264020] text-white' :
                    'bg-[#FAF8F5] text-[#264020]/40'
                  }`}>
                    {completed ? <CheckCircle className="w-4 h-4" /> :
                     isActive ? <Play className="w-3 h-3" /> :
                     <Lock className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${isActive ? 'font-medium text-[#264020]' : 'text-[#264020]/70'}`}>
                      {i + 1}. {lesson.title}
                    </p>
                    <p className="text-xs text-[#264020]/40">{Math.floor((lesson.duration_seconds || 0) / 60)} min</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
