import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { authStatePath } from './src/auth/save-auth';

function baseURL(variable: string, fallback: string): string {
  const value = process.env[variable] ?? fallback;
  const { protocol } = new URL(value);
  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new Error(`${variable} must use HTTP(S)`);
  }
  return value;
}

const desktopChrome = {
  ...devices['Desktop Chrome'],
  baseURL: baseURL('UI_BASE_URL', 'https://www.saucedemo.com'),
};
const apiBaseURL = baseURL('API_BASE_URL', 'https://jsonplaceholder.typicode.com');
const taxRate = Number(process.env.SAUCE_TAX_RATE ?? '0.08');
if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 1) {
  throw new Error('SAUCE_TAX_RATE must be between 0 and 1');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  metadata: { taxRate },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup-standard', testMatch: /standard\.setup\.ts/, use: desktopChrome },
    { name: 'setup-problem', testMatch: /problem\.setup\.ts/, use: desktopChrome },
    {
      name: 'standard-user',
      testMatch: /checkout\.spec\.ts/,
      dependencies: ['setup-standard'],
      use: { ...desktopChrome, storageState: authStatePath('standard') },
    },
    {
      name: 'problem-user',
      testMatch: /checkout\.spec\.ts/,
      dependencies: ['setup-problem'],
      use: { ...desktopChrome, storageState: authStatePath('problem') },
    },
    { name: 'api', testMatch: /api\/.*\.spec\.ts/, use: { baseURL: apiBaseURL } },
    { name: 'unit', testMatch: /unit\/.*\.spec\.ts/ },
  ],
});
