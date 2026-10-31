import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { expect, type Page, test } from '@playwright/test';

const create = async (page: Page) => {
  await page.goto('/settings');
  const id = await page.evaluate(async () => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'Native OpenCut test',
        project: {
          width: 640,
          height: 360,
          fps: 24,
          durationInFrames: 1,
          background: '#000000',
          tracks: [],
        },
      }),
    });
    return (await response.json()).id as string;
  });
  await page.goto(`/video/${id}`);
  const editor = page.frameLocator('iframe');
  await expect(editor.getByLabel('OpenCut sync')).toHaveText('Saved locally');
  return { id, editor };
};
const read = (page: Page, id: string) =>
  page.evaluate(
    async (projectId) => (await fetch(`/api/projects/${projectId}/opencut`)).json(),
    id,
  );
const count = async (page: Page, id: string) =>
  (await read(page, id)).document.scenes.reduce(
    (
      total: number,
      scene: {
        tracks: {
          main: { elements: unknown[] };
          overlay: { elements: unknown[] }[];
          audio: { elements: unknown[] }[];
        };
      },
    ) =>
      total +
      scene.tracks.main.elements.length +
      [...scene.tracks.overlay, ...scene.tracks.audio].reduce(
        (n, track) => n + track.elements.length,
        0,
      ),
    0,
  );

test('actual OpenCut imports media, saves, selects by keyboard, splits, undoes and exports', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  const { id, editor } = await create(page);
  const source = resolve('public/previews/rolling-digits.mp4');
  await editor
    .locator('input[type=file]')
    .setInputFiles({ name: 'proof.mp4', mimeType: 'video/mp4', buffer: await readFile(source) });
  const add = editor.getByRole('button', { name: 'Add proof.mp4 to timeline', exact: true });
  await expect(add).toBeVisible();
  const box = await add.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await add.click();
  await expect.poll(() => count(page, id)).toBe(1);
  const clip = editor.getByRole('button', { name: 'Select proof.mp4', exact: true });
  await clip.focus();
  await page.keyboard.press('Enter');
  await expect(clip).toHaveAttribute('aria-pressed', 'true');
  await editor
    .getByRole('button', { name: 'Timeline ruler', exact: true })
    .click({ position: { x: 100, y: 12 } });
  await editor.getByRole('button', { name: 'Split element', exact: true }).click();
  await expect.poll(() => count(page, id)).toBe(2);
  await editor.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect.poll(() => count(page, id)).toBe(1);
  await page.reload();
  await expect(editor.getByRole('button', { name: 'Select proof.mp4', exact: true })).toBeVisible();
  await editor.getByRole('button', { name: 'Export', exact: true }).click();
  const downloading = page.waitForEvent('download');
  await editor.getByRole('button', { name: 'Export', exact: true }).last().click();
  const download = await downloading;
  const path = await download.path();
  expect(path).not.toBeNull();
  const bytes = await readFile(path ?? '');
  expect(bytes.length).toBeGreaterThan(1000);
  expect(bytes.subarray(4, 8).toString()).toBe('ftyp');
  const state = await page.evaluate(
    async (projectId) => (await fetch(`/api/projects/${projectId}`)).json(),
    id,
  );
  expect(state.nativeVideo.fps).toBe(24);
  expect(state.nativeVideo.duration).toBeGreaterThan(0);
});

test('native failed saves stay recoverable and retry persists the edit', async ({ page }) => {
  const { id, editor } = await create(page);
  let reject = true;
  await page.route(`**/api/projects/${id}/opencut`, async (route) => {
    if (route.request().method() === 'PUT' && reject) {
      reject = false;
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
  await expect(editor.getByLabel('OpenCut sync')).toHaveText('Test disk unavailable');
  await editor.getByRole('button', { name: 'Retry saving', exact: true }).click();
  await expect(editor.getByLabel('OpenCut sync')).toHaveText('Saved locally');
  await expect.poll(() => count(page, id)).toBe(1);
  await page.reload();
  await expect(editor.getByRole('button', { name: 'Select Text', exact: true })).toBeVisible();
});

test('native command navigation checkpoints pending edits', async ({ page }) => {
  const { id, editor } = await create(page);
  await editor.getByRole('button', { name: 'Text', exact: true }).click();
  await editor.getByRole('button', { name: 'Add Default text to timeline', exact: true }).click();
  const name = editor.getByRole('textbox', { name: 'Project name', exact: true });
  await name.fill('Saved before navigation');
  await editor.getByRole('button', { name: 'Select Text', exact: true }).focus();
  await page.keyboard.press('Control+k');
  const commands = page.getByRole('combobox', { name: 'Search commands' });
  await expect(commands).toBeVisible();
  await commands.fill('settings');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/settings$/);
  const saved = await page.evaluate(
    async (projectId) => (await fetch(`/api/projects/${projectId}`)).json(),
    id,
  );
  expect(saved.title).toBe('Saved before navigation');
  expect(await count(page, id)).toBe(1);
});

test('existing source layers open in the actual native timeline and native local rendering works', async ({
  page,
}) => {
  await page.goto('/settings');
  const id = await page.evaluate(async () => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'Editable source',
        project: {
          width: 320,
          height: 180,
          fps: 24,
          durationInFrames: 24,
          background: '#121812',
          tracks: [
            {
              id: 'original',
              name: 'Original shape',
              elements: [
                {
                  id: 'shape',
                  type: 'shape',
                  kind: 'rect',
                  width: 320,
                  height: 180,
                  radius: 0,
                  color: '#c9f26b',
                  from: 0,
                  durationInFrames: 24,
                  transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
                },
              ],
            },
          ],
        },
      }),
    });
    return (await response.json()).id as string;
  });
  await page.goto(`/video/${id}`);
  const editor = page.frameLocator('iframe');
  await expect(editor.getByRole('button', { name: 'Select shape', exact: true })).toBeVisible();
  const job = await page.evaluate(
    async (projectId) =>
      await (await fetch(`/api/projects/${projectId}/render`, { method: 'POST' })).json(),
    id,
  );
  await expect
    .poll(
      async () =>
        page.evaluate(
          async ({ projectId, jobId }) =>
            await (await fetch(`/api/projects/${projectId}/jobs/${jobId}`)).json(),
          { projectId: id, jobId: job.id },
        ),
      { timeout: 120000 },
    )
    .toMatchObject({ status: 'done' });
  const native = await read(page, id);
  expect(native.source.project.tracks[0].elements[0].type).toBe('shape');
  await page.getByRole('link', { name: 'Animation controls & agent tools', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
});

test('canonical actions and native text edits stay live in both directions', async ({ page }) => {
  const { id, editor } = await create(page);
  const reply = await page.evaluate(async (projectId) => {
    const action = {
      type: 'add-track',
      track: {
        id: 'live-track',
        name: 'Live text',
        elements: [
          {
            id: 'live-title',
            type: 'text',
            content: 'Agent title',
            fontSize: 48,
            fontFamily: 'Inter',
            color: '#ffffff',
            from: 0,
            durationInFrames: 48,
            transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
          },
        ],
      },
    };
    return (
      await fetch(`/api/projects/${projectId}/actions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ clientId: 'live-proof', action }),
      })
    ).status;
  }, id);
  expect(reply).toBe(200);
  const clip = editor.locator('[data-element-id="live-title"]');
  await expect(clip).toBeVisible();
  await clip.click();
  const text = editor.locator('.native-properties textarea').first();
  await expect(text).toHaveValue('Agent title');
  await text.fill('Native title');
  await text.blur();
  await expect
    .poll(async () =>
      page.evaluate(
        async (projectId) =>
          (await (await fetch(`/api/projects/${projectId}`)).json()).project.tracks
            .flatMap((track: { elements: { id: string; content?: string }[] }) => track.elements)
            .find((item: { id: string }) => item.id === 'live-title')?.content,
        id,
      ),
    )
    .toBe('Native title');
  await page.evaluate(async (projectId) => {
    await fetch(`/api/projects/${projectId}/actions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        clientId: 'live-proof',
        action: {
          type: 'patch',
          operations: [
            { op: 'replace', path: '/tracks/0/elements/0/content', value: 'Agent revised title' },
          ],
        },
      }),
    });
  }, id);
  await expect(text).toHaveValue('Agent revised title');
  await page.reload();
  await clip.click();
  await expect(text).toHaveValue('Agent revised title');
});

test('native agent locks refuse edits and agent undo updates OpenCut', async ({ page }) => {
  const { id, editor } = await create(page);
  const call = (toolName: string, toolArgs: Record<string, unknown>) =>
    page.evaluate(
      async ({ toolName: name, toolArgs: args }) => {
        const response = await fetch('/mcp', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json, text/event-stream',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/call',
            params: { name, arguments: args },
          }),
        });
        const body = await response.text();
        const line = body.split('\n').find((value) => value.startsWith('data: '));
        return JSON.parse(line ? line.slice(6) : body);
      },
      { toolName, toolArgs },
    );
  await page.evaluate(async (projectId) => {
    await fetch(`/api/projects/${projectId}/actions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        clientId: 'seed',
        action: {
          type: 'add-track',
          track: {
            id: 'native-lock-track',
            name: 'Titles',
            elements: [
              {
                id: 'native-locked-title',
                type: 'text',
                content: 'Original text',
                fontSize: 40,
                fontFamily: 'Inter',
                color: '#ffffff',
                from: 0,
                durationInFrames: 48,
                transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
              },
            ],
          },
        },
      }),
    });
  }, id);
  const clip = editor.locator('[data-element-id="native-locked-title"]');
  await expect(clip).toBeVisible();
  await clip.click();
  await call('set_agent_status', {
    projectId: id,
    status: 'working',
    name: 'Proof agent',
    label: 'Editing title',
    itemIds: ['native-locked-title'],
    confirmed: true,
  });
  await expect(clip).toHaveAttribute('data-agent-locked', 'true');
  const before = await read(page, id);
  const document = structuredClone(before.document);
  document.scenes[0].tracks.overlay.push({
    id: 'native-blocked-track',
    elements: [{ id: 'native-locked-title', params: { content: 'Blocked native write' } }],
  });
  const status = await page.evaluate(
    async ({ projectId, body }) =>
      (
        await fetch(`/api/projects/${projectId}/opencut`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        })
      ).status,
    {
      projectId: id,
      body: {
        version: before.version,
        canonicalRevision: before.source.revision,
        project: before.source.project,
        document,
      },
    },
  );
  expect(status).toBe(423);
  await call('move_item', { projectId: id, id: 'native-locked-title', from: 12, confirmed: true });
  await call('set_agent_status', {
    projectId: id,
    status: 'idle',
    label: 'Done',
    itemIds: [],
    confirmed: true,
  });
  await expect(clip).toHaveAttribute('data-agent-locked', 'false');
  await page.getByRole('button', { name: 'Undo agent turn', exact: true }).click();
  await clip.click();
  await expect(editor.locator('.native-properties textarea').first()).toHaveValue('Original text');
});
