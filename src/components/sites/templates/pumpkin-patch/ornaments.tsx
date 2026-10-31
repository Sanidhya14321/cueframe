import { cn } from '@/lib/utils';

export type PumpkinTone = 'primary' | 'accent' | 'cream' | 'sage';

const TONES: Record<PumpkinTone, { body: string; shade: string }> = {
  primary: { body: 'var(--pp-primary)', shade: 'var(--pp-primary-deep)' },
  accent: { body: 'var(--pp-accent)', shade: 'var(--pp-accent-deep)' },
  cream: { body: 'var(--pp-card)', shade: 'var(--pp-oat-deep)' },
  sage: { body: 'var(--pp-secondary)', shade: 'var(--pp-sage-deep)' },
};

export const Pumpkin = ({
  tone = 'primary',
  leaf = true,
  className,
}: {
  tone?: PumpkinTone;
  leaf?: boolean;
  className?: string;
}) => {
  const { body, shade } = TONES[tone];
  const rib = { fill: body, stroke: shade, strokeWidth: 2.2, strokeOpacity: 0.4 };
  return (
    <svg viewBox="0 0 120 104" aria-hidden className={cn('pointer-events-none', className)}>
      <ellipse cx="60" cy="98" rx="40" ry="5" fill="var(--pp-text)" opacity="0.08" />
      <ellipse cx="60" cy="63" rx="52" ry="37" fill={body} />
      <ellipse cx="34" cy="63" rx="26" ry="35" {...rib} />
      <ellipse cx="86" cy="63" rx="26" ry="35" {...rib} />
      <ellipse cx="60" cy="64" rx="23" ry="37" {...rib} />
      <path
        d="M24 52 C26 42 32 36 39 33"
        fill="none"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M55 30 C54 20 57 12 64 7 L70 11 C64 16 63 22 64 30 Z" fill="var(--pp-stem)" />
      {leaf ? (
        <>
          <path d="M66 24 C74 11 92 10 98 17 C90 27 76 29 66 24 Z" fill="var(--pp-secondary)" />
          <path
            d="M68 23 C78 19 86 17 94 17"
            fill="none"
            stroke="var(--pp-sage-deep)"
            strokeOpacity="0.5"
            strokeWidth="1.2"
          />
          <path
            d="M60 22 C50 14 40 18 42 25 C44 30 51 28 49 23"
            fill="none"
            stroke="var(--pp-secondary)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : null}
    </svg>
  );
};

export const Bow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 84" aria-hidden className={cn('pointer-events-none', className)}>
    <path
      d="M56 42 C50 56 42 68 32 80 L44 82 C51 70 57 56 60 44 Z"
      fill="var(--pp-accent)"
      stroke="var(--pp-accent-deep)"
      strokeOpacity="0.35"
    />
    <path
      d="M64 42 C70 56 78 68 88 80 L76 82 C69 70 63 56 60 44 Z"
      fill="var(--pp-accent)"
      stroke="var(--pp-accent-deep)"
      strokeOpacity="0.35"
    />
    <path d="M60 36 C44 10 12 6 10 26 C8 46 40 48 60 40 Z" fill="var(--pp-accent)" />
    <path d="M60 36 C76 10 108 6 110 26 C112 46 80 48 60 40 Z" fill="var(--pp-accent)" />
    <path
      d="M57 37 C44 24 26 20 20 27 M63 37 C76 24 94 20 100 27"
      fill="none"
      stroke="var(--pp-accent-deep)"
      strokeOpacity="0.45"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M22 18 C30 14 40 16 46 22 M98 18 C90 14 80 16 74 22"
      fill="none"
      stroke="white"
      strokeOpacity="0.4"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="51" y="29" width="18" height="17" rx="6" fill="var(--pp-accent-deep)" />
    <rect x="53" y="30" width="14" height="14" rx="5" fill="var(--pp-accent)" />
  </svg>
);

export const MAPLE =
  'M0 -12 L3 -6 L8 -8 L6 -2 L11 0 L6 3 L7 8 L2 6 L0 12 L-2 6 L-7 8 L-6 3 L-11 0 L-6 -2 L-8 -8 L-3 -6 Z';

export const OVAL_LEAF = 'M0 -12 C7 -7 8 3 0 12 C-8 3 -7 -7 0 -12 Z';

export const LeafIcon = ({
  shape,
  fill,
  className,
}: {
  shape: string;
  fill: string;
  className?: string;
}) => (
  <svg viewBox="-13 -13 26 26" aria-hidden className={cn('pointer-events-none', className)}>
    <path d={shape} fill={fill} />
    <path d="M0 -8 L0 12" stroke="black" strokeOpacity="0.18" strokeWidth="1" />
  </svg>
);

const VINE_LEAVES = [
  { x: 40, y: 22, angle: -40 },
  { x: 92, y: 30, angle: 30 },
  { x: 150, y: 18, angle: -20 },
  { x: 208, y: 30, angle: 40 },
  { x: 262, y: 20, angle: -30 },
];

export const Vine = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 300 48" aria-hidden className={cn('pointer-events-none', className)}>
    <path
      d="M4 30 C40 6 70 46 110 26 C150 6 180 44 220 26 C250 12 276 24 296 18"
      fill="none"
      stroke="var(--pp-stem)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M118 24 C124 12 138 14 134 22 C131 27 125 24 128 20 M230 24 C236 36 250 34 246 26"
      fill="none"
      stroke="var(--pp-secondary)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {VINE_LEAVES.map((leaf) => (
      <path
        key={leaf.x}
        d={OVAL_LEAF}
        transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(0.8)`}
        fill="var(--pp-secondary)"
      />
    ))}
  </svg>
);

export const PumpkinTrio = ({ className }: { className?: string }) => (
  <div className={cn('pointer-events-none relative', className)}>
    <Pumpkin tone="cream" leaf={false} className="absolute bottom-0 left-0 w-[46%]" />
    <Pumpkin tone="primary" className="absolute right-[8%] bottom-0 w-[62%]" />
    <Pumpkin tone="accent" leaf={false} className="absolute right-0 bottom-0 w-[30%]" />
  </div>
);

export const GINGHAM =
  'bg-[linear-gradient(90deg,color-mix(in_oklab,var(--pp-secondary)_16%,transparent)_50%,transparent_50%),linear-gradient(color-mix(in_oklab,var(--pp-secondary)_16%,transparent)_50%,transparent_50%)] bg-size-[28px_28px]';
