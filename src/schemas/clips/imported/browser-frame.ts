import type { ClipMeta } from '../../registry';
import { sourceAttribution } from './attribution';
import { type WebMotionProps, webMotionDefaults, webMotionSchema } from './common';
export const browserFrameSchema = webMotionSchema;
export const browserFrameDefaults: WebMotionProps = {
  ...webMotionDefaults,
  ...{
    text: 'CREATE SOMETHING GREAT',
    subtitle: 'From a web component to your next video.',
    primary: '#f472b6',
  },
};
export type BrowserFrameProps = WebMotionProps;
export const browserFrameMeta: ClipMeta = {
  id: 'browser-frame',
  title: 'Browser Frame',
  description: 'A crisp browser window rises into view with editable hero copy.',
  category: 'imported',
  tags: ['text', 'reveal', 'kinetic'],
  theme: 'dark',
  source: 'src/compositions/scenes/imported/browser-frame.tsx',
  durationInFrames: 120,
  posterFrame: 75,
  fps: 30,
  width: 1920,
  height: 1080,
  attribution: sourceAttribution('magicui', 'safari'),
};
