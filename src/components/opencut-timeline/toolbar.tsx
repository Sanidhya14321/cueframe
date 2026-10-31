'use client';
import {
  Layers,
  Maximize2,
  Pause,
  Play,
  Redo2,
  Scissors,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { ExportControls } from '@/components/timeline/export-controls';
import { Button } from '@/components/ui/button';
import { type FrameStore, useFrame } from '@/lib/frame-store';
import { MAX_PX_PER_FRAME, MIN_PX_PER_FRAME, ZOOM_STEP } from '@/lib/timeline-geometry';
import type { ExportDownload, ExportSettings, ExportState } from '@/lib/use-project-export';
import type { ElementType, VideoElement } from '@/project';

interface AnimationOption {
  id: string;
  title: string;
}

interface TimelineToolbarProps {
  frames?: FrameStore;
  splitTarget?: VideoElement | null;
  onSplit?: () => void;
  pxPerFrame: number;
  playing: boolean;
  canUndo: boolean;
  canRedo: boolean;
  exportState: ExportState;
  exportProgress: number;
  download: ExportDownload | null;
  exportError: string | null;
  animations: readonly AnimationOption[];
  onAddElement: (type: ElementType) => void;
  onAddAnimation: (clipId: string) => void;
  onAddTrack: () => void;
  onZoom: (pxPerFrame: number) => void;
  onFit: () => void;
  onTogglePlay: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: (settings: ExportSettings) => void;
}

const SplitControl = ({
  frames,
  item,
  split,
}: {
  frames: FrameStore;
  item: VideoElement | null;
  split: (() => void) | undefined;
}) => {
  const frame = useFrame(frames);
  return (
    <Button
      variant="ghost"
      className="size-11"
      aria-label="Split selected video"
      disabled={
        !(item && split) || frame <= item.from || frame >= item.from + item.durationInFrames
      }
      onClick={split}
    >
      <Scissors />
    </Button>
  );
};
const ADD_TYPES: ElementType[] = ['text', 'image', 'video', 'shape'];
export const OpenCutToolbar = (props: TimelineToolbarProps) => (
  <fieldset
    aria-label="Timeline editing tools"
    className="flex min-h-12 min-w-0 shrink-0 flex-nowrap items-center gap-1 overflow-x-auto border-t px-2 py-1 lg:flex-wrap lg:overflow-visible"
  >
    <div className="flex shrink-0 items-center border-r pr-2">
      <Button
        variant="ghost"
        className="size-11"
        aria-label="Undo"
        disabled={!props.canUndo}
        onClick={props.onUndo}
      >
        <Undo2 />
      </Button>
      <Button
        variant="ghost"
        className="size-11"
        aria-label="Redo"
        disabled={!props.canRedo}
        onClick={props.onRedo}
      >
        <Redo2 />
      </Button>
    </div>
    <Button
      variant="ghost"
      className="size-11"
      aria-label={props.playing ? 'Pause' : 'Play'}
      onClick={props.onTogglePlay}
    >
      {props.playing ? <Pause /> : <Play />}
    </Button>
    {props.frames ? (
      <SplitControl frames={props.frames} item={props.splitTarget ?? null} split={props.onSplit} />
    ) : null}
    <label className="flex min-h-11 shrink-0 items-center px-2 text-xs">
      <span className="sr-only">Add element</span>
      <select
        aria-label="Add element"
        className="max-w-28 bg-sidebar p-2"
        value=""
        onChange={(event) => props.onAddElement(event.target.value as ElementType)}
      >
        <option value="" disabled>
          Add element
        </option>
        {ADD_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </label>
    <label className="flex min-h-11 shrink-0 items-center px-2 text-xs">
      <span className="sr-only">Animation</span>
      <select
        aria-label="Add animation"
        className="max-w-36 bg-sidebar p-2"
        value=""
        onChange={(event) => props.onAddAnimation(event.target.value)}
      >
        <option value="" disabled>
          Animation
        </option>
        {props.animations.map((clip) => (
          <option key={clip.id} value={clip.id}>
            {clip.title}
          </option>
        ))}
      </select>
    </label>
    <Button variant="ghost" className="min-h-11 text-xs" onClick={props.onAddTrack}>
      <Layers />
      Add track
    </Button>
    <div className="ml-auto flex shrink-0 items-center">
      <Button
        variant="ghost"
        className="size-11"
        aria-label="Zoom out"
        disabled={props.pxPerFrame <= MIN_PX_PER_FRAME}
        onClick={() => props.onZoom(props.pxPerFrame / ZOOM_STEP)}
      >
        <ZoomOut />
      </Button>
      <Button
        variant="ghost"
        className="size-11"
        aria-label="Zoom in"
        disabled={props.pxPerFrame >= MAX_PX_PER_FRAME}
        onClick={() => props.onZoom(props.pxPerFrame * ZOOM_STEP)}
      >
        <ZoomIn />
      </Button>
      <Button variant="ghost" className="size-11" aria-label="Fit timeline" onClick={props.onFit}>
        <Maximize2 />
      </Button>
      <ExportControls
        state={props.exportState}
        progress={props.exportProgress}
        download={props.download}
        error={props.exportError}
        onExport={props.onExport}
      />
    </div>
  </fieldset>
);
