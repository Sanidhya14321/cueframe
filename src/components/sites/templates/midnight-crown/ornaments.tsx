import { useId } from 'react';
import { cn } from '@/lib/utils';
import { DECO, DISPLAY } from './fonts';

const FoilStops = ({ id }: { id: string }) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" style={{ stopColor: 'var(--mc-gold-deep)' }} />
      <stop offset="30%" style={{ stopColor: 'var(--mc-gold-light)' }} />
      <stop offset="55%" style={{ stopColor: 'var(--mc-gold)' }} />
      <stop offset="80%" style={{ stopColor: 'var(--mc-gold-light)' }} />
      <stop offset="100%" style={{ stopColor: 'var(--mc-gold-deep)' }} />
    </linearGradient>
  </defs>
);

const CROWN_TIPS = [
  { x: 12, y: 24, r: 3.4 },
  { x: 36, y: 16, r: 3.4 },
  { x: 60, y: 6, r: 4.4 },
  { x: 84, y: 16, r: 3.4 },
  { x: 108, y: 24, r: 3.4 },
];

export const Crown = ({ className }: { className?: string }) => {
  const id = useId();
  const fill = `url(#${id})`;
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true">
      <FoilStops id={id} />
      <path
        d="M20 62 L12 24 L30 44 L36 16 L50 40 L60 6 L70 40 L84 16 L90 44 L108 24 L100 62 Z"
        fill={fill}
      />
      <path
        d="M24 58 L19 36 L31 49 L37 28 L50 47 L60 22 L70 47 L83 28 L89 49 L101 36 L96 58 Z"
        fill="none"
        stroke="var(--mc-bg)"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      {CROWN_TIPS.map((tip) => (
        <circle key={tip.x} cx={tip.x} cy={tip.y} r={tip.r} fill={fill} />
      ))}
      <rect x="17" y="62" width="86" height="11" rx="2" fill={fill} />
      <path d="M60 44 L65 50 L60 56 L55 50 Z" fill="var(--mc-blush)" />
      {[34, 60, 86].map((x) => (
        <circle key={x} cx={x} cy="67.5" r="2.6" fill="var(--mc-bg)" fillOpacity="0.55" />
      ))}
    </svg>
  );
};

export const CrownMonogram = ({
  initial,
  className,
  letterClassName,
}: {
  initial: string;
  className?: string;
  letterClassName?: string;
}) => (
  <span className={cn('flex flex-col items-center', className)}>
    <Crown className="w-[46%]" />
    <span className={cn(DISPLAY, 'mt-[-4%] text-(--mc-text) italic leading-none', letterClassName)}>
      {initial}
    </span>
  </span>
);

export const Sparkle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      d="M12 0 C12.8 7.2 16.8 11.2 24 12 C16.8 12.8 12.8 16.8 12 24 C11.2 16.8 7.2 12.8 0 12 C7.2 11.2 11.2 7.2 12 0 Z"
      fill="currentColor"
    />
  </svg>
);

export const DecoRule = ({ className }: { className?: string }) => (
  <span className={cn('flex w-full max-w-xs items-center gap-3 text-(--mc-gold)', className)}>
    <span className="h-px flex-1 bg-linear-to-r from-transparent to-(--mc-gold)" />
    <span className="size-1.5 rotate-45 border border-(--mc-gold)" />
    <Sparkle className="size-3.5" />
    <span className="size-1.5 rotate-45 border border-(--mc-gold)" />
    <span className="h-px flex-1 bg-linear-to-l from-transparent to-(--mc-gold)" />
  </span>
);

const RAYS = Array.from({ length: 13 }, (_, index) => {
  const angle = Math.PI + (index * Math.PI) / 12;
  return {
    x: Math.round((100 + Math.cos(angle) * 96) * 100) / 100,
    y: Math.round((100 + Math.sin(angle) * 96) * 100) / 100,
  };
});

export const Sunburst = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 100" className={className} aria-hidden="true">
    {RAYS.map((ray) => (
      <line
        key={`${ray.x}-${ray.y}`}
        x1="100"
        y1="100"
        x2={ray.x}
        y2={ray.y}
        stroke="var(--mc-gold)"
        strokeWidth="0.6"
        strokeOpacity="0.55"
      />
    ))}
    <path d="M30 100 A70 70 0 0 1 170 100" fill="none" stroke="var(--mc-gold)" strokeWidth="0.8" />
    <path
      d="M52 100 A48 48 0 0 1 148 100"
      fill="none"
      stroke="var(--mc-gold)"
      strokeWidth="0.6"
      strokeOpacity="0.7"
    />
  </svg>
);

export const DecoCorners = ({ className }: { className?: string }) => (
  <span aria-hidden="true" className={cn('pointer-events-none absolute inset-2', className)}>
    <span className="absolute top-0 left-0 size-4 border-(--mc-gold) border-t border-l" />
    <span className="absolute top-0 right-0 size-4 border-(--mc-gold) border-t border-r" />
    <span className="absolute bottom-0 left-0 size-4 border-(--mc-gold) border-b border-l" />
    <span className="absolute right-0 bottom-0 size-4 border-(--mc-gold) border-r border-b" />
  </span>
);

export const SectionTitle = ({
  kicker,
  title,
  className,
}: {
  kicker: string;
  title: string;
  className?: string;
}) => (
  <div className={cn('flex flex-col items-center gap-3 text-center', className)}>
    <span className={cn(DECO, 'flex items-center gap-3 text-(--mc-blush) text-xs')}>
      <Sparkle className="size-2.5 text-(--mc-gold)" />
      {kicker}
      <Sparkle className="size-2.5 text-(--mc-gold)" />
    </span>
    <h2
      className={cn(
        DISPLAY,
        'bg-(image:--mc-foil) bg-[length:220%_100%] bg-clip-text text-transparent text-4xl italic leading-tight @3xl:text-5xl',
      )}
    >
      {title}
    </h2>
    <DecoRule className="mt-1" />
  </div>
);
