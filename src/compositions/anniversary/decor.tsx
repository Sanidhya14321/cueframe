import { AbsoluteFill } from 'remotion';
import type { AnniversaryBeat, AnniversaryLook, AnniversarySparkles } from '@/schemas';
import { anniversaryFont, hash } from './type';

const STRIPS = [
  { top: 0, bottom: 0.22, scale: 1.45, shift: -0.08 },
  { top: 0.22, bottom: 0.78, scale: 1, shift: 0 },
  { top: 0.78, bottom: 1, scale: 1.45, shift: 0.06 },
];

const GiantText = ({
  beat,
  look,
  filled,
  width,
  height,
  scale,
  shift,
  local,
}: {
  beat: AnniversaryBeat;
  look: AnniversaryLook;
  filled: boolean;
  width: number;
  height: number;
  scale: number;
  shift: number;
  local: number;
}) => {
  const size = beat.decorSize * scale;
  const drift = 1 - look.drift * Math.min(1, local / 60);
  const x = width / 2 + (beat.decorX + shift) * width;
  const y = height / 2 + beat.decorY * height;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{ position: 'absolute', left: 0, top: 0 }}
    >
      <text
        x={0}
        y={0}
        transform={`translate(${x} ${y}) scale(${drift})`}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={anniversaryFont}
        fontWeight={beat.weight}
        fontSize={size}
        letterSpacing={`${beat.tracking}em`}
        textRendering="geometricPrecision"
        fill={filled ? look.shape : 'none'}
        stroke={filled ? 'none' : look.stroke}
        strokeWidth={look.strokeWidth / scale}
      >
        {beat.decorText}
      </text>
    </svg>
  );
};

export const BeatDecor = ({
  beat,
  look,
  local,
  width,
  height,
}: {
  beat: AnniversaryBeat;
  look: AnniversaryLook;
  local: number;
  width: number;
  height: number;
}) => {
  if (beat.decor === 'none' || beat.decorText.trim() === '') {
    return null;
  }
  const filled =
    beat.decorFill > 0 && local >= beat.decorFillAt && local < beat.decorFillAt + beat.decorFill;
  return (
    <AbsoluteFill>
      {STRIPS.map((strip) => (
        <div
          key={strip.top}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: strip.top * height,
            height: (strip.bottom - strip.top) * height,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: -strip.top * height, width, height }}>
            <GiantText
              beat={beat}
              look={look}
              filled={filled}
              width={width}
              height={height}
              scale={strip.scale}
              shift={strip.shift}
              local={local}
            />
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const SPARKLE = 'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)';

const sparkleColor = (look: AnniversaryLook, dark: boolean, accent: boolean): string => {
  if (dark) {
    return look.ink;
  }
  return accent ? look.gradientFrom : look.dust;
};

const SPARKLE_MARGIN = 24;

const wrap = (value: number, span: number): number => {
  const range = span + SPARKLE_MARGIN * 2;
  return ((((value + SPARKLE_MARGIN) % range) + range) % range) - SPARKLE_MARGIN;
};

export const Dust = ({
  look,
  sparkles,
  frame,
  dark,
  width,
  height,
}: {
  look: AnniversaryLook;
  sparkles: AnniversarySparkles;
  frame: number;
  dark: boolean;
  width: number;
  height: number;
}) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {Array.from({ length: look.dustCount }, (_, index) => {
      const seed = look.glitchSeed * 31 + index * 7;
      const travel = frame * sparkles.speed;
      const x = wrap(hash(seed) * width + travel * (hash(seed + 1) - 0.5) * 3, width);
      const y = wrap(hash(seed + 2) * height - travel * (0.8 + hash(seed + 3) * 1.6), height);
      const size = sparkles.size + hash(seed + 4) * sparkles.size;
      const accent = index % 3 === 0;
      return (
        <div
          key={seed}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: size,
            height: size,
            clipPath: SPARKLE,
            backgroundColor: sparkleColor(look, dark, accent),
            opacity: sparkles.opacity,
            transform: `rotate(${(hash(seed + 6) * 40 - 20).toFixed(2)}deg)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);
