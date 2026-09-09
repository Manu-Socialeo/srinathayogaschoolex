'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Users, Plus, Search, Edit2, Trash2, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Teacher {
  id: string
  name: string
  role: string
  specialization: string
  bio?: string
  image: string
}

const ROLE_OPTIONS = [
  'Founder & Director', 'Methodology & Anatomy', 'Philosophy & Sound Healing',
  'Yin Yoga & Prenatal', 'Yoga Therapy & Ashtanga', 'Pranayama & Chair Yoga',
  'Ayurveda & Philosophy', 'Aerial Yoga & Marketing', 'Guest Teacher',
]

const defaultForm = {
  name: '', role: ROLE_OPTIONS[0], specialization: '', bio: '', image: '',
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/teachers')
      const json = await res.json()
      setTeachers(json.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingTeacher(null)
    setForm(defaultForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEdit = (t: Teacher) => {
    setEditingTeacher(t)
    setForm({ name: t.name, role: t.role, specialization: t.specialization || '', bio: t.bio || '', image: t.image || '' })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.role) { setFormError('Name and role are required.'); return }
    setSubmitting(true)
    setFormError('')
    try {
      const payload = { ...form, ...(editingTeacher ? { id: editingTeacher.id } : {}) }
      const res = await fetch('/api/admin/teachers', {
        method: editingTeacher ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); setFormError(err.error || 'Failed'); return }
      await load()
      setIsModalOpen(false)
    } catch { setFormError('Something went wrong.') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this teacher?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/teachers?id=${id}`, { method: 'DELETE' })
      setTeachers((prev) => prev.filter((t) => t.id !== id))
    } catch (e) { console.error(e) }
    finally { setDeleting(null) }
  }

  const filtered = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Faculty & Teachers</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{teachers.length} instructors registered</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={openAdd} className="bg-[#264020] hover:bg-[#1a2c15] text-white gap-2">
            <Plus className="w-4 h-4" /> Add Teacher
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#264020]/40" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search teachers…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
          <p className="text-[#264020]/50 text-sm">Loading…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-5 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F7F9F6]">
                <Image
                  src={teacher.image || '/teachers/Dr.Srinatha.webp'}
                  alt={teacher.name}
                  width={64} height={64}
                  className="w-full h-full object-cover"
                  onError={() => {}}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#264020] text-sm">{teacher.name}</p>
                <p className="text-xs text-[#264020]/60 mt-0.5 line-clamp-1">{teacher.role}</p>
                {teacher.specialization && (
                  <p className="text-[11px] text-[#264020]/40 mt-1 line-clamp-2">{teacher.specialization}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(teacher)} className="p-1.5 text-[#264020]/50 hover:text-[#264020] hover:bg-[#264020]/8 rounded-lg transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(teacher.id)} disabled={deleting === teacher.id} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center">
              <Users className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
              <p className="text-[#264020]/50 text-sm">No teachers found.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#264020]/10 sticky top-0 bg-white z-10">
              <h2 className="font-serif text-xl font-bold text-[#264020]">
                {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#264020]/40 hover:text-[#264020] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{formError}</div>}

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Role / Title *</label>
                <input value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} list="roles-list" required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                <datalist id="roles-list">
                  {ROLE_OPTIONS.map((r) => <option key={r} value={r} />)}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Specialization</label>
                <input value={form.specialization} onChange={(e) => setForm(f => ({ ...f, specialization: e.target.value }))}
                  placeholder="e.g. Hatha Yoga, Pranayama"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))} rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Photo Path</label>
                <input value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="/teachers/name.webp"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 border-[#264020]/20 text-[#264020]">Cancel</Button>
                <Button type="submit" disabled={submitting} className="flex-1 bg-[#264020] hover:bg-[#1a2c15] text-white">
                  {submitting ? 'Saving…' : editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
