import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const wordFlipSchema = webMotionSchema;
export const wordFlipDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'MAKE YOUR NEXT MOVE',
    subtitle: 'From a web component to your next video.',
    primary: '#f472b6',
  },
};
export type WordFlipProps = WebMotionProps;
export const wordFlipMeta: ClipMeta = {
  id: 'word-flip',
  title: 'Word Flip',
  description: 'A bold headline folds vertically into place with a compact timing beat.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/word-flip.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('motion-primitives', 'text-loop'),
};
