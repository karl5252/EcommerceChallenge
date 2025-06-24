import test, { expect } from "@playwright/test";

test('verify login with valid credentials', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/');

  // Fill in the username and password fields
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');

  // Click the login button
  await page.click('#login-button');

  // Verify that the URL is correct after login
  await expect(page).toHaveURL(/inventory/);

  // Verify that the inventory items are visible
  const inventoryItems = await page.$$('.inventory_item');
  expect(inventoryItems.length).toBeGreaterThan(0);
});