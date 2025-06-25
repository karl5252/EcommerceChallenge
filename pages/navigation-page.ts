import { Page } from '@playwright/test';

export class NavigationPage {
  private page: Page;

  private menuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    this.page = page;
  }

  async openBurgerMenu() {
    await this.page.click(this.menuButton);
  }

  async logout() {
    await this.openBurgerMenu();
    await this.page.click(this.logoutLink);
  }
}