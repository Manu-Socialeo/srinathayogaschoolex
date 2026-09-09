# Srinatha Yoga School

Next.js 16 + Supabase website and student webapp for an online yoga school.

## Tech Stack
- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Supabase (Postgres, Auth, Storage)
- **Icons**: Lucide React
- **Fonts**: Playfair Display (serif), Inter (sans)

## Routes (30 total)

### Public Website (12 pages)
`/` `/about` `/courses` `/teachers` `/shop` `/contact` `/search` `/cart` `/checkout` `/privacy` `/terms` `/refund`

### Student Webapp (11 pages)
`/dashboard` `/dashboard/login` `/dashboard/signup` `/dashboard/forgot-password` `/dashboard/reset-password` `/dashboard/checkout` `/dashboard/orders` `/dashboard/calendar` `/dashboard/certificates` `/dashboard/resources` `/dashboard/courses/[courseId]`

### API (3 routes)
`/api/contact` `/api/payments/razorpay/create-order` `/api/payments/razorpay/verify`

### Auth
`/auth/callback` — Supabase auth callback

## Key Features
- Email/password + Magic Link authentication
- Cart with React Context + localStorage
- Cart + checkout flow with auto-filled profile/address from Supabase
- Course player with progress tracking
- Full purchase flow (orders, enrollments, registrations)
- SEO (sitemap.xml, robots.txt, JSON-LD, metadata)
- Google Analytics 4 (conditional on env var)

## Getting Started

```bash
npm install
npm run dev        # Dev server on http://localhost:3000
npm run build      # Production build
npm start          # Production server
```

## Environment Variables (`.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (seed scripts only) |
| `NEXT_PUBLIC_APP_URL` | App base URL |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID (optional) |

## Database

18 tables: profiles, courses, lessons, products, workshops, orders, order_items, enrollments, lesson_progress, workshop_registrations, shipping_addresses, saved_items, wishlist_items, notifications, ttc_resources, ttc_enrollments, categories, contact_messages

Row Level Security enabled on all tables. Admin role policies ready.

## Build Output

30 routes, ~10s build time with Turbopack. TypeScript strict mode enabled (ignoreBuildErrors for lucide-react upstream issue).

Last updated: May 26, 2026
