import { Page } from "@playwright/test";

export class CheckoutOverviewPage {
    private page: Page;

    private taxAmountLabel = '.summary_tax_label';
    private itemPricesSelector = '.inventory_item_price';
    private totalLabel = '.summary_total_label';
    private finishButton = '#finish';

    constructor(page: Page) {
        this.page = page;
    }
    async verifyTaxAmount(): Promise<number> {
        return await this.page.$eval(this.taxAmountLabel, el => 
            parseFloat(el.textContent?.replace('Tax: $', '') || '0'));
    }

    async verifyItemPrices(): Promise<number[]> {
        return await this.page.$$eval(this.itemPricesSelector, 
            prices => prices.map(price => parseFloat(price.textContent?.replace('$', '') || '0')));
    }
    async verifySubtotal(): Promise<number> {
        const itemPrices = await this.verifyItemPrices();
        return itemPrices.reduce((acc, price) => acc + price, 0);
    }
    async verifyTotal(): Promise<number> {
        const subtotal = await this.verifySubtotal();
        const taxAmount = await this.verifyTaxAmount();
        return subtotal + taxAmount;
    }
    async getTotal(): Promise<number> {
        return await this.page.$eval(this.totalLabel, el =>
            parseFloat(el.textContent?.replace('Total: $', '') || '0'));
    }
    async clickFinishButton(): Promise<void> {
        await this.page.click(this.finishButton);
    }
    

    /*const taxAmount = await page.$eval('.summary_tax_label', el => 
    parseFloat(el.textContent?.replace('Tax: $', '') || '0'));

    const itemPrices = await page.$$eval('.inventory_item_price', 
    prices => prices.map(price => parseFloat(price.textContent?.replace('$', '') || '0')));

    const subtotal = itemPrices.reduce((acc, price) => acc + price, 0);
    const expectedTotal = subtotal + taxAmount;

    const actualTotal = await page.$eval('.summary_total_label', el => 
    parseFloat(el.textContent?.replace('Total: $', '') || '0'));

    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    // Click on the finish button
    await page.click('#finish');*/
}