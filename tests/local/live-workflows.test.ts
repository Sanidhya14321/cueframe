import { beforeEach, describe, expect, it } from 'bun:test';
import { buildFromBeatsheet } from '@/agent/beatsheet';
import { projectTools } from '@/agent/project-tools';
import { seedProjectForClip } from '@/core';
import { addComment, resolveComment, waitForComments } from '@/local/comments';
import {
  commitAction,
  createProject,
  readProject,
  setAgentStatus,
  undoProject,
} from '@/local/projects';
import { applyTranscript, tightenWords } from '@/local/transcribe';
import { addVoiceover } from '@/local/voice';
import { createTrack, createVideoElement } from '@/project';
import { resetTestHome } from './test-home';

beforeEach(resetTestHome);
describe('live editor workflows', () => {
  it('adds a library clip to a project with no tracks', async () => {
    const seed = seedProjectForClip('typewriter');
    const state = await createProject({ title: 'Empty', project: { ...seed, tracks: [] } });
    await projectTools.add_item.invoke(
      { projectId: state.id, clipId: 'typewriter', start: 12, confirmed: true },
      { origin: 'http://127.0.0.1', actor: 'browser:test' },
    );
    const elements = (await readProject(state.id)).project.tracks[0]?.elements;
    expect(elements?.map((item) => item.from)).toEqual([12]);
  });
  it('refuses all browser writes to locked items, including reset and undo', async () => {
    const state = await createProject({
      title: 'Locks',
      project: seedProjectForClip('typewriter'),
    });
    const item = state.project.tracks[0]?.elements[0];
    if (!item) {
      throw new Error('Missing seed');
    }
    await setAgentStatus(state.id, 'agent:mcp', {
      status: 'working',
      label: 'Fix the hook',
      itemIds: [item.id],
    });
    const action = { type: 'update-props' as const, id: item.id, props: { text: 'Agent text' } };
    expect(commitAction(state.id, action, { actor: 'browser:one' })).rejects.toThrow('locked');
    await commitAction(state.id, action, { actor: 'agent:mcp' });
    expect(
      commitAction(
        state.id,
        { type: 'replace-project', project: state.project },
        { actor: 'browser:one' },
      ),
    ).rejects.toThrow('locked');
    expect(undoProject(state.id, 'browser:one', false, true)).rejects.toThrow('locked');
    await setAgentStatus(state.id, 'agent:mcp', { status: 'idle', label: 'Done', itemIds: [] });
    expect((await undoProject(state.id, 'browser:one', false, true)).project).toEqual(
      state.project,
    );
  });
  it('delivers a pinned comment and confines agent edits to its item until resolved', async () => {
    const state = await createProject({
      title: 'Comments',
      project: seedProjectForClip('typewriter'),
    });
    const id = state.project.tracks[0]?.elements[0]?.id ?? '';
    await addComment(state.id, { text: 'Make this orange', frame: 10, itemId: id });
    const comments = await waitForComments(state.id, 'agent:mcp', 0);
    expect(comments).toHaveLength(1);
    expect((await readProject(state.id)).comments[0]?.status).toBe('in-progress');
    await commitAction(
      state.id,
      { type: 'update-props', id, props: { text: 'Only this item' } },
      { actor: 'agent:mcp' },
    );
    expect(
      commitAction(
        state.id,
        { type: 'patch', operations: [{ op: 'replace', path: '/width', value: 720 }] },
        { actor: 'agent:mcp' },
      ),
    ).rejects.toThrow('only its item');
    await resolveComment(state.id, comments[0]?.id ?? '', 'Updated this item only.', 'agent:mcp');
    expect((await readProject(state.id)).comments[0]?.status).toBe('done');
  });
  it('builds a 30-second beat sheet with independently editable clips and sound', async () => {
    const track = createTrack('Base');
    const state = await createProject({
      title: 'Beats',
      project: {
        fps: 30,
        width: 1920,
        height: 1080,
        durationInFrames: 1,
        background: '#111111',
        tracks: [track],
      },
    });
    await buildFromBeatsheet(
      {
        projectId: state.id,
        aspect: 'landscape',
        targetSeconds: 30,
        segments: Array.from({ length: 16 }, (_, index) => ({
          role:
            index === 0 ? ('hook' as const) : index === 15 ? ('cta' as const) : ('point' as const),
          text: `Beat ${index + 1}`,
          energy: 3,
        })),
      },
      'agent:builder',
    );
    const saved = await readProject(state.id);
    const clips = saved.project.tracks
      .flatMap((row) => row.elements)
      .filter((item) => item.type === 'composition');
    expect(clips).toHaveLength(16);
    expect(clips.at(-1)?.from ?? 0).toBeLessThan(900);
    expect((clips.at(-1)?.from ?? 0) + (clips.at(-1)?.durationInFrames ?? 0)).toBe(900);
    expect(
      saved.project.tracks.flatMap((row) => row.elements).filter((item) => item.type === 'audio'),
    ).toHaveLength(32);
    expect(saved.agent?.status).toBe('idle');
  }, 20000);
  it('cuts fillers and pauses while retaining source offsets, captions and emphasis', async () => {
    const words = [
      { text: 'Hello', startMs: 0, endMs: 400 },
      { text: 'um', startMs: 450, endMs: 650 },
      { text: 'world', startMs: 1500, endMs: 2100 },
    ];
    expect(tightenWords(words)).toHaveLength(2);
    const track = createTrack('Talking');
    const video = createVideoElement({ src: '/video.mp4', durationInFrames: 120 });
    track.elements.push(video);
    const state = await createProject({
      title: 'Speech',
      project: {
        fps: 30,
        width: 1080,
        height: 1920,
        durationInFrames: 120,
        background: '#111111',
        tracks: [track],
      },
    });
    const result = await applyTranscript(state.id, video.id, words, ['world'], 'agent:whisper');
    expect(result.segments).toBe(2);
    const saved = await readProject(state.id);
    const items = saved.project.tracks.flatMap((row) => row.elements);
    const caption = items.find((item) => item.type === 'captions');
    expect(caption?.type === 'captions' && caption.words.map((word) => word.text)).toEqual([
      'Hello',
      'world',
    ]);
    expect(items.filter((item) => item.type === 'video').at(-1)).toMatchObject({
      sourceFrom: 44,
      punchIns: [{ scale: 1.15 }],
    });
  });
  it('skips voice generation clearly when no key is saved', async () => {
    const state = await createProject({
      title: 'Voice',
      project: seedProjectForClip('typewriter'),
    });
    expect(await addVoiceover({ projectId: state.id }, () => Promise.resolve())).toMatchObject({
      skipped: true,
    });
  });
});

it('uses the Fish request contract, caches identical lines and ducks music', async () => {
  const { saveSettings } = await import('@/local/settings');
  const { synthesizeSound } = await import('@/local/audio');
  const { createCompositionElement, identityTransform } = await import('@/project');
  const { getClipDefaults } = await import('@/schemas');
  await saveSettings({ fishAudioKey: 'fish-test-key' });
  const clips = createTrack('Clips');
  const first = createCompositionElement('typewriter', getClipDefaults('typewriter'), {
    from: 0,
    durationInFrames: 90,
    voiceLine: 'Hello world',
  });
  const second = createCompositionElement('typewriter', getClipDefaults('typewriter'), {
    from: 90,
    durationInFrames: 90,
    voiceLine: 'Hello world',
  });
  clips.elements.push(first, second);
  const music = createTrack('Music');
  music.elements.push({
    type: 'audio',
    id: 'music-test',
    src: '/bed.wav',
    from: 0,
    durationInFrames: 180,
    volume: 0.3,
    role: 'music',
    transform: identityTransform(),
  });
  const state = await createProject({
    title: 'Voice contract',
    project: {
      fps: 30,
      width: 1920,
      height: 1080,
      durationInFrames: 180,
      background: '#111111',
      tracks: [clips, music],
    },
  });
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = Object.assign(
    (url: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
      calls += 1;
      expect(String(url)).toBe('https://api.fish.audio/v1/tts');
      expect(init?.redirect).toBe('error');
      expect(new Headers(init?.headers).get('authorization')).toBe('Bearer fish-test-key');
      expect(JSON.parse(String(init?.body))).toMatchObject({
        text: 'Hello world',
        reference_id: 'demo-voice',
        format: 'wav',
      });
      return Promise.resolve(
        new Response(new Uint8Array(synthesizeSound(0.3, 128, 'bed')), {
          headers: { 'content-type': 'audio/wav' },
        }),
      );
    },
    { preconnect: original.preconnect },
  );
  try {
    expect(
      await addVoiceover({ projectId: state.id, referenceId: 'demo-voice' }, () =>
        Promise.resolve(),
      ),
    ).toMatchObject({ voices: 2 });
    expect(calls).toBe(1);
    const saved = await readProject(state.id);
    const all = saved.project.tracks.flatMap((row) => row.elements);
    expect(all.filter((item) => item.type === 'audio' && item.role === 'voice')).toHaveLength(2);
    const bed = all.find((item) => item.id === 'music-test');
    expect(bed?.type === 'audio' && bed.duckRegions).toHaveLength(2);
  } finally {
    globalThis.fetch = original;
  }
});
