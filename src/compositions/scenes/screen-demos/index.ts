import type { SceneModule } from '../../scene-module';
import { incomingCallTeaserScene } from './incoming-call-teaser';
import { keyboardTypingCtaScene } from './keyboard-typing-cta';
import { messageAriseScene } from './message-arise';
import { phoneScrollScene } from './phone-scroll';
import { phoneSwapScene } from './phone-swap';

export const screenDemosScenes: SceneModule[] = [
  phoneScrollScene,
  phoneSwapScene,
  messageAriseScene,
  incomingCallTeaserScene,
  keyboardTypingCtaScene,
];
