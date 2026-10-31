'use client';

import { useCallback, useEffect, useState } from 'react';

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

export const usePersistedState = <T>(key: string, initial: T): [T, (next: T) => void] => {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    setValue(read(key, initial));
  }, [key, initial]);

  const set = useCallback(
    (next: T) => {
      setValue(next);
      write(key, next);
    },
    [key],
  );

  return [value, set];
};
