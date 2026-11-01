'use client';
import { SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LivePresence } from '@/components/clip-timeline/live-presence';
import { VideoEditorSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLiveProject } from '@/lib/use-live-project';
import { findElement, type Project } from '@/project';
import { AgentMenu } from './agent-menu';
import { ExportVideo } from './export-video';
import { OpenCutProjectTools } from './opencut-project-tools';
import { useOpenCutContext } from './use-opencut-context';
import { useOpenCutFrame } from './use-opencut-frame';

const OpenCutFrameDock = dynamic(
  () => import('./opencut-frame-dock').then((module) => module.OpenCutFrameDock),
  { ssr: false },
);

export const OpenCutEditor = ({
  id,
  title,
  initialProject,
  readOnly = false,
}: {
  id: string;
  title: string;
  initialProject: Project;
  readOnly?: boolean;
}) => {
  const { frame, flush, problem } = useOpenCutFrame();
  const editor = useLiveProject(title, `neuclip-video:${id}`, initialProject, id);
  const context = useOpenCutContext(frame);
  const [loaded, setLoaded] = useState(false);
  const [frameOpen, setFrameOpen] = useState(false);
  const dockFlush = useRef<(() => void) | null>(null);
  const { settled } = editor;
  const checkpoint = useCallback(async () => {
    await flush();
    dockFlush.current?.();
    await settled();
  }, [flush, settled]);
  const waiting = editor.state?.events.some(
    (event) => event.kind === 'job' && event.status !== 'done',
  );
  useEffect(() => {
    if (frame.current?.contentDocument?.readyState === 'complete') {
      setLoaded(true);
    }
  }, [frame]);
  const selected = context.selectedId
    ? findElement(editor.value, context.selectedId)?.element
    : null;
  return (
    <LivePresence
      hideBar
      state={editor.state}
      undoAgent={editor.undoAgent}
      onSelect={context.select}
    >
      <section
        className="flex h-[calc(100dvh-2.75rem)] md:h-[calc(100dvh-2.75rem)] min-h-0 flex-col"
        aria-label="Video editor"
      >
        <div className="flex h-9 shrink-0 items-center gap-1 border-b px-2 text-xs">
          {readOnly || !editor.state ? null : (
            <>
              {waiting ? (
                <Link
                  href="/connect"
                  className="min-w-0 truncate text-agent underline-offset-2 hover:underline"
                >
                  Draft, waiting for an agent
                </Link>
              ) : null}
              <span className="mr-auto" />
              <span
                role="status"
                aria-label="Project sync"
                className="whitespace-nowrap text-muted-foreground"
              >
                {editor.status}
              </span>
              <AgentMenu
                editor={editor}
                frames={context.frames}
                selectedId={context.selectedId}
                select={context.select}
              />
              {selected?.type === 'composition' ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Frame controls"
                  aria-pressed={frameOpen}
                  onClick={() => setFrameOpen((current) => !current)}
                >
                  <SlidersHorizontal />
                </Button>
              ) : null}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    Tools
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex max-h-[65dvh] w-[min(90vw,30rem)] flex-wrap gap-3 overflow-y-auto">
                  <OpenCutProjectTools editor={editor} {...context} />
                </PopoverContent>
              </Popover>
              <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
                <Link href={`/video/${id}?workspace=animation`}>Animation workspace</Link>
              </Button>
              <ExportVideo projectId={editor.state.id} checkpoint={checkpoint} />
            </>
          )}
          {problem ? <p role="alert">{problem}</p> : null}
        </div>
        {loaded ? null : (
          <div className="min-h-0 flex-1">
            <VideoEditorSkeleton />
          </div>
        )}
        <div className="flex min-h-0 flex-1">
          {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: load only reveals the frame */}
          <iframe
            ref={frame}
            hidden={!loaded}
            onLoad={() => setLoaded(true)}
            title="Video editor"
            src={`/opencut/index.html?project=${id}${readOnly ? '&mode=render' : ''}`}
            className="min-h-0 min-w-0 flex-1 border-0"
            allow="clipboard-read; clipboard-write"
          />
          {selected?.type === 'composition' && !readOnly ? (
            <OpenCutFrameDock
              key={selected.id}
              editor={editor}
              element={selected}
              flushRef={dockFlush}
              open={frameOpen}
            />
          ) : null}
        </div>
      </section>
    </LivePresence>
  );
};
