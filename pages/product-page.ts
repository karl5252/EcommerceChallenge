import { Page } from "@playwright/test";

export class ProductPage {
    

    private page: Page;

    private inventoryItem = '.inventory_item';
    private addToCartButton = '.inventory_item .btn_primary';
    private removeFromCartButton = '.inventory_item .btn_secondary';
    private cartIconCounter = '.shopping_cart_badge';
    private sortDropdown = '.product_sort_container';
    private itemPrice = '.inventory_item_price';
    private itemName = '.inventory_item_name';

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

    async removeFirstItemFromCart() {
        const firstRemoveButton = this.page.locator(this.removeFromCartButton).first();
        await firstRemoveButton.click();
    }

    async sortByNameAZ() {
        await this.page.selectOption(this.sortDropdown, 'az');
    }

    async sortByPriceLowToHigh() {
        await this.page.selectOption(this.sortDropdown, 'lohi');
    }

    async getProductNames() {
        const productNames = await this.page.$$eval(this.itemName, elements => 
            elements.map(el => el.textContent?.trim() || '')
        );
        return productNames;
    }

    async getProductPrices() {
        const prices = await this.page.$$eval(this.itemPrice, 
            elements => elements.map(el => parseFloat(el.textContent?.replace('$', '') || '0')));
        return prices;
    }
}
