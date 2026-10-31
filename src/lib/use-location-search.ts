'use client';

import { useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

const notify = (): void => {
  for (const listener of listeners) {
    listener();
  }
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
};

const clientSearch = (): string => window.location.search;

const serverSearch = (): string => '';

export const useLocationSearch = (): string =>
  useSyncExternalStore(subscribe, clientSearch, serverSearch);

export const replaceLocationSearch = (search: string): void => {
  window.history.replaceState(null, '', `${window.location.pathname}${search}`);
  notify();
};
