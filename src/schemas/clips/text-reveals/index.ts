import type { ClipModule } from '../../registry';
import {
  goingLiveTeaserDefaults,
  goingLiveTeaserMeta,
  goingLiveTeaserSchema,
} from './going-live-teaser';
import { goingLiveTeaserControls } from './going-live-teaser-controls';
import { letterFlipDefaults, letterFlipMeta, letterFlipSchema } from './letter-flip';
import { letterFlipControls } from './letter-flip-controls';
import {
  magnifierCaptionDefaults,
  magnifierCaptionMeta,
  magnifierCaptionSchema,
} from './magnifier-caption';
import { magnifierCaptionControls } from './magnifier-caption-controls';
import {
  neonSignFlickerDefaults,
  neonSignFlickerMeta,
  neonSignFlickerSchema,
} from './neon-sign-flicker';
import { neonSignFlickerControls } from './neon-sign-flicker-controls';
import { numberCounterDefaults, numberCounterMeta, numberCounterSchema } from './number-counter';
import { numberCounterControls } from './number-counter-controls';
import { printerPagesDefaults, printerPagesMeta, printerPagesSchema } from './printer-pages';
import { printerPagesControls } from './printer-pages-controls';
import { typewriterDefaults, typewriterMeta, typewriterSchema } from './typewriter';
import { typewriterControls } from './typewriter-controls';

export const textRevealsClips: ClipModule[] = [
  {
    id: 'typewriter',
    schema: typewriterSchema,
    defaults: typewriterDefaults,
    meta: typewriterMeta,
    controls: typewriterControls,
  },
  {
    id: 'letter-flip',
    schema: letterFlipSchema,
    defaults: letterFlipDefaults,
    meta: letterFlipMeta,
    controls: letterFlipControls,
  },
  {
    id: 'number-counter',
    schema: numberCounterSchema,
    defaults: numberCounterDefaults,
    meta: numberCounterMeta,
    controls: numberCounterControls,
  },
  {
    id: 'printer-pages',
    schema: printerPagesSchema,
    defaults: printerPagesDefaults,
    meta: printerPagesMeta,
    controls: printerPagesControls,
  },
  {
    id: 'magnifier-caption',
    schema: magnifierCaptionSchema,
    defaults: magnifierCaptionDefaults,
    meta: magnifierCaptionMeta,
    controls: magnifierCaptionControls,
  },
  {
    id: 'neon-sign-flicker',
    schema: neonSignFlickerSchema,
    defaults: neonSignFlickerDefaults,
    meta: neonSignFlickerMeta,
    controls: neonSignFlickerControls,
  },
  {
    id: 'going-live-teaser',
    schema: goingLiveTeaserSchema,
    defaults: goingLiveTeaserDefaults,
    meta: goingLiveTeaserMeta,
    controls: goingLiveTeaserControls,
  },
];
