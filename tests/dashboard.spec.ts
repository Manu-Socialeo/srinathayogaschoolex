import { test, expect } from '@playwright/test'

test.describe('Student Dashboard (Unauthenticated)', () => {
  const protectedPages = [
    { path: '/dashboard', title: /Student Login/ },
    { path: '/dashboard/courses/yoga-sadhana-beginner', title: /Student Login/ },
    { path: '/dashboard/orders', title: /Student Login/ },
    { path: '/dashboard/certificates', title: /Student Login/ },
    { path: '/dashboard/resources', title: /Student Login/ },
    { path: '/dashboard/calendar', title: /Student Login/ },
  ]

  for (const { path, title } of protectedPages) {
    test(`${path} redirects to login`, async ({ page }) => {
      await page.goto(path)
      await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
      await expect(page).toHaveTitle(title)
    })
  }

  test('course detail loads publicly available info', async ({ page }) => {
    await page.goto('/dashboard/courses/yoga-sadhana-beginner')
    await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Welcome Back')
  })

  test('dashboard attempt preserves redirect path', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
    const params = new URL(page.url()).searchParams
    expect(params.get('redirect')).toBe('/dashboard')
  })
})

test.describe('Student Dashboard (Authenticated)', () => {
  test.skip('dashboard home shows welcome and course progress', async () => {
    // Requires: Valid Supabase auth session
    // Setup: Create test user, login via API, verify dashboard renders tabs
  })

  test.skip('profile page shows user info', async () => {
    // Requires: Authenticated session
    // Setup: Login, navigate to profile tab, verify name/email/stats
  })

  test.skip('purchases page shows order history', async () => {
    // Requires: Authenticated session + past orders in DB
    // Setup: Login, navigate to orders, verify order list renders
  })

  test.skip('course access shows enrolled courses with progress', async () => {
    // Requires: Authenticated session + enrollments in DB
    // Setup: Login, navigate to learn tab, verify enrolled courses visible
  })

  test.skip('product access shows purchased products', async () => {
    // Requires: Authenticated session + product purchases in DB
    // Setup: Login, navigate to store tab, verify purchased products
  })
})
