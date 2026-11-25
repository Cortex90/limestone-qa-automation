import path from 'node:path';
import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type Account = 'standard' | 'problem';

export function authStatePath(account: Account): string {
  return path.resolve('playwright/.auth', `${account}.json`);
}

export async function loginAs(page: Page, account: Account): Promise<LoginPage> {
  const usernameVariable = account === 'standard' ? 'STANDARD_USERNAME' : 'PROBLEM_USERNAME';
  const username = process.env[usernameVariable];
  const password = process.env.SAUCE_PASSWORD;
  if (!username || !password) {
    throw new Error(`Set ${usernameVariable} and SAUCE_PASSWORD in .env before running UI tests`);
  }

  const loginPage = new LoginPage(page);
  await loginPage.login(username, password);
  return loginPage;
}
