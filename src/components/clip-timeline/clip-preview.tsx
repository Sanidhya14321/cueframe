'use client';

import { Player, type PlayerRef } from '@remotion/player';
import { Maximize, Monitor, Smartphone, Square } from 'lucide-react';
import { type ComponentType, type RefObject, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectComposition } from '@/compositions/project/project-composition';
import { usePersistedState } from '@/lib/use-persisted-state';
import { cn } from '@/lib/utils';
import type { Project } from '@/project';

const DEVICES = [
  { key: 'mobile', label: 'Mobile', icon: Smartphone, maxWidth: 420 },
  { key: 'square', label: 'Square', icon: Square, maxWidth: 640 },
  { key: 'desktop', label: 'Desktop', icon: Monitor, maxWidth: 980 },
  { key: 'full', label: 'Full', icon: Maximize, maxWidth: null },
] as const;

type DeviceKey = (typeof DEVICES)[number]['key'];

type PreviewView = 'editor' | 'demo';

const isPreviewView = (value: string): value is PreviewView =>
  value === 'editor' || value === 'demo';

const frameWidth = (maxWidth: number | null, aspect: number): string =>
  `min(100%, ${maxWidth === null ? '' : `${maxWidth}px, `}${aspect * 100}cqh)`;

const Composition = ProjectComposition as ComponentType<Record<string, unknown>>;

interface ClipPreviewProps {
  project: Project;
  demoSrc: string | null;
  playerRef: RefObject<PlayerRef | null>;
  onFrameChange: (frame: number) => void;
  onPlayingChange: (playing: boolean) => void;
}

export const ClipPreview = ({
  project,
  demoSrc,
  playerRef,
  onFrameChange,
  onPlayingChange,
}: ClipPreviewProps) => {
  const [device, setDevice] = usePersistedState<DeviceKey>('neuclip-device', 'desktop');
  const active = DEVICES.find((entry) => entry.key === device) ?? DEVICES[2];
  const [view, setView] = usePersistedState<PreviewView>('neuclip-preview-view', 'editor');
  const shownView: PreviewView = demoSrc === null ? 'editor' : view;

  useEffect(() => {
    const player = playerRef.current;
    if (player === null) {
      return;
    }
    const handleFrame = (event: { detail: { frame: number } }) => onFrameChange(event.detail.frame);
    const handlePlay = () => onPlayingChange(true);
    const handlePause = () => onPlayingChange(false);
    player.addEventListener('frameupdate', handleFrame);
    player.addEventListener('play', handlePlay);
    player.addEventListener('pause', handlePause);
    return () => {
      player.removeEventListener('frameupdate', handleFrame);
      player.removeEventListener('play', handlePlay);
      player.removeEventListener('pause', handlePause);
    };
  }, [playerRef, onFrameChange, onPlayingChange]);

  return (
    <Tabs
      value={shownView}
      onValueChange={(next) => {
        if (!isPreviewView(next)) {
          return;
        }
        if (next === 'demo') {
          playerRef.current?.pause();
        }
        setView(next);
      }}
      className="h-full gap-0"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 sm:gap-3 sm:p-3">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="demo" disabled={demoSrc === null}>
            Demo
          </TabsTrigger>
        </TabsList>
        <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
          {DEVICES.map((entry) => {
            const Icon = entry.icon;
            return (
              <button
                key={entry.key}
                type="button"
                onClick={() => setDevice(entry.key)}
                aria-label={entry.label}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-muted-foreground text-xs transition-colors',
                  entry.key === device && 'bg-background text-foreground shadow-sm',
                )}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{entry.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div
        className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 sm:p-6"
        style={{ containerType: 'size' }}
      >
        <div
          className="overflow-hidden rounded-xl bg-black shadow-xl"
          style={{ width: frameWidth(active.maxWidth, project.width / project.height) }}
        >
          <TabsContent value="editor" forceMount className="data-[state=inactive]:hidden">
            <Player
              ref={playerRef}
              component={Composition}
              inputProps={project as unknown as Record<string, unknown>}
              durationInFrames={project.durationInFrames}
              fps={project.fps}
              compositionWidth={project.width}
              compositionHeight={project.height}
              acknowledgeRemotionLicense
              controls
              loop
              style={{ width: '100%' }}
            />
          </TabsContent>
          {demoSrc === null ? null : (
            <TabsContent value="demo">
              <video
                src={demoSrc}
                aria-label="Demo video"
                className="block w-full"
                autoPlay
                loop
                muted
                playsInline
              />
            </TabsContent>
          )}
        </div>
      </div>
    </Tabs>
  );
};
