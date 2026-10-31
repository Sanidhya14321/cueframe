import { Easing } from 'remotion';
import type { PuzzleSuccessProps } from '@/schemas';
import { accelerate, smooth, tween } from '../promo/timing';
import { CORNER_SIGN, CORNERS, type Corner } from './geometry';

interface PiecePose {
  x: number;
  y: number;
  scale: number;
  tilt: number;
}

export interface PuzzleBeat {
  breath: number;
  breathAlt: number;
  poses: Record<Corner, PiecePose>;
  glow: number;
  labels: number;
  word: number;
  wordScale: number;
  flash: number;
  core: number;
  coreGrowth: number;
  ring: number;
  spark: number;
  neonBoost: number;
}

const STEP_ORDER: Record<Corner, number> = {
  topLeft: 0,
  bottomLeft: 1,
  topRight: 2,
  bottomRight: 3,
};

const TILT_SIGN: Record<Corner, number> = {
  topLeft: 1,
  bottomLeft: -1,
  topRight: 1,
  bottomRight: -1,
};

const stepEase = Easing.bezier(0.5, 0, 0.3, 1);

const decay = (t: number): number => 1 - (1 - t) ** 2;

const settleGrow = (t: number): number => smooth(t) * 0.55 + (1 - (1 - t) ** 3) * 0.45;

const grownScale = (frame: number, props: PuzzleSuccessProps): number =>
  tween(
    frame,
    [props.timing.growStart, props.timing.growStart + props.timing.growFrames],
    [props.block.floatScale, 1],
    settleGrow,
  );

const splitScale = (props: PuzzleSuccessProps): number =>
  grownScale(props.timing.splitStart, props);

const blockScale = (frame: number, props: PuzzleSuccessProps): number => {
  const { timing, block } = props;
  if (frame >= timing.splitStart) {
    return tween(
      frame,
      [timing.splitStart, timing.splitStart + timing.splitFrames],
      [splitScale(props), block.floatScale],
      smooth,
    );
  }
  return grownScale(frame, props);
};

const assembledAt = (corner: Corner, scale: number, props: PuzzleSuccessProps) => {
  const [sx, sy] = CORNER_SIGN[corner];
  const offset = (props.block.size * scale) / 2;
  return { x: props.block.centerX + sx * offset, y: props.block.centerY + sy * offset };
};

const poseFor = (corner: Corner, frame: number, props: PuzzleSuccessProps): PiecePose => {
  const { timing, block } = props;
  const piece = props[corner];
  const snapEnd = timing.snapStart + timing.snapFrames;
  if (frame < timing.snapStart) {
    const start = timing.stepStart + STEP_ORDER[corner] * timing.stepStagger;
    const progress = tween(frame, [start, start + timing.stepFrames], [0, 1], stepEase);
    const tilt = Math.sin(Math.PI * progress) * timing.stepTilt * TILT_SIGN[corner];
    return {
      x: piece.x + piece.stepX * progress,
      y: piece.y + piece.stepY * progress,
      scale: block.floatScale,
      tilt,
    };
  }
  if (frame < snapEnd) {
    const target = assembledAt(corner, block.floatScale, props);
    const progress = tween(frame, [timing.snapStart, snapEnd], [0, 1], accelerate);
    const fromX = piece.x + piece.stepX;
    const fromY = piece.y + piece.stepY;
    return {
      x: fromX + (target.x - fromX) * progress,
      y: fromY + (target.y - fromY) * progress,
      scale: block.floatScale,
      tilt: 0,
    };
  }
  const scale = blockScale(frame, props);
  const held = assembledAt(corner, scale, props);
  if (frame <= timing.splitStart) {
    return { ...held, scale, tilt: 0 };
  }
  const apart = tween(
    frame,
    [timing.splitStart, timing.splitStart + timing.splitFrames],
    [0, 1],
    smooth,
  );
  const anchored = assembledAt(corner, splitScale(props), props);
  return {
    x: anchored.x + (piece.x - anchored.x) * apart,
    y: anchored.y + (piece.y - anchored.y) * apart,
    scale,
    tilt: 0,
  };
};

const flashFrames = (props: PuzzleSuccessProps): number[] => {
  const snapEnd = props.timing.snapStart + props.timing.snapFrames;
  return Array.from(
    { length: Math.round(props.pulse.flashes) },
    (_, index) => snapEnd + 1 + index * 2,
  );
};

export const puzzleBeat = (frame: number, props: PuzzleSuccessProps): PuzzleBeat => {
  const { timing } = props;
  const snapEnd = timing.snapStart + timing.snapFrames;
  const flashes = flashFrames(props);
  const lastFlash = flashes.at(-1) ?? snapEnd;
  const swap = snapEnd + Math.max(1, flashes.length - 1) * 2;
  const pulseEnd = lastFlash + 1 + timing.pulseFrames;
  const onFlash = flashes.some((at) => Math.round(frame) === at);
  const glowReturn = tween(
    frame,
    [timing.glowReturnStart, timing.glowReturnStart + timing.glowReturnFrames],
    [0, 1],
    smooth,
  );
  const poses = Object.fromEntries(
    CORNERS.map((corner) => [corner, poseFor(corner, frame, props)]),
  ) as Record<Corner, PiecePose>;
  const burst = frame >= snapEnd && frame <= lastFlash;
  const fired = frame >= snapEnd;
  const phase = (frame / props.ambient.breathFrames) * Math.PI * 2;
  return {
    breath: 1 - props.ambient.breathe * 0.5 * (1 + Math.sin(phase)),
    breathAlt: 1 - props.ambient.breathe * 0.5 * (1 + Math.cos(phase)),
    poses,
    glow: frame < snapEnd ? 1 : glowReturn,
    labels: frame < swap ? 1 : 0,
    word:
      frame < swap
        ? 0
        : tween(
            frame,
            [timing.wordFadeStart, timing.wordFadeStart + timing.wordFadeFrames],
            [1, 0],
            (t) => t,
          ),
    wordScale: frame >= timing.splitStart ? splitScale(props) : blockScale(frame, props),
    flash: onFlash ? 1 : 0,
    core: fired ? (burst ? 1 : tween(frame, [lastFlash, pulseEnd - 6], [0.45, 0], decay)) : 0,
    coreGrowth: tween(frame, [snapEnd, lastFlash + 1], [0, 1], (t) => t),
    ring: frame <= lastFlash ? 0 : tween(frame, [lastFlash, pulseEnd], [0, 1], (t) => t),
    spark:
      frame <= lastFlash
        ? 0
        : tween(frame, [lastFlash, lastFlash + props.sparks.frames], [0, 1], (t) => t),
    neonBoost: fired ? (burst ? 1 : tween(frame, [lastFlash, lastFlash + 6], [1, 0], decay)) : 0,
  };
};
