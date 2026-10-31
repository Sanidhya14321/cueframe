'use client';
import Link from 'next/link';
import { useState } from 'react';
import { LivePresence } from '@/components/clip-timeline/live-presence';
import { VideoEditorSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLiveProject } from '@/lib/use-live-project';
import type { Project } from '@/project';
import { OpenCutProjectTools } from './opencut-project-tools';
import { useOpenCutContext } from './use-opencut-context';
import { useOpenCutFrame } from './use-opencut-frame';
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
  const { frame, problem } = useOpenCutFrame();
  const editor = useLiveProject(title, `neuclip-video:${id}`, initialProject, id);
  const context = useOpenCutContext(frame);
  const [loaded, setLoaded] = useState(false);
  return (
    <LivePresence state={editor.state} undoAgent={editor.undoAgent} onSelect={context.select}>
      <section className="flex h-[calc(100dvh-6.5rem)] min-h-0 flex-col" aria-label="Video editor">
        <div className="flex min-h-12 shrink-0 flex-wrap items-center gap-3 border-b bg-sidebar px-3 py-2 text-xs">
          <strong>OpenCut</strong>
          {readOnly ? null : (
            <>
              <div className="lg:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="min-h-11 text-xs">
                      Project tools
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex max-h-[65dvh] w-[min(90vw,30rem)] flex-wrap gap-3 overflow-y-auto">
                    <OpenCutProjectTools editor={editor} {...context} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="hidden items-center gap-3 lg:contents">
                <OpenCutProjectTools editor={editor} {...context} />
              </div>
            </>
          )}
          <Link
            className="inline-flex min-h-11 items-center underline"
            href={`/video/${id}?workspace=animation`}
          >
            Animation controls & agent tools
          </Link>
          <span className="hidden text-muted-foreground lg:inline">
            Layers, media and agent edits share this local project. Remotion animations keep their
            editable source controls.
          </span>
          {problem ? <p role="alert">{problem}</p> : null}
        </div>
        {loaded ? null : (
          <div className="min-h-0 flex-1">
            <VideoEditorSkeleton />
          </div>
        )}
        {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: load only reveals the frame */}
        <iframe
          ref={frame}
          hidden={!loaded}
          onLoad={() => setLoaded(true)}
          title="OpenCut video editor"
          src={`/opencut/index.html?project=${id}${readOnly ? '&mode=render' : ''}`}
          className="min-h-0 w-full flex-1 border-0"
          allow="clipboard-read; clipboard-write"
        />
      </section>
    </LivePresence>
  );
};
