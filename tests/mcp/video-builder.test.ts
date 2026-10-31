import { describe, expect, it } from 'bun:test';
import { checkMedia } from '@/agent/media';
import { createVideoProject, mergeProps, placeClip } from '@/mcp/video-builder';
import { CLIP_DEFAULTS, getClipMeta } from '@/schemas';

describe('mergeProps', () => {
  it('merges nested objects and replaces everything else', () => {
    expect(
      mergeProps(
        { a: 1, look: { bg: '#000', ink: '#fff' }, list: [1] },
        { look: { bg: '#111' }, list: [2] },
      ),
    ).toEqual({
      a: 1,
      look: { bg: '#111', ink: '#fff' },
      list: [2],
    });
  });
});

describe('createVideoProject', () => {
  it('plays clips back to back and sizes the video to the first clip', () => {
    const project = createVideoProject({
      clips: [{ clipId: 'brand-reveal', props: { brandName: 'Acme' } }, { clipId: 'word-build' }],
    });
    const meta = getClipMeta('brand-reveal');
    const [first, second] = project.tracks[0]?.elements ?? [];
    expect(project.width).toBe(meta.width);
    expect(first).toMatchObject({ clipId: 'brand-reveal', from: 0, props: { brandName: 'Acme' } });
    expect(first).toMatchObject({ props: { tagline: CLIP_DEFAULTS['brand-reveal'].tagline } });
    expect(second?.from).toBe(meta.durationInFrames);
    expect(project.durationInFrames).toBe(
      meta.durationInFrames + getClipMeta('word-build').durationInFrames,
    );
    expect(checkMedia('clip', project).ok).toBe(true);
  });

  it('uses the requested orientation and an empty first track', () => {
    const project = createVideoProject({ orientation: 'portrait' });
    expect([project.width, project.height]).toEqual([1080, 1920]);
    expect(project.tracks).toHaveLength(1);
    expect(project.durationInFrames).toBe(30);
  });
});

describe('placeClip', () => {
  it('layers a clip on a new track at a given frame and grows the video', () => {
    const base = createVideoProject({ clips: [{ clipId: 'brand-reveal' }] });
    const placed = placeClip(base, { clipId: 'word-build', from: 200, track: 1 });
    expect(placed.tracks).toHaveLength(2);
    expect(placed.tracks[1]?.elements[0]?.from).toBe(200);
    expect(placed.durationInFrames).toBe(200 + getClipMeta('word-build').durationInFrames);
  });
});
