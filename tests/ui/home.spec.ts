import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('Conduit home page loads articles feed', async ({ page }) => {
  const homePage = new HomePage(page);

  await page.goto('/');

  await homePage.expectHomePageLoaded();
  await homePage.expectGlobalFeedLoaded();

});



