import { test } from "../fixtures/auth-fixture";
import { expect } from "@playwright/test";
import { loadUsers } from "../utils/loadUsers";
import { LoginPage } from "../pages/login-page";
import { ProductPage } from "../pages/product-page";
import { MenuPage } from "../pages/menu-page";

const users = loadUsers();
const validUsers = Object.values(users).filter(user => user.shouldBeLoggedIn);

test.describe('Product Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let menuPage: MenuPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    menuPage = new MenuPage(page);
    
    await loginPage.openPage();
  });

  test.describe('Cart Management', () => {
    Object.values(validUsers).forEach(user => {
      test(`verify ${user.username} can add products to cart`, {
        tag: ['@cart', '@smoke', '@products']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        const inventoryItems = await productPage.getInventoryItems();
        expect(inventoryItems.length).toBeGreaterThan(0);
        
        await productPage.addFirstitemToCart();
        let cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(1);
      });

      test(`verify ${user.username} can remove products from cart`, {
        tag: ['@cart', '@products']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        await productPage.addFirstitemToCart();
        let cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(1);

        await productPage.removeFirstItemFromCart();
        cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(0);
      });

      test(`verify ${user.username} can add multiple products to cart`, {
        tag: ['@cart', '@products']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        const inventoryItems = await productPage.getInventoryItems();
        const totalItems = inventoryItems.length;

        await productPage.addAllItemsToCart();
        let cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(totalItems);
      });
    });
  });

  test.describe('Sorting Functionality', () => {
    Object.values(validUsers).forEach(user => {
      test(`verify ${user.username} can sort products by name (A-Z)`, {
        tag: ['@sorting', '@products']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        await productPage.sortByNameAZ();
        const productNames = await productPage.getProductNames();
        const sortedNames = [...productNames].sort();
        expect(productNames).toEqual(sortedNames);
      });

      test(`verify ${user.username} can sort products by price (low to high)`, {
        tag: ['@sorting', '@products', '@bug']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        await productPage.sortByPriceLowToHigh();
        const prices = await productPage.getProductPrices();
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
      });
    });
  });

  test.describe('App State Management', () => {
    Object.values(validUsers).forEach(user => {
      test(`verify reset app state cleans cart for ${user.username}`, {
        tag: ['@reset', '@cart', '@products']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        await productPage.addAllItemsToCart();
        let cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBeGreaterThan(0);

        await menuPage.resetAppState();
        cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(0);
      });

      test(`verify ${user.username} price consistency when navigating via All Items`, {
        tag: ['@navigation', '@prices', '@bug']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        const initialPrices = await productPage.getProductPrices();
        await menuPage.clickAllItems();
        const pricesAfterNavigation = await productPage.getProductPrices();

        expect(pricesAfterNavigation).toEqual(initialPrices);
      });
    });
  });
});