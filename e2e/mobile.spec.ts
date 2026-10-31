import { devices, expect, type Page, test } from '@playwright/test';

test.use({ ...devices['iPhone 13'], defaultBrowserType: 'chromium' });

const pageWidth = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

test('the library fits a phone screen and keeps the nav pinned', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('searchbox', { name: 'Search the library' })).toBeVisible();
  expect(await pageWidth(page)).toBe(0);
  await page.mouse.wheel(0, 4000);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expect(page.getByRole('banner')).toBeInViewport();
});

test('the clip editor switches between properties and timeline on a phone', async ({ page }) => {
  await page.goto('/clips/word-punch');
  await expect(page.getByRole('tab', { name: 'Properties' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(await pageWidth(page)).toBe(0);
  await page.getByRole('tab', { name: 'Timeline' }).click();
  await expect(page.getByRole('button', { name: 'Clip element' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Export' })).toBeAttached();
});

test('the poster editor opens tools in a bottom sheet on a phone', async ({ page }) => {
  await page.goto('/posters/court-kings-01');
  await expect(page.getByTestId('design-canvas').locator('canvas').first()).toBeVisible();
  expect(await pageWidth(page)).toBe(0);
  await page.getByRole('button', { name: 'Text', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Text' })).toBeVisible();
  await page.getByRole('button', { name: 'Close Text' }).click();
  await expect(page.getByRole('heading', { name: 'Text' })).toBeHidden();
  await page.getByRole('button', { name: 'More options' }).click();
  await expect(page.getByRole('menuitem', { name: 'Open design file' })).toBeVisible();
});
