import { test } from "../fixtures/auth-fixture";
import { expect } from "@playwright/test";
import { loadUsers } from "../utils/loadUsers";
import { ProductPage } from "../pages/product-page";
import { LoginPage } from "../pages/login-page";
import { NavigationPage } from "../pages/navigation-page";

const users = loadUsers();
const validUsers = Object.values(users).filter(user => user.shouldBeLoggedIn);

Object.values(validUsers).forEach(user => {
    test(`verify that burger menu can be opened and closed for ${user.username}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);
        const navigationPage = new NavigationPage(page);

        await loginPage.openPage();
        await loginPage.login(user.username, user.password);

        // Verify that the inventory items are visible
        const inventoryItems = await productPage.getInventoryItems();
        expect(inventoryItems.length).toBeGreaterThan(0);

        // Open the burger menu
        await navigationPage.openBurgerMenu();

        // Verify that the burger menu is open by checking if the logout link is visible
        await navigationPage.expectLogoutLinkVisible();
        // Close the burger menu by clicking outside of it
        await page.click('#react-burger-cross-btn'); // Click on the body to close the menu

        // Verify that the burger menu is closed by checking if the logout link is not visible
        await navigationPage.expectLogoutLinkNotVisible();
    }
    );
});