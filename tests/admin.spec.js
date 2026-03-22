import { test, expect } from '@playwright/test';

// ⚠️ use an account that already has role: 'admin' in your DB
async function adminLogin(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'ishu@gmail.com');
  await page.fill('input[name="password"]', '1111Aa_');
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

test.describe('Admin Dashboard', () => {

  test('admin can view analytics', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Analytics')).toBeVisible();
    await expect(page.locator('text=Total Revenue')).toBeVisible();
  });

  test('admin can view all orders', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Orders')).toBeVisible();
  });

  test('admin can update order status', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    await page.locator('button', { hasText: 'Edit' }).first().click();
    await page.selectOption('select', 'processing');
    await page.locator('button', { hasText: 'Update' }).click();
    await expect(page.locator('text=processing')).toBeVisible();
  });

  test('admin can view all users', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Users')).toBeVisible();
  });

  test('admin can block a user', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    await page.locator('button', { hasText: 'Block' }).first().click();
    await expect(page.locator('text=Blocked').first()).toBeVisible();
  });

  test('admin can add a new product', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/products');
    await page.locator('button', { hasText: 'Add Product' }).click();
    await page.fill('input[name="name"]', 'Test Product');
    await page.fill('input[name="price"]', '99');
    await page.fill('input[name="description"]', 'A test product description');
    await page.selectOption('select[name="category"]', { index: 1 });
    await page.locator('button', { hasText: 'Add Product' }).last().click();
    await expect(page.locator('text=Test Product')).toBeVisible();
  });

  test('admin can delete a product', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    await page.locator('button', { hasText: 'Delete' }).first().click();
    await page.locator('button', { hasText: 'Delete' }).last().click(); // confirm
  });

  test('admin can view categories', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Categories')).toBeVisible();
  });

  test('admin can send a notification', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/notifications');
    await page.fill('input[name="title"]', 'Test Notification');
    await page.fill('textarea[name="message"]', 'This is a test notification message.');
    await page.locator('button', { hasText: 'Send Notification' }).click();
    await expect(page.locator('text=sent successfully')).toBeVisible();
  });
});