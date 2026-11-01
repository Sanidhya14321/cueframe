import { expect, test } from '@playwright/test';
import { seedProjectForClip } from '../src/core/project-seed';

test('an API action updates an open editor and survives reload', async ({ page }) => {
  await page.goto('/');
  const state = await page.evaluate(async (project) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Live project proof', project }),
    });
    return response.json() as Promise<{ id: string; revision: number }>;
  }, seedProjectForClip('typewriter'));
  await page.goto(`/video/${state.id}?workspace=animation`);
  await expect(
    page.getByRole('region', { name: 'Text', exact: true }).getByRole('textbox'),
  ).toBeVisible();
  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
  const response = await page.evaluate(
    async (id) =>
      fetch(`/api/projects/${id}/actions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          clientId: 'proof',
          action: {
            type: 'patch',
            operations: [
              { op: 'replace', path: '/tracks/0/elements/0/props/text', value: 'LIVE FROM API' },
            ],
          },
        }),
      }).then((reply) => reply.status),
    state.id,
  );
  expect(response).toBe(200);
  await expect(
    page.getByRole('region', { name: 'Text', exact: true }).getByRole('textbox'),
  ).toHaveValue('LIVE FROM API');
  await page.reload();
  await expect(
    page.getByRole('region', { name: 'Text', exact: true }).getByRole('textbox'),
  ).toHaveValue('LIVE FROM API');
});

test('MCP edits appear live, locked items refuse browser edits and agent undo works', async ({
  page,
}) => {
  await page.goto('/');
  const state = (await page.evaluate(
    async (project) =>
      (
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title: 'MCP live proof', project }),
        })
      ).json(),
    seedProjectForClip('typewriter'),
  )) as { id: string; project: { tracks: { elements: { id: string }[] }[] } };
  const itemId = state.project.tracks[0]?.elements[0]?.id ?? '';
  await page.goto(`/video/${state.id}?workspace=animation`);
  const line = page.getByRole('region', { name: 'Text', exact: true }).getByRole('textbox');
  await expect(line).toBeVisible();
  const call = async (toolName: string, toolArgs: Record<string, unknown>) =>
    page.evaluate(
      async ({ name, args }) =>
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
              params: { name, arguments: args },
            }),
          })
        ).json(),
      { name: toolName, args: toolArgs },
    );
  await call('set_agent_status', {
    projectId: state.id,
    status: 'working',
    label: 'Updating the hook',
    itemIds: [itemId],
    confirmed: true,
  });
  await expect(line).toBeDisabled();
  await expect(page.locator(`[data-element-id="${itemId}"]`)).toHaveAttribute(
    'data-locked',
    'true',
  );
  const blocked = await page.evaluate(
    async ({ id, itemId: targetId }) =>
      (
        await fetch(`/api/projects/${id}/actions`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            clientId: 'browser-proof',
            action: { type: 'update-props', id: targetId, props: { text: 'BLOCKED' } },
          }),
        })
      ).status,
    { id: state.id, itemId },
  );
  expect(blocked).toBe(423);
  await call('update_props', {
    projectId: state.id,
    id: itemId,
    props: { text: 'EDITED THROUGH MCP' },
    confirmed: true,
  });
  await expect(line).toHaveValue('EDITED THROUGH MCP');
  await call('set_agent_status', {
    projectId: state.id,
    status: 'idle',
    label: 'Done',
    itemIds: [],
    confirmed: true,
  });
  await expect(line).toBeEnabled();
  await page.getByRole('button', { name: 'Undo agent turn', exact: true }).click();
  await expect(line).not.toHaveValue('EDITED THROUGH MCP');
});

test('a pinned comment is delivered and resolved for its item', async ({ page }) => {
  await page.goto('/');
  const state = (await page.evaluate(
    async (project) =>
      (
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title: 'Comment proof', project }),
        })
      ).json(),
    seedProjectForClip('typewriter'),
  )) as { id: string; project: { tracks: { elements: { id: string }[] }[] } };
  const itemId = state.project.tracks[0]?.elements[0]?.id ?? '';
  await page.goto(`/video/${state.id}?workspace=animation`);
  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
  await page.getByText('Comments (0)', { exact: true }).click();
  await page.getByLabel('Comment for agent').fill('Make this line clearer');
  await page.getByRole('button', { name: 'Send to agent', exact: true }).click();
  await expect(page.getByText('Comment sent to the agent.', { exact: true })).toBeVisible();
  const invoke = async (toolName: string, toolArgs: Record<string, unknown>) =>
    page.evaluate(
      async ({ name, args }) => {
        const response = await fetch('/mcp', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json, text/event-stream',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: { name, arguments: args },
          }),
        });
        return response.json();
      },
      { name: toolName, args: toolArgs },
    );
  const result = await invoke('wait_for_comments', { projectId: state.id, timeout: 0 });
  const comments = JSON.parse(result.result.content[0].text) as { id: string; itemId: string }[];
  expect(comments[0]?.itemId).toBe(itemId);
  await invoke('update_props', {
    projectId: state.id,
    id: itemId,
    props: { text: 'CLEARER MESSAGE' },
    confirmed: true,
  });
  await invoke('resolve_comment', {
    projectId: state.id,
    id: comments[0]?.id,
    note: 'Updated this item only.',
    confirmed: true,
  });
  await expect(page.getByText('Updated this item only.', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('region', { name: 'Text', exact: true }).getByRole('textbox'),
  ).toHaveValue('CLEARER MESSAGE');
});

test('a beat sheet builds sixteen editable clips and a timed sound bed', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
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
        params: {
          name: 'new_project',
          arguments: {
            title: 'Beat sheet proof',
            aspect: 'landscape',
            seconds: 30,
            confirmed: true,
          },
        },
      }),
    });
    return response.json();
  });
  const state = JSON.parse(result.result.content[0].text) as { projectId: string };
  await page.goto(`/video/${state.projectId}?workspace=animation`);
  await expect(page.getByRole('status', { name: 'Project sync' })).toContainText('Saved locally');
  await page.getByText('Build from beats', { exact: true }).click();
  await page.getByRole('button', { name: 'Build 30-second video', exact: true }).click();
  await expect
    .poll(
      async () =>
        page.evaluate(async (id) => {
          const saved = await (await fetch(`/api/projects/${id}`)).json();
          return saved.agent?.label;
        }, state.projectId),
      { timeout: 180_000 },
    )
    .toBe('Video ready to edit');
  await expect(page.getByRole('button', { name: 'Clip element', exact: true })).toHaveCount(16);
  const built = await page.evaluate(
    async (id) => (await fetch(`/api/projects/${id}`)).json(),
    state.projectId,
  );
  const elements = built.project.tracks.flatMap(
    (track: { elements: { type: string }[] }) => track.elements,
  );
  expect(elements.filter((item: { type: string }) => item.type === 'audio')).toHaveLength(32);
  expect(built.project.durationInFrames).toBe(900);
});
