import { expect, Page } from "@playwright/test";

export class CartPage {
   
    private page: Page;

    private cartItems = '.cart_item';
    private checkoutButton = '.checkout_button';

    constructor(page: Page) {
        this.page = page;
    }

    async getCartItemsCount(): Promise<number> {
        return await this.page.locator(this.cartItems).count();
    }
    async clickCheckoutButton() {
        await this.page.click(this.checkoutButton);
    }
}