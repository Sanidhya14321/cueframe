'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { registerEditorNavigation } from '@/lib/editor-navigation';

type Reply =
  | { type: 'clipkit-ready' }
  | { type: 'clipkit-command-menu' }
  | { type: 'clipkit-flushed'; requestId: string; ok: boolean };
const readReply = (data: unknown): Reply | null => {
  if (!(data && typeof data === 'object' && 'type' in data)) {
    return null;
  }
  if (data.type === 'clipkit-command-menu') {
    return { type: 'clipkit-command-menu' };
  }
  if (data.type === 'clipkit-ready') {
    return { type: 'clipkit-ready' };
  }
  if (
    data.type !== 'clipkit-flushed' ||
    !('requestId' in data) ||
    typeof data.requestId !== 'string'
  ) {
    return null;
  }
  return {
    type: 'clipkit-flushed',
    requestId: data.requestId,
    ok: 'ok' in data && data.ok === true,
  };
};
type Pending = Map<string, { resolve: () => void; reject: (error: Error) => void }>;
const settle = (data: Extract<Reply, { type: 'clipkit-flushed' }>, pending: Pending) => {
  const request = pending.get(data.requestId);
  pending.delete(data.requestId);
  if (!request) {
    return;
  }
  if (data.ok) {
    request.resolve();
    return;
  }
  request.reject(new Error('OpenCut could not save. Resolve the save error before switching.'));
};
export const useOpenCutFrame = () => {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [problem, setProblem] = useState('');
  const pending = useRef(
    new Map<string, { resolve: () => void; reject: (error: Error) => void }>(),
  );
  useEffect(() => {
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow) {
        return;
      }
      const data = readReply(event.data);
      if (!data) {
        return;
      }
      if (data.type === 'clipkit-command-menu') {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
        return;
      }
      if (data.type === 'clipkit-ready') {
        setReady(true);
      }
      if (data.type === 'clipkit-flushed') {
        settle(data, pending.current);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);
  const flush = useCallback(
    () =>
      new Promise<void>((resolve, reject) => {
        if (!ready) {
          resolve();
          return;
        }
        const requestId = crypto.randomUUID();
        const timer = setTimeout(() => {
          pending.current.delete(requestId);
          reject(new Error('OpenCut did not respond. Keep this page open and retry saving.'));
        }, 15000);
        pending.current.set(requestId, {
          resolve: () => {
            clearTimeout(timer);
            resolve();
          },
          reject: (error) => {
            clearTimeout(timer);
            reject(error);
          },
        });
        frame.current?.contentWindow?.postMessage(
          { type: 'clipkit-flush', requestId },
          location.origin,
        );
      }),
    [ready],
  );
  useEffect(() => registerEditorNavigation(flush), [flush]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }
      const link = event.target.closest('a');
      if (
        !link ||
        link.target ||
        link.hasAttribute('download') ||
        !link.href.startsWith(location.origin)
      ) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      flush()
        .then(() => location.assign(link.href))
        .catch((error: unknown) =>
          setProblem(error instanceof Error ? error.message : 'Save OpenCut before leaving.'),
        );
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [flush]);
  return { frame, ready, flush, problem };
};
