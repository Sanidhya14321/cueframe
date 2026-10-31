import { expect, test } from '@playwright/test';

const search = (query: string) => `/?${new URLSearchParams({ q: query })}`;

test('lists animations and opens the editor', async ({ page }) => {
  await page.goto(search('phone spin'));
  await expect(page.getByRole('heading', { name: 'Library' })).toBeAttached();
  await expect(page.getByText('Phone Spin In')).toBeVisible();

  await expect(async () => {
    await page.getByText('Phone Spin In').click();
    await expect(page).toHaveURL(/\/clips\/phone-spin-in/, { timeout: 5_000 });
  }).toPass({ timeout: 60_000 });
  await expect(page.getByRole('button', { name: 'Export' })).toBeVisible();
});

test('finds clips by search and keeps the grid virtualized while scrolling', async ({ page }) => {
  await page.goto(search('phone wall'));
  await expect(page.getByText('Phone Wall')).toBeVisible();
  await page.goto(search('handwritten'));
  await expect(page.getByText('Handwritten Note')).toBeVisible();

  await page.goto('/');
  const total = Number((await page.getByText(/^\d+ items$/).textContent())?.split(' ')[0]);
  await page.mouse.wheel(0, 15_000);
  await expect(page.locator('a[href^="/clips/"], article').first()).toBeVisible();
  expect(await page.locator('a[href^="/clips/"], article').count()).toBeLessThan(total);
});
