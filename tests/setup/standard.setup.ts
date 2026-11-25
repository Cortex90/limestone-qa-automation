import { expect, test as setup } from '@playwright/test';
import { authStatePath, loginAs } from '../../src/auth/save-auth';

setup('authenticate standard user', async ({ page }) => {
  const loginPage = await loginAs(page, 'standard');
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(loginPage.inventoryContainer).toBeVisible();
  await page.context().storageState({ path: authStatePath('standard') });
});
