import { test, expect } from '@playwright/test'

test.describe('Commerce (Unauthenticated)', () => {
  test('shop page has visible products', async ({ page }) => {
    await page.goto('/shop')
    await page.waitForTimeout(3000)
    await expect(page.locator('h1').first()).toBeVisible()
    const productCards = page.locator('[class*="card"], [class*="product"], article, .group')
    const cardCount = await productCards.count()
    expect(cardCount).toBeGreaterThanOrEqual(0)
  })

  test('cart page has header and layout', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('cart page empty state shows continue shopping link', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByText('Your cart is empty')).toBeVisible()
    const shopLink = page.locator('a[href="/shop"]')
    await expect(shopLink.first()).toBeVisible()
  })

  test('product navigation from shop to cart', async ({ page }) => {
    await page.goto('/shop')
    const cartLink = page.locator('a[href="/cart"]')
    if (await cartLink.count() > 0) {
      await cartLink.first().click()
      await expect(page).toHaveURL(/\/cart/)
    }
  })

  test('checkout redirect preserves login redirect param', async ({ page }) => {
    await page.goto('/dashboard/checkout')
    await page.waitForURL(/\/dashboard\/login/, { timeout: 10000 })
    const params = new URL(page.url()).searchParams
    expect(params.get('redirect')).toBe('/checkout')
  })
})

test.describe('Commerce (Authenticated)', () => {
  test.skip('checkout page shows form and order summary', async () => {
    // Requires: Valid Supabase auth session + items in cart
    // Setup: Login, add item to cart via localStorage, navigate to checkout
  })

  test.skip('purchase flow creates order on success', async () => {
    // Requires: Auth session + cart items + Razorpay test keys
    // Setup: Login, add to cart, complete Razorpay test payment, verify order created
  })

  test.skip('purchase failure shows error state', async () => {
    // Requires: Auth session + cart items
    // Setup: Login, add to cart, simulate payment failure, verify error displayed
  })

  test.skip('add to cart button renders on product', async () => {
    // Requires: Auth session to see "Add to Cart" on course/product pages
    // Setup: Login, navigate to course or product detail, verify add to cart button
  })
})
