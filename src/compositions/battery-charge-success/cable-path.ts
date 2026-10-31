import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { type Pose, TAIL } from './choreography';
import { smoothstep } from './curves';

export const labelFont = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['latin'],
}).fontFamily;

export type CablePoint = { x: number; y: number; along: number; angle: number };

const SAMPLES = 120;

const bezier = (a: number, b: number, c: number, d: number, t: number) => {
  const inverse = 1 - t;
  return (
    inverse * inverse * inverse * a +
    3 * inverse * inverse * t * b +
    3 * inverse * t * t * c +
    t * t * t * d
  );
};

const radians = (degrees: number) => (degrees * Math.PI) / 180;

const MARGIN = 70;

const offscreen = (
  x: number,
  y: number,
  width: number,
  height: number,
): { x: number; y: number } => {
  const centerX = width / 2;
  const centerY = height / 2;
  const dx = x - centerX;
  const dy = y - centerY;
  const reachX = dx === 0 ? Number.POSITIVE_INFINITY : (centerX + MARGIN) / Math.abs(dx);
  const reachY = dy === 0 ? Number.POSITIVE_INFINITY : (centerY + MARGIN) / Math.abs(dy);
  const scale = Math.max(1, Math.min(reachX, reachY));
  return { x: centerX + dx * scale, y: centerY + dy * scale };
};

export const cablePoints = (
  rawPose: Pose,
  frame: number,
  wave: number,
  seed: number,
  size: { width: number; height: number },
): CablePoint[] => {
  const anchor = offscreen(rawPose.anchorX, rawPose.anchorY, size.width, size.height);
  const pose = { ...rawPose, anchorX: anchor.x, anchorY: anchor.y };
  const ux = Math.cos(radians(pose.angle));
  const uy = Math.sin(radians(pose.angle));
  const tailX = pose.x - ux * TAIL;
  const tailY = pose.y - uy * TAIL;
  const distance = Math.hypot(pose.anchorX - tailX, pose.anchorY - tailY);
  const lead = Math.max(60, distance * 0.38);
  const reach = Math.max(60, distance * 0.32);
  const c1x = tailX - ux * lead;
  const c1y = tailY - uy * lead;
  const towardX = (tailX - pose.anchorX) / (distance || 1) + Math.cos(radians(pose.anchorAngle));
  const towardY = (tailY - pose.anchorY) / (distance || 1) + Math.sin(radians(pose.anchorAngle));
  const toward = Math.hypot(towardX, towardY) || 1;
  const c2x = pose.anchorX + (towardX / toward) * reach;
  const c2y = pose.anchorY + (towardY / toward) * reach;
  const base: { x: number; y: number }[] = [];
  for (let index = 0; index <= SAMPLES; index++) {
    const t = index / SAMPLES;
    base.push({
      x: bezier(tailX, c1x, c2x, pose.anchorX, t),
      y: bezier(tailY, c1y, c2y, pose.anchorY, t),
    });
  }
  let along = 0;
  const points: CablePoint[] = [];
  base.forEach((point, index) => {
    const previous = base[index - 1] ?? point;
    const next = base[index + 1] ?? point;
    along += Math.hypot(point.x - previous.x, point.y - previous.y);
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const offset =
      wave *
      smoothstep(0, 150, along) *
      (0.7 * Math.sin(along / 52 + seed + frame * 0.05) +
        0.3 * Math.sin(along / 31 + seed * 2.3 - frame * 0.04));
    points.push({
      x: point.x + nx * offset,
      y: point.y + ny * offset,
      along,
      angle: Math.atan2(dy, dx),
    });
  });
  return points;
};

export const pathData = (points: readonly CablePoint[]): string =>
  points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

export const pointAt = (points: readonly CablePoint[], along: number): CablePoint | undefined => {
  for (let index = 1; index < points.length; index++) {
    const current = points[index];
    const previous = points[index - 1];
    if (current !== undefined && previous !== undefined && current.along >= along) {
      const span = current.along - previous.along || 1;
      const t = (along - previous.along) / span;
      return {
        x: previous.x + (current.x - previous.x) * t,
        y: previous.y + (current.y - previous.y) * t,
        along,
        angle: current.angle,
      };
    }
  }
  return undefined;
};
