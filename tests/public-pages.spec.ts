import { test, expect } from '@playwright/test'

test.describe('Public Pages', () => {
  const defaultTitle = /Srinatha Yoga School/

  const pages = [
    { path: '/', title: defaultTitle },
    { path: '/about', title: defaultTitle },
    { path: '/courses', title: defaultTitle },
    { path: '/teachers', title: defaultTitle },
    { path: '/shop', title: defaultTitle },
    { path: '/contact', title: defaultTitle },
    { path: '/cart', title: defaultTitle },
    { path: '/search', title: defaultTitle },
    { path: '/privacy', title: defaultTitle },
    { path: '/terms', title: defaultTitle },
    { path: '/refund', title: defaultTitle },
  ]

  for (const { path, title } of pages) {
    test(`${path} loads successfully`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveTitle(title, { timeout: 15000 })
      await expect(page.locator('body')).toBeVisible()
    })
  }

  test('homepage has header with navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByText('Srinatha Yoga School').first()).toBeVisible()
    await expect(page.getByText('Courses').first()).toBeVisible()
    await expect(page.getByText('Student Login').first()).toBeVisible()
  })

  test('homepage has footer with links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('homepage hero section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/200k\+/).first()).toBeVisible()
    await expect(page.getByText(/Explore Programs/)).toBeVisible()
  })

  test('404 page loads for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText('Page Not Found')).toBeVisible()
  })

  test('can navigate from homepage to courses', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Courses/i }).first().click()
    await expect(page).toHaveURL(/\/courses/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('can navigate from homepage to teachers', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /Teachers/i }).first().click()
    await expect(page).toHaveURL(/\/teachers/)
  })

  test('contact page has form with required fields', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByText('First Name *')).toBeVisible()
    await expect(page.getByText('Email *')).toBeVisible()
    await expect(page.getByText('Message *')).toBeVisible()
    await expect(page.getByText('Send Message')).toBeVisible()
    await expect(page.locator('input[type="email"]').first()).toBeVisible()
    await expect(page.locator('textarea').first()).toBeVisible()
  })

  test('contact page shows contact info', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByText('Contact Information')).toBeVisible()
    await expect(page.getByText('info@srinathayoga.com')).toBeVisible()
  })

  test('search page has input and loads results', async ({ page }) => {
    await page.goto('/search')
    const searchInput = page.locator('input[type="text"]')
    await expect(searchInput).toBeVisible()
  })
})
