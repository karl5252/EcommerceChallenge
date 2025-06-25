import { expect } from "@playwright/test";
import { test } from "../fixtures/auth-fixture";
import { LoginPage } from "../pages/login-page";
import { ProductPage } from "../pages/product-page";
import { loadUsers } from "../utils/loadUsers";
import { NavigationPage } from "../pages/navigation-page";

const users = loadUsers();
const standard_user = users['standard_user'];

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    navigationPage = new NavigationPage(page);
    
    await loginPage.openPage(); // Every auth test starts here
  });
Object.values(users).forEach(user => {
  test(`verify ${user.shouldBeLoggedIn ? 'successful' : 'failed'} login for ${user.username}`,{tag: ['@auth', '@smoke', user.shouldBeLoggedIn ? '@positive' : '@negative']}, async ({page}) => {

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


test('verify user can logout', {tag:['@auth', '@smoke', '@logout']}, async ({ page }) => {
  await loginPage.login(standard_user.username, standard_user.password);

  // Assert successful login
  const inventoryItems = await productPage.getInventoryItems();
  expect(inventoryItems.length).toBeGreaterThan(0);

  // Logout via burger menu
  await navigationPage.logout();

  // Validate redirect to login page
  await expect(page).toHaveURL('/');
  await loginPage.expectLoginButtonVisible();

  // Validate session is gone on reload
  await page.reload();
  await loginPage.expectLoginButtonVisible();
});
});