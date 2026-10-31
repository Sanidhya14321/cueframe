'use client';

import { useEffect, useRef } from 'react';
import { createEllipse, createLine, createRect, createText } from '@/design';
import {
  isEditableTarget,
  type ShortcutAction,
  shortcutFor,
  shouldHandleShortcut,
} from './shortcuts';
import type { DesignEditorState } from './use-design-editor';
import type { SelectionActions } from './use-selection-actions';

export type ZoomDirection = 'in' | 'out' | 'fit' | 'actual';

interface ShortcutHandlers {
  editor: DesignEditorState;
  actions: SelectionActions;
  onZoom: (direction: ZoomDirection) => void;
  onHelp: () => void;
  onSave: () => void;
  onExport: () => void;
  onPasteFiles: (files: File[]) => void;
}

const NEEDS_SELECTION = new Set<ShortcutAction['type']>([
  'nudge',
  'delete',
  'edit-text',
  'layer',
  'group',
  'ungroup',
  'duplicate',
  'cut',
  'copy',
  'copy-style',
  'paste-style',
  'lock',
  'hide',
  'text-toggle',
  'font-size',
]);

const ADDERS = {
  text: () => createText(),
  rect: () => createRect(),
  ellipse: () => createEllipse(),
  line: () => createLine(),
};

type Runner = (action: ShortcutAction, handlers: ShortcutHandlers) => void;

const editText: Runner = (_, { editor }) => {
  const [only] = editor.selectedElements;
  if (editor.selectedElements.length === 1 && only?.type === 'text') {
    editor.setEditingId(only.id);
  }
};

const RUNNERS: Record<ShortcutAction['type'], Runner> = {
  undo: (_, { editor }) => editor.undo(),
  redo: (_, { editor }) => editor.redo(),
  delete: (_, { editor }) => editor.removeSelected(),
  duplicate: (_, { editor }) => editor.duplicateSelected(),
  copy: (_, { editor }) => editor.copySelected(),
  cut: (_, { editor }) => editor.cutSelected(),
  'copy-style': (_, { actions }) => actions.copyStyle(),
  'paste-style': (_, { actions }) => actions.pasteStyle(),
  'select-all': (_, { editor }) => editor.selectAll(),
  'select-next': (action, { actions }) => {
    if (action.type === 'select-next') {
      actions.selectNext(action.direction);
    }
  },
  group: (_, { editor }) => editor.groupSelected(),
  ungroup: (_, { editor }) => editor.ungroupSelected(),
  lock: (_, { editor }) => editor.toggleLockSelected(),
  hide: (_, { actions }) => actions.toggleHidden(),
  escape: (_, { editor }) => editor.clearSelection(),
  'edit-text': editText,
  'text-toggle': (action, { actions }) => {
    if (action.type === 'text-toggle') {
      actions.toggleTextStyle(action.toggle);
    }
  },
  'font-size': (action, { actions }) => {
    if (action.type === 'font-size') {
      actions.stepTextSize(action.direction);
    }
  },
  layer: (action, { editor }) => {
    if (action.type === 'layer') {
      editor.reorderSelected(action.move);
    }
  },
  nudge: (action, { editor }) => {
    if (action.type === 'nudge') {
      editor.nudgeSelected(action.dx, action.dy);
    }
  },
  zoom: (action, { onZoom }) => {
    if (action.type === 'zoom') {
      onZoom(action.direction);
    }
  },
  add: (action, { editor }) => {
    if (action.type === 'add') {
      editor.addElement(ADDERS[action.element]());
    }
  },
  help: (_, { onHelp }) => onHelp(),
  save: (_, { onSave }) => onSave(),
  export: (_, { onExport }) => onExport(),
};

const redoInlineText = (event: KeyboardEvent, action: ShortcutAction | null): void => {
  if (action?.type === 'redo') {
    event.preventDefault();
    document.execCommand('redo');
  }
};

export const useEditorShortcuts = (handlers: ShortcutHandlers): void => {
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const current = latest.current;
      const action = shortcutFor(event);
      if (current.editor.editingId !== null) {
        redoInlineText(event, action);
        return;
      }
      if (action === null || !shouldHandleShortcut(action, event, event.target)) {
        return;
      }
      if (NEEDS_SELECTION.has(action.type) && current.editor.selectedIds.length === 0) {
        return;
      }
      event.preventDefault();
      if (event.target instanceof HTMLElement && isEditableTarget(event.target)) {
        event.target.blur();
      }
      RUNNERS[action.type](action, current);
    };
    const onPaste = (event: ClipboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }
      const files = [...(event.clipboardData?.files ?? [])].filter((file) =>
        file.type.startsWith('image/'),
      );
      event.preventDefault();
      if (files.length > 0) {
        latest.current.onPasteFiles(files);
      } else {
        latest.current.editor.paste();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('paste', onPaste);
    };
  }, []);
};
