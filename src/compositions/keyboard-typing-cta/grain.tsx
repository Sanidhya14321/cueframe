import { AbsoluteFill } from 'remotion';

export const FilmGrain = ({
  amount,
  live,
  frame,
  dark,
}: {
  amount: number;
  live: boolean;
  frame: number;
  dark: boolean;
}) =>
  amount <= 0 ? null : (
    <AbsoluteFill
      style={{ opacity: amount, mixBlendMode: dark ? 'screen' : 'overlay', pointerEvents: 'none' }}
    >
      <svg width="100%" height="100%" aria-hidden="true">
        <filter id="kbtc-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={live ? 11 + Math.floor(frame) : 11}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#kbtc-grain)" />
      </svg>
    </AbsoluteFill>
  );
