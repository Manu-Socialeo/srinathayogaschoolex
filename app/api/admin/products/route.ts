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

// Map known category slugs to Supabase UUIDs
const CATEGORY_MAP: Record<string, string> = {
  'books': 'c081340c-1b50-4e17-9825-7387b3ecbf60',
  'apparel': 'e5ac5f68-d3a6-4c46-83ca-139a23317bae',
  'sound-healing': '61ad362d-bd44-49f4-893e-d5a4ccc048c2',
  'mattress-cushions': 'bcf724df-4b74-406d-bf0c-10f9c44f5005',
  'accessories': '17c2b3fe-798e-4560-8b58-f0d80f22dfe1',
}

// GET: fetch all products
export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admin products:', error)
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

// POST: create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, original_price, category, category_id, image, in_stock } = body

    if (!title || price === undefined) {
      return NextResponse.json({ error: 'Title and price are required' }, { status: 400 })
    }

    // Resolve category_id
    let resolvedCategoryId = category_id
    if (!resolvedCategoryId && category) {
      resolvedCategoryId = CATEGORY_MAP[category] || null
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .insert({
        title: title.trim(),
        description: description?.trim() || '',
        price: Number(price),
        original_price: original_price !== undefined ? Number(original_price) : Number(price),
        category_id: resolvedCategoryId,
        image: image || 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
        in_stock: in_stock !== undefined ? Boolean(in_stock) : true,
        rating: 5.0,
        reviews_count: 0,
        is_digital: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT: update existing product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, category, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // If category slug passed, map to category_id
    if (category && !updates.category_id) {
      updates.category_id = CATEGORY_MAP[category] || null
    }

    const supabase = getAdminClient()
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE: delete product by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      console.error('Error deleting product:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete product' },
      { status: 500 }
    )
  }
}
