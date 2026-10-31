import type { MiniaturePanoramaProps } from '@/schemas';
import { smooth } from '../../promo/timing';

export const FRAME_WIDTH = 1080;

export const FRAME_HEIGHT = 1920;

const PIVOT_X = FRAME_WIDTH / 2;

const PIVOT_Y = 1490;

export const SWANS_X = -1300;

export const PATH_X = 1300;

const REVEAL_LIFT = -420;

const REVEAL_ZOOM = 1.55;

const BLUR_PER_PIXEL = 0.32;

const BLUR_MAX = 28;

type Props = MiniaturePanoramaProps;

export type Cam = { x: number; y: number; zoom: number };

export type Schedule = {
  revealEnd: number;
  swansEnd: number;
  lakeIn: number;
  lakeEnd: number;
  nightIn: number;
  nightEnd: number;
  gardenIn: number;
  gardenEnd: number;
  pathIn: number;
  processionEnd: number;
  finaleIn: number;
};

export const scheduleFrom = (timing: Props['timing']): Schedule => {
  const revealEnd = timing.reveal;
  const swansEnd = revealEnd + timing.swans;
  const lakeIn = swansEnd + timing.toLake;
  const lakeEnd = lakeIn + timing.lake;
  const nightIn = lakeEnd + timing.toNight;
  const nightEnd = nightIn + timing.night;
  const gardenIn = nightEnd + timing.toGarden;
  const gardenEnd = gardenIn + timing.garden;
  const pathIn = gardenEnd + timing.toPath;
  const processionEnd = pathIn + timing.procession;
  const finaleIn = processionEnd + timing.toFinale;
  return {
    revealEnd,
    swansEnd,
    lakeIn,
    lakeEnd,
    nightIn,
    nightEnd,
    gardenIn,
    gardenEnd,
    pathIn,
    processionEnd,
    finaleIn,
  };
};

export const progress = (frame: number, from: number, to: number): number =>
  to <= from ? (frame >= to ? 1 : 0) : Math.min(1, Math.max(0, (frame - from) / (to - from)));

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

const blend = (from: Cam, to: Cam, t: number): Cam => ({
  x: lerp(from.x, to.x, t),
  y: lerp(from.y, to.y, t),
  zoom: Math.exp(lerp(Math.log(from.zoom), Math.log(to.zoom), t)),
});

export type WorldView = {
  visible: boolean;
  opacity: number;
  cam: Cam;
  pushX: number;
  pushY: number;
  roll: number;
};

const SLIDE = 0.42;

const FADE_FROM = 0.22;

const FADE_TO = 0.72;

type Camera = Props['camera'];

const drifting = (base: Cam, camera: Camera, frame: number, from: number, to: number): Cam => ({
  ...base,
  x: base.x + camera.drift * (frame - (from + to) / 2),
});

const hump = (t: number): number => Math.sin(Math.PI * t);

const fadeIn = (t: number): number =>
  smooth(Math.min(1, Math.max(0, (t - FADE_FROM) / (FADE_TO - FADE_FROM))));

export const lakeView = (frame: number, s: Schedule, camera: Camera): WorldView => {
  const swans = drifting(
    { x: SWANS_X, y: 0, zoom: camera.closeUp },
    camera,
    frame,
    s.revealEnd,
    s.swansEnd,
  );
  const lake = drifting({ x: 0, y: 0, zoom: 1 }, camera, frame, s.lakeIn, s.lakeEnd);
  const start: Cam = { x: SWANS_X, y: REVEAL_LIFT, zoom: camera.closeUp * REVEAL_ZOOM };
  const toLake = smooth(progress(frame, s.swansEnd, s.lakeIn));
  const cam =
    frame < s.revealEnd
      ? blend(start, swans, smooth(progress(frame, 0, s.revealEnd)))
      : frame < s.swansEnd
        ? swans
        : blend(swans, lake, toLake);
  const dropping = progress(frame, s.lakeEnd, s.nightIn);
  const drop = smooth(dropping);
  return {
    visible: fadeIn(dropping) < 1,
    opacity: 1,
    cam,
    pushX: 0,
    pushY: -FRAME_HEIGHT * SLIDE * drop,
    roll: camera.roll * hump(toLake),
  };
};

export const nightView = (frame: number, s: Schedule, camera: Camera): WorldView => {
  const cam = drifting({ x: 0, y: 0, zoom: 1 }, camera, frame, s.nightIn, s.nightEnd);
  const rising = progress(frame, s.lakeEnd, s.nightIn);
  const leaving = progress(frame, s.nightEnd, s.gardenIn);
  const rise = smooth(rising);
  const leave = smooth(leaving);
  const opacity = fadeIn(rising);
  return {
    visible: opacity > 0 && fadeIn(leaving) < 1,
    opacity,
    cam,
    pushX: -FRAME_WIDTH * SLIDE * leave,
    pushY: FRAME_HEIGHT * SLIDE * (1 - rise),
    roll: -camera.roll * hump(leave),
  };
};

export const gardenView = (frame: number, s: Schedule, camera: Camera): WorldView => {
  const lawn = drifting({ x: 0, y: 0, zoom: 1 }, camera, frame, s.gardenIn, s.gardenEnd);
  const path = drifting({ x: PATH_X, y: 0, zoom: 1 }, camera, frame, s.pathIn, s.processionEnd);
  const toPath = smooth(progress(frame, s.gardenEnd, s.pathIn));
  const arriving = progress(frame, s.nightEnd, s.gardenIn);
  const arrive = smooth(arriving);
  const opacity = fadeIn(arriving);
  return {
    visible: opacity > 0,
    opacity,
    cam: frame < s.pathIn ? blend(lawn, path, toPath) : path,
    pushX: FRAME_WIDTH * SLIDE * (1 - arrive),
    pushY: 0,
    roll: -camera.roll * hump(arrive) + camera.roll * 0.8 * hump(toPath),
  };
};

export const layerTransform = (cam: Cam, depth: number, parallax: number): string => {
  const weight = Math.max(0, 1 + (depth - 1) * parallax);
  const zoom = cam.zoom ** weight;
  const shiftX = -PIVOT_X - cam.x * weight;
  const shiftY = -PIVOT_Y - cam.y * weight;
  return `translate(${PIVOT_X} ${PIVOT_Y}) scale(${zoom.toFixed(5)}) translate(${shiftX.toFixed(3)} ${shiftY.toFixed(3)})`;
};

export const placeFor = (cam: Cam, depth: number, parallax: number, x: number, y: number) => {
  const weight = Math.max(0, 1 + (depth - 1) * parallax);
  const zoom = cam.zoom ** weight;
  return {
    x: PIVOT_X + cam.x * weight + (x - PIVOT_X) / zoom,
    y: PIVOT_Y + cam.y * weight + (y - PIVOT_Y) / zoom,
    scale: 1 / zoom,
  };
};

export const frameTransform = (view: WorldView): string =>
  `rotate(${view.roll.toFixed(4)} ${PIVOT_X} ${FRAME_HEIGHT / 2}) translate(${view.pushX.toFixed(3)} ${view.pushY.toFixed(3)})`;

export const motionBlur = (
  view: (frame: number) => WorldView,
  frame: number,
  amount: number,
): { x: number; y: number } => {
  const before = view(frame - 0.5);
  const after = view(frame + 0.5);
  const zoomShift = Math.abs(Math.log(after.cam.zoom / before.cam.zoom)) * 320;
  const dx = after.pushX - before.pushX - (after.cam.x - before.cam.x) * after.cam.zoom;
  const dy = after.pushY - before.pushY - (after.cam.y - before.cam.y) * after.cam.zoom;
  const spin = Math.abs(after.roll - before.roll) * 14;
  const size = (move: number) =>
    Math.min(
      BLUR_MAX,
      Math.max(0, (Math.abs(move) + zoomShift + spin) * BLUR_PER_PIXEL - 1.2) * amount,
    );
  return { x: size(dx), y: size(dy) };
};
