import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, subject, message } = await request.json()

    if (!firstName || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    if (typeof message !== 'string' || message.length > 5000) {
      return NextResponse.json({ error: 'Message too long (max 5000 characters)' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.error('Missing Supabase service role configuration for contact messages')
      return NextResponse.json({ error: 'Contact service unavailable' }, { status: 503 })
    }

    const supabase = createClient(
      supabaseUrl,
      serviceKey,
      { auth: { persistSession: false } }
    )

    const { error } = await supabase.from('contact_messages').insert({
      name: `${firstName} ${lastName || ''}`.trim(),
      email,
      subject: subject || '',
      message,
    })

    if (error) {
      console.error('Contact form error:', error)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
