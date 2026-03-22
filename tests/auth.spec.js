import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {

  test('user can register', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `testuser${Date.now()}@example.com`); // unique email
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirm"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('user can login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('login fails with wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'testuser@example.com');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Check your inbox')).toBeVisible();
  });

  test('register shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=required')).toBeVisible();
  });
});