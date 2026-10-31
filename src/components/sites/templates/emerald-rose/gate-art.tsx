import { useId } from 'react';
import { cn } from '@/lib/utils';

const ARCH = 'M2 258 V60 Q60 22 118 18 V258 Z';
const BARS = [14, 26, 38, 50, 62, 74, 86, 98, 110];
const PICKETS = [20, 32, 44, 56, 68, 80, 92, 104];

export const GatePanel = ({ className }: { className?: string }) => {
  const clip = useId();
  return (
    <svg
      viewBox="0 0 120 260"
      aria-hidden
      preserveAspectRatio="none"
      className={cn('pointer-events-none', className)}
      fill="none"
      stroke="var(--er-accent)"
    >
      <defs>
        <clipPath id={clip}>
          <path d={ARCH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} strokeWidth="2">
        {BARS.map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="258" />
        ))}
      </g>
      <path d={ARCH} strokeWidth="4" strokeLinejoin="round" />
      <path d="M2 76 Q60 38 118 34" strokeWidth="2" />
      <path d="M2 170 H118 M2 184 H118 M2 240 H118" strokeWidth="2.5" />
      {PICKETS.map((x) => (
        <g key={x}>
          <circle cx={x} cy="177" r="4.5" strokeWidth="1.5" />
          <line x1={x} y1="198" x2={x} y2="240" strokeWidth="1.5" />
          <circle cx={x} cy="196" r="2.5" fill="var(--er-accent)" stroke="none" />
        </g>
      ))}
      <g transform="translate(62 116)" strokeWidth="2">
        <circle r="24" fill="var(--er-primary-deep)" fillOpacity="0.55" />
        <circle r="18" strokeWidth="1.2" />
        <circle cx="0" cy="-8" r="8" strokeWidth="1.4" />
        <circle cx="8" cy="0" r="8" strokeWidth="1.4" />
        <circle cx="0" cy="8" r="8" strokeWidth="1.4" />
        <circle cx="-8" cy="0" r="8" strokeWidth="1.4" />
        <circle r="2.5" fill="var(--er-accent)" stroke="none" />
      </g>
      <path
        d="M14 124 C14 100 30 92 38 104 C44 114 32 120 28 112 M110 124 C110 100 94 92 86 104 C80 114 92 120 96 112"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Bloom = ({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={fill} />
    <path
      d={`M0 ${-r / 2} a${r / 2} ${r / 2} 0 1 1 ${-r / 2} ${r / 2} a${r / 4} ${r / 4} 0 1 1 ${r / 4} ${-r / 4}`}
      fill="none"
      stroke="var(--er-secondary-deep)"
      strokeOpacity="0.55"
      strokeWidth="1"
    />
  </g>
);

const HEDGE = [
  { x: 6, y: 238, r: 13, fill: 'var(--er-secondary)' },
  { x: 28, y: 226, r: 10, fill: 'var(--er-blush)' },
  { x: 44, y: 246, r: 12, fill: 'var(--er-secondary)' },
  { x: 66, y: 232, r: 8, fill: 'var(--er-blush)' },
  { x: 176, y: 232, r: 8, fill: 'var(--er-blush)' },
  { x: 196, y: 246, r: 12, fill: 'var(--er-secondary)' },
  { x: 214, y: 226, r: 10, fill: 'var(--er-blush)' },
  { x: 236, y: 238, r: 13, fill: 'var(--er-secondary)' },
];

export const GardenView = ({ className }: { className?: string }) => {
  const light = useId();
  return (
    <svg
      viewBox="0 0 240 260"
      aria-hidden
      preserveAspectRatio="none"
      className={cn('pointer-events-none', className)}
    >
      <defs>
        <radialGradient id={light} cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="var(--er-bg)" />
          <stop offset="38%" stopColor="var(--er-glow)" />
          <stop offset="100%" stopColor="var(--er-secondary-deep)" />
        </radialGradient>
      </defs>
      <path d="M0 260 V60 Q60 22 120 18 Q180 22 240 60 V260 Z" fill={`url(#${light})`} />
      <path d="M96 260 L116 132 H124 L144 260 Z" fill="var(--er-bg)" fillOpacity="0.55" />
      <path
        d="M0 216 C40 196 80 210 108 200 C112 220 100 240 96 260 H0 Z M240 216 C200 196 160 210 132 200 C128 220 140 240 144 260 H240 Z"
        fill="var(--er-primary)"
      />
      {HEDGE.map((bloom) => (
        <Bloom key={`${bloom.x}-${bloom.y}`} {...bloom} />
      ))}
    </svg>
  );
};

export const PostCap = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 36" aria-hidden className={cn('pointer-events-none', className)}>
    <path d="M4 36 H36 V30 H4 Z M8 30 C8 18 32 18 32 30 Z" fill="var(--er-accent)" />
    <circle cx="20" cy="12" r="6" fill="var(--er-accent)" />
    <path d="M20 0 V6" stroke="var(--er-accent)" strokeWidth="2" />
  </svg>
);
