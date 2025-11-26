import { test, expect } from '@playwright/test';
import { StorePage } from '../pages/StorePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('ATID Store - Checkout form validation & data persistence', () => {
  test('Invalid email shows errors and keeps other data', async ({ page }) => {
    const storePage = new StorePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await storePage.goto();
    await storePage.openFirstInStockProduct();
    await productPage.selectFirstVariantIfExists();
    await productPage.setQuantity(1);
    await productPage.addToCart();
    await productPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.assertGuestFormFieldsVisible();

    await checkoutPage.fillValidGuestData();
    await checkoutPage.clearEmailField();

    const before = await checkoutPage.getAllFieldValues();

    await checkoutPage.placeOrder();

    await checkoutPage.assertValidationErrorShown();
    await checkoutPage.assertStillOnCheckoutPage();

    const after = await checkoutPage.getAllFieldValues();
    expect(after.firstName).toBe(before.firstName);
    expect(after.lastName).toBe(before.lastName);
    expect(after.address).toBe(before.address);

    await checkoutPage.fillEmail('email@example.com');
    await checkoutPage.placeOrder();
    await checkoutPage.assertStillOnCheckoutPage();

});

});
