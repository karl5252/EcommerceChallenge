import test, { expect } from "@playwright/test";

const users = {
  standard_user: {
    username: 'standard_user',
    password: 'secret_sauce',
    shouldBeLoggedIn: true,
  },
  locked_out_user: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    shouldBeLoggedIn: false,
  },
  problem_user: {
    username: 'problem_user',
    password: 'secret_sauce',
    shouldBeLoggedIn: true,
  },
  performance_glitch_user: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    shouldBeLoggedIn: true,
  },
  invalid_user: {
    username: 'invalid_user',
    password: 'wrong_password',
    shouldBeLoggedIn: false,
  },
  empty_user: {
    username: '',
    password: '',
    shouldBeLoggedIn: false,
  },
  error_user: {
    username: 'error_user',
    password: 'secret_sauce',
    shouldBeLoggedIn: true,
  },
  visual_user: {
    username: 'visual_user',
    password: 'secret_sauce',
    shouldBeLoggedIn: true,
  }
};
Object.values(users).forEach(user => {
  test(`verify ${user.shouldBeLoggedIn ? 'successful' : 'failed'} login for ${user.username}`, async ({ page }) => {
    // Navigate to the login page
    await page.goto('/');

    // Fill in the username and password fields
    await page.fill('#user-name', user.username);
    await page.fill('#password', user.password);

    // Click the login button
    await page.click('#login-button');

    // Verify that the login was successful or failed based on the user type
    if (user.shouldBeLoggedIn) {
      // Verify that the URL is correct after login
      await expect(page).toHaveURL(/inventory/);

      // Verify that the inventory items are visible
      const inventoryItems = await page.$$('.inventory_item');
      expect(inventoryItems.length).toBeGreaterThan(0);
    } else {
      // Verify that the login failed by checking for an error message  
      const errorMessage = await page.locator('.error-message-container.error');
      await expect(errorMessage).toBeVisible();
    }
  });
});
