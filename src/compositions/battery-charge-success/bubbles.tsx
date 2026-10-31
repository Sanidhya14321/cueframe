import type { BatteryChargeSuccessProps } from '@/schemas';
import { drainEnd } from './choreography';
import { clamp01 } from './curves';

const random = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const LIFE = 46;

export const Bubbles = ({
  props,
  frame,
  inner,
  surface,
  level,
}: {
  props: BatteryChargeSuccessProps;
  frame: number;
  inner: { left: number; right: number; top: number; bottom: number };
  surface: number;
  level: number;
}) => {
  const { timing, liquid } = props;
  const start = timing.fullFrame - 36;
  const end = drainEnd(timing);
  const window = clamp01((frame - start) / 14) * clamp01((end - 4 - frame) / 14);
  if (window <= 0 || level <= 0.02) {
    return null;
  }
  const span = inner.right - inner.left - 60;
  return (
    <g>
      {Array.from({ length: liquid.bubbles }, (_, index) => {
        const offset = random(index + 1) * LIFE;
        const age = (frame - start + offset) % LIFE;
        const life = age / LIFE;
        const x = inner.left + 30 + random(index + 7.3) * span + Math.sin(frame / 9 + index) * 3;
        const y = surface + 24 - life * (70 + random(index + 3.1) * 90);
        const radius = 2.5 + random(index + 5.7) * 3.5;
        const alpha = window * Math.sin(life * Math.PI) * 0.7;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={radius}
            fill="none"
            stroke="#ffffff"
            strokeWidth={1.4}
            opacity={alpha}
          />
        );
      })}
    </g>
  );
};
