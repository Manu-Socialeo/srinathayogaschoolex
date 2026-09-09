'use client'

import { useState } from 'react'
import { Key, User, RefreshCw, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { updateProfile } from '@/lib/auth'

export default function AdminProfilePage() {
  const { user, profile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?.id, name, phone }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Admin Profile</h1>
        <p className="text-[#264020]/60 text-sm mt-1">Manage your administrator account credentials</p>
      </div>

      {/* Avatar / Role Card */}
      <div className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#264020] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-white">{(profile?.name || user?.email || 'A').charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-semibold text-[#264020] text-lg">{profile?.name || 'Admin User'}</p>
          <p className="text-sm text-[#264020]/60">{user?.email}</p>
          <span className="mt-1 inline-block px-2.5 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
            {profile?.role === 'admin' ? 'Administrator' : 'Staff'}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-6 space-y-5">
        <h2 className="font-serif font-bold text-[#264020] text-base">Update Details</h2>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully.
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Display Name</label>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Email Address</label>
          <input
            value={user?.email || ''} disabled
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/10 text-sm text-[#264020]/50 bg-[#F7F9F6] cursor-not-allowed"
          />
          <p className="text-xs text-[#264020]/40 mt-1">Email is managed by Supabase Auth.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#264020]/60 mb-1.5 uppercase tracking-wider">Phone</label>
          <input
            value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 xxxxxx xxxx"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#264020]/15 text-sm text-[#264020] focus:outline-none focus:ring-2 focus:ring-[#264020]/20"
          />
        </div>

        <Button type="submit" disabled={saving} className="w-full bg-[#264020] hover:bg-[#1a2c15] text-white gap-2">
          {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Changes'}
        </Button>
      </form>

      {/* Password Reset */}
      <div className="bg-white rounded-2xl border border-[#264020]/10 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-[#264020]/50" />
          <h2 className="font-serif font-bold text-[#264020] text-base">Password & Security</h2>
        </div>
        <p className="text-sm text-[#264020]/60">
          Use the forgot-password flow to reset your admin password. A secure link will be sent to your email address.
        </p>
        <a
          href="/dashboard/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#264020] border border-[#264020]/20 px-4 py-2.5 rounded-xl hover:bg-[#264020]/5 transition-colors"
        >
          <Key className="w-4 h-4" /> Reset Password
        </a>
      </div>
    </div>
  )
}
