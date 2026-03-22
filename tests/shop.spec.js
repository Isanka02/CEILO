import { test, expect } from '@playwright/test';

test.describe('Shop / Products', () => {

  test('home page loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=CEILO')).toBeVisible();
    await expect(page.locator('text=Shop Now')).toBeVisible();
  });

  test('can navigate to all products page', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.product-card').first()).toBeVisible();
  });

  test('can search for a product', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.fill('input[placeholder*="Search"]', 'blouse');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.product-card').first()).toBeVisible();
  });

  test('can filter by category', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.click('text=Jewelry');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.product-card').first()).toBeVisible();
  });

  test('can sort products by price', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.selectOption('select', 'price_asc');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.product-card').first()).toBeVisible();
  });

  test('can view single product detail', async ({ page }) => {
    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.locator('.product-card').first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Add to Cart')).toBeVisible();
  });

  test('can browse products by category page', async ({ page }) => {
    await page.goto('/category/jewelry');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Jewelry')).toBeVisible();
  });

  test('can save item to wishlist when logged in', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    await page.goto('/products');
    await page.waitForLoadState('networkidle');
    await page.locator('.product-card').first().hover();
    await page.locator('.wishlist-btn').first().click();
  });
});