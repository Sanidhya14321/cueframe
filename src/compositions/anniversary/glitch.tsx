import type { CSSProperties, ReactNode } from 'react';
import type { AnniversaryBeat, AnniversaryLook } from '@/schemas';

export const glitchStrength = (beat: AnniversaryBeat, local: number): number => {
  const from = beat.glitchAt;
  if (beat.glitch <= 0 || local < from || local >= from + beat.glitch) {
    return 0;
  }
  return 1 - ((local - from) / beat.glitch) * 0.7;
};

export const Glitched = ({
  id,
  strength,
  seed,
  size,
  look,
  children,
}: {
  id: string;
  strength: number;
  seed: number;
  size: number;
  look: AnniversaryLook;
  children: ReactNode;
}) => {
  const amount = strength * look.glitchAmount;
  if (amount <= 0) {
    return <>{children}</>;
  }
  const style: CSSProperties = {
    position: 'absolute',
    inset: 0,
    filter: `url(#${id})`,
  };
  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter
          id={id}
          x="-20%"
          y="-60%"
          width="140%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="turbulence" baseFrequency="0.16 0.003" numOctaves={2} seed={seed} />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 0.5"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={amount * size * 0.5}
            xChannelSelector="A"
            yChannelSelector="R"
          />
        </filter>
      </svg>
      <div style={style}>{children}</div>
    </>
  );
};
