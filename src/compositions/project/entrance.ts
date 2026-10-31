import type { Animation } from '@/project';
import { resolveEasing } from '../kit/easing';
import { ramp } from '../kit/motion';

export interface EntranceStyle {
  opacity: number;
  translateY: number;
  scale: number;
}

const IDENTITY: EntranceStyle = { opacity: 1, translateY: 0, scale: 1 };

export const entranceStyle = (animation: Animation | undefined, frame: number): EntranceStyle => {
  if (animation === undefined || animation.kind === 'none' || animation.durationInFrames <= 0) {
    return IDENTITY;
  }
  const progress = ramp(frame, 0, animation.durationInFrames, resolveEasing(animation.easing));
  switch (animation.kind) {
    case 'fade':
      return { opacity: progress, translateY: 0, scale: 1 };
    case 'slide':
      return { opacity: progress, translateY: (1 - progress) * 80, scale: 1 };
    case 'scale':
      return { opacity: progress, translateY: 0, scale: 0.85 + progress * 0.15 };
    default:
      return IDENTITY;
  }
};
