import { AbsoluteFill } from 'remotion';

export const LensOverlay = ({ grain, vignette }: { grain: number; vignette: number }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {vignette > 0 ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(20,14,8,${vignette * 0.35}) 88%, rgba(20,14,8,${vignette * 0.55}) 100%)`,
        }}
      />
    ) : null}
    {grain > 0 ? (
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: grain }}
        aria-hidden="true"
      >
        <filter id="lens-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={7} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#lens-grain)"
          style={{ mixBlendMode: 'overlay' }}
        />
      </svg>
    ) : null}
  </AbsoluteFill>
);
