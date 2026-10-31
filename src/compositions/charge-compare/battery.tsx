import type { ChargeCompareProps } from '@/schemas';

type BatteryProps = {
  battery: ChargeCompareProps['battery'];
  outline: string;
  body: string;
  boltColor: string;
  boltShown: number;
  level: number;
  fill: string;
  centerX: number;
  bottom: number;
  opacity: number;
};

const boltPath = (cx: number, cy: number, height: number): string => {
  const u = height / 20;
  const points: [number, number][] = [
    [1.5, -10],
    [-5.5, 1.5],
    [-0.5, 1.5],
    [-2, 10],
    [5.5, -2],
    [0.5, -2],
  ];
  const [head, ...rest] = points.map(([x, y]) => `${cx + x * u} ${cy + y * u}`);
  return `M ${head} ${rest.map((point) => `L ${point}`).join(' ')} Z`;
};

export const Battery = ({
  battery,
  outline,
  body,
  boltColor,
  boltShown,
  level,
  fill,
  centerX,
  bottom,
  opacity,
}: BatteryProps) => {
  const { width, height, stroke, inset } = battery;
  const capWidth = width * 0.29;
  const capHeight = height * 0.105;
  const total = height + capHeight;
  const innerHeight = height - inset * 2;
  const innerBottom = capHeight + height - inset;
  const segments = Math.max(1, Math.round(battery.segments));
  const gap = Math.min(battery.segmentGap, innerHeight / segments / 2);
  const cell = (innerHeight - gap * (segments - 1)) / segments;
  const visible = Math.max(0, Math.min(1, level)) * cell * segments;
  const cells = Array.from({ length: segments }, (_, index) => ({
    bottom: innerBottom - index * (cell + gap),
    height: Math.max(0, Math.min(cell, visible - index * cell)),
  })).filter((entry) => entry.height > 0);
  const boltHeight = innerHeight * battery.boltSize;
  return (
    <svg
      width={width}
      height={total}
      viewBox={`0 0 ${width} ${total}`}
      style={{ position: 'absolute', left: centerX - width / 2, top: bottom - total, opacity }}
      role="presentation"
    >
      <rect
        x={(width - capWidth) / 2}
        y={stroke / 2}
        width={capWidth}
        height={capHeight + stroke}
        rx={stroke * 0.7}
        fill={outline}
        stroke={outline}
        strokeWidth={stroke}
      />
      <rect
        x={stroke / 2}
        y={capHeight + stroke / 2}
        width={width - stroke}
        height={height - stroke}
        rx={stroke * 2.4}
        fill={body}
        stroke={outline}
        strokeWidth={stroke}
      />
      {cells.map((entry) => (
        <rect
          key={`cell-${entry.bottom.toFixed(2)}`}
          x={inset}
          y={entry.bottom - entry.height}
          width={width - inset * 2}
          height={entry.height}
          rx={Math.min(stroke * 0.4, entry.height / 2)}
          fill={fill}
        />
      ))}
      {boltShown > 0 ? (
        <path
          d={boltPath(width / 2, capHeight + height / 2, boltHeight)}
          fill={boltColor}
          stroke={body}
          strokeWidth={stroke * 0.6}
          strokeLinejoin="round"
          paintOrder="stroke fill"
          opacity={boltShown}
        />
      ) : null}
    </svg>
  );
};
