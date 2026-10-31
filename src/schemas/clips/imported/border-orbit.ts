import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const borderOrbitSchema = webMotionSchema;
export const borderOrbitDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'EVERY FRAME MATTERS',
    subtitle: 'From a web component to your next video.',
    primary: '#a78bfa',
  },
};
export type BorderOrbitProps = WebMotionProps;
export const borderOrbitMeta: ClipMeta = {
  id: 'border-orbit',
  title: 'Border Orbit',
  description: 'A thin luminous beam travels around a dark headline card.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/border-orbit.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'border-beam'),
};
