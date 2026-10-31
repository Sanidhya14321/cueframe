import { expect, test } from '@playwright/test';

test('gallery opens without an account and settings persist without returning keys', async ({
  page,
  request,
}) => {
  expect((await request.get('/api/settings')).status()).toBe(401);
  await page.goto('/');
  await expect(page.getByRole('link', { name: /sign in|profile/i })).toHaveCount(0);
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page.getByLabel('Data folder')).toHaveValue(/clipkit-/i);
  await page.getByLabel('Model', { exact: true }).fill('local-test-model');
  await page.getByLabel('API key', { exact: true }).fill('clipkit-test-key');
  await page.getByRole('button', { name: 'Save settings', exact: true }).click();
  await expect(page.getByRole('main').getByRole('status')).toHaveText(
    'Settings saved on this computer.',
  );
  const settings = await page.evaluate(async () => (await fetch('/api/settings')).json());
  expect(settings).toMatchObject({ model: 'local-test-model', hasApiKey: true });
  expect(settings).not.toHaveProperty('apiKey');
  expect(settings).not.toHaveProperty('fishAudioKey');
  await page.reload();
  await expect(page.getByLabel('Model', { exact: true })).toHaveValue('local-test-model');
  await expect(page.getByLabel('API key', { exact: true })).toHaveValue('');
  await page.getByLabel('Remove saved API key').check();
  await page.getByRole('button', { name: 'Save settings', exact: true }).click();
  await expect(page.getByRole('main').getByRole('status')).toHaveText(
    'Settings saved on this computer.',
  );
  await expect(page.getByLabel('API key', { exact: true })).toHaveAttribute(
    'placeholder',
    'No key saved',
  );
});

test('a website saves locally and reopens without signing in', async ({ page }) => {
  await page.goto('/sites/emerald-rose');
  await page.getByRole('button', { name: 'Save locally', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Save website locally' })).toBeVisible();
  await dialog.getByLabel('Website address').fill(`local-demo-${Date.now()}`);
  await dialog.getByRole('button', { name: 'Save locally', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your local website is ready' })).toBeVisible();
  await expect(page).toHaveURL(/\/websites\/[a-z0-9]{12}$/);
  const reload = await page.reload();
  expect(reload?.status()).toBe(200);
  expect(await reload?.text()).not.toContain('window is not defined');
  await expect(page.getByRole('button', { name: 'Open local preview', exact: true })).toBeVisible();
  await page.goto('/websites');
  await expect(page.getByRole('link', { name: 'Margaux & Julien', exact: true })).toBeVisible();
});

test('the clip editor still renders a downloadable video in the browser', async ({ page }) => {
  await page.goto('/clips/typewriter');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('combobox', { name: 'Resolution', exact: true }).click();
  await page.getByRole('option', { name: '0.25x', exact: true }).click();
  await dialog.getByRole('button', { name: 'Render', exact: true }).click();
  await expect(dialog.getByText('Render complete.', { exact: true })).toBeVisible({
    timeout: 120000,
  });
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    dialog.getByRole('link', { name: 'Download', exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/typewriter\.(mp4|webm)$/);
  expect(await download.failure()).toBeNull();
});
