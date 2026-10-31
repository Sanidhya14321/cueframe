import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const springCardsSchema = webMotionSchema;
export const springCardsDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'BUILT FOR YOUR IDEAS',
    subtitle: 'Your message, with a little momentum.',
    primary: '#fb923c',
  },
};
export type SpringCardsProps = WebMotionProps;
export const springCardsMeta: ClipMeta = {
  id: 'spring-cards',
  title: 'Spring Cards',
  description: 'Three rounded proof cards spring into a staggered stack.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/spring-cards.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'animated-list'),
};
