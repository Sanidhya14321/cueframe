import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const UNIT = 20;
const REPEATS = 90;
const LENGTH = UNIT * REPEATS;
const UNITS = Array.from({ length: REPEATS }, (_, index) => index * UNIT);

const round = (value: number): number => Math.round(value * 100) / 100;

type Point = (along: number, across: number) => string;
type Coordinates = (along: number, across: number) => [number, number];

const horizontalXY: Coordinates = (along, across) => [along, across];
const verticalXY: Coordinates = (along, across) => [across, along];
const horizontal: Point = (along, across) => horizontalXY(along, across).join(' ');
const vertical: Point = (along, across) => verticalXY(along, across).join(' ');

const laceEdge = (at: Point, sweep: 0 | 1): string =>
  UNITS.map(
    (x) =>
      `M${at(x, 18)} A${at(10, 9)} 0 0 ${sweep} ${at(x + UNIT, 18)} M${at(x + 4, 18)} A${at(6, 5)} 0 0 ${sweep} ${at(x + 16, 18)}`,
  ).join(' ');

const laceMesh = (at: Point): string =>
  UNITS.map(
    (x) => `M${at(x + 17, 7)} L${at(x + 23, 13)} M${at(x + 17, 13)} L${at(x + 23, 7)}`,
  ).join(' ');

const laceRules = (at: Point): string =>
  `M${at(0, 1.5)} L${at(LENGTH, 1.5)} M${at(0, 4)} L${at(LENGTH, 4)}`;

export const LaceBand = ({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) => {
  const isVertical = orientation === 'vertical';
  const at = isVertical ? vertical : horizontal;
  const xy = isVertical ? verticalXY : horizontalXY;
  const sweep = isVertical ? 1 : 0;
  return (
    <svg
      aria-hidden="true"
      viewBox={isVertical ? `0 0 28 ${LENGTH}` : `0 0 ${LENGTH} 28`}
      preserveAspectRatio={isVertical ? 'xMidYMin slice' : 'xMinYMid slice'}
      className={cn('block overflow-hidden', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.7"
    >
      <path d={laceRules(at)} />
      <path d={laceEdge(at, sweep)} />
      <path d={laceMesh(at)} strokeWidth="0.5" />
      {UNITS.map((x) => {
        const [cx, cy] = xy(x + 10, 10);
        const [dx, dy] = xy(x + 10, 22.5);
        return (
          <g key={x}>
            <circle cx={cx} cy={cy} r="2.4" />
            <circle cx={dx} cy={dy} r="0.9" fill="currentColor" stroke="none" />
          </g>
        );
      })}
    </svg>
  );
};

const PETALS = Array.from({ length: 12 }, (_, index) => index * 30);
const BEADS = Array.from({ length: 24 }, (_, index) => {
  const angle = (index / 24) * Math.PI * 2;
  return { key: index, x: round(Math.cos(angle) * 40), y: round(Math.sin(angle) * 40) };
});

export const Rosette = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="-50 -50 100 100"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="0.8"
  >
    <circle r="5" />
    <circle r="2" fill="currentColor" stroke="none" />
    <circle r="12" />
    {PETALS.map((angle) => (
      <ellipse key={angle} cx="0" cy="-22" rx="4.5" ry="10" transform={`rotate(${angle})`} />
    ))}
    {PETALS.map((angle) => (
      <circle key={angle} cx="0" cy="-34" r="1.6" transform={`rotate(${angle + 15})`} />
    ))}
    {BEADS.map((bead) => (
      <circle key={bead.key} cx={bead.x} cy={bead.y} r="1.1" fill="currentColor" stroke="none" />
    ))}
    <circle r="45" strokeDasharray="1 3" />
  </svg>
);

export const LaceFrame = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('relative', className)}>
    <LaceBand className="absolute top-0 left-0 h-7 w-full -scale-y-100" />
    <LaceBand className="absolute bottom-0 left-0 h-7 w-full" />
    <LaceBand orientation="vertical" className="absolute top-0 left-0 h-full w-7 -scale-x-100" />
    <LaceBand orientation="vertical" className="absolute top-0 right-0 h-full w-7" />
    <div className="absolute inset-9 border border-current/40" />
    <div className="absolute inset-[42px] border border-current/20" />
    {['-top-3 -left-3', '-top-3 -right-3', '-bottom-3 -left-3', '-bottom-3 -right-3'].map(
      (corner) => (
        <Rosette key={corner} className={cn('absolute size-14', corner)} />
      ),
    )}
    <div className="relative px-12 py-16">{children}</div>
  </div>
);

const barWidths = (seed: string): number[] => {
  const source = `${seed}inkandlace`;
  return Array.from(
    { length: 34 },
    (_, index) => (source.charCodeAt(index % source.length) % 3) + 1,
  );
};

export const Barcode = ({ seed, className }: { seed: string; className?: string }) => {
  const widths = barWidths(seed);
  const bars: { x: number; width: number }[] = [];
  let total = 0;
  widths.forEach((width, index) => {
    bars.push({ x: total, width });
    total += width + (index % 2) + 1;
  });
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${total} 30`}
      preserveAspectRatio="none"
      className={className}
      fill="currentColor"
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.width} height="30" />
      ))}
    </svg>
  );
};
