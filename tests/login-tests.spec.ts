import { expect } from "@playwright/test";
import { test } from "../fixtures/auth-fixture";
import { LoginPage } from "../pages/login-page";
import { ProductPage } from "../pages/product-page";
import { loadUsers } from "../utils/loadUsers";

const users = loadUsers();


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
