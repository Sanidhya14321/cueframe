import { describe, expect, it } from 'bun:test';
import { getAtPath, setAtPath } from '@/lib/value-path';

describe('getAtPath', () => {
  it('reads nested object and array values', () => {
    expect(getAtPath({ a: { b: [{ c: 1 }] } }, ['a', 'b', '0', 'c'])).toBe(1);
  });

  it('returns the root when the path is empty', () => {
    const root = { a: 1 };
    expect(getAtPath(root, [])).toBe(root);
  });

  it('returns undefined for a missing key', () => {
    expect(getAtPath({ a: 1 }, ['missing'])).toBeUndefined();
  });

  it('short-circuits to undefined when crossing null or undefined', () => {
    expect(getAtPath({ a: null }, ['a', 'b'])).toBeUndefined();
    expect(getAtPath({ a: undefined }, ['a', 'b', 'c'])).toBeUndefined();
    expect(getAtPath(null, ['a'])).toBeUndefined();
  });

  it('reads an out-of-range array index as undefined', () => {
    expect(getAtPath({ items: [1, 2] }, ['items', '5'])).toBeUndefined();
  });
});

describe('setAtPath', () => {
  it('replaces the root when the path is empty', () => {
    expect(setAtPath({ a: 1 }, [], 'replaced')).toBe('replaced');
  });

  it('sets a nested value immutably', () => {
    const root = { a: { b: 1 } };
    const next = setAtPath(root, ['a', 'b'], 2);
    expect(next).toEqual({ a: { b: 2 } });
    expect(root.a.b).toBe(1);
  });

  it('sets array items by index without mutating the source', () => {
    const root = { items: [{ x: 1 }, { x: 2 }] };
    const next = setAtPath(root, ['items', '1', 'x'], 9);
    expect(next).toEqual({ items: [{ x: 1 }, { x: 9 }] });
    expect(root.items[1]?.x).toBe(2);
  });

  it('creates intermediate objects when the branch is missing', () => {
    expect(setAtPath({}, ['a', 'b', 'c'], 5)).toEqual({ a: { b: { c: 5 } } });
  });

  it('creates a branch from a null or undefined root segment', () => {
    expect(setAtPath(undefined, ['a'], 1)).toEqual({ a: 1 });
    expect(setAtPath({ a: null }, ['a', 'b'], 2)).toEqual({ a: { b: 2 } });
  });

  it('preserves sibling array entries when updating one index', () => {
    const root = { rows: [{ t: 'a' }, { t: 'b' }, { t: 'c' }] };
    const next = setAtPath(root, ['rows', '2', 't'], 'z') as typeof root;
    expect(next.rows.map((row) => row.t)).toEqual(['a', 'b', 'z']);
    expect(next.rows[0]).toBe(root.rows[0]);
    expect(next.rows[2]).not.toBe(root.rows[2]);
  });

  it('appends past the current array length', () => {
    const next = setAtPath({ items: [1] }, ['items', '2'], 3) as { items: number[] };
    expect(next.items[0]).toBe(1);
    expect(next.items[2]).toBe(3);
    expect(next.items).toHaveLength(3);
  });
});
