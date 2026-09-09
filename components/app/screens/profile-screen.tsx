'use client'

import {
  ChevronRight,
  Settings,
  ShoppingBag,
  BookOpen,
  Award,
  Heart,
  FileText,
  Headphones,
  LogOut,
  Bell,
  HelpCircle,
  Mail,
  Video,
  Download,
  CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getCurrentProfile, getCurrentUser, signOut } from '@/lib/auth'
import { getEnrollments, getOrders, getSavedItems, getTTCResources } from '@/lib/supabase-queries'
import { fetchCourses } from '@/lib/supabase-queries'
import type { Profile } from '@/lib/supabase-types'
import type { Course as AppCourse } from '@/lib/app-data'
import type { TTCResource as DBTTCResource } from '@/lib/supabase-types'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { LoadingScreen, ErrorScreen } from '@/components/app/ui-states'

export function ProfileScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [authEmail, setAuthEmail] = useState<string | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<AppCourse[]>([])
  const [memberSince, setMemberSince] = useState('')
  const [ttcResources, setTtcResources] = useState<DBTTCResource[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const user = await getCurrentUser()
        if (cancelled) return
        if (!user) { setError('Not signed in'); return }
        setAuthEmail(user.email || null)

        const prof = await getCurrentProfile()
        if (cancelled) return
        setProfile(prof)
        setMemberSince(new Date(prof?.created_at || user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }))

        if (!prof) { setIsLoading(false); return }

        const [allCourses, enrollments, orders, saved, resources] = await Promise.all([
          fetchCourses(),
          getEnrollments(prof.id),
          getOrders(prof.id),
          getSavedItems(prof.id),
          getTTCResources(),
        ])
        if (cancelled) return

        const enrolledIds = new Set(enrollments.map(e => e.course_id))
        setEnrolledCourses(allCourses.filter(c => enrolledIds.has(c.id)))
        setOrderCount(orders.length)
        setSavedCount(saved.length)
        setTtcResources(resources)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const completedCourses = enrolledCourses.filter(c => c.progress === 100)

  const passwordDone = profile?.password_set === true
  const phoneDone = !!profile?.phone
  const addressDone = !!profile?.address
  const pct = (passwordDone ? 50 : 0) + (phoneDone ? 25 : 0) + (addressDone ? 25 : 0)
  const allDone = pct === 100
  const segments = [passwordDone, phoneDone, addressDone]

  const menuItems = [
    { icon: ShoppingBag, label: 'Order History', count: orderCount },
    { icon: BookOpen, label: 'My Courses', count: enrolledCourses.length },
    { icon: Award, label: 'Certificates', count: completedCourses.length },
    { icon: Heart, label: 'Saved Content', count: savedCount },
    { icon: FileText, label: 'TTC Resources', count: ttcResources.length },
    { icon: Headphones, label: 'Audio Library', count: ttcResources.filter(r => r.type === 'audio').length },
  ]

  const settingsItems = [
    { icon: Bell, label: 'Notifications' },
    { icon: Settings, label: 'Account Settings', onClick: () => router.push('/dashboard/account') },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: Mail, label: 'Contact Us' },
  ]

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText
      case 'audio': return Headphones
      case 'video': return Video
      default: return Download
    }
  }

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 text-red-600'
      case 'audio': return 'bg-purple-50 text-purple-600'
      case 'video': return 'bg-blue-50 text-blue-600'
      default: return 'bg-orange-50 text-orange-600'
    }
  }

  if (isLoading) return <LoadingScreen />
  if (error) return <ErrorScreen message={error} />

  return (
    <div className="pb-4 space-y-6">
      {/* Profile Header */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-sm">
            <Image
              src={profile?.avatar_url || '/placeholder-user.jpg'}
              alt={profile?.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-xl text-foreground truncate">{profile?.name || authEmail?.split('@')[0] || 'User'}</h1>
            <p className="text-sm text-muted-foreground truncate">{profile?.email || authEmail}</p>
            <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
          </div>
          <button onClick={() => router.push('/dashboard/account')} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center touch-target transition-transform active:scale-95">
            <Settings className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 card-interactive">
            <p className="font-serif text-2xl text-primary">{enrolledCourses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Courses</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 card-interactive">
            <p className="font-serif text-2xl text-primary">{completedCourses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 card-interactive">
            <p className="font-serif text-2xl text-accent">{completedCourses.filter(c => c.certificateEligible).length}</p>
            <p className="text-xs text-muted-foreground mt-1">Certificates</p>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="px-4">
        {allDone ? (
          <button onClick={() => router.push('/dashboard/account')}
            className="w-full bg-card rounded-xl border border-border/50 p-3 flex items-center justify-between card-interactive">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Profile Complete</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : (
          <div className="bg-card rounded-xl border border-border/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Profile Completion</span>
              <div className="flex gap-1">
                {segments.map((done, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${done ? 'bg-primary' : 'bg-border'}`} />
                ))}
              </div>
            </div>
            <div className="relative h-2 bg-secondary rounded-full mb-3 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-foreground">Name</span>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/account')}
                className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {passwordDone
                    ? <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    : <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/></svg>}
                  <span className="text-xs text-foreground">Set Password</span>
                </div>
                <span className="text-xs text-primary font-medium">{passwordDone ? 'Done' : 'Set'}</span>
              </button>
              <button onClick={() => router.push('/dashboard/account')}
                className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {phoneDone
                    ? <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    : <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/></svg>}
                  <span className="text-xs text-foreground">Add Phone</span>
                </div>
                <span className="text-xs text-primary font-medium">{phoneDone ? 'Done' : 'Add'}</span>
              </button>
              <button onClick={() => router.push('/dashboard/account')}
                className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {addressDone
                    ? <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    : <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/></svg>}
                  <span className="text-xs text-foreground">Add Address</span>
                </div>
                <span className="text-xs text-primary font-medium">{addressDone ? 'Done' : 'Add'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4">
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50 overflow-hidden">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between p-4 touch-target transition-colors active:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-sm text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count !== undefined && (
                  <span className="px-2.5 py-1 bg-secondary rounded-full text-xs font-medium text-muted-foreground">
                    {item.count}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* TTC Resources Preview */}
      {ttcResources.length > 0 && (
        <div className="px-4">
          <h2 className="font-serif text-lg text-foreground mb-3">TTC Resources</h2>
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50 overflow-hidden">
            {ttcResources.slice(0, 3).map((resource) => {
              const Icon = getResourceIcon(resource.type)
              const colorClass = getResourceColor(resource.type)

              return (
                <button
                  key={resource.id}
                  className="w-full flex items-center justify-between p-4 touch-target transition-colors active:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm text-foreground">{resource.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="px-4">
        <h2 className="font-serif text-lg text-foreground mb-3">Settings</h2>
        <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/50 overflow-hidden">
          {settingsItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center justify-between p-4 touch-target transition-colors active:bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-destructive text-destructive rounded-xl text-sm font-medium touch-target transition-colors active:bg-destructive/5"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 text-center pt-2">
        <p className="text-xs font-medium text-foreground">Srinatha Yoga School</p>
        <p className="text-xs text-muted-foreground mt-1">Mysore, Karnataka, India</p>
        <p className="text-xs text-muted-foreground mt-0.5">+91 98865 12083</p>
        <p className="text-[10px] text-muted-foreground/60 mt-3">Version 1.0.0</p>
      </div>
    </div>
  )
}
