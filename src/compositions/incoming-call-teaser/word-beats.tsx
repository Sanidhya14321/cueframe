import { useId } from 'react';
import { AbsoluteFill } from 'remotion';
import type { IncomingCallTeaserProps } from '@/schemas';
import { TEASER_FONTS } from './fonts';
import { hash, type TeaserTimeline, type WordSlot } from './timeline';

type Words = IncomingCallTeaserProps['words'];

interface BeatState {
  slot: WordSlot | null;
  band: string;
  ink: string;
  glitchFrame: number;
}

const beatState = (words: Words, timeline: TeaserTimeline, frame: number): BeatState => {
  const slot = timeline.slots.find((item) => frame >= item.start && frame < item.end) ?? null;
  if (slot === null) {
    return { slot: null, band: words.lightBand, ink: words.lightInk, glitchFrame: -1 };
  }
  const lightBand = slot.word.band === 'light';
  const base = {
    band: lightBand ? words.lightBand : words.darkBand,
    ink: lightBand ? words.lightInk : words.darkInk,
  };
  if (frame < slot.glitchStart) {
    return { slot, ...base, glitchFrame: -1 };
  }
  const glitchFrame = frame - slot.glitchStart;
  const pattern = words.glitchPattern;
  const mark = pattern.length > 0 ? pattern[glitchFrame % pattern.length] : 'L';
  return mark === 'D'
    ? { slot, band: words.glitchBand, ink: words.glitchInk, glitchFrame }
    : { slot, band: words.lightBand, ink: words.lightInk, glitchFrame };
};

const letterOpacity = (words: Words, glitchFrame: number, letter: number, frame: number) => {
  if (glitchFrame < 0 || words.letterFlicker <= 0) {
    return 1;
  }
  const roll = hash(frame, letter, 3);
  if (roll < words.letterFlicker * 0.3) {
    return 0.08;
  }
  if (roll < words.letterFlicker * 0.75) {
    return 0.45;
  }
  return 1;
};

const Distress = ({ id, amount }: { id: string; amount: number }) => (
  <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden>
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.17" numOctaves={2} seed={5} />
      <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  7 0 0 0 -4.1" />
      <feComponentTransfer>
        <feFuncA type="linear" slope={amount} />
      </feComponentTransfer>
      <feComposite in="SourceGraphic" operator="out" />
    </filter>
  </svg>
);

export const WordBeats = ({
  words,
  timeline,
  frame,
}: {
  words: Words;
  timeline: TeaserTimeline;
  frame: number;
}) => {
  const filterId = `distress-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const state = beatState(words, timeline, frame);
  const text = state.slot?.word.text ?? '';
  return (
    <AbsoluteFill style={{ transform: `rotate(${words.tilt}deg)` }}>
      <div
        style={{
          position: 'absolute',
          left: -400,
          right: -400,
          top: 960 + words.bandOffsetY - words.bandHeight / 2,
          height: words.bandHeight,
          background: state.band,
        }}
      />
      {words.distress > 0 ? <Distress id={filterId} amount={words.distress} /> : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 960 + words.bandOffsetY + words.textOffsetY,
          transform: 'translateY(-50%)',
          display: 'flex',
          justifyContent: 'center',
          fontFamily: TEASER_FONTS.word,
          fontWeight: words.weight,
          fontSize: words.size,
          letterSpacing: `${words.tracking}em`,
          lineHeight: 1,
          color: state.ink,
          filter: words.distress > 0 ? `url(#${filterId})` : undefined,
          whiteSpace: 'pre',
        }}
      >
        {Array.from(text).map((letter, index) => (
          <span
            key={`${index}-${letter}`}
            style={{ opacity: letterOpacity(words, state.glitchFrame, index, frame) }}
          >
            {letter}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
