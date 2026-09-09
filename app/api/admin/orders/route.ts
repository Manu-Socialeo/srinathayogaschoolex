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

// GET: fetch all orders with profiles and items
export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(name, email, phone), order_items(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin orders:', error)
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

// PUT: update order status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 })
    }

    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled']
    const normalizedStatus = status.toLowerCase()
    
    // In schema check constraint: ('pending', 'completed', 'failed', 'refunded')
    // Map 'processing' and 'cancelled' to accepted statuses if necessary
    let dbStatus = normalizedStatus
    if (dbStatus === 'processing') dbStatus = 'pending'
    if (dbStatus === 'cancelled') dbStatus = 'failed'

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('orders')
      .update({ status: dbStatus })
      .eq('id', id)
      .select('*, profiles(name, email, phone), order_items(*)')
      .single()

    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update order' },
      { status: 500 }
    )
  }
}
