import type { TimelineProps } from './contract';

export const snappedFrame = (frame: number, id: string, props: TimelineProps): number => {
  const points = [
    0,
    props.frames.get(),
    ...props.project.tracks.flatMap((track) =>
      track.elements
        .filter((item) => item.id !== id)
        .flatMap((item) => [item.from, item.from + item.durationInFrames]),
    ),
  ];
  const nearest = points.toSorted((a, b) => Math.abs(a - frame) - Math.abs(b - frame))[0];
  return nearest !== undefined && Math.abs(nearest - frame) * props.pxPerFrame < 8
    ? nearest
    : frame;
};
export const laneAt = (event: globalThis.PointerEvent): string | null => {
  const hovered = document.elementFromPoint?.(event.clientX, event.clientY) ?? event.target;
  const lane =
    hovered instanceof Element
      ? hovered.closest('[data-track-id]')?.getAttribute('data-track-id')
      : null;
  return (
    lane ??
    (event.target instanceof Element
      ? (event.target.closest('[data-track-id]')?.getAttribute('data-track-id') ?? null)
      : null)
  );
};
