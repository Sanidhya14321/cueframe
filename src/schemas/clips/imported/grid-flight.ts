import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const gridFlightSchema = webMotionSchema;
export const gridFlightDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'EVERY FRAME MATTERS',
    subtitle: 'Your message, with a little momentum.',
    primary: '#f472b6',
  },
};
export type GridFlightProps = WebMotionProps;
export const gridFlightMeta: ClipMeta = {
  id: 'grid-flight',
  title: 'Grid Flight',
  description: 'An orderly illuminated grid drifts behind a minimal central headline.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/grid-flight.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('original', ''),
};
