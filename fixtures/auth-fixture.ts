import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductPage } from '../pages/product-page';
import { MenuPage } from '../pages/menu-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutInfoPage } from '../pages/checkout-info-page';
import { CheckoutOverviewPage } from '../pages/checkout-overview-page';

export const test = base.extend<{
  page: Page;
  loginPage: LoginPage;
  productPage: ProductPage;
  menuPage: MenuPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  orderConfirmationPage: CheckoutOverviewPage;

}>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.openPage();

    await use(page);
    await context.close();
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  menuPage: async ({ page }, use) => {
    const menuPage = new MenuPage(page);
    await use(menuPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutInfoPage: async ({ page }, use) => {
    const checkoutInfoPage = new CheckoutInfoPage(page);
    await use(checkoutInfoPage);
  },
  checkoutOverviewPage: async ({ page }, use) => {
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await use(checkoutOverviewPage);
  },
  orderConfirmationPage: async ({ page }, use) => {
    const orderConfirmationPage = new CheckoutOverviewPage(page);
    await use(orderConfirmationPage);
  }

});