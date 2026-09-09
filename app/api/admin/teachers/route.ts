import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://drsavgkcmfsoooeymxtk.supabase.co'
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyc2F2Z2tjbWZzb29vZXlteHRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODkzNTM4NywiZXhwIjoyMTA0NTExMzg3fQ.JXtOMAtCYVeo70SQGIa7eCv2wL62aC6CjxMikGzWH1Y'

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

// Fallback static data if DB table doesn't exist yet
const STATIC_TEACHERS = [
  { id: 'dr-srinatha', name: 'Dr. Srinatha', role: 'Founder & Director', specialization: 'Hatha Yoga, Iyengar Yoga, Ashtanga Yoga', bio: '', image: '/teachers/Dr.Srinatha.webp', sort_order: 1, active: true },
  { id: 'ravi-prabhakar', name: 'Ravi Prabhakar', role: 'Methodology & Anatomy', specialization: 'Anatomy, Physiology, Teaching Methodology', bio: '', image: '/teachers/ravi.webp', sort_order: 2, active: true },
  { id: 'vinayaka-honnavar', name: 'Vinayaka Honnavar', role: 'Philosophy & Sound Healing', specialization: 'Yoga Philosophy, Meditation, Sound Healing', bio: '', image: '/teachers/vinayak.webp', sort_order: 3, active: true },
  { id: 'sahana-pr', name: 'Sahana P R', role: 'Yin Yoga & Prenatal', specialization: 'Yin Yoga, Prenatal & Postnatal, Anatomy', bio: '', image: '/teachers/Sahana.webp', sort_order: 4, active: true },
  { id: 'hrishanth', name: 'Hrishanth', role: 'Yoga Therapy & Ashtanga', specialization: 'Yoga Therapy, Ashtanga Yoga', bio: '', image: '/teachers/hrishanth.webp', sort_order: 5, active: true },
  { id: 'minu-sajji', name: 'Minu Sajji', role: 'Pranayama & Chair Yoga', specialization: 'Pranayama, Wheel Yoga, Chair Yoga', bio: '', image: '/teachers/minu.webp', sort_order: 6, active: true },
  { id: 'charanya', name: 'Charanya', role: 'Ayurveda & Philosophy', specialization: 'Ayurveda, Yoga Philosophy, Pranayama', bio: '', image: '/teachers/charanya.webp', sort_order: 7, active: true },
  { id: 'anulasha-ram', name: 'Anulasha Ram', role: 'Aerial Yoga & Marketing', specialization: 'Aerial Yoga, Community Outreach', bio: '', image: '/teachers/Anu.webp', sort_order: 8, active: true },
]

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      // Table doesn't exist yet — return static data
      console.warn('teachers table not found, returning static data:', error.message)
      return NextResponse.json({ data: STATIC_TEACHERS, static: true })
    }

    // If table exists but empty, seed it
    if (data.length === 0) {
      const { data: seeded, error: seedErr } = await supabase
        .from('teachers')
        .insert(STATIC_TEACHERS.map(({ id: _id, ...rest }) => rest))
        .select()
      if (!seedErr && seeded) {
        return NextResponse.json({ data: seeded })
      }
    }

    return NextResponse.json({ data: data.length > 0 ? data : STATIC_TEACHERS })
  } catch (err) {
    return NextResponse.json({ data: STATIC_TEACHERS, static: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, specialization, bio, image, sort_order } = body
    if (!name || !role) return NextResponse.json({ error: 'Name and role are required' }, { status: 400 })

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('teachers')
      .insert({ name: name.trim(), role: role.trim(), specialization: specialization?.trim() || '', bio: bio?.trim() || '', image: image || '/teachers/Dr.Srinatha.webp', sort_order: Number(sort_order) || 0, active: true })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data }, { status: 201 })
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
    const { data, error } = await supabase
      .from('teachers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
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
    // Soft delete — set active = false
    const { error } = await supabase.from('teachers').update({ active: false }).eq('id', id)
    if (error) {
      // If UUID fails (static id), try hard delete
      const { error: e2 } = await supabase.from('teachers').delete().eq('id', id)
      if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to delete' }, { status: 500 })
  }
}
