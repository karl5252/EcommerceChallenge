import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { ProductPage } from '../pages/product-page';

export const test = base.extend<{
  page: Page;
  loginPage: LoginPage;
  productPage: ProductPage;
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
  }

});