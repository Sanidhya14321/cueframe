'use client';
import { ChevronDown, ChevronUp, MoreHorizontal, Trash2 } from 'lucide-react';
import type { PointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LABEL_WIDTH } from '@/lib/timeline-geometry';
import { cn } from '@/lib/utils';
import type { Track } from '@/project';
import { type Gesture, OpenCutClip } from './clip';

export const OpenCutTrack = ({
  track,
  width,
  scale,
  active,
  drop,
  selected,
  index,
  count,
  activate,
  reorder,
  remove,
  begin,
  select,
}: {
  track: Track;
  width: number;
  scale: number;
  active: boolean;
  drop: boolean;
  selected: string | null;
  index: number;
  count: number;
  activate: (id: string) => void;
  reorder: (id: string, direction: 'up' | 'down') => void;
  remove: (id: string) => void;
  select: (id: string) => void;
  begin: (id: string, mode: Gesture, event: PointerEvent) => void;
}) => {
  const audio = track.elements.length > 0 && track.elements.every((item) => item.type === 'audio');
  const height = audio ? 50 : 65;
  return (
    <div className="flex" style={{ minHeight: height }}>
      <div
        className={cn(
          'sticky left-0 z-20 flex shrink-0 items-center border-r bg-sidebar pl-2',
          active && 'bg-accent',
        )}
        style={{ width: LABEL_WIDTH }}
      >
        <button
          type="button"
          className="min-h-11 min-w-0 flex-1 truncate text-left text-xs font-medium"
          onClick={() => activate(track.id)}
        >
          {track.name}
        </button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="size-11 shrink-0"
              aria-label={`Track options: ${track.name}`}
            >
              <MoreHorizontal />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 space-y-1">
            <Button
              variant="ghost"
              className="min-h-11 w-full justify-start"
              aria-label={`Move ${track.name} up`}
              disabled={index === 0}
              onClick={() => reorder(track.id, 'up')}
            >
              <ChevronUp />
              Move up
            </Button>
            <Button
              variant="ghost"
              className="min-h-11 w-full justify-start"
              aria-label={`Move ${track.name} down`}
              disabled={index === count - 1}
              onClick={() => reorder(track.id, 'down')}
            >
              <ChevronDown />
              Move down
            </Button>
            <Button
              variant="ghost"
              className="min-h-11 w-full justify-start"
              aria-label={`Remove ${track.name}`}
              disabled={count < 2}
              onClick={() => remove(track.id)}
            >
              <Trash2 />
              Remove track
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div
        data-track-id={track.id}
        className={cn(
          'relative border-b border-border/40',
          drop ? 'bg-selection/10 ring-1 ring-inset ring-selection' : 'bg-background/40',
        )}
        style={{ width, height }}
      >
        {track.elements.map((item) => (
          <OpenCutClip
            key={item.id}
            item={item}
            scale={scale}
            selected={selected === item.id}
            begin={begin}
            select={select}
          />
        ))}
      </div>
    </div>
  );
};
