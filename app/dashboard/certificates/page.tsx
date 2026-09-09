'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Loader2, Award, Download, ChevronLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentProfile } from '@/lib/auth'
import { createBrowserClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase-types'

type Enrollment = Database['public']['Tables']['enrollments']['Row']
type Course = Database['public']['Tables']['courses']['Row']

export default function CertificatesPage() {
  const [loading, setLoading] = useState(true)
  const [certificates, setCertificates] = useState<(Enrollment & { course: Course | null })[]>([])

  useEffect(() => {
    async function load() {
      const profile = await getCurrentProfile()
      if (profile) {
        const supabase = createBrowserClient()
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('*')
          .eq('user_id', profile.id)
          .eq('progress', 100)
          .order('completed_at', { ascending: false })

        if (enrollments) {
          const courseIds = enrollments.map((e: any) => e.course_id)
          const { data: courses } = await supabase
            .from('courses')
            .select('*')
            .in('id', courseIds)

          const courseMap = new Map(courses?.map((c: any) => [c.id, c]) ?? [])
          setCertificates(
            enrollments.map(e => ({ ...e, course: courseMap.get(e.course_id) ?? null }))
          )
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Award className="w-8 h-8 text-[#264020]" />
          <h1 className="font-serif text-3xl text-[#264020]">My Certificates</h1>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-[#264020]/20 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-[#264020] mb-2">No certificates yet</h2>
            <p className="text-[#264020]/60 mb-6">Complete a course to earn your certificate.</p>
            <Link href="/dashboard"><Button className="bg-[#264020] hover:bg-[#3a5a30] text-white">Back to Dashboard</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.id}
                className="animate-fade-in-up bg-white rounded-xl p-5 border border-[#E5E5E5]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-[#264020]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#264020] truncate">{cert.course?.title ?? 'Unknown Course'}</h3>
                    {cert.completed_at && (
                      <p className="text-sm text-[#264020]/50 mt-1">
                        Completed {new Date(cert.completed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                    className="shrink-0 border-[#264020]/20 text-[#264020]/40 cursor-not-allowed"
                    title="Coming soon"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#264020]/60 text-sm hover:text-[#264020]">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
