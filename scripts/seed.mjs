import { createClient } from '@supabase/supabase-js'

const url = 'https://mdrvawvkeuuzzzuohawt.supabase.co'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const sb = createClient(url, serviceKey)

async function seed() {
  console.log('Seeding data...')

  // 1. Categories
  const categories = [
    { name: 'Beginner', slug: 'beginner', type: 'course' },
    { name: 'Intermediate', slug: 'intermediate', type: 'course' },
    { name: 'Teacher Training', slug: 'teacher-training', type: 'course' },
    { name: 'Specialized', slug: 'specialized', type: 'course' },
    { name: 'Books', slug: 'books', type: 'product' },
    { name: 'Apparel', slug: 'apparel', type: 'product' },
    { name: 'Sound Healing', slug: 'sound-healing', type: 'product' },
    { name: 'Mattress & Cushions', slug: 'mattress-cushions', type: 'product' },
    { name: 'Accessories', slug: 'accessories', type: 'product' },
  ]

  const { error: catErr } = await sb.from('categories').upsert(categories, { onConflict: 'slug' })
  if (catErr) { console.error('Categories error:', catErr.message); return }
  console.log('✓ Categories seeded')

  // Fetch category IDs
  const { data: cats } = await sb.from('categories').select('slug, id')
  const catMap = Object.fromEntries((cats ?? []).map(c => [c.slug, c.id]))

  // 2. Courses
  const courses = [
    { title: '200 Hour Yoga TTC', subtitle: 'Yoga Alliance RYT-200 Certified', description: 'A comprehensive 4-week teacher training covering asanas, anatomy, philosophy, and teaching methodology.', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80', duration: '4 Weeks', lessons_count: 48, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 99000, instructor: 'Dr. Srinatha', instructor_image: '/teachers/Dr.Srinatha.webp', rating: 5.0, reviews_count: 156, certificate_eligible: true, published: true },
    { title: '300 Hour Yoga TTC', subtitle: 'Advanced Yoga Alliance RYT-500 Eligible', description: 'An advanced 6-week program for experienced teachers.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', duration: '6 Weeks', lessons_count: 72, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 149000, instructor: 'Dr. Srinatha', instructor_image: '/teachers/Dr.Srinatha.webp', rating: 4.9, reviews_count: 45, certificate_eligible: true, published: true },
    { title: '21 Days Ashtanga TTC', subtitle: 'Ashtanga Vinyasa Primary Series', description: 'Immerse yourself in the traditional Mysore Ashtanga method.', image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80', duration: '21 Days', lessons_count: 36, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 25000, instructor: 'Dr. Srinatha', instructor_image: '/teachers/Dr.Srinatha.webp', rating: 5.0, reviews_count: 42, certificate_eligible: true, published: true },
    { title: '21 Days Hatha TTC', subtitle: 'Classical Hatha Yoga Foundation', description: 'A classical Hatha Yoga teacher training covering traditional asanas.', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80', duration: '21 Days', lessons_count: 34, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 25000, instructor: 'Dr. Srinatha', instructor_image: '/teachers/Dr.Srinatha.webp', rating: 5.0, reviews_count: 38, certificate_eligible: true, published: true },
    { title: '50 Hour Yin Yoga TTC', subtitle: 'Yin Asanas & Meridian Theory', description: 'A deep exploration of Yin Yoga practice.', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80', duration: '3 Weeks', lessons_count: 20, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 18000, instructor: 'Sahana P R', instructor_image: '/teachers/Sahana.webp', rating: 4.8, reviews_count: 22, certificate_eligible: true, published: true },
    { title: '85 Hours Prenatal Postnatal TTC', subtitle: 'Prenatal & Postnatal Yoga Specialist', description: 'Specialized training in prenatal and postnatal yoga.', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80', duration: '30 Days', lessons_count: 40, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 18500, instructor: 'Sahana P R', instructor_image: '/teachers/Sahana.webp', rating: 4.8, reviews_count: 35, certificate_eligible: true, published: true },
    { title: '7 Day Chair Yoga TTC', subtitle: 'Chair Asanas & Teaching Methods', description: 'A specialized certification in chair yoga.', image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80', duration: '7 Days', lessons_count: 14, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 9999, instructor: 'Minu Sajji', instructor_image: '/teachers/minu.webp', rating: 5.0, reviews_count: 28, certificate_eligible: true, published: true },
    { title: '7 Day Wheel Yoga TTC', subtitle: 'Wheel Asanas & Therapeutic Application', description: 'Learn to teach wheel yoga safely.', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&q=80', duration: '7 Days', lessons_count: 14, level: 'Teacher Training', category_id: catMap['teacher-training'], price: 9999, instructor: 'Minu Sajji', instructor_image: '/teachers/minu.webp', rating: 4.9, reviews_count: 15, certificate_eligible: true, published: true },
    { title: 'Yoga Sadhana Beginner', subtitle: '21-Day Foundations Program', description: 'Learn yoga philosophy, asanas and meditations.', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80', duration: '21 Days', lessons_count: 21, level: 'Beginner', category_id: catMap['beginner'], price: 790, instructor: 'Dr. Srinatha', instructor_image: '/teachers/Dr.Srinatha.webp', rating: 4.9, reviews_count: 312, certificate_eligible: false, published: true },
    { title: 'Yoga Sadhana Intermediate', subtitle: '14-Day Deepening Program', description: 'Deepen your yoga with intermediate asanas.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', duration: '14 Days', lessons_count: 14, level: 'Intermediate', category_id: catMap['intermediate'], price: 990, instructor: 'Dr. Srinatha', instructor_image: '/teachers/Dr.Srinatha.webp', rating: 4.8, reviews_count: 198, certificate_eligible: false, published: true },
    { title: 'Yoga Sadhana Advanced', subtitle: '10-Day Pranayama & Chakras', description: 'Dive deeper into your Pranamayakosha.', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80', duration: '10 Days', lessons_count: 10, level: 'Advanced', category_id: catMap['specialized'], price: 1490, instructor: 'Dr. Srinatha', instructor_image: '/teachers/Dr.Srinatha.webp', rating: 4.9, reviews_count: 87, certificate_eligible: false, published: true },
  ]

  const { error: courseErr } = await sb.from('courses').insert(courses)
  if (courseErr) { console.error('Courses error:', courseErr.message); return }
  console.log('✓ Courses seeded')

  // 3. Products
  const products = [
    { title: 'The Yoga Sutras of Patanjali', description: 'Ancient wisdom on yoga philosophy and meditation.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', price: 349, original_price: 499, category_id: catMap['books'], rating: 4.9, reviews_count: 215, in_stock: true, is_digital: false },
    { title: 'Ashtanga Yoga: The Practice Manual', description: 'Complete guide to Ashtanga primary series.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', price: 599, original_price: 799, category_id: catMap['books'], rating: 4.8, reviews_count: 156, in_stock: true, is_digital: false },
    { title: 'Hatha Yoga Pradipika', description: 'Classic text on Hatha Yoga.', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', price: 449, original_price: 599, category_id: catMap['books'], rating: 4.7, reviews_count: 98, in_stock: true, is_digital: false },
    { title: 'Meditation for Beginners', description: 'Step-by-step guide to meditation.', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&q=80', price: 299, original_price: 399, category_id: catMap['books'], rating: 4.9, reviews_count: 312, in_stock: true, is_digital: false },
    { title: 'The Art of Yoga Meditation', description: 'Bridging asana practice with meditation.', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80', price: 399, original_price: 549, category_id: catMap['books'], rating: 4.8, reviews_count: 87, in_stock: true, is_digital: false },
    { title: 'Light on Yoga - B.K.S. Iyengar', description: 'The bible of yoga with 600+ asanas.', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', price: 899, original_price: 1299, category_id: catMap['books'], rating: 4.9, reviews_count: 245, in_stock: true, is_digital: false },
    { title: 'Organic Cotton Yoga T-Shirt - Sage', description: '100% organic cotton, eco-friendly dye.', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80', price: 799, original_price: 999, category_id: catMap['apparel'], rating: 4.7, reviews_count: 56, in_stock: true, is_digital: false },
    { title: 'Yoga T-Shirt - Earth Tone', description: 'Comfortable fit for yoga practice.', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80', price: 799, original_price: 999, category_id: catMap['apparel'], rating: 4.6, reviews_count: 43, in_stock: true, is_digital: false },
    { title: 'Tibetan Singing Bowl - Premium', description: 'Hand-crafted bronze singing bowl.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 2499, original_price: 3499, category_id: catMap['sound-healing'], rating: 4.9, reviews_count: 78, in_stock: true, is_digital: false },
    { title: 'Crystal Singing Bowl Set', description: '7-piece crystal bowl set for chakra healing.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 4999, original_price: 6999, category_id: catMap['sound-healing'], rating: 5.0, reviews_count: 32, in_stock: true, is_digital: false },
    { title: 'Singing Bowl Mallet Set', description: 'Wool and wooden mallets, set of 3.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 399, original_price: 599, category_id: catMap['sound-healing'], rating: 4.6, reviews_count: 45, in_stock: true, is_digital: false },
    { title: 'Tibetan Bell (Ghanta)', description: 'Ritual bell for meditation ceremonies.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 899, original_price: 1299, category_id: catMap['sound-healing'], rating: 4.7, reviews_count: 38, in_stock: true, is_digital: false },
    { title: 'Meditation Cushion (Zafu)', description: 'Buckwheat hull filling for proper posture.', image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80', price: 1299, original_price: 1799, category_id: catMap['mattress-cushions'], rating: 4.8, reviews_count: 156, in_stock: true, is_digital: false },
    { title: 'Yoga Mat - Natural Rubber', description: 'Eco-friendly, non-slip natural rubber mat.', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&q=80', price: 1899, original_price: 2499, category_id: catMap['mattress-cushions'], rating: 4.7, reviews_count: 98, in_stock: true, is_digital: false },
    { title: 'Yoga Bolster Pillow', description: 'Cylindrical bolster for restorative poses.', image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80', price: 899, original_price: 1299, category_id: catMap['mattress-cushions'], rating: 4.6, reviews_count: 67, in_stock: true, is_digital: false },
    { title: 'Malas (Prayer Beads)', description: '108 beads, tulsi wood for japa practice.', image: 'https://images.unsplash.com/photo-1609511431665-7bf36cb4b9e8?w=400&q=80', price: 399, original_price: 599, category_id: catMap['accessories'], rating: 4.9, reviews_count: 67, in_stock: true, is_digital: false },
    { title: 'Yoga Strap - Cotton', description: '6ft adjustable cotton strap.', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&q=80', price: 299, original_price: 399, category_id: catMap['accessories'], rating: 4.6, reviews_count: 45, in_stock: true, is_digital: false },
    { title: 'Incense Holder Set (Brass)', description: 'Brass holder with natural incense.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 449, original_price: 599, category_id: catMap['accessories'], rating: 4.7, reviews_count: 38, in_stock: true, is_digital: false },
    { title: 'Chakra Wall Hanging', description: 'Handwoven tapestry for meditation space.', image: 'https://images.unsplash.com/photo-1609511431665-7bf36cb4b9e8?w=400&q=80', price: 899, original_price: 1299, category_id: catMap['accessories'], rating: 4.8, reviews_count: 52, in_stock: true, is_digital: false },
  ]

  const { error: prodErr } = await sb.from('products').insert(products)
  if (prodErr) { console.error('Products error:', prodErr.message); return }
  console.log('✓ Products seeded')

  // 4. Workshops
  const workshops = [
    { title: '3-Day Mindfulness & Meditation Retreat', description: 'A transformative weekend retreat exploring mindfulness meditation.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80', start_date: '2026-06-15T00:00:00Z', duration: '3 Days', language: 'English', price: 5900, starts_in: 21, instructor: 'Dr. Srinatha', format: 'In-Person', seat_limit: 30, seats_remaining: 12 },
    { title: '5-Day Ashtanga Mysore Intensive', description: 'Experience traditional Mysore-style Ashtanga practice.', image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80', start_date: '2026-07-10T00:00:00Z', duration: '5 Days', language: 'English', price: 8900, starts_in: 46, instructor: 'Dr. Srinatha', format: 'In-Person', seat_limit: 20, seats_remaining: 8 },
    { title: '7-Day Pranayama & Energy Mastery', description: 'Online live workshop on the science of breath.', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80', start_date: '2026-06-22T00:00:00Z', duration: '7 Days', language: 'English', price: 3500, starts_in: 28, instructor: 'Charanya', format: 'Online Live', seat_limit: 50, seats_remaining: 35 },
    { title: '4-Day Yoga Philosophy Deep Dive', description: 'Explore the Yoga Sutras, Bhagavad Gita, and Upanishads.', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80', start_date: '2026-08-05T00:00:00Z', duration: '4 Days', language: 'English', price: 4200, starts_in: 72, instructor: 'Vinayaka Honnavar', format: 'Online Live', seat_limit: 40, seats_remaining: 28 },
    { title: 'Prenatal Yoga & Wellness Workshop', description: 'A nurturing workshop for expecting mothers.', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80', start_date: '2026-06-18T00:00:00Z', duration: '2 Days', language: 'English', price: 2500, starts_in: 24, instructor: 'Sahana P R', format: 'Online Live', seat_limit: 30, seats_remaining: 20 },
    { title: 'Sound Healing & Chakra Alignment', description: 'A unique workshop combining singing bowls and chanting.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=800&q=80', start_date: '2026-07-12T00:00:00Z', duration: '1 Day', language: 'English', price: 1500, starts_in: 48, instructor: 'Vinayaka Honnavar', format: 'In-Person', seat_limit: 25, seats_remaining: 15 },
  ]

  const { error: wsErr } = await sb.from('workshops').insert(workshops)
  if (wsErr) { console.error('Workshops error:', wsErr.message); return }
  console.log('✓ Workshops seeded')

  // 5. Create storage buckets
  for (const bucket of ['avatars', 'products', 'documents']) {
    const { error: bErr } = await sb.storage.createBucket(bucket, { public: true })
    if (bErr && !bErr.message.includes('already exists')) {
      console.error(`Bucket ${bucket} error:`, bErr.message)
    } else {
      console.log(`✓ Storage bucket: ${bucket}`)
    }
  }

  console.log('\n✅ Seeding complete!')
}

seed().catch(console.error)
