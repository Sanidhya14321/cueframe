'use client';
import { AgentRequests } from '@/components/clip-timeline/agent-requests';
import { BuildVideo } from '@/components/clip-timeline/build-video';
import { ClipPropertySidebar } from '@/components/clip-timeline/clip-property-sidebar';
import { MediaTools } from '@/components/clip-timeline/media-tools';
import { ProjectComments } from '@/components/clip-timeline/project-comments';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { FrameStore } from '@/lib/frame-store';
import type { useLiveProject } from '@/lib/use-live-project';
import { findElement, removeElement, replaceElement } from '@/project';

type Props = {
  editor: ReturnType<typeof useLiveProject>;
  frames: FrameStore;
  selectedId: string | null;
  select: (id: string) => void;
  seek: (frame: number) => void;
};
export const OpenCutProjectTools = ({ editor, frames, selectedId, select, seek }: Props) => {
  const state = editor.state;
  if (!state) {
    return null;
  }
  const selected = selectedId ? findElement(editor.value, selectedId)?.element : null;
  return (
    <>
      <BuildVideo projectId={state.id} />
      <AgentRequests
        state={state}
        frames={frames}
        selectedId={selectedId}
        project={editor.value}
        onChange={editor.set}
      />
      <ProjectComments
        state={state}
        frames={frames}
        selectedId={selectedId}
        onSelect={select}
        onSeek={seek}
      />
      <MediaTools
        projectId={state.id}
        project={editor.value}
        selectedId={selectedId}
        onChange={editor.set}
      />
      {selected?.type === 'composition' ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-h-11 text-xs">
              Animation controls
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-h-[min(70dvh,var(--radix-popover-content-available-height))] w-80 overflow-auto p-0">
            <ClipPropertySidebar
              element={selected}
              onChange={(next) => editor.set(replaceElement(editor.value, next))}
              onDelete={(id) => editor.set(removeElement(editor.value, id))}
            />
          </PopoverContent>
        </Popover>
      ) : null}
      <span role="status" aria-label="Project sync">
        {editor.status}
      </span>
      {editor.problem ? (
        <button type="button" onClick={editor.clearProblem} className="text-destructive">
          {editor.problem}
        </button>
      ) : null}
    </>
  );
};
