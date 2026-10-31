import type { BatteryChargeSuccessProps } from '@/schemas';
import type { BatteryBox } from './choreography';
import { clamp01, rgba, smoothstep } from './curves';

const WAVES = [0, 0.32];

export const CompletionRing = ({
  props,
  frame,
  box,
  color,
}: {
  props: BatteryChargeSuccessProps;
  frame: number;
  box: BatteryBox;
  color: string;
}) => {
  const { charge, battery, timing } = props;
  const length = Math.max(1, charge.ringFrames);
  const start = timing.fullFrame - 4;
  if (charge.ring <= 0 || frame < start || frame > start + length * 1.4) {
    return null;
  }
  const centerY = box.top + box.height / 2;
  return (
    <g style={{ filter: `drop-shadow(0 0 10px ${rgba(color, 0.8)})` }}>
      {WAVES.map((delay) => {
        const progress = clamp01((frame - start - delay * length) / length);
        if (progress <= 0 || progress >= 1) {
          return null;
        }
        const eased = 1 - (1 - progress) ** 3;
        const grow = 1 + 0.3 * eased;
        const alpha = clamp01(charge.ring * smoothstep(0, 0.14, progress) * (1 - progress) ** 2.5);
        return (
          <rect
            key={delay}
            x={box.left}
            y={box.top}
            width={box.width}
            height={box.height}
            rx={battery.radius}
            fill="none"
            stroke={color}
            strokeWidth={3.5 * (1 - 0.5 * eased)}
            opacity={alpha}
            transform={`translate(${box.centerX} ${centerY}) scale(${grow.toFixed(4)}) translate(${-box.centerX} ${-centerY})`}
          />
        );
      })}
    </g>
  );
};
