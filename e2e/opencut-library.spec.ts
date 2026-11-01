import { expect, test } from '@playwright/test';

const create = async (page: import('@playwright/test').Page) => {
  await page.goto('/settings');
  const id = await page.evaluate(async () => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'Library test',
        project: {
          width: 640,
          height: 360,
          fps: 30,
          durationInFrames: 30,
          background: '#000000',
          tracks: [],
        },
      }),
    });
    return (await response.json()).id as string;
  });
  await page.goto(`/video/${id}`);
  const editor = page.frameLocator('iframe');
  await expect(editor.getByLabel('Editor sync')).toHaveText('Saved locally');
  return { id, editor };
};
const items = (page: import('@playwright/test').Page, id: string) =>
  page.evaluate(async (projectId) => {
    const state = await (await fetch(`/api/projects/${projectId}`)).json();
    return state.project.tracks.flatMap((track: { elements: { clipId?: string }[] }) =>
      track.elements.map((item) => item.clipId),
    );
  }, id);

test('adds a library animation to the open project from the Add button', async ({ page }) => {
  test.setTimeout(180_000);
  const { id, editor } = await create(page);
  await editor.getByRole('button', { name: 'Library', exact: true }).click();
  await editor.getByLabel('Search library').fill('typewriter');
  await editor
    .getByRole('button', { name: /^Add .*at playhead$/ })
    .first()
    .click();
  await expect.poll(() => items(page, id)).toHaveLength(1);
  await expect(editor.getByLabel('Editor sync')).toHaveText('Saved locally', { timeout: 150_000 });
  await expect(editor.locator('button[data-element-id]')).toHaveCount(1);
});

test('drops a library animation at the timeline position', async ({ page }) => {
  test.setTimeout(180_000);
  const { id, editor } = await create(page);
  await editor.getByRole('button', { name: 'Library', exact: true }).click();
  await editor.getByLabel('Search library').fill('typewriter');
  await editor
    .locator('.native-library-grid article')
    .first()
    .dragTo(editor.locator('[data-cueframe-timeline-zoom]'), {
      targetPosition: { x: 200, y: 20 },
    });
  await expect.poll(() => items(page, id)).toHaveLength(1);
  const from = await page.evaluate(async (projectId) => {
    const state = await (await fetch(`/api/projects/${projectId}`)).json();
    return state.project.tracks[0].elements[0].from;
  }, id);
  expect(from).toBeGreaterThan(0);
});

test('shows an MCP edit in the open editor without reloading', async ({ page }) => {
  test.setTimeout(180_000);
  const { id, editor } = await create(page);
  const result = await page.evaluate(
    async (projectId) =>
      (
        await fetch('/mcp', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json, text/event-stream',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: {
              name: 'add_item',
              arguments: { projectId, clipId: 'typewriter', start: 0, confirmed: true },
            },
          }),
        })
      ).json(),
    id,
  );
  expect(result.result.isError).toBeFalsy();
  await expect(editor.locator('button[data-element-id]')).toHaveCount(1, { timeout: 150_000 });
});

test('sends dictated or typed text to the agent with the editing context', async ({ page }) => {
  const { id } = await create(page);
  await page.getByRole('button', { name: 'Agent', exact: true }).click();
  const field = page.getByRole('textbox', { name: 'Message your agent' });
  await field.fill('Make the title larger');
  await page.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Voice request status' })).toContainText('Sent');
  const events = await page.evaluate(
    async (projectId) => (await (await fetch(`/api/projects/${projectId}`)).json()).events,
    id,
  );
  expect(events[0]).toMatchObject({ kind: 'voice', text: 'Make the title larger' });
});

test('native Captions panel opens and route skeletons resolve', async ({ page }) => {
  const { editor } = await create(page);
  await editor.getByRole('button', { name: 'Captions', exact: true }).click();
  await editor.getByLabel('Import SRT or ASS captions').setInputFiles({
    name: 'lines.srt',
    mimeType: 'text/plain',
    buffer: Buffer.from('1\n00:00:00,000 --> 00:00:01,000\nHello there\n'),
  });
  await expect(editor.locator('.native-asset-content')).toContainText('Imported 1 captions');
  await expect(page.getByRole('status', { name: 'Loading the video editor' })).toHaveCount(0);
});
