'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen, Plus, Search, Edit2, Trash2, RefreshCw, X, CheckCircle2, XCircle, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  price: number
  duration: string
  lessons_count: number
  level: string
  instructor: string
  image: string
  rating: number
  certificate_eligible: boolean
  published: boolean
  created_at: string
}

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Teacher Training', 'All Levels']
const INSTRUCTORS = ['Dr. Srinatha', 'Ravi Prabhakar', 'Sahana P R', 'Minu Sajji', 'Vinayaka Honnavar', 'Charanya', 'Hrishanth']

const defaultForm = {
  title: '', subtitle: '', description: '', price: '', duration: '4 Weeks',
  lessons_count: '20', level: 'Beginner', instructor: 'Dr. Srinatha', image: '', published: true,
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [formError, setFormError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/courses')
      const json = await res.json()
      setCourses(json.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingCourse(null)
    setForm(defaultForm)
    setFormError('')
    setIsModalOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setForm({
      title: course.title,
      subtitle: course.subtitle || '',
      description: course.description || '',
      price: String(course.price),
      duration: course.duration || '4 Weeks',
      lessons_count: String(course.lessons_count || 20),
      level: course.level || 'Beginner',
      instructor: course.instructor || 'Dr. Srinatha',
      image: course.image || '',
      published: course.published ?? true,
    })
    setFormError('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price) {
      setFormError('Title and price are required.')
      return
    }
    setSubmitting(true)
    setFormError('')
    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        price: parseFloat(form.price),
        duration: form.duration,
        lessons_count: parseInt(form.lessons_count),
        level: form.level,
        instructor: form.instructor,
        image: form.image || undefined,
        published: form.published,
        ...(editingCourse ? { id: editingCourse.id } : {}),
      }
      const method = editingCourse ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/courses', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const e = await res.json()
        setFormError(e.error || 'Failed to save course.')
        return
      }
      await load()
      setIsModalOpen(false)
    } catch {
      setFormError('Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course? This cannot be undone.')) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' })
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
    }
  }

  const togglePublish = async (course: Course) => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: course.id, published: !course.published }),
      })
      if (res.ok) {
        setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, published: !c.published } : c))
      }
    } catch (e) { console.error(e) }
  }

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Courses</h1>
          <p className="text-[#264020]/60 text-sm mt-1">{courses.length} total · {courses.filter(c => c.published).length} published</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={load} variant="outline" className="border-[#264020]/20 text-[#264020] hover:bg-[#264020]/5 gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button onClick={openAdd} className="bg-[#264020] hover:bg-[#1a2c15] text-white gap-2">
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#264020]/40" />
        <input
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#264020]/15 bg-white text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#264020]/10 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center">
            <RefreshCw className="w-8 h-8 text-[#264020]/30 animate-spin mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">Loading courses…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="w-10 h-10 text-[#264020]/20 mx-auto mb-3" />
            <p className="text-[#264020]/50 text-sm">{searchQuery ? 'No courses match your search' : 'No courses yet. Add your first course.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#264020]/8 bg-[#F7F9F6]">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Course</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Instructor</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Level</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Lessons</th>
                  <th className="px-5 py-3.5 text-center text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Published</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-[#264020]/50 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#264020]/5">
                {filtered.map((course) => (
                  <tr key={course.id} className="hover:bg-[#F7F9F6]/70 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-[#264020] line-clamp-1">{course.title}</p>
                        {course.subtitle && <p className="text-xs text-[#264020]/50 mt-0.5 line-clamp-1">{course.subtitle}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#264020]/70 whitespace-nowrap">{course.instructor}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-[#264020]/8 text-[#264020] rounded-full text-xs font-medium capitalize">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#264020]">
                      {course.price === 0 ? 'Free' : `₹${course.price.toLocaleString()}`}
                    </td>
                    <td className="px-5 py-4 text-[#264020]/70">{course.lessons_count}</td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => togglePublish(course)} className="inline-flex">
                        {course.published
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          : <XCircle className="w-5 h-5 text-[#264020]/25" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(course)} className="p-2 text-[#264020]/60 hover:text-[#264020] hover:bg-[#264020]/8 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(course.id)} disabled={deleting === course.id} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#264020]/10 sticky top-0 bg-white z-10">
              <h2 className="font-serif text-xl font-bold text-[#264020]">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#264020]/40 hover:text-[#264020] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{formError}</div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Title *</label>
                <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Subtitle</label>
                <input value={form.subtitle} onChange={(e) => setForm(f => ({ ...f, subtitle: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Price (₹) *</label>
                  <input type="number" min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Duration</label>
                  <input value={form.duration} onChange={(e) => setForm(f => ({ ...f, duration: e.target.value }))}
                    placeholder="e.g. 4 Weeks"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Level</label>
                  <select value={form.level} onChange={(e) => setForm(f => ({ ...f, level: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20 bg-white">
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Lessons Count</label>
                  <input type="number" min="1" value={form.lessons_count} onChange={(e) => setForm(f => ({ ...f, lessons_count: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Instructor</label>
                <select value={form.instructor} onChange={(e) => setForm(f => ({ ...f, instructor: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20 bg-white">
                  {INSTRUCTORS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Image URL</label>
                <input value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))}
                  placeholder="https://… (leave blank for default)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20" />
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({ ...f, published: !f.published }))}>
                  {form.published
                    ? <ToggleRight className="w-9 h-9 text-emerald-500" />
                    : <ToggleLeft className="w-9 h-9 text-[#264020]/30" />}
                </button>
                <span className="text-sm text-[#264020] font-medium">{form.published ? 'Published (visible to students)' : 'Draft (hidden)'}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline"
                  className="flex-1 border-[#264020]/20 text-[#264020]">Cancel</Button>
                <Button type="submit" disabled={submitting}
                  className="flex-1 bg-[#264020] hover:bg-[#1a2c15] text-white">
                  {submitting ? 'Saving…' : editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
