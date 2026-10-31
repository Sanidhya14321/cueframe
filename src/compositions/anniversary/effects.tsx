import { AbsoluteFill } from 'remotion';
import type { AnniversaryBeat, AnniversaryChrome, AnniversaryLook } from '@/schemas';
import { land, settle, tween } from '../promo/timing';
import { centered, clamp01, letters, wordStyle } from './type';

export type EffectProps = {
  beat: AnniversaryBeat;
  look: AnniversaryLook;
  chrome: AnniversaryChrome;
  local: number;
  length: number;
  width: number;
  height: number;
  id: string;
  backdrop: boolean;
};

const breathe = (look: AnniversaryLook, local: number, length: number): number =>
  1 - look.drift * clamp01(local / Math.max(1, length));

export const settleScale = (
  beat: AnniversaryBeat,
  local: number,
  length: number,
  look: AnniversaryLook,
): number =>
  (1 + beat.zoom * (1 - settle(clamp01(local / Math.max(10, length * 0.9))))) *
  breathe(look, local, length);

export const settleTracking = (beat: AnniversaryBeat, local: number): number =>
  beat.tracking + beat.spread * (1 - settle(clamp01(local / 14)));

const mix = (from: string, to: string, amount: number): string =>
  `color-mix(in srgb, ${to} ${(clamp01(amount) * 100).toFixed(1)}%, ${from})`;

export const HoldWord = ({ beat, look, local, length }: EffectProps) => (
  <div style={centered}>
    <div
      style={{
        ...wordStyle(beat, settleTracking(beat, local)),
        transform: `scale(${settleScale(beat, local, length, look).toFixed(5)})`,
      }}
    >
      {beat.text}
    </div>
  </div>
);

export const GradientWord = ({ beat, look, local, length }: EffectProps) => (
  <div style={centered}>
    <div
      style={{
        ...wordStyle(beat),
        color: 'transparent',
        backgroundImage: `linear-gradient(90deg, ${look.gradientFrom} 4%, ${look.gradientMid} 42%, ${look.gradientTo} 96%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        padding: `0 ${beat.size * 0.05}px`,
        transform: `scale(${settleScale(beat, local, length, look).toFixed(5)})`,
      }}
    >
      {beat.text}
    </div>
  </div>
);

export const FillSweepWord = ({ beat, look, local, length }: EffectProps) => {
  const shrink = tween(local, [4, 9], [1, 1 + beat.zoom], settle);
  return (
    <div style={centered}>
      <div
        style={{
          ...wordStyle(beat),
          transform: `scale(${(shrink * breathe(look, local, length)).toFixed(5)})`,
        }}
      >
        {letters(beat.text).map((letter, index) => (
          <span
            key={`${index}:${letter}`}
            style={{ color: mix(look.muted, beat.color, (local + 1 - index * beat.rate) / 2.5) }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export const FlashCutWord = ({ beat, look, local, length, backdrop }: EffectProps) => {
  const cut = local >= beat.rate;
  return (
    <>
      {backdrop && local < 1 ? <AbsoluteFill style={{ backgroundColor: look.flash }} /> : null}
      {backdrop && cut ? <AbsoluteFill style={{ backgroundColor: look.ink }} /> : null}
      <div style={centered}>
        <div
          style={{
            ...wordStyle(beat),
            color: cut ? beat.color : look.dim,
            transform: `scale(${settleScale(beat, local, length, look).toFixed(5)})`,
          }}
        >
          {beat.text}
        </div>
      </div>
    </>
  );
};

export const DropWord = ({ beat, local, length }: EffectProps) => {
  const chars = letters(beat.text);
  const head = chars.slice(0, -1).join('');
  const tail = chars.at(-1) ?? '';
  const joined = local >= beat.rate;
  const fall = land(local, [0, beat.rate], [beat.size * 1.5, beat.size * 0.15], 0.5);
  const offset = joined ? 0 : fall;
  const after = clamp01((local - beat.rate) / Math.max(1, length - beat.rate));
  const scale = joined ? (1 + beat.zoom) * (1 + 0.1 * (1 - settle(after))) : 1;
  return (
    <div style={centered}>
      <div
        style={{
          ...wordStyle(beat),
          position: 'relative',
          transform: `scale(${scale.toFixed(5)})`,
        }}
      >
        <span>{head}</span>
        <span style={{ display: 'inline-block', transform: `translateY(${Math.round(offset)}px)` }}>
          {tail}
        </span>
        {local < 3 ? (
          <span
            style={{
              position: 'absolute',
              right: 0,
              opacity: 0.55,
              transform: `translateY(${Math.round(offset + beat.size * 0.9)}px) scaleY(0.6)`,
            }}
          >
            {tail}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export const TypeOnWord = ({ beat, look, local, length }: EffectProps) => (
  <div style={centered}>
    <div
      style={{
        ...wordStyle(beat, settleTracking(beat, local)),
        transform: `scale(${settleScale(beat, local, length, look).toFixed(5)})`,
      }}
    >
      {letters(beat.text).map((letter, index) => {
        const age = local - index * beat.rate;
        const shown = age >= 0;
        return (
          <span
            key={`${index}:${letter}`}
            style={{
              color: shown ? mix(look.muted, beat.color, (age - 0.5) / 1.5) : look.muted,
              opacity: shown ? 1 : beat.ghost,
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  </div>
);
