import { smooth, tween } from './timing';

const SWAP_FRAMES = 44;

const beatStart = (beat: number, beatLength: number): number => beat * beatLength - SWAP_FRAMES / 2;

export interface BeatState {
  beat: number;
  progress: number;
}

export const beatAt = (frame: number, beatLength: number, count: number): BeatState => {
  let state: BeatState = { beat: 0, progress: 0 };
  for (let beat = 0; beat < count - 1; beat++) {
    const start = beatStart(beat + 1, beatLength);
    if (frame < start) {
      break;
    }
    const progress = tween(frame, [start, start + SWAP_FRAMES], [0, 1], smooth);
    state = progress >= 1 ? { beat: beat + 1, progress: 0 } : { beat, progress };
  }
  return state;
};
