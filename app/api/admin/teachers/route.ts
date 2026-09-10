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

export interface Teacher {
  id: string
  name: string
  role: string
  specialization: string
  bio?: string
  image: string
  sort_order?: number
  active?: boolean
  created_at?: string
}

const STATIC_TEACHERS: Teacher[] = [
  { id: 'dr-srinatha', name: 'Dr. Srinatha', role: 'Founder & Director', specialization: 'Hatha Yoga, Iyengar Yoga, Ashtanga Yoga', bio: 'Founder of Srinatha Yoga School with 25+ years of teaching experience.', image: '/teachers/Dr.Srinatha.webp', sort_order: 1, active: true },
  { id: 'ravi-prabhakar', name: 'Ravi Prabhakar', role: 'Methodology & Anatomy', specialization: 'Anatomy, Physiology, Teaching Methodology', bio: 'Expert in anatomy and physiology for yoga teachers.', image: '/teachers/ravi.webp', sort_order: 2, active: true },
  { id: 'vinayaka-honnavar', name: 'Vinayaka Honnavar', role: 'Philosophy & Sound Healing', specialization: 'Yoga Philosophy, Meditation, Sound Healing', bio: 'Specialist in yoga philosophy, meditation and sound healing.', image: '/teachers/vinayak.webp', sort_order: 3, active: true },
  { id: 'sahana-pr', name: 'Sahana P R', role: 'Yin Yoga & Prenatal', specialization: 'Yin Yoga, Prenatal & Postnatal, Anatomy', bio: 'Certified in yin yoga, prenatal and postnatal practices.', image: '/teachers/Sahana.webp', sort_order: 4, active: true },
  { id: 'hrishanth', name: 'Hrishanth', role: 'Yoga Therapy & Ashtanga', specialization: 'Yoga Therapy, Ashtanga Yoga', bio: 'Expert in therapeutic applications of yoga.', image: '/teachers/hrishanth.webp', sort_order: 5, active: true },
  { id: 'minu-sajji', name: 'Minu Sajji', role: 'Pranayama & Chair Yoga', specialization: 'Pranayama, Wheel Yoga, Chair Yoga', bio: 'Specialist in pranayama and adaptive yoga practices.', image: '/teachers/minu.webp', sort_order: 6, active: true },
  { id: 'charanya', name: 'Charanya', role: 'Ayurveda & Philosophy', specialization: 'Ayurveda, Yoga Philosophy, Pranayama', bio: 'Expert in Ayurveda and yoga philosophy integration.', image: '/teachers/charanya.webp', sort_order: 7, active: true },
  { id: 'anulasha-ram', name: 'Anulasha Ram', role: 'Aerial Yoga & Marketing', specialization: 'Aerial Yoga, Community Outreach', bio: 'Certified aerial yoga instructor and community builder.', image: '/teachers/Anu.webp', sort_order: 8, active: true },
]

const STORAGE_BUCKET = 'documents'
const STORAGE_PATH = 'cms/teachers.json'

let memoryCache: Teacher[] | null = null

async function getStoredTeachers(supabase: ReturnType<typeof getAdminClient>): Promise<Teacher[]> {
  if (memoryCache && memoryCache.length > 0) return memoryCache
  try {
    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).download(STORAGE_PATH)
    if (!error && data) {
      const text = await data.text()
      const parsed = JSON.parse(text)
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.name) {
        memoryCache = parsed
        return parsed
      }
    }
  } catch (e) {
    console.warn('Could not read teachers from storage:', e)
  }
  memoryCache = [...STATIC_TEACHERS]
  await saveToStorage(supabase, memoryCache)
  return memoryCache
}

async function saveToStorage(supabase: ReturnType<typeof getAdminClient>, items: Teacher[]) {
  memoryCache = items
  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(
      STORAGE_PATH,
      Buffer.from(JSON.stringify(items, null, 2)),
      { upsert: true, contentType: 'application/json' }
    )
    if (error) console.error('Supabase upload error:', error)
  } catch (e) {
    console.error('Failed to save teachers to storage:', e)
  }
}

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      memoryCache = data
      return NextResponse.json({ data: data.filter((t: Teacher) => t.active !== false) })
    }

    const items = await getStoredTeachers(supabase)
    return NextResponse.json({ data: items.filter((t: Teacher) => t.active !== false) })
  } catch {
    return NextResponse.json({ data: memoryCache || STATIC_TEACHERS })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, specialization, bio, image, sort_order } = body
    if (!name || !role) return NextResponse.json({ error: 'Name and role are required' }, { status: 400 })

    const supabase = getAdminClient()
    const { data: dbData, error: dbError } = await supabase
      .from('teachers')
      .insert({
        name: name.trim(),
        role: role.trim(),
        specialization: specialization?.trim() || '',
        bio: bio?.trim() || '',
        image: image || '/teachers/Dr.Srinatha.webp',
        sort_order: Number(sort_order) || 0,
        active: true,
      })
      .select()
      .single()

    if (!dbError && dbData) {
      return NextResponse.json({ data: dbData }, { status: 201 })
    }

    const items = await getStoredTeachers(supabase)
    const newTeacher: Teacher = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: role.trim(),
      specialization: specialization?.trim() || '',
      bio: bio?.trim() || '',
      image: image || '/teachers/Dr.Srinatha.webp',
      sort_order: Number(sort_order) || (items.length + 1),
      active: true,
      created_at: new Date().toISOString(),
    }
    const updated = [...items, newTeacher]
    await saveToStorage(supabase, updated)
    return NextResponse.json({ data: newTeacher }, { status: 201 })
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
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!dbError && dbData) {
      return NextResponse.json({ data: dbData })
    }

    const items = await getStoredTeachers(supabase)
    const index = items.findIndex((t: Teacher) => t.id === id)
    if (index !== -1) {
      const updated = [...items]
      updated[index] = { ...updated[index], ...updates }
      await saveToStorage(supabase, updated)
      return NextResponse.json({ data: updated[index] })
    }
    return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
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
    const { error: dbError } = await supabase.from('teachers').update({ active: false }).eq('id', id)
    if (!dbError) {
      return NextResponse.json({ success: true })
    }

    const items = await getStoredTeachers(supabase)
    const filtered = items.filter((t: Teacher) => t.id !== id)
    await saveToStorage(supabase, filtered)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to delete' }, { status: 500 })
  }
}
