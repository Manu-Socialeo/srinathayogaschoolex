-- Migration: Add teachers, announcements, and banners tables

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
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='teachers' AND policyname='Teachers viewable by all') THEN
    EXECUTE 'CREATE POLICY "Teachers viewable by all" ON teachers FOR SELECT USING (true)';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='teachers' AND policyname='Teachers manageable by admins') THEN
    EXECUTE $p$CREATE POLICY "Teachers manageable by admins" ON teachers FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )$p$;
  END IF;
END $$;

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
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='announcements' AND policyname='Announcements viewable by all') THEN
    EXECUTE 'CREATE POLICY "Announcements viewable by all" ON announcements FOR SELECT USING (true)';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='announcements' AND policyname='Announcements manageable by admins') THEN
    EXECUTE $p$CREATE POLICY "Announcements manageable by admins" ON announcements FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )$p$;
  END IF;
END $$;

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
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='banners' AND policyname='Banners viewable by all') THEN
    EXECUTE 'CREATE POLICY "Banners viewable by all" ON banners FOR SELECT USING (true)';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='banners' AND policyname='Banners manageable by admins') THEN
    EXECUTE $p$CREATE POLICY "Banners manageable by admins" ON banners FOR ALL USING (
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )$p$;
  END IF;
END $$;

-- Seed teachers
INSERT INTO teachers (name, role, specialization, bio, image, sort_order, active)
SELECT * FROM (VALUES
  ('Dr. Srinatha', 'Founder & Director', 'Hatha Yoga, Iyengar Yoga, Ashtanga Yoga', 'Founder of Srinatha Yoga School with 25+ years of teaching experience.', '/teachers/Dr.Srinatha.webp', 1, true),
  ('Ravi Prabhakar', 'Methodology & Anatomy', 'Anatomy, Physiology, Teaching Methodology', 'Expert in anatomy and physiology for yoga teachers.', '/teachers/ravi.webp', 2, true),
  ('Vinayaka Honnavar', 'Philosophy & Sound Healing', 'Yoga Philosophy, Meditation, Sound Healing', 'Specialist in yoga philosophy, meditation and sound healing.', '/teachers/vinayak.webp', 3, true),
  ('Sahana P R', 'Yin Yoga & Prenatal', 'Yin Yoga, Prenatal & Postnatal, Anatomy', 'Certified in yin yoga, prenatal and postnatal practices.', '/teachers/Sahana.webp', 4, true),
  ('Hrishanth', 'Yoga Therapy & Ashtanga', 'Yoga Therapy, Ashtanga Yoga', 'Expert in therapeutic applications of yoga.', '/teachers/hrishanth.webp', 5, true),
  ('Minu Sajji', 'Pranayama & Chair Yoga', 'Pranayama, Wheel Yoga, Chair Yoga', 'Specialist in pranayama and adaptive yoga practices.', '/teachers/minu.webp', 6, true),
  ('Charanya', 'Ayurveda & Philosophy', 'Ayurveda, Yoga Philosophy, Pranayama', 'Expert in Ayurveda and yoga philosophy integration.', '/teachers/charanya.webp', 7, true),
  ('Anulasha Ram', 'Aerial Yoga & Marketing', 'Aerial Yoga, Community Outreach', 'Certified aerial yoga instructor and community builder.', '/teachers/Anu.webp', 8, true)
) AS t(name, role, specialization, bio, image, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM teachers LIMIT 1);

-- Seed announcements
INSERT INTO announcements (title, description, date, published)
SELECT * FROM (VALUES
  ('New 200-Hour TTC Batch Starting October 2026', 'We are excited to announce our next intensive Teacher Training Program. Early bird discounts available.', '2026-09-01'::date, true),
  ('Weekend Workshops Now Available', 'Join our weekend yoga immersion workshops. Sessions available for all levels.', '2026-09-05'::date, true)
) AS t(title, description, date, published)
WHERE NOT EXISTS (SELECT 1 FROM announcements LIMIT 1);

-- Seed banners
INSERT INTO banners (title, subtitle, image, cta_label, cta_link, sort_order, active)
SELECT * FROM (VALUES
  ('Transform Your Practice', 'Join India''s leading yoga teacher training', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', 'Explore Courses', '/courses', 1, true),
  ('Weekend Workshops', 'Immersive yoga sessions every weekend', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80', 'View Workshops', '/workshops', 2, true)
) AS t(title, subtitle, image, cta_label, cta_link, sort_order, active)
WHERE NOT EXISTS (SELECT 1 FROM banners LIMIT 1);
