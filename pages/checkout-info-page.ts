import { Page } from "@playwright/test";

export class CheckoutInfoPage {
    private page: Page;

    private firstNameInput = '#first-name';
    private lastNameInput = '#last-name';
    private postalCodeInput = '#postal-code';
    private continueButton = '#continue';
    private errorMessage = '.error-message-container';

    constructor(page: Page) {
        this.page = page;
    }

    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill(this.firstNameInput, firstName);
        await this.page.fill(this.lastNameInput, lastName);
        await this.page.fill(this.postalCodeInput, postalCode);
        await this.page.click(this.continueButton);
    }

    async getErrorMessage() {
        return this.page.locator(this.errorMessage);
    }
}