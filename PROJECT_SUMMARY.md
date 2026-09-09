# Srinatha Yoga School — Project Documentation

Last updated: June 6, 2026
Stack: Next.js 16.2.4 + Supabase + Turbopack

---

## 1. Architecture

```
WEBSITE (public, no auth)
  / /about /teachers /courses /shop /contact /search
  /cart /privacy /terms /refund /checkout

WEBAPP (dashboard, login required)
  /dashboard (5-tab mobile layout)
  /dashboard/login /signup /forgot-password /reset-password
  /dashboard/checkout /orders /calendar /certificates /resources
  /dashboard/courses/[id]
  /learn/[courseId]

API
  POST /api/contact
  POST /api/payments/razorpay/create-order
  POST /api/payments/razorpay/verify

Auth
  GET /auth/callback — Supabase OAuth/code exchange
```

### Key Distinction
- **Website** = marketing, browsing, cart. All public.
- **Webapp** = purchases, learning, user data. Login required.
- **Checkout** = inside webapp (`/dashboard/checkout`). Protected by auth proxy.
- **Cart** = React Context + localStorage. Shared across website and webapp.

---

## 2. Supabase Database (18 tables)

profiles, courses, lessons, products, workshops, categories,
orders, order_items, shipping_addresses, enrollments, lesson_progress,
workshop_registrations, saved_items, wishlist_items, notifications,
ttc_resources, ttc_enrollments, contact_messages

RLS enabled on all tables. Users see only own data. Admin role policies ready.

---

## 3. Auth System

| Feature | Status |
|---------|--------|
| Email/password signup + login | ✅ |
| Password reset | ✅ |
| Magic Link (passwordless) | ✅ |
| Session persistence (SSR cookies) | ✅ |
| Auth middleware (proxy.ts) | ✅ — protects /dashboard and /checkout |
| Google OAuth | ❌ — replaced with Magic Link (no credit card needed) |

---

## 4. Purchase Flow

1. Add to cart → Cart page → "Proceed to Checkout"
2. Proxy checks auth → redirects to login if needed
3. `/dashboard/checkout` — auto-fills profile + saved address
4. "Pay" button saves order, enrollments, registrations to Supabase
5. Redirects to `/dashboard/orders`

**Payment currently bypassed** — Razorpay code exists but inactive. Pay saves order directly as `completed`. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to activate.

---

## 5. Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_GA_ID=              # Optional
RAZORPAY_KEY_ID=                # Required for real payments
RAZORPAY_KEY_SECRET=            # Required for real payments
RESEND_API_KEY=                 # For Supabase Custom SMTP
```

---

## 6. Key Libraries

| Package | Purpose |
|---------|---------|
| next 16.2.4 | Framework |
| @supabase/supabase-js + @supabase/ssr | Database + Auth |
| lucide-react | Icons |
| tailwindcss 4 | Styling |
| posthog-js | Product analytics |
| @vercel/analytics | Vercel analytics |
| @playwright/test 1.60 | E2E testing |

---

## 7. Key Files

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Browser client creation |
| `lib/supabase-queries.ts` | All DB queries + cached fetch functions |
| `lib/supabase-types.ts` | Full TypeScript types for 18 tables |
| `lib/auth.ts` | Auth functions (signup, login, magic link, etc.) |
| `lib/payments.ts` | Payment provider abstraction (Razorpay/Stripe) |
| `lib/storage.ts` | Supabase Storage helpers (avatars, documents) |
| `lib/utils.ts` | cn(), formatPrice() |
| `lib/app-data.ts` | Type definitions + static mock data for UI components |
| `proxy.ts` | Auth middleware (Turbopack compiles as middleware) |
| `components/auth-provider.tsx` | React Context for auth state |
| `components/cart/cart-context.tsx` | Cart state (Context + localStorage) |
| `components/providers.tsx` | Root providers (Auth + Cart + PostHog) |
| `playwright.config.ts` | Playwright config (system Chrome) |
| `tests/` | 53 E2E tests across 5 spec files |

---

## 8. Build & Run

```bash
npm install
npm run dev          # Dev server with Turbopack, port 3000
npm run build        # Production build
npm start            # Production server
npx playwright test  # Run 53 E2E tests (requires dev server on 3000)
```

---

## 9. Known Issues

| Issue | Status |
|-------|--------|
| `ignoreBuildErrors: true` in next.config.mjs | Hides TS errors from lucide-react + dynamic imports |
| Razorpay keys missing from .env.local | Payments bypassed — keys needed for real gateway |
| proxy.ts named file works but is non-standard | Turbopack compiles it as middleware despite name |
| Static mock data in app-data.ts coexists with live Supabase queries | Some UI screens use hardcoded data instead of DB |
| Database seeding needed for new projects | `scripts/seed.mjs` must be run manually |
| No server-side auth redirect (client-only) | proxy.ts only partially works (Turbopack-specific) |

---

## 10. Recent Changes

| Date | Change |
|------|--------|
| Jun 6 | 53 Playwright E2E tests added (auth, cart, nav, protected routes, public pages) |
| Jun 6 | Fixed middleware auth exclusion for signup/forgot-password/reset-password |
| Jun 6 | Dashboard screens switched to dynamic imports for perf |
| Jun 6 | Added Razorpay env vars to .env.example |
| Jun 6 | Removed `typescript.ignoreBuildErrors` from next.config.mjs |
