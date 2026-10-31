import type { Quad } from './homography';

export type TrackFrame = {
  doors: readonly [number, number];
  quads: Readonly<Record<string, Quad>>;
};

export type FootageTrack = { width: number; height: number; frames: TrackFrame[] };

type RawTrack = {
  width: number;
  height: number;
  frames: { doors: number[]; quads: Record<string, number[][]> }[];
};

const toQuad = (points: number[][]): Quad => {
  const [p0, p1, p2, p3] = points.map(([x = 0, y = 0]) => [x, y] as const);
  if (p0 === undefined || p1 === undefined || p2 === undefined || p3 === undefined) {
    throw new Error('A tracked quad needs four corners');
  }
  return [p0, p1, p2, p3];
};

export const parseTrack = (raw: RawTrack): FootageTrack => ({
  width: raw.width,
  height: raw.height,
  frames: raw.frames.map((frame) => ({
    doors: [frame.doors[0] ?? 0, frame.doors[1] ?? raw.width],
    quads: Object.fromEntries(
      Object.entries(frame.quads).map(([name, points]) => [name, toQuad(points)]),
    ),
  })),
});

export const frameAt = (track: FootageTrack, index: number): TrackFrame => {
  const found = track.frames[Math.min(track.frames.length - 1, Math.max(0, Math.round(index)))];
  if (found === undefined) {
    throw new Error('The footage track is empty');
  }
  return found;
};
