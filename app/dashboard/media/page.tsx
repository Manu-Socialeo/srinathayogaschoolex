'use client'

import { Image as ImageIcon } from 'lucide-react'

const SAMPLE_ASSETS = [
  { name: 'Dr.Srinatha.webp', path: '/teachers/Dr.Srinatha.webp', type: 'image' },
  { name: 'Sahana.webp', path: '/teachers/Sahana.webp', type: 'image' },
  { name: 'ravi.webp', path: '/teachers/ravi.webp', type: 'image' },
  { name: 'minu.webp', path: '/teachers/minu.webp', type: 'image' },
  { name: 'logo.png', path: '/images/logo.png', type: 'image' },
  { name: 'logo-dark.png', path: '/images/logo-dark.png', type: 'image' },
]

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#264020]">Media Library</h1>
          <p className="text-[#264020]/60 text-sm mt-1">Browse public assets available in your project</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Note:</strong> Full media upload capability requires Supabase Storage integration. Below are the static assets currently deployed in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-xs">/public</code> folder.
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SAMPLE_ASSETS.map((asset) => (
          <div key={asset.path} className="bg-white rounded-xl border border-[#264020]/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-28 bg-[#F7F9F6] flex items-center justify-center relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.path}
                alt={asset.name}
                className="h-full w-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
            <div className="p-3">
              <p className="text-xs font-medium text-[#264020] truncate">{asset.name}</p>
              <p className="text-[10px] text-[#264020]/40 mt-0.5 font-mono truncate">{asset.path}</p>
              <button
                onClick={() => navigator.clipboard.writeText(asset.path)}
                className="mt-2 text-[10px] text-[#264020]/60 hover:text-[#264020] transition-colors"
              >
                📋 Copy path
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#264020] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-5 h-5 text-[#8AD679]" />
          <h2 className="font-serif font-bold text-lg">Supabase Storage</h2>
        </div>
        <p className="text-white/60 text-sm mb-4">
          To enable full media uploads from the dashboard, create a Supabase Storage bucket and integrate the upload widget here.
        </p>
        <a
          href="https://supabase.com/docs/guides/storage"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-colors"
        >
          View Supabase Storage Docs →
        </a>
      </div>
    </div>
  )
}
