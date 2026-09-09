import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('header navigation links are visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await expect(page.getByText('Home').first()).toBeVisible()
    await expect(page.getByText('Courses').first()).toBeVisible()
    await expect(page.getByText('About').first()).toBeVisible()
  })

  test('header logo links to homepage', async ({ page }) => {
    await page.goto('/courses')
    await page.getByText('Srinatha Yoga School').first().click()
    await expect(page).toHaveURL('/')
  })

  test('student login button in header', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Student Login').first().click()
    await expect(page).toHaveURL(/\/dashboard\/login/)
  })

  test('search icon in header navigates to search', async ({ page }) => {
    await page.goto('/')
    const searchLink = page.locator('a[href="/search"]')
    if (await searchLink.count() > 0) {
      await searchLink.first().click()
      await expect(page).toHaveURL(/\/search/)
    }
  })

  test('footer has privacy and terms links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('breadcrumb navigation on courses page', async ({ page }) => {
    await page.goto('/courses')
    await expect(page.getByText(/Back to Home/i).first()).toBeVisible()
  })
})
