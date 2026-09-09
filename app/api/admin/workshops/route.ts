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

// GET: fetch all workshops
export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching admin workshops:', error)
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

// POST: create a new workshop
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      image,
      start_date,
      duration,
      language,
      price,
      instructor,
      format,
      seat_limit,
      seats_remaining,
    } = body

    if (!title || price === undefined || !start_date) {
      return NextResponse.json(
        { error: 'Title, price, and start date are required' },
        { status: 400 }
      )
    }

    const limit = Number(seat_limit) || 25
    const remaining = seats_remaining !== undefined ? Number(seats_remaining) : limit

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('workshops')
      .insert({
        title: title.trim(),
        description: description?.trim() || '',
        image: image || 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        start_date: new Date(start_date).toISOString(),
        duration: duration || '2 Hours',
        language: language || 'English',
        price: Number(price),
        instructor: instructor || 'Dr. Srinatha',
        format: format || 'online',
        seat_limit: limit,
        seats_remaining: remaining,
        starts_in: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workshop:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create workshop' },
      { status: 500 }
    )
  }
}

// PUT: update workshop
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Workshop ID is required' }, { status: 400 })
    }

    if (updates.start_date) {
      updates.start_date = new Date(updates.start_date).toISOString()
    }
    if (updates.price !== undefined) {
      updates.price = Number(updates.price)
    }
    if (updates.seat_limit !== undefined) {
      updates.seat_limit = Number(updates.seat_limit)
    }
    if (updates.seats_remaining !== undefined) {
      updates.seats_remaining = Number(updates.seats_remaining)
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('workshops')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating workshop:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update workshop' },
      { status: 500 }
    )
  }
}

// DELETE: delete workshop
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Workshop ID is required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('workshops').delete().eq('id', id)

    if (error) {
      console.error('Error deleting workshop:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete workshop' },
      { status: 500 }
    )
  }
}
