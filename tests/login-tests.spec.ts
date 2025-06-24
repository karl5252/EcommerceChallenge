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

test('verify login with invalid credentials', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/');

  // Fill in the username and password fields with invalid credentials
  await page.fill('#user-name', 'invalid_user');
  await page.fill('#password', 'wrong_password');

  // Click the login button
  await page.click('#login-button');

  // Verify that the error message is displayed
  const errorMessage = await page.locator('.error-message-container.error');
  await expect(errorMessage).toBeVisible();
});

test('verify login with empty credentials', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/');

  // Click the login button without filling in credentials
  await page.click('#login-button');

  // Verify that the error message is displayed
  const errorMessage = await page.locator('.error-message-container.error');
  await expect(errorMessage).toBeVisible();
});

test ('verify login with locked out user', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/');

  // Fill in the username and password fields with locked out user credentials
  await page.fill('#user-name', 'locked_out_user');
  await page.fill('#password', 'secret_sauce');

  // Click the login button
  await page.click('#login-button');

  // Verify that the error message is displayed for locked out user
  const errorMessage = await page.locator('.error-message-container.error');
  await expect(errorMessage).toBeVisible();
});