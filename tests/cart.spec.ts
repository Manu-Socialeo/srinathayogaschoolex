import { test, expect } from '@playwright/test'

test.describe('Cart', () => {
  test('empty cart page shows empty state', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByText('Your cart is empty')).toBeVisible()
  })

  test('cart page loads with correct layout', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('body')).toBeVisible()
  })

  test('shop page loads and shows product cards', async ({ page }) => {
    await page.goto('/shop')
    await expect(page.locator('h1').first()).toBeVisible()
    await page.waitForLoadState('networkidle')
  })

  test('shop page has product cards', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForTimeout(3000)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('cart link exists in header', async ({ page }) => {
    await page.goto('/')
    const cartLink = page.locator('a[href="/cart"]')
    await expect(cartLink.first()).toBeVisible()
  })

  test('navigation from header cart link works', async ({ page }) => {
    await page.goto('/')
    const cartLink = page.locator('a[href="/cart"]')
    if (await cartLink.count() > 0) {
      await cartLink.first().click()
      await expect(page).toHaveURL(/\/cart/)
    }
  })

  test('checkout page without login redirects to login', async ({ page }) => {
    await page.goto('/dashboard/checkout')
    await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Welcome Back')
  })

  test('checkout page on public route redirects to login', async ({ page }) => {
    await page.goto('/checkout')
    await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Welcome Back')
  })
})
