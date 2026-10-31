import type { CSSProperties } from 'react';
import type { WordBuildProps } from '@/schemas';
import { land, tween } from './timing';

const WIPE_FRAMES = 7;
const CUT_OVERLAP = 3;
const CHAR_WIDTH = 0.6;

export interface BigWindow {
  start: number;
  end: number;
}

export const bigWindows = (
  entry: WordBuildProps['entry'],
  count: number,
  delay: number,
  wordFrames: number,
): BigWindow[] => {
  if (entry === 'scroll') {
    return [{ start: delay, end: delay + count * wordFrames }];
  }
  const overlap = entry === 'slide' ? WIPE_FRAMES : entry === 'shrink' ? 0 : CUT_OVERLAP;
  return Array.from({ length: count }, (_, index) => ({
    start: delay + index * wordFrames,
    end: delay + index * wordFrames + wordFrames + (index === count - 1 ? 0 : overlap),
  }));
};

const wipeEdge = (frame: number, start: number): number =>
  tween(frame, [start, start + WIPE_FRAMES], [100, 0], (t) => t);

export const wipeState = (
  frame: number,
  windows: BigWindow[],
  index: number,
  width: number,
): CSSProperties => {
  const window = windows[index];
  const next = windows[index + 1];
  if (window === undefined) {
    return {};
  }
  const left = index === 0 ? 0 : wipeEdge(frame, window.start);
  const right = next === undefined ? 0 : 100 - wipeEdge(frame, next.start);
  const drift = width * 0.16;
  const enter =
    index === 0 ? land(frame, [window.start, window.start + 10], [-width * 0.45, 0]) : 0;
  const pan = tween(frame, [window.start, window.end], [-drift, drift], (t) => t);
  return {
    clipPath: `inset(0 ${right.toFixed(3)}% 0 ${left.toFixed(3)}%)`,
    transform: `translateX(${(enter + pan).toFixed(2)}px)`,
  };
};

export const bigWordTransform = (
  props: Pick<WordBuildProps, 'entry' | 'direction' | 'zoomFrom' | 'bigSize'>,
  progress: number,
): CSSProperties => {
  switch (props.entry) {
    case 'scroll': {
      const along = props.direction === 'left' ? 1 - progress : progress;
      return {
        position: 'absolute',
        left: `${(along * 100).toFixed(3)}%`,
        transform: `translateX(${(-along * 100).toFixed(3)}%)`,
      };
    }
    case 'slide':
      return {};
    case 'zoom':
      return { transform: `scale(${(0.62 + 0.9 * progress).toFixed(5)})` };
    case 'shrink':
      return {
        transform: `scale(${(0.72 + (props.zoomFrom - 0.72) * (1 - progress) ** 4).toFixed(5)})`,
      };
    case 'step':
      return { transform: `scale(${(1 + 0.06 * progress).toFixed(5)})` };
    case 'tilt':
      return {
        transform: `perspective(${props.bigSize * 4}px) rotateY(${46 - 78 * progress}deg) rotateX(${8 - 14 * progress}deg) scale(${0.9 + 0.14 * progress})`,
      };
    case 'pop':
      return { transform: `scale(${(0.86 + 0.2 * progress).toFixed(5)})` };
    default:
      return {};
  }
};

export const fallingLetter = (frame: number, start: number, index: number, count: number) => {
  const local = frame - start - (count - 1 - index) * 2;
  const drop = Math.max(0, local);
  return {
    opacity: 1 - tween(drop, [4, 12], [0, 1], (t) => t),
    transform: `translateY(${(drop * drop * 2.4).toFixed(2)}px) rotate(${((index % 2 === 0 ? 1 : -1) * drop * 2.2).toFixed(2)}deg)`,
  };
};

export const presence = (frame: number, appear: number, frames = 3): number =>
  tween(frame, [appear, appear + frames], [0, 1], (t) => t);

export const centeringShift = (hiddenChars: number, from: WordBuildProps['buildFrom']): string =>
  `translateX(${((from === 'left' ? 1 : -1) * hiddenChars * CHAR_WIDTH * 0.5).toFixed(4)}em)`;

export const sentenceWordStyle = (
  entry: WordBuildProps['sentenceEntry'],
  frame: number,
  appear: number,
  order: number,
  size: number,
  width: number,
): CSSProperties => {
  if (entry === 'wave') {
    const settleAt = appear + 16;
    const offset = land(frame, [appear, settleAt], [width * 0.45, 0]);
    const swing = 1 - tween(frame, [appear, settleAt + 6], [0, 1], (t) => t);
    return {
      opacity: presence(frame, appear, 4),
      transform: `translate(${offset.toFixed(2)}px, ${(Math.sin(order * 1.7 + 0.6) * size * 0.55 * swing).toFixed(2)}px) rotate(${(Math.sin(order * 2.3) * 9 * swing).toFixed(2)}deg)`,
    };
  }
  if (entry === 'type') {
    return { opacity: 1 };
  }
  const rise = land(frame, [appear, appear + 10], [size * 0.4, 0]);
  return {
    opacity: presence(frame, appear),
    transform: `translateY(${rise.toFixed(2)}px)`,
  };
};
