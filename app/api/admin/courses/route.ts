import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://drsavgkcmfsoooeymxtk.supabase.co'
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyc2F2Z2tjbWZzb29vZXlteHRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODkzNTM4NywiZXhwIjoyMTA0NTExMzg3fQ.JXtOMAtCYVeo70SQGIa7eCv2wL62aC6CjxMikGzWH1Y'

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })
}

// Map course category slugs to UUIDs
const COURSE_CAT_MAP: Record<string, string> = {
  'teacher-training': '86e03d1c-6dd7-4cc8-bdf1-abb63339d1a2',
  'beginner': 'ca196ca7-ac27-4f1f-9ace-bd7601ffdf92',
  'intermediate': '305187ea-620b-4260-ab30-ad32a2e4b42b',
  'specialized': '9a5b519e-4c88-47d5-a93b-3b9f1067260a',
}

// GET: fetch all courses (including un-published for admin)
export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('courses')
      .select('*, categories(id, name, slug), lessons(id, title, duration_seconds, order_index)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin courses:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST: create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      subtitle,
      description,
      price,
      duration,
      lessons_count,
      level,
      category,
      category_id,
      instructor,
      image,
      certificate_eligible,
      published,
    } = body

    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 })
    }

    let resolvedCatId = category_id
    if (!resolvedCatId && category) {
      resolvedCatId = COURSE_CAT_MAP[category] || null
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: title.trim(),
        subtitle: subtitle?.trim() || '',
        description: description?.trim() || '',
        price: Number(price),
        duration: duration || '4 Weeks',
        lessons_count: Number(lessons_count) || 20,
        level: level || 'Teacher Training',
        category_id: resolvedCatId,
        instructor: instructor || 'Dr. Srinatha',
        instructor_image: '/teachers/Dr.Srinatha.webp',
        image: image || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
        rating: 5.0,
        reviews_count: 0,
        certificate_eligible: certificate_eligible !== undefined ? Boolean(certificate_eligible) : true,
        published: published !== undefined ? Boolean(published) : true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create course' },
      { status: 500 }
    )
  }
}

// PUT: update course
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, category, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    if (category && !updates.category_id) {
      updates.category_id = COURSE_CAT_MAP[category] || null
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update course' },
      { status: 500 }
    )
  }
}

// DELETE: delete course
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('courses').delete().eq('id', id)

    if (error) {
      console.error('Error deleting course:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete course' },
      { status: 500 }
    )
  }
}
