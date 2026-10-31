'use client';
import { type RefObject, useEffect, useState } from 'react';
import { createFrameStore } from '@/lib/frame-store';
export const useOpenCutContext = (iframe: RefObject<HTMLIFrameElement | null>) => {
  const [frames] = useState(createFrameStore);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => {
    const receive = (event: MessageEvent<unknown>) => {
      if (event.origin !== location.origin || event.source !== iframe.current?.contentWindow) {
        return;
      }
      const data = event.data;
      if (
        !(data && typeof data === 'object' && 'type' in data && data.type === 'clipkit-context')
      ) {
        return;
      }
      if ('frame' in data && typeof data.frame === 'number' && Number.isFinite(data.frame)) {
        frames.set(Math.max(0, Math.round(data.frame)));
      }
      if (
        'selectedId' in data &&
        (data.selectedId === null || typeof data.selectedId === 'string')
      ) {
        setSelectedId(data.selectedId);
      }
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [iframe, frames]);
  const select = (id: string) =>
    iframe.current?.contentWindow?.postMessage({ type: 'clipkit-focus', id }, location.origin);
  const seek = (frame: number) =>
    iframe.current?.contentWindow?.postMessage({ type: 'clipkit-seek', frame }, location.origin);
  return { frames, selectedId, select, seek };
};
