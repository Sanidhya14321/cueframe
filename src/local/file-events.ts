import { type FSWatcher, watch } from 'node:fs';
import { basename, dirname } from 'node:path';

type Subscription = {
  watcher: FSWatcher;
  listeners: Set<() => void>;
  timer: ReturnType<typeof setTimeout> | undefined;
};
const shared = globalThis as typeof globalThis & {
  cueframeFileSubscriptions?: Map<string, Subscription>;
};
const subscriptions = shared.cueframeFileSubscriptions ?? new Map<string, Subscription>();
shared.cueframeFileSubscriptions = subscriptions;

export const notifyFile = (path: string): void => {
  const current = subscriptions.get(path);
  if (!current || current.timer) {
    return;
  }
  current.timer = setTimeout(() => {
    current.timer = undefined;
    for (const callback of current.listeners) {
      callback();
    }
  }, 0);
  current.timer.unref?.();
};

export const subscribeFile = (path: string, listener: () => void): (() => void) => {
  let subscription = subscriptions.get(path);
  if (!subscription) {
    const listeners = new Set<() => void>();
    const notify = () => notifyFile(path);
    const watcher = watch(dirname(path), (_, filename) => {
      if (filename === null || filename.toString() === basename(path)) {
        notify();
      }
    });
    watcher.on('error', notify);
    watcher.unref();
    subscription = { watcher, listeners, timer: undefined };
    subscriptions.set(path, subscription);
  }
  subscription.listeners.add(listener);
  return () => {
    subscription.listeners.delete(listener);
    if (subscription.listeners.size === 0) {
      subscription.watcher.close();
      clearTimeout(subscription.timer);
      subscriptions.delete(path);
    }
  };
};

export const fileSignal = (path: string) => {
  let pending = false;
  let resume: (() => void) | undefined;
  const unsubscribe = subscribeFile(path, () => {
    pending = true;
    resume?.();
  });
  return {
    wait: (timeout: number): Promise<void> => {
      if (pending) {
        pending = false;
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        const finish = () => {
          clearTimeout(timer);
          resume = undefined;
          pending = false;
          resolve();
        };
        const timer = setTimeout(finish, Math.max(0, timeout));
        resume = finish;
      });
    },
    close: () => {
      unsubscribe();
      resume?.();
    },
  };
};
