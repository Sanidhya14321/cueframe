import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { type ControlDescriptor, describeSchema } from '@/core';
import { CLIP_SCHEMAS, EASING_IDS, zColor, zImage, zMultiline, zSlider, zVideo } from '@/schemas';

const byPath = (controls: ControlDescriptor[], key: string): ControlDescriptor => {
  const found = controls.find((control) => control.path[0] === key);
  if (found === undefined) {
    throw new Error(`no control for ${key}`);
  }
  return found;
};

describe('describeSchema control kinds', () => {
  it('maps a plain string to a single-line text control with no max length', () => {
    const [control] = describeSchema(z.object({ title: z.string() }));
    expect(control).toEqual({
      kind: 'text',
      path: ['title'],
      label: 'title',
      format: 'line',
      maxLength: null,
    });
  });

  it('reads a max length check into the text control', () => {
    const [control] = describeSchema(z.object({ title: z.string().max(24) }));
    expect(control).toMatchObject({ kind: 'text', maxLength: 24 });
  });

  it('treats a textarea-tagged string as multiline', () => {
    const [control] = describeSchema(z.object({ body: zMultiline() }));
    expect(control).toMatchObject({ kind: 'text', format: 'multiline' });
  });

  it('treats a color-tagged string as a color control', () => {
    const [control] = describeSchema(z.object({ fill: zColor() }));
    expect(control).toEqual({ kind: 'color', path: ['fill'], label: 'fill' });
  });

  it('derives number bounds and a default step of one', () => {
    const [control] = describeSchema(z.object({ count: z.number().min(2).max(9) }));
    expect(control).toMatchObject({ kind: 'number', min: 2, max: 9, step: 1 });
  });

  it('carries the slider step from control metadata', () => {
    const [control] = describeSchema(z.object({ speed: zSlider({ min: 0, max: 5, step: 0.25 }) }));
    expect(control).toMatchObject({ kind: 'number', min: 0, max: 5, step: 0.25 });
  });

  it('emits an enum control for an easing enum field', () => {
    const [control] = describeSchema(z.object({ easing: z.enum(EASING_IDS) }));
    expect(control).toEqual({
      kind: 'enum',
      path: ['easing'],
      label: 'easing',
      options: [...EASING_IDS],
    });
  });

  it('surfaces an image-tagged field as an image control', () => {
    const [control] = describeSchema(z.object({ image1: zImage() }));
    expect(control).toEqual({ kind: 'image', path: ['image1'], label: 'image1' });
  });

  it('surfaces a video-tagged field as a video control', () => {
    const [control] = describeSchema(z.object({ clip: zVideo() }));
    expect(control).toEqual({ kind: 'video', path: ['clip'], label: 'clip' });
  });

  it('leaves number bounds null when unconstrained', () => {
    const [control] = describeSchema(z.object({ free: z.number() }));
    expect(control).toMatchObject({ kind: 'number', min: null, max: null, step: 1 });
  });

  it('maps a boolean', () => {
    const [control] = describeSchema(z.object({ flag: z.boolean() }));
    expect(control).toEqual({ kind: 'boolean', path: ['flag'], label: 'flag' });
  });

  it('lists enum options in declared order', () => {
    const [control] = describeSchema(z.object({ mode: z.enum(['slow', 'fast', 'off']) }));
    expect(control).toEqual({
      kind: 'enum',
      path: ['mode'],
      label: 'mode',
      options: ['slow', 'fast', 'off'],
    });
  });

  it('falls back to a text control for an unhandled kind', () => {
    const [control] = describeSchema(z.object({ when: z.date() }));
    expect(control).toMatchObject({ kind: 'text', format: 'line', maxLength: null });
  });
});

describe('describeSchema wrappers', () => {
  it('unwraps optional to the inner control', () => {
    const [control] = describeSchema(z.object({ fill: zColor().optional() }));
    expect(control?.kind).toBe('color');
  });

  it('unwraps default to the inner control', () => {
    const [control] = describeSchema(z.object({ speed: zSlider({ min: 0, max: 2 }).default(1) }));
    expect(control).toMatchObject({ kind: 'number', min: 0, max: 2, step: 1 });
  });

  it('unwraps nullable and readonly chains', () => {
    const [nullableControl] = describeSchema(z.object({ title: z.string().nullable() }));
    expect(nullableControl?.kind).toBe('text');
    const [readonlyControl] = describeSchema(z.object({ title: z.string().max(3).readonly() }));
    expect(readonlyControl).toMatchObject({ kind: 'text', maxLength: 3 });
  });

  it('unwraps an optional default stack and keeps metadata', () => {
    const [control] = describeSchema(z.object({ body: zMultiline().default('x').optional() }));
    expect(control).toMatchObject({ kind: 'text', format: 'multiline' });
  });
});

describe('describeSchema arrays', () => {
  it('reports min and max from array length checks', () => {
    const [control] = describeSchema(z.object({ notes: z.array(z.string()).min(1).max(4) }));
    expect(control).toMatchObject({ kind: 'array', min: 1, max: 4 });
  });

  it('reports a fixed length as both min and max', () => {
    const [control] = describeSchema(z.object({ grid: z.array(z.string()).length(8) }));
    expect(control).toMatchObject({ kind: 'array', min: 8, max: 8 });
  });

  it('leaves array bounds null when unconstrained', () => {
    const [control] = describeSchema(z.object({ any: z.array(z.string()) }));
    expect(control).toMatchObject({ kind: 'array', min: null, max: null });
  });

  it('wraps a leaf element as a single-field item', () => {
    const [control] = describeSchema(z.object({ tags: z.array(z.string()) }));
    if (control?.kind !== 'array') {
      throw new Error('expected array');
    }
    expect(control.item).toHaveLength(1);
    expect(control.item[0]?.kind).toBe('text');
  });

  it('spreads an object element into its item fields in order', () => {
    const [control] = describeSchema(
      z.object({
        rows: z.array(z.object({ label: z.string(), color: zColor(), size: z.number() })),
      }),
    );
    if (control?.kind !== 'array') {
      throw new Error('expected array');
    }
    expect(control.item.map((field) => field.kind)).toEqual(['text', 'color', 'number']);
    expect(control.item.map((field) => field.label)).toEqual(['label', 'color', 'size']);
  });
});

describe('describeSchema nesting', () => {
  it('recurses into nested objects and builds dotted paths', () => {
    const controls = describeSchema(
      z.object({ outer: z.object({ inner: z.string(), deep: z.object({ leaf: zColor() }) }) }),
    );
    const outer = byPath(controls, 'outer');
    if (outer.kind !== 'object') {
      throw new Error('expected object');
    }
    const inner = outer.fields.find((field) => field.path.join('.') === 'outer.inner');
    const leaf = outer.fields
      .flatMap((field) => (field.kind === 'object' ? field.fields : [field]))
      .find((field) => field.path.join('.') === 'outer.deep.leaf');
    expect(inner?.kind).toBe('text');
    expect(leaf?.kind).toBe('color');
  });

  it('returns a single leaf when the root is not an object', () => {
    const controls = describeSchema(z.string());
    expect(controls).toHaveLength(1);
    expect(controls[0]?.kind).toBe('text');
  });

  it('returns a single array control when the root is an array', () => {
    const controls = describeSchema(z.array(z.string()).min(2).max(3));
    expect(controls).toHaveLength(1);
    expect(controls[0]).toMatchObject({ kind: 'array', min: 2, max: 3 });
  });
});

describe('describeSchema over real clips', () => {
  it('describes every top-level field of every clip schema', () => {
    for (const schema of Object.values(CLIP_SCHEMAS)) {
      const controls = describeSchema(schema);
      expect(controls.length).toBeGreaterThan(0);
      for (const control of controls) {
        expect(control.path.length).toBeGreaterThan(0);
        expect(typeof control.label).toBe('string');
      }
    }
  });
});
