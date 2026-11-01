import { expect, it } from 'bun:test';
import { ChatRequestError, readProjectChat } from '@/lib/read-project-chat';
import type { ProjectChatUpdate } from '@/local/project-chat-schema';

it('decodes split UTF-8 network chunks and detects incomplete replies', async () => {
  const records: ProjectChatUpdate[] = [
    { type: 'status', text: 'Connecting' },
    { type: 'text', id: 'reply', text: 'héllo' },
    { type: 'finish', mode: 'in-app', waiting: false },
  ];
  const bytes = new TextEncoder().encode(
    records.map((record) => JSON.stringify(record)).join('\n'),
  );
  const response = new Response(
    new ReadableStream({
      start(controller) {
        for (const byte of bytes) {
          controller.enqueue(new Uint8Array([byte]));
        }
        controller.close();
      },
    }),
  );
  const updates: ProjectChatUpdate[] = [];
  await readProjectChat(response, (update) => {
    updates.push(update);
  });
  expect(updates).toEqual(records);
  await expect(
    readProjectChat(new Response(`${JSON.stringify(records[0])}\n`), () => undefined),
  ).rejects.toThrow('closed early');
});

it('returns actionable streamed configuration failures', async () => {
  const response = new Response(
    `${JSON.stringify({ type: 'error', message: 'Choose a model', configurationRequired: true })}\n`,
  );
  let problem: unknown;
  try {
    await readProjectChat(response, () => undefined);
  } catch (error) {
    problem = error;
  }
  expect(problem).toBeInstanceOf(ChatRequestError);
  expect(problem).toHaveProperty('configurationRequired', true);
});
