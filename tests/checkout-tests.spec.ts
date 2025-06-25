//1.  happy path: LOGIN-> ADD ITEMS (we can go with add all items or just one at thiss tage it shouldnt do any difference) ->CLICK CART-> ITEM CLICKED IS IN THE CART-> CLICK PROCEED-> FILL ADDRESS-> CLICK ORDER
//2. sad path addresses: LOGIN-> ADD ITEMS (we can go with add all items or just one at thiss tage it shouldnt do any difference) ->CLICK CART-> ITEM CLICKED IS IN THE CART-> CLICK PROCEED-> DONT FILL ADDRESS-> CLICK ORDER->VERIFY PRICES-> FINISH
//3. sad path addresses: LOGIN-> ADD ITEMS (we can go with add all items or just one at thiss tage it shouldnt do any difference) ->CLICK CART-> ITEM CLICKED IS IN THE CART-> CLICK PROCEED-> FILL SOME RUBBISH IN ADDRESS FIELDS TO TEST VALIDATION (only standard user)-> CLICK ORDER->VERIFY PRICES-> FINISH
//4. sad path: LOGIN->CLICK CART-> CART IS EMPTY-> CHECKOUT SHOULD BE DISABLED (is not; BUG)
//5. happy path: LOGIN-> ADD ITEMS (we can go with add all items or just one at thiss tage it shouldnt do any difference) ->CLICK CART-> ITEM CLICKED IS IN THE CART-> CLICK REMOVE ITEM
//6. happy path for navigation:  LOGIN-> ADD ITEMS (we can go with add all items or just one at thiss tage it shouldnt do any difference) ->CLICK CART-> CLICK CONTINUE SHOPPING -> VERIFY WE ARE ON PRODUCT LIST PAGE
//7. happy path for navigation:  LOGIN-> ADD ITEMS (we can go with add all items or just one at thiss tage it shouldnt do any difference) ->CLICK CART-> CLICK CONFIRM-> CLICK CANCEL -> GO BACK TO CART
//8. happy path for navigation:  LOGIN-> ADD ITEMS (we can go with add all items or just one at thiss tage it shouldnt do any difference) ->CLICK CART-> CLICK CONFIRM-> CLICK PROCEED ->CLICK CANCEL-> RETUIRN TO PRODUCT PAGE (smells like a bug to be honest)

import { test } from "../fixtures/auth-fixture";
import { expect } from "@playwright/test";
import { loadUsers } from "../utils/loadUsers";
import { ProductPage } from "../pages/product-page"; 
import { LoginPage } from "../pages/login-page";
import { NavigationPage } from "../pages/navigation-page";

const users = loadUsers();
const standard_user = users['standard_user'];
const problem_user = users['problem_user'];
const validUsers = Object.values(users).filter(user => user.shouldBeLoggedIn);


Object.values(validUsers).forEach(user => {
  test(`verify that user can add items to cart and proceed to checkout for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);

    await loginPage.openPage();
    await loginPage.login(user.username, user.password);

    // Verify that the inventory items are visible
    const inventoryItems = await productPage.getInventoryItems();
    expect(inventoryItems.length).toBeGreaterThan(0);

    // Add all items to the cart
    await productPage.addAllItemsToCart();
    
    // Click on the cart icon
    await productPage.clickCartIcon();
    // Verify that cart shows correct number of items .cart_list  .cart_item
    const cartItemCound = await page.locator('.cart_item').count();
    expect(cartItemCound).toBeGreaterThan(0);

    // click checkout button
    await page.click('.checkout_button');
    // Verify that we are on the checkout page
    await expect(page).toHaveURL(/.*\/checkout-step-one/);
    // Fill in the checkout form
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');

    // Click on the continue button
    await page.click('#continue');

    // Verify that we are on the overview page
    await expect(page).toHaveURL(/.*\/checkout-step-two/);
    // Verify that the item prices are correct
    // Get tax from the UI
    const taxAmount = await page.$eval('.summary_tax_label', el => 
    parseFloat(el.textContent?.replace('Tax: $', '') || '0'));

    const itemPrices = await page.$$eval('.inventory_item_price', 
    prices => prices.map(price => parseFloat(price.textContent?.replace('$', '') || '0')));

    const subtotal = itemPrices.reduce((acc, price) => acc + price, 0);
    const expectedTotal = subtotal + taxAmount;

    const actualTotal = await page.$eval('.summary_total_label', el => 
    parseFloat(el.textContent?.replace('Total: $', '') || '0'));

    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    // Click on the finish button
    await page.click('#finish');
    // Verify that we are on the order confirmation page
    await expect(page).toHaveURL(/.*\/checkout-complete/);
    // Verify that the order confirmation message is visible
    const orderConfirmationMessage = await page.locator('.complete-header');
    expect(await orderConfirmationMessage.isVisible()).toBeTruthy();
    
  }
);
}
);