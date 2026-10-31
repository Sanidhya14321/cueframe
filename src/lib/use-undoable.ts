'use client';

import { useCallback, useEffect, useState } from 'react';

interface History<T> {
  past: T[];
  present: T;
  future: T[];
  live: boolean;
}

export interface Undoable<T> {
  value: T;
  set: (next: T) => void;
  setLive: (next: T) => void;
  seal: () => void;
  undo: () => void;
  redo: () => void;
  reset: (value: T) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const useUndoable = <T>(initial: T): Undoable<T> => {
  const [history, setHistory] = useState<History<T>>({
    past: [],
    present: initial,
    future: [],
    live: false,
  });

  const set = useCallback((next: T) => {
    setHistory((current) =>
      Object.is(current.present, next)
        ? current.live
          ? { ...current, live: false }
          : current
        : { past: [...current.past, current.present], present: next, future: [], live: false },
    );
  }, []);

  const setLive = useCallback((next: T) => {
    setHistory((current) => {
      if (Object.is(current.present, next)) {
        return current;
      }
      if (current.live) {
        return { ...current, present: next };
      }
      return { past: [...current.past, current.present], present: next, future: [], live: true };
    });
  }, []);

  const seal = useCallback(() => {
    setHistory((current) => (current.live ? { ...current, live: false } : current));
  }, []);

  const undo = useCallback(() => {
    setHistory((current) => {
      const previous = current.past.at(-1);
      if (previous === undefined) {
        return current;
      }
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future],
        live: false,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      const next = current.future.at(0);
      if (next === undefined) {
        return current;
      }
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1),
        live: false,
      };
    });
  }, []);

  const reset = useCallback((value: T) => {
    setHistory({ past: [], present: value, future: [], live: false });
  }, []);

  return {
    value: history.present,
    set,
    setLive,
    seal,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};

export const useUndoRedoKeys = (undo: () => void, redo: () => void): void => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);
};
