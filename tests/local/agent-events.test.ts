import { expect, test as it } from 'bun:test';
import { enqueueEvent, resolveEvent, waitForEvents } from '@/local/agent-events';
import { addComment, resolveComment, waitForComments } from '@/local/comments';
import { commitAction, createProject, readProject, setAgentStatus } from '@/local/projects';
import { createTrack, createVideoElement } from '@/project';
import { splitVideoAtFrame } from '@/project/opencut/split-video';

const seed = () => {
  const track = createTrack('Video');
  track.elements.push(createVideoElement({ src: '/test.mp4', durationInFrames: 90 }));
  return createProject({
    title: 'Queue proof',
    project: {
      fps: 30,
      width: 640,
      height: 360,
      durationInFrames: 90,
      background: '#000000',
      tracks: [track],
    },
  });
};
it('requests claim atomically, redeliver until resolved, and preserve author/turn metadata', async () => {
  const state = await seed();
  await enqueueEvent(state.id, { kind: 'job', text: 'Build this story' });
  const results = await Promise.all([
    waitForEvents(state.id, 'agent:a', 0),
    waitForEvents(state.id, 'agent:b', 0),
  ]);
  expect(results.flat()).toHaveLength(1);
  const request = results.flat()[0];
  if (!request?.actor) {
    throw new Error('Missing claim');
  }
  expect((await waitForEvents(state.id, request.actor, 0))[0]?.id).toBe(request.id);
  await setAgentStatus(state.id, request.actor, {
    status: 'working',
    name: 'Test agent',
    label: 'Working',
    itemIds: [],
  });
  await commitAction(
    state.id,
    { type: 'patch', operations: [{ op: 'replace', path: '/background', value: '#ffffff' }] },
    { actor: request.actor },
  );
  const saved = await readProject(state.id);
  expect(saved.history.at(-1)).toMatchObject({ author: 'Test agent', turnId: request.turnId });
  await expect(resolveEvent(state.id, request.id, 'Wrong owner', 'agent:other')).rejects.toThrow();
  await resolveEvent(state.id, request.id, 'Finished', request.actor);
  expect(await waitForEvents(state.id, request.actor, 0)).toHaveLength(0);
});
it('legacy pinned comments arrive as scoped events and resolve together', async () => {
  const state = await seed();
  const itemId = state.project.tracks[0]?.elements[0]?.id;
  if (!itemId) {
    throw new Error('Missing item');
  }
  await addComment(state.id, { text: 'Fix this item', frame: 10, itemId });
  const event = (await waitForEvents(state.id, 'agent:comments', 0))[0];
  expect(event).toMatchObject({ kind: 'comment', itemId, status: 'in-progress' });
  await expect(
    commitAction(
      state.id,
      { type: 'patch', operations: [{ op: 'replace', path: '/background', value: '#ffffff' }] },
      { actor: 'agent:comments' },
    ),
  ).rejects.toThrow();
  if (!event) {
    throw new Error('No comment');
  }
  await resolveEvent(state.id, event.id, 'Fixed', 'agent:comments');
  expect((await readProject(state.id)).comments[0]?.status).toBe('done');
});
it('OpenCut adapted split preserves source offsets, total frames and input immutability', async () => {
  const state = await seed();
  const video = state.project.tracks[0]?.elements[0];
  if (video?.type !== 'video') {
    throw new Error('No video');
  }
  video.sourceFrom = 30;
  const next = splitVideoAtFrame(state.project, video.id, 40);
  expect(next.tracks[0]?.elements).toHaveLength(2);
  expect(next.tracks[0]?.elements[0]).toMatchObject({
    from: 0,
    durationInFrames: 40,
    sourceFrom: 30,
  });
  expect(next.tracks[0]?.elements[1]).toMatchObject({
    from: 40,
    durationInFrames: 50,
    sourceFrom: 70,
  });
  expect(state.project.tracks[0]?.elements).toHaveLength(1);
  expect(splitVideoAtFrame(state.project, video.id, 90).tracks[0]?.elements).toHaveLength(1);
});

it('brief and voice requests persist and abandoned claims can transfer after the lease', async () => {
  const state = await seed();
  await enqueueEvent(state.id, { kind: 'brief', text: 'A calmer opening' });
  await enqueueEvent(state.id, { kind: 'voice', text: 'Use an upbeat voice', frame: 20 });
  expect((await readProject(state.id)).brief).toBe('A calmer opening');
  const first = (await waitForEvents(state.id, 'agent:old', 0))[0];
  if (!first) {
    throw new Error('Missing event');
  }
  const { mutateProject } = await import('@/local/projects');
  await mutateProject(state.id, (current) => ({
    ...current,
    events: current.events.map((event) =>
      event.id === first.id ? { ...event, claimedAt: Date.now() - 61000 } : event,
    ),
  }));
  const reclaimed = (await waitForEvents(state.id, 'agent:new', 0))[0];
  expect(reclaimed?.id).toBe(first.id);
  await resolveEvent(state.id, first.id, 'Brief applied', 'agent:new');
  expect((await waitForEvents(state.id, 'agent:new', 0))[0]?.kind).toBe('voice');
});

it('queued comments also work with the legacy comment tools without double delivery', async () => {
  const state = await seed();
  await enqueueEvent(state.id, { kind: 'comment', text: 'Legacy-compatible note' });
  const comments = await waitForComments(state.id, 'agent:legacy-client', 0);
  expect(comments).toHaveLength(1);
  expect(await waitForEvents(state.id, 'agent:other-client', 0)).toHaveLength(0);
  const comment = comments[0];
  if (!comment) {
    throw new Error('Missing comment');
  }
  await resolveComment(state.id, comment.id, 'Done', 'agent:legacy-client');
  expect(await waitForEvents(state.id, 'agent:legacy-client', 0)).toHaveLength(0);
});
