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
        const cartIcon = this.page.locator(this.cartIconCounter);
        if (await cartIcon.isVisible()) {
            const cartCount = await cartIcon.textContent();
            return parseInt(cartCount || '0', 10);
        }
        return 0;
    }

    async addAllItemsToCart() {
        const addToCartButtons = this.page.locator(this.addToCartButton);
        const count = await addToCartButtons.count();
        for (let i = 0; i < count; i++) {
            const button = addToCartButtons.first(); // Get the first button in the list (list shrinks as items are added)
            await button.scrollIntoViewIfNeeded();  // Ensure the button is in view
            await button.click();
            await this.page.waitForTimeout(100); // Small delay to let DOM update
        }
    }
}
