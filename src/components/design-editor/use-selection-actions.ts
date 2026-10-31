'use client';

import { useCallback, useRef } from 'react';
import {
  applyStyle,
  type DesignElement,
  reorderElements,
  stepFontSize,
  updateElements,
} from '@/design';
import type { TextToggle } from './shortcuts';
import type { DesignEditorState } from './use-design-editor';

const toggleText = (element: DesignElement, toggle: TextToggle, on: boolean): DesignElement => {
  if (element.type !== 'text') {
    return element;
  }
  if (toggle === 'bold') {
    return { ...element, fontWeight: on ? 700 : 400 };
  }
  return toggle === 'italic' ? { ...element, italic: on } : { ...element, underline: on };
};

const isToggled = (element: DesignElement, toggle: TextToggle): boolean => {
  if (element.type !== 'text') {
    return false;
  }
  if (toggle === 'bold') {
    return element.fontWeight >= 700;
  }
  return toggle === 'italic' ? element.italic : element.underline;
};

export const useSelectionActions = (editor: DesignEditorState) => {
  const styleClipboard = useRef<DesignElement | null>(null);
  const { selectedElements, design } = editor;

  const copyStyle = useCallback(() => {
    styleClipboard.current = selectedElements[0] ?? null;
  }, [selectedElements]);

  const pasteStyle = useCallback(() => {
    const source = styleClipboard.current;
    if (source !== null) {
      editor.updateSelected((element) => applyStyle(element, source));
    }
  }, [editor]);

  const selectNext = useCallback(
    (direction: 1 | -1) => {
      const candidates = design.elements.filter((element) => !(element.locked || element.hidden));
      if (candidates.length === 0) {
        return;
      }
      const current = candidates.findIndex((element) => element.id === editor.selectedIds[0]);
      const next =
        current === -1
          ? direction === 1
            ? 0
            : candidates.length - 1
          : (current + direction + candidates.length) % candidates.length;
      const target = candidates[next];
      if (target !== undefined) {
        editor.select([target.id]);
      }
    },
    [editor, design.elements],
  );

  const toggleHidden = useCallback(() => {
    const hide = !selectedElements.every((element) => element.hidden);
    editor.updateSelected((element) => ({ ...element, hidden: hide }));
  }, [editor, selectedElements]);

  const toggleTextStyle = useCallback(
    (toggle: TextToggle) => {
      const texts = selectedElements.filter((element) => element.type === 'text');
      if (texts.length === 0) {
        return;
      }
      const on = !texts.every((element) => isToggled(element, toggle));
      editor.updateSelected((element) => toggleText(element, toggle, on));
    },
    [editor, selectedElements],
  );

  const stepTextSize = useCallback(
    (direction: 1 | -1) =>
      editor.updateSelected((element) =>
        element.type === 'text'
          ? { ...element, fontSize: stepFontSize(element.fontSize, direction) }
          : element,
      ),
    [editor],
  );

  const setAsBackground = useCallback(() => {
    const [image] = selectedElements;
    if (selectedElements.length !== 1 || image?.type !== 'image') {
      return;
    }
    const background: DesignElement = {
      ...image,
      x: 0,
      y: 0,
      rotation: 0,
      width: design.width,
      height: design.height,
      fit: 'cover',
      cornerRadius: 0,
      locked: true,
    };
    editor.transform((current) =>
      reorderElements(
        updateElements(current, [image.id], () => background),
        [image.id],
        'back',
      ),
    );
  }, [design.height, design.width, editor, selectedElements]);

  return {
    copyStyle,
    pasteStyle,
    hasCopiedStyle: () => styleClipboard.current !== null,
    selectNext,
    toggleHidden,
    toggleTextStyle,
    stepTextSize,
    setAsBackground,
  };
};

export type SelectionActions = ReturnType<typeof useSelectionActions>;
