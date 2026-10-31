import type { MagnifierCaptionProps } from '@/schemas';
import { glide, tween } from '../promo/timing';
import { type Bubble, idlePose, type LensPose, lensPose, type Point, targetPoint } from './field';

export interface FieldState {
  lens: LensPose;
  focus: Point;
  offset: Point;
}

interface Key {
  start: number;
  frames: number;
  focus: Point;
  lens: LensPose;
}

export const wordStart = (index: number, timing: MagnifierCaptionProps['timing']): number =>
  timing.firstWord + index * timing.wordInterval;

const moveStart = (index: number, timing: MagnifierCaptionProps['timing']): number =>
  timing.firstMove + index * timing.moveInterval;

const keysFor = (props: MagnifierCaptionProps, count: number): Key[] => {
  const { timing } = props;
  const keys: Key[] = [];
  for (let index = 0; index < count; index++) {
    keys.push({
      start: moveStart(index, timing),
      frames: timing.travelFrames,
      focus: targetPoint(index, props.field.spread),
      lens: lensPose(index, props.lens),
    });
  }
  keys.push({
    start: timing.returnFrame,
    frames: timing.returnFrames,
    focus: { x: 0, y: 0 },
    lens: idlePose(props.lens),
  });
  return keys;
};

export const fieldState = (
  frame: number,
  props: MagnifierCaptionProps,
  count: number,
): FieldState => {
  const keys = keysFor(props, count);
  const idle = idlePose(props.lens);
  const focus = { x: 0, y: 0 };
  const lens = { ...idle };
  const coast = { x: 0, y: 0 };
  const progressOf = (key: Key | undefined): number =>
    key ? tween(frame, [key.start, key.start + key.frames], [0, 1], glide) : 0;
  let previous: Key = { start: 0, frames: 1, focus: { x: 0, y: 0 }, lens: idle };
  keys.forEach((key, index) => {
    const progress = progressOf(key);
    const shift = {
      x: key.lens.x - previous.lens.x - (key.focus.x - previous.focus.x),
      y: key.lens.y - previous.lens.y - (key.focus.y - previous.focus.y),
    };
    focus.x += (key.focus.x - previous.focus.x) * progress;
    focus.y += (key.focus.y - previous.focus.y) * progress;
    lens.x += (key.lens.x - previous.lens.x) * progress;
    lens.y += (key.lens.y - previous.lens.y) * progress;
    lens.angle += (key.lens.angle - previous.lens.angle) * progress;
    const next = keys[index + 1];
    const length = Math.hypot(shift.x, shift.y);
    if (length > 0) {
      const span = next ? next.start - key.start : Number.POSITIVE_INFINITY;
      const travelled = Math.min(Math.max(frame - key.start, 0), span) * props.field.drift;
      const fade = 1 - progressOf(next);
      coast.x += (shift.x / length) * travelled * fade;
      coast.y += (shift.y / length) * travelled * fade;
    }
    previous = key;
  });
  const sway = props.lens.sway;
  lens.x += Math.sin(frame / 71) * 3 * sway;
  lens.y += Math.cos(frame / 59) * 3 * sway;
  lens.angle += Math.sin(frame / 53) * 1.2 * sway;
  return {
    lens,
    focus,
    offset: {
      x: lens.x - focus.x + coast.x,
      y: lens.y - focus.y + coast.y,
    },
  };
};

const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export const glowFor = (
  bubble: Bubble,
  frame: number,
  state: FieldState,
  props: MagnifierCaptionProps,
  count: number,
): number => {
  if (bubble.target < 0) {
    return 0;
  }
  const { timing } = props;
  const enter = moveStart(bubble.target, timing);
  const leave =
    bubble.target + 1 < count
      ? moveStart(bubble.target + 1, timing) + timing.travelFrames
      : timing.returnFrame + timing.returnFrames;
  const window =
    tween(frame, [enter - 4, enter], [0, 1]) * tween(frame, [leave - 4, leave], [1, 0]);
  const distance = Math.hypot(
    bubble.x + state.offset.x - state.lens.x,
    bubble.y + state.offset.y - state.lens.y,
  );
  const radius = props.lens.radius;
  return window * (1 - smoothstep(radius * 0.5, radius * 1.02, distance));
};

export const charOpacity = (
  frame: number,
  start: number,
  index: number,
  length: number,
  props: MagnifierCaptionProps,
): number => {
  const { caption, timing } = props;
  const stagger = Math.min(caption.charStagger, caption.wordFrames / Math.max(1, length));
  const appear = start + index * stagger;
  const vanish = timing.fadeOutFrame + index * timing.fadeOutStagger;
  const shown = tween(frame, [appear, appear + caption.charFade], [0, 1], (t) => t);
  const gone = tween(frame, [vanish, vanish + caption.charFade], [0, 1], (t) => t);
  return shown * (1 - gone);
};
