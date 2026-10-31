'use client';
import { Magnet } from 'lucide-react';
import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { type FrameStore, useFrame } from '@/lib/frame-store';
import { LABEL_WIDTH } from '@/lib/timeline-geometry';
import type { Gesture } from './clip';
import type { TimelineProps } from './contract';
import { laneAt, snappedFrame } from './drag-utils';
import { OpenCutRuler } from './ruler';
import { OpenCutTrack } from './track';

const OpenCutPlayhead = ({ frames, scale }: { frames: FrameStore; scale: number }) => {
  const frame = useFrame(frames);
  return (
    <div
      data-testid="playhead"
      aria-hidden
      className="pointer-events-none absolute inset-y-0 z-30 w-px bg-selection"
      style={{ left: LABEL_WIDTH + frame * scale }}
    >
      <span className="absolute -left-1 top-0 size-2 rotate-45 bg-selection" />
    </div>
  );
};
const Timecode = ({ frames, fps }: { frames: FrameStore; fps: number }) => {
  const frame = useFrame(frames);
  return (
    <output aria-label="Timeline timecode" className="text-xs tabular-nums text-muted-foreground">
      {String(Math.floor(frame / fps / 60)).padStart(2, '0')}:
      {String(Math.floor(frame / fps) % 60).padStart(2, '0')}:{String(frame % fps).padStart(2, '0')}
    </output>
  );
};
type Drag = {
  id: string;
  mode: Gesture;
  x: number;
  base: number;
  origin: string;
  target: string;
  capture: HTMLElement | null;
  pointer: number;
};
export const OpenCutTimeline = (props: TimelineProps) => {
  const { project, pxPerFrame: scale, frames } = props;
  const latest = useRef(props);
  latest.current = props;
  const drag = useRef<Drag | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [target, setTarget] = useState<string | null>(null);
  const [snap, setSnap] = useState(false);
  const snapping = useRef(snap);
  snapping.current = snap;
  useEffect(() => {
    const element = viewport.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver(() => setViewportWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const end = (commit: boolean) => {
      const gesture = drag.current;
      if (!gesture) {
        return;
      }
      if (commit && gesture.mode === 'move' && gesture.target !== gesture.origin) {
        latest.current.onMoveElementToTrack(gesture.id, gesture.target);
      }
      if (gesture.capture?.hasPointerCapture?.(gesture.pointer)) {
        gesture.capture.releasePointerCapture(gesture.pointer);
      }
      drag.current = null;
      setTarget(null);
    };
    const move = (event: globalThis.PointerEvent) => {
      const gesture = drag.current;
      if (!gesture) {
        return;
      }
      const current = latest.current;
      const delta = Math.round((event.clientX - gesture.x) / current.pxPerFrame);
      let frame = Math.max(0, gesture.base + delta);
      if (snapping.current && gesture.mode !== 'resize') {
        frame = snappedFrame(frame, gesture.id, current);
      }
      if (gesture.mode === 'trim') {
        current.onTrimElementStart(gesture.id, frame);
      } else if (gesture.mode === 'resize') {
        current.onResizeElement(gesture.id, Math.max(1, frame));
      } else {
        current.onMoveElement(gesture.id, frame);
        const lane = laneAt(event);
        if (lane) {
          gesture.target = lane;
          setTarget(lane);
        }
      }
    };
    const up = () => end(true);
    const cancel = () => end(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('blur', cancel);
    };
  }, []);
  const begin = (id: string, mode: Gesture, event: PointerEvent) => {
    const origin = project.tracks.find((track) => track.elements.some((entry) => entry.id === id));
    const item = origin?.elements.find((entry) => entry.id === id);
    if (!(item && origin)) {
      return;
    }
    props.onSelectElement(id);
    event.preventDefault();
    const capture = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    capture?.setPointerCapture?.(event.pointerId);
    drag.current = {
      id,
      mode,
      x: event.clientX,
      base: mode === 'resize' ? item.durationInFrames : item.from,
      origin: origin.id,
      target: origin.id,
      capture,
      pointer: event.pointerId,
    };
  };
  const width = Math.max(project.durationInFrames * scale, viewportWidth - LABEL_WIDTH);
  return (
    <section
      aria-label="OpenCut timeline"
      data-timeline-engine="opencut-classic-adapter"
      className="flex h-full min-h-0 flex-col bg-sidebar"
    >
      <div className="flex shrink-0 items-center justify-between border-y px-3">
        <Button
          variant="ghost"
          className="min-h-11 text-xs"
          aria-pressed={snap}
          onClick={() => setSnap(!snap)}
        >
          <Magnet />
          Snapping {snap ? 'on' : 'off'}
        </Button>
        <Timecode frames={frames} fps={project.fps} />
        <span className="text-xs text-muted-foreground">{project.tracks.length} tracks</span>
      </div>
      <div
        ref={viewport}
        className="min-h-0 flex-1 overflow-auto"
        onScroll={(event) => setScroll(event.currentTarget.scrollLeft)}
      >
        <div className="relative" style={{ width: width + LABEL_WIDTH, minWidth: '100%' }}>
          <div className="sticky top-0 z-30 flex bg-sidebar">
            <div
              className="sticky left-0 z-30 shrink-0 bg-sidebar"
              style={{ width: LABEL_WIDTH }}
            />
            <OpenCutRuler
              fps={project.fps}
              duration={project.durationInFrames}
              scale={scale}
              scroll={scroll}
              viewport={viewportWidth}
              frames={frames}
              seek={props.onSeek}
            />
          </div>
          <div className="relative flex flex-col gap-1 pb-6">
            {project.tracks.map((track, index) => (
              <OpenCutTrack
                key={track.id}
                track={track}
                width={width}
                scale={scale}
                active={track.id === props.activeTrackId}
                drop={target === track.id}
                selected={props.selectedId}
                index={index}
                count={project.tracks.length}
                activate={props.onActivateTrack}
                reorder={props.onMoveTrack}
                remove={props.onRemoveTrack}
                begin={begin}
                select={props.onSelectElement}
              />
            ))}
            <OpenCutPlayhead frames={frames} scale={scale} />
          </div>
        </div>
      </div>
    </section>
  );
};
