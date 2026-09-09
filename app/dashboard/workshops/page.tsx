'use client'

import { useState, useEffect } from 'react'
import { GraduationCap, Plus, Search, Edit2, Trash2, RefreshCw, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Workshop {
  id: string
  title: string
  description: string
  image: string
  start_date: string
  duration: string
  language: string
  price: number
  instructor: string
  format: string
  seat_limit: number
  seats_remaining: number
  created_at: string
}

const FORMATS = ['online', 'in-person', 'hybrid']
const LANGUAGES = ['English', 'Kannada', 'Hindi', 'Sanskrit']
const INSTRUCTORS = ['Dr. Srinatha', 'Ravi Prabhakar', 'Sahana P R', 'Minu Sajji', 'Vinayaka Honnavar', 'Charanya', 'Hrishanth']

const defaultForm = {
  title: '', description: '', image: '',
  start_date: '', duration: '2 Hours', language: 'English',
  price: '', instructor: 'Dr. Srinatha', format: 'online',
  seat_limit: '25', seats_remaining: '',
}

export default function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/workshops')
      const json = await res.json()
      setWorkshops(json.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingWorkshop(null)
    setForm(defaultForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEdit = (w: Workshop) => {
    setEditingWorkshop(w)
    const localDate = w.start_date ? new Date(w.start_date).toISOString().slice(0, 16) : ''
    setForm({
      title: w.title, description: w.description || '', image: w.image || '',
      start_date: localDate, duration: w.duration || '2 Hours', language: w.language || 'English',
      price: String(w.price), instructor: w.instructor || 'Dr. Srinatha', format: w.format || 'online',
      seat_limit: String(w.seat_limit || 25), seats_remaining: String(w.seats_remaining ?? w.seat_limit ?? 25),
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.start_date) {
      setFormError('Title, price, and start date are required.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const payload = {
        title: form.title, description: form.description, image: form.image || undefined,
        start_date: form.start_date, duration: form.duration, language: form.language,
        price: parseFloat(form.price), instructor: form.instructor, format: form.format,
        seat_limit: parseInt(form.seat_limit), seats_remaining: form.seats_remaining ? parseInt(form.seats_remaining) : parseInt(form.seat_limit),
        ...(editingWorkshop ? { id: editingWorkshop.id } : {}),
      }
      const res = await fetch('/api/admin/workshops', {
        method: editingWorkshop ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); setFormError(err.error || 'Failed'); return }
      await load()
      setIsModalOpen(false)
    } catch { setFormError('Something went wrong.') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workshop?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/workshops?id=${id}`, { method: 'DELETE' })
      setWorkshops((prev) => prev.filter((w) => w.id !== id))
    } catch (e) { console.error(e) }
    finally { setDeleting(null) }
  }

  const filtered = workshops.filter((w) =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (d: string) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Workshops</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{workshops.length} total workshops</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={openAdd} className="bg-[#264020] hover:bg-[#1a2c15] text-white gap-2">
            <Plus className="w-4 h-4" /> Add Workshop
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#264020]/40" />
        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search workshops…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
      </div>

      <div className="bg-white rounded-2xl border border-[#264020]/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">Loading workshops…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <GraduationCap className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">No workshops found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#264020]/8 bg-[#F7F9F6]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Workshop</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Format</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Seats</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#264020]/5">
                {filtered.map((w) => {
                  const seatsLeft = w.seats_remaining ?? w.seat_limit
                  const isLow = seatsLeft <= 5
                  const isFull = seatsLeft <= 0
                  return (
                    <tr key={w.id} className="hover:bg-[#F7F9F6]/70 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-[#264020] line-clamp-1">{w.title}</p>
                          <p className="text-xs text-[#264020]/50 mt-0.5">{w.instructor} · {w.language}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#264020]/70 text-xs whitespace-nowrap">{formatDate(w.start_date)}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          w.format === 'online' ? 'bg-blue-50 text-blue-700' :
                          w.format === 'in-person' ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-50 text-purple-700'
                        }`}>{w.format}</span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#264020]">
                        {w.price === 0 ? 'Free' : `₹${w.price.toLocaleString()}`}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium ${isFull ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {isFull ? 'FULL' : `${seatsLeft} left`}
                        </span>
                        <span className="text-xs text-[#264020]/30 ml-1">/ {w.seat_limit}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(w)} className="p-2 text-[#264020]/60 hover:text-[#264020] hover:bg-[#264020]/8 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(w.id)} disabled={deleting === w.id} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#264020]/10 sticky top-0 bg-white z-10">
              <h2 className="font-serif text-xl font-bold text-[#264020]">
                {editingWorkshop ? 'Edit Workshop' : 'Add Workshop'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#264020]/40 hover:text-[#264020] rounded-lg">
                <X className="w-5 h-5" />
              </button>
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
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Start Date & Time *</label>
                <input type="datetime-local" value={form.start_date} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Price (₹) *</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Duration</label>
                  <input value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 2 Hours"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Format</label>
                  <select value={form.format} onChange={(e) => setForm(f => ({ ...f, format: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#264020]/20">
                    {FORMATS.map((f) => <option key={f} value={f} className="capitalize">{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Language</label>
                  <select value={form.language} onChange={(e) => setForm(f => ({ ...f, language: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#264020]/20">
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Seat Limit</label>
                  <input type="number" min="1" value={form.seat_limit} onChange={(e) => setForm(f => ({ ...f, seat_limit: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Seats Remaining</label>
                  <input type="number" min="0" value={form.seats_remaining} onChange={(e) => setForm(f => ({ ...f, seats_remaining: e.target.value }))}
                    placeholder="Auto = Seat Limit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Instructor</label>
                <select value={form.instructor} onChange={(e) => setForm(f => ({ ...f, instructor: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#264020]/20">
                  {INSTRUCTORS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 border-[#264020]/20 text-[#264020]">Cancel</Button>
                <Button type="submit" disabled={submitting} className="flex-1 bg-[#264020] hover:bg-[#1a2c15] text-white">
                  {submitting ? 'Saving…' : editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
