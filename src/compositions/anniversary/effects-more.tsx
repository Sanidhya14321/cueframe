import type { CSSProperties } from 'react';
import type { AnniversaryChrome } from '@/schemas';
import { land, settle, tween } from '../promo/timing';
import { type EffectProps, settleScale, settleTracking } from './effects';
import { centered, clamp01, letters, wordStyle } from './type';

const COPIES = [-1, 0, 1] as const;

export const WaveStackWord = ({ beat, local }: EffectProps) => {
  const open = settle(clamp01((local - 1) / 6)) * beat.spread;
  const smear = local >= 1 && local < 6 ? (1 - open) * 7 : 0;
  return (
    <div style={centered}>
      {COPIES.map((copy) => {
        const middle = copy === 0;
        const tilt = 2.2 * Math.sin(local * 0.09 + copy * 1.4);
        return (
          <div
            key={copy}
            style={{
              position: 'absolute',
              ...wordStyle(beat, beat.tracking + (middle ? 0.05 : 0)),
              transform: `translateY(${Math.round(copy * beat.size * 1.12 * open)}px) rotate(${tilt.toFixed(3)}deg) skewX(-10deg) scaleX(1.32) scaleY(${middle ? 0.78 : 1})`,
              filter: smear > 0 ? `blur(${smear.toFixed(2)}px)` : undefined,
            }}
          >
            {letters(beat.text).map((letter, index) => (
              <span
                key={`${index}:${letter}`}
                style={{
                  display: 'inline-block',
                  transform: `translateY(${(beat.size * 0.09 * Math.sin(index * 0.55 + local * 0.24 + copy * 0.9)).toFixed(2)}px)`,
                }}
              >
                {letter}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const SLANT_COPIES = [
  { x: -0.42, y: -0.42, scale: 0.55, tone: 0.75 },
  { x: -0.1, y: -0.28, scale: 1, tone: 1 },
  { x: 0.2, y: -0.17, scale: 1, tone: 0.92 },
  { x: 0.52, y: -0.04, scale: 1.15, tone: 0.85 },
];

export const SlantRepeatWord = ({ beat, look, local, width, height }: EffectProps) => (
  <>
    {SLANT_COPIES.map((copy) => (
      <div
        key={copy.x}
        style={{
          position: 'absolute',
          left: width / 2 + copy.x * width,
          top: height / 2 + copy.y * height,
          ...wordStyle(beat),
          color: look.slant,
          opacity: copy.tone,
          transform: `translate(-50%, -50%) translate(${Math.round(local * 1.4)}px, ${Math.round(-local * 1.1)}px) rotate(-17deg) scale(${copy.scale})`,
        }}
      >
        {beat.text}
      </div>
    ))}
  </>
);

const flickerStyle = (local: number, color: string, muted: string): CSSProperties => {
  if (local < 1) {
    return { color, textShadow: `${0.05}em 0 0 ${muted}` };
  }
  if (local < 3) {
    return { color, opacity: 0.86 };
  }
  if (local < 5) {
    return { color, opacity: 0.7, filter: `blur(${local < 4 ? 9 : 5}px)` };
  }
  if (local < 12) {
    return {
      color: 'transparent',
      WebkitTextStroke: `2px ${color}`,
      opacity: 0.85,
      filter: local >= 11 ? 'blur(3px)' : undefined,
    };
  }
  return { color };
};

export const OutlineFlickerWord = ({ beat, look, local, length }: EffectProps) => (
  <div style={centered}>
    <div
      style={{
        ...wordStyle(beat),
        ...flickerStyle(local, beat.color, look.muted),
        transform: `scale(${settleScale(beat, local, length, look).toFixed(5)})`,
      }}
    >
      {beat.text}
    </div>
  </div>
);

const SLIDES = [
  { from: 0.45, to: 0.25, y: -1.02, tone: 0.86 },
  { from: -0.2, to: -0.05, y: 0, tone: 1 },
  { from: 0.45, to: 0.26, y: 1.02, tone: 0.82 },
];

export const TripleSlideWord = ({ beat, local, length, width, id }: EffectProps) => {
  const fade = tween(local, [length - 6, length - 1], [1, 0.45]);
  return (
    <div style={centered}>
      {SLIDES.map((slide, index) => {
        const x = land(local, [0, 5], [slide.from * width, slide.to * width], 2);
        const speed = Math.abs(
          land(local + 1, [0, 5], [slide.from * width, slide.to * width], 2) - x,
        );
        const drift = (local - 5) * Math.sign(slide.to - slide.from) * 1.2;
        const blurId = `${id}-slide-${index}`;
        return (
          <div key={slide.y} style={{ position: 'absolute' }}>
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
              <filter id={blurId} x="-30%" y="-10%" width="160%" height="120%">
                <feGaussianBlur stdDeviation={`${(speed * 0.35).toFixed(2)} 0`} />
              </filter>
            </svg>
            <div
              style={{
                ...wordStyle(beat),
                opacity: slide.tone * fade,
                filter: speed > 1 ? `url(#${blurId})` : undefined,
                transform: `translate(${Math.round(x + (local > 5 ? drift : 0))}px, ${Math.round(slide.y * beat.size * 1.05)}px)`,
              }}
            >
              {beat.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const stackLines = (chrome: AnniversaryChrome) => [
  { x: 0, y: -1, top: chrome.topStart, bottom: chrome.topEnd },
  { x: 0.32, y: 0, top: chrome.middleStart, bottom: chrome.middleEnd },
  { x: 0, y: 1, top: chrome.bottomStart, bottom: chrome.bottomEnd },
];

export const TripleStackWord = ({ beat, look, chrome, local, length, width }: EffectProps) => (
  <div style={centered}>
    {stackLines(chrome).map((line) => (
      <div
        key={line.y}
        style={{
          position: 'absolute',
          ...wordStyle(beat),
          color: 'transparent',
          backgroundImage: `linear-gradient(180deg, ${line.top}, ${line.bottom})`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          transform: `translate(${Math.round(-0.1 * width + line.x * beat.size + local)}px, ${Math.round(line.y * beat.size * 1.15)}px) scale(${settleScale(beat, local, length, look).toFixed(5)})`,
        }}
      >
        {beat.text}
      </div>
    ))}
  </div>
);

export const TrackInWord = ({ beat, look, local }: EffectProps) => {
  const tracking = beat.tracking + beat.spread * (1 - settle(clamp01((local - 6) / 10)));
  const scale = tween(local, [6, 16], [1.12, 1 + Math.min(0, beat.zoom)], settle);
  return (
    <div style={centered}>
      <div
        style={{
          ...wordStyle(beat, tracking),
          textShadow: local >= 9 && local < 10 ? `0.06em 0 0 ${look.muted}` : undefined,
          transform: `scale(${scale.toFixed(5)})`,
        }}
      >
        {letters(beat.text).map((letter, index) => {
          const age = local - index * beat.rate;
          const drop = land(age, [0, 4], [-beat.size * 0.6, 0], 1);
          return (
            <span
              key={`${index}:${letter}`}
              style={{
                display: 'inline-block',
                opacity: age < 0 ? 0 : clamp01(0.4 + age * 0.3),
                transform: `translateY(${Math.round(drop)}px)`,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const TrackedOutlineWord = ({ beat, look, local, length }: EffectProps) => {
  const fill = clamp01((local - 3) / 9);
  return (
    <div style={centered}>
      <div
        style={{
          ...wordStyle(beat, settleTracking(beat, local)),
          color:
            fill <= 0
              ? 'transparent'
              : `color-mix(in srgb, ${beat.color} ${(fill * 100).toFixed(1)}%, ${look.muted})`,
          WebkitTextStroke: fill < 1 ? `${(2 * (1 - fill)).toFixed(2)}px ${beat.color}` : undefined,
          transform: `scale(${settleScale(beat, local, length, look).toFixed(5)})`,
        }}
      >
        {beat.text}
      </div>
    </div>
  );
};
