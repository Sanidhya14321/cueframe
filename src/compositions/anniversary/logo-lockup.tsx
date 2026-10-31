import { AbsoluteFill } from 'remotion';
import type { AnniversaryLogo } from '@/schemas';
import { tween } from '../promo/timing';
import { anniversaryFont, centered } from './type';

const SEAL = 440;

const SEAL_TICKS = 48;

const Seal = ({ logo }: { logo: AnniversaryLogo }) => {
  const radius = SEAL / 2;
  const tick = ((2 * Math.PI * (radius - 34)) / SEAL_TICKS / 2).toFixed(3);
  return (
    <div style={{ position: 'relative', width: SEAL, height: SEAL }}>
      <svg
        width={SEAL}
        height={SEAL}
        viewBox={`0 0 ${SEAL} ${SEAL}`}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
      >
        <circle
          cx={radius}
          cy={radius}
          r={radius - 8}
          fill="none"
          stroke={logo.ringColor}
          strokeWidth={6}
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius - 34}
          fill="none"
          stroke={logo.numberColor}
          strokeWidth={12}
          strokeDasharray={`${tick} ${tick}`}
        />
      </svg>
      <div
        style={{
          ...centered,
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div
            style={{
              fontFamily: anniversaryFont,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              color: logo.numberColor,
            }}
          >
            {logo.number}
          </div>
          <div
            style={{
              fontFamily: anniversaryFont,
              fontWeight: 600,
              fontSize: 44,
              marginLeft: 6,
              marginTop: 10,
              color: logo.ringColor,
            }}
          >
            {logo.ordinal}
          </div>
        </div>
        <div
          style={{
            fontFamily: anniversaryFont,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: '0.32em',
            marginRight: '-0.32em',
            color: logo.ringColor,
          }}
        >
          {logo.caption}
        </div>
      </div>
    </div>
  );
};

const Wordmark = ({ logo }: { logo: AnniversaryLogo }) => {
  const [initial = '', ...rest] = Array.from(logo.name.toUpperCase());
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      <div
        style={{
          fontFamily: anniversaryFont,
          fontWeight: 500,
          fontSize: 118,
          lineHeight: 1,
          letterSpacing: '0.14em',
          marginRight: '-0.14em',
          color: logo.nameColor,
        }}
      >
        <span style={{ color: logo.initialColor }}>{initial}</span>
        {rest.join('')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: 620 }}>
        <div style={{ flex: 1, height: 3, backgroundColor: logo.numberColor }} />
        <div
          style={{
            fontFamily: anniversaryFont,
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: '0.42em',
            marginRight: '-0.42em',
            color: logo.nameColor,
          }}
        >
          {logo.since}
        </div>
        <div style={{ flex: 1, height: 3, backgroundColor: logo.numberColor }} />
      </div>
      <div
        style={{
          fontFamily: anniversaryFont,
          fontWeight: 400,
          fontSize: 40,
          color: logo.taglineColor,
        }}
      >
        {logo.tagline}
      </div>
    </div>
  );
};

export const LogoLockup = ({
  logo,
  local,
  backdrop,
}: {
  logo: AnniversaryLogo;
  local: number;
  backdrop: boolean;
}) => {
  const clear = tween(local, [0, logo.blurFrames], [0, 1], (t) => t);
  const blur = logo.blur * (1 - clear) ** 3;
  return (
    <AbsoluteFill style={{ backgroundColor: backdrop ? logo.background : undefined }}>
      <div style={centered}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 64,
            transform: `scale(${(logo.size * (1.03 - 0.03 * clear)).toFixed(5)})`,
            filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
          }}
        >
          <Seal logo={logo} />
          <Wordmark logo={logo} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
