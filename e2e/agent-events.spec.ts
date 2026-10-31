import { expect, test } from '@playwright/test';
import { seedProjectForClip } from '../src/core/project-seed';

test('UI jobs reach MCP with authored turns and completion appears live', async ({ page }) => {
  await page.goto('/');
  const state = await page.evaluate(
    async (project) =>
      (
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title: 'Event proof', project }),
        })
      ).json(),
    seedProjectForClip('typewriter'),
  );
  await page.goto(`/video/${state.id}?workspace=animation`);
  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
  await page.getByText('Agent requests & video tools', { exact: true }).click();
  const panel = page.getByRole('dialog', { name: 'Agent requests and video tools' });
  await expect(panel).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Agent requests & video tools' })).toBeFocused();
  await page.getByRole('button', { name: 'Agent requests & video tools' }).click();
  await page
    .getByRole('textbox', { name: 'Agent request', exact: true })
    .fill('Make the opening clearer');
  await page.getByRole('button', { name: 'Queue request', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Agent request feedback' })).toContainText(
    'Queued locally',
  );
  const invoke = (name: string, args: Record<string, unknown>) =>
    page.evaluate(
      async (input) =>
        (
          await fetch('/mcp', {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              accept: 'application/json, text/event-stream',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: Date.now(),
              method: 'tools/call',
              params: { name: input.name, arguments: input.args },
            }),
          })
        ).json(),
      { name, args },
    );
  const result = await invoke('wait_for_events', { projectId: state.id, timeout: 0 });
  const event = JSON.parse(result.result.content[0].text)[0];
  expect(event.text).toBe('Make the opening clearer');
  await invoke('set_agent_status', {
    projectId: state.id,
    status: 'working',
    name: 'Claude Code',
    label: 'Fix opening',
    itemIds: [],
    confirmed: true,
  });
  await invoke('update_props', {
    projectId: state.id,
    id: state.project.tracks[0].elements[0].id,
    props: { text: 'A CLEAR OPENING' },
    confirmed: true,
  });
  await invoke('resolve_event', {
    projectId: state.id,
    id: event.id,
    note: 'Opening updated',
    confirmed: true,
  });
  await invoke('set_agent_status', {
    projectId: state.id,
    status: 'idle',
    label: 'Done',
    itemIds: [],
    confirmed: true,
  });
  await expect(page.getByText('Opening updated', { exact: true })).toBeVisible();
  const saved = await page.evaluate(
    async (id) => (await fetch(`/api/projects/${id}`)).json(),
    state.id,
  );
  expect(saved.activity.at(-1)).toMatchObject({ author: 'Claude Code', turnId: event.turnId });
  await page.reload();
  await page.getByText('Agent requests & video tools', { exact: true }).click();
  await expect(page.getByText('Opening updated', { exact: true })).toBeVisible();
});

test('OpenCut video splitting is reachable, persistent and undoable', async ({ page }) => {
  await page.goto('/');
  const id = await page.evaluate(async () => {
    const seeded = {
      fps: 30,
      width: 640,
      height: 360,
      durationInFrames: 90,
      background: '#000000',
      tracks: [
        {
          id: 'track-proof',
          name: 'Video',
          elements: [
            {
              id: 'video-proof',
              type: 'video',
              src: '/previews/typewriter.mp4',
              from: 0,
              durationInFrames: 90,
              sourceFrom: 0,
              transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
            },
          ],
        },
      ],
    };
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Split proof', project: seeded }),
    });
    return (await response.json()).id;
  });
  await page.goto(`/video/${id}?workspace=animation`);
  await page.setViewportSize({ width: 375, height: 844 });
  await expect(page.getByRole('button', { name: 'Edit with AI', exact: true })).toBeVisible();
  const boxes = await page.locator('header a, header button').evaluateAll((nodes) =>
    nodes
      .map((node) => {
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      })
      .filter((box) => box.width > 0),
  );
  for (const [index, box] of boxes.entries()) {
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    expect(
      boxes
        .slice(index + 1)
        .some(
          (other) =>
            box.x < other.x + other.width &&
            box.x + box.width > other.x &&
            box.y < other.y + other.height &&
            box.y + box.height > other.y,
        ),
    ).toBe(false);
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
  const ruler = page.getByRole('button', { name: 'Seek timeline', exact: true });
  const rect = await ruler.boundingBox();
  if (!rect) {
    throw new Error('Missing ruler');
  }
  await ruler.click({ position: { x: rect.width / 3, y: rect.height / 2 } });
  await page.getByText('Agent requests & video tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Split video at playhead' }).click();
  await expect(page.getByRole('button', { name: 'Video element', exact: true })).toHaveCount(2);
  await page.getByText('Agent requests & video tools', { exact: true }).click();
  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Video element', exact: true })).toHaveCount(1);
});
