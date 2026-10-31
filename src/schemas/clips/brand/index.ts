import type { ClipModule } from '../../registry';
import { appIconRevealDefaults, appIconRevealMeta, appIconRevealSchema } from './app-icon-reveal';
import { appIconRevealControls } from './app-icon-reveal-controls';
import { brandRevealDefaults, brandRevealMeta, brandRevealSchema } from './brand-reveal';
import { brandRevealControls } from './brand-reveal-controls';
import { ctaEndCardDefaults, ctaEndCardMeta, ctaEndCardSchema } from './cta-end-card';
import { ctaEndCardControls } from './cta-end-card-controls';
import {
  dotWordmarkRevealDefaults,
  dotWordmarkRevealMeta,
  dotWordmarkRevealSchema,
} from './dot-wordmark-reveal';
import { dotWordmarkRevealControls } from './dot-wordmark-reveal-controls';
import {
  mailinfraInboxWebDefaults,
  mailinfraInboxWebMeta,
  mailinfraInboxWebSchema,
} from './mailinfra-inbox-web';
import { mailinfraInboxWebControls } from './mailinfra-inbox-web-controls';
import { puzzleSuccessDefaults, puzzleSuccessMeta, puzzleSuccessSchema } from './puzzle-success';
import { puzzleSuccessControls } from './puzzle-success-controls';

export const brandClips: ClipModule[] = [
  {
    id: 'brand-reveal',
    schema: brandRevealSchema,
    defaults: brandRevealDefaults,
    meta: brandRevealMeta,
    controls: brandRevealControls,
  },
  {
    id: 'app-icon-reveal',
    schema: appIconRevealSchema,
    defaults: appIconRevealDefaults,
    meta: appIconRevealMeta,
    controls: appIconRevealControls,
  },
  {
    id: 'cta-end-card',
    schema: ctaEndCardSchema,
    defaults: ctaEndCardDefaults,
    meta: ctaEndCardMeta,
    controls: ctaEndCardControls,
  },
  {
    id: 'dot-wordmark-reveal',
    schema: dotWordmarkRevealSchema,
    defaults: dotWordmarkRevealDefaults,
    meta: dotWordmarkRevealMeta,
    controls: dotWordmarkRevealControls,
  },
  {
    id: 'puzzle-success',
    schema: puzzleSuccessSchema,
    defaults: puzzleSuccessDefaults,
    meta: puzzleSuccessMeta,
    controls: puzzleSuccessControls,
  },
  {
    id: 'mailinfra-inbox-web',
    schema: mailinfraInboxWebSchema,
    defaults: mailinfraInboxWebDefaults,
    meta: mailinfraInboxWebMeta,
    controls: mailinfraInboxWebControls,
  },
];
