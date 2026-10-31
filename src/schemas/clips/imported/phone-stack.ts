import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const phoneStackSchema = webMotionSchema;
export const phoneStackDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'MAKE YOUR NEXT MOVE',
    subtitle: 'Your message, with a little momentum.',
    primary: '#a78bfa',
  },
};
export type PhoneStackProps = WebMotionProps;
export const phoneStackMeta: ClipMeta = {
  id: 'phone-stack',
  title: 'Phone Stack',
  description: 'Two flat phone frames fan out around a bold editable message.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic', 'phone'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/phone-stack.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'iphone'),
};
