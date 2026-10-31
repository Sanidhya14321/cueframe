import type { MailinfraDewStepsProps } from '@/schemas';
import { settle, tween } from '../promo/timing';
import { seeded } from './paint';
import { type DewPlan, strandY } from './timeline';

const STRAND_START = -900;
const STRAND_STEP = 24;

const strandFront = (frame: number): number =>
  frame < 15 ? STRAND_START + 500 + 3 * frame * frame : STRAND_START + 1175 + 90 * (frame - 15);

export const Strand = ({
  frame,
  props,
  plan,
  clipId,
}: {
  frame: number;
  props: MailinfraDewStepsProps;
  plan: DewPlan;
  clipId: string;
}) => {
  const { silk, drop } = props;
  const points: string[] = [];
  for (let x = STRAND_START; x <= plan.worldEnd; x += STRAND_STEP) {
    points.push(`${x} ${strandY(x, frame, props, plan).toFixed(2)}`);
  }
  const random = seeded(11);
  const beads: { x: number; r: number; key: number }[] = [];
  if (silk.beads > 0) {
    const spacing = 150 / silk.beads;
    for (let x = STRAND_START + 60; x < plan.worldEnd; x += spacing * (0.55 + random())) {
      const nearDrop = plan.stops.some((stop) => Math.abs(x - stop.dropX) < drop.size * 0.45);
      const radius = (2.2 + random() * 3.4) * (silk.width / 2.4);
      if (!nearDrop) {
        beads.push({ x, r: radius, key: beads.length });
      }
    }
  }
  const front = strandFront(frame);
  const path = `M ${points.join(' L ')}`;
  return (
    <g mask={front < plan.worldEnd ? `url(#${clipId})` : undefined}>
      <defs>
        <linearGradient
          id={`${clipId}-fade`}
          gradientUnits="userSpaceOnUse"
          x1={front - 420}
          y1={0}
          x2={front}
          y2={0}
        >
          <stop offset="0" stopColor="#ffffff" stopOpacity={1} />
          <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
        <mask
          id={clipId}
          maskUnits="userSpaceOnUse"
          x={STRAND_START - 200}
          y={-4000}
          width={plan.worldEnd - STRAND_START + 400}
          height={9000}
        >
          <rect
            x={STRAND_START - 200}
            y={-4000}
            width={Math.max(0, front - STRAND_START + 200)}
            height={9000}
            fill={`url(#${clipId}-fade)`}
          />
        </mask>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={silk.color}
        strokeOpacity={0.14}
        strokeWidth={silk.width * 3.6}
      />
      <path
        d={path}
        fill="none"
        stroke={silk.color}
        strokeOpacity={0.95}
        strokeWidth={silk.width}
      />
      {beads.map((bead) => {
        const y = strandY(bead.x, frame, props, plan) + bead.r * 0.55;
        return (
          <g key={bead.key}>
            <circle cx={bead.x} cy={y} r={bead.r} fill={silk.color} fillOpacity={0.3} />
            <circle
              cx={bead.x}
              cy={y}
              r={bead.r}
              fill="none"
              stroke={silk.color}
              strokeOpacity={0.55}
              strokeWidth={0.9}
            />
            <circle
              cx={bead.x - bead.r * 0.35}
              cy={y - bead.r * 0.35}
              r={bead.r * 0.32}
              fill={drop.shine}
              fillOpacity={0.9}
            />
          </g>
        );
      })}
    </g>
  );
};

export const OrbWeb = ({
  hubX,
  hubY,
  radius,
  from,
  to,
  draw,
  color,
  opacity,
}: {
  hubX: number;
  hubY: number;
  radius: number;
  from: number;
  to: number;
  draw: number;
  color: string;
  opacity: number;
}) => {
  if (draw <= 0.005 || opacity <= 0) {
    return null;
  }
  const spokes = 9;
  const rings = 10;
  const angles = Array.from({ length: spokes }, (_, index) => {
    const t = index / (spokes - 1);
    return ((from + (to - from) * t + Math.sin(index * 2.3) * 3) * Math.PI) / 180;
  });
  const spokeDraw = tween(draw, [0, 0.62], [0, 1], settle);
  const spokeFade = tween(draw, [0, 0.4], [0, 1]);
  const point = (angle: number, distance: number) => ({
    x: hubX + Math.cos(angle) * distance,
    y: hubY + Math.sin(angle) * distance,
  });
  return (
    <g opacity={opacity} fill="none" stroke={color} strokeLinecap="butt">
      {angles.map((angle, index) => {
        const reach = radius * (0.92 + Math.sin(index * 1.7) * 0.08);
        const end = point(angle, reach * spokeDraw);
        return (
          <line
            key={`spoke-${index}`}
            x1={hubX}
            y1={hubY}
            x2={end.x}
            y2={end.y}
            strokeWidth={1.4}
            strokeOpacity={spokeFade}
          />
        );
      })}
      {Array.from({ length: rings }, (_, ring) => {
        const start = 0.16 + (ring / rings) * 0.66;
        const progress = tween(draw, [start, start + 0.18], [0, 1]);
        if (progress <= 0.01) {
          return null;
        }
        const distance = radius * (0.12 + (ring / rings) * 0.84);
        const segments = angles.slice(1).map((angle, index) => {
          const previous = angles[index] ?? angle;
          const a = point(previous, distance);
          const b = point(angle, distance);
          const middle = point((previous + angle) / 2, distance * 0.9);
          return `${index === 0 ? `M ${a.x} ${a.y} ` : ''}Q ${middle.x} ${middle.y} ${b.x} ${b.y}`;
        });
        return (
          <path
            key={`ring-${ring}`}
            d={segments.join(' ')}
            pathLength={1}
            strokeDasharray={progress >= 1 ? undefined : `${progress} 2`}
            strokeWidth={1.1}
            strokeOpacity={0.8}
          />
        );
      })}
    </g>
  );
};

export const BeadRow = ({
  x,
  direction,
  frame,
  arrive,
  props,
  plan,
}: {
  x: number;
  direction: number;
  frame: number;
  arrive: number;
  props: MailinfraDewStepsProps;
  plan: DewPlan;
}) => {
  const { silk, drop } = props;
  return (
    <g>
      {Array.from({ length: 6 }, (_, index) => {
        const bx = x + direction * (drop.size * 0.62 + index * 44 + index * index * 3);
        const r = (9.5 - index * 1.05) * (silk.width / 2.4);
        const y = strandY(bx, frame, props, plan) + r * 0.7;
        const flash = Math.max(0, 1 - Math.abs(frame - (arrive + 10 + index * 5)) / 7);
        return (
          <g key={index}>
            <circle cx={bx} cy={y} r={r} fill={drop.tint} fillOpacity={0.35} />
            <circle
              cx={bx}
              cy={y}
              r={r}
              fill="none"
              stroke={silk.color}
              strokeOpacity={0.6}
              strokeWidth={1}
            />
            <circle
              cx={bx - r * 0.35}
              cy={y - r * 0.38}
              r={r * 0.3}
              fill={drop.shine}
              fillOpacity={0.9}
            />
            <circle
              cx={bx - r * 0.35}
              cy={y - r * 0.38}
              r={r * (0.3 + flash * 1.1)}
              fill={drop.shine}
              fillOpacity={flash * 0.45}
            />
          </g>
        );
      })}
    </g>
  );
};
