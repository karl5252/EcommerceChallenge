import { Page } from "@playwright/test";

export class OrderConfirmationPage {
    private page: Page;

    private orderConfirmationMessage = '.complete-header';
    private orderDetails = '.order_details';

    constructor(page: Page) {
        this.page = page;
    }

    async getOrderConfirmationMessage(): Promise<string> {
        return await this.page.locator(this.orderConfirmationMessage).textContent() || '';
    }

    async getOrderDetails(): Promise<string> {
        return await this.page.locator(this.orderDetails).textContent() || '';
    }
}