import { writeFileSync } from 'node:fs';
import { FOOTAGE } from '@/footage';
import type { FootageSpec, FootageTracking } from '@/footage/footage-spec';
import { plateFrameOrder } from './assemble-plate';
import { type BoardColor, type ColorMask, colorMask, trackByColor } from './color-track';
import { doorEdges } from './door-edges';
import { plateFile, trackFile } from './footage-paths';
import {
  alignCorners,
  type Corners,
  type Grid,
  halve,
  makeGrid,
  type Plane,
  sampleTemplate,
  toPlane,
} from './plane-track';

const DEFAULT_MARGIN = 0.05;
const DOOR_MARGIN = 6;
const MOMENTUM = 0.7;
const HOLD_BELOW = 0.25;
const FULL_ABOVE = 0.92;

type Pose = Record<string, Corners>;

type Frames = { planes: Plane[]; masks: ColorMask[][] };

const boardColors = (spec: FootageSpec): BoardColor[] =>
  spec.shots.flatMap((shot) => shot.tracking.anchors.flatMap((anchor) => anchor.color ?? []));

const readPlanes = async (spec: FootageSpec): Promise<Frames> => {
  const colors = boardColors(spec);
  const size = spec.width * spec.height * 3;
  const decoder = Bun.spawn(
    [
      'ffmpeg',
      '-v',
      'error',
      '-i',
      plateFile(spec),
      '-vf',
      `crop=${spec.width}:${spec.height}:0:0`,
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgb24',
      '-',
    ],
    { stdout: 'pipe' },
  );
  const planes: Plane[] = [];
  const masks: ColorMask[][] = colors.map(() => []);
  const reader = decoder.stdout.getReader();
  let pending = new Uint8Array(0);
  for (let next = await reader.read(); !next.done; next = await reader.read()) {
    const joined = new Uint8Array(pending.length + next.value.length);
    joined.set(pending);
    joined.set(next.value, pending.length);
    let offset = 0;
    while (joined.length - offset >= size) {
      const rgb = joined.subarray(offset, offset + size);
      planes.push(toPlane(rgb, spec.width, spec.height));
      for (const [at, color] of colors.entries()) {
        masks[at]?.push(colorMask(rgb, spec.width, spec.height, color));
      }
      offset += size;
    }
    pending = joined.slice(offset);
  }
  await decoder.exited;
  return { planes, masks };
};

type Level = { plane: Plane; scale: number };

const levels = (plane: Plane): Level[] => {
  const half = halve(plane);
  return [
    { plane: halve(half), scale: 0.25 },
    { plane: half, scale: 0.5 },
    { plane, scale: 1 },
  ];
};

const predict = (previous: Pose, before: Pose | undefined): Pose =>
  before === undefined
    ? previous
    : Object.fromEntries(
        Object.entries(previous).map(([name, corners]) => [
          name,
          corners.map(([x, y], corner) => {
            const [bx, by] = before[name]?.[corner] ?? [x, y];
            return [x + (x - bx) * MOMENTUM, y + (y - by) * MOMENTUM];
          }) as Corners,
        ]),
      );

const templates = (anchor: Plane, corners: Corners, grid: Grid) =>
  levels(anchor).map(({ plane, scale }) => sampleTemplate(plane, corners, grid, scale));

const alignPage = (
  plane: Plane,
  start: Corners,
  pageTemplates: Float64Array[],
  doors: [number, number],
  grid: Grid,
): Corners => {
  const allowed = (x: number) => x > doors[0] + DOOR_MARGIN && x < doors[1] - DOOR_MARGIN;
  const xs = start.map(([x]) => x);
  const [low, high] = [Math.min(...xs), Math.max(...xs)];
  const shown =
    (Math.min(high, doors[1] - DOOR_MARGIN) - Math.max(low, doors[0] + DOOR_MARGIN)) / (high - low);
  if (shown < HOLD_BELOW) {
    return start;
  }
  const motion = shown < FULL_ABOVE ? 'shift' : 'full';
  let corners = start;
  for (const [index, { plane: level, scale }] of levels(plane).entries()) {
    const template = pageTemplates[index];
    if (template !== undefined) {
      corners = alignCorners(corners, { plane: level, template, grid, scale, allowed }, motion);
    }
  }
  return corners;
};

const applyShared = (pose: Pose, shared: FootageTracking['shared']): Pose => {
  const next: Pose = Object.fromEntries(
    Object.entries(pose).map(([name, corners]) => [
      name,
      corners.map(([x, y]) => [x, y]) as Corners,
    ]),
  );
  for (const [first, firstCorner, second, secondCorner] of shared ?? []) {
    const a = next[first]?.[firstCorner];
    const b = next[second]?.[secondCorner];
    if (a !== undefined && b !== undefined) {
      const middle: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      (next[first] as Corners)[firstCorner] = middle;
      (next[second] as Corners)[secondCorner] = [...middle];
    }
  }
  return next;
};

const trackRun = (
  planes: Plane[],
  frames: number[],
  anchorIndex: number,
  anchorPose: Pose,
  shared: FootageTracking['shared'],
  doors: [number, number][],
  grid: Grid,
): Map<number, Pose> => {
  const anchorPlane = planes[anchorIndex];
  if (anchorPlane === undefined) {
    throw new Error(`Missing anchor frame ${anchorIndex}`);
  }
  const names = Object.keys(anchorPose);
  const quadTemplates = Object.fromEntries(
    names.map((name) => [name, templates(anchorPlane, anchorPose[name] as Corners, grid)]),
  );
  const poses = new Map<number, Pose>([[anchorIndex, anchorPose]]);
  const walk = (order: number[]) => {
    let previous = anchorPose;
    let before: Pose | undefined;
    for (const index of order) {
      const plane = planes[index];
      const gap = doors[index] ?? [0, plane?.width ?? 0];
      if (plane !== undefined) {
        const guess = predict(previous, before);
        const solved: Pose = Object.fromEntries(
          names.map((name) => [
            name,
            alignPage(plane, guess[name] as Corners, quadTemplates[name] ?? [], gap, grid),
          ]),
        );
        before = previous;
        previous = applyShared(solved, shared);
        poses.set(index, previous);
      }
    }
  };
  walk(frames.filter((index) => index > anchorIndex));
  walk(frames.filter((index) => index < anchorIndex).reverse());
  return poses;
};

const runsOf = (spec: FootageSpec) => {
  const order = plateFrameOrder(spec);
  const runs: { shot: string; frames: number[]; sources: number[] }[] = [];
  order.forEach(({ shot, frame }, index) => {
    const last = runs.at(-1);
    if (last !== undefined && last.shot === shot) {
      last.frames.push(index);
      last.sources.push(frame);
    } else {
      runs.push({ shot, frames: [index], sources: [frame] });
    }
  });
  return runs;
};

const round = (value: number) => Math.round(value * 100) / 100;

type Run = ReturnType<typeof runsOf>[number];
type Anchor = FootageTracking['anchors'][number];

const solveAnchor = (
  spec: FootageSpec,
  { planes, masks }: Frames,
  run: Run,
  anchor: Anchor,
  tracking: FootageTracking,
  doors: [number, number][],
): Map<number, Pose> => {
  const [low, high] = anchor.range ?? [0, Number.POSITIVE_INFINITY];
  const inRange = run.frames.filter((_, at) => {
    const source = run.sources[at] ?? 0;
    return source >= low && source <= high;
  });
  const anchorIndex = run.frames[run.sources.indexOf(anchor.frame)];
  if (anchorIndex === undefined) {
    throw new Error(`Anchor frame ${anchor.frame} of ${run.shot} is not in the plate`);
  }
  if (anchor.color === undefined) {
    return trackRun(
      planes,
      inRange,
      anchorIndex,
      anchor.quads,
      tracking.shared,
      doors,
      makeGrid(40, 56, anchor.margin ?? DEFAULT_MARGIN),
    );
  }
  const colorMasks = masks[boardColors(spec).indexOf(anchor.color)] ?? [];
  const [name, corners] = Object.entries(anchor.quads)[0] ?? [];
  if (name === undefined || corners === undefined) {
    return new Map();
  }
  const solved = trackByColor(colorMasks, inRange, anchorIndex, corners as Corners);
  return new Map([...solved].map(([index, quad]) => [index, { [name]: quad }]));
};

const track = async (spec: FootageSpec) => {
  const read = await readPlanes(spec);
  const { planes } = read;
  const doors: [number, number][] = new Array(planes.length).fill([0, spec.width]);
  const poses = new Map<number, Pose>();
  for (const run of runsOf(spec)) {
    const shot = spec.shots.find((entry) => entry.name === run.shot);
    if (shot === undefined) {
      throw new Error(`The plate uses an unknown shot ${run.shot}`);
    }
    for (const index of run.frames) {
      const plane = planes[index];
      if (shot.tracking.doors !== undefined && plane !== undefined) {
        doors[index] = doorEdges(plane, shot.tracking.doors);
      }
    }
    for (const anchor of shot.tracking.anchors) {
      for (const [index, pose] of solveAnchor(spec, read, run, anchor, shot.tracking, doors)) {
        poses.set(index, { ...poses.get(index), ...pose });
      }
    }
    console.info(`Tracked ${run.frames.length} frames of ${run.shot}`);
  }
  const ordered = planes.map((_, index) => poses.get(index) ?? {});
  const frames = ordered.map((pose, index) => ({
    doors: (doors[index] ?? [0, spec.width]).map(round),
    quads: Object.fromEntries(
      Object.entries(pose).map(([name, corners]) => [
        name,
        corners.map((point) => point.map(round)),
      ]),
    ),
  }));
  const output = { width: spec.width, height: spec.height, fps: spec.fps, frames };
  writeFileSync(trackFile(spec), `${JSON.stringify(output)}\n`);
  console.info(`Wrote ${trackFile(spec)} (${frames.length} frames)`);
};

const chosen = FOOTAGE.find((entry) => entry.id === process.argv[2]);
if (chosen === undefined) {
  console.error(`Usage: bun run footage:track <${FOOTAGE.map((entry) => entry.id).join('|')}>`);
  process.exit(1);
}
await track(chosen);
