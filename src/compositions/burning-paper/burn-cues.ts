import { Easing } from 'remotion';
import type { BurningPaperRevealProps } from '@/schemas';
import { fbm, monotoneCurve, smoothstep } from './noise';

const FRONT_KEYS: [number, number][] = [
  [0, 0],
  [0.094, 0.13],
  [0.47, 0.56],
  [0.7, 0.85],
  [0.84, 0.91],
  [1, 1],
];

const frontEase = (t: number): number => monotoneCurve(FRONT_KEYS, t);
const driftEase = Easing.bezier(0.3, 0.3, 0.4, 1);

const EDGE_STEPS = 64;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export interface EdgePoint {
  y: number;
  x: number;
  char: number;
  ash: number;
}

export interface BurnCues {
  front: number;
  lead: number;
  edge: EdgePoint[];
  strength: number;
  zoom: number;
  drift: number;
  roll: number;
  shake: { x: number; y: number; angle: number };
  flicker: number;
  frame: number;
}

const handheld = (frame: number, amount: number) => ({
  x: (Math.sin(frame / 41) * 4 + Math.sin(frame / 17.3 + 1.2) * 1.4) * amount,
  y: (Math.sin(frame / 33 + 0.6) * 3.4 + Math.sin(frame / 13.1 + 2.1) * 1.1) * amount,
  angle: (Math.sin(frame / 53 + 0.4) * 0.35 + Math.sin(frame / 23 + 1.7) * 0.12) * amount,
});

const edgeAt = (props: BurningPaperRevealProps, front: number, y: number): Omit<EdgePoint, 'y'> => {
  const { burn, paper } = props;
  const lead = clamp01((front - burn.from) / Math.max(0.001, burn.to - burn.from));
  const ragged = burn.ragged * (1 + burn.crumple * (1 - lead) ** 2);
  const along = y / paper.height;
  const travel = front * paper.width;
  const wobble =
    fbm(y * 0.011 + burn.seed * 3.1, travel * 0.006 + burn.seed) * ragged +
    fbm(y * 0.04 + burn.seed, travel * 0.02) * ragged * 0.14;
  const x = paper.width * (front + burn.slant * (along - 0.5)) + wobble;
  const char =
    burn.charWidth *
    (0.55 + 0.9 * clamp01(0.5 + fbm(y * 0.03 + 4.2, travel * 0.01 + burn.seed))) *
    (1 + burn.crumple * 0.6 * (1 - lead) ** 2);
  const ash =
    burn.charWidth *
    2.4 *
    burn.crumple *
    (1 - lead) ** 1.6 *
    clamp01(
      0.35 +
        fbm(y * 0.018 + 9.4, travel * 0.008 + burn.seed * 0.5) * 1.2 +
        fbm(y * 0.09 + 2.7, travel * 0.03) * 0.9,
    );
  return { x, char, ash };
};

export const burnCues = (props: BurningPaperRevealProps, frame: number): BurnCues => {
  const { burn, paper, flame, camera } = props;
  const span = Math.max(1, burn.endFrame - burn.startFrame);
  const progress = frontEase(clamp01((frame - burn.startFrame) / span));
  const front = burn.from + (burn.to - burn.from) * progress;
  const edge: EdgePoint[] = [];
  for (let step = 0; step <= EDGE_STEPS; step++) {
    const y = (step / EDGE_STEPS) * paper.height;
    edge.push({ y, ...edgeAt(props, front, y) });
  }
  const strength = 1 - smoothstep(flame.fadeStart, flame.fadeEnd, frame);
  const driftT = driftEase(clamp01(frame / Math.max(1, camera.driftFrames)));
  return {
    front,
    lead: progress,
    edge,
    strength,
    zoom: monotoneCurve(
      [
        [0, camera.zoomFrom],
        [camera.holdStart, camera.zoomHold + 0.08],
        [Math.max(camera.holdStart + 1, camera.holdEnd), camera.zoomHold - 0.04],
        [Math.max(camera.holdEnd + 2, camera.zoomFrames), 1],
      ],
      frame,
    ),
    drift: camera.driftY * (1 - driftT),
    roll: camera.wallRoll * (1 - driftEase(clamp01(frame / Math.max(1, camera.rollFrames)))),
    shake: handheld(frame, camera.handheld),
    flicker: 0.84 + 0.16 * fbm((frame / 30) * 2.1 * flame.speed, 5.3 + burn.seed),
    frame,
  };
};

export const paperTransform = (props: BurningPaperRevealProps, cues: BurnCues): string => {
  const { camera, paper } = props;
  const { zoom, shake } = cues;
  return [
    `translate(${(camera.pivotX + shake.x).toFixed(3)} ${(camera.pivotY + shake.y).toFixed(3)})`,
    `rotate(${shake.angle.toFixed(4)})`,
    `scale(${zoom.toFixed(5)})`,
    `translate(${(paper.x - camera.pivotX).toFixed(3)} ${(paper.y - camera.pivotY).toFixed(3)})`,
    `rotate(${paper.tilt})`,
  ].join(' ');
};

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const paperToScreen = (
  props: BurningPaperRevealProps,
  cues: BurnCues,
  x: number,
  y: number,
): { x: number; y: number } => {
  const { paper, camera } = props;
  const tilt = toRadians(paper.tilt);
  const lx = x * Math.cos(tilt) - y * Math.sin(tilt) + paper.x - camera.pivotX;
  const ly = x * Math.sin(tilt) + y * Math.cos(tilt) + paper.y - camera.pivotY;
  const angle = toRadians(cues.shake.angle);
  const sx = lx * cues.zoom;
  const sy = ly * cues.zoom;
  return {
    x: camera.pivotX + cues.shake.x + sx * Math.cos(angle) - sy * Math.sin(angle),
    y: camera.pivotY + cues.shake.y + sx * Math.sin(angle) + sy * Math.cos(angle),
  };
};

export const edgeXAt = (edge: EdgePoint[], y: number, limit: number): number => {
  const first = edge[0];
  const last = edge.at(-1);
  if (first === undefined || last === undefined) {
    return 0;
  }
  if (y <= first.y) {
    return Math.min(first.x, limit);
  }
  if (y >= last.y) {
    return Math.min(last.x, limit);
  }
  const step = last.y / (edge.length - 1);
  const index = Math.min(edge.length - 2, Math.floor(y / step));
  const a = edge[index] ?? first;
  const b = edge[index + 1] ?? last;
  const t = (y - a.y) / Math.max(0.001, b.y - a.y);
  return Math.min(a.x + (b.x - a.x) * t, limit);
};
