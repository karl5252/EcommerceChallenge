import { Page } from "@playwright/test";

export class ProductPage {
    private page: Page;

    private inventoryItem = '.inventory_item';
    private addToCartButton = '.inventory_item .btn_primary';
    private cartIconCounter = '.shopping_cart_badge';

    constructor(page: Page) {
    this.page = page;
    }

    async getInventoryItems() {
        await this.page.waitForSelector(this.inventoryItem);
        return await this.page.$$(this.inventoryItem);
    }

    async addFirstitemToCart(){
        const firstAddToCartButton = this.page.locator(this.addToCartButton).first();
        await firstAddToCartButton.click();
    }

    async getCartItemCount() {
        const cartIcon = await this.page.$(this.cartIconCounter);
        if (cartIcon) {
            const cartCount = await cartIcon.textContent();
            return parseInt(cartCount || '0', 10);
        }
        return 0;
    }

}
