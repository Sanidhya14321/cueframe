import { cn } from '@/lib/utils';

export const Mitten = ({
  className,
  cuff = 'var(--sd-bg)',
}: {
  className?: string;
  cuff?: string;
}) => (
  <svg viewBox="0 0 64 80" className={className} aria-hidden="true">
    <path
      d="M14 50 C8 36 8 20 20 12 C30 6 44 8 48 22 L50 32 C54 26 62 28 60 38 C58 46 54 50 50 54 Z"
      fill="currentColor"
    />
    <path
      d="M20 24 C24 18 32 16 38 20"
      stroke="white"
      strokeOpacity="0.45"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="11" y="50" width="42" height="18" rx="6" fill={cuff} />
    <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.4" strokeLinecap="round">
      {[17, 23, 29, 35, 41, 47].map((x) => (
        <path key={x} d={`M${x} 54 V64`} />
      ))}
    </g>
  </svg>
);

export const SnowflakeMark = ({ className }: { className?: string }) => (
  <svg viewBox="-12 -12 24 24" className={className} aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none">
      {[0, 60, 120].map((angle) => (
        <path
          key={angle}
          d="M0 -10 V10 M-3.2 -7.4 L0 -4.6 L3.2 -7.4 M-3.2 7.4 L0 4.6 L3.2 7.4"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>
    <circle r="1.6" fill="currentColor" />
  </svg>
);

export const Sparkle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <path
      d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z"
      fill="currentColor"
    />
  </svg>
);

export const CocoaMug = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <g fill="none" stroke="var(--sd-ice)" strokeWidth="3" strokeLinecap="round">
      <path d="M22 14 C18 10 26 6 22 2" />
      <path d="M32 14 C28 10 36 6 32 2" />
    </g>
    <path d="M10 22 H48 V46 C48 54 42 60 34 60 H24 C16 60 10 54 10 46 Z" fill="var(--sd-accent)" />
    <path d="M48 28 C60 28 60 46 48 46" fill="none" stroke="var(--sd-accent)" strokeWidth="5" />
    <ellipse cx="29" cy="22" rx="19" ry="5" fill="var(--sd-accent-deep)" />
    <circle cx="22" cy="20" r="4" fill="white" />
    <circle cx="31" cy="19" r="4.4" fill="white" />
    <circle cx="38" cy="21.5" r="3.4" fill="white" />
    <path
      d="M18 36 H40 M18 44 H40"
      stroke="white"
      strokeOpacity="0.5"
      strokeWidth="3"
      strokeDasharray="4 4"
    />
  </svg>
);

export const SnowDrift = ({ className, fill }: { className?: string; fill: string }) => (
  <svg
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    className={cn('block w-full', className)}
    aria-hidden="true"
  >
    <path
      d="M0 70 C120 20 220 30 330 62 C440 94 520 40 640 36 C760 32 820 86 940 78 C1060 70 1120 30 1200 44 V120 H0 Z"
      fill={fill}
    />
  </svg>
);

export const KnitCuff = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn(
      'bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.28)_0_6px,transparent_6px_12px)]',
      className,
    )}
  />
);

export const MittenGarland = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={cn('pointer-events-none flex items-start justify-center', className)}
  >
    <svg
      viewBox="0 0 300 40"
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-10 w-full"
      preserveAspectRatio="none"
    >
      <path
        d="M0 6 Q150 46 300 6"
        stroke="var(--sd-text)"
        strokeOpacity="0.35"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
    <Mitten className="mt-3 w-9 origin-top animate-[sd-bob_3.2s_ease-in-out_infinite] text-(--sd-accent) motion-reduce:animate-none" />
    <SnowflakeMark className="mx-5 mt-7 size-6 text-(--sd-primary)" />
    <Mitten className="mt-3 w-9 origin-top -scale-x-100 animate-[sd-bob_3.6s_ease-in-out_infinite] text-(--sd-primary) motion-reduce:animate-none" />
  </div>
);
