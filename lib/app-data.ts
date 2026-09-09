export interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  duration: string
  lessons: number
  level: string
  category: string
  price: number
  instructor: string
  instructorImage: string
  rating: number
  reviews: number
  progress?: number
  isPurchased?: boolean
  isSaved?: boolean
  certificateEligible: boolean
}

export interface Workshop {
  id: string
  title: string
  description: string
  image: string
  startDate: string
  duration: string
  language: string
  price: number
  startsIn: number
  instructor: string
  format: string
}

export interface Product {
  id: string
  title: string
  description: string
  image: string
  price: number
  originalPrice: number
  category: string
  rating: number
  reviews: number
  inStock: boolean
}

export interface Teacher {
  id: string
  name: string
  role: string
  image: string
  specialization: string
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  memberSince: string
  certificatesEarned: number
  totalHoursLearned: number
  streakDays: number
}

export interface Announcement {
  id: string
  title: string
  description: string
  image: string
  date: string
}

export interface Category {
  id: string
  label: string
}

export interface TTCResource {
  id: string
  title: string
  type: 'pdf' | 'audio' | 'video'
  description: string
  size?: string
  duration?: string
}

export const courses: Course[] = [
  {
    id: '200h-ttc',
    title: '200 Hour Yoga TTC',
    subtitle: 'Yoga Alliance RYT-200 Certified',
    description: 'A comprehensive 4-week teacher training covering asanas, anatomy, philosophy, and teaching methodology. Perfect for aspiring yoga teachers seeking Yoga Alliance accreditation.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
    duration: '4 Weeks',
    lessons: 48,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 99000,
    instructor: 'Dr. Srinatha',
    instructorImage: '/teachers/Dr.Srinatha.webp',
    rating: 5.0,
    reviews: 156,
    progress: 45,
    isPurchased: true,
    isSaved: true,
    certificateEligible: true,
  },
  {
    id: '300h-ttc',
    title: '300 Hour Yoga TTC',
    subtitle: 'Advanced Yoga Alliance RYT-500 Eligible',
    description: 'An advanced 6-week program for experienced teachers. Deepen your practice with advanced asanas, pranayama mastery, and advanced teaching methodologies.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    duration: '6 Weeks',
    lessons: 72,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 149000,
    instructor: 'Dr. Srinatha',
    instructorImage: '/teachers/Dr.Srinatha.webp',
    rating: 4.9,
    reviews: 45,
    progress: 20,
    isPurchased: true,
    isSaved: false,
    certificateEligible: true,
  },
  {
    id: 'ashtanga-ttc',
    title: '21 Days Ashtanga TTC',
    subtitle: 'Ashtanga Vinyasa Primary Series',
    description: 'Immerse yourself in the traditional Mysore Ashtanga method. Learn the complete Primary Series with personalized adjustments and teaching techniques.',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    duration: '21 Days',
    lessons: 36,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 25000,
    instructor: 'Dr. Srinatha',
    instructorImage: '/teachers/Dr.Srinatha.webp',
    rating: 5.0,
    reviews: 42,
    progress: 0,
    isPurchased: true,
    isSaved: false,
    certificateEligible: true,
  },
  {
    id: 'hatha-ttc',
    title: '21 Days Hatha TTC',
    subtitle: 'Classical Hatha Yoga Foundation',
    description: 'A classical Hatha Yoga teacher training covering traditional asanas, shatkarmas, pranayama, and yoga philosophy rooted in ancient wisdom.',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
    duration: '21 Days',
    lessons: 34,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 25000,
    instructor: 'Dr. Srinatha',
    instructorImage: '/teachers/Dr.Srinatha.webp',
    rating: 5.0,
    reviews: 38,
    progress: 0,
    isPurchased: false,
    isSaved: true,
    certificateEligible: true,
  },
  {
    id: 'yin-ttc',
    title: '50 Hour Yin Yoga TTC',
    subtitle: 'Yin Asanas & Meridian Theory',
    description: 'A deep exploration of Yin Yoga practice including meridian theory, functional anatomy, and the art of holding space for deep tissue release.',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
    duration: '3 Weeks',
    lessons: 20,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 18000,
    instructor: 'Sahana P R',
    instructorImage: '/teachers/Sahana.webp',
    rating: 4.8,
    reviews: 22,
    progress: 0,
    isPurchased: false,
    isSaved: false,
    certificateEligible: true,
  },
  {
    id: 'prenatal-ttc',
    title: '85 Hours Prenatal Postnatal TTC',
    subtitle: 'Prenatal & Postnatal Yoga Specialist',
    description: 'Specialized training in prenatal and postnatal yoga including Garbhasanskar, pregnancy anatomy, and postpartum recovery techniques.',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    duration: '30 Days',
    lessons: 40,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 18500,
    instructor: 'Sahana P R',
    instructorImage: '/teachers/Sahana.webp',
    rating: 4.8,
    reviews: 35,
    progress: 0,
    isPurchased: false,
    isSaved: false,
    certificateEligible: true,
  },
  {
    id: 'chair-yoga',
    title: '7 Day Chair Yoga TTC',
    subtitle: 'Chair Asanas & Teaching Methods',
    description: 'A specialized certification in chair yoga - perfect for teaching seniors, office workers, and those with mobility challenges.',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=600&q=80',
    duration: '7 Days',
    lessons: 14,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 9999,
    instructor: 'Minu Sajji',
    instructorImage: '/teachers/minu.webp',
    rating: 5.0,
    reviews: 28,
    progress: 0,
    isPurchased: false,
    isSaved: false,
    certificateEligible: true,
  },
  {
    id: 'wheel-yoga',
    title: '7 Day Wheel Yoga TTC',
    subtitle: 'Wheel Asanas & Therapeutic Application',
    description: 'Learn to teach wheel yoga safely and effectively. Covers wheel asanas, therapeutic applications, and class sequencing.',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=600&q=80',
    duration: '7 Days',
    lessons: 14,
    level: 'Teacher Training',
    category: 'teacher-training',
    price: 9999,
    instructor: 'Minu Sajji',
    instructorImage: '/teachers/minu.webp',
    rating: 4.9,
    reviews: 15,
    progress: 0,
    isPurchased: false,
    isSaved: false,
    certificateEligible: true,
  },
  {
    id: 'yoga-sadhana-beginner',
    title: 'Yoga Sadhana Beginner',
    subtitle: '21-Day Foundations Program',
    description: 'Learn yoga philosophy, asanas and meditations to take charge of your joy! Perfect for beginners starting their yoga journey.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
    duration: '21 Days',
    lessons: 21,
    level: 'Beginner',
    category: 'beginner',
    price: 790,
    instructor: 'Dr. Srinatha',
    instructorImage: '/teachers/Dr.Srinatha.webp',
    rating: 4.9,
    reviews: 312,
    progress: 100,
    isPurchased: true,
    isSaved: false,
    certificateEligible: false,
  },
  {
    id: 'yoga-sadhana-intermediate',
    title: 'Yoga Sadhana Intermediate',
    subtitle: '14-Day Deepening Program',
    description: 'Deepen your yoga with intermediate asanas and meditations. You are ready to become a true yogi!',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80',
    duration: '14 Days',
    lessons: 14,
    level: 'Intermediate',
    category: 'intermediate',
    price: 990,
    instructor: 'Dr. Srinatha',
    instructorImage: '/teachers/Dr.Srinatha.webp',
    rating: 4.8,
    reviews: 198,
    progress: 78,
    isPurchased: true,
    isSaved: true,
    certificateEligible: false,
  },
  {
    id: 'yoga-sadhana-advanced',
    title: 'Yoga Sadhana Advanced',
    subtitle: '10-Day Pranayama & Chakras',
    description: 'Dive deeper into your Pranamayakosha and understand the science of Chakras. Advanced meditation and pranayama techniques.',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&q=80',
    duration: '10 Days',
    lessons: 10,
    level: 'Advanced',
    category: 'specialized',
    price: 1490,
    instructor: 'Dr. Srinatha',
    instructorImage: '/teachers/Dr.Srinatha.webp',
    rating: 4.9,
    reviews: 87,
    progress: 0,
    isPurchased: false,
    isSaved: false,
    certificateEligible: false,
  },
]

export const workshops: Workshop[] = [
  {
    id: 'mindfulness-retreat',
    title: '3-Day Mindfulness & Meditation Retreat',
    description: 'A transformative weekend retreat exploring mindfulness meditation, pranayama, and yoga nidra. Suitable for all levels seeking inner peace and mental clarity amidst nature.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    startDate: '15 Jun 2026',
    duration: '3 Days',
    language: 'English',
    price: 5900,
    startsIn: 21,
    instructor: 'Dr. Srinatha',
    format: 'In-Person',
  },
  {
    id: 'ashtanga-intensive',
    title: '5-Day Ashtanga Mysore Intensive',
    description: 'Experience the traditional Mysore-style Ashtanga practice with personalized guidance from Dr. Srinatha. Suitable for practitioners with basic Ashtanga knowledge.',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    startDate: '10 Jul 2026',
    duration: '5 Days',
    language: 'English',
    price: 8900,
    startsIn: 46,
    instructor: 'Dr. Srinatha',
    format: 'In-Person',
  },
  {
    id: 'pranayama-online',
    title: '7-Day Pranayama & Energy Mastery',
    description: 'Online live workshop on the science of breath. Learn advanced pranayama techniques including Nadi Shodhana, Bhastrika, Kapalabhati, and meditation practices.',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
    startDate: '22 Jun 2026',
    duration: '7 Days',
    language: 'English',
    price: 3500,
    startsIn: 28,
    instructor: 'Charanya',
    format: 'Online Live',
  },
  {
    id: 'philosophy-deep-dive',
    title: '4-Day Yoga Philosophy Deep Dive',
    description: 'Explore the Yoga Sutras of Patanjali, Bhagavad Gita, and the Upanishads. Understand the philosophical foundations that make yoga a complete spiritual path.',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
    startDate: '5 Aug 2026',
    duration: '4 Days',
    language: 'English',
    price: 4200,
    startsIn: 72,
    instructor: 'Vinayaka Honnavar',
    format: 'Online Live',
  },
  {
    id: 'prenatal-workshop',
    title: 'Prenatal Yoga & Wellness Workshop',
    description: 'A nurturing workshop for expecting mothers. Learn safe prenatal yoga practices, breathing techniques for labor, and meditation for pregnancy wellness.',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80',
    startDate: '18 Jun 2026',
    duration: '2 Days',
    language: 'English',
    price: 2500,
    startsIn: 24,
    instructor: 'Sahana P R',
    format: 'Online Live',
  },
  {
    id: 'sound-healing',
    title: 'Sound Healing & Chakra Alignment',
    description: 'A unique workshop combining Tibetan singing bowls, crystal bowls, and chanting to align and balance the seven chakras. Experience deep vibrational healing.',
    image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=800&q=80',
    startDate: '12 Jul 2026',
    duration: '1 Day',
    language: 'English',
    price: 1500,
    startsIn: 48,
    instructor: 'Vinayaka Honnavar',
    format: 'In-Person',
  },
]

export const products: Product[] = [
  { id: 'yoga-sutras-book', title: 'The Yoga Sutras of Patanjali', description: 'Ancient wisdom on yoga philosophy and meditation with commentary.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', price: 349, originalPrice: 499, category: 'books', rating: 4.9, reviews: 215, inStock: true },
  { id: 'ashtanga-manual', title: 'Ashtanga Yoga: The Practice Manual', description: 'Complete guide to Ashtanga primary and secondary series with detailed illustrations.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', price: 599, originalPrice: 799, category: 'books', rating: 4.8, reviews: 156, inStock: true },
  { id: 'hatha-pradipika', title: 'Hatha Yoga Pradipika', description: 'Classic text on Hatha Yoga and pranic exercises translated with commentary.', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', price: 449, originalPrice: 599, category: 'books', rating: 4.7, reviews: 98, inStock: true },
  { id: 'meditation-for-beginners', title: 'Meditation for Beginners', description: 'Step-by-step guide to starting your meditation practice with simple techniques.', image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&q=80', price: 299, originalPrice: 399, category: 'books', rating: 4.9, reviews: 312, inStock: true },
  { id: 'art-of-meditation', title: 'The Art of Yoga Meditation', description: 'Bridging asana practice with deep meditation for spiritual growth.', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80', price: 399, originalPrice: 549, category: 'books', rating: 4.8, reviews: 87, inStock: true },
  { id: 'light-on-yoga', title: 'Light on Yoga - B.K.S. Iyengar', description: 'The bible of yoga with 600+ asanas explained in precise detail.', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&q=80', price: 899, originalPrice: 1299, category: 'books', rating: 4.9, reviews: 245, inStock: true },
  { id: 'cotton-tshirt-sage', title: 'Organic Cotton Yoga T-Shirt - Sage', description: '100% organic cotton, eco-friendly dye, available in S/M/L/XL.', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80', price: 799, originalPrice: 999, category: 'apparel', rating: 4.7, reviews: 56, inStock: true },
  { id: 'tshirt-earth-tone', title: 'Yoga T-Shirt - Earth Tone', description: 'Comfortable fit for yoga practice, breathable fabric, sizes S/M/L/XL.', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80', price: 799, originalPrice: 999, category: 'apparel', rating: 4.6, reviews: 43, inStock: true },
  { id: 'singing-bowl-premium', title: 'Tibetan Singing Bowl - Premium', description: 'Hand-crafted bronze singing bowl for meditation and sound healing.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 2499, originalPrice: 3499, category: 'sound-healing', rating: 4.9, reviews: 78, inStock: true },
  { id: 'crystal-bowl-set', title: 'Crystal Singing Bowl Set', description: '7-piece crystal bowl set for complete chakra healing and sound therapy.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 4999, originalPrice: 6999, category: 'sound-healing', rating: 5.0, reviews: 32, inStock: true },
  { id: 'mallet-set', title: 'Singing Bowl Mallet Set', description: 'Wool and wooden mallets for singing bowl practice, set of 3.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 399, originalPrice: 599, category: 'sound-healing', rating: 4.6, reviews: 45, inStock: true },
  { id: 'tibetan-bell', title: 'Tibetan Bell (Ghanta)', description: 'Ritual bell for Buddhist practices and meditation ceremonies.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 899, originalPrice: 1299, category: 'sound-healing', rating: 4.7, reviews: 38, inStock: true },
  { id: 'meditation-cushion', title: 'Meditation Cushion (Zafu)', description: 'Buckwheat hull filling for proper meditation posture and comfort.', image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80', price: 1299, originalPrice: 1799, category: 'mattress-cushions', rating: 4.8, reviews: 156, inStock: true },
  { id: 'yoga-mat', title: 'Yoga Mat - Natural Rubber', description: 'Eco-friendly, non-slip natural rubber mat for safe practice.', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&q=80', price: 1899, originalPrice: 2499, category: 'mattress-cushions', rating: 4.7, reviews: 98, inStock: true },
  { id: 'bolster-pillow', title: 'Yoga Bolster Pillow', description: 'Cylindrical bolster for supported restorative yoga poses.', image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&q=80', price: 899, originalPrice: 1299, category: 'mattress-cushions', rating: 4.6, reviews: 67, inStock: true },
  { id: 'malas-beads', title: 'Malas (Prayer Beads)', description: '108 beads, tulsi wood, traditional meditation malas for japa practice.', image: 'https://images.unsplash.com/photo-1609511431665-7bf36cb4b9e8?w=400&q=80', price: 399, originalPrice: 599, category: 'accessories', rating: 4.9, reviews: 67, inStock: true },
  { id: 'yoga-strap', title: 'Yoga Strap - Cotton', description: '6ft adjustable cotton strap for deepening stretches and flexibility.', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&q=80', price: 299, originalPrice: 399, category: 'accessories', rating: 4.6, reviews: 45, inStock: true },
  { id: 'incense-holder', title: 'Incense Holder Set (Brass)', description: 'Brass incense holder with natural incense sticks for meditation space.', image: 'https://images.unsplash.com/photo-1517260917998-0f373bc0e2d2?w=400&q=80', price: 449, originalPrice: 599, category: 'accessories', rating: 4.7, reviews: 38, inStock: true },
  { id: 'chakra-hanging', title: 'Chakra Wall Hanging', description: 'Handwoven tapestry depicting the seven chakras for meditation space.', image: 'https://images.unsplash.com/photo-1609511431665-7bf36cb4b9e8?w=400&q=80', price: 899, originalPrice: 1299, category: 'accessories', rating: 4.8, reviews: 52, inStock: true },
]

export const teachers: Teacher[] = [
  { id: 'dr-srinatha', name: 'Dr. Srinatha', role: 'Founder & Director', image: '/teachers/Dr.Srinatha.webp', specialization: 'Hatha Yoga, Iyengar Yoga, Ashtanga Yoga' },
  { id: 'ravi-prabhakar', name: 'Ravi Prabhakar', role: 'Methodology & Anatomy', image: '/teachers/ravi.webp', specialization: 'Anatomy, Physiology, Teaching Methodology' },
  { id: 'vinayaka-honnavar', name: 'Vinayaka Honnavar', role: 'Philosophy & Sound Healing', image: '/teachers/vinayak.webp', specialization: 'Yoga Philosophy, Meditation, Sound Healing' },
  { id: 'sahana-pr', name: 'Sahana P R', role: 'Yin Yoga & Prenatal', image: '/teachers/Sahana.webp', specialization: 'Yin Yoga, Prenatal & Postnatal, Anatomy' },
  { id: 'hrishanth', name: 'Hrishanth', role: 'Yoga Therapy & Ashtanga', image: '/teachers/hrishanth.webp', specialization: 'Yoga Therapy, Ashtanga Yoga' },
  { id: 'minu-sajji', name: 'Minu Sajji', role: 'Pranayama & Chair Yoga', image: '/teachers/minu.webp', specialization: 'Pranayama, Wheel Yoga, Chair Yoga' },
  { id: 'charanya', name: 'Charanya', role: 'Ayurveda & Philosophy', image: '/teachers/charanya.webp', specialization: 'Ayurveda, Yoga Philosophy, Pranayama' },
  { id: 'anulasha-ram', name: 'Anulasha Ram', role: 'Aerial Yoga & Marketing', image: '/teachers/Anu.webp', specialization: 'Aerial Yoga, Community Outreach' },
]

export const userProfile: UserProfile = {
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.com',
  avatar: '/placeholder-user.jpg',
  memberSince: 'March 2025',
  certificatesEarned: 1,
  totalHoursLearned: 68,
  streakDays: 12,
}

export const announcements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New Batch: 200h TTC Starting Sep 1st',
    description: 'Apply now for the upcoming 200-hour Yoga Teacher Training batch. Early bird discount available until August 15th.',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
    date: '25 May 2026',
  },
  {
    id: 'ann-2',
    title: 'Community Satsang: Full Moon Meditation',
    description: 'Join us for a special full moon meditation and chanting session on June 3rd at 6 PM IST.',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
    date: '20 May 2026',
  },
  {
    id: 'ann-3',
    title: 'New Product: Organic Yoga Mats Arrived',
    description: 'Our eco-friendly natural rubber yoga mats are now in stock. Get yours before they sell out!',
    image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
    date: '15 May 2026',
  },
]

export const categories: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'teacher-training', label: 'Teacher Training' },
  { id: 'specialized', label: 'Specialized' },
]

export const productCategories: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'books', label: 'Books' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'sound-healing', label: 'Sound Healing' },
  { id: 'mattress-cushions', label: 'Mattress & Cushions' },
  { id: 'accessories', label: 'Accessories' },
]

export const ttcResources: TTCResource[] = [
  { id: 'primary-series-chart', title: 'Primary Series Asana Chart', type: 'pdf', description: 'Complete Ashtanga Primary Series with vinyasa counts and drishti', size: '2.4 MB' },
  { id: 'sanskrit-pronunciation', title: 'Sanskrit Pronunciation Guide', type: 'pdf', description: 'Correct pronunciation of asana names and mantras', size: '1.2 MB' },
  { id: 'yoga-sutras-chanting', title: 'Yoga Sutras Chanting Audio', type: 'audio', description: 'Traditional chanting of Patanjali Yoga Sutras with guidance', duration: '45 min' },
  { id: 'anatomy-for-yoga', title: 'Human Anatomy for Yoga Teachers', type: 'pdf', description: 'Essential anatomy knowledge for safe yoga teaching', size: '8.5 MB' },
  { id: 'pranayama-video', title: 'Pranayama Practice Video Series', type: 'video', description: 'Step-by-step guided pranayama practices for daily sadhana', duration: '120 min' },
  { id: 'sequencing-guide', title: 'Class Sequencing Guide', type: 'pdf', description: 'How to structure yoga classes for different levels and themes', size: '1.9 MB' },
  { id: 'teaching-methodology', title: 'Teaching Methodology Video', type: 'video', description: 'Masterclass on effective yoga teaching techniques', duration: '90 min' },
  { id: 'bhagavad-gita-notes', title: 'Bhagavad Gita Study Notes', type: 'pdf', description: 'Key verses and commentary from the Bhagavad Gita', size: '2.8 MB' },
  { id: 'mantra-chanting', title: 'Mantra Chanting Compilation', type: 'audio', description: 'Collection of traditional mantras for daily practice', duration: '60 min' },
  { id: 'adjustments-manual', title: 'Adjustments & Assists Manual', type: 'pdf', description: 'Safe hands-on adjustments for common yoga postures', size: '12.4 MB' },
]
