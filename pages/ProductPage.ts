import { Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  async selectFirstVariantIfExists() {
    const variantSelect = this.page.locator('form.cart select');

    if (await variantSelect.count()) {
      const options = await variantSelect.locator('option').all();
      if (options.length > 1) {
        await variantSelect.selectOption({ index: 1 });
      }
    }
  }

  async setQuantity(qty: number) {
    const qtyInput = this.page.locator('form.cart input.qty');
    if (await qtyInput.count()) {
      await qtyInput.fill(qty.toString());
    }
  }

  async addToCart() {
    const addToCartButton = this.page
      .locator('form.cart button[name="add-to-cart"], form.cart button:has-text("Add to cart")')
      .first();

    await addToCartButton.click();
  }

  async goToCart() {
    const viewCartLink = this.page.locator('.woocommerce-message a:has-text("View cart")');

    if (await viewCartLink.count()) {
      await viewCartLink.click();
    } else {
      await this.page.goto('/cart/', { waitUntil: 'networkidle' });
    }
  }
}
