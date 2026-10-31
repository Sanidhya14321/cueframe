'use client';

import { useCallback, useEffect, useRef } from 'react';

const SAVE_DELAY_MS = 600;

const readSaved = <T>(key: string, parse: (value: unknown) => T | null): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? null : parse(JSON.parse(raw));
  } catch {
    return null;
  }
};

const writeSaved = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

interface SavedDocumentOptions<T> {
  key: string | null;
  value: T;
  parse: (value: unknown) => T | null;
  restore: (saved: T) => void;
}

export const useSavedDocument = <T>({
  key,
  value,
  parse,
  restore,
}: SavedDocumentOptions<T>): (() => void) => {
  const restored = useRef(false);
  const latest = useRef({ parse, restore });
  latest.current = { parse, restore };

  useEffect(() => {
    if (restored.current || key === null) {
      return;
    }
    restored.current = true;
    const saved = readSaved(key, latest.current.parse);
    if (saved !== null) {
      latest.current.restore(saved);
    }
  }, [key]);

  useEffect(() => {
    if (key === null) {
      return;
    }
    const timer = setTimeout(() => writeSaved(key, value), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [key, value]);

  return useCallback(() => {
    if (key === null) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  }, [key]);
};
