import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://drsavgkcmfsoooeymxtk.supabase.co'
const DEFAULT_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyc2F2Z2tjbWZzb29vZXlteHRrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODkzNTM4NywiZXhwIjoyMTA0NTExMzg3fQ.JXtOMAtCYVeo70SQGIa7eCv2wL62aC6CjxMikGzWH1Y'

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY
  return createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
}

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      // Table may not exist yet — return empty gracefully
      console.warn('banners table error:', error.message)
      return NextResponse.json({ data: [], _tableReady: false })
    }
    return NextResponse.json({ data: data ?? [] })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, subtitle, image, cta_label, cta_link, sort_order, active } = body
    if (!title || !image) return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('banners')
      .insert({ title: title.trim(), subtitle: subtitle?.trim() || '', image, cta_label: cta_label || '', cta_link: cta_link || '', sort_order: Number(sort_order) || 1, active: active !== undefined ? Boolean(active) : true })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message + ' — Have you run the SQL migration in Supabase Studio?' }, { status: 500 })
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
    if (updates.sort_order !== undefined) updates.sort_order = Number(updates.sort_order)

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('banners')
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
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to delete' }, { status: 500 })
  }
}
