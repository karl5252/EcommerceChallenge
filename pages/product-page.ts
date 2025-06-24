import { Page } from "@playwright/test";

export class ProductPage {
    private page: Page;

    private inventoryItem = '.inventory_item';

    constructor(page) {
    this.page = page;
    }

    async getInventoryItems() {
        await this.page.waitForSelector(this.inventoryItem);
        return await this.page.$$(this.inventoryItem);
    }

}
