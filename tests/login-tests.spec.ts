import { expect } from "@playwright/test";
import { test } from "../fixtures/auth-fixture";
import { LoginPage } from "../pages/login-page";
import { ProductPage } from "../pages/product-page";

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
  test(`verify ${user.shouldBeLoggedIn ? 'successful' : 'failed'} login for ${user.username}`, async ({page}) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    await loginPage.openPage();
    // Perform login with the user credentials
    await loginPage.login(user.username, user.password);

    // Verify that the login was successful or failed based on the user type
    if (user.shouldBeLoggedIn) {

      // Verify that the inventory items are visible
      const inventoryItems = await productPage.getInventoryItems()
      expect(inventoryItems.length).toBeGreaterThan(0);
    } else {
      // Verify that the login failed by checking for an error message  
      const errorMessage = await loginPage.getErrorMessage();
      await expect(errorMessage).toBeVisible();
    }
  });
});
