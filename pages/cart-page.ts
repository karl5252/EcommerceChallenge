import { expect, Page } from "@playwright/test";

export class CartPage {
    private page: Page;

    private cartItems = '.cart_item';
    private checkoutButton = '.checkout_button';
    private continueShoppingButton = '#continue-shopping';

    constructor(page: Page) {
        this.page = page;
    }

    async getCartItemsCount(): Promise<number> {
        return await this.page.locator(this.cartItems).count();
    }
    async clickCheckoutButton() {
        await this.page.click(this.checkoutButton);
    }
    async isCheckoutButtonDisabled() {
        const checkoutButton = this.page.locator(this.checkoutButton);
        return await checkoutButton.isDisabled();
  
    }
    async clickContinueShoppingButton() {
      const continueShoppingButton = this.page.locator(this.continueShoppingButton);
      await continueShoppingButton.click();
    }
}