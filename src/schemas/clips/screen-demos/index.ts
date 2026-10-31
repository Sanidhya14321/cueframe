import type { ClipModule } from '../../registry';
import {
  incomingCallTeaserDefaults,
  incomingCallTeaserMeta,
  incomingCallTeaserSchema,
} from './incoming-call-teaser';
import { incomingCallTeaserControls } from './incoming-call-teaser-controls';
import {
  keyboardTypingCtaDefaults,
  keyboardTypingCtaMeta,
  keyboardTypingCtaSchema,
} from './keyboard-typing-cta';
import { keyboardTypingCtaControls } from './keyboard-typing-cta-controls';
import { messageAriseDefaults, messageAriseMeta, messageAriseSchema } from './message-arise';
import { messageAriseControls } from './message-arise-controls';
import { phoneScrollDefaults, phoneScrollMeta, phoneScrollSchema } from './phone-scroll';
import { phoneScrollControls } from './phone-scroll-controls';
import { phoneSwapDefaults, phoneSwapMeta, phoneSwapSchema } from './phone-swap';
import { phoneSwapControls } from './phone-swap-controls';

export const screenDemosClips: ClipModule[] = [
  {
    id: 'phone-scroll',
    schema: phoneScrollSchema,
    defaults: phoneScrollDefaults,
    meta: phoneScrollMeta,
    controls: phoneScrollControls,
  },
  {
    id: 'phone-swap',
    schema: phoneSwapSchema,
    defaults: phoneSwapDefaults,
    meta: phoneSwapMeta,
    controls: phoneSwapControls,
  },
  {
    id: 'message-arise',
    schema: messageAriseSchema,
    defaults: messageAriseDefaults,
    meta: messageAriseMeta,
    controls: messageAriseControls,
  },
  {
    id: 'incoming-call-teaser',
    schema: incomingCallTeaserSchema,
    defaults: incomingCallTeaserDefaults,
    meta: incomingCallTeaserMeta,
    controls: incomingCallTeaserControls,
  },
  {
    id: 'keyboard-typing-cta',
    schema: keyboardTypingCtaSchema,
    defaults: keyboardTypingCtaDefaults,
    meta: keyboardTypingCtaMeta,
    controls: keyboardTypingCtaControls,
  },
];
