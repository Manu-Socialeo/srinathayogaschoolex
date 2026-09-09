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

// GET: list all registered students / users
export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*, enrollments(id, course_id), orders(id, total, status)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin users:', error)
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

// PUT: update user details (e.g. role, phone, name)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, role, name, phone, address } = body

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {}
    if (role !== undefined) updates.role = role
    if (name !== undefined) updates.name = name.trim()
    if (phone !== undefined) updates.phone = phone.trim()
    if (address !== undefined) updates.address = address.trim()

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update user' },
      { status: 500 }
    )
  }
}
