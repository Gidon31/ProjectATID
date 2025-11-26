import { Page } from '@playwright/test';

export class StorePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/store/', { waitUntil: 'networkidle' });
  }

  async openFirstInStockProduct() {
    const productCard = this.page
      .locator('ul.products li.product')
      .filter({ hasNotText: /Out of stock/i })
      .first();

    await productCard.click();
  }
}
