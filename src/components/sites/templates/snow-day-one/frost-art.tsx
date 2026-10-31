import { cn } from '@/lib/utils';

const FROST_LAYERS = [
  'radial-gradient(ellipse at 0% 0%, rgba(255,255,255,0.95), transparent 46%)',
  'radial-gradient(ellipse at 100% 100%, rgba(255,255,255,0.95), transparent 50%)',
  'radial-gradient(ellipse at 100% 0%, rgba(255,255,255,0.75), transparent 40%)',
  'radial-gradient(ellipse at 0% 100%, rgba(255,255,255,0.85), transparent 44%)',
  'radial-gradient(circle, rgba(255,255,255,0.75) 1px, transparent 1.6px)',
  'radial-gradient(circle, rgba(255,255,255,0.45) 1px, transparent 1.8px)',
].join(', ');

const BRANCHES = [
  { at: 14, reach: 18 },
  { at: 28, reach: 15 },
  { at: 42, reach: 12 },
  { at: 56, reach: 9 },
  { at: 70, reach: 6 },
] as const;

const Fern = ({ angle }: { angle: number }) => (
  <g transform={`rotate(${angle})`}>
    <path d="M0 0 L86 0" />
    {BRANCHES.map(({ at, reach }) => (
      <g key={at}>
        <path d={`M${at} 0 L${at + reach} ${-reach}`} />
        <path d={`M${at} 0 L${at + reach} ${reach}`} />
        <path d={`M${at + reach / 2} ${-reach / 2} L${at + reach + 3} ${-reach / 2}`} />
        <path d={`M${at + reach / 2} ${reach / 2} L${at + reach + 3} ${reach / 2}`} />
      </g>
    ))}
  </g>
);

const FernCluster = ({ className }: { className: string }) => (
  <svg
    viewBox="0 0 120 120"
    className={cn('absolute w-[46%] max-w-80', className)}
    aria-hidden="true"
  >
    <g stroke="white" strokeOpacity="0.9" strokeWidth="1.6" strokeLinecap="round" fill="none">
      <Fern angle={45} />
      <Fern angle={18} />
      <Fern angle={72} />
    </g>
  </svg>
);

export const FrostArt = () => (
  <span
    className="absolute inset-0 bg-(--sd-ice)/55"
    style={{
      backgroundImage: FROST_LAYERS,
      backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 9px 9px, 14px 14px',
      backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0, 4px 6px',
    }}
  >
    <FernCluster className="top-0 left-0" />
    <FernCluster className="top-0 right-0 -scale-x-100" />
    <FernCluster className="bottom-0 left-0 -scale-y-100" />
    <FernCluster className="right-0 bottom-0 -scale-100" />
    <FernCluster className="top-[40%] left-0 w-[30%] opacity-70" />
  </span>
);
