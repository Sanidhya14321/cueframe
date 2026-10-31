import { useId } from 'react';

const SUN = 'M 25 66 A 25 25 0 0 1 75 66';

const HORIZON = 'M 14 66 L 86 66';

const SHORE = 'M 32 80 L 68 80';

const STROKES: { d: string; from: number; to: number }[] = [
  { d: HORIZON, from: 0, to: 0.45 },
  { d: SUN, from: 0.2, to: 0.85 },
  { d: SHORE, from: 0.55, to: 1 },
];

const portion = (draw: number, from: number, to: number): number =>
  Math.min(1, Math.max(0, (draw - from) / (to - from)));

export const BrandMark = ({
  size,
  roundness,
  disc,
  discDeep,
  wave,
  draw = 1,
  discOpacity = 1,
}: {
  size: number;
  roundness: number;
  disc: string;
  discDeep?: string;
  wave: string;
  draw?: number;
  discOpacity?: number;
}) => {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const fill = discDeep === undefined ? disc : `url(#mark-fill-${id})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      {discDeep === undefined ? null : (
        <defs>
          <linearGradient id={`mark-fill-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={disc} />
            <stop offset="100%" stopColor={discDeep} />
          </linearGradient>
        </defs>
      )}
      <rect width={100} height={100} rx={roundness * 100} fill={fill} opacity={discOpacity} />
      {STROKES.map(({ d, from, to }) => {
        const amount = portion(draw, from, to);
        return amount <= 0 ? null : (
          <path
            key={d}
            d={d}
            pathLength={1}
            fill="none"
            stroke={wave}
            strokeWidth={8}
            strokeLinecap="butt"
            strokeDasharray="1 1"
            strokeDashoffset={1 - amount}
            opacity={Math.min(1, amount * 5)}
          />
        );
      })}
    </svg>
  );
};

export const BrandLabel = ({
  kicker,
  name,
  size,
  color,
  font,
  align = 'left',
}: {
  kicker: string;
  name: string;
  size: number;
  color: string;
  font: string;
  align?: 'left' | 'center';
}) => (
  <div style={{ fontFamily: font, color, lineHeight: 1, whiteSpace: 'nowrap', textAlign: align }}>
    {kicker === '' ? null : (
      <div
        style={{
          fontSize: size * 0.36,
          fontWeight: 600,
          letterSpacing: '0.32em',
          marginRight: '-0.32em',
        }}
      >
        {kicker}
      </div>
    )}
    <div
      style={{
        fontSize: size,
        fontWeight: 700,
        letterSpacing: '0.14em',
        marginRight: '-0.14em',
        marginTop: size * 0.1,
      }}
    >
      {name}
    </div>
  </div>
);
