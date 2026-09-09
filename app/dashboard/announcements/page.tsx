'use client'

import { useState } from 'react'
import { Megaphone, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Announcement {
  id: string
  title: string
  description: string
  image?: string
  date: string
  published: boolean
}

// Client-only local state (since no Supabase `announcements` table exists yet)
const SEED: Announcement[] = [
  {
    id: '1',
    title: 'New 200-Hour TTC Batch Starting October 2026',
    description: 'We are excited to announce our next intensive Teacher Training Program. Early bird discounts available for registrations before September 30.',
    date: '2026-09-01',
    published: true,
  },
  {
    id: '2',
    title: 'School Closed for Navratri – October 2–11',
    description: 'The school and all online classes will be on a break during Navratri. Regular classes resume on October 12.',
    date: '2026-09-20',
    published: true,
  },
]

const defaultForm = { title: '', description: '', image: '', date: '', published: true }

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(SEED)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState('')

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...defaultForm, date: new Date().toISOString().split('T')[0] })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEdit = (a: Announcement) => {
    setEditingId(a.id)
    setForm({ title: a.title, description: a.description, image: a.image || '', date: a.date, published: a.published })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.date) { setFormError('Title and date are required.'); return }
    if (editingId) {
      setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : a))
    } else {
      setAnnouncements(prev => [{ id: Date.now().toString(), ...form }, ...prev])
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this announcement?')) return
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  const togglePublish = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, published: !a.published } : a))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Announcements</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{announcements.length} announcements · {announcements.filter(a => a.published).length} published</p>
        </div>
        <Button onClick={openAdd} className="bg-[#264020] hover:bg-[#1a2c15] text-white gap-2">
          <Plus className="w-4 h-4" /> New Announcement
        </Button>
      </div>

      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className={`bg-white rounded-2xl border shadow-sm p-5 flex gap-4 transition-all ${ann.published ? 'border-[#264020]/10' : 'border-dashed border-[#264020]/20 opacity-70'}`}>
            <div className="w-10 h-10 rounded-xl bg-[#264020]/8 flex items-center justify-center flex-shrink-0">
              <Megaphone className="w-5 h-5 text-[#264020]/60" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[#264020]">{ann.title}</p>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(ann.id)}>
                    {ann.published
                      ? <ToggleRight className="w-7 h-7 text-emerald-500" />
                      : <ToggleLeft className="w-7 h-7 text-[#264020]/25" />}
                  </button>
                  <button onClick={() => openEdit(ann)} className="p-1.5 text-[#264020]/50 hover:text-[#264020] hover:bg-[#264020]/8 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#264020]/60 mt-1 line-clamp-2">{ann.description}</p>
              <p className="text-xs text-[#264020]/40 mt-2">{ann.date}</p>
            </div>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#264020]/10">
            <Megaphone className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">No announcements yet.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[#264020]/10">
              <h2 className="font-serif text-xl font-bold text-[#264020]">{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#264020]/40 hover:text-[#264020] rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{formError}</div>}
              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Title *</label>
                <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Date *</label>
                <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                  {form.published ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-[#264020]/30" />}
                </button>
                <span className="text-sm text-[#264020] font-medium">{form.published ? 'Published' : 'Draft'}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 border-[#264020]/20 text-[#264020]">Cancel</Button>
                <Button type="submit" className="flex-1 bg-[#264020] hover:bg-[#1a2c15] text-white">
                  {editingId ? 'Update' : 'Publish'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
