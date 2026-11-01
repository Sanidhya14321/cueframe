import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { expect, type Page, test } from '@playwright/test';

const tools = resolve(`node_modules/@remotion/compositor-${process.platform}-${process.arch}`);
const fill = 224;
const shape = {
  id: 'shapes',
  name: 'Shapes',
  elements: [
    {
      id: 'shape',
      type: 'shape',
      kind: 'rect',
      width: 160,
      height: 90,
      radius: 0,
      color: '#c9f26b',
      from: 0,
      durationInFrames: 24,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
    },
  ],
};
const create = async (page: Page, tracks: unknown[] = [shape], ready = 'Select shape') => {
  await page.goto('/settings');
  const id = await page.evaluate(async (items) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'Export test',
        project: {
          width: 320,
          height: 180,
          fps: 24,
          durationInFrames: 24,
          background: '#000000',
          tracks: items,
        },
      }),
    });
    return (await response.json()).id as string;
  }, tracks);
  await page.goto(`/video/${id}`);
  const editor = page.frameLocator('iframe');
  await expect(editor.getByRole('button', { name: ready, exact: true })).toBeVisible();
  await expect(editor.getByLabel('Editor sync')).toHaveText('Saved locally');
  return { id, editor };
};
const exported = async (page: Page) => {
  const downloading = page.waitForEvent('download', { timeout: 150_000 });
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const path = await (await downloading).path();
  return execFileSync(
    resolve(tools, 'ffmpeg'),
    [
      '-v',
      'error',
      '-i',
      path,
      '-frames:v',
      '1',
      '-f',
      'image2pipe',
      '-c:v',
      'rawvideo',
      '-pix_fmt',
      'gray',
      '-',
    ],
    { env: { NODE_ENV: 'test', DYLD_LIBRARY_PATH: tools, LD_LIBRARY_PATH: tools } },
  );
};
const softened = (pixels: Buffer) =>
  pixels.filter((value) => value > 16 && value < fill - 16).length;
const solid = (pixels: Buffer) => pixels.filter((value) => value >= fill - 16).length;

test('a Blur effect reaches the exported frames', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  const { editor } = await create(page);
  const sharp = await exported(page);
  expect(solid(sharp)).toBeGreaterThan(160 * 90 * 0.95);
  expect(solid(sharp)).toBeLessThan(160 * 90 * 1.05);
  await editor.getByRole('button', { name: 'Effects', exact: true }).click();
  await editor.getByRole('button', { name: 'Add Blur to timeline', exact: true }).click();
  await expect(editor.getByRole('button', { name: 'Select Blur', exact: true })).toBeVisible();
  const blurred = await exported(page);
  expect(solid(blurred)).toBeGreaterThan(0);
  expect(softened(blurred)).toBeGreaterThan(softened(sharp) + 200);
});

test('Export saves first and stops when the native save fails', async ({ page }) => {
  const { id, editor } = await create(page);
  const renders: string[] = [];
  await page.route(`**/api/projects/${id}/render`, async (route) => {
    renders.push(route.request().url());
    await route.continue();
  });
  await page.route(`**/api/projects/${id}/opencut`, async (route) => {
    if (route.request().method() === 'PUT') {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ problem: 'Test disk unavailable' }),
      });
      return;
    }
    await route.continue();
  });
  await editor.getByRole('button', { name: 'Text', exact: true }).click();
  await editor.getByRole('button', { name: 'Add Default text to timeline', exact: true }).click();
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'could not save' })).toBeVisible();
  expect(renders).toEqual([]);
  await expect(page.getByRole('button', { name: 'Export', exact: true })).toBeEnabled();
});

test('the phone toolbar keeps its controls apart with a waiting draft', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 760 });
  const { id } = await create(page);
  await page.evaluate(async (projectId) => {
    await fetch(`/api/projects/${projectId}/agent-events`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'job', text: 'Launch video for ORBITAUDIT' }),
    });
  }, id);
  await page.reload();
  const parts = [
    page.getByRole('link', { name: 'Draft, waiting for an agent' }),
    page.getByRole('status', { name: 'Project sync' }),
    page.getByRole('button', { name: 'Agent', exact: true }),
    page.getByRole('button', { name: 'Tools', exact: true }),
    page.getByRole('button', { name: 'Export', exact: true }),
  ];
  await expect(parts[0] as ReturnType<Page['getByRole']>).toBeVisible();
  const boxes = await Promise.all(parts.map((part) => part.boundingBox()));
  for (const [index, box] of boxes.entries()) {
    const next = boxes[index + 1];
    expect(box).not.toBeNull();
    if (box && next) {
      expect(box.x + box.width).toBeLessThanOrEqual(next.x);
    }
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(375);
  }
  await page.getByRole('button', { name: 'Agent', exact: true }).click();
  const menu = await page.getByRole('complementary', { name: 'Agent' }).boundingBox();
  expect(menu?.width).toBeLessThanOrEqual(375);
});

test('Open effects jumps to the Effects panel', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  const { editor } = await create(page);
  await editor.getByRole('button', { name: 'Select shape', exact: true }).click();
  await editor.getByRole('button', { name: 'Effects', exact: true }).last().click();
  await editor.getByRole('button', { name: 'Open effects', exact: true }).click();
  await expect(
    editor.getByRole('navigation', { name: 'Editor panels' }).getByRole('button', {
      name: 'Effects',
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('a native mask reaches the exported frames', async ({ page }) => {
  const { id } = await create(page);
  const before = solid(await exported(page));
  await page.evaluate(async (projectId) => {
    const url = `/api/projects/${projectId}/opencut`;
    const native = await (await fetch(url)).json();
    const element = native.document.scenes[0].tracks.overlay
      .flatMap((track: { elements: Record<string, unknown>[] }) => track.elements)
      .find((item: { id: string }) => item.id === 'shape');
    element.masks = [
      {
        id: 'half',
        type: 'split',
        params: {
          feather: 0,
          inverted: false,
          strokeColor: '#ffffff',
          strokeWidth: 0,
          strokeAlign: 'center',
          centerX: 0,
          centerY: 0,
          rotation: 0,
        },
      },
    ];
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        document: native.document,
        media: native.media,
        version: native.version,
        project: native.source.project,
        canonicalRevision: native.source.revision,
        clientId: 'mask-proof',
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
  }, id);
  await page.reload();
  const page2 = page.frameLocator('iframe');
  await expect(page2.getByRole('button', { name: 'Select shape', exact: true })).toBeVisible();
  const after = solid(await exported(page));
  expect(after).toBeGreaterThan(before * 0.4);
  expect(after).toBeLessThan(before * 0.6);
});

test('a long title wraps inside the frame instead of clipping', async ({ page }) => {
  const title = {
    id: 'title',
    type: 'text',
    content: 'A long launch title that must wrap across several rows',
    fontSize: 32,
    fontFamily: 'Inter',
    color: '#ffffff',
    from: 0,
    durationInFrames: 24,
    transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
  };
  await create(page, [{ id: 'titles', name: 'Titles', elements: [title] }], 'Select text');
  const pixels = await exported(page);
  const bright = [...pixels.keys()].filter((index) => (pixels[index] ?? 0) > 128);
  const columns = bright.map((index) => index % 320);
  const rows = bright.map((index) => Math.floor(index / 320));
  expect(Math.min(...columns)).toBeGreaterThan(20);
  expect(Math.max(...columns)).toBeLessThan(300);
  expect(Math.max(...rows) - Math.min(...rows)).toBeGreaterThan(50);
});

test('frame controls open on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  const { editor } = await create(page);
  await editor.getByRole('button', { name: 'Library', exact: true }).click();
  await editor.getByLabel('Search library').fill('typewriter');
  await editor
    .getByRole('button', { name: /^Add .*at playhead$/ })
    .first()
    .click();
  const clip = editor.locator('button[data-element-id]').filter({ hasNotText: 'shape' }).first();
  await expect(editor.getByLabel('Editor sync')).toHaveText('Saved locally', { timeout: 150_000 });
  await clip.click();
  await page.setViewportSize({ width: 375, height: 760 });
  await page.getByRole('button', { name: 'Frame controls' }).click();
  const dock = page.getByRole('complementary', { name: 'Frame controls' });
  await expect(dock).toBeVisible();
  expect((await dock.boundingBox())?.width).toBe(375);
  await page.getByRole('button', { name: 'Frame controls' }).click();
  await expect(dock).toBeHidden();
});
