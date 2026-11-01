import { expect, type Page, test } from '@playwright/test';

type Chunk = Record<string, unknown>;

const editCall = (id: string, summary: string, operations: unknown[], output: unknown): Chunk[] => [
  { type: 'start-step' },
  { type: 'tool-input-start', toolCallId: id, toolName: 'editMedia' },
  {
    type: 'tool-input-available',
    toolCallId: id,
    toolName: 'editMedia',
    input: { summary, operations },
  },
  { type: 'tool-output-available', toolCallId: id, output },
  { type: 'finish-step' },
];

const renameCall = (id: string, title: string): Chunk[] => [
  { type: 'tool-input-start', toolCallId: id, toolName: 'renameChat' },
  { type: 'tool-input-available', toolCallId: id, toolName: 'renameChat', input: { title } },
  { type: 'tool-output-available', toolCallId: id, output: { title } },
];

const reply = (text: string): Chunk[] => [
  { type: 'reasoning-start', id: 'think' },
  {
    type: 'reasoning-delta',
    id: 'think',
    delta: '**Finding the control**\n\nThe request maps to one field.',
  },
  { type: 'reasoning-end', id: 'think' },
  { type: 'text-start', id: 'reply' },
  ...text.split(' ').map((word) => ({ type: 'text-delta', id: 'reply', delta: `${word} ` })),
  { type: 'text-end', id: 'reply' },
];

const sse = (chunks: Chunk[]): string =>
  [{ type: 'start', messageId: 'agent' }, ...chunks, { type: 'finish' }]
    .map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`)
    .concat('data: [DONE]\n\n')
    .join('');

interface Seen {
  media: unknown[];
  titles: unknown[];
}

const mockAgent = async (page: Page, body: string): Promise<Seen> => {
  const seen: Seen = { media: [], titles: [] };
  await page.route('**/api/agent', async (route) => {
    const request = route.request().postDataJSON();
    seen.media.push(request.media);
    seen.titles.push(request.chatTitle);
    await route.fulfill({
      status: 200,
      headers: { 'content-type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
      body,
    });
  });
  return seen;
};

const ask = async (page: Page, prompt: string): Promise<void> => {
  await page.getByRole('button', { name: 'Edit with AI' }).click();
  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel).toBeVisible();
  await panel.getByLabel('Message the AI editor').fill(prompt);
  await panel.getByRole('button', { name: 'Send', exact: true }).click();
};

test('the agent edits a clip, names the chat and keeps both after a reload', async ({ page }) => {
  await page.setViewportSize({ width: 1700, height: 900 });
  const operations = [
    { op: 'replace', path: '/tracks/0/elements/0/props/text', value: 'HELLO FROM THE AGENT' },
  ];
  const seen = await mockAgent(
    page,
    sse([
      ...reply('Changing the line text.'),
      { type: 'start-step' },
      ...renameCall('rename-1', 'Agent greeting'),
      { type: 'finish-step' },
      ...editCall('edit-1', 'Rewrite the line', operations, { ok: true, operations }),
    ]),
  );
  await page.goto('/clips/word-build');
  await ask(page, 'Change the text');

  const panel = page.getByRole('region', { name: 'AI editor' });
  await expect(panel.getByText('Changing the line text.')).toBeVisible();
  await expect(panel.getByTestId('agent-thinking')).toHaveAttribute('data-open', 'false');
  const edit = panel.getByTestId('agent-edit');
  await expect(edit).toHaveAttribute('data-state', 'applied');
  await expect(edit).toContainText('Rewrite the line');
  await expect(panel.getByTestId('agent-operation')).toContainText('Line');
  await expect(panel.getByTestId('agent-operation')).toContainText('HELLO FROM THE AGENT');
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Agent greeting');
  await expect(panel.getByText('tokens')).toHaveCount(0);
  expect(seen.media[0]).toMatchObject({ kind: 'clip', title: 'Word Build' });
  expect(seen.titles[0]).toBeNull();

  const editorBox = await page
    .locator('aside')
    .filter({ has: page.locator('textarea') })
    .boundingBox();
  const panelBox = await panel.boundingBox();
  expect((editorBox?.x ?? 0) + (editorBox?.width ?? 0)).toBeLessThanOrEqual(panelBox?.x ?? 0);

  const line = page.locator('aside textarea').first();
  await expect(line).toHaveValue('HELLO FROM THE AGENT');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(line).not.toHaveValue('HELLO FROM THE AGENT');
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  await expect(line).toHaveValue('HELLO FROM THE AGENT');

  await expect
    .poll(() =>
      page.evaluate(async () => {
        const projects = (await (await fetch('/api/projects')).json()) as {
          id: string;
          title: string;
        }[];
        const saved = projects.find((project) => project.title === 'Word Build');
        return saved ? JSON.stringify(await (await fetch(`/api/projects/${saved.id}`)).json()) : '';
      }),
    )
    .toContain('HELLO FROM THE AGENT');
  await page.reload();
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Agent greeting');
  await expect(panel.getByText('Changing the line text.')).toBeVisible();
  await expect(line).toHaveValue('HELLO FROM THE AGENT');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(line).not.toHaveValue('HELLO FROM THE AGENT');

  await panel.getByRole('button', { name: 'New chat' }).click();
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('New chat');
  await expect(panel.getByText('What should change in this video?')).toBeVisible();
  await panel.getByRole('button', { name: 'Chats' }).click();
  await page.getByRole('menuitem', { name: /Agent greeting/ }).click();
  await expect(panel.getByText('Changing the line text.')).toBeVisible();

  await panel.getByRole('button', { name: 'Chats' }).click();
  await page.getByRole('menuitem', { name: 'Rename chat' }).click();
  await panel.getByLabel('Chat name').fill('Line rewrite');
  await panel.getByLabel('Chat name').press('Enter');
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Line rewrite');
  await panel.getByLabel('Message the AI editor').fill('Again');
  await panel.getByRole('button', { name: 'Send', exact: true }).click();
  await expect.poll(() => seen.titles.at(-1)).toBe('Line rewrite');
});

test('a rejected poster edit is retried out of sight and applied on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const rejected = [{ op: 'replace', path: '/elements/0/fontFamily', value: 'Nunito' }];
  const fixed = [
    { op: 'replace', path: '/controls/4/value', value: 'Nunito' },
    { op: 'replace', path: '/title', value: 'Agent Poster' },
  ];
  await mockAgent(
    page,
    sse([
      ...reply('Updating the poster.'),
      ...editCall('edit-1', 'Use Nunito', rejected, {
        ok: false,
        error:
          'CLIENT fontFamily is driven by the "Heading font" control. Replace /controls/4/value instead',
      }),
      ...editCall('edit-2', 'Use Nunito and rename', fixed, { ok: true, operations: fixed }),
    ]),
  );
  await page.goto('/posters/amber-client-reviews-01');
  await expect(page.getByTestId('design-canvas').locator('canvas').first()).toBeVisible();
  await ask(page, 'Rename it');

  const panel = page.getByRole('region', { name: 'AI editor' });
  const edit = panel.getByTestId('agent-edit');
  await expect(edit).toHaveCount(1);
  await expect(edit).toHaveAttribute('data-state', 'applied');
  await expect(edit).toContainText('Use Nunito and rename');
  await expect(panel.getByText('driven by the "Heading font" control')).toHaveCount(0);
  const themed = panel.getByTestId('agent-operation').first();
  await expect(themed).toContainText('Heading font');
  await expect(themed).toContainText('“Nunito”');
  await expect(panel.getByTestId('agent-chat-title')).toHaveText('Rename it');

  const box = await panel.boundingBox();
  expect(box?.width).toBe(390);
  expect((box?.y ?? 0) > 844 / 3).toBe(true);
  await panel.getByRole('button', { name: 'Close AI editor' }).click();
  await expect(page.getByLabel('Design title')).toHaveValue('Agent Poster');
  await expect
    .poll(() =>
      page.evaluate(() => {
        const saved = JSON.parse(
          localStorage.getItem('neuclip-poster:amber-client-reviews-01') ?? '{}',
        );
        return [saved.controls?.[4]?.value, saved.elements?.[0]?.fontFamily];
      }),
    )
    .toEqual(['Nunito', 'Nunito']);
});
