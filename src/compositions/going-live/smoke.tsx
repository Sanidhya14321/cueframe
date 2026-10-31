import { AbsoluteFill } from 'remotion';
import type { GoingLiveTeaserProps } from '@/schemas';
import { clamp01, hash, progress } from './beat';

const BIRTH_SPAN = 24;

export const SmokeBank = ({
  frame,
  start,
  end,
  floor,
  smoke,
  color,
}: {
  frame: number;
  start: number;
  end: number;
  floor: number;
  smoke: GoingLiveTeaserProps['smoke'];
  color: string;
}) => {
  if (frame < start || frame >= end || smoke.puffs === 0) {
    return null;
  }
  const puffs = Array.from({ length: smoke.puffs }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const born = start + (index / smoke.puffs) * BIRTH_SPAN;
    const life = progress(frame, born, end);
    const eased = 1 - (1 - life) ** 6;
    const reach = 0.45 + 0.55 * hash(index + 0.3);
    const x = 540 + side * (60 + smoke.spread * eased * reach + 30 * hash(index + 4.1) + 70 * life);
    const rise = smoke.height * (0.15 + 0.35 * hash(index + 2.7)) + eased * smoke.height * 0.35;
    const radius = (0.35 + 0.65 * eased) * (60 + 70 * hash(index + 8.2)) * (smoke.height / 150);
    const fadeIn = clamp01((frame - born) / 10);
    const fadeOut = (1 - life) ** 2;
    return {
      key: index,
      x,
      y: floor - rise * 0.6,
      radius,
      opacity: frame < born ? 0 : fadeIn * fadeOut,
    };
  });
  return (
    <AbsoluteFill style={{ opacity: smoke.opacity }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" aria-hidden="true">
        <defs>
          <filter id="going-live-smoke" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={3} seed={4} />
            <feDisplacementMap
              in="SourceGraphic"
              scale={70}
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation={3} />
          </filter>
          <radialGradient id="going-live-puff" cx="45%" cy="38%" r="60%">
            <stop offset="0%" style={{ stopColor: `color-mix(in srgb, ${color} 55%, #ffffff)` }} />
            <stop offset="55%" style={{ stopColor: color }} />
            <stop
              offset="100%"
              style={{ stopColor: `color-mix(in srgb, ${color} 22%, #000000)` }}
            />
          </radialGradient>
          <clipPath id="going-live-floor">
            <rect x={0} y={0} width={1080} height={floor} />
          </clipPath>
        </defs>
        <g clipPath="url(#going-live-floor)">
          <g filter="url(#going-live-smoke)">
            {puffs.map((puff) => (
              <ellipse
                key={puff.key}
                cx={puff.x}
                cy={puff.y}
                rx={puff.radius * 1.25}
                ry={puff.radius}
                fill="url(#going-live-puff)"
                opacity={puff.opacity}
              />
            ))}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
