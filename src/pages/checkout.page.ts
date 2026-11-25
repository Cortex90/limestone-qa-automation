import type { Locator, Page } from '@playwright/test';

export class CheckoutPage {
  private readonly addButton: Locator;
  private readonly cartLink: Locator;
  private readonly checkoutButton: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly itemPrice: Locator;
  private readonly itemQuantity: Locator;

  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly items: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(private readonly page: Page) {
    this.addButton = page.getByTestId(/^add-to-cart-/);
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.checkoutButton = page.getByTestId('checkout');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.itemPrice = page.getByTestId('inventory-item-price');
    this.itemQuantity = page.getByTestId('item-quantity');

    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.items = page.getByTestId('inventory-item');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
  }

  private product(name: string): Locator {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }

  priceFor(name: string): Locator {
    return this.product(name).locator(this.itemPrice);
  }

  quantityFor(name: string): Locator {
    return this.product(name).locator(this.itemQuantity);
  }

  async openInventory(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addToCart(name: string): Promise<void> {
    await this.product(name).locator(this.addButton).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async enterDetails(customer: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }
}
