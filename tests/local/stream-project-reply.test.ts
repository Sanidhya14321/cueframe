import { expect, it } from 'bun:test';
import { simulateReadableStream } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import { streamProjectReply } from '@/local/stream-project-reply';

it('forwards model text without buffering the reply', async () => {
  const model = new MockLanguageModelV3({
    doStream: {
      stream: simulateReadableStream({
        chunks: [
          { type: 'stream-start', warnings: [] },
          { type: 'text-start', id: 'a' },
          { type: 'text-delta', id: 'a', delta: 'Hello' },
          { type: 'text-end', id: 'a' },
          {
            type: 'finish',
            finishReason: { unified: 'stop', raw: 'stop' },
            usage: {
              inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
              outputTokens: { total: 1, text: 1, reasoning: 0 },
            },
          },
        ],
        chunkDelayInMs: 0,
      }),
    },
  });
  const text: string[] = [];
  await streamProjectReply({
    model,
    instructions: 'Test',
    prompt: 'Hello',
    tools: {},
    signal: undefined,
    onText: (delta) => {
      text.push(delta);
    },
  });
  expect(text).toEqual(['Hello']);
});

it('delivers text while the provider is still generating', async () => {
  const release = Promise.withResolvers<void>();
  const first = Promise.withResolvers<void>();
  let providerFinished = false;
  const model = new MockLanguageModelV3({
    doStream: {
      stream: new ReadableStream({
        start(controller) {
          controller.enqueue({ type: 'text-start', id: 'live' });
          controller.enqueue({ type: 'text-delta', id: 'live', delta: 'First' });
          release.promise.then(() => {
            providerFinished = true;
            controller.enqueue({ type: 'text-end', id: 'live' });
            controller.enqueue({
              type: 'finish',
              finishReason: { unified: 'stop', raw: 'stop' },
              usage: {
                inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
                outputTokens: { total: 1, text: 1, reasoning: 0 },
              },
            });
            controller.close();
          });
        },
      }),
    },
  });
  const running = streamProjectReply({
    model,
    instructions: 'Test',
    prompt: 'Hello',
    tools: {},
    signal: undefined,
    onText: () => {
      first.resolve();
    },
  });
  await first.promise;
  expect(providerFinished).toBe(false);
  release.resolve();
  await running;
});
