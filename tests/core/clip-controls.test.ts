import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { auditClipControls, auditClipStandard, humanizeKey, resolveClipControls } from '@/core';
import { CLIP_MODULES, zColor, zSlider } from '@/schemas';

const schema = z.object({
  title: z.string(),
  size: zSlider({ min: 10, max: 200 }),
  gap: zSlider({ min: 0, max: 40 }),
  look: z.object({ ink: zColor(), accent: zColor(), paper: z.enum(['plain', 'ruled']) }),
});

describe('humanizeKey', () => {
  it('turns camel, kebab and numbered keys into sentence labels', () => {
    expect(humanizeKey('enterFrames')).toBe('Enter frames');
    expect(humanizeKey('push-left')).toBe('Push left');
    expect(humanizeKey('image1')).toBe('Image 1');
    expect(humanizeKey('insetX')).toBe('Inset x');
  });
});

describe('resolveClipControls', () => {
  it('resolves labels, hints and link targets per section', () => {
    const [section] = resolveClipControls(schema, {
      sections: [
        {
          title: 'Text',
          fields: [
            'title',
            { path: 'size', label: 'Text size', hint: 'In pixels' },
            { link: ['look.ink', 'look.accent'], label: 'Text color' },
          ],
        },
      ],
    });
    expect(section?.title).toBe('Text');
    expect(section?.more).toEqual([]);
    expect(section?.fields.map((entry) => entry.descriptor.label)).toEqual([
      'Title',
      'Text size',
      'Text color',
    ]);
    expect(section?.fields[1]?.hint).toBe('In pixels');
    expect(section?.fields[2]?.targets).toEqual([
      ['look', 'ink'],
      ['look', 'accent'],
    ]);
  });

  it('rejects unknown paths and links between different control shapes', () => {
    expect(() =>
      resolveClipControls(schema, { sections: [{ title: 'A', fields: ['missing'] }] }),
    ).toThrow('Unknown control path "missing"');
    expect(() =>
      resolveClipControls(schema, {
        sections: [{ title: 'A', fields: [{ link: ['size', 'gap'], label: 'Both' }] }],
      }),
    ).toThrow('Cannot link');
  });
});

describe('auditClipControls', () => {
  it('reports missing, repeated and unknown paths and repeated section titles', () => {
    expect(
      auditClipControls(schema, {
        sections: [
          {
            title: 'A',
            fields: ['title', 'title', { link: ['look.ink', 'look.accent'], label: 'Ink' }],
          },
          { title: 'B', fields: ['nope'], more: ['look.ink'] },
          { title: 'A', fields: [] },
        ],
        hidden: ['look.paper'],
      }),
    ).toEqual({
      missing: ['size', 'gap', 'look.accent'],
      repeated: ['title'],
      unknown: ['nope'],
      repeatedTitles: ['A'],
    });
  });
});

describe('auditClipStandard', () => {
  it('requires a near-top Colors section of colour roles and a short first glance', () => {
    expect(
      auditClipStandard(schema, {
        sections: [
          { title: 'Text', fields: ['title', 'size', 'gap'] },
          { title: 'Colors', fields: [{ path: 'look.ink', label: 'Ink' }, 'size'] },
        ],
      }),
    ).toEqual([
      'Colors role "Ink" is not one of Primary color, Secondary color, Accent color, Text color, Background color, Surface color',
      'Colors role "size" is not one of Primary color, Secondary color, Accent color, Text color, Background color, Surface color',
      'Colors needs a Primary color role',
      'Colors role field "size" is not a color',
    ]);
    expect(
      auditClipStandard(schema, {
        sections: [
          {
            title: 'Colors',
            fields: [
              { link: ['look.ink', 'look.accent'], label: 'Primary color' },
              { path: 'look.accent', label: 'Accent color' },
            ],
          },
        ],
      }),
    ).toEqual([]);
    expect(auditClipStandard(schema, { sections: [{ title: 'A', fields: [] }] })).toEqual([
      'needs a "Colors" section as the first or second section',
    ]);
  });
});

describe('clip control layouts', () => {
  for (const module of CLIP_MODULES) {
    it(`${module.id} covers every prop exactly once and resolves`, () => {
      expect(auditClipControls(module.schema, module.controls)).toEqual({
        missing: [],
        repeated: [],
        unknown: [],
        repeatedTitles: [],
      });
      expect(() => resolveClipControls(module.schema, module.controls)).not.toThrow();
    });

    it(`${module.id} follows the standard Colors roles and first-glance limit`, () => {
      expect(auditClipStandard(module.schema, module.controls)).toEqual([]);
    });
  }
});
