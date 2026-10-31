import type { SceneModule } from '../../scene-module';
import { goingLiveTeaserScene } from './going-live-teaser';
import { letterFlipScene } from './letter-flip';
import { magnifierCaptionScene } from './magnifier-caption';
import { neonSignFlickerScene } from './neon-sign-flicker';
import { numberCounterScene } from './number-counter';
import { printerPagesScene } from './printer-pages';
import { typewriterScene } from './typewriter';

export const textRevealsScenes: SceneModule[] = [
  typewriterScene,
  letterFlipScene,
  numberCounterScene,
  printerPagesScene,
  magnifierCaptionScene,
  neonSignFlickerScene,
  goingLiveTeaserScene,
];
