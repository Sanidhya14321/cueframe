import type { SceneModule } from '../../scene-module';
import { appIconRevealScene } from './app-icon-reveal';
import { brandRevealScene } from './brand-reveal';
import { ctaEndCardScene } from './cta-end-card';
import { dotWordmarkRevealScene } from './dot-wordmark-reveal';
import { mailinfraInboxWebScene } from './mailinfra-inbox-web';
import { puzzleSuccessScene } from './puzzle-success';

export const brandScenes: SceneModule[] = [
  brandRevealScene,
  appIconRevealScene,
  ctaEndCardScene,
  dotWordmarkRevealScene,
  puzzleSuccessScene,
  mailinfraInboxWebScene,
];
