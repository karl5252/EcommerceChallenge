import { Page } from '@playwright/test';

export class MenuPage {
  private page: Page;

  private menuButton = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';
  private resetAppStateLink = '#reset_sidebar_link';
  private allItemsLink = '#inventory_sidebar_link';
  private aboutLink = '#about_sidebar_link';

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

  async resetAppState() {
    await this.openBurgerMenu();
    await this.page.click(this.resetAppStateLink);
  }

  async clickAllItems() {
    await this.openBurgerMenu();
    await this.page.click(this.allItemsLink); 
  }

  async clickAbout() {
    await this.openBurgerMenu();
    await this.page.click(this.aboutLink);
  }

  async expectLogoutLinkVisible() {
    await this.page.waitForSelector(this.logoutLink, { state: 'visible' });
  }

  async expectLogoutLinkNotVisible() {
  await this.page.waitForSelector(this.logoutLink, { state: 'hidden' });
  }
}