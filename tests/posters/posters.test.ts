import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { designSchema, isDesignIcon, isKnownFont } from '@/design';
import {
  auditPosterControls,
  findPoster,
  POSTER_META,
  POSTER_PHOTOS,
  POSTER_UPDATED_AT,
  POSTERS,
  posterPreviewPath,
} from '@/posters';
import { publicDir } from '@/render/paths';
import { CLIP_TAGS, POSTER_CATEGORIES, POSTER_TAGS } from '@/schemas';

const designs = POSTERS.map((poster) => ({ meta: poster.meta, design: poster.build() }));
const elements = designs.flatMap(({ meta, design }) =>
  design.elements.map((element) => ({ pack: meta.id, element })),
);
const packIds = [...new Set(POSTER_META.map((meta) => meta.packId))];

describe('posters', () => {
  it('have unique ids and known categories and tags', () => {
    const ids = POSTER_META.map((meta) => meta.id);
    expect(new Set(ids).size).toBe(ids.length);
    const categories: readonly string[] = POSTER_CATEGORIES.map((category) => category.id);
    const tags: readonly string[] = [...POSTER_TAGS, ...CLIP_TAGS];
    for (const meta of POSTER_META) {
      expect(categories).toContain(meta.category);
      expect(meta.tags.length).toBeGreaterThan(0);
      for (const tag of meta.tags) {
        expect(tags).toContain(tag);
      }
    }
  });

  it('build valid single designs that match their metadata', () => {
    for (const { meta, design } of designs) {
      expect(designSchema.safeParse(design).success).toBe(true);
      expect(design.elements.length).toBeGreaterThan(0);
      expect(design).toMatchObject({ id: meta.id, width: meta.width, height: meta.height });
      expect(meta.id.startsWith(`${meta.packId}-`)).toBe(true);
      expect(findPoster(meta.id)?.meta).toBe(meta);
    }
  });

  it('never repeat the same design within a pack', () => {
    const signature = ({ design }: (typeof designs)[number]) =>
      JSON.stringify([
        design.width,
        design.height,
        design.background,
        design.elements.map(({ id: _id, groupId: _groupId, ...rest }) => rest),
      ]);
    const keys = designs.map((entry) => `${entry.meta.packId}:${signature(entry)}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('give every poster its own complete theme controls', () => {
    const problems = designs.flatMap(({ meta, design }) =>
      auditPosterControls(design).map((problem) => `${meta.id}: ${problem}`),
    );
    expect(problems).toEqual([]);
  });

  it('merge repeated decorative shapes into single pattern elements', () => {
    const decorative = new Set(['rect', 'ellipse', 'polygon', 'star']);
    const leftovers = designs.flatMap(({ meta, design }) => {
      const runs: string[] = [];
      let streak = 0;
      design.elements.forEach((element, index) => {
        const previous = design.elements[index - 1];
        const repeats =
          previous !== undefined &&
          decorative.has(element.type) &&
          previous.type === element.type &&
          previous.name === element.name &&
          'fill' in element &&
          'fill' in previous &&
          typeof element.fill === 'string' &&
          element.fill === previous.fill &&
          element.strokeWidth === 0 &&
          element.rotation === 0 &&
          element.shadow === undefined &&
          element.opacity === 1;
        streak = repeats ? streak + 1 : 0;
        if (streak === 2) {
          runs.push(`${meta.id}: ${element.name}`);
        }
      });
      return runs;
    });
    expect(leftovers).toEqual([]);
  });

  it('only use bundled fonts, icons and photos', () => {
    const photoSources = new Set<string>(Object.values(POSTER_PHOTOS).map((photo) => photo.src));
    const problems = elements.flatMap(({ pack, element }) => {
      if (element.type === 'text' && !isKnownFont(element.fontFamily)) {
        return [`${pack}: font ${element.fontFamily}`];
      }
      if (element.type === 'icon' && !isDesignIcon(element.icon)) {
        return [`${pack}: icon ${element.icon}`];
      }
      if (element.type === 'image' && element.src !== '' && !photoSources.has(element.src)) {
        return [`${pack}: photo ${element.src}`];
      }
      return [];
    });
    expect(problems).toEqual([]);
  });

  it('records exactly one updated-at timestamp per pack', () => {
    expect(Object.keys(POSTER_UPDATED_AT).sort()).toEqual([...packIds].sort());
  });

  it('ships every bundled photo and a preview for every design', () => {
    const missing = [
      ...Object.values(POSTER_PHOTOS).map((photo) => photo.src),
      ...POSTER_META.map(posterPreviewPath),
    ].filter((path) => !existsSync(join(publicDir, path)));
    expect(missing).toEqual([]);
  });
});
