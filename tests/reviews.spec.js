import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

test.describe('Reviews', () => {

  test('shop reviews page loads', async ({ page }) => {
    await page.goto('/shop-reviews');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=What Our Customers Say')).toBeVisible();
  });

  test('product reviews page loads', async ({ page }) => {
    await page.goto('/products/silk-draped-blouse/reviews');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Reviews')).toBeVisible();
  });

  test('can filter shop reviews by star rating', async ({ page }) => {
    await page.goto('/shop-reviews');
    await page.waitForLoadState('networkidle');
    await page.locator('button', { hasText: '5 ★' }).click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=reviews')).toBeVisible();
  });

  test('review form is visible when logged in', async ({ page }) => {
    await login(page);
    await page.goto('/shop-reviews');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Write a Review')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('shows sign in prompt when not logged in', async ({ page }) => {
    await page.goto('/shop-reviews');
    await expect(page.locator('text=Sign In')).toBeVisible();
  });
});