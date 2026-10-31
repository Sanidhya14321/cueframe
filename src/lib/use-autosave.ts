'use client';

import { useEffect, useRef } from 'react';

const SAVE_DELAY_MS = 800;

export const useAutosave = <T>(value: T, save: ((value: T) => void) | undefined): void => {
  const saved = useRef(value);

  useEffect(() => {
    if (save === undefined || value === saved.current) {
      return;
    }
    const timer = setTimeout(() => {
      saved.current = value;
      save(value);
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value, save]);
};
