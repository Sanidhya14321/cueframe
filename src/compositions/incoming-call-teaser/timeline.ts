import type { IncomingCallTeaserProps, TeaserWord } from '@/schemas';

export interface WordSlot {
  word: TeaserWord;
  index: number;
  start: number;
  glitchStart: number;
  end: number;
}

export interface TeaserTimeline {
  callEnd: number;
  wordsStart: number;
  slots: WordSlot[];
  wordsEnd: number;
  wallEnd: number;
  outroStart: number;
}

export const teaserTimeline = (props: IncomingCallTeaserProps): TeaserTimeline => {
  const { call, words, wall, outro } = props;
  const callEnd = Math.round(
    call.slideStart + call.slideFrames + call.declineFrames + call.holdFrames,
  );
  const wordsStart = callEnd + Math.round(words.leadFrames);
  let cursor = wordsStart;
  const slots = words.list.map((word, index) => {
    const start = cursor;
    const glitchStart = start + Math.round(word.frames);
    const end = glitchStart + Math.round(word.glitchFrames);
    cursor = end;
    return { word, index, start, glitchStart, end };
  });
  const wordsEnd = cursor;
  const wallEnd = wordsEnd + Math.round(wall.frames);
  return {
    callEnd,
    wordsStart,
    slots,
    wordsEnd,
    wallEnd,
    outroStart: wallEnd + Math.round(outro.gapFrames),
  };
};

export const hash = (a: number, b: number, seed = 0): number => {
  const value = Math.sin(a * 127.1 + b * 311.7 + seed * 74.7) * 43758.5453;
  return value - Math.floor(value);
};

export const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export const mix = (from: number, to: number, amount: number): number =>
  from + (to - from) * amount;
