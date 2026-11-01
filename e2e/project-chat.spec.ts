/* biome-ignore-all lint/performance/noAwaitInLoops: screenshots require sequential viewport changes */
import { mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // biome-ignore lint/style/noProcessEnv: optional owner login for disposable production test containers
  const { E2E_OWNER_PASSWORD: password } = process.env;
  if (password) {
    await page.goto('/login');
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).not.toHaveURL(/\/login/);
  }
});

test('the owner login asks for a password without accounts or roles', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Unlock your video editor' })).toBeVisible();
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Email', { exact: true })).toHaveCount(0);
  await mkdir('docs/screenshots/chat-repair', { recursive: true });
  for (const width of [375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.screenshot({ path: `docs/screenshots/chat-repair/login-${width}.png` });
  }
});

test('coding-agent chat has priority and shows replies before the event finishes', async ({
  page,
}) => {
  await page.goto('/');
  const state = await page.evaluate(async () => {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'unreachable-fixture',
        baseUrl: 'http://127.0.0.1:9/v1',
        apiKey: 'fixture-only',
      }),
    });
    return (
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: 'Coding agent priority',
          project: {
            width: 640,
            height: 360,
            fps: 30,
            durationInFrames: 90,
            background: '#000000',
            tracks: [],
          },
        }),
      })
    ).json();
  });
  const invoke = (name: string, args: Record<string, unknown>) =>
    page.evaluate(
      async (input) => {
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
            params: { name: input.name, arguments: input.args },
          }),
        });
        const payload = await response.json();
        if (payload.result?.isError) {
          throw new Error('MCP fixture tool failed');
        }
        return JSON.parse(payload.result.content[0].text);
      },
      { name, args },
    );
  await invoke('get_project', { projectId: state.id });
  await page.goto(`/video/${state.id}`);
  await page.getByRole('button', { name: 'Agent', exact: true }).click();
  const panel = page.getByRole('complementary', { name: 'Agent', exact: true });
  await expect(panel.getByLabel('Reply using')).toHaveValue('auto');
  await expect(panel.getByRole('button', { name: 'Copy listener prompt' })).toBeVisible();
  await panel.getByLabel('Message your agent').fill('Reply in this editor');
  await panel.getByRole('button', { name: 'Send', exact: true }).click();
  await expect(panel.getByRole('status', { name: 'Voice request status' })).toContainText(
    'Waiting',
  );
  const [event] = await invoke('wait_for_events', { projectId: state.id, timeout: 0 });
  expect(event.text).toBe('Reply in this editor');
  await invoke('share_update', {
    projectId: state.id,
    kind: 'reply',
    text: 'A live reply from your coding agent.',
  });
  await expect(
    panel.getByText('A live reply from your coding agent.', { exact: true }),
  ).toBeVisible();
  await expect(panel.getByRole('status', { name: 'Voice request status' })).toContainText(
    'Sent to your coding agent',
  );
  await mkdir('docs/screenshots/chat-realtime', { recursive: true });
  for (const width of [375, 768, 1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.screenshot({ path: `docs/screenshots/chat-realtime/${width}.png` });
  }
  await invoke('resolve_event', {
    projectId: state.id,
    id: event.id,
    note: 'Reply delivered.',
    confirmed: true,
  });
});

test('video chat explains missing setup, runs in-app edits and supports undo', async ({ page }) => {
  const releaseReply = Promise.withResolvers<void>();
  const provider = createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) {
      body += chunk;
    }
    const input = JSON.parse(body) as { messages: { role: string }[] };
    const edited = input.messages.some((message) => message.role === 'tool');
    response.writeHead(200, { 'content-type': 'text/event-stream' });
    const send = (delta: unknown, finishReason: string | null = null) => {
      response.write(
        `data: ${JSON.stringify({
          id: 'chat-proof',
          object: 'chat.completion.chunk',
          created: Math.floor(Date.now() / 1000),
          model: 'test-chat',
          choices: [{ index: 0, delta, finish_reason: finishReason }],
        })}\n\n`,
      );
    };
    if (edited) {
      send({ role: 'assistant', content: 'The background' });
      await releaseReply.promise;
      send({ content: ' is white.' });
      send({}, 'stop');
    } else {
      send({
        role: 'assistant',
        tool_calls: [
          {
            index: 0,
            id: 'background-edit',
            type: 'function',
            function: {
              name: 'edit_project',
              arguments: JSON.stringify({
                confirmed: true,
                operations: [{ op: 'replace', path: '/background', value: '#ffffff' }],
              }),
            },
          },
        ],
      });
      send({}, 'tool_calls');
    }
    response.end('data: [DONE]\n\n');
  });
  await new Promise<void>((resolve) => provider.listen(0, '0.0.0.0', resolve));
  const address = provider.address();
  if (!address || typeof address === 'string') {
    throw new Error('Provider fixture did not start');
  }
  try {
    await page.goto('/');
    const state = await page.evaluate(async () => {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model: '', clearApiKey: true }),
      });
      return (
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            title: 'Chat repair proof',
            project: {
              width: 640,
              height: 360,
              fps: 30,
              durationInFrames: 90,
              background: '#000000',
              tracks: [],
            },
          }),
        })
      ).json();
    });
    await page.goto(`/video/${state.id}`);
    await page.getByRole('button', { name: 'Agent', exact: true }).click();
    const panel = page.getByRole('complementary', { name: 'Agent', exact: true });
    await panel.getByLabel('Reply using').selectOption('in-app');
    const input = panel.getByRole('textbox', { name: 'Message your agent' });
    await input.fill('Make the background white');
    await panel.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(
      panel.getByRole('link', { name: 'Open Settings to configure the AI editor' }),
    ).toBeVisible();
    await expect(input).toHaveValue('Make the background white');
    // biome-ignore lint/style/noProcessEnv: Docker tests reach this local fixture through its host gateway
    const { E2E_PROVIDER_HOST: providerHost = '127.0.0.1' } = process.env;
    await page.evaluate(async (baseUrl) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          providerType: 'openai-compatible',
          baseUrl,
          model: 'test-chat',
          apiKey: 'fixture-only',
        }),
      });
      if (!response.ok) {
        throw new Error('Could not configure provider fixture');
      }
    }, `http://${providerHost}:${address.port}/v1`);
    await panel.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(panel.getByTestId('streaming-reply')).toHaveText('The background');
    await expect(panel.getByRole('button', { name: 'Stop reply' })).toBeVisible();
    await expect(input).toHaveValue('');
    releaseReply.resolve();
    await expect(panel.getByText('The background is white.', { exact: true })).toBeVisible();
    await expect(input).toHaveValue('');
    const background = () =>
      page.evaluate(
        async (id) => (await (await fetch(`/api/projects/${id}`)).json()).project.background,
        state.id,
      );
    expect(await background()).toBe('#ffffff');
    await panel.getByRole('button', { name: 'Undo agent turn' }).click();
    await expect.poll(background).toBe('#000000');
    await mkdir('docs/screenshots/chat-repair', { recursive: true });
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(panel).toBeVisible();
      await page.screenshot({ path: `docs/screenshots/chat-repair/${width}.png` });
    }
  } finally {
    releaseReply.resolve();
    provider.closeAllConnections();
    await new Promise<void>((resolve, reject) =>
      provider.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
