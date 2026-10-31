'use client';
import { Player } from '@remotion/player';
import { type ComponentType, useEffect, useRef, useState } from 'react';
import { ClipPropertySidebar } from '@/components/clip-timeline/clip-property-sidebar';
import { CLIP_COMPONENTS } from '@/compositions/clip-components';
import type { useLiveProject } from '@/lib/use-live-project';
import { type CompositionElement, removeElement, replaceElement } from '@/project';

const SAVE_DELAY_MS = 500;

export const OpenCutFrameDock = ({
  editor,
  element,
}: {
  editor: ReturnType<typeof useLiveProject>;
  element: CompositionElement;
}) => {
  const [draft, setDraft] = useState(element);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (timer.current === null) {
      setDraft(element);
    }
  }, [element]);
  const change = (next: CompositionElement) => {
    setDraft(next);
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      timer.current = null;
      editor.set(replaceElement(editor.value, next));
    }, SAVE_DELAY_MS);
  };
  return (
    <aside aria-label="Frame controls" className="hidden w-80 shrink-0 flex-col border-l lg:flex">
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
