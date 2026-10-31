import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import {
  brandRevealSchema,
  CLIP_CATEGORY_IDS,
  CLIP_DEFAULTS,
  CLIP_IDS,
  CLIP_MODULES,
  CLIP_REGISTRY,
  CLIP_SCHEMAS,
  CLIP_TAGS,
  CLIP_THEMES,
  type ClipId,
  categoryLabel,
  EASING_IDS,
  floatingCardsSchema,
  getClipDefaults,
  getClipMeta,
  getClipSchema,
  HEX_COLOR,
  isClipId,
  phoneFanSchema,
  phoneSpinInSchema,
  readControlMeta,
  sceneTransitionSchema,
  zColor,
  zImage,
  zMultiline,
  zSlider,
  zVideo,
} from '@/schemas';

const CATEGORIES: readonly string[] = CLIP_CATEGORY_IDS;

describe('clip registry completeness', () => {
  it('has a schema, defaults and registry entry for every clip id', () => {
    for (const id of CLIP_IDS) {
      expect(CLIP_SCHEMAS[id]).toBeDefined();
      expect(CLIP_DEFAULTS[id]).toBeDefined();
      expect(getClipMeta(id).id).toBe(id);
    }
  });

  it('keeps the registry and the id union in exact sync', () => {
    const registryIds = CLIP_REGISTRY.map((meta) => meta.id).sort();
    expect(registryIds).toEqual([...CLIP_IDS].sort());
    expect(CLIP_REGISTRY).toHaveLength(CLIP_IDS.length);
  });

  it('exposes coherent, positive timing and dimension metadata', () => {
    for (const meta of CLIP_REGISTRY) {
      expect(meta.title.length).toBeGreaterThan(0);
      expect(meta.description.length).toBeGreaterThan(0);
      expect(CATEGORIES).toContain(meta.category);
      expect(meta.source).toBe(`src/compositions/scenes/${meta.category}/${meta.id}.tsx`);
      expect(meta.fps).toBeGreaterThan(0);
      expect(meta.width).toBeGreaterThan(0);
      expect(meta.height).toBeGreaterThan(0);
      expect(meta.durationInFrames).toBeGreaterThan(0);
      expect(meta.posterFrame).toBeGreaterThanOrEqual(0);
      expect(meta.posterFrame).toBeLessThan(meta.durationInFrames);
    }
  });

  it('resolves schemas and defaults through the accessor helpers', () => {
    for (const id of CLIP_IDS) {
      expect(getClipSchema(id)).toBe(CLIP_SCHEMAS[id]);
      expect(getClipDefaults(id)).toBe(CLIP_DEFAULTS[id]);
    }
  });
});

describe('isClipId', () => {
  it('accepts known ids and rejects unknown strings', () => {
    for (const id of CLIP_IDS) {
      expect(isClipId(id)).toBe(true);
    }
    expect(isClipId('not-a-clip')).toBe(false);
    expect(isClipId('')).toBe(false);
  });
});

describe('clip defaults round-trip', () => {
  it('parses every clip default cleanly and returns an equal value', () => {
    for (const id of CLIP_IDS) {
      const result = CLIP_SCHEMAS[id as ClipId].safeParse(CLIP_DEFAULTS[id]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(CLIP_DEFAULTS[id]);
      }
    }
  });
});

describe('clip schema constraints', () => {
  it('rejects a malformed color on brand-reveal', () => {
    const bad = { ...CLIP_DEFAULTS['brand-reveal'], markColor: 'not-a-color' };
    expect(brandRevealSchema.safeParse(bad).success).toBe(false);
  });

  it('enforces the phone-fan fixed length of three phones', () => {
    const base = CLIP_DEFAULTS['phone-fan'];
    expect(phoneFanSchema.safeParse({ ...base, phones: base.phones.slice(0, 2) }).success).toBe(
      false,
    );
    expect(
      phoneFanSchema.safeParse({ ...base, phones: [...base.phones, base.phones[0]] }).success,
    ).toBe(false);
  });

  it('enforces the floating-cards card count bounds', () => {
    const base = CLIP_DEFAULTS['floating-cards'];
    expect(floatingCardsSchema.safeParse({ ...base, cards: [] }).success).toBe(false);
    const five = Array.from({ length: 5 }, () => base.cards[0]);
    expect(floatingCardsSchema.safeParse({ ...base, cards: five }).success).toBe(false);
    expect(floatingCardsSchema.safeParse({ ...base, cards: [base.cards[0]] }).success).toBe(true);
  });

  it('strips unknown properties from a parsed clip object', () => {
    const base = CLIP_DEFAULTS['phone-spin-in'];
    const result = CLIP_SCHEMAS['phone-spin-in'].safeParse({ ...base, surprise: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('surprise');
      expect(result.data).toEqual(base);
    }
  });
});

describe('control metadata', () => {
  it('accepts six and eight digit hex colors and rejects others', () => {
    expect(HEX_COLOR.test('#abcdef')).toBe(true);
    expect(HEX_COLOR.test('#ABCDEF12')).toBe(true);
    expect(HEX_COLOR.test('#fff')).toBe(false);
    expect(HEX_COLOR.test('abcdef')).toBe(false);
    expect(zColor().safeParse('#112233').success).toBe(true);
    expect(zColor().safeParse('red').success).toBe(false);
  });

  it('reads color, textarea and slider hints back from a schema', () => {
    expect(readControlMeta(zColor())).toEqual({ control: 'color' });
    expect(readControlMeta(zMultiline())).toEqual({ control: 'textarea' });
    expect(readControlMeta(zSlider({ min: 0, max: 10, step: 2 }))).toEqual({
      control: 'slider',
      step: 2,
    });
  });

  it('defaults the slider step to one when omitted', () => {
    expect(readControlMeta(zSlider({ min: 0, max: 4 }))).toEqual({ control: 'slider', step: 1 });
  });

  it('returns undefined for a schema without control metadata', () => {
    expect(readControlMeta(z.string())).toBeUndefined();
    expect(readControlMeta(z.number())).toBeUndefined();
  });

  it('keeps slider bounds enforced on the underlying number', () => {
    const slider = zSlider({ min: 1, max: 3 });
    expect(slider.safeParse(2).success).toBe(true);
    expect(slider.safeParse(0).success).toBe(false);
    expect(slider.safeParse(4).success).toBe(false);
  });
});

describe('pluggable module architecture', () => {
  it('registers every module in a seeded category', () => {
    for (const module of CLIP_MODULES) {
      expect(CATEGORIES).toContain(module.meta.category);
      expect(module.id).toBe(module.meta.id);
      expect(CLIP_SCHEMAS[module.id]).toBe(module.schema);
      expect<unknown>(CLIP_DEFAULTS[module.id]).toBe(module.defaults);
    }
  });

  it('exposes at least one clip in each seeded category', () => {
    const present = new Set<string>(CLIP_REGISTRY.map((meta) => meta.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });

  it('places the clips in their intended categories', () => {
    const categoryOf = (id: ClipId) => getClipMeta(id).category;
    expect(categoryOf('typewriter')).toBe('text-reveals');
    expect(categoryOf('word-punch')).toBe('kinetic-type');
    expect(categoryOf('handwritten-note')).toBe('hand-drawn');
    expect(categoryOf('doodle-arrows')).toBe('hand-drawn');
    expect(categoryOf('phone-spin-in')).toBe('phone-reveals');
    expect(categoryOf('phone-wall')).toBe('phone-layouts');
    expect(categoryOf('phone-scroll')).toBe('screen-demos');
    expect(categoryOf('floating-cards')).toBe('overlays');
    expect(categoryOf('brand-reveal')).toBe('brand');
    expect(categoryOf('relief-backdrop')).toBe('backgrounds');
    expect(categoryOf('scene-transition')).toBe('transitions');
    expect(categoryOf('helicopter-unveil')).toBe('ad-reveals');
  });
});

describe('easing enum control', () => {
  it('accepts every easing id and rejects unknown curves', () => {
    const base = CLIP_DEFAULTS['scene-transition'];
    for (const id of EASING_IDS) {
      expect(sceneTransitionSchema.safeParse({ ...base, easing: id }).success).toBe(true);
    }
    expect(sceneTransitionSchema.safeParse({ ...base, easing: 'bounce' }).success).toBe(false);
  });
});

describe('image media control', () => {
  it('tags an image field with image control metadata', () => {
    expect(readControlMeta(zImage())).toEqual({ control: 'image' });
  });

  it('accepts empty, url and data-uri strings but rejects non-strings', () => {
    expect(zImage().safeParse('').success).toBe(true);
    expect(zImage().safeParse('https://example.com/a.png').success).toBe(true);
    expect(zImage().safeParse('data:image/png;base64,AAAA').success).toBe(true);
    expect(zImage().safeParse(42).success).toBe(false);
  });

  it('round-trips a custom phone screen image', () => {
    const base = CLIP_DEFAULTS['phone-spin-in'];
    const populated = {
      ...base,
      phone: { ...base.phone, customScreen: 'https://example.com/screen.png' },
    };
    const result = phoneSpinInSchema.safeParse(populated);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone.customScreen).toBe('https://example.com/screen.png');
    }
  });
});

describe('video media control', () => {
  it('tags a video field with video control metadata', () => {
    expect(readControlMeta(zVideo())).toEqual({ control: 'video' });
  });

  it('accepts empty, url and data-uri strings but rejects non-strings', () => {
    expect(zVideo().safeParse('').success).toBe(true);
    expect(zVideo().safeParse('https://example.com/a.mp4').success).toBe(true);
    expect(zVideo().safeParse('data:video/mp4;base64,AAAA').success).toBe(true);
    expect(zVideo().safeParse(42).success).toBe(false);
  });
});

describe('promo clips', () => {
  const PROMO_IDS: ClipId[] = [
    'grid-stack',
    'lens-orbit',
    'word-field',
    'sticker-stack',
    'phone-spin-in',
    'phone-turnaround',
    'phone-fan',
    'phone-swap',
    'phone-scroll',
    'message-arise',
    'keyboard-typing-cta',
    'laptop-wipe-reveal',
    'website-found-spotlight',
    'phone-wall',
    'phone-pair',
    'floating-cards',
    'brand-reveal',
    'cta-end-card',
    'puzzle-success',
    'scene-transition',
    'doodle-arrows',
    'handwritten-note',
    'relief-backdrop',
    'app-icon-reveal',
    'phone-pedestal',
    'phone-flat-lay',
    'number-counter',
    'typewriter',
    'word-build',
    'word-punch',
    'hanging-words',
    'scribble-caption',
    'echo-stack',
    'outline-marquee',
    'letter-flip',
    'printer-pages',
    'going-live-teaser',
    'helicopter-unveil',
    'problem-strikeout',
    'neon-sign-flicker',
    'spill-reveal',
    'crumpled-paper-reveal',
    'battery-charge-success',
    'billboard-reader',
    'incoming-call-teaser',
    'burning-paper-reveal',
    'spider-web-services',
    'word-picker',
    'pill-fan',
    'menu-stack',
    'heading-list',
    'year-dial',
    'mind-map',
    'color-pills',
    'skill-wheel',
    'product-cards',
    'list-pickers-reel',
    'chalk-badge',
    'chalk-badge-grid',
    'chalk-title',
    'chalk-badges-reel',
    'magnifier-caption',
    'dot-wordmark-reveal',
    'charge-compare',
    'chunky-type-stack',
    'branding-is-ticker',
    'domino-words',
    'scroller-callout',
    'scroller-wall',
    'anniversary-kinetic',
    'coming-soon-flips',
  ];

  it('validates every promo default against its schema', () => {
    for (const id of PROMO_IDS) {
      expect(getClipSchema(id).safeParse(getClipDefaults(id)).success).toBe(true);
    }
  });

  it('rejects an unknown phone screen and finish', () => {
    const defaults = getClipDefaults('phone-spin-in');
    const schema = getClipSchema('phone-spin-in');
    expect(
      schema.safeParse({ ...defaults, phone: { ...defaults.phone, screen: 'nope' } }).success,
    ).toBe(false);
    expect(
      schema.safeParse({ ...defaults, phone: { ...defaults.phone, finish: 'gold' } }).success,
    ).toBe(false);
  });

  it('bounds the doodle arrows and rejects unknown shapes', () => {
    const defaults = getClipDefaults('doodle-arrows');
    const schema = getClipSchema('doodle-arrows');
    const arrow = defaults.arrows[0];
    expect(schema.safeParse({ ...defaults, arrows: [] }).success).toBe(false);
    expect(schema.safeParse({ ...defaults, arrows: new Array(15).fill(arrow) }).success).toBe(
      false,
    );
    expect(schema.safeParse({ ...defaults, arrows: [{ ...arrow, shape: 'star' }] }).success).toBe(
      false,
    );
  });

  it('rejects an unknown handwriting font and paper pattern', () => {
    const defaults = getClipDefaults('handwritten-note');
    const schema = getClipSchema('handwritten-note');
    expect(schema.safeParse({ ...defaults, font: 'comic' }).success).toBe(false);
    expect(
      schema.safeParse({ ...defaults, look: { ...defaults.look, paper: 'dotted' } }).success,
    ).toBe(false);
  });
});

describe('clip taxonomy', () => {
  it('tags every clip from the shared vocabulary without duplicates', () => {
    const vocabulary: readonly string[] = CLIP_TAGS;
    for (const meta of CLIP_REGISTRY) {
      expect(meta.tags.length).toBeGreaterThan(0);
      expect(new Set(meta.tags).size).toBe(meta.tags.length);
      for (const tag of meta.tags) {
        expect(vocabulary).toContain(tag);
      }
    }
  });

  it('gives every clip a known theme', () => {
    const themes: readonly string[] = CLIP_THEMES;
    for (const meta of CLIP_REGISTRY) {
      expect(themes).toContain(meta.theme);
    }
  });

  it('labels categories for display', () => {
    expect(categoryLabel('phone-layouts')).toBe('Multi-phone Layouts');
    expect(categoryLabel('hand-drawn')).toBe('Hand-drawn');
  });
});
