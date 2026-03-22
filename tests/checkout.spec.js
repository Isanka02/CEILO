import { test, expect } from '@playwright/test';

// reusable login helper
async function login(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/');
}

async function fillCheckoutForm(page) {
  await page.fill('input[name="firstName"]', 'Jane');
  await page.fill('input[name="lastName"]', 'Smith');
  await page.fill('input[name="email"]', 'jane@example.com');
  await page.fill('input[name="phone"]', '+94771234567');
  await page.fill('input[name="street"]', '123 Main Street');
  await page.fill('input[name="city"]', 'Colombo');
  await page.fill('input[name="zip"]', '00100');
}

test.describe('Checkout', () => {

  test('can add product to cart and place order', async ({ page }) => {
    await login(page);

    await page.goto('/products/silk-draped-blouse');
    await page.waitForLoadState('networkidle');
    await page.locator('.variant-btn', { hasText: 'M' }).click();
    await page.locator('button', { hasText: 'Add to Cart' }).click();
    await expect(page.locator('text=Added to cart')).toBeVisible();

    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    await fillCheckoutForm(page);
    await page.locator('button', { hasText: 'Place Order' }).click();
    await expect(page.locator('text=Order Placed!')).toBeVisible({ timeout: 10000 });
  });

  test('checkout form shows validation errors when empty', async ({ page }) => {
    await login(page);
    await page.goto('/checkout');
    await page.locator('button', { hasText: 'Place Order' }).click();
    await expect(page.locator('text=Required').first()).toBeVisible();
  });

  test('can view my orders after placing order', async ({ page }) => {
    await login(page);
    await page.goto('/account/orders');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=My Orders')).toBeVisible();
  });

  test('can view order details', async ({ page }) => {
    await login(page);
    await page.goto('/account/orders');
    await page.waitForLoadState('networkidle');
    await page.locator('text=View').first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Items Ordered')).toBeVisible();
  });

  test('can cancel a pending order', async ({ page }) => {
    await login(page);
    await page.goto('/account/orders');
    await page.waitForLoadState('networkidle');
    // only runs if there is a pending order
    const cancelBtn = page.locator('text=Cancel Order');
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
      await page.locator('text=Yes, Cancel').click();
      await expect(page.locator('text=canceled')).toBeVisible();
    }
  });
});