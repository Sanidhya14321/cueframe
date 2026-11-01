import { beforeEach, expect, it } from 'bun:test';
import { enqueueEvent, waitForEvents } from '@/local/agent-events';
import { projectEvents } from '@/local/project-events';
import { commitAction, createProject } from '@/local/projects';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);
const seed = () =>
  createProject({
    title: 'Live updates',
    project: {
      width: 640,
      height: 360,
      fps: 30,
      durationInFrames: 90,
      background: '#000000',
      tracks: [],
    },
  });

it('pushes an atomic project write to an open event stream without waiting for the fallback', async () => {
  const state = await seed();
  const abort = new AbortController();
  const reader = projectEvents(state.id, abort.signal).getReader();
  await reader.read();
  const update = reader.read();
  const start = performance.now();
  await commitAction(
    state.id,
    { type: 'patch', operations: [{ op: 'replace', path: '/background', value: '#ffffff' }] },
    { actor: 'browser:test' },
  );
  const changed = await update;
  expect(new TextDecoder().decode(changed.value)).toContain('#ffffff');
  expect(performance.now() - start).toBeLessThan(1000);
  abort.abort();
  await reader.cancel();
});

it('wakes a waiting coding agent as soon as its message is saved', async () => {
  const state = await seed();
  const waiting = waitForEvents(state.id, 'agent:test', 3);
  const start = performance.now();
  await enqueueEvent(state.id, { kind: 'voice', text: 'Hello' });
  const received = await waiting;
  expect(received[0]?.text).toBe('Hello');
  expect(performance.now() - start).toBeLessThan(1000);
});
