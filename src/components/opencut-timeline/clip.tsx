'use client';
import { Captions, Film, ImageIcon, Lock, Music, Shapes, Type } from 'lucide-react';
import type { PointerEvent } from 'react';
import { useItemPresence } from '@/components/clip-timeline/live-presence';
import { cn } from '@/lib/utils';
import type { Element } from '@/project';

const labels = {
  composition: 'Clip',
  video: 'Video',
  audio: 'Audio',
  captions: 'Captions',
  image: 'Image',
  shape: 'Shape',
  text: 'Text',
};
const icons = {
  composition: Film,
  video: Film,
  audio: Music,
  captions: Captions,
  image: ImageIcon,
  shape: Shapes,
  text: Type,
};
export type Gesture = 'move' | 'trim' | 'resize';
export const OpenCutClip = ({
  item,
  scale,
  selected,
  begin,
  select,
}: {
  item: Element;
  scale: number;
  selected: boolean;
  select: (id: string) => void;
  begin: (id: string, mode: Gesture, event: PointerEvent) => void;
}) => {
  const { locked, recent } = useItemPresence(item.id);
  const Icon = icons[item.type];
  const name =
    item.type === 'text'
      ? item.content
      : item.type === 'composition'
        ? item.clipId.replaceAll('-', ' ')
        : labels[item.type];
  return (
    <button
      type="button"
      aria-label={`${labels[item.type]} element`}
      aria-pressed={selected}
      data-element-id={item.id}
      data-locked={locked}
      title={locked ? 'Locked while the agent edits this item' : name}
      className={cn(
        'absolute inset-y-1 flex touch-none select-none items-center gap-2 overflow-hidden rounded-md border-2 px-3 text-left text-xs',
        selected
          ? 'border-selection bg-selection/20 text-foreground'
          : 'border-transparent bg-muted text-foreground hover:bg-accent',
        locked && 'border-agent',
        recent && 'outline-2 outline-agent',
      )}
      style={{ left: item.from * scale, width: Math.max(12, item.durationInFrames * scale) }}
      onClick={() => select(item.id)}
      onPointerDown={(event) => {
        if (!locked) {
          begin(item.id, 'move', event);
        }
      }}
    >
      <Icon className="size-4 shrink-0" />
      <span className="min-w-0 truncate font-medium">{name}</span>
      {locked ? <Lock className="size-3 shrink-0 text-agent" /> : null}
      {(['trim', 'resize'] as const).map((mode) => (
        <span
          key={mode}
          data-handle={mode}
          aria-hidden
          className={cn(
            'absolute inset-y-0 w-3 cursor-ew-resize touch-none hover:bg-selection/30',
            mode === 'trim' ? 'left-0' : 'right-0',
          )}
          onPointerDown={(event) => {
            event.stopPropagation();
            if (!locked) {
              begin(item.id, mode, event);
            }
          }}
        />
      ))}
    </button>
  );
};
