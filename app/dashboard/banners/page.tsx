'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  cta_label?: string
  cta_link?: string
  sort_order: number
  active: boolean
}

const defaultForm = { title: '', subtitle: '', image: '', cta_label: '', cta_link: '', sort_order: '1', active: true }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/banners')
      const json = await res.json()
      setBanners(json.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...defaultForm, sort_order: String(banners.length + 1) })
    setFormError('')
    setIsModalOpen(true)
  }

  const openEdit = (b: Banner) => {
    setEditingId(b.id)
    setForm({ title: b.title, subtitle: b.subtitle || '', image: b.image, cta_label: b.cta_label || '', cta_link: b.cta_link || '', sort_order: String(b.sort_order), active: b.active })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.image) { setFormError('Title and image are required.'); return }
    setSubmitting(true)
    setFormError('')
    try {
      const payload = { ...form, sort_order: parseInt(form.sort_order), ...(editingId ? { id: editingId } : {}) }
      const res = await fetch('/api/admin/banners', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { const err = await res.json(); setFormError(err.error || 'Failed'); return }
      await load()
      setIsModalOpen(false)
    } catch { setFormError('Something went wrong.') }
    finally { setSubmitting(false) }
  }

  const toggleActive = async (banner: Banner) => {
    setToggling(banner.id)
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, active: !banner.active }),
      })
      if (res.ok) {
        setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, active: !b.active } : b))
      }
    } catch (e) { console.error(e) }
    finally { setToggling(null) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete banner?')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' })
      setBanners(prev => prev.filter(b => b.id !== id))
    } catch (e) { console.error(e) }
    finally { setDeleting(null) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Banners</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{banners.length} banners · {banners.filter(b => b.active).length} active</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={openAdd} className="bg-[#264020] hover:bg-[#1a2c15] text-white gap-2">
            <Plus className="w-4 h-4" /> Add Banner
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
          <p className="text-[#264020]/50 text-sm">Loading…</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div key={banner.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${banner.active ? 'border-[#264020]/10' : 'border-dashed border-[#264020]/15 opacity-60'}`}>
              <div className="relative h-36 bg-[#F7F9F6]">
                {banner.image && (
                  <Image src={banner.image} alt={banner.title} fill className="object-cover"
                    unoptimized={banner.image.startsWith('http')} />
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${banner.active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {banner.active ? 'LIVE' : 'OFF'}
                  </span>
                  <span className="px-2 py-0.5 bg-black/50 text-white text-[10px] font-bold rounded-full">#{banner.sort_order}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-[#264020]">{banner.title}</p>
                {banner.subtitle && <p className="text-xs text-[#264020]/60 mt-0.5">{banner.subtitle}</p>}
                {banner.cta_link && <p className="text-xs text-[#264020]/40 mt-1">{banner.cta_label} → {banner.cta_link}</p>}
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => toggleActive(banner)} disabled={toggling === banner.id} className="disabled:opacity-50">
                    {banner.active ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-[#264020]/25" />}
                  </button>
                  <button onClick={() => openEdit(banner)} className="p-1.5 text-[#264020]/50 hover:text-[#264020] hover:bg-[#264020]/8 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} disabled={deleting === banner.id} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="col-span-2 py-16 text-center bg-white rounded-2xl border border-[#264020]/10">
              <ImageIcon className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
              <p className="text-[#264020]/50 text-sm">No banners yet. Add your first one.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[#264020]/10">
              <h2 className="font-serif text-xl font-bold text-[#264020]">{editingId ? 'Edit Banner' : 'New Banner'}</h2>
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
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Image URL *</label>
                <input value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">CTA Label</label>
                  <input value={form.cta_label} onChange={(e) => setForm(f => ({ ...f, cta_label: e.target.value }))}
                    placeholder="e.g. Learn More"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">CTA Link</label>
                  <input value={form.cta_link} onChange={(e) => setForm(f => ({ ...f, cta_link: e.target.value }))}
                    placeholder="/courses"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Sort Order</label>
                <input type="number" min="1" value={form.sort_order} onChange={(e) => setForm(f => ({ ...f, sort_order: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                  {form.active ? <ToggleRight className="w-9 h-9 text-emerald-500" /> : <ToggleLeft className="w-9 h-9 text-[#264020]/30" />}
                </button>
                <span className="text-sm text-[#264020] font-medium">{form.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 border-[#264020]/20 text-[#264020]">Cancel</Button>
                <Button type="submit" disabled={submitting} className="flex-1 bg-[#264020] hover:bg-[#1a2c15] text-white">
                  {submitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
