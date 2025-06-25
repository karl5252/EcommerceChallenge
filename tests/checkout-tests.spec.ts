import { test } from "../fixtures/auth-fixture";
import { expect } from "@playwright/test";
import { loadUsers } from "../utils/loadUsers";
import { ProductPage } from "../pages/product-page"; 
import { LoginPage } from "../pages/login-page";
import { CartPage } from "../pages/cart-page";
import { CheckoutInfoPage } from "../pages/checkout-info-page";
import { CheckoutOverviewPage } from "../pages/checkout-overview-page";
import { OrderConfirmationPage } from "../pages/order-confirmation-page";

const users = loadUsers();
const standard_user = users['standard_user'];
const validUsers = Object.values(users).filter(user => user.shouldBeLoggedIn);

test.describe('Checkout Tests', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let orderConfirmationPage: OrderConfirmationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    orderConfirmationPage = new OrderConfirmationPage(page);
    
    await loginPage.openPage();
  });

  test.describe('Full Checkout Flow', () => {
    Object.values(validUsers).forEach(user => {
      test(`verify complete checkout flow for ${user.username}`, {
        tag: ['@checkout', '@smoke', '@e2e']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        const inventoryItems = await productPage.getInventoryItems();
        expect(inventoryItems.length).toBeGreaterThan(0);

        await productPage.addAllItemsToCart();
        await productPage.clickCartIcon();
        
        const cartItemCount = await cartPage.getCartItemsCount();
        expect(cartItemCount).toBeGreaterThan(0);

        await cartPage.clickCheckoutButton();
        await expect(page).toHaveURL(/.*\/checkout-step-one/);

        await checkoutInfoPage.fillCheckoutInfo('Test', 'User', '12345');
        const errorMessage = await checkoutInfoPage.getErrorMessage();
        expect(await errorMessage.isVisible()).toBe(false);

        await expect(page).toHaveURL(/.*\/checkout-step-two/);
        
        const expectedTotal = await checkoutOverviewPage.verifyTotal();
        const actualTotal = await checkoutOverviewPage.getTotal();
        expect(actualTotal).toBeCloseTo(expectedTotal, 2);
        
        await checkoutOverviewPage.clickFinishButton();
        await expect(page).toHaveURL(/.*\/checkout-complete/);
        
        const orderConfirmationMessage = await orderConfirmationPage.getOrderConfirmationMessage();
        expect(await orderConfirmationMessage.match('Thank you for your order!')).toBe(true);
      });
    });
  });

  test.describe('Cart Management', () => {
    test('verify user cannot proceed to checkout with empty cart', {
      tag: ['@checkout', '@cart', '@bug']
    }, async ({ page }) => {
      await loginPage.login(standard_user.username, standard_user.password);
      await productPage.clickCartIcon();
      
      const isCartEmpty = await cartPage.getCartItemsCount();
      expect(isCartEmpty).toBe(0);

      const isCheckoutButtonDisabled = await cartPage.isCheckoutButtonDisabled();
      expect(isCheckoutButtonDisabled).toBe(true);
    });

    test('verify continue shopping navigation works', {
      tag: ['@checkout', '@navigation', '@cart']
    }, async ({ page }) => {
      await loginPage.login(standard_user.username, standard_user.password);

      await productPage.addFirstitemToCart();
      await productPage.clickCartIcon();
      await cartPage.clickContinueShoppingButton();

      await expect(page).toHaveURL(/.*\/inventory/);
      const inventoryItems = await productPage.getInventoryItems();
      expect(inventoryItems.length).toBeGreaterThan(0);
    });

    Object.values(validUsers).forEach(user => {
      test(`verify ${user.username} can remove item from cart`, {
        tag: ['@checkout', '@cart']
      }, async ({ page }) => {
        await loginPage.login(user.username, user.password);

        await productPage.addAllItemsToCart();
        const initialCartCount = await productPage.getCartItemCount();
        
        await productPage.clickCartIcon();
        await cartPage.removeFirstItem();
        
        const finalCartCount = await productPage.getCartItemCount();
        expect(finalCartCount).toBe(initialCartCount - 1);
      });
    });
  });

  test.describe('Form Validation', () => {
    test('verify user cannot proceed with invalid address', {
      tag: ['@checkout', '@validation', '@negative']
    }, async ({ page }) => {
      await loginPage.login(standard_user.username, standard_user.password);

      await productPage.addFirstitemToCart();
      await productPage.clickCartIcon();
      await cartPage.clickCheckoutButton();

      await checkoutInfoPage.fillCheckoutInfo('Invalid', '', ''); // Missing fields

      const errorMessage = await checkoutInfoPage.getErrorMessage();
      expect(await errorMessage.isVisible()).toBe(true);
    });
  });
});