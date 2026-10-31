import { describe, expect, it } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { shortcutFor, shouldHandleShortcut } from '@/components/design-editor/shortcuts';
import { useDesignEditor } from '@/components/design-editor/use-design-editor';
import { useSelectionActions } from '@/components/design-editor/use-selection-actions';
import {
  applyStyle,
  createDesign,
  createImage,
  createRect,
  createText,
  stepFontSize,
} from '@/design';

const key = (
  value: string,
  modifiers: Partial<Record<'metaKey' | 'shiftKey' | 'altKey' | 'ctrlKey', boolean>> = {},
) => ({
  key: value,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  ...modifiers,
});

describe('rich shortcuts', () => {
  it('maps style, text, visibility and selection shortcuts', () => {
    expect(shortcutFor({ ...key('ç', { metaKey: true, altKey: true }), code: 'KeyC' })).toEqual({
      type: 'copy-style',
    });
    expect(shortcutFor({ ...key('√', { metaKey: true, altKey: true }), code: 'KeyV' })).toEqual({
      type: 'paste-style',
    });
    expect(shortcutFor(key('b', { metaKey: true }))).toEqual({
      type: 'text-toggle',
      toggle: 'bold',
    });
    expect(shortcutFor(key('>', { metaKey: true, shiftKey: true }))).toEqual({
      type: 'font-size',
      direction: 1,
    });
    expect(shortcutFor(key('l', { metaKey: true, shiftKey: true }))).toEqual({ type: 'lock' });
    expect(shortcutFor(key('h', { metaKey: true, shiftKey: true }))).toEqual({ type: 'hide' });
    expect(shortcutFor(key('1', { metaKey: true }))).toEqual({ type: 'zoom', direction: 'actual' });
    expect(shortcutFor(key('Tab', { shiftKey: true }))).toEqual({
      type: 'select-next',
      direction: -1,
    });
    expect(shortcutFor(key('?', { shiftKey: true }))).toEqual({ type: 'help' });
    expect(shortcutFor(key('s', { metaKey: true }))).toEqual({ type: 'save' });
  });

  it('maps undo and redo from any letter case or keyboard layout', () => {
    expect(shortcutFor(key('Z', { metaKey: true }))).toEqual({ type: 'undo' });
    expect(shortcutFor(key('Z', { metaKey: true, shiftKey: true }))).toEqual({ type: 'redo' });
    expect(shortcutFor(key('y', { ctrlKey: true }))).toEqual({ type: 'redo' });
    expect(shortcutFor({ ...key('я', { metaKey: true }), code: 'KeyZ' })).toEqual({
      type: 'undo',
    });
    expect(shortcutFor({ ...key('н', { metaKey: true }), code: 'KeyY' })).toEqual({
      type: 'redo',
    });
  });

  it('sends undo and redo to the design from every field', () => {
    const undo = { type: 'undo' } as const;
    const redo = { type: 'redo' } as const;
    const colour = document.createElement('input');
    colour.type = 'color';
    const field = document.createElement('input');
    field.type = 'text';
    const textarea = document.createElement('textarea');
    expect(shouldHandleShortcut(undo, key('z', { metaKey: true }), colour)).toBe(true);
    expect(shouldHandleShortcut(undo, key('z', { metaKey: true }), field)).toBe(true);
    expect(shouldHandleShortcut(redo, key('y', { metaKey: true }), field)).toBe(true);
    expect(shouldHandleShortcut(redo, key('z', { metaKey: true, shiftKey: true }), textarea)).toBe(
      true,
    );
    expect(shouldHandleShortcut({ type: 'select-all' }, key('a', { metaKey: true }), field)).toBe(
      false,
    );
    expect(shouldHandleShortcut({ type: 'copy' }, key('c', { metaKey: true }), colour)).toBe(false);
    expect(shouldHandleShortcut({ type: 'delete' }, key('Backspace'), colour)).toBe(false);
    expect(shouldHandleShortcut({ type: 'delete' }, key('Backspace'), document.body)).toBe(true);
  });
});

describe('style helpers', () => {
  it('copies only the style keys the target supports', () => {
    const source = createText({ fill: '#ff0000', fontSize: 90, opacity: 0.5 });
    const rect = applyStyle(createRect({ fill: '#000000' }), source);
    expect(rect).toMatchObject({ type: 'rect', fill: '#ff0000', opacity: 0.5 });
    expect('fontSize' in rect).toBe(false);
    expect(applyStyle(createText(), source)).toMatchObject({ fontSize: 90 });
  });

  it('steps font sizes through common sizes', () => {
    expect(stepFontSize(40, 1)).toBe(48);
    expect(stepFontSize(40, -1)).toBe(36);
    expect(stepFontSize(400, 1)).toBe(480);
    expect(stepFontSize(8, -1)).toBe(7);
  });
});

describe('selection actions', () => {
  const setup = () => {
    const elements = [
      createText({ id: 't', fontSize: 40 }),
      createRect({ id: 'r', fill: '#00ff00' }),
      createImage({ id: 'i', x: 50, y: 60, width: 100, height: 100 }),
    ];
    return renderHook(() => {
      const editor = useDesignEditor(
        createDesign({ width: 1000, height: 800, background: '#fff', elements: elements }),
      );
      return { editor, actions: useSelectionActions(editor) };
    });
  };

  it('toggles text styles, sizes and visibility', () => {
    const { result } = setup();
    act(() => result.current.editor.select(['t']));
    act(() => result.current.actions.toggleTextStyle('italic'));
    act(() => result.current.actions.stepTextSize(1));
    act(() => result.current.actions.toggleHidden());
    expect(result.current.editor.design.elements[0]).toMatchObject({
      italic: true,
      fontSize: 48,
      hidden: true,
    });
  });

  it('copies and pastes style and cycles the selection', () => {
    const { result } = setup();
    act(() => result.current.editor.select(['r']));
    act(() => result.current.actions.copyStyle());
    act(() => result.current.actions.selectNext(1));
    expect(result.current.editor.selectedIds).toEqual(['i']);
    act(() => result.current.actions.selectNext(1));
    expect(result.current.editor.selectedIds).toEqual(['t']);
    act(() => result.current.actions.pasteStyle());
    expect(result.current.editor.design.elements[0]).toMatchObject({ fill: '#00ff00' });
  });

  it('turns an image into a locked page background at the back', () => {
    const { result } = setup();
    act(() => result.current.editor.select(['i']));
    act(() => result.current.actions.setAsBackground());
    expect(result.current.editor.design.elements[0]).toMatchObject({
      id: 'i',
      x: 0,
      y: 0,
      width: 1000,
      height: 800,
      locked: true,
    });
  });
});
