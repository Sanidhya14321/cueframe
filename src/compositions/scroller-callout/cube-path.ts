import { Easing } from 'remotion';
import type { ScrollerCalloutProps } from '@/schemas';
import { tween } from '../promo/timing';
import type { GlyphLayout } from './glyphs';

type Intro = ScrollerCalloutProps['intro'];

export interface CubePose {
  x: number;
  y: number;
  angle: number;
  visible: boolean;
}

export interface CubeStop {
  x: number;
  top: number;
  touch: number;
}

const dropEase = (t: number) => t + t * t * (1 - t);
const roll = Easing.bezier(0.3, 0.3, 0.45, 1);
const rebound = Easing.bezier(0.2, 0.4, 0.7, 0.9);
const descend = (t: number) => t * t;

export const cubeStops = (intro: Intro, layout: GlyphLayout, left: number): CubeStop[] => {
  const letters = layout.glyphs.filter((glyph) => glyph.char.trim() !== '');
  return letters.map((glyph, index) => ({
    x: left + glyph.x + glyph.advance / 2 + intro.landOffset * intro.cubeSize,
    top: intro.baseline - glyph.ascent,
    touch: intro.start + intro.dropFrames + index * (intro.dwellFrames + intro.hopFrames),
  }));
};

export const fillTime = (intro: Intro, stop: CubeStop): number => stop.touch + intro.fillDelay;

export const cornerRadius = (intro: Intro): number =>
  Math.min(0.5, Math.max(0, intro.cubeCorner)) * intro.cubeSize;

const rollLift = (size: number, corner: number, degrees: number): number => {
  const radians = (degrees * Math.PI) / 180;
  const reach = Math.abs(Math.cos(radians)) + Math.abs(Math.sin(radians));
  return (size / 2 - corner) * (reach - 1);
};

const poser =
  (intro: Intro) =>
  (x: number, bottom: number, angle: number): CubePose => ({
    x,
    y: bottom - intro.cubeSize / 2 - rollLift(intro.cubeSize, cornerRadius(intro), angle),
    angle,
    visible: true,
  });

const dwellBottom = (intro: Intro, stop: CubeStop, rest: number, frame: number): number => {
  const elapsed = frame - stop.touch;
  const pressed = stop.top + intro.press;
  if (elapsed <= 1) {
    return tween(elapsed, [0, 1], [stop.top, pressed], Easing.out(Easing.sin));
  }
  return tween(elapsed, [1, Math.max(1.01, intro.dwellFrames)], [pressed, rest], rebound);
};

export const cubePose = (
  intro: Intro,
  stops: CubeStop[],
  rest: number,
  frame: number,
): CubePose => {
  const size = intro.cubeSize;
  const pose = poser(intro);
  const first = stops[0];
  const last = stops.at(-1);
  if (first === undefined || last === undefined || frame < intro.start) {
    return { x: 0, y: 0, angle: 0, visible: false };
  }
  if (frame <= first.touch) {
    const bottom = tween(frame, [intro.start, first.touch], [-size * 0.95, first.top], dropEase);
    return pose(first.x, bottom, 0);
  }
  for (let index = 0; index < stops.length; index++) {
    const stop = stops[index];
    const next = stops[index + 1];
    if (stop === undefined) {
      continue;
    }
    const hopStart = stop.touch + intro.dwellFrames;
    const angle = index * 90;
    if (frame <= hopStart) {
      return pose(stop.x, dwellBottom(intro, stop, rest, frame), angle);
    }
    if (next !== undefined && frame <= next.touch) {
      const t = (frame - hopStart) / Math.max(0.01, next.touch - hopStart);
      const x = stop.x + (next.x - stop.x) * roll(t);
      const bottom = rest + (next.top - rest) * descend(t) - intro.arc * Math.sin(Math.PI * t);
      return pose(x, bottom, angle + 90 * roll(t));
    }
  }
  const exitStart = last.touch + intro.dwellFrames;
  const hopEnd = exitStart + intro.exitHop;
  const exitEnd = exitStart + intro.exitFrames;
  const baseAngle = (stops.length - 1) * 90;
  if (frame <= hopEnd) {
    const t = (frame - exitStart) / Math.max(0.01, intro.exitHop);
    const x = last.x + intro.exitDistance * roll(t);
    const bottom = rest - intro.exitRise * Math.sin(Math.PI * Math.min(1, t));
    return pose(x, bottom, baseAngle + 90 * roll(t));
  }
  if (frame <= exitEnd + 0.5) {
    const fall = Math.max(0.01, exitEnd - hopEnd);
    const elapsed = Math.max(0, frame - hopEnd);
    const launch = (Math.PI * intro.exitRise) / Math.max(0.01, intro.exitHop);
    const gravity = Math.max(0, (2 * (intro.exitFloor - rest - launch * fall)) / fall ** 2);
    const bottom = rest + launch * elapsed + (gravity * elapsed ** 2) / 2;
    const lean = (elapsed / fall) ** 2;
    const x = last.x + intro.exitDistance * (1 + 0.25 * lean);
    return pose(x, bottom, baseAngle + 90 + 40 * lean);
  }
  return { x: 0, y: 0, angle: 0, visible: false };
};
