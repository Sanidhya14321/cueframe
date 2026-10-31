import { describe, expect, it } from 'bun:test';
import { searchClips } from '@/mcp/clip-search';
import { CLIP_IDS, CLIP_LABELS, getClipMeta } from '@/schemas';

describe('clip labels', () => {
  it('labels every clip and nothing else', () => {
    expect(Object.keys(CLIP_LABELS).sort()).toEqual([...CLIP_IDS].sort());
  });

  it('keeps every beat inside its clip and in time order', () => {
    for (const id of CLIP_IDS) {
      const meta = getClipMeta(id);
      const seconds = meta.durationInFrames / meta.fps;
      const times = CLIP_LABELS[id]?.beats.map((beat) => beat.at) ?? [];
      expect({ id, inside: times.every((at) => at <= seconds + 0.05) }).toEqual({
        id,
        inside: true,
      });
      expect({ id, times }).toEqual({ id, times: [...times].sort((a, b) => a - b) });
    }
  });
});

describe('labelled search', () => {
  const top = (query: string, count = 5) => searchClips(query, {}, count).map((hit) => hit.id);

  it('finds clips by what is on screen, not just their titles', () => {
    expect(top('download app store buttons end card')).toContain('cta-end-card');
    expect(top('crossing out problems in a notebook')).toContain('problem-strikeout');
    expect(top('3d phone turns around to show an analytics dashboard')).toContain(
      'phone-turnaround',
    );
  });

  it('filters by the role a clip plays in a video', () => {
    const closers = searchClips('', { role: 'closer' }, 100);
    expect(closers.length).toBeGreaterThan(0);
    expect(closers.every((hit) => hit.roles.includes('closer'))).toBe(true);
  });
});
