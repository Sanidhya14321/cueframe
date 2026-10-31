import { useId } from 'react';
import { Easing } from 'remotion';
import type { ArrowShape, DoodleInk } from '@/schemas';
import { arrowHead, arrowShaft, scalePoints } from './arrow-paths';
import { type Point, pathLength, smoothstep, wobble } from './ink-geometry';
import { InkFilter, InkStroke } from './ink-stroke';
import { tween } from './timing';

const stroke = Easing.bezier(0.3, 0.1, 0.45, 1);

const SHAFT_SHARE = 0.8;

const REFERENCE_LENGTH = pathLength(arrowShaft('straight'));

const penFrames = (shape: ArrowShape, frames: number): number =>
  frames * Math.max(1, (pathLength(arrowShaft(shape)) / REFERENCE_LENGTH) ** 0.75);

export interface InkTiming {
  drawStart: number;
  drawFrames: number;
  eraseStart: number;
  eraseFrames: number;
}

export const inkPhase = (frame: number, timing: InkTiming) => {
  const drawEnd = timing.drawStart + timing.drawFrames;
  const draw = tween(frame, [timing.drawStart, drawEnd], [0, 1], stroke);
  const erase = tween(
    frame,
    [timing.eraseStart, timing.eraseStart + Math.max(1, timing.eraseFrames)],
    [0, 1],
    (t) => t,
  );
  const settled = tween(frame, [drawEnd, drawEnd + 12], [0, 1], (t) => t);
  const arriving = tween(frame, [timing.drawStart, timing.drawStart + 6], [0, 1], (t) => t);
  const active = draw > 0 ? arriving * (1 - settled) : 0;
  return { draw, erase, active };
};

export const boilTime = (frame: number, ink: DoodleInk): number =>
  frame / Math.max(1, ink.boilFrames);

export const inkPath = (
  points: readonly Point[],
  ink: DoodleInk,
  seed: number,
  time: number,
): Point[] => {
  const base = wobble(points, ink.roughness * ink.width * 1.1, seed, 1 / 110);
  const amount = ink.boil * ink.width * 0.22;
  if (amount === 0) {
    return base;
  }
  const cell = Math.floor(time);
  const mix = smoothstep(0, 1, time - cell);
  const from = wobble(base, amount, seed + 1000 + cell * 31, 1 / 22);
  const to = wobble(base, amount, seed + 1031 + cell * 31, 1 / 22);
  return from.map((point, index) => {
    const target = to[index] ?? point;
    return { x: point.x + (target.x - point.x) * mix, y: point.y + (target.y - point.y) * mix };
  });
};

export interface InkArrowProps extends InkTiming {
  shape: ArrowShape;
  size: number;
  headSize: number;
  ink: DoodleInk;
  color: string;
  leadColor: string;
  frame: number;
  seed: number;
}

export const InkArrow = ({
  shape,
  size,
  headSize,
  ink,
  color,
  leadColor,
  frame,
  seed,
  ...timing
}: InkArrowProps) => {
  const filterId = useId().replace(/:/g, '');
  const { draw, erase, active } = inkPhase(frame, {
    ...timing,
    drawFrames: penFrames(shape, timing.drawFrames),
  });
  if (draw <= 0 || erase >= 1) {
    return null;
  }
  const time = boilTime(frame, ink);
  const shaft = scalePoints(arrowShaft(shape), size);
  const barbs = arrowHead(shaft, size * headSize);
  const shared = {
    width: ink.width,
    color,
    leadColor,
    erase,
    leadOffset: ink.leadOffset,
  };
  return (
    <g>
      <defs>
        <InkFilter
          id={filterId}
          seed={seed}
          roughness={ink.width * (0.25 + ink.roughness * 0.5)}
          dryness={ink.roughness}
        />
      </defs>
      <g filter={`url(#${filterId})`}>
        <InkStroke
          {...shared}
          points={inkPath(shaft, ink, seed, time)}
          draw={Math.min(1, draw / SHAFT_SHARE)}
          leadOpacity={ink.lead * active}
          flecks={ink.flecks * active}
          seed={seed}
        />
        {barbs.map((barb, index) => (
          <InkStroke
            key={`barb-${index.toString()}`}
            {...shared}
            width={ink.width * 0.92}
            points={inkPath(barb, ink, seed + 50 + index, time)}
            draw={Math.max(0, (draw - SHAFT_SHARE) / (1 - SHAFT_SHARE))}
            leadOpacity={ink.lead * active}
            flecks={0}
            seed={seed + 50 + index}
          />
        ))}
      </g>
    </g>
  );
};
