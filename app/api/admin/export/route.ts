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

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""'
  const str = String(value).replace(/"/g, '""')
  return `"${str}"`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'orders'
    const supabase = getAdminClient()
    const today = new Date().toISOString().split('T')[0]

    let csvContent = ''
    let filename = `${type}-export-${today}.csv`

    switch (type) {
      case 'users': {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, phone, role, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error

        const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Joined Date']
        const rows = (data ?? []).map((u) => [
          escapeCsvCell(u.id),
          escapeCsvCell(u.name),
          escapeCsvCell(u.email),
          escapeCsvCell(u.phone || ''),
          escapeCsvCell(u.role),
          escapeCsvCell(u.created_at),
        ])
        csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        break
      }

      case 'orders': {
        const { data, error } = await supabase
          .from('orders')
          .select('id, user_id, total, status, created_at, profiles(name, email)')
          .order('created_at', { ascending: false })

        if (error) throw error

        const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Total (INR)', 'Status', 'Date']
        const rows = (data ?? []).map((o: any) => [
          escapeCsvCell(o.id),
          escapeCsvCell(o.profiles?.name || 'Guest'),
          escapeCsvCell(o.profiles?.email || 'N/A'),
          escapeCsvCell(o.total),
          escapeCsvCell(o.status),
          escapeCsvCell(o.created_at),
        ])
        csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        break
      }

      case 'products': {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price, original_price, in_stock, rating, reviews_count, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error

        const headers = ['ID', 'Title', 'Price (INR)', 'Original Price', 'In Stock', 'Rating', 'Reviews', 'Created Date']
        const rows = (data ?? []).map((p) => [
          escapeCsvCell(p.id),
          escapeCsvCell(p.title),
          escapeCsvCell(p.price),
          escapeCsvCell(p.original_price || ''),
          escapeCsvCell(p.in_stock ? 'Yes' : 'No'),
          escapeCsvCell(p.rating),
          escapeCsvCell(p.reviews_count),
          escapeCsvCell(p.created_at),
        ])
        csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        break
      }

      case 'leads': {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('id, name, email, subject, message, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error

        const headers = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Inquiry Date']
        const rows = (data ?? []).map((l) => [
          escapeCsvCell(l.id),
          escapeCsvCell(l.name),
          escapeCsvCell(l.email),
          escapeCsvCell(l.subject || ''),
          escapeCsvCell(l.message?.replace(/\n/g, ' ') || ''),
          escapeCsvCell(l.created_at),
        ])
        csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        break
      }

      default:
        return NextResponse.json({ error: `Unsupported export type: ${type}` }, { status: 400 })
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Export generation failed' },
      { status: 500 }
    )
  }
}
