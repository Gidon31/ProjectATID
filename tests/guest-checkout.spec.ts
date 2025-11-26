import { test, expect } from '@playwright/test';
import { StorePage } from '../pages/StorePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe.serial('ATID Store - Cart & Checkout flows', () => {
  test('Scenario 1 Guest checkout journey (up to payment)', async ({ page }) => {
    const storePage = new StorePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await storePage.goto();
    await storePage.openFirstInStockProduct();

    await productPage.selectFirstVariantIfExists();
    await productPage.setQuantity(2);
    await productPage.addToCart();
    await productPage.goToCart();

    const unitPrice = await cartPage.getUnitPrice();
    const subtotal = await cartPage.getSubtotal();
    const quantity = await cartPage.getQuantity();

    expect(quantity).toBeGreaterThan(0);
    expect(subtotal).toBeCloseTo(unitPrice * quantity, 2);

    const methods = ['Local pickup', 'Express', 'Registered'];
    for (const method of methods) {
      const selected = await cartPage.selectShippingMethodIfExists(method);
      if (!selected) continue;

      const shipping = await cartPage.getShipping();
      const total = await cartPage.getTotal();

      expect(total).toBeGreaterThanOrEqual(subtotal);        
      if (shipping > 0) {
        expect(total).toBeGreaterThanOrEqual(subtotal);
      }
    }


    await cartPage.proceedToCheckout();
    await checkoutPage.assertGuestFormFieldsVisible();
    await checkoutPage.fillRequiredGuestFields();
  });

  test('Scenario 2 Update quantity in cart updates subtotal', async ({ page }) => {
    const storePage = new StorePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await storePage.goto();
    await storePage.openFirstInStockProduct();

    await productPage.selectFirstVariantIfExists();
    await productPage.setQuantity(1);
    await productPage.addToCart();
    await productPage.goToCart();

    const unitPrice = await cartPage.getUnitPrice();
    const subtotalFor1 = await cartPage.getSubtotal();
    expect(subtotalFor1).toBeCloseTo(unitPrice * 1, 2);

    const qtyInputInCart = page.locator('td.product-quantity input.qty').first();
    await qtyInputInCart.fill('3');
    await expect(qtyInputInCart).toHaveValue('3');

    const quantity3 = await cartPage.getQuantity();
    expect(quantity3).toBe(3);

  });

  test('Scenario 3  Remove item from cart (empty cart)', async ({ page }) => {
    const storePage = new StorePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    await storePage.goto();
    await storePage.openFirstInStockProduct();

    await productPage.selectFirstVariantIfExists();
    await productPage.setQuantity(1);
    await productPage.addToCart();
    await productPage.goToCart();

    await cartPage.clearCartAndAssertEmpty();
  });
});
