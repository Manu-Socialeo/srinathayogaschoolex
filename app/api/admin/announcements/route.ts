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

export interface Announcement {
  id: string
  title: string
  description: string
  image?: string
  date: string
  published: boolean
  created_at?: string
}

const STATIC_ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'New 200-Hour TTC Batch Starting October 2026', description: 'We are excited to announce our next intensive Teacher Training Program. Early bird discounts available for registrations before September 30.', date: '2026-09-01', published: true },
  { id: '2', title: 'Weekend Workshops Now Available', description: 'Join our weekend yoga immersion workshops. Sessions available for all levels from beginner to advanced practitioners.', date: '2026-09-05', published: true },
]

const STORAGE_BUCKET = 'documents'
const STORAGE_PATH = 'cms/announcements.json'

let memoryCache: Announcement[] | null = null

async function getStoredAnnouncements(supabase: ReturnType<typeof getAdminClient>): Promise<Announcement[]> {
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
    console.warn('Could not read announcements from storage:', e)
  }
  memoryCache = [...STATIC_ANNOUNCEMENTS]
  await saveToStorage(supabase, memoryCache)
  return memoryCache
}

async function saveToStorage(supabase: ReturnType<typeof getAdminClient>, items: Announcement[]) {
  memoryCache = items
  try {
    await supabase.storage.from(STORAGE_BUCKET).upload(
      STORAGE_PATH,
      Buffer.from(JSON.stringify(items, null, 2)),
      { upsert: true, contentType: 'application/json' }
    )
  } catch (e) {
    console.error('Failed to save announcements to storage:', e)
  }
}

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('date', { ascending: false })

    if (!error && data && data.length > 0) {
      memoryCache = data
      return NextResponse.json({ data })
    }

    const items = await getStoredAnnouncements(supabase)
    return NextResponse.json({ data: items })
  } catch {
    return NextResponse.json({ data: memoryCache || STATIC_ANNOUNCEMENTS })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image, date, published } = body
    if (!title || !date) return NextResponse.json({ error: 'Title and date are required' }, { status: 400 })

    const supabase = getAdminClient()
    const { data: dbData, error: dbError } = await supabase
      .from('announcements')
      .insert({
        title: title.trim(),
        description: description?.trim() || '',
        image: image || '',
        date,
        published: published !== undefined ? Boolean(published) : true,
      })
      .select()
      .single()

    if (!dbError && dbData) {
      return NextResponse.json({ data: dbData }, { status: 201 })
    }

    const items = await getStoredAnnouncements(supabase)
    const newAnnouncement: Announcement = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() || '',
      image: image || '',
      date,
      published: published !== undefined ? Boolean(published) : true,
      created_at: new Date().toISOString(),
    }
    const updated = [newAnnouncement, ...items]
    await saveToStorage(supabase, updated)
    return NextResponse.json({ data: newAnnouncement }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to create' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const supabase = getAdminClient()
    const { data: dbData, error: dbError } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!dbError && dbData) {
      return NextResponse.json({ data: dbData })
    }

    const items = await getStoredAnnouncements(supabase)
    const index = items.findIndex((a: Announcement) => a.id === id)
    if (index !== -1) {
      const updated = [...items]
      updated[index] = { ...updated[index], ...updates }
      await saveToStorage(supabase, updated)
      return NextResponse.json({ data: updated[index] })
    }
    return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
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
    const { error: dbError } = await supabase.from('announcements').delete().eq('id', id)
    if (!dbError) {
      return NextResponse.json({ success: true })
    }

    const items = await getStoredAnnouncements(supabase)
    const filtered = items.filter((a: Announcement) => a.id !== id)
    await saveToStorage(supabase, filtered)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to delete' }, { status: 500 })
  }
}
