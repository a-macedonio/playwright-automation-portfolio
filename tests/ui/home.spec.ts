import { test, expect } from '@playwright/test';

test('Conduit home page loads articles feed', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Conduit/i);
  await expect(page.getByRole('heading', { name: 'Conduit' }).getByRole('img')).toBeVisible();
  await expect(page.getByText('Global Feed')).toBeVisible();
});