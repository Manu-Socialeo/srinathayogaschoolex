import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page loads with all form elements', async ({ page }) => {
    await page.goto('/dashboard/login')
    await expect(page.locator('h1')).toContainText('Welcome Back')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByText('Send Magic Link')).toBeVisible()
    await expect(page.getByText('Forgot password?')).toBeVisible()
  })

  test('login page has signup link', async ({ page }) => {
    await page.goto('/dashboard/login')
    await expect(page.getByText('Sign up')).toBeVisible()
  })

  test('login page shows error for invalid credentials', async ({ page }) => {
    await page.goto('/dashboard/login')
    await page.fill('input[type="email"]', 'nonexistent@test.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    await expect(page.getByText(/invalid|error|failed|Invalid/i)).toBeVisible({ timeout: 15000 })
  })

  test('magic link button disabled when email empty', async ({ page }) => {
    await page.goto('/dashboard/login')
    const magicBtn = page.getByText('Send Magic Link')
    await expect(magicBtn).toBeVisible()
    await expect(magicBtn).toBeDisabled()
  })

  test('magic link button enables when email is filled', async ({ page }) => {
    await page.goto('/dashboard/login')
    const btn = page.getByText('Send Magic Link')
    await expect(btn).toBeDisabled()
    await page.fill('input[type="email"]', 'test@example.com')
    await expect(btn).toBeEnabled()
  })

  test('signup page loads', async ({ page }) => {
    await page.goto('/dashboard/signup')
    await expect(page.getByText('Create Account').first()).toBeVisible()
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('signup page links to login', async ({ page }) => {
    await page.goto('/dashboard/signup')
    await expect(page.getByText('Log in')).toBeVisible()
  })

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/dashboard/forgot-password')
    await expect(page.getByText('Reset Password')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('forgot password sends reset link', async ({ page }) => {
    await page.goto('/dashboard/forgot-password')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.getByRole('button', { name: /Send Reset Link/i }).click()
    await expect(page.getByText('Check Your Email')).toBeVisible({ timeout: 15000 })
  })

  test('login page can navigate to signup', async ({ page }) => {
    await page.goto('/dashboard/login')
    await page.getByText('Sign up').click()
    await expect(page).toHaveURL(/\/dashboard\/signup/)
  })

  test('login page can navigate to forgot password', async ({ page }) => {
    await page.goto('/dashboard/login')
    await page.getByText('Forgot password?').click()
    await expect(page).toHaveURL(/\/dashboard\/forgot-password/)
  })

  test('login page has back to home link', async ({ page }) => {
    await page.goto('/dashboard/login')
    await expect(page.getByText(/Back to Home/i)).toBeVisible()
  })

  test('login page shows logo', async ({ page }) => {
    await page.goto('/dashboard/login')
    await expect(page.locator('img[alt="Srinatha Yoga School"]').first()).toBeVisible()
  })

  test('signup page validates password length', async ({ page }) => {
    await page.goto('/dashboard/signup')
    await page.fill('input[type="text"]', 'Test User')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', '123')
    const validity = await page.locator('input[type="password"]').evaluate((el: HTMLInputElement) => el.validity.valid)
    expect(validity).toBe(false)
  })
})
