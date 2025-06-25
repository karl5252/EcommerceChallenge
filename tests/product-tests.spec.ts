// verify if page loads and user can add products to cart
// verify if user can remove products from cart
// verify if cart icon updates with the number of items in the cart
// verify if sorting functionality works correctly
// verify reset app state cleans the cart and resets the app state
// verify if prices are displayed correctly

import test, { expect } from "@playwright/test";
import { loadUsers } from "../utils/loadUsers";
import { LoginPage } from "../pages/login-page";
import { ProductPage } from "../pages/product-page";

// verify if product images are displayed correctly
const standard_user = loadUsers()['standard_user'];

test('verify if page loads and user can add products to cart', async ({ page}) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    
    await loginPage.openPage();
    await loginPage.login(standard_user.username, standard_user.password);
    const inventoryItems = await productPage.getInventoryItems();
    expect(inventoryItems.length).toBeGreaterThan(0);
    // Add the first product to the cart
    const firstAddToCartButton = page.locator('.inventory_item .btn_primary').first();
    await firstAddToCartButton.click();
    // Verify that the cart icon updates with the number of items in the cart
    const cartIcon = await page.$('.shopping_cart_badge');
    const cartCount = await cartIcon?.textContent();
    expect(cartCount).toBe('1');
    
});