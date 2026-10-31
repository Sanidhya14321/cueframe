import { expect, test } from '@playwright/test';

test('studio commands navigate by keyboard and preserve the library', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'ClipKit home' })).toBeVisible();
  await page.keyboard.press('Control+k');
  const palette = page.getByRole('dialog');
  await expect(palette).toBeVisible();
  await page.getByRole('combobox', { name: 'Search commands' }).fill('settings');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/settings$/);
  await expect(palette).not.toBeVisible();
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox', { name: 'Search commands' }).fill('does not exist');
  await expect(page.getByText('No actions found. Try “project” or “settings”.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(palette).not.toBeVisible();
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('menuitem', { name: 'Library', exact: true }).click();
  await expect(page).toHaveURL(/\/library$/);
  await expect(page.getByRole('searchbox', { name: 'Search the library' })).toBeVisible();
});

test('New video opens a disk-backed editable project from the shell', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'New video', exact: true }).click();
  await expect(page).toHaveURL(/\/video\/[a-z0-9]{12}$/);
  await expect(page.frameLocator('iframe').getByLabel('Editor sync')).toContainText(
    'Saved locally',
  );
  await page.keyboard.press('Control+k');
  await page.getByRole('combobox', { name: 'Search commands' }).fill('new video');
  const previous = page.url();
  await page.keyboard.press('Enter');
  await expect(page).not.toHaveURL(previous);
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

for (const width of [375, 768, 1280, 1920]) {
  test(`shell and palette fit ${width}px with keyboard access`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/library');
    await expect(page.getByRole('button', { name: 'New video', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const targets = await page.locator('header a, header button').evaluateAll((nodes) =>
      nodes
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        })
        .filter((rect) => rect.width > 0),
    );
    expect(targets.every((rect) => rect.width >= 44 && rect.height >= 44)).toBe(true);
    await page.getByRole('button', { name: 'Open command palette' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const field = page.getByRole('combobox', { name: 'Search commands' });
    await expect(field).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(field).toHaveAttribute('aria-activedescendant', 'command-1');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open command palette' })).toBeFocused();
  });
}

test('shortcut reopening resets commands and restores the invoking search field', async ({
  page,
}) => {
  await page.goto('/library');
  const search = page.getByRole('searchbox', { name: 'Search the library' });
  await search.focus();
  await page.keyboard.press('Control+k');
  const commands = page.getByRole('combobox', { name: 'Search commands' });
  await commands.fill('settings');
  await page.keyboard.press('Escape');
  await expect(search).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(commands).toHaveValue('');
  await commands.fill('project');
  await page.keyboard.press('Control+k');
  await page.keyboard.press('Control+k');
  await expect(commands).toHaveValue('');
  await page.keyboard.press('Tab');
  await expect(commands).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(commands).toHaveAttribute('aria-activedescendant', 'command-1');
});

test('agent states have explicit mobile text, announcements and a connection destination', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  let state = { connected: false, name: 'No agent' };
  let unavailable = false;
  await page.route('**/api/connect', (route) =>
    unavailable ? route.fulfill({ status: 503, body: '{}' }) : route.fulfill({ json: state }),
  );
  await page.goto('/library');
  const offline = page.getByRole('link', { name: 'No agent connected. Open agent connections' });
  await expect(offline).toContainText('Offline');
  state = { connected: true, name: 'Claude Code' };
  const connected = page.getByRole('link', {
    name: 'Connected: Claude Code. Open agent connections',
  });
  await expect(connected).toContainText('Online');
  await expect(page.getByRole('status')).toContainText('Connected: Claude Code');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  unavailable = true;
  const failed = page.getByRole('link', {
    name: 'Agent connection unavailable. Open agent connections',
  });
  await expect(failed).toContainText('Error');
  await failed.click();
  await expect(page).toHaveURL(/\/connect$/);
});

test('short landscape palette fits and mobile navigation marks the current route', async ({
  page,
}) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('/library');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const current = page.getByRole('menuitem', { name: 'Library', exact: true });
  await expect(current).toHaveAttribute('aria-current', 'page');
  await expect(current).toHaveClass(/bg-accent/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open command palette' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect
    .poll(async () => {
      const rect = await dialog.boundingBox();
      return rect !== null && rect.y >= 15 && rect.y + rect.height <= 360;
    })
    .toBe(true);
});
