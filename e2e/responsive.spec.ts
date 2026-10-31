import { expect, type Page, test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'monitor', width: 2560, height: 1440 },
];

const pageOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('the library fills the width without overflowing', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('searchbox', { name: 'Search the library' })).toBeVisible();
      expect(await pageOverflow(page)).toBe(0);
    });

    test('the poster editor header keeps download on screen', async ({ page }) => {
      await page.goto('/posters/court-kings-01');
      await expect(page.getByTestId('design-canvas').locator('canvas').first()).toBeVisible();
      expect(await pageOverflow(page)).toBe(0);
      const download = page.getByRole('button', { name: 'Download', exact: true });
      await expect(download).toBeInViewport({ ratio: 1 });
    });

    test('the clip timeline fits its track to the screen width', async ({ page }) => {
      await page.goto('/clips/word-punch');
      if (viewport.width < 1024) {
        await page.getByRole('tab', { name: 'Timeline' }).click();
      }
      const clip = page.getByRole('button', { name: 'Clip element' });
      await expect(clip).toBeVisible();
      expect(await pageOverflow(page)).toBe(0);
      await expect
        .poll(async () => (await clip.boundingBox())?.width ?? 0)
        .toBeGreaterThan(viewport.width * 0.6);
      const box = await clip.boundingBox();
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(viewport.width);
    });
  });
}
