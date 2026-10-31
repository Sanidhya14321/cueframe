import { cn } from '@/lib/utils';
import { LeafIcon, MAPLE, OVAL_LEAF } from './ornaments';

const KEYFRAMES = `
@keyframes pp-fall { from { top: -10%; } to { top: 106%; } }
@keyframes pp-sway {
  0%, 100% { transform: translateX(-18px) rotate(-30deg); }
  50% { transform: translateX(18px) rotate(40deg); }
}
@keyframes pp-bob {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-6px) rotate(2deg); }
}
`;

export const PumpkinPatchKeyframes = () => (
  <style href="pp-keyframes" precedence="default">
    {KEYFRAMES}
  </style>
);

const LEAVES = [
  { left: 6, size: 22, fall: 13, delay: 0, sway: 3.4, shape: MAPLE, fill: 'var(--pp-primary)' },
  {
    left: 18,
    size: 16,
    fall: 16,
    delay: 6,
    sway: 4.1,
    shape: OVAL_LEAF,
    fill: 'var(--pp-secondary)',
  },
  {
    left: 31,
    size: 20,
    fall: 14,
    delay: 10,
    sway: 3.8,
    shape: MAPLE,
    fill: 'var(--pp-kraft-deep)',
  },
  {
    left: 47,
    size: 14,
    fall: 18,
    delay: 3,
    sway: 4.6,
    shape: OVAL_LEAF,
    fill: 'var(--pp-primary)',
  },
  { left: 60, size: 24, fall: 15, delay: 8, sway: 3.2, shape: MAPLE, fill: 'var(--pp-secondary)' },
  {
    left: 72,
    size: 15,
    fall: 17,
    delay: 1,
    sway: 4.4,
    shape: OVAL_LEAF,
    fill: 'var(--pp-kraft-deep)',
  },
  { left: 84, size: 20, fall: 12, delay: 5, sway: 3.6, shape: MAPLE, fill: 'var(--pp-primary)' },
  {
    left: 94,
    size: 16,
    fall: 19,
    delay: 11,
    sway: 4.2,
    shape: OVAL_LEAF,
    fill: 'var(--pp-secondary)',
  },
];

export const FallingLeaves = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      'pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden',
      className,
    )}
  >
    {LEAVES.map((leaf) => (
      <span
        key={leaf.left}
        className="absolute opacity-70"
        style={{
          left: `${leaf.left}%`,
          top: '-10%',
          width: leaf.size,
          height: leaf.size,
          animation: `pp-fall ${leaf.fall}s linear -${leaf.delay}s infinite`,
        }}
      >
        <span
          className="block size-full"
          style={{ animation: `pp-sway ${leaf.sway}s ease-in-out infinite` }}
        >
          <LeafIcon shape={leaf.shape} fill={leaf.fill} className="size-full" />
        </span>
      </span>
    ))}
  </div>
);
