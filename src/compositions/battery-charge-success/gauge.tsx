import type { BatteryChargeSuccessProps } from '@/schemas';
import { clamp01, rgba, smoothstep } from './curves';

const BOLT: readonly (readonly [number, number])[] = [
  [0.1, -0.5],
  [-0.3, 0.06],
  [-0.03, 0.06],
  [-0.1, 0.5],
  [0.3, -0.08],
  [0.03, -0.08],
];

export const boltPath = (centerX: number, centerY: number, size: number) =>
  `${BOLT.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${(centerX + x * size).toFixed(2)} ${(centerY + y * size).toFixed(2)}`).join(' ')} Z`;

export const boltStrength = (frame: number, timing: BatteryChargeSuccessProps['timing']) => {
  const on =
    smoothstep(timing.plugFrame - 6, timing.plugFrame + 14, frame) *
    (1 - smoothstep(timing.unplugFrame - 2, timing.unplugFrame + 16, frame));
  const pulse = 0.78 + 0.22 * Math.sin(frame / 8);
  return 0.22 + 0.78 * on * pulse;
};

export const Ticks = ({
  props,
  inner,
  fillable,
  level,
  color,
}: {
  props: BatteryChargeSuccessProps;
  inner: { left: number; right: number; bottom: number };
  fillable: number;
  level: number;
  color: string;
}) => {
  const { battery } = props;
  const count = Math.round(battery.ticks);
  return (
    <g>
      {Array.from({ length: count }, (_, index) => {
        const mark = (index + 1) / (count + 1);
        const y = inner.bottom - fillable * mark;
        const lit = smoothstep(mark - 0.1, mark + 0.02, level);
        const alpha = clamp01(0.28 + 0.62 * lit);
        return (
          <g key={mark}>
            <rect
              x={inner.left + 14}
              y={y - 1.75}
              width={battery.tickWidth}
              height={3.5}
              rx={1.75}
              fill={rgba(color, alpha)}
            />
            <rect
              x={inner.right - 14 - battery.tickWidth * 0.55}
              y={y - 1.75}
              width={battery.tickWidth * 0.55}
              height={3.5}
              rx={1.75}
              fill={rgba(color, alpha * 0.7)}
            />
          </g>
        );
      })}
    </g>
  );
};
