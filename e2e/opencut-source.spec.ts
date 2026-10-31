import { expect, test } from '@playwright/test';
import { seedProjectForClip } from '../src/core/project-seed';

test('Remotion animations remain separate source layers, editable from OpenCut, and survive splitting', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  await page.goto('/settings');
  const source = seedProjectForClip('typewriter');
  source.width = 640;
  source.height = 360;
  source.durationInFrames = 30;
  const item = source.tracks[0]?.elements[0];
  if (!item) {
    throw new Error('Missing animation seed');
  }
  item.durationInFrames = 30;
  const id = await page.evaluate(
    async (project) =>
      (
        await (
          await fetch('/api/projects', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ title: 'Native animation source', project }),
          })
        ).json()
      ).id as string,
    source,
  );
  await page.goto(`/video/${id}`);
  const editor = page.frameLocator('iframe');
  const clip = editor.locator(`[data-element-id="${item.id}"]`);
  await expect(clip).toBeVisible({ timeout: 120000 });
  await clip.click();
  await page.getByRole('button', { name: 'Animation controls', exact: true }).click();
  const text = page.getByRole('region', { name: 'Text', exact: true }).getByRole('textbox');
  await expect(text).toBeVisible();
  await text.fill('Shared animation');
  await text.blur();
  await page.keyboard.press('Escape');
  await expect
    .poll(
      async () => {
        const { revision } = await page.evaluate(
          async (projectId) => await (await fetch(`/api/projects/${projectId}`)).json(),
          id,
        );
        return (
          (await editor.locator('#root').getAttribute('data-hydrated-revision')) ===
          String(revision)
        );
      },
      { timeout: 120000 },
    )
    .toBe(true);
  await clip.click();
  await editor
    .getByRole('button', { name: 'Timeline ruler', exact: true })
    .click({ position: { x: 40, y: 12 } });
  await editor.getByRole('button', { name: 'Split element', exact: true }).click();
  await expect
    .poll(async () =>
      page.evaluate(
        async (projectId) =>
          (await (await fetch(`/api/projects/${projectId}`)).json()).project.tracks
            .flatMap((track: { elements: { type: string }[] }) => track.elements)
            .filter((element: { type: string }) => element.type === 'composition').length,
        id,
      ),
    )
    .toBe(2);
  await page.reload();
  await expect(editor.locator('[data-element-id]')).toHaveCount(2, { timeout: 120000 });
  const saved = await page.evaluate(
    async (projectId) => await (await fetch(`/api/projects/${projectId}`)).json(),
    id,
  );
  const layers = saved.project.tracks.flatMap(
    (track: { elements: { props: { text: string }; sourceFrom?: number }[] }) => track.elements,
  );
  expect(
    layers.every(
      (element: { props: { text: string } }) => element.props.text === 'Shared animation',
    ),
  ).toBe(true);
  expect(layers.some((element: { sourceFrom?: number }) => (element.sourceFrom ?? 0) > 0)).toBe(
    true,
  );
});

test('imported media stays in the library after reload before being placed on the timeline', async ({
  page,
}) => {
  await page.goto('/settings');
  const id = await page.evaluate(
    async () =>
      (
        await (
          await fetch('/api/projects', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              title: 'Library import proof',
              project: {
                width: 640,
                height: 360,
                fps: 30,
                durationInFrames: 1,
                background: '#000000',
                tracks: [],
              },
            }),
          })
        ).json()
      ).id as string,
  );
  await page.goto(`/video/${id}`);
  const editor = page.frameLocator('iframe');
  await editor.locator('input[type=file]').setInputFiles('public/previews/rolling-digits.mp4');
  await expect(
    editor.getByRole('button', { name: 'Add rolling-digits.mp4 to timeline', exact: true }),
  ).toBeVisible();
  await expect(editor.getByRole('button', { name: 'Import', exact: true })).toBeEnabled();
  await page.reload();
  await expect(
    editor.getByRole('button', { name: 'Add rolling-digits.mp4 to timeline', exact: true }),
  ).toBeVisible();
});
