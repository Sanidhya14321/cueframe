import { describe, expect, it } from 'bun:test';
import { orientationOf, searchClips } from '@/mcp/clip-search';
import { CLIP_REGISTRY } from '@/schemas';

describe('searchClips', () => {
  it('ranks a title match first', () => {
    expect(searchClips('brand reveal')[0]?.id).toBe('brand-reveal');
  });

  it('browses every clip with an empty query and respects the limit', () => {
    expect(searchClips('', {}, 500)).toHaveLength(CLIP_REGISTRY.length);
    expect(searchClips('', {}, 3)).toHaveLength(3);
  });

  it('filters by category, theme and orientation', () => {
    const hits = searchClips('', { category: 'brand', orientation: 'landscape' }, 100);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((hit) => hit.category === 'brand' && hit.orientation === 'landscape')).toBe(
      true,
    );
    const dark = searchClips('', { theme: 'dark' }, 100);
    expect(dark.every((hit) => hit.theme === 'dark')).toBe(true);
  });

  it('reports size, length and a summary for each hit', () => {
    const [hit] = searchClips('brand reveal', {}, 1);
    expect(hit).toMatchObject({ size: '1920x1080', seconds: 4 });
    expect(hit?.summary.length).toBeGreaterThan(10);
  });
});

describe('orientationOf', () => {
  it('names the shape of a frame', () => {
    expect(orientationOf({ width: 1920, height: 1080 })).toBe('landscape');
    expect(orientationOf({ width: 1080, height: 1920 })).toBe('portrait');
    expect(orientationOf({ width: 1080, height: 1080 })).toBe('square');
  });
});
