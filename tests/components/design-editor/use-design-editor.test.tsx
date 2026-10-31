import { describe, expect, it } from 'bun:test';
import { act, renderHook } from '@testing-library/react';
import { useDesignEditor } from '@/components/design-editor/use-design-editor';
import { createDesign, createRect, createText, type Design } from '@/design';

const seed = (): Design =>
  createDesign({
    width: 1000,
    height: 1000,
    background: '#fff',
    elements: [
      createRect({ id: 'a', x: 10, y: 10, width: 100, height: 100 }),
      createRect({ id: 'b', x: 400, y: 400, width: 100, height: 100 }),
      createRect({ id: 'c', x: 800, y: 50, width: 100, height: 100 }),
    ],
  });

const ids = (design: Design) => design.elements.map((element) => element.id);

describe('useDesignEditor', () => {
  it('adds a centred element and selects it', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    const rect = createRect({ id: 'new', width: 200, height: 100 });
    act(() => result.current.addElement(rect));
    const added = result.current.design.elements.at(-1);
    expect(added).toMatchObject({ id: 'new', x: 400, y: 450 });
    expect(result.current.selectedIds).toEqual(['new']);
  });

  it('selects additively, toggles and expands groups', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    act(() => result.current.select(['a']));
    act(() => result.current.select(['b'], true));
    expect(result.current.selectedIds).toEqual(['a', 'b']);
    act(() => result.current.groupSelected());
    act(() => result.current.select(['a']));
    expect(result.current.selectedIds).toEqual(['a', 'b']);
    act(() => result.current.select(['a'], true));
    expect(result.current.selectedIds).toEqual([]);
    act(() => result.current.select(['a', 'b']));
    act(() => result.current.ungroupSelected());
    act(() => result.current.select(['a']));
    expect(result.current.selectedIds).toEqual(['a']);
  });

  it('duplicates, copies, pastes, cuts and removes', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    act(() => result.current.select(['a']));
    act(() => result.current.duplicateSelected());
    expect(result.current.design.elements).toHaveLength(4);
    act(() => result.current.copySelected());
    act(() => result.current.paste());
    expect(result.current.design.elements).toHaveLength(5);
    act(() => result.current.cutSelected());
    expect(result.current.design.elements).toHaveLength(4);
    act(() => result.current.select(['b']));
    act(() => result.current.removeSelected());
    expect(ids(result.current.design)).not.toContain('b');
    act(() => result.current.removeElement('c'));
    expect(ids(result.current.design)).not.toContain('c');
  });

  it('aligns to the page, distributes and nudges', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    act(() => result.current.select(['a']));
    act(() => result.current.alignSelected('center'));
    expect(result.current.design.elements[0]?.x).toBe(450);
    act(() => result.current.nudgeSelected(5, -5));
    expect(result.current.design.elements[0]).toMatchObject({ x: 455, y: 5 });
    act(() => result.current.selectAll());
    act(() => result.current.alignSelected('top'));
    expect(result.current.design.elements.map((element) => element.y)).toEqual([5, 5, 5]);
    act(() => result.current.distributeSelected('horizontal'));
    expect(result.current.design.elements.map((element) => element.x)).toEqual([600, 400, 800]);
  });

  it('reorders layers, locks and patches selection', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    act(() => result.current.select(['a']));
    act(() => result.current.reorderSelected('front'));
    expect(ids(result.current.design)).toEqual(['b', 'c', 'a']);
    act(() => result.current.moveLayer('a', 0));
    expect(ids(result.current.design)).toEqual(['a', 'b', 'c']);
    act(() => result.current.toggleLockSelected());
    expect(result.current.design.elements[0]?.locked).toBe(true);
    act(() => result.current.removeSelected());
    expect(result.current.design.elements).toHaveLength(3);
    act(() => result.current.updateSelected((element) => ({ ...element, opacity: 0.5 })));
    expect(result.current.design.elements[0]?.opacity).toBe(0.5);
  });

  it('manages background, resize, title and undo', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    act(() => result.current.setBackgroundFill('#123456'));
    expect(result.current.design.background).toBe('#123456');
    act(() => result.current.resize(500, 500));
    expect(result.current.design.width).toBe(500);
    act(() => result.current.rename('Launch'));
    expect(result.current.design.title).toBe('Launch');
    act(() => result.current.undo());
    expect(result.current.design.title).not.toBe('Launch');
    act(() => result.current.redo());
    expect(result.current.design.title).toBe('Launch');
  });

  it('applies a template to the canvas, resized to the design', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    const template = createDesign({
      width: 500,
      height: 500,
      background: '#000',
      elements: [createText({ id: 't', fontSize: 50 })],
    });
    act(() => result.current.applyTemplate(template));
    expect(result.current.design).toMatchObject({ width: 1000, height: 1000, background: '#000' });
    expect(result.current.design.elements).toHaveLength(1);
    expect(result.current.design.elements[0]).toMatchObject({ id: 't', fontSize: 100 });
    act(() => result.current.undo());
    expect(ids(result.current.design)).toEqual(['a', 'b', 'c']);
  });

  it('replaces elements, updates many, live edits and loads designs', () => {
    const { result } = renderHook(() => useDesignEditor(seed()));
    const [first] = result.current.design.elements;
    if (first === undefined) {
      throw new Error('missing element');
    }
    act(() => result.current.replaceElement({ ...first, x: 99 }, true));
    act(() => result.current.replaceElement({ ...first, x: 120 }, true));
    act(() => result.current.seal());
    act(() => result.current.undo());
    expect(result.current.design.elements[0]?.x).toBe(10);
    act(() => result.current.updateMany(new Map([[first.id, { ...first, y: 77 }]])));
    expect(result.current.design.elements[0]?.y).toBe(77);
    act(() => result.current.addMany([createRect({ id: 'x' }), createRect({ id: 'y' })]));
    expect(result.current.selectedIds).toEqual(['x', 'y']);
    act(() => result.current.addMany([]));
    act(() => result.current.load(createDesign({ title: 'Loaded' })));
    expect(result.current.design.title).toBe('Loaded');
    expect(result.current.canUndo).toBe(false);
    act(() => result.current.setEditingId('t'));
    expect(result.current.editingId).toBe('t');
    act(() => result.current.clearSelection());
    expect(result.current.editingId).toBeNull();
  });
});
