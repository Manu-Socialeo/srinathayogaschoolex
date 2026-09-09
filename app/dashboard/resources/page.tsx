'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Loader2, FileText, Download, Headphones, Video, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createBrowserClient } from '@/lib/supabase'
import { useAuth } from '@/components/auth-provider'
import type { Database } from '@/lib/supabase-types'

type TTCResource = Database['public']['Tables']['ttc_resources']['Row']

const typeConfig = {
  pdf: { icon: FileText, label: 'PDF' },
  audio: { icon: Headphones, label: 'Audio' },
  video: { icon: Video, label: 'Video' },
} as const

export default function ResourcesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState<TTCResource[]>([])

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/dashboard/login'); return }
    async function load() {
      const supabase = createBrowserClient()
      const { data } = await supabase
        .from('ttc_resources')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setResources(data)
      setLoading(false)
    }
    load()
  }, [user, authLoading, router])

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#264020] animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-[#264020]" />
          <h1 className="font-serif text-3xl text-[#264020]">Resources</h1>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-[#264020]/20 mx-auto mb-4" />
            <h2 className="font-serif text-xl text-[#264020] mb-2">No resources available yet</h2>
            <p className="text-[#264020]/60 mb-6">Resources will appear here once they are added.</p>
            <Link href="/dashboard"><Button className="bg-[#264020] hover:bg-[#3a5a30] text-white">Back to Dashboard</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {resources.map(resource => {
              const config = typeConfig[resource.type] ?? typeConfig.pdf
              const Icon = config.icon
              const meta = resource.type === 'video' || resource.type === 'audio' ? resource.duration : resource.size
              return (
                <div key={resource.id}
                  className="animate-fade-in-up bg-white rounded-xl p-5 border border-[#E5E5E5]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#264020]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-[#264020]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#264020]/10 text-[#264020] font-medium">{config.label}</span>
                      </div>
                      <h3 className="font-semibold text-[#264020]">{resource.title}</h3>
                      {resource.description && (
                        <p className="text-sm text-[#264020]/60 mt-1">{resource.description}</p>
                      )}
                      {meta && <p className="text-xs text-[#264020]/40 mt-1">{meta}</p>}
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
              )
            })}
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
