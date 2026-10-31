'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type Alignment,
  type Axis,
  addElements,
  alignOffsets,
  type Box,
  type Design,
  type DesignElement,
  distributeOffsets,
  duplicateElements,
  elementBounds,
  expandToGroups,
  type Fill,
  groupElements,
  type LayerMove,
  moveElementTo,
  pasteElements,
  removeElements,
  reorderElements,
  resizeDesign,
  setBackground,
  translateElements,
  ungroupElements,
  unionBox,
  updateElements,
} from '@/design';
import { useUndoable } from '@/lib/use-undoable';

export type HeightMeasure = (id: string) => number | undefined;

export type AlignTarget = 'page' | 'selection';

const centred = (element: DesignElement, design: Design, measure: HeightMeasure): DesignElement => {
  const box = elementBounds(element, measure(element.id));
  return {
    ...element,
    x: (design.width - box.width) / 2,
    y: (design.height - box.height) / 2,
  };
};

export const useDesignEditor = (initial: Design) => {
  const history = useUndoable<Design>(initial);
  const design = history.value;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const clipboard = useRef<DesignElement[]>([]);
  const measureRef = useRef<HeightMeasure>(() => undefined);

  const selectedElements = useMemo(
    () => design.elements.filter((element) => selectedIds.includes(element.id)),
    [design, selectedIds],
  );

  const commit = useCallback(
    (next: Design, live = false) => (live ? history.setLive(next) : history.set(next)),
    [history.set, history.setLive],
  );

  const edit = useCallback(
    (update: (current: Design) => Design, live = false) => commit(update(design), live),
    [commit, design],
  );

  const select = useCallback(
    (ids: readonly string[], additive = false) => {
      const expanded = expandToGroups(design, ids);
      setSelectedIds((current) =>
        additive
          ? expanded.every((id) => current.includes(id))
            ? current.filter((id) => !expanded.includes(id))
            : [...new Set([...current, ...expanded])]
          : expanded,
      );
      setEditingId(null);
    },
    [design],
  );

  const focusElement = useCallback((id: string) => setSelectedIds([id]), []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setEditingId(null);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(
      design.elements.filter((element) => !element.locked).map((element) => element.id),
    );
  }, [design]);

  const addElement = useCallback(
    (element: DesignElement, options: { centre?: boolean } = {}) => {
      const placed =
        options.centre === false ? element : centred(element, design, measureRef.current);
      edit((current) => addElements(current, [placed]));
      setSelectedIds([placed.id]);
    },
    [design, edit],
  );

  const addMany = useCallback(
    (elements: readonly DesignElement[]) => {
      if (elements.length === 0) {
        return;
      }
      edit((current) => addElements(current, elements));
      setSelectedIds(elements.map((element) => element.id));
    },
    [edit],
  );

  const replaceElement = useCallback(
    (next: DesignElement, live = false) => {
      edit((current) => updateElements(current, [next.id], () => next), live);
    },
    [edit],
  );

  const updateSelected = useCallback(
    (update: (element: DesignElement) => DesignElement, live = false) => {
      edit((current) => updateElements(current, selectedIds, update), live);
    },
    [edit, selectedIds],
  );

  const updateMany = useCallback(
    (updates: ReadonlyMap<string, DesignElement>, live = false) => {
      edit(
        (current) => ({
          ...current,
          elements: current.elements.map((element) => updates.get(element.id) ?? element),
        }),
        live,
      );
    },
    [edit],
  );

  const removeSelected = useCallback(() => {
    const removable = selectedElements.filter((element) => !element.locked).map((el) => el.id);
    if (removable.length === 0) {
      return;
    }
    edit((current) => removeElements(current, removable));
    setSelectedIds([]);
  }, [edit, selectedElements]);

  const removeElement = useCallback(
    (id: string) => {
      edit((current) => removeElements(current, [id]));
      setSelectedIds((current) => current.filter((item) => item !== id));
    },
    [edit],
  );

  const duplicateSelected = useCallback(() => {
    if (selectedIds.length === 0) {
      return;
    }
    const result = duplicateElements(design, selectedIds);
    commit(result.design);
    setSelectedIds(result.ids);
  }, [commit, design, selectedIds]);

  const copySelected = useCallback(() => {
    clipboard.current = selectedElements;
  }, [selectedElements]);

  const cutSelected = useCallback(() => {
    clipboard.current = selectedElements;
    removeSelected();
  }, [removeSelected, selectedElements]);

  const paste = useCallback(() => {
    if (clipboard.current.length === 0) {
      return;
    }
    const result = pasteElements(design, clipboard.current);
    commit(result.design);
    setSelectedIds(result.ids);
  }, [commit, design]);

  const reorderSelected = useCallback(
    (move: LayerMove) => edit((current) => reorderElements(current, selectedIds, move)),
    [edit, selectedIds],
  );

  const moveLayer = useCallback(
    (id: string, index: number) => edit((current) => moveElementTo(current, id, index)),
    [edit],
  );

  const nudgeSelected = useCallback(
    (dx: number, dy: number) => {
      const offsets = Object.fromEntries(
        selectedElements.filter((el) => !el.locked).map((el) => [el.id, { x: dx, y: dy }]),
      );
      edit((current) => translateElements(current, offsets));
    },
    [edit, selectedElements],
  );

  const selectionBoxes = useCallback(
    (): Record<string, Box> =>
      Object.fromEntries(
        selectedElements.map((element) => [
          element.id,
          elementBounds(element, measureRef.current(element.id)),
        ]),
      ),
    [selectedElements],
  );

  const alignSelected = useCallback(
    (alignment: Alignment, target: AlignTarget = selectedIds.length > 1 ? 'selection' : 'page') => {
      const boxes = selectionBoxes();
      const pageBox = { x: 0, y: 0, width: design.width, height: design.height };
      const targetBox = target === 'page' ? pageBox : (unionBox(Object.values(boxes)) ?? pageBox);
      edit((current) => translateElements(current, alignOffsets(boxes, targetBox, alignment)));
    },
    [design.height, design.width, edit, selectedIds.length, selectionBoxes],
  );

  const distributeSelected = useCallback(
    (axis: Axis) => {
      edit((current) => translateElements(current, distributeOffsets(selectionBoxes(), axis)));
    },
    [edit, selectionBoxes],
  );

  const groupSelected = useCallback(
    () => edit((current) => groupElements(current, selectedIds)),
    [edit, selectedIds],
  );

  const ungroupSelected = useCallback(
    () => edit((current) => ungroupElements(current, selectedIds)),
    [edit, selectedIds],
  );

  const toggleLockSelected = useCallback(() => {
    const lock = !selectedElements.every((element) => element.locked);
    updateSelected((element) => ({ ...element, locked: lock }));
  }, [selectedElements, updateSelected]);

  const setBackgroundFill = useCallback(
    (fill: Fill, live = false) => edit((current) => setBackground(current, fill), live),
    [edit],
  );

  const applyTemplate = useCallback(
    (source: Design) => {
      const scaled = resizeDesign(source, design.width, design.height);
      commit({
        ...design,
        background: scaled.background,
        elements: scaled.elements,
        controls: scaled.controls,
      });
      setSelectedIds([]);
      setEditingId(null);
    },
    [commit, design],
  );

  const resize = useCallback(
    (width: number, height: number) => commit(resizeDesign(design, width, height)),
    [commit, design],
  );

  const rename = useCallback((title: string) => commit({ ...design, title }), [commit, design]);

  const load = useCallback(
    (next: Design) => {
      history.reset(next);
      setSelectedIds([]);
      setEditingId(null);
    },
    [history.reset],
  );

  return {
    design,
    selectedIds,
    selectedElements,
    editingId,
    measureRef,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    undo: history.undo,
    redo: history.redo,
    seal: history.seal,
    select,
    focusElement,
    clearSelection,
    selectAll,
    setEditingId,
    transform: edit,
    addElement,
    addMany,
    replaceElement,
    updateSelected,
    updateMany,
    removeSelected,
    removeElement,
    duplicateSelected,
    copySelected,
    cutSelected,
    paste,
    reorderSelected,
    moveLayer,
    nudgeSelected,
    alignSelected,
    distributeSelected,
    groupSelected,
    ungroupSelected,
    toggleLockSelected,
    setBackgroundFill,
    applyTemplate,
    resize,
    rename,
    load,
  };
};

export type DesignEditorState = ReturnType<typeof useDesignEditor>;
