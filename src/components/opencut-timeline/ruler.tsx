'use client';
import { type FrameStore, useFrame } from '@/lib/frame-store';
import { LABEL_WIDTH } from '@/lib/timeline-geometry';
import { formatRulerLabel, getRulerConfig, shouldShowLabel } from './ruler-utils';

export const OpenCutRuler = ({
  fps,
  duration,
  scale,
  scroll,
  viewport,
  frames,
  seek,
}: {
  fps: number;
  duration: number;
  scale: number;
  scroll: number;
  viewport: number;
  frames: FrameStore;
  seek: (frame: number) => void;
}) => {
  const current = useFrame(frames);
  const config = getRulerConfig({ zoomLevel: (scale * fps) / 150, fps });
  const tickFrames = Math.max(1, Math.round(config.tickIntervalSeconds * fps));
  const start = Math.max(0, Math.floor((scroll - LABEL_WIDTH - 200) / scale / tickFrames));
  const end = Math.min(
    Math.ceil(duration / tickFrames),
    Math.ceil((scroll + viewport + 200) / scale / tickFrames),
  );
  return (
    <button
      type="button"
      aria-label="Seek timeline"
      className="relative h-11 shrink-0 touch-none bg-sidebar text-xs tabular-nums"
      style={{ width: duration * scale }}
      onPointerDown={(event) => {
        const left = event.currentTarget.getBoundingClientRect().left;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        seek(Math.max(0, Math.min(duration, Math.round((event.clientX - left) / scale))));
      }}
      onPointerMove={(event) => {
        if (event.buttons !== 1) {
          return;
        }
        seek(
          Math.max(
            0,
            Math.min(
              duration,
              Math.round(
                (event.clientX - event.currentTarget.getBoundingClientRect().left) / scale,
              ),
            ),
          ),
        );
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          seek(Math.max(0, Math.min(duration, current + (event.key === 'ArrowRight' ? 1 : -1))));
        }
      }}
    >
      {Array.from({ length: Math.max(0, end - start + 1) }, (_, offset) => {
        const frame = (start + offset) * tickFrames;
        const label = shouldShowLabel({
          time: frame / fps,
          labelIntervalSeconds: config.labelIntervalSeconds,
        });
        return (
          <span
            key={frame}
            className="absolute top-2 select-none border-l border-muted-foreground/30 pl-1 text-xs text-muted-foreground"
            style={{ left: frame * scale, height: label ? 28 : 6 }}
          >
            {label ? formatRulerLabel({ timeInSeconds: frame / fps, fps }) : ''}
          </span>
        );
      })}
    </button>
  );
};
