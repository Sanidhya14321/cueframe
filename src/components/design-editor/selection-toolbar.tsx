'use client';

import { CopyPlus, Ellipsis, Lock, LockOpen, Pencil, Trash2 } from 'lucide-react';
import type { Box, Point } from '@/design';
import type { DesignEditorState } from './use-design-editor';

interface SelectionToolbarProps {
  editor: DesignEditorState;
  box: Box;
  onMore: (point: Point) => void;
}

const BUTTON =
  'inline-flex size-8 items-center justify-center rounded-md text-foreground/80 hover:bg-accent hover:text-foreground';

export const SelectionToolbar = ({ editor, box, onMore }: SelectionToolbarProps) => {
  const [first] = editor.selectedElements;
  const locked = editor.selectedElements.every((element) => element.locked);
  const top = box.y > 56 ? box.y - 48 : box.y + box.height + 12;
  return (
    <div
      role="toolbar"
      aria-label="Selection actions"
      className="absolute z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border bg-background/95 p-1 shadow-lg backdrop-blur"
      style={{ left: box.x + box.width / 2, top }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {editor.selectedElements.length === 1 && first?.type === 'text' && !first.locked ? (
        <button
          type="button"
          className={BUTTON}
          aria-label="Edit text"
          title="Edit text"
          onClick={() => editor.setEditingId(first.id)}
        >
          <Pencil className="size-4" />
        </button>
      ) : null}
      <button
        type="button"
        className={BUTTON}
        aria-label="Duplicate selection"
        title="Duplicate"
        onClick={editor.duplicateSelected}
      >
        <CopyPlus className="size-4" />
      </button>
      <button
        type="button"
        className={BUTTON}
        aria-label={locked ? 'Unlock selection' : 'Lock selection'}
        title={locked ? 'Unlock' : 'Lock'}
        onClick={editor.toggleLockSelected}
      >
        {locked ? <Lock className="size-4" /> : <LockOpen className="size-4" />}
      </button>
      <button
        type="button"
        className={BUTTON}
        aria-label="Delete selection"
        title="Delete"
        onClick={editor.removeSelected}
      >
        <Trash2 className="size-4" />
      </button>
      <button
        type="button"
        className={BUTTON}
        aria-label="More actions"
        title="More"
        onClick={(event) => onMore({ x: event.clientX, y: event.clientY + 12 })}
      >
        <Ellipsis className="size-4" />
      </button>
    </div>
  );
};
