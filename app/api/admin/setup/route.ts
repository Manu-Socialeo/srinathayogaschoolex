import { NextResponse } from 'next/server'
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

// Single consolidated SQL for all 3 tables
const SETUP_SQL = `
-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  specialization TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  image TEXT DEFAULT '/teachers/Dr.Srinatha.webp',
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Teachers viewable by all" ON teachers;
CREATE POLICY "Teachers viewable by all" ON teachers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Teachers manageable by admins" ON teachers;
CREATE POLICY "Teachers manageable by admins" ON teachers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Announcements viewable by all" ON announcements;
CREATE POLICY "Announcements viewable by all" ON announcements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Announcements manageable by admins" ON announcements;
CREATE POLICY "Announcements manageable by admins" ON announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  cta_label TEXT DEFAULT '',
  cta_link TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Banners viewable by all" ON banners;
CREATE POLICY "Banners viewable by all" ON banners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Banners manageable by admins" ON banners;
CREATE POLICY "Banners manageable by admins" ON banners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
`

const SEED_TEACHERS = [
  { name: 'Dr. Srinatha', role: 'Founder & Director', specialization: 'Hatha Yoga, Iyengar Yoga, Ashtanga Yoga', bio: 'Founder of Srinatha Yoga School with 25+ years of teaching experience.', image: '/teachers/Dr.Srinatha.webp', sort_order: 1, active: true },
  { name: 'Ravi Prabhakar', role: 'Methodology & Anatomy', specialization: 'Anatomy, Physiology, Teaching Methodology', bio: 'Expert in anatomy and physiology for yoga teachers.', image: '/teachers/ravi.webp', sort_order: 2, active: true },
  { name: 'Vinayaka Honnavar', role: 'Philosophy & Sound Healing', specialization: 'Yoga Philosophy, Meditation, Sound Healing', bio: 'Specialist in yoga philosophy, meditation and sound healing.', image: '/teachers/vinayak.webp', sort_order: 3, active: true },
  { name: 'Sahana P R', role: 'Yin Yoga & Prenatal', specialization: 'Yin Yoga, Prenatal & Postnatal, Anatomy', bio: 'Certified in yin yoga, prenatal and postnatal practices.', image: '/teachers/Sahana.webp', sort_order: 4, active: true },
  { name: 'Hrishanth', role: 'Yoga Therapy & Ashtanga', specialization: 'Yoga Therapy, Ashtanga Yoga', bio: 'Expert in therapeutic applications of yoga.', image: '/teachers/hrishanth.webp', sort_order: 5, active: true },
  { name: 'Minu Sajji', role: 'Pranayama & Chair Yoga', specialization: 'Pranayama, Wheel Yoga, Chair Yoga', bio: 'Specialist in pranayama and adaptive yoga practices.', image: '/teachers/minu.webp', sort_order: 6, active: true },
  { name: 'Charanya', role: 'Ayurveda & Philosophy', specialization: 'Ayurveda, Yoga Philosophy, Pranayama', bio: 'Expert in Ayurveda and yoga philosophy integration.', image: '/teachers/charanya.webp', sort_order: 7, active: true },
  { name: 'Anulasha Ram', role: 'Aerial Yoga & Marketing', specialization: 'Aerial Yoga, Community Outreach', bio: 'Certified aerial yoga instructor and community builder.', image: '/teachers/Anu.webp', sort_order: 8, active: true },
]

const SEED_ANNOUNCEMENTS = [
  { title: 'New 200-Hour TTC Batch Starting October 2026', description: 'We are excited to announce our next intensive Teacher Training Program. Early bird discounts available for registrations before September 30.', date: '2026-09-01', published: true },
  { title: 'Weekend Workshops Now Available', description: 'Join our weekend yoga immersion workshops. Sessions available for all levels from beginner to advanced practitioners.', date: '2026-09-05', published: true },
]

const SEED_BANNERS = [
  { title: 'Transform Your Practice', subtitle: "Join India's leading yoga teacher training", image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', cta_label: 'Explore Courses', cta_link: '/courses', sort_order: 1, active: true },
  { title: 'Weekend Workshops', subtitle: 'Immersive yoga sessions every weekend', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', cta_label: 'View Workshops', cta_link: '/workshops', sort_order: 2, active: true },
]

export async function GET() {
  try {
    const supabase = getAdminClient()

    // Execute DDL via the Supabase postgres SQL endpoint
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY
    
    const sqlRes = await fetch(`${supabaseUrl}/rest/v1/rpc/run_sql`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SETUP_SQL }),
    })

    const results: Record<string, unknown> = {}

    // Even if RPC fails, try to insert seed data — table might already exist
    // Check teachers
    const { data: existingTeachers } = await supabase.from('teachers').select('id').limit(1)
    if (existingTeachers !== null) {
      results.teachers_exists = true
      // Seed if empty
      const { count } = await supabase.from('teachers').select('*', { count: 'exact', head: true })
      if ((count || 0) === 0) {
        const { error: seedErr } = await supabase.from('teachers').insert(SEED_TEACHERS)
        results.teachers_seeded = seedErr ? seedErr.message : true
      } else {
        results.teachers_count = count
      }
    } else {
      results.teachers_exists = false
      results.note = 'Tables do not exist yet. Run SQL via Supabase Studio.'
    }

    // Check announcements
    const { data: existingAnn } = await supabase.from('announcements').select('id').limit(1)
    if (existingAnn !== null) {
      results.announcements_exists = true
      const { count } = await supabase.from('announcements').select('*', { count: 'exact', head: true })
      if ((count || 0) === 0) {
        const { error: seedErr } = await supabase.from('announcements').insert(SEED_ANNOUNCEMENTS)
        results.announcements_seeded = seedErr ? seedErr.message : true
      } else {
        results.announcements_count = count
      }
    } else {
      results.announcements_exists = false
    }

    // Check banners
    const { data: existingBanners } = await supabase.from('banners').select('id').limit(1)
    if (existingBanners !== null) {
      results.banners_exists = true
      const { count } = await supabase.from('banners').select('*', { count: 'exact', head: true })
      if ((count || 0) === 0) {
        const { error: seedErr } = await supabase.from('banners').insert(SEED_BANNERS)
        results.banners_seeded = seedErr ? seedErr.message : true
      } else {
        results.banners_count = count
      }
    } else {
      results.banners_exists = false
    }

    // Return the SQL that needs to be run manually if tables don't exist
    if (!results.teachers_exists || !results.announcements_exists || !results.banners_exists) {
      results.sql_to_run = SETUP_SQL
    }

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Setup failed' }, { status: 500 })
  }
}
