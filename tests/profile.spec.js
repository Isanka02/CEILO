import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

test.describe('User Profile', () => {

  test('can view profile page', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await expect(page.locator('text=My Profile')).toBeVisible();
  });

  test('can edit profile name', async ({ page }) => {
    await login(page);
    await page.goto('/profile');
    await page.locator('button', { hasText: 'Edit Profile' }).click();
    await page.fill('input[type="text"]', 'Updated Name');
    await page.locator('button', { hasText: 'Save Changes' }).click();
    await expect(page.locator('text=Profile updated')).toBeVisible();
  });

  test('can view saved wishlist', async ({ page }) => {
    await login(page);
    await page.goto('/profile/saved');
    await expect(page.locator('text=Saved Items')).toBeVisible();
  });

  test('can add a new address', async ({ page }) => {
    await login(page);
    await page.goto('/profile/addresses');
    await page.locator('button', { hasText: 'Add New' }).click();
    await page.fill('input[name="street"]', '456 Test Road');
    await page.fill('input[name="city"]', 'Kandy');
    await page.fill('input[name="zip"]', '20000');
    await page.fill('input[name="country"]', 'Sri Lanka');
    await page.locator('button', { hasText: 'Save Address' }).click();
    await expect(page.locator('text=456 Test Road')).toBeVisible();
  });

  test('can view notifications', async ({ page }) => {
    await login(page);
    await page.goto('/notifications');
    await expect(page.locator('text=Notifications')).toBeVisible();
  });
});