import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const DEFAULT_SUPABASE_URL = 'https://drsavgkcmfsoooeymxtk.supabase.co'
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyc2F2Z2tjbWZzb29vZXlteHRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODkzNTM4NywiZXhwIjoyMTA0NTExMzg3fQ.JXtOMAtCYVeo70SQGIa7eCv2wL62aC6CjxMikGzWH1Y'

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

export interface Banner {
  id: string
  title: string
  subtitle?: string
  image: string
  cta_label?: string
  cta_link?: string
  sort_order: number
  active: boolean
  created_at?: string
}

const STATIC_BANNERS: Banner[] = [
  { id: '1', title: 'Transform Your Practice', subtitle: "Join India's leading yoga teacher training", image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', cta_label: 'Explore Courses', cta_link: '/courses', sort_order: 1, active: true },
  { id: '2', title: 'Weekend Workshops', subtitle: 'Immersive yoga sessions every weekend', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', cta_label: 'View Workshops', cta_link: '/workshops', sort_order: 2, active: true },
]

const STORAGE_BUCKET = 'documents'
const STORAGE_PATH = 'cms/banners.json'

let memoryCache: Banner[] | null = null

async function getStoredBanners(supabase: ReturnType<typeof getAdminClient>): Promise<Banner[]> {
  if (memoryCache && memoryCache.length > 0) return memoryCache
  try {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(STORAGE_PATH)
    if (!error && data) {
      const text = await data.text()
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
        memoryCache = parsed
        return parsed
      }
    }
  } catch (e) {
    console.warn('Could not read banners from storage:', e)
  }
  memoryCache = [...STATIC_BANNERS]
  await saveToStorage(supabase, memoryCache)
  return memoryCache
}

async function saveToStorage(supabase: ReturnType<typeof getAdminClient>, items: Banner[]) {
  memoryCache = items
  try {
    await supabase.storage.from(STORAGE_BUCKET).upload(
      STORAGE_PATH,
      Buffer.from(JSON.stringify(items, null, 2)),
      { upsert: true, contentType: 'application/json' }
    )
  } catch (e) {
    console.error('Failed to save banners to storage:', e)
  }
}

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      memoryCache = data
      return NextResponse.json({ data })
    }

    const items = await getStoredBanners(supabase)
    return NextResponse.json({ data: items })
  } catch {
    return NextResponse.json({ data: memoryCache || STATIC_BANNERS })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, image, cta_label, cta_link, sort_order, active } = body
    if (!title || !image) return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })

    const supabase = getAdminClient()
    const { data: dbData, error: dbError } = await supabase
      .from('banners')
      .insert({
        title: title.trim(),
        subtitle: subtitle?.trim() || '',
        image,
        cta_label: cta_label || '',
        cta_link: cta_link || '',
        sort_order: Number(sort_order) || 1,
        active: active !== undefined ? Boolean(active) : true,
      })
      .select()
      .single()

    if (!dbError && dbData) {
      return NextResponse.json({ data: dbData }, { status: 201 })
    }

    const items = await getStoredBanners(supabase)
    const newBanner: Banner = {
      id: crypto.randomUUID(),
      title: title.trim(),
      subtitle: subtitle?.trim() || '',
      image,
      cta_label: cta_label || '',
      cta_link: cta_link || '',
      sort_order: Number(sort_order) || (items.length + 1),
      active: active !== undefined ? Boolean(active) : true,
      created_at: new Date().toISOString(),
    }
    const updated = [...items, newBanner]
    await saveToStorage(supabase, updated)
    return NextResponse.json({ data: newBanner }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    if (updates.sort_order !== undefined) updates.sort_order = Number(updates.sort_order)

    const supabase = getAdminClient()
    const { data: dbData, error: dbError } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!dbError && dbData) {
      return NextResponse.json({ data: dbData })
    }

    const items = await getStoredBanners(supabase)
    const index = items.findIndex((b: Banner) => b.id === id)
    if (index !== -1) {
      const updated = [...items]
      updated[index] = { ...updated[index], ...updates }
      await saveToStorage(supabase, updated)
      return NextResponse.json({ data: updated[index] })
    }
    return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const supabase = getAdminClient()
    const { error: dbError } = await supabase.from('banners').delete().eq('id', id)
    if (!dbError) {
      return NextResponse.json({ success: true })
    }

    const items = await getStoredBanners(supabase)
    const filtered = items.filter((b: Banner) => b.id !== id)
    await saveToStorage(supabase, filtered)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to delete' }, { status: 500 })
  }
}
