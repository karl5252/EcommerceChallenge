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
import { CartPage } from "../pages/cart-page";
import { CheckoutInfoPage } from "../pages/checkout-info-page";
import { CheckoutOverviewPage } from "../pages/checkout-overview-page";
import { OrderConfirmationPage } from "../pages/order-confirmation-page";

const users = loadUsers();
const standard_user = users['standard_user'];
const validUsers = Object.values(users).filter(user => user.shouldBeLoggedIn);


Object.values(validUsers).forEach(user => {
  test(`verify that user can add items to cart and proceed to checkout for ${user.username}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutInfoPage = new CheckoutInfoPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const orderConfirmationPage = new OrderConfirmationPage(page);


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
    const cartItemCound = await cartPage.getCartItemsCount();
    expect(cartItemCound).toBeGreaterThan(0);

    // click checkout button
    await cartPage.clickCheckoutButton();
    // Verify that we are on the checkout page
    await expect(page).toHaveURL(/.*\/checkout-step-one/);

    // Fill in the checkout form with early fail
    await checkoutInfoPage.fillCheckoutInfo('Test', 'User', '12345');
    // Check for error message if any
    const errorMessage = await checkoutInfoPage.getErrorMessage();
    // asert that there is no error message
    expect(await errorMessage.isVisible()).toBe(false);

    // Verify that we are on the overview page
    await expect(page).toHaveURL(/.*\/checkout-step-two/);
    // Verify that the item prices are correct
    const expectedTotal = await checkoutOverviewPage.verifyTotal();

    const actualTotal = await checkoutOverviewPage.getTotal();

    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    // Click on the finish button
    await checkoutOverviewPage.clickFinishButton();
    // Verify that we are on the order confirmation page
    await expect(page).toHaveURL(/.*\/checkout-complete/);
    // Verify that the order confirmation message is visible
    const orderConfirmationMessage = await orderConfirmationPage.getOrderConfirmationMessage();
    expect(await orderConfirmationMessage.match('Thank you for your order!')).toBe(true);
    
  });
});

test('verify user cannot proceed to checkout with empty cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await loginPage.openPage();
  await loginPage.login(standard_user.username, standard_user.password);

  // Click on the cart icon
  await productPage.clickCartIcon();
  
  // Verify that the cart is empty
  const isCartEmpty = await cartPage.getCartItemsCount();
  expect(isCartEmpty).toBe(0);

  // Verify that the checkout button is disabled
  const isCheckoutButtonDisabled = await cartPage.isCheckoutButtonDisabled();
  expect(isCheckoutButtonDisabled).toBe(true);
});

test('verify continue shopping navigation works', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await loginPage.openPage();
  await loginPage.login(standard_user.username, standard_user.password);

  // Add item and go to cart
  await productPage.addFirstitemToCart();
  await productPage.clickCartIcon();

  // Click continue shopping
  await cartPage.clickContinueShoppingButton();

  // Verify we're back on products page
  await expect(page).toHaveURL(/.*\/inventory/);
  
  // Verify products are still visible
  const inventoryItems = await productPage.getInventoryItems();
  expect(inventoryItems.length).toBeGreaterThan(0);
});

Object.values(validUsers).forEach(user => {
  test(`verify ${user.username} can remove item from cart`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await loginPage.openPage();
    await loginPage.login(user.username, user.password);

    // Add all items to cart
    await productPage.addAllItemsToCart();
    const initialCartCount = await productPage.getCartItemCount();
    
    // Go to cart
    await productPage.clickCartIcon();
    
    // Remove one item
    await cartPage.removeFirstItem();
    
    // Verify cart count decreased by 1
    const finalCartCount = await productPage.getCartItemCount();
    expect(finalCartCount).toBe(initialCartCount - 1);
  });
});

test('verify user cannot proceed to checkout with invalid address', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutInfoPage = new CheckoutInfoPage(page);

  await loginPage.openPage();
  await loginPage.login(standard_user.username, standard_user.password);

  // Add item and go to cart
  await productPage.addFirstitemToCart();
  await productPage.clickCartIcon();

  // Click checkout button
  await cartPage.clickCheckoutButton();

  // Fill in invalid address
  await checkoutInfoPage.fillCheckoutInfo('Invalid', '', ''); // Missing last name and postal code

  // Verify error message is shown
  const errorMessage = await checkoutInfoPage.getErrorMessage();
  expect(await errorMessage.isVisible()).toBe(true);
});
