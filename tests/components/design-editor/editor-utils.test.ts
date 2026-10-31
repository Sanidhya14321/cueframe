import { describe, expect, it } from 'bun:test';
import { designFileName, parseDesignJson } from '@/components/design-editor/export-design';
import { isEditableTarget, shortcutFor } from '@/components/design-editor/shortcuts';
import { createDesign } from '@/design';

const key = (
  value: string,
  modifiers: Partial<Record<'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey', boolean>> = {},
) => ({
  key: value,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  ...modifiers,
});

describe('shortcuts', () => {
  it('maps modifier shortcuts', () => {
    expect(shortcutFor(key('z', { metaKey: true }))).toEqual({ type: 'undo' });
    expect(shortcutFor(key('Z', { metaKey: true, shiftKey: true }))).toEqual({ type: 'redo' });
    expect(shortcutFor(key('y', { ctrlKey: true }))).toEqual({ type: 'redo' });
    expect(shortcutFor(key('d', { metaKey: true }))).toEqual({ type: 'duplicate' });
    expect(shortcutFor(key('c', { metaKey: true }))).toEqual({ type: 'copy' });
    expect(shortcutFor(key('x', { metaKey: true }))).toEqual({ type: 'cut' });
    expect(shortcutFor(key('a', { metaKey: true }))).toEqual({ type: 'select-all' });
    expect(shortcutFor(key('g', { metaKey: true }))).toEqual({ type: 'group' });
    expect(shortcutFor(key('g', { metaKey: true, shiftKey: true }))).toEqual({ type: 'ungroup' });
    expect(shortcutFor(key(']', { metaKey: true }))).toEqual({ type: 'layer', move: 'forward' });
    expect(shortcutFor(key(']', { metaKey: true, altKey: true }))).toEqual({
      type: 'layer',
      move: 'front',
    });
    expect(shortcutFor(key('[', { metaKey: true }))).toEqual({ type: 'layer', move: 'backward' });
    expect(shortcutFor(key('[', { metaKey: true, shiftKey: true }))).toEqual({
      type: 'layer',
      move: 'back',
    });
    expect(shortcutFor(key('=', { metaKey: true }))).toEqual({ type: 'zoom', direction: 'in' });
    expect(shortcutFor(key('-', { metaKey: true }))).toEqual({ type: 'zoom', direction: 'out' });
    expect(shortcutFor(key('0', { metaKey: true }))).toEqual({ type: 'zoom', direction: 'fit' });
    expect(shortcutFor(key('e', { metaKey: true }))).toEqual({ type: 'export' });
    expect(shortcutFor(key('q', { metaKey: true }))).toBeNull();
  });

  it('maps plain keys', () => {
    expect(shortcutFor(key('ArrowLeft'))).toEqual({ type: 'nudge', dx: -1, dy: 0 });
    expect(shortcutFor(key('ArrowDown', { shiftKey: true }))).toEqual({
      type: 'nudge',
      dx: 0,
      dy: 10,
    });
    expect(shortcutFor(key('Backspace'))).toEqual({ type: 'delete' });
    expect(shortcutFor(key('Escape'))).toEqual({ type: 'escape' });
    expect(shortcutFor(key('Enter'))).toEqual({ type: 'edit-text' });
    expect(shortcutFor(key('t'))).toEqual({ type: 'add', element: 'text' });
    expect(shortcutFor(key('R'))).toEqual({ type: 'add', element: 'rect' });
    expect(shortcutFor(key('t', { shiftKey: true }))).toBeNull();
    expect(shortcutFor(key('k'))).toBeNull();
  });

  it('detects editable targets', () => {
    expect(isEditableTarget(document.createElement('input'))).toBe(true);
    expect(isEditableTarget(document.createElement('textarea'))).toBe(true);
    expect(isEditableTarget(document.createElement('div'))).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});

describe('design files', () => {
  it('slugifies titles', () => {
    expect(designFileName('Hiring Post: Orange!')).toBe('hiring-post-orange');
    expect(designFileName('***')).toBe('design');
  });

  it('parses only valid design json', () => {
    const design = createDesign({ title: 'Saved' });
    expect(parseDesignJson(JSON.stringify(design))?.title).toBe('Saved');
    expect(parseDesignJson('{"nope":true}')).toBeNull();
    expect(parseDesignJson('not json')).toBeNull();
  });
});
