import { test, expect } from '@playwright/test';
import { StorePage } from '../pages/StorePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('ATID Store - Out-of-stock behavior & session isolation', () => {
  test('Out-of-stock product + isolated carts between contexts', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await pageA.goto('/store/', { waitUntil: 'networkidle' });

    const oosProductLink = pageA.getByText(/ATID Red Shoes/i).first();
    await oosProductLink.click();

    const outOfStockLabel = pageA.locator('.stock.out-of-stock');
    await expect(outOfStockLabel).toBeVisible();

    const addToCartButton = pageA.locator(
      'form.cart button[name="add-to-cart"], form.cart button:has-text("Add to cart")'
    );
    if (await addToCartButton.count()) {
      await expect(addToCartButton).toBeDisabled();
    }

    const storeA = new StorePage(pageA);
    const storeB = new StorePage(pageB);
    const productA = new ProductPage(pageA);
    const productB = new ProductPage(pageB);
    const cartA = new CartPage(pageA);
    const cartB = new CartPage(pageB);

    await storeA.goto();
    await storeB.goto();

    await storeA.openFirstInStockProduct();
    await storeB.openFirstInStockProduct();

    await productA.selectFirstVariantIfExists();
    await productB.selectFirstVariantIfExists();

    await productA.setQuantity(1);
    await productB.setQuantity(1);

    await productA.addToCart();
    await productB.addToCart();

    await productA.goToCart();
    await productB.goToCart();

    const subtotalA1 = await cartA.getSubtotal();
    const subtotalB1 = await cartB.getSubtotal();

    expect(subtotalA1).toBeGreaterThan(0);
    expect(subtotalB1).toBe(subtotalA1);

    await cartA.clearCartAndAssertEmpty();

    await pageB.reload({ waitUntil: 'networkidle' });
    const subtotalB2 = await cartB.getSubtotal();

    expect(subtotalB2).toBe(subtotalB1);
    expect(subtotalB2).toBe(subtotalB1);
    await expect(pageB.locator('td.product-name')).toHaveCount(1);

    await contextA.close();
    await contextB.close();
  });
});
