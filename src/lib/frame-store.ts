'use client';

import { useSyncExternalStore } from 'react';

export interface FrameStore {
  get: () => number;
  set: (frame: number) => void;
  subscribe: (listener: () => void) => () => void;
}

export const createFrameStore = (initial = 0): FrameStore => {
  let frame = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => frame,
    set: (next) => {
      if (next === frame) {
        return;
      }
      frame = next;
      for (const listener of listeners) {
        listener();
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const useFrame = (store: FrameStore): number =>
  useSyncExternalStore(store.subscribe, store.get, store.get);
