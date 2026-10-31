import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const letterCascadeSchema = webMotionSchema;
export const letterCascadeDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'EVERY FRAME MATTERS',
    subtitle: 'Your message, with a little momentum.',
    primary: '#fb923c',
  },
};
export type LetterCascadeProps = WebMotionProps;
export const letterCascadeMeta: ClipMeta = {
  id: 'letter-cascade',
  title: 'Letter Cascade',
  description: 'Individual letters cascade upward into a clean, tightly spaced title.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/letter-cascade.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('motion-primitives', 'text-effect'),
};
