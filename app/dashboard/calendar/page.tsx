'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { Loader2, Calendar as CalendarIcon, Clock, MapPin, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentProfile } from '@/lib/auth'
import { createBrowserClient } from '@/lib/supabase'

export default function CalendarPage() {
  const [loading, setLoading] = useState(true)
  const [workshops, setWorkshops] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const profile = await getCurrentProfile()
      if (profile) {
        const supabase = createBrowserClient()
        const { data: registrations } = await supabase
          .from('workshop_registrations')
          .select('workshop_id, status')
          .eq('user_id', profile.id)
          .eq('status', 'registered')

        if (registrations && registrations.length > 0) {
          const workshopIds = registrations.map((r: any) => r.workshop_id)
          const { data: workshopData } = await supabase
            .from('workshops')
            .select('*')
            .in('id', workshopIds)

          if (workshopData) {
            const now = new Date()
            const upcoming = workshopData
              .filter((w: any) => new Date(w.start_date) >= now)
              .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            setWorkshops(upcoming)
          }
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const getCountdown = (startDate: string) => {
    const diff = new Date(startDate).getTime() - Date.now()
    if (diff <= 0) return 'Starting soon'
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <CalendarIcon className="w-8 h-8 text-[#264020]" />
          <h1 className="font-serif text-3xl text-[#264020]">My Schedule</h1>
        </div>

        {workshops.length === 0 ? (
          <div className="text-center py-20">
            <CalendarIcon className="w-16 h-16 text-[#264020]/20 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-[#264020] mb-2">No upcoming events</h2>
            <p className="text-[#264020]/60 mb-6">Register for a workshop to see it here.</p>
            <Link href="/dashboard"><Button className="bg-[#264020] hover:bg-[#3a5a30] text-white">Back to Dashboard</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {workshops.map(workshop => (
              <div key={workshop.id}
                className="animate-fade-in-up bg-white rounded-xl p-5 border border-[#E5E5E5]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-6 h-6 text-[#264020]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#264020]">{workshop.title}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-[#264020]/60">
                      <span className="inline-flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(workshop.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {workshop.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {workshop.format}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-[#264020]/10 text-[#264020]">
                      {getCountdown(workshop.start_date)}
                    </span>
                  </div>
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
