import { settle, smooth, tween } from './timing';

const RING = 2 * Math.PI * 38;

export const BrandMark = ({
  color,
  frame,
  size,
  start = 4,
}: {
  color: string;
  frame: number;
  size: number;
  start?: number;
}) => {
  const draw = tween(frame, [start, start + 36], [0, 1], smooth);
  const length = Math.min(1, draw * 1.03);
  const dot = tween(frame, [start + 22, start + 42], [0, 1], settle);
  const angle = -Math.PI / 4 + (1 - dot) * Math.PI * 1.2;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke={color}
        strokeWidth={11 * Math.max(0.15, Math.min(1, draw * 4))}
        strokeLinecap="butt"
        strokeDasharray={length >= 1 ? undefined : `${RING * length} ${RING * 2}`}
        opacity={Math.min(1, draw * 4)}
        transform="rotate(-90 50 50)"
      />
      <circle
        cx={50 + Math.cos(angle) * 21}
        cy={50 + Math.sin(angle) * 21}
        r={7 * dot}
        fill={color}
      />
    </svg>
  );
};
