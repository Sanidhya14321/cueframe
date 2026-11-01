/* biome-ignore-all lint/complexity/useLiteralKeys: tool names use the SDK registry's index signature */
import { beforeEach, describe, expect, it } from 'bun:test';
import { simulateReadableStream } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import { projectChatTools } from '@/agent/project-chat-tools';
import { POST } from '@/app/api/projects/[projectId]/chat/route';
import { readProjectChat } from '@/lib/read-project-chat';
import { markListening, readAgentLog } from '@/local/agent-log';
import { markConnected } from '@/local/connections';
import { sendProjectChat } from '@/local/project-chat';
import type { ProjectChatUpdate } from '@/local/project-chat-schema';
import { createProject, readProject } from '@/local/projects';
import { sessionToken } from '@/local/security';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);

const seed = () =>
  createProject({
    title: 'Chat test',
    project: {
      width: 640,
      height: 360,
      fps: 30,
      durationInFrames: 90,
      background: '#000000',
      tracks: [],
    },
  });
const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 1, text: 1, reasoning: 0 },
};
const reply = {
  content: [{ type: 'text' as const, text: 'The background is white.' }],
  finishReason: { unified: 'stop' as const, raw: 'stop' },
  usage,
  warnings: [],
};

type Generated = Awaited<ReturnType<MockLanguageModelV3['doGenerate']>>;
type Streamed = Awaited<ReturnType<MockLanguageModelV3['doStream']>>;
type Chunk = Streamed['stream'] extends ReadableStream<infer Part> ? Part : never;
const toStream = (generated: Generated): Streamed => {
  const chunks: Chunk[] = [{ type: 'stream-start', warnings: [] }];
  for (const part of generated.content) {
    if (part.type === 'text') {
      chunks.push(
        { type: 'text-start', id: 'reply' },
        { type: 'text-delta', id: 'reply', delta: part.text },
        { type: 'text-end', id: 'reply' },
      );
    }
    if (part.type === 'tool-call') {
      chunks.push(part);
    }
  }
  chunks.push({ type: 'finish', finishReason: generated.finishReason, usage: generated.usage });
  return { stream: simulateReadableStream({ chunks, chunkDelayInMs: 0 }) };
};

describe('in-app project chat', () => {
  it('stops generation, retains received text and releases the project', async () => {
    const state = await seed();
    const abort = new AbortController();
    const model = new MockLanguageModelV3({
      doStream: (options) =>
        Promise.resolve({
          stream: new ReadableStream<Chunk>({
            start(controller) {
              controller.enqueue({ type: 'text-start', id: 'partial' });
              controller.enqueue({ type: 'text-delta', id: 'partial', delta: 'Partial reply' });
              options.abortSignal?.addEventListener(
                'abort',
                () => controller.error(new DOMException('Stopped', 'AbortError')),
                { once: true },
              );
            },
          }),
        }),
    });
    await expect(
      sendProjectChat(state.id, { kind: 'voice', text: 'Hello' }, 'http://localhost:3000', model, {
        signal: abort.signal,
        onUpdate: (part) => {
          if (part.type === 'text') {
            abort.abort();
          }
        },
      }),
    ).rejects.toThrow('Reply stopped');
    expect((await readProject(state.id)).agent?.status).toBe('idle');
    expect((await readAgentLog(state.id)).entries).toContainEqual(
      expect.objectContaining({ kind: 'reply', text: 'Partial reply' }),
    );
  });
  it('streams acceptance for the prioritized coding agent without model credentials', async () => {
    const state = await seed();
    await markConnected('claude-code');
    const response = await POST(
      new Request('http://localhost:3000/api/projects/chat', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${sessionToken()}`,
          'content-type': 'application/json',
          accept: 'application/x-ndjson',
        },
        body: JSON.stringify({ kind: 'voice', text: 'Hello', engine: 'auto' }),
      }),
      { params: Promise.resolve({ projectId: state.id }) },
    );
    const updates: ProjectChatUpdate[] = [];
    await readProjectChat(response, (part) => {
      updates.push(part);
    });
    expect(updates).toContainEqual(
      expect.objectContaining({ type: 'accepted', mode: 'external', waiting: true }),
    );
    expect(updates.at(-1)).toMatchObject({ type: 'finish', mode: 'external' });
  });
  it('prioritizes a connected coding agent over an available API model', async () => {
    const state = await seed();
    await markConnected('claude-code');
    const model = new MockLanguageModelV3({ doStream: toStream(reply) });
    expect(
      await sendProjectChat(
        state.id,
        { kind: 'voice', text: 'Hello' },
        'http://localhost:3000',
        model,
      ),
    ).toEqual({ mode: 'external' });
    expect(model.doStreamCalls).toHaveLength(0);
  });
  it('queues for a connected coding agent even before its project listener starts', async () => {
    const state = await seed();
    await markConnected('claude-code');
    const updates: ProjectChatUpdate[] = [];
    expect(
      await sendProjectChat(
        state.id,
        { kind: 'voice', text: 'Hello' },
        'http://localhost:3000',
        undefined,
        {
          onUpdate: (part) => {
            updates.push(part);
          },
        },
      ),
    ).toEqual({ mode: 'external' });
    expect(updates[0]).toMatchObject({ type: 'accepted', mode: 'external', waiting: true });
    expect((await readProject(state.id)).events[0]?.status).toBe('queued');
  });

  it('can explicitly use the AI editor while a coding agent is listening', async () => {
    const state = await seed();
    await markListening(state.id);
    const model = new MockLanguageModelV3({ doStream: toStream(reply) });
    expect(
      await sendProjectChat(
        state.id,
        { kind: 'voice', text: 'Hello' },
        'http://localhost:3000',
        model,
        { engine: 'in-app' },
      ),
    ).toEqual({ mode: 'in-app' });
    expect((await readProject(state.id)).events[0]?.actor).toStartWith('agent:in-app:');
  });

  it('runs model tools as persistent, undoable edits and returns a saved reply', async () => {
    const state = await seed();
    const model = new MockLanguageModelV3({
      doStream: [
        {
          content: [
            {
              type: 'tool-call' as const,
              toolCallId: 'edit-background',
              toolName: 'edit_project',
              input: JSON.stringify({
                confirmed: true,
                operations: [{ op: 'replace', path: '/background', value: '#ffffff' }],
              }),
            },
          ],
          finishReason: { unified: 'tool-calls' as const, raw: 'tool_calls' },
          usage,
          warnings: [],
        },
        reply,
      ].map(toStream),
    });
    expect(
      await sendProjectChat(
        state.id,
        { kind: 'voice', text: 'Make the background white' },
        'http://localhost:3000',
        model,
      ),
    ).toEqual({ mode: 'in-app' });
    const saved = await readProject(state.id);
    expect(saved.project.background).toBe('#ffffff');
    expect(saved.events[0]?.status).toBe('done');
    expect(saved.agent?.status).toBe('idle');
    expect(saved.history.at(-1)).toMatchObject({
      author: 'AI editor',
      turnId: saved.events[0]?.turnId,
    });
    expect((await readAgentLog(state.id)).entries.at(-1)?.text).toBe('The background is white.');
  });

  it('routes to an external listener without requiring any model credentials', async () => {
    const state = await seed();
    await markListening(state.id);
    expect(
      await sendProjectChat(
        state.id,
        { kind: 'voice', text: 'Make it clearer' },
        'http://localhost:3000',
      ),
    ).toEqual({ mode: 'external' });
    expect((await readProject(state.id)).events[0]?.status).toBe('queued');
  });

  it('returns a settings action instead of silently queueing when no model is configured', async () => {
    const state = await seed();
    const response = await POST(
      new Request('http://localhost:3000/api/projects/chat', {
        method: 'POST',
        headers: { authorization: `Bearer ${sessionToken()}`, 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'voice', text: 'Hello' }),
      }),
      { params: Promise.resolve({ projectId: state.id }) },
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ configurationRequired: true });
    expect((await readProject(state.id)).events).toHaveLength(0);
  });

  it('releases locks and reports failures without exposing provider errors', async () => {
    const state = await seed();
    const model = new MockLanguageModelV3({
      doStream: () => Promise.reject(new Error('private-provider-response')),
    });
    await expect(
      sendProjectChat(state.id, { kind: 'voice', text: 'Hello' }, 'http://localhost:3000', model),
    ).rejects.toThrow('Something went wrong');
    expect((await readProject(state.id)).agent?.status).toBe('idle');
    const log = await readAgentLog(state.id);
    expect(JSON.stringify(log)).not.toContain('private-provider-response');
    expect(log.entries.at(-1)?.kind).toBe('error');
  });

  it('does not let chat tools read or edit another project', async () => {
    const state = await seed();
    const other = await seed();
    const tools = projectChatTools(state.id, {
      origin: 'http://localhost:3000',
      actor: 'agent:test',
    });
    const get = tools['get_project'];
    const result = await Promise.resolve(
      get?.execute?.({ projectId: other.id } as never, {
        toolCallId: 'test',
        messages: [],
        context: undefined,
      }),
    );
    expect(result).toHaveProperty('error');
  });

  it('requires the runtime session before accessing chat', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/projects/chat', { method: 'POST' }),
      { params: Promise.resolve({ projectId: '000000000000' }) },
    );
    expect(response.status).toBe(401);
  });
});
