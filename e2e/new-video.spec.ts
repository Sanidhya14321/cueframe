import { expect, test } from '@playwright/test';

test('a prompt from home reaches the agent queue and opens the editor', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Create from a prompt' }).click();
  await page.getByLabel('What should this video show?').fill('A launch video');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForURL(/\/video\/[a-z0-9]{12}$/);
  const id = new URL(page.url()).pathname.split('/').at(-1);
  const state = await page.evaluate(
    async (projectId) => (await fetch(`/api/projects/${projectId}`)).json(),
    id,
  );
  expect(state.project.height).toBe(1920);
  expect(state.events[0]).toMatchObject({ kind: 'job' });
  expect(state.events[0].text).toContain('A launch video');
});

test('an uploaded video lands on the timeline without template clips', async ({ page }) => {
  await page.goto('/new?tab=upload');
  await page.getByLabel('Video to edit').setInputFiles('public/site-assets/pencil-reel.mp4');
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForURL(/\/video\//);
  const id = new URL(page.url()).pathname.split('/').at(-1);
  const saved = await page.evaluate(
    async (projectId) => (await fetch(`/api/projects/${projectId}`)).json(),
    id,
  );
  const items = saved.project.tracks.flatMap(
    (track: { elements: { type: string }[] }) => track.elements,
  );
  expect(items.map((item: { type: string }) => item.type)).toEqual(['video']);
  expect(saved.project.durationInFrames).toBeGreaterThan(300);
});
