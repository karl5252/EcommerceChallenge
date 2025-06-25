import { test } from "../fixtures/auth-fixture";
import { expect } from "@playwright/test";
import { loadUsers } from "../utils/loadUsers";
import { ProductPage } from "../pages/product-page";
import { LoginPage } from "../pages/login-page";
import { NavigationPage } from "../pages/navigation-page";

const users = loadUsers();
const validUsers = Object.values(users).filter(user => user.shouldBeLoggedIn);

test.describe('Burger Menu Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    navigationPage = new NavigationPage(page);
    
    await loginPage.openPage();
  });

  Object.values(validUsers).forEach(user => {
    test(`verify burger menu can be opened and closed for ${user.username}`, {
      tag: ['@burger', '@navigation', '@smoke']
    }, async ({ page }) => {
      await loginPage.login(user.username, user.password);

      // Verify logged in successfully
      const inventoryItems = await productPage.getInventoryItems();
      expect(inventoryItems.length).toBeGreaterThan(0);

      // Open and verify menu
      await navigationPage.openBurgerMenu();
      await navigationPage.expectLogoutLinkVisible();
      
      // Close and verify menu closed
      await page.click('#react-burger-cross-btn');
      await navigationPage.expectLogoutLinkNotVisible();
    });

    test(`verify about button functionality for ${user.username}`, {
      tag: ['@burger', '@navigation', '@about']
    }, async ({ page }) => {
      await loginPage.login(user.username, user.password);

      // Verify logged in successfully
      const inventoryItems = await productPage.getInventoryItems();
      expect(inventoryItems.length).toBeGreaterThan(0);

      // Test about navigation
      await navigationPage.clickAbout();
      await expect(page).toHaveURL(/.*saucelabs/);
    });
  });
});