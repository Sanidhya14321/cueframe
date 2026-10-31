import { z } from 'zod';
import { EASING_IDS } from '../schemas/easing';

export const ANIMATION_KINDS = ['none', 'fade', 'slide', 'scale'] as const;

export type AnimationKind = (typeof ANIMATION_KINDS)[number];

export const animationSchema = z.object({
  kind: z.enum(ANIMATION_KINDS),
  easing: z.enum(EASING_IDS),
  durationInFrames: z.number().int().min(0),
});

export type Animation = z.infer<typeof animationSchema>;

export const defaultAnimation = (): Animation => ({
  kind: 'fade',
  easing: 'easeOut',
  durationInFrames: 12,
});
