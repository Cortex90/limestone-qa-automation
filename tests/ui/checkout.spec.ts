import { checkoutData } from '../../src/data/checkout';
import { expect, test } from '../../src/fixtures/test';
import type { CheckoutPage } from '../../src/pages/checkout.page';
import { cents } from '../../src/utils/money';

type CartProduct = { name: string; priceInCents: number };

async function expectCartItems(checkout: CheckoutPage, products: CartProduct[]): Promise<void> {
  await expect(checkout.items).toHaveCount(products.length);
  for (const { name, priceInCents } of products) {
    await expect(checkout.priceFor(name)).toHaveText(`$${(priceInCents / 100).toFixed(2)}`);
    await expect(checkout.quantityFor(name)).toHaveText('1');
  }
}

test('checkout overview preserves prices and has consistent totals', async ({ page, checkout }, testInfo) => {
  await checkout.openInventory();
  await expect(checkout.title).toHaveText('Products');
  await expect(checkout.cartBadge).toHaveCount(0);

  const products: CartProduct[] = [];
  for (const name of checkoutData.products) {
    const priceInCents = cents(await checkout.priceFor(name).innerText());
    products.push({ name, priceInCents });
    await checkout.addToCart(name);
  }
  await expect(checkout.cartBadge).toHaveText(String(products.length));

  await checkout.openCart();
  await expectCartItems(checkout, products);
  await checkout.startCheckout();

  const { customer } = checkoutData;
  await checkout.enterDetails(customer);
  await expect(checkout.firstNameInput).toHaveValue(customer.firstName);
  await expect(checkout.lastNameInput).toHaveValue(customer.lastName);

  await checkout.continueToOverview();
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expectCartItems(checkout, products);

  const expectedSubtotal = products.reduce((sum, product) => sum + product.priceInCents, 0);
  const subtotal = cents(await checkout.subtotalLabel.innerText());
  const tax = cents(await checkout.taxLabel.innerText());
  const total = cents(await checkout.totalLabel.innerText());
  expect(subtotal, 'Item subtotal').toBe(expectedSubtotal);
  expect(tax, 'Sales tax').toBe(Math.round(expectedSubtotal * testInfo.config.metadata.taxRate));
  expect(total, 'Order total').toBe(subtotal + tax);
});
