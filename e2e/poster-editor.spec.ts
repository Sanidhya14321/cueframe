import { expect, test } from '@playwright/test';

test('opens a poster from the library grid in the editor', async ({ page }) => {
  await page.goto(`/?${new URLSearchParams({ type: 'poster', q: 'hiring spotlight' })}`);
  const card = page.getByRole('article', { name: 'Hiring Spotlight 2', exact: true });
  await expect(card).toBeVisible();
  await card.getByRole('link', { name: 'Edit Hiring Spotlight 2' }).click();
  await expect(page).toHaveURL(/\/posters\/hiring-spotlight-02$/);
  await expect(page.getByTestId('design-canvas').locator('canvas').first()).toBeVisible();
  await expect(page.getByLabel('Design title')).toHaveValue('Hiring Spotlight 2');
  await expect(page.getByRole('button', { name: /^Page \d+$/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Add page' })).toHaveCount(0);

  await page.keyboard.press('r');
  const properties = page.getByRole('complementary', { name: 'Properties' });
  await expect(properties.getByText('Rectangle', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Download', exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: 'PNG', exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toBe('hiring-spotlight-2.png');
});

test('the theme panel recolours a poster through its colour roles', async ({ page }) => {
  await page.goto('/posters/fernhill-mustard-marketing-07');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const theme = page.getByTestId('theme-panel');
  await expect(theme).toBeVisible();
  await theme.getByLabel('Primary color', { exact: true }).fill('#2244aa');
  await theme.getByLabel('Title', { exact: true }).fill('POLL');
  await expect(theme.getByLabel('Title', { exact: true })).toHaveValue('POLL');
  await page.getByRole('button', { name: 'Layers', exact: true }).click();
  const layers = page.getByRole('list', { name: 'Layers' });
  await expect(layers.getByText('Check', { exact: true })).toHaveCount(0);
  await layers.getByText('Check pattern', { exact: true }).click();
  const properties = page.getByRole('complementary', { name: 'Properties' });
  await expect(properties.getByLabel('Fill', { exact: true })).toHaveValue('#2244aa');
});
