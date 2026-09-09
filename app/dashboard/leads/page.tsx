'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, RefreshCw, Search, Trash2, Mail, User, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Lead {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  created_at: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Lead | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/leads')
      const json = await res.json()
      setLeads(json.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return
    setDeleting(id)
    if (selected?.id === id) setSelected(null)
    try {
      await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' })
      setLeads((prev) => prev.filter((l) => l.id !== id))
    } catch (e) { console.error(e) }
    finally { setDeleting(null) }
  }

  const filtered = leads.filter((l) =>
    l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Leads & Inquiries</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{leads.length} contact {leads.length === 1 ? 'inquiry' : 'inquiries'} received</p>
        </div>
        <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#264020]/40" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search leads…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Lead List */}
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-5'} bg-white rounded-2xl border border-[#264020]/10 shadow-sm overflow-hidden`}>
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
              <p className="text-[#264020]/50 text-sm">Loading inquiries…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
              <p className="text-[#264020]/50 text-sm">No inquiries yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#264020]/5">
              {filtered.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => setSelected(selected?.id === lead.id ? null : lead)}
                  className={`p-4 cursor-pointer hover:bg-[#F7F9F6]/80 transition-colors ${selected?.id === lead.id ? 'bg-[#264020]/5 border-l-2 border-[#264020]' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#264020]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-[#264020]">{lead.name?.charAt(0)?.toUpperCase() || '?'}</span>
                        </div>
                        <p className="font-semibold text-[#264020] text-sm truncate">{lead.name}</p>
                      </div>
                      <p className="text-xs text-[#264020]/60 mt-1 ml-9 truncate">{lead.email}</p>
                      {lead.subject && <p className="text-xs font-medium text-[#264020]/80 mt-0.5 ml-9 truncate">{lead.subject}</p>}
                      <p className="text-xs text-[#264020]/40 mt-0.5 ml-9 line-clamp-1">{lead.message}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[10px] text-[#264020]/40 whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(lead.id) }}
                        disabled={deleting === lead.id}
                        className="mt-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead Detail Pane */}
        {selected && (
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif font-bold text-lg text-[#264020]">{selected.name}</h2>
                <p className="text-sm text-[#264020]/60">{selected.subject || 'General Inquiry'}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-xs text-[#264020]/40 hover:text-[#264020] px-2 py-1 rounded-lg hover:bg-[#264020]/5">
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-[#264020]/70">
                <User className="w-4 h-4 flex-shrink-0" />
                <span>{selected.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[#264020]/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${selected.email}`} className="text-[#264020] underline">{selected.email}</a>
              </div>
              <div className="flex items-center gap-2 text-[#264020]/50">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDate(selected.created_at)}</span>
              </div>
            </div>

            <div className="bg-[#F7F9F6] rounded-xl p-4">
              <p className="text-xs font-semibold text-[#264020]/50 uppercase tracking-wider mb-2">Message</p>
              <p className="text-sm text-[#264020]/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>

            <a
              href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Inquiry'} - Srinatha Yoga School`}
              className="inline-flex items-center gap-2 bg-[#264020] hover:bg-[#1a2c15] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4" /> Reply via Email
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
