import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const rollingDigitsSchema = webMotionSchema;
export const rollingDigitsDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'ROLLING DIGITS',
    subtitle: 'Your message, with a little momentum.',
    primary: '#a3e635',
  },
};
export type RollingDigitsProps = WebMotionProps;
export const rollingDigitsMeta: ClipMeta = {
  id: 'rolling-digits',
  title: 'Rolling Digits',
  description: 'A statistic rolls vertically through clipped digit columns.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/rolling-digits.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('motion-primitives', 'sliding-number'),
};
