import { Page, expect } from '@playwright/test';
import { parsePrice } from '../utils/priceUtils';

export class CartPage {
  constructor(private readonly page: Page) {}

  async getUnitPrice(): Promise<number> {
    const text = await this.page.locator('td.product-price .amount').first().innerText();
    return parsePrice(text);
  }

  async getSubtotal(): Promise<number> {
    const text = await this.page.locator('td.product-subtotal .amount').first().innerText();
    return parsePrice(text);
  }

  async getQuantity(): Promise<number> {
    const qtyInput = this.page.locator('td.product-quantity input.qty').first();
    if (!(await qtyInput.count())) return 0;
    const value = await qtyInput.inputValue();
    return Number(value || '0');
  }

  async updateCart() {
    const button = this.page
      .locator('button[name="update_cart"], button:has-text("Update cart")')
      .first();
    if (await button.isVisible()) {
      await button.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  async selectShippingMethodIfExists(label: string): Promise<boolean> {
    const radio = this.page.getByLabel(new RegExp(label, 'i'));
    if (!(await radio.count())) return false;

    await radio.check();
    await this.page.waitForTimeout(1000);
    return true;
  }

  async getShipping(): Promise<number> {
    const text = await this.page.locator('tr.shipping .amount').first().innerText();
    return parsePrice(text);
  }

  async getTotal(): Promise<number> {
    const text = await this.page.locator('tr.order-total .amount').first().innerText();
    return parsePrice(text);
  }

  async proceedToCheckout() {
    const checkoutButton = this.page
      .locator('a.checkout-button, .wc-proceed-to-checkout a:has-text("Proceed to checkout")')
      .first();
    await checkoutButton.click();
  }

  async clearCartAndAssertEmpty() {
    const removeButtons = this.page.locator('td.product-remove a.remove');
    const count = await removeButtons.count();

    for (let i = 0; i < count; i++) {
      await removeButtons.nth(0).click();
      await this.page.waitForTimeout(500);
    }

    const emptyMessage = this.page.locator(
      '.cart-empty, p.cart-empty, .woocommerce-info:has-text("Your cart is currently empty")'
    );

    if (await emptyMessage.count()) {
      await expect(emptyMessage).toBeVisible();
    }
    await expect(this.page.locator('td.product-name')).toHaveCount(0);
  }
}
