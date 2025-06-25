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
const users = loadUsers();
const standard_user = users['standard_user'];
const validUsers = Object.values(users).filter(user => user.shouldBeLoggedIn);

Object.values(validUsers).forEach(user => {
    test(`verify if page loads and ${user.username} can add products to cart`, async ({ page}) => {
        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);
    
        await loginPage.openPage();
        await loginPage.login(user.username, user.password);

        const inventoryItems = await productPage.getInventoryItems();
        expect(inventoryItems.length).toBeGreaterThan(0);
        // Add the first product to the cart
        await productPage.addFirstitemToCart();
        // Verify that the cart icon updates with the number of items in the cart
        let cartCount = await productPage.getCartItemCount() 
        expect(cartCount).toBe(1);
    });
});

Object.values(validUsers).forEach(user => {
    test(`verify if ${user.username} can remove products from cart`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);

        await loginPage.openPage();
        await loginPage.login(user.username, user.password);

        // Add the first product to the cart
        await productPage.addFirstitemToCart();
        let cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(1);

        // Remove the first product from the cart
        await productPage.removeFirstItemFromCart();

        // Verify that the cart icon updates with the number of items in the cart
        cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(0);
    });
});

Object.values(validUsers).forEach(user => {
    test (`verify ${user.username} can add multiple products to cart`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);

        await loginPage.openPage();
        await loginPage.login(user.username, user.password);

        // Add all avaialbe products to the cart
        const inventoryItems = await productPage.getInventoryItems();
        const totalItems = inventoryItems.length;

        // Add all products to cart
        await productPage.addAllItemsToCart();

        // Verify that the cart icon updates with the number of items in the cart
        let cartCount = await productPage.getCartItemCount();
        expect(cartCount).toBe(totalItems);
    });
});

Object.values(validUsers).forEach(user => {
    test(`verify ${user.username} can sort products by name (A-Z)`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);

        await loginPage.openPage();
        await loginPage.login(user.username, user.password);

        await productPage.sortByNameAZ();
        
        const productNames = await productPage.getProductNames();
        
        const sortedNames = [...productNames].sort();
        expect(productNames).toEqual(sortedNames);
    });

    test(`verify ${user.username} can sort products by price (low to high)`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const productPage = new ProductPage(page);

        await loginPage.openPage();
        await loginPage.login(user.username, user.password);

        await productPage.sortByPriceLowToHigh();
        
        const prices = await productPage.getProductPrices();
        
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });
});
