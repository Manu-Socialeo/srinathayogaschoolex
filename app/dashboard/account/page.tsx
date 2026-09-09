'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import { getCurrentProfile, getCurrentUser, updateProfile } from '@/lib/auth'
import { uploadAvatar } from '@/lib/storage'
import type { Profile } from '@/lib/supabase-types'

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [authEmail, setAuthEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [building, setBuilding] = useState('')
  const [street, setStreet] = useState('')
  const [pincode, setPincode] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser()
      if (user) setAuthEmail(user.email || '')

      const prof = await getCurrentProfile()
      if (prof) {
        setProfile(prof)
        setName(prof.name)
        setPhone(prof.phone || '')
        setAvatarUrl(prof.avatar_url || '')
        const parts = (prof.address || '').split('|')
        setBuilding(parts[0] || '')
        setStreet(parts[1] || '')
        setCity(parts[2] || '')
        setState(parts[3] || '')
        setPincode(parts[4] || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploading(true)
    setError('')
    try {
      const url = await uploadAvatar(profile.id, file)
      if (url) {
        await updateProfile({ avatar_url: url })
        setAvatarUrl(url)
      } else {
        setError('Failed to upload image')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (pincode.length !== 6) return
    setLookupLoading(true)
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      .then(r => r.json())
      .then(data => {
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length) {
          const po = data[0].PostOffice[0]
          setCity(po.District || po.Name || '')
          setState(po.State || '')
        }
      })
      .catch(() => {})
      .finally(() => setLookupLoading(false))
  }, [pincode])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    setProfileSaving(true)
    setError('')
    setProfileSuccess('')
    try {
      const address = [building, street, city, state, pincode].join('|')
      await updateProfile({ name: name.trim(), phone: phone.trim() || null, address })
      setProfileSuccess('Profile updated')
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) { setError('Enter a new password'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    setPasswordSaving(true)
    setError('')
    setPasswordSuccess('')
    try {
      const sb = createBrowserClient()
      const { error } = await sb.auth.updateUser({ password })
      if (error) throw error
      await updateProfile({ password_set: true }).catch(() => {})
      setPasswordSuccess('Password updated')
      setPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setPasswordSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#264020] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Back */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#264020]/60 hover:text-[#264020] text-sm mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <h1 className="font-serif text-2xl text-[#264020] mb-6">Account Settings</h1>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>
        )}

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#264020]/20 bg-[#264020]/5">
            <Image
              src={avatarUrl || '/placeholder-user.jpg'}
              alt="Profile"
              fill
              className="object-cover"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
            >
              <CameraIcon />
            </button>
          </div>
          <div>
            <p className="font-medium text-[#264020]">{profile?.name || authEmail?.split('@')[0] || 'User'}</p>
            <p className="text-sm text-[#264020]/60">{profile?.email || authEmail}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm text-[#264020] font-medium hover:underline mt-1"
            >
              {uploading ? 'Uploading...' : 'Change Photo'}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        {/* Profile Form */}
        <form onSubmit={handleProfileSave} className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6 mb-4 space-y-4">
          <h2 className="font-serif text-lg text-[#264020]">Personal Information</h2>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">Door No / Building</label>
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="Door number, building name"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">Street / Area</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Street name, locality"
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">Pincode</label>
            <div className="relative">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
              />
              {lookupLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#264020] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#264020] mb-2">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">Email</label>
            <input
              type="email"
              value={authEmail}
              disabled
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020]/50 bg-[#FAF8F5] cursor-not-allowed"
            />
            <p className="text-xs text-[#264020]/40 mt-1">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="w-full bg-[#264020] hover:bg-[#3a5a30] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {profileSaving ? 'Saving...' : 'Save Changes'}
          </button>

          {profileSuccess && (
            <p className="text-green-600 text-sm text-center">{profileSuccess}</p>
          )}
        </form>

        {/* Password Section */}
        <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl shadow-sm border border-[#E5E5E5] p-6 mb-4 space-y-4">
          <h2 className="font-serif text-lg text-[#264020]">Password</h2>
          <p className="text-sm text-[#264020]/60">Set or change your password to login with email and password.</p>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              minLength={6}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#264020] mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              minLength={6}
              className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl text-[#264020] focus:outline-none focus:border-[#264020]"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSaving}
            className="w-full bg-[#264020] hover:bg-[#3a5a30] disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {passwordSaving ? 'Updating...' : 'Update Password'}
          </button>

          {passwordSuccess && (
            <p className="text-green-600 text-sm text-center">{passwordSuccess}</p>
          )}
        </form>
      </div>
    </div>
  )
}

function CameraIcon() {
  return (
    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
