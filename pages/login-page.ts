import { Page } from "@playwright/test";

export class LoginPage {
    private page: Page;

    private usernameInput = '#username';
    private passwordInput = '#password';
    private loginButton = '#login-button';
    private errorMessage = '.error-message-container';
    
    constructor(page) {
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

    async isErrorMessageVisible() {
        return await this.page.isVisible(this.errorMessage);
    }
}