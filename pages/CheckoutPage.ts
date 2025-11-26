import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  private billingFirstName = this.page.locator('#billing_first_name');
  private billingLastName = this.page.locator('#billing_last_name');
  private billingEmail = this.page.locator('#billing_email');
  private billingAddress1 = this.page.locator('#billing_address_1');
  private billingCity = this.page.locator('#billing_city');
  private billingPostcode = this.page.locator('#billing_postcode');
  private billingPhone = this.page.locator('#billing_phone');

  async assertGuestFormFieldsVisible() {
    await expect(this.billingFirstName).toBeVisible();
    await expect(this.billingLastName).toBeVisible();
    await expect(this.billingEmail).toBeVisible();
    await expect(this.billingAddress1).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.page.locator('#billing_email').fill(email);
  }
  

  async fillValidGuestData() {
    await this.billingFirstName.fill('Form');
    await this.billingLastName.fill('Validation');
    await this.billingEmail.fill('form.validation@example.com');
    await this.billingAddress1.fill('Main street 5');

    if (await this.billingCity.count()) {
      await this.billingCity.fill('Tel Aviv');
    }
    if (await this.billingPostcode.count()) {
      await this.billingPostcode.fill('55555');
    }
    if (await this.billingPhone.count()) {
      await this.billingPhone.fill('+15555555555');
    }
  }

  async fillRequiredGuestFields() {
    await this.fillValidGuestData();
  }

  async clearEmailField() {
    await this.billingEmail.fill('');
  }

  async getAllFieldValues() {
    const firstName = await this.billingFirstName.inputValue();
    const lastName = await this.billingLastName.inputValue();
    const address = await this.billingAddress1.inputValue();
    return { firstName, lastName, address };
  }

  async getFirstNameValue(): Promise<string> {
    return this.billingFirstName.inputValue();
  }

  async placeOrder() {
    const placeOrderButton = this.page
      .locator('button#place_order, button:has-text("Place order")')
      .first();
    await placeOrderButton.click();
  }

  async assertValidationErrorShown() {
    const errorBox = this.page.locator('.woocommerce-error, .woocommerce-notices-wrapper .woocommerce-error');
    await expect(errorBox).toBeVisible();
  }

  async assertStillOnCheckoutPage() {
    await expect(this.page.locator('form.checkout')).toBeVisible();
  }

  async goBackToCart() {
    const cartLink = this.page.locator('nav.woocommerce-breadcrumb a:has-text("Cart")').first();
    if (await cartLink.count()) {
      await cartLink.click();
    } else {
      await this.page.goBack();
    }
  }
}
