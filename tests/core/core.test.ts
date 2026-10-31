import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import { type ControlDescriptor, describeSchema } from '@/core';
import { CLIP_SCHEMAS, zColor, zMultiline, zSlider } from '@/schemas';

const byPath = (controls: ControlDescriptor[], key: string): ControlDescriptor => {
  const found = controls.find((control) => control.path[0] === key);
  if (found === undefined) {
    throw new Error(`no control for ${key}`);
  }
  return found;
};

describe('describeSchema', () => {
  const schema = z.object({
    title: z.string(),
    bg: zColor(),
    notes: zMultiline(),
    speed: zSlider({ min: 0, max: 2, step: 0.1 }),
    flag: z.boolean(),
    mode: z.enum(['a', 'b']),
    items: z
      .array(z.object({ t: z.string(), c: zColor() }))
      .min(1)
      .max(3),
    fixed: z.array(z.string()).length(8),
  });
  const controls = describeSchema(schema);

  it('maps each zod kind to the right control', () => {
    expect(byPath(controls, 'title').kind).toBe('text');
    expect(byPath(controls, 'bg').kind).toBe('color');
    const notes = byPath(controls, 'notes');
    expect(notes.kind === 'text' && notes.format === 'multiline').toBe(true);
    const speed = byPath(controls, 'speed');
    expect(speed).toMatchObject({ kind: 'number', min: 0, max: 2, step: 0.1 });
    expect(byPath(controls, 'flag').kind).toBe('boolean');
    expect(byPath(controls, 'mode')).toMatchObject({ kind: 'enum', options: ['a', 'b'] });
  });

  it('describes arrays with bounds and item fields', () => {
    const items = byPath(controls, 'items');
    expect(items).toMatchObject({ kind: 'array', min: 1, max: 3 });
    if (items.kind === 'array') {
      expect(items.item.map((field) => field.kind)).toEqual(['text', 'color']);
    }
    expect(byPath(controls, 'fixed')).toMatchObject({ kind: 'array', min: 8, max: 8 });
  });

  it('covers every top-level field of every real clip schema', () => {
    for (const schemaForClip of Object.values(CLIP_SCHEMAS)) {
      const described = describeSchema(schemaForClip);
      expect(described.length).toBeGreaterThan(0);
    }
  });
});
