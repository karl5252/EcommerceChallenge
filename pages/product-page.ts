import { Page } from "@playwright/test";

export class ProductPage {
    private page: Page;

    private inventoryItem = '.inventory_item';

    constructor(page) {
    this.page = page;
    }

}
