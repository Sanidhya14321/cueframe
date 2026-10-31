import { describe, expect, it } from 'bun:test';
import {
  DEFAULT_FILTERS,
  facetCounts,
  filterClips,
  formatDuration,
  type GalleryMeta,
  hasActiveFilters,
  parseFilters,
  serializeFilters,
} from '@/lib/gallery-filters';
import { videoMeta } from '@/lib/video-meta';
import { CLIP_REGISTRY } from '@/schemas';

const items = CLIP_REGISTRY.map((meta) => ({ meta: videoMeta(meta) }));
const ids = (list: { meta: GalleryMeta }[]) => list.map((item) => item.meta.id);

describe('gallery filters', () => {
  it('round-trips filters through the URL and drops defaults', () => {
    const filters = {
      query: 'phone',
      kind: 'video' as const,
      category: 'phone-layouts' as const,
      tags: ['3d' as const, 'grid' as const],
      theme: 'light' as const,
      sort: 'longest' as const,
    };
    const query = serializeFilters(filters);
    expect(parseFilters(new URLSearchParams(query.slice(1)))).toEqual(filters);
    expect(serializeFilters(DEFAULT_FILTERS)).toBe('');
  });

  it('filters by kind and sorts posters and videos together by recency', () => {
    const poster: GalleryMeta = {
      id: 'hiring-spotlight',
      kind: 'poster',
      title: 'Hiring Spotlight',
      description: 'Recruitment posts',
      category: 'social-posts',
      tags: ['hiring'],
      theme: 'dark',
      durationInFrames: 0,
      fps: 30,
      updatedAt: '2999-01-01T00:00:00.000Z',
    };
    const mixed = [...items, { meta: poster }];
    expect(ids(filterClips(mixed, { ...DEFAULT_FILTERS, kind: 'poster' }))).toEqual([
      'hiring-spotlight',
    ]);
    expect(filterClips(mixed, { ...DEFAULT_FILTERS, kind: 'video' })).toHaveLength(items.length);
    expect(ids(filterClips(mixed, { ...DEFAULT_FILTERS, sort: 'updated' }))[0]).toBe(
      'hiring-spotlight',
    );
    expect(ids(filterClips(mixed, DEFAULT_FILTERS))[0]).toBe('hiring-spotlight');
    const stale = {
      meta: { ...poster, id: 'stale-poster', updatedAt: '2000-01-01T00:00:00.000Z' },
    };
    expect(ids(filterClips([stale, ...mixed], DEFAULT_FILTERS)).at(-1)).toBe('stale-poster');
    expect(ids(filterClips(mixed, { ...DEFAULT_FILTERS, query: 'hiring' }))).toContain(
      'hiring-spotlight',
    );
    const kinds = facetCounts(mixed, DEFAULT_FILTERS, 'kind', (meta) => [meta.kind]);
    expect(kinds.get('poster')).toBe(1);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, kind: 'poster' })).toBe(true);
  });

  it('ignores unknown values in the URL', () => {
    const parsed = parseFilters(
      new URLSearchParams({ category: 'nope', tags: '3d,bogus', theme: 'sepia', sort: 'x' }),
    );
    expect(parsed.category).toBe('all');
    expect(parsed.tags).toEqual(['3d']);
    expect(parsed.theme).toBe('all');
    expect(parsed.sort).toBe('relevance');
  });

  const search = (query: string) => ids(filterClips(items, { ...DEFAULT_FILTERS, query }));

  it('requires every search token across title, tags, category and description', () => {
    expect(search('PHONE grid')).toEqual(['phone-wall']);
    expect(search('3d multi-phone layouts')).toContain('phone-wall');
    expect(search('phone chart')).toEqual([]);
  });

  it('forgives typos, completes prefixes and knows category synonyms', () => {
    expect(search('typewritter')).toEqual(['typewriter']);
    expect(search('notifcation')).toEqual(['floating-cards', 'message-arise']);
    expect(search('scrol')[0]).toBe('phone-scroll');
    expect(search('hand drawn')).toEqual([
      'handwritten-note',
      'chalk-badge',
      'chalk-title',
      'scribble-caption',
      'chalk-badge-grid',
      'doodle-arrows',
      'chalk-badges-reel',
    ]);
    const phones = CLIP_REGISTRY.filter((meta) => meta.tags.includes('phone')).map(
      (meta) => meta.id,
    );
    expect(search('iphone').sort()).toEqual([...phones].sort());
  });

  it('ranks title matches above tag and description matches', () => {
    expect(search('flip')).toEqual([
      'letter-flip',
      'word-flip',
      'coming-soon-flips',
      'app-icon-reveal',
    ]);
    expect(search('counter')[0]).toBe('number-counter');
  });

  it('puts the most recently updated clips first when there is no search to rank by', () => {
    const newestFirst = (list: { meta: GalleryMeta }[]) => list.map((item) => item.meta.updatedAt);
    const order = newestFirst(filterClips(items, DEFAULT_FILTERS));
    expect(order).toEqual([...order].sort((left, right) => right.localeCompare(left)));
    expect(newestFirst(filterClips(items, { ...DEFAULT_FILTERS, sort: 'updated' }))).toEqual(order);
    const ranked = filterClips(items, { ...DEFAULT_FILTERS, query: 'phone', sort: 'updated' });
    const rankedOrder = newestFirst(ranked);
    expect(rankedOrder).toEqual([...rankedOrder].sort((left, right) => right.localeCompare(left)));
  });

  it('filters by category, every selected tag and theme together', () => {
    const result = filterClips(items, {
      ...DEFAULT_FILTERS,
      category: 'phone-layouts',
      tags: ['3d', 'phone'],
      theme: 'dark',
    });
    expect(ids(result)).toEqual(['phone-pair']);
  });

  it('sorts by duration and by name', () => {
    const shortest = filterClips(items, { ...DEFAULT_FILTERS, sort: 'shortest' });
    const seconds = shortest.map((item) => item.meta.durationInFrames / item.meta.fps);
    expect(seconds).toEqual([...seconds].sort((left, right) => left - right));
    const byName = filterClips(items, { ...DEFAULT_FILTERS, sort: 'name-desc' }).map(
      (item) => item.meta.title,
    );
    expect(byName).toEqual([...byName].sort((left, right) => right.localeCompare(left)));
  });

  it('counts each facet against the other active filters', () => {
    const filters = { ...DEFAULT_FILTERS, category: 'phone-layouts' as const };
    const categories = facetCounts(items, filters, 'category', (meta) => [meta.category]);
    expect(categories.get('kinetic-type')).toBeGreaterThan(0);
    const themes = facetCounts(items, filters, 'theme', (meta) => [meta.theme]);
    const darkPhoneLayouts = CLIP_REGISTRY.filter(
      (meta) => meta.category === 'phone-layouts' && meta.theme === 'dark',
    ).length;
    expect(darkPhoneLayouts).toBeGreaterThan(0);
    expect(themes.get('dark')).toBe(darkPhoneLayouts);
  });

  it('reports active filters and formats durations', () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, query: ' x ' })).toBe(true);
    const meta = CLIP_REGISTRY.find((entry) => entry.id === 'scene-transition');
    expect(meta === undefined ? '' : formatDuration(videoMeta(meta))).toBe('1.3s');
  });
});
