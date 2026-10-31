import { expect, type Page, test } from '@playwright/test';

const create = async (page: Page) => {
  await page.goto('/');
  const id = await page.evaluate(async () => {
    const project = {
      fps: 30,
      width: 640,
      height: 360,
      durationInFrames: 180,
      background: '#000000',
      tracks: [
        {
          id: 'video-track',
          name: 'Video',
          elements: [
            {
              id: 'test-video',
              type: 'video',
              src: '/previews/typewriter.mp4',
              from: 15,
              durationInFrames: 60,
              sourceFrom: 0,
              transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
            },
          ],
        },
        { id: 'second-track', name: 'Second track', elements: [] },
      ],
    };
    return (
      await (
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title: 'OpenCut timeline proof', project }),
        })
      ).json()
    ).id as string;
  });
  await page.goto(`/video/${id}?workspace=animation`);
  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
  await expect(page.getByRole('region', { name: 'OpenCut timeline' })).toBeVisible();
  return id;
};
const handleSelector = (edge: 'trim' | 'resize') => `[data-handle="${edge}"]`;
const read = (page: Page, id: string) =>
  page.evaluate(async (projectId) => (await fetch(`/api/projects/${projectId}`)).json(), id);

test('classic timeline drags, trims, restacks and persists through the canonical project', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  const id = await create(page);
  const clip = page.locator('[data-element-id="test-video"]');
  const box = await clip.boundingBox();
  if (!box) {
    throw new Error('Missing clip');
  }
  const scale = box.width / 60;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 10 * scale, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect.poll(async () => (await read(page, id)).project.tracks[0].elements[0].from).toBe(25);
  const edge = await clip.locator(handleSelector('resize')).boundingBox();
  if (!edge) {
    throw new Error('Missing resize handle');
  }
  await page.mouse.move(edge.x + edge.width / 2, edge.y + edge.height / 2);
  await page.mouse.down();
  await page.mouse.move(edge.x + edge.width / 2 + 5 * scale, edge.y + edge.height / 2, {
    steps: 4,
  });
  await page.mouse.up();
  await expect
    .poll(async () => (await read(page, id)).project.tracks[0].elements[0].durationInFrames)
    .toBe(65);
  const left = await clip.locator(handleSelector('trim')).boundingBox();
  if (!left) {
    throw new Error('Missing trim handle');
  }
  await page.mouse.move(left.x + left.width / 2, left.y + left.height / 2);
  await page.mouse.down();
  await page.mouse.move(left.x + left.width / 2 + 5 * scale, left.y + left.height / 2, {
    steps: 4,
  });
  await page.mouse.up();
  await expect.poll(async () => (await read(page, id)).project.tracks[0].elements[0].from).toBe(30);
  await page.getByRole('button', { name: 'Track options: Second track' }).click();
  await page.getByRole('button', { name: 'Move Second track up' }).click();
  await page.keyboard.press('Escape');
  await expect.poll(async () => (await read(page, id)).project.tracks[0].id).toBe('second-track');
  await page.reload();
  await expect(page.locator('[data-track-id]').first()).toHaveAttribute(
    'data-track-id',
    'second-track',
  );
  await expect(page.getByRole('button', { name: 'Snapping off' })).toBeVisible();
  await page.getByRole('button', { name: 'Snapping off' }).click();
  await expect(page.getByRole('button', { name: 'Snapping on' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('classic timeline supports keyboard selection, ruler seeking and toolbar split undo', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1100 });
  const id = await create(page);
  const clip = page.locator('[data-element-id="test-video"]');
  await clip.focus();
  await page.keyboard.press('Enter');
  await expect(clip).toHaveAttribute('aria-pressed', 'true');
  const box = await clip.boundingBox();
  if (!box) {
    throw new Error('Missing clip');
  }
  const ruler = page.getByRole('button', { name: 'Seek timeline' });
  const rulerBox = await ruler.boundingBox();
  if (!rulerBox) {
    throw new Error('Missing ruler');
  }
  await ruler.click({ position: { x: (box.width / 60) * 45, y: 10 } });
  await page.getByRole('button', { name: 'Split selected video', exact: true }).click();
  await expect.poll(async () => (await read(page, id)).project.tracks[0].elements.length).toBe(2);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect.poll(async () => (await read(page, id)).project.tracks[0].elements.length).toBe(1);
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Fit timeline', exact: true }).click();
  await expect(page.getByRole('region', { name: 'OpenCut timeline' })).toBeVisible();
});
