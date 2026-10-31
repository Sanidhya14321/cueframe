import { expect, type Page, test } from '@playwright/test';

const openPoster = async (page: Page) => {
  await page.goto('/posters/court-kings-04');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByTestId('design-canvas').locator('canvas').first()).toBeVisible();
};

const MOD = 'ControlOrMeta';

const layerCount = (page: Page) =>
  page.getByRole('list', { name: 'Layers' }).getByRole('listitem').count();

test('undo and redo work after editing a panel field', async ({ page }) => {
  await openPoster(page);
  await page.getByRole('button', { name: 'Layers', exact: true }).click();
  const before = await layerCount(page);
  await page.keyboard.press('r');
  const fill = page.getByLabel('Fill', { exact: true });
  await fill.fill('#ff0000');
  await fill.press('Tab');
  await page.keyboard.press(`${MOD}+z`);
  await page.keyboard.press(`${MOD}+z`);
  await expect.poll(() => layerCount(page)).toBe(before);
  await page.keyboard.press(`${MOD}+Shift+z`);
  await expect.poll(() => layerCount(page)).toBe(before + 1);
});

test('undo and redo reach the design while a text field has focus', async ({ page }) => {
  await openPoster(page);
  await page.getByRole('button', { name: 'Layers', exact: true }).click();
  const before = await layerCount(page);
  await page.keyboard.press('r');
  const fill = page.getByLabel('Fill', { exact: true });
  const original = await fill.inputValue();
  await fill.fill('#ff0000');
  await page.keyboard.press(`${MOD}+z`);
  await expect(fill).toHaveValue(original);
  await page.keyboard.press(`${MOD}+z`);
  await expect.poll(() => layerCount(page)).toBe(before);
  await page.keyboard.press(`${MOD}+y`);
  await expect.poll(() => layerCount(page)).toBe(before + 1);
  await page.keyboard.press(`${MOD}+y`);
  await expect(fill).toHaveValue('#ff0000');
});

test('right-click menu, shortcut sheet and floating toolbar', async ({ page }) => {
  await openPoster(page);
  await page.keyboard.press('r');
  await expect(page.getByRole('toolbar', { name: 'Selection actions' })).toBeVisible();
  const canvas = page.getByTestId('design-canvas');
  const box = await canvas.boundingBox();
  if (box === null) {
    throw new Error('canvas has no box');
  }
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: 'right' });
  await expect(page.getByRole('menu', { name: 'Element actions' })).toBeVisible();
  await page.getByRole('menuitem', { name: /Duplicate/ }).click();
  await expect(page.getByRole('menu', { name: 'Element actions' })).toBeHidden();
  await page.keyboard.press('Shift+?');
  await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible();
});

test('templates panel replaces the canvas with another design', async ({ page }) => {
  await openPoster(page);
  await page.getByRole('button', { name: 'Templates', exact: true }).click();
  await page.getByLabel('Search templates').fill('hiring');
  await page.getByRole('button', { name: 'Use Hiring Spotlight 2', exact: true }).click();
  await page.getByRole('button', { name: 'Layers', exact: true }).click();
  const layers = page.getByRole('list', { name: 'Layers' });
  await expect(layers.getByText('Meet Priya Nair')).toBeVisible();
  await expect(layers.getByText('2027 SCHEDULE')).toHaveCount(0);
});
