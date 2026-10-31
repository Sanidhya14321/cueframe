import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const meteorShowerSchema = webMotionSchema;
export const meteorShowerDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'CREATE SOMETHING GREAT',
    subtitle: 'A little motion. A lasting impression.',
    primary: '#a78bfa',
  },
};
export type MeteorShowerProps = WebMotionProps;
export const meteorShowerMeta: ClipMeta = {
  id: 'meteor-shower',
  title: 'Meteor Shower',
  description: 'Slender diagonal light trails sweep across a dark stage.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/meteor-shower.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'meteors'),
};
