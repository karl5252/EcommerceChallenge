import { expect, Page } from "@playwright/test";

export class LoginPage {
    private page: Page;

    private usernameInput = '#user-name';
    private passwordInput = '#password';
    private loginButton = '#login-button';
    private errorMessage = '.error-message-container';
    
    constructor(page: Page) {
        this.page = page;
    }

    async openPage() {
        await this.page.goto('/');
        await this.page.waitForLoadState('networkidle');

    }

    async login(username: string, password: string) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }

    async getErrorMessage() {
        return this.page.locator(this.errorMessage);
    }

    async expectLoginButtonVisible() {
        await expect(this.page.locator(this.loginButton)).toBeVisible();
    }
}