'use client';

import { Redo2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Undoable, useUndoRedoKeys } from '@/lib/use-undoable';

export const HistoryActions = <T,>({ history }: { history: Undoable<T> }) => {
  useUndoRedoKeys(history.undo, history.redo);
  return (
    <>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Undo"
        disabled={!history.canUndo}
        onClick={history.undo}
      >
        <Undo2 />
      </Button>
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        aria-label="Redo"
        disabled={!history.canRedo}
        onClick={history.redo}
      >
        <Redo2 />
      </Button>
    </>
  );
};
