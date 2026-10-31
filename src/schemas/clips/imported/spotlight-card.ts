import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const spotlightCardSchema = webMotionSchema;
export const spotlightCardDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'BUILT FOR YOUR IDEAS',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#f472b6',
  },
};
export type SpotlightCardProps = WebMotionProps;
export const spotlightCardMeta: ClipMeta = {
  id: 'spotlight-card',
  title: 'Spotlight Card',
  description: 'A rounded feature card arrives with a moving light across its surface.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/spotlight-card.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('motion-primitives', 'spotlight'),
};
