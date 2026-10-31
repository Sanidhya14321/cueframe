import { AbsoluteFill, Easing } from 'remotion';
import type { IncomingCallTeaserProps } from '@/schemas';
import { tween } from '../promo/timing';
import { TEASER_FONTS } from './fonts';
import { clamp01, hash, mix } from './timeline';

type Outro = IncomingCallTeaserProps['outro'];

const BURN_SCRIPT: readonly (readonly [number, number, number])[] = [
  [0.9, 0.2, 0.15],
  [0.8, 1, 0.6],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
  [0.35, 0, 0.5],
  [0.8, 0.9, 0.55],
  [0.8, 0.95, 0.5],
  [0.3, 1, 0.5],
  [0.45, 0.9, 0.55],
  [1, 0, 0.5],
  [0.95, 0.3, 0.3],
  [0.9, 0.35, 0.3],
  [0.85, 0.3, 0.25],
  [0.55, 0.3, 0.08],
];

const FilmBurn = ({ outro, step }: { outro: Outro; step: number }) => {
  const cue = BURN_SCRIPT[step];
  if (cue === undefined) {
    return null;
  }
  const [heat, core, reach] = cue;
  if (heat <= 0 && core <= 0) {
    return null;
  }
  const seed = outro.burnSeed;
  const redX = mix(-10, 30, hash(step, 1, seed)) + reach * 60;
  const redY = mix(20, 80, hash(step, 2, seed));
  const coreX = mix(20, 80, hash(step, 3, seed));
  const coreY = mix(25, 75, hash(step, 4, seed));
  const spread = 110 + reach * 120;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: outro.burnStrength }}>
      <AbsoluteFill
        style={{
          opacity: heat,
          background: `radial-gradient(ellipse ${spread}% 120% at ${redX}% ${redY}%, ${outro.burnColor} 0%, ${outro.burnColor} 52%, transparent 68%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: core,
          background: `radial-gradient(ellipse ${spread * 0.9}% 90% at ${coreX}% ${coreY}%, ${outro.burnCore} 0%, ${outro.burnCore} 48%, transparent 66%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const swashEase = Easing.inOut(Easing.sin);

const Swash = ({ outro, frame }: { outro: Outro; frame: number }) => {
  const draw = tween(
    frame,
    [outro.swashStart, outro.swashStart + outro.swashFrames],
    [0, 1],
    swashEase,
  );
  if (draw <= 0) {
    return null;
  }
  const half = outro.size * 2.45;
  const y = outro.centerY + outro.size * 0.5;
  const path = `M ${540 - half} ${y + outro.size * 0.12} Q ${540} ${y + outro.size * 0.22} ${540 + half} ${y - outro.size * 0.2}`;
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
    >
      <path
        d={path}
        pathLength={1}
        fill="none"
        stroke={outro.swashColor}
        strokeWidth={outro.size * 0.05}
        strokeLinecap="butt"
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
        opacity={clamp01(draw / 0.08)}
      />
    </svg>
  );
};

export const SignOff = ({ outro, frame }: { outro: Outro; frame: number }) => (
  <AbsoluteFill>
    {outro.burn ? <FilmBurn outro={outro} step={Math.floor(frame - outro.burnStart)} /> : null}
    {outro.swash ? <Swash outro={outro} frame={frame} /> : null}
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: outro.centerY,
        transform: `translateY(-50%) rotate(${outro.tilt}deg)`,
        textAlign: 'center',
        fontFamily: TEASER_FONTS.script,
        fontSize: outro.size,
        lineHeight: 1.2,
        color: outro.color,
        letterSpacing: '0.01em',
        WebkitTextStroke: `${outro.size * 0.01}px ${outro.color}`,
        whiteSpace: 'nowrap',
      }}
    >
      {outro.text}
    </div>
  </AbsoluteFill>
);
