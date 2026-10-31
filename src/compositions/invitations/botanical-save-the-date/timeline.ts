import type { BotanicalSaveTheDateProps } from '@/schemas';
import type { Drift, Stay } from './pose';
import type { Cue } from './type';

type BeatName =
  | 'verseOne'
  | 'verseTwo'
  | 'save'
  | 'couple'
  | 'invite'
  | 'mehendi'
  | 'ring'
  | 'wedding'
  | 'closing';

interface Beat {
  stay: Stay;
  cue: Cue;
}

export interface Timeline {
  beats: Record<BeatName, Beat>;
  drift: Drift;
}

const TEXT_DELAY = 10;
const BEAT_OVERLAP = 6;

export const timelineOf = (props: BotanicalSaveTheDateProps, duration: number): Timeline => {
  const { timing, florals } = props;
  const starts = [
    0,
    timing.verseTwoAt,
    timing.saveAt,
    timing.coupleAt,
    timing.inviteAt,
    timing.mehendiAt,
    timing.ringAt,
    timing.weddingAt,
    timing.closingAt,
    duration + 400,
  ];
  const drift: Drift = {
    enterFrames: florals.enterFrames,
    exitFrames: florals.exitFrames,
    slide: florals.slide,
    sway: florals.sway,
    swayPeriod: florals.swayPeriod,
  };
  const beat = (index: number): Beat => {
    const start = starts[index] ?? 0;
    const next = starts[index + 1] ?? duration;
    const end = Math.max(start + 20, next - florals.exitFrames + BEAT_OVERLAP);
    return {
      stay: { start, end },
      cue: {
        start: start + TEXT_DELAY,
        end: Math.max(start + TEXT_DELAY + timing.typeFrames, end + 6 - timing.eraseFrames),
        typeFrames: timing.typeFrames,
        eraseFrames: timing.eraseFrames,
      },
    };
  };
  const beats: Record<BeatName, Beat> = {
    verseOne: beat(0),
    verseTwo: beat(1),
    save: beat(2),
    couple: beat(3),
    invite: beat(4),
    mehendi: beat(5),
    ring: beat(6),
    wedding: beat(7),
    closing: beat(8),
  };
  return { beats, drift };
};
