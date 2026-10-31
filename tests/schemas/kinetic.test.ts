import { describe, expect, it } from 'bun:test';
import { type ClipId, getClipDefaults, getClipMeta, getClipSchema, kineticLook } from '@/schemas';

describe('kinetic type clips', () => {
  const KINETIC_IDS: ClipId[] = [
    'number-counter',
    'typewriter',
    'word-build',
    'word-punch',
    'scribble-caption',
    'echo-stack',
    'outline-marquee',
    'letter-flip',
  ];
  const TYPE_CATEGORIES: readonly string[] = ['kinetic-type', 'text-reveals', 'hand-drawn'];

  it('ships every kinetic clip as dark type with a backdrop toggle and live grain', () => {
    for (const id of KINETIC_IDS) {
      const meta = getClipMeta(id);
      expect(TYPE_CATEGORIES).toContain(meta.category);
      expect(meta.theme).toBe('dark');
      expect(meta.tags).toContain('text');
      const defaults = getClipDefaults(id) as {
        look: { showBackdrop: boolean; liveGrain: boolean };
      };
      expect(defaults.look.showBackdrop).toBe(true);
      expect(defaults.look.liveGrain).toBe(true);
    }
  });

  it('gives the kinetic look one accent', () => {
    expect(kineticLook('#123456').accent).toBe('#123456');
  });

  it('rejects unknown entries, intros and outros', () => {
    const build = getClipDefaults('word-build');
    expect(getClipSchema('word-build').safeParse({ ...build, entry: 'spin' }).success).toBe(false);
    const writer = getClipDefaults('typewriter');
    expect(getClipSchema('typewriter').safeParse({ ...writer, outro: 'explode' }).success).toBe(
      false,
    );
    expect(getClipSchema('typewriter').safeParse({ ...writer, intro: 'typed' }).success).toBe(true);
  });
});

describe('kinetic effect clips', () => {
  it('validates the film overlay and bounds its controls', () => {
    expect(getClipSchema('film-dust').safeParse(getClipDefaults('film-dust')).success).toBe(true);
    expect(getClipMeta('film-dust').category).toBe('overlays');
    const film = getClipDefaults('film-dust');
    expect(getClipSchema('film-dust').safeParse({ ...film, dust: 2 }).success).toBe(false);
  });
});
