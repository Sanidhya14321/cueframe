import type { FrameStore } from '@/lib/frame-store';
import type { Project } from '@/project';

export interface TimelineProps {
  project: Project;
  pxPerFrame: number;
  frames: FrameStore;
  selectedId: string | null;
  activeTrackId: string | null;
  onSeek: (frame: number) => void;
  onActivateTrack: (trackId: string) => void;
  onSelectElement: (id: string) => void;
  onMoveElement: (id: string, from: number) => void;
  onResizeElement: (id: string, durationInFrames: number) => void;
  onTrimElementStart: (id: string, from: number) => void;
  onMoveElementToTrack: (id: string, trackId: string) => void;
  onMoveTrack: (trackId: string, direction: 'up' | 'down') => void;
  onRemoveTrack: (trackId: string) => void;
}
