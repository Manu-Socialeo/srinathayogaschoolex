'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react'
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

const SEED: Banner[] = [
  {
    id: '1', title: 'Transform Your Practice', subtitle: 'Join India\'s leading yoga teacher training', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    cta_label: 'Explore Courses', cta_link: '/courses', sort_order: 1, active: true,
  },
  {
    id: '2', title: 'Weekend Workshops', subtitle: 'Immersive yoga sessions every weekend', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    cta_label: 'View Workshops', cta_link: '/workshops', sort_order: 2, active: true,
  },
]

const defaultForm = { title: '', subtitle: '', image: '', cta_label: '', cta_link: '', sort_order: '1', active: true }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(SEED)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...defaultForm, sort_order: String(banners.length + 1) })
    setIsModalOpen(true)
  }

  const openEdit = (b: Banner) => {
    setEditingId(b.id)
    setForm({ title: b.title, subtitle: b.subtitle || '', image: b.image, cta_label: b.cta_label || '', cta_link: b.cta_link || '', sort_order: String(b.sort_order), active: b.active })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.image) return
    const payload = { ...form, sort_order: parseInt(form.sort_order) }
    if (editingId) {
      setBanners(prev => prev.map(b => b.id === editingId ? { ...b, ...payload } : b).sort((a, b) => a.sort_order - b.sort_order))
    } else {
      setBanners(prev => [...prev, { id: Date.now().toString(), ...payload }].sort((a, b) => a.sort_order - b.sort_order))
    }
    setIsModalOpen(false)
  }

  const toggleActive = (id: string) => setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b))
  const handleDelete = (id: string) => { if (!confirm('Delete banner?')) return; setBanners(prev => prev.filter(b => b.id !== id)) }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Banners</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{banners.length} banners · {banners.filter(b => b.active).length} active</p>
        </div>
        <Button onClick={openAdd} className="bg-[#264020] hover:bg-[#1a2c15] text-white gap-2">
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${banner.active ? 'border-[#264020]/10' : 'border-dashed border-[#264020]/15 opacity-60'}`}>
            <div className="relative h-36 bg-[#F7F9F6]">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
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
                <button onClick={() => toggleActive(banner.id)}>
                  {banner.active ? <ToggleRight className="w-7 h-7 text-emerald-500" /> : <ToggleLeft className="w-7 h-7 text-[#264020]/25" />}
                </button>
                <button onClick={() => openEdit(banner)} className="p-1.5 text-[#264020]/50 hover:text-[#264020] hover:bg-[#264020]/8 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[#264020]/10">
              <h2 className="font-serif text-xl font-bold text-[#264020]">{editingId ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#264020]/40 hover:text-[#264020] rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <Button type="submit" className="flex-1 bg-[#264020] hover:bg-[#1a2c15] text-white">{editingId ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
