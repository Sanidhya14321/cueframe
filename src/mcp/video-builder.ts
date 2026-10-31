import {
  addElement,
  addTrack,
  type CompositionElement,
  createCompositionElement,
  createTrack,
  type Project,
  projectContentEnd,
} from '@/project';
import { CLIP_DEFAULTS, type ClipId, getClipMeta } from '@/schemas';
import type { Orientation } from './clip-search';

const FORMAT_SIZES: Record<Orientation, { width: number; height: number }> = {
  landscape: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const mergeProps = (
  base: Record<string, unknown>,
  overrides: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    [...new Set([...Object.keys(base), ...Object.keys(overrides)])].map((key) => {
      const current = base[key];
      const next = overrides[key];
      if (next === undefined) {
        return [key, current];
      }
      return [
        key,
        isPlainObject(current) && isPlainObject(next) ? mergeProps(current, next) : next,
      ];
    }),
  );

export interface ClipPlacement {
  clipId: ClipId;
  props?: Record<string, unknown> | undefined;
  durationInFrames?: number | undefined;
  from?: number | undefined;
  track?: number | undefined;
}

const clipElement = (placement: ClipPlacement, from: number, fps: number): CompositionElement => {
  const meta = getClipMeta(placement.clipId);
  const defaults = structuredClone(CLIP_DEFAULTS[placement.clipId]) as Record<string, unknown>;
  return createCompositionElement(placement.clipId, mergeProps(defaults, placement.props ?? {}), {
    from,
    durationInFrames:
      placement.durationInFrames ?? Math.round((meta.durationInFrames / meta.fps) * fps),
  });
};

const trackEnd = (project: Project, trackIndex: number): number =>
  (project.tracks[trackIndex]?.elements ?? []).reduce(
    (end, element) => Math.max(end, element.from + element.durationInFrames),
    0,
  );

const withTrack = (project: Project, trackIndex: number): Project => {
  let next = project;
  while (next.tracks.length <= trackIndex) {
    next = addTrack(next, createTrack(`Track ${next.tracks.length + 1}`));
  }
  return next;
};

export const placeClip = (project: Project, placement: ClipPlacement): Project => {
  const index = Math.max(placement.track ?? 0, 0);
  const tracked = withTrack(project, index);
  const track = tracked.tracks[index];
  if (track === undefined) {
    return tracked;
  }
  const element = clipElement(placement, placement.from ?? trackEnd(tracked, index), tracked.fps);
  const added = addElement(tracked, track.id, element);
  return { ...added, durationInFrames: Math.max(added.durationInFrames, projectContentEnd(added)) };
};

export interface VideoSpec {
  orientation?: Orientation | undefined;
  fps?: number | undefined;
  background?: string | undefined;
  clips?: readonly ClipPlacement[] | undefined;
}

export const createVideoProject = (spec: VideoSpec): Project => {
  const first = spec.clips?.[0];
  const firstMeta = first === undefined ? null : getClipMeta(first.clipId);
  const size =
    spec.orientation === undefined && firstMeta !== null
      ? { width: firstMeta.width, height: firstMeta.height }
      : FORMAT_SIZES[spec.orientation ?? 'landscape'];
  const empty: Project = {
    ...size,
    fps: spec.fps ?? firstMeta?.fps ?? 30,
    durationInFrames: 1,
    background: spec.background ?? '#0a0a0a',
    tracks: [createTrack('Clips')],
  };
  const built = (spec.clips ?? []).reduce(
    (project, placement) => placeClip(project, placement),
    empty,
  );
  return { ...built, durationInFrames: Math.max(projectContentEnd(built), 30) };
};
