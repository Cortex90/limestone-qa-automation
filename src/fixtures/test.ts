import { test as base } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout.page';
import { JsonPlaceholderClient } from '../api/jsonplaceholder.client';

export const test = base.extend<{ checkout: CheckoutPage; api: JsonPlaceholderClient }>({
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  api: async ({ request }, use) => {
    await use(new JsonPlaceholderClient(request));
  },
});

export { expect } from '@playwright/test';
