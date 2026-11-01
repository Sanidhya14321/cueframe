'use client';
import { Player } from '@remotion/player';
import {
  type ComponentType,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ClipPropertySidebar } from '@/components/clip-timeline/clip-property-sidebar';
import { CLIP_COMPONENTS } from '@/compositions/clip-components';
import type { useLiveProject } from '@/lib/use-live-project';
import { type CompositionElement, removeElement, replaceElement } from '@/project';

const SAVE_DELAY_MS = 500;

export const OpenCutFrameDock = ({
  editor,
  element,
  flushRef,
  open,
}: {
  editor: ReturnType<typeof useLiveProject>;
  element: CompositionElement;
  flushRef: RefObject<(() => void) | null>;
  open: boolean;
}) => {
  const [draft, setDraft] = useState(element);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current === null) {
      setDraft(element);
    }
  }, [element]);
  const latest = useRef({ editor, draft });
  latest.current = { editor, draft };
  const save = useCallback(() => {
    if (timer.current === null) {
      return;
    }
    clearTimeout(timer.current);
    timer.current = null;
    latest.current.editor.set(replaceElement(latest.current.editor.value, latest.current.draft));
  }, []);
  useEffect(() => {
    flushRef.current = save;
    return () => {
      flushRef.current = null;
    };
  }, [flushRef, save]);
  const change = (next: CompositionElement) => {
    setDraft(next);
    latest.current.draft = next;
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(save, SAVE_DELAY_MS);
  };
  return (
    <aside
      aria-label="Frame controls"
      className={`${open ? 'fixed inset-x-0 bottom-0 z-40 flex max-h-[70dvh] border-t' : 'hidden'} shrink-0 flex-col overflow-hidden bg-card lg:static lg:flex lg:max-h-none lg:w-72 lg:border-t-0 lg:border-l`}
    >
      <div className="shrink-0 border-b p-2">
        <Player
          acknowledgeRemotionLicense
          autoPlay
          component={
            (CLIP_COMPONENTS as unknown as Record<string, ComponentType<Record<string, unknown>>>)[
              draft.clipId
            ] as ComponentType<Record<string, unknown>>
          }
          compositionHeight={editor.value.height}
          compositionWidth={editor.value.width}
          controls
          durationInFrames={Math.max(1, draft.durationInFrames)}
          fps={editor.value.fps}
          inputProps={draft.props}
          loop
          style={{ width: '100%' }}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ClipPropertySidebar
          element={draft}
          onChange={(next) => change(next as CompositionElement)}
          onDelete={(id) => editor.set(removeElement(editor.value, id))}
        />
      </div>
    </aside>
  );
};
