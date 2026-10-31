import type { ReactNode } from 'react';
import type { ProductIcon } from '@/schemas';

type Paint = { ink: string; tint: string };

const stroke = (ink: string) => ({
  stroke: ink,
  strokeWidth: 4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
});

const DRAWINGS: Record<ProductIcon, (paint: Paint) => ReactNode> = {
  watch: ({ ink, tint }) => (
    <>
      <path d="M40 30 L42 14 H58 L60 30 M40 70 L42 86 H58 L60 70" {...stroke(ink)} />
      <rect x={32} y={28} width={36} height={44} rx={10} fill={ink} />
      <rect x={37} y={33} width={26} height={34} rx={6} fill={tint} />
      <path d="M44 52 L49 46 L53 54 L57 48" {...stroke('#ffffff')} strokeWidth={3} />
    </>
  ),
  earbuds: ({ ink, tint }) => (
    <>
      <circle cx={34} cy={34} r={13} fill={tint} stroke={ink} strokeWidth={4} />
      <rect x={30} y={40} width={9} height={36} rx={4.5} fill={tint} stroke={ink} strokeWidth={4} />
      <circle cx={66} cy={30} r={13} fill={tint} stroke={ink} strokeWidth={4} />
      <rect x={61} y={36} width={9} height={36} rx={4.5} fill={tint} stroke={ink} strokeWidth={4} />
    </>
  ),
  camera: ({ ink, tint }) => (
    <>
      <path d="M36 32 L42 24 H58 L64 32" {...stroke(ink)} />
      <rect x={16} y={32} width={68} height={44} rx={10} fill={ink} />
      <circle cx={50} cy={54} r={16} fill={tint} stroke="#ffffff" strokeWidth={4} />
      <circle cx={50} cy={54} r={6} fill={ink} />
      <circle cx={74} cy={41} r={3} fill="#ffffff" />
    </>
  ),
  headset: ({ ink, tint }) => (
    <>
      <path d="M14 50 C10 34 22 30 30 30 H70 C78 30 90 34 86 50" {...stroke(ink)} />
      <path
        d="M18 38 H82 C88 38 90 44 88 52 L84 66 C83 70 79 72 75 72 H62 L56 62 H44 L38 72 H25 C21 72 17 70 16 66 L12 52 C10 44 12 38 18 38 Z"
        fill={tint}
        stroke={ink}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <path d="M22 48 H78" {...stroke('#ffffff')} strokeWidth={3} />
    </>
  ),
  'power-bank': ({ ink, tint }) => (
    <>
      <path d="M30 26 C20 14 40 8 52 14 C64 20 76 18 80 26" {...stroke(ink)} strokeWidth={3} />
      <rect x={26} y={26} width={48} height={60} rx={8} fill={tint} stroke={ink} strokeWidth={4} />
      <path d="M53 40 L44 56 H55 L47 72" {...stroke('#ffffff')} strokeWidth={4} />
    </>
  ),
  drone: ({ ink, tint }) => (
    <>
      <path d="M26 34 L42 46 M74 34 L58 46 M26 66 L42 56 M74 66 L58 56" {...stroke(ink)} />
      <ellipse cx={22} cy={30} rx={14} ry={4} fill={ink} />
      <ellipse cx={78} cy={30} rx={14} ry={4} fill={ink} />
      <ellipse cx={22} cy={70} rx={14} ry={4} fill={ink} />
      <ellipse cx={78} cy={70} rx={14} ry={4} fill={ink} />
      <rect x={38} y={42} width={24} height={18} rx={6} fill={tint} stroke={ink} strokeWidth={4} />
      <circle cx={50} cy={64} r={5} fill={ink} />
    </>
  ),
  lamp: ({ ink, tint }) => (
    <>
      <path d="M30 82 H62 M44 82 L36 52 L58 30" {...stroke(ink)} />
      <path d="M50 22 L72 16 L82 40 L60 46 Z" fill={tint} stroke={ink} strokeWidth={4} />
      <circle cx={36} cy={52} r={4} fill={ink} />
      <path d="M68 50 L72 58 M76 46 L84 52" {...stroke(ink)} strokeWidth={3} />
    </>
  ),
  mouse: ({ ink, tint }) => (
    <>
      <rect x={30} y={18} width={40} height={64} rx={20} fill={tint} stroke={ink} strokeWidth={4} />
      <path d="M30 42 H70 M50 18 V42" {...stroke(ink)} />
      <rect x={47} y={26} width={6} height={10} rx={3} fill={ink} />
    </>
  ),
  microphone: ({ ink, tint }) => (
    <>
      <rect x={36} y={12} width={28} height={44} rx={14} fill={tint} stroke={ink} strokeWidth={4} />
      <path d="M40 26 H60 M40 34 H60 M40 42 H60" {...stroke(ink)} strokeWidth={3} />
      <path
        d="M28 44 C28 58 38 66 50 66 C62 66 72 58 72 44 M50 66 V82 M36 84 H64"
        {...stroke(ink)}
      />
    </>
  ),
  ring: ({ ink, tint }) => (
    <>
      <circle cx={50} cy={56} r={26} {...stroke(ink)} strokeWidth={9} />
      <circle cx={50} cy={56} r={26} fill="none" stroke={tint} strokeWidth={3} />
      <path d="M42 30 L50 20 L58 30 L50 36 Z" fill={tint} stroke={ink} strokeWidth={3} />
    </>
  ),
};

export const ProductGlyph = ({
  icon,
  ink,
  tint,
  size,
}: {
  icon: ProductIcon;
  ink: string;
  tint: string;
  size: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    {DRAWINGS[icon]({ ink, tint })}
  </svg>
);
