import * as THREE from 'three';
import type { ProblemStrikeoutProps } from '@/schemas';
import { smooth, track, tween } from '../promo/timing';
import { PAGE, PAGE_CANVAS, pointOnStrike, type StrikePath } from './page-art';

export const NOTEBOOK_TOP = 0.072;

type Timing = ProblemStrikeoutProps['timing'];
type NotebookLook = ProblemStrikeoutProps['notebook'];

const ENTER_FRAMES = 18;
const EXIT_FRAMES = 22;
const FOLLOW_SAMPLES = 17;
const FOLLOW_REACH = 20;
const TRAVEL_PIXELS = 600;

const OFF_PAGE = { x: PAGE_CANVAS.width * 1.45, y: PAGE_CANVAS.height * 1.15 };

type Point = { x: number; y: number };

export interface StrikeWindow {
  start: number;
  end: number;
}

const first = (path: StrikePath | undefined): Point => path?.points[0] ?? OFF_PAGE;
const last = (path: StrikePath | undefined): Point => path?.points.at(-1) ?? OFF_PAGE;

const gap = (a: Point, b: Point): number => Math.hypot(b.x - a.x, b.y - a.y);

export const strikeSchedule = (paths: StrikePath[], timing: Timing): StrikeWindow[] => {
  let cursor = timing.strikeStart;
  return paths.map((path, index) => {
    if (index > 0) {
      const reach = gap(last(paths[index - 1]), first(path)) / TRAVEL_PIXELS;
      cursor += timing.travelFrames * Math.min(2, Math.max(1, reach));
    }
    const window = { start: cursor, end: cursor + timing.strikeFrames };
    cursor = window.end;
    return window;
  });
};

export const strikeProgress = (schedule: StrikeWindow[], index: number, frame: number): number => {
  const window = schedule[index];
  return window === undefined ? 0 : tween(frame, [window.start, window.end], [0, 1], (t) => t);
};

const pullbackStart = (schedule: StrikeWindow[], timing: Timing): number =>
  (schedule.at(-1)?.end ?? timing.strikeStart) + 4;

export const notebookMatrix = (notebook: NotebookLook): THREE.Matrix4 =>
  new THREE.Matrix4()
    .makeTranslation(notebook.x, 0, notebook.z)
    .multiply(new THREE.Matrix4().makeRotationY(notebook.turn));

export const canvasToWorld = (
  notebook: NotebookLook,
  point: { x: number; y: number },
  height: number,
): THREE.Vector3 =>
  new THREE.Vector3(
    (point.x / PAGE_CANVAS.width - 0.5) * PAGE.width,
    NOTEBOOK_TOP + height,
    (point.y / PAGE_CANVAS.height - 0.5) * PAGE.depth,
  ).applyMatrix4(notebookMatrix(notebook));

export interface PencilState {
  tip: Point;
  height: number;
  sweep: number;
}

const strokeVelocity = (path: StrikePath | undefined, frames: number, atEnd: boolean): Point => {
  const points = path?.points ?? [];
  const a = (atEnd ? points.at(-2) : points[0]) ?? OFF_PAGE;
  const b = (atEnd ? points.at(-1) : points[1]) ?? OFF_PAGE;
  const scale = (points.length - 1) / frames;
  return { x: (b.x - a.x) * scale, y: (b.y - a.y) * scale };
};

const hermite = (from: Point, to: Point, out: Point, into: Point, frames: number, t: number) => {
  const reach = gap(from, to);
  const limit = (velocity: Point) => {
    const length = Math.hypot(velocity.x, velocity.y) * frames;
    const scale = length > 0 ? frames * Math.min(1, (reach * 0.8) / length) : 0;
    return { x: velocity.x * scale, y: velocity.y * scale };
  };
  const m0 = limit(out);
  const m1 = limit(into);
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;
  return {
    x: h00 * from.x + h10 * m0.x + h01 * to.x + h11 * m1.x,
    y: h00 * from.y + h10 * m0.y + h01 * to.y + h11 * m1.y,
  };
};

const REST: Point = { x: 0, y: 0 };

export const pencilState = (
  paths: StrikePath[],
  schedule: StrikeWindow[],
  timing: Timing,
  lift: number,
  frame: number,
): PencilState => {
  const strokeFrames = timing.strikeFrames;
  const opening = schedule[0];
  if (opening === undefined || frame < opening.start) {
    const begin = (opening?.start ?? timing.strikeStart) - ENTER_FRAMES;
    const t = tween(frame, [begin, begin + ENTER_FRAMES], [0, 1], (value) => value);
    return {
      tip: hermite(
        OFF_PAGE,
        first(paths[0]),
        REST,
        strokeVelocity(paths[0], strokeFrames, false),
        ENTER_FRAMES,
        t,
      ),
      height: lift * 4 * (1 - t) ** 2 + lift * 0.5 * Math.sin(Math.PI * t),
      sweep: -0.5 * t,
    };
  }
  for (let index = 0; index < schedule.length; index++) {
    const window = schedule[index];
    const path = paths[index];
    if (window === undefined || path === undefined) {
      continue;
    }
    if (frame <= window.end) {
      const progress = strikeProgress(schedule, index, frame);
      return { tip: pointOnStrike(path, progress), height: 0, sweep: progress - 0.5 };
    }
    const next = schedule[index + 1];
    if (next !== undefined && frame < next.start) {
      const frames = next.start - window.end;
      const t = (frame - window.end) / frames;
      return {
        tip: hermite(
          last(path),
          first(paths[index + 1]),
          strokeVelocity(path, strokeFrames, true),
          strokeVelocity(paths[index + 1], strokeFrames, false),
          frames,
          t,
        ),
        height: lift * Math.sin(Math.PI * t),
        sweep: 0.5 - t,
      };
    }
  }
  const leave = schedule.at(-1)?.end ?? frame;
  const t = tween(frame, [leave, leave + EXIT_FRAMES], [0, 1], (value) => value);
  return {
    tip: hermite(
      last(paths.at(-1)),
      OFF_PAGE,
      strokeVelocity(paths.at(-1), strokeFrames, true),
      REST,
      EXIT_FRAMES,
      t,
    ),
    height: lift * (Math.sin(Math.PI * Math.min(t, 0.5)) + 4 * t * t),
    sweep: 0.5 - t * 0.5,
  };
};

type Choreographed = Pick<ProblemStrikeoutProps, 'timing' | 'notebook' | 'pencil'>;

const pencilWorld = (
  paths: StrikePath[],
  schedule: StrikeWindow[],
  props: Choreographed,
  frame: number,
): THREE.Vector3 => {
  const state = pencilState(paths, schedule, props.timing, props.pencil.lift, frame);
  return canvasToWorld(props.notebook, state.tip, state.height);
};

export interface CameraShot {
  eye: THREE.Vector3;
  target: THREE.Vector3;
  focus: THREE.Vector3;
}

export const cameraShot = (
  paths: StrikePath[],
  schedule: StrikeWindow[],
  props: Choreographed & Pick<ProblemStrikeoutProps, 'camera'>,
  frame: number,
): CameraShot => {
  const { timing, camera } = props;
  const pull = pullbackStart(schedule, timing);
  const opening = schedule[0]?.start ?? timing.strikeStart;
  const center = canvasToWorld(
    props.notebook,
    { x: PAGE_CANVAS.width * 0.5, y: PAGE_CANVAS.height * 0.52 },
    0,
  );
  const followed = new THREE.Vector3();
  let weights = 0;
  for (let sample = 0; sample < FOLLOW_SAMPLES; sample++) {
    const offset = (sample / (FOLLOW_SAMPLES - 1) - 0.5) * 2 * FOLLOW_REACH;
    const weight = 1 - Math.abs(offset) / (FOLLOW_REACH + 1);
    const at = Math.min(pull, Math.max(opening, frame + offset));
    followed.addScaledVector(pencilWorld(paths, schedule, props, at), weight);
    weights += weight;
  }
  followed.divideScalar(weights).setY(NOTEBOOK_TOP);
  const following =
    camera.follow *
    tween(frame, [opening - 14, opening + 10], [0.4, 1]) *
    tween(frame, [pull, pull + timing.pullbackFrames], [1, 0], smooth);
  const lead = new THREE.Vector3(Math.cos(camera.azimuth), 0, -Math.sin(camera.azimuth));
  const target = center.clone().lerp(followed.addScaledVector(lead, camera.lead), following);
  const settled = pull + timing.pullbackFrames;
  const distance =
    track(frame, [
      [0, camera.openDistance],
      [opening + 12, camera.closeDistance],
      [pull, camera.closeDistance * 1.04],
      [settled, camera.wideDistance],
    ]) -
    tween(
      frame,
      [settled - 8, Math.max(settled, timing.cutFrame)],
      [0, camera.wideDistance * 0.05],
      (t) => t,
    );
  const azimuth = camera.azimuth + frame * 0.0006;
  const elevation = camera.elevation + tween(frame, [pull, settled], [0, 0.12]);
  const eye = target
    .clone()
    .add(
      new THREE.Vector3(
        Math.sin(azimuth) * Math.cos(elevation),
        Math.sin(elevation),
        Math.cos(azimuth) * Math.cos(elevation),
      ).multiplyScalar(distance),
    );
  const tip = pencilWorld(paths, schedule, props, frame);
  return { eye, target, focus: center.clone().lerp(tip.setY(NOTEBOOK_TOP), following) };
};
