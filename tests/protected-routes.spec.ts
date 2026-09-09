import { test, expect } from '@playwright/test'

test.describe('Protected Routes', () => {
  const protectedPaths = [
    '/dashboard',
    '/dashboard/orders',
    '/dashboard/checkout',
    '/dashboard/resources',
    '/dashboard/certificates',
    '/dashboard/calendar',
  ]

  for (const path of protectedPaths) {
    test(`${path} redirects unauthenticated users to login`, async ({ page }) => {
      await page.goto(path)
      await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
      await expect(page.locator('h1')).toContainText('Welcome Back')
    })
  }

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/dashboard/login')
    await expect(page.locator('h1')).toContainText('Welcome Back')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('redirect preserves original path', async ({ page }) => {
    await page.goto('/dashboard/orders')
    await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
    const redirectParam = new URL(page.url()).searchParams.get('redirect')
    expect(redirectParam).toBe('/dashboard/orders')
  })
})
