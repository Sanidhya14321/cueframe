import type { SceneModule } from '../../scene-module';
import { chalkBadgeScene } from './chalk-badge';
import { chalkBadgeGridScene } from './chalk-badge-grid';
import { chalkBadgesReelScene } from './chalk-badges-reel';
import { chalkTitleScene } from './chalk-title';
import { doodleArrowsScene } from './doodle-arrows';
import { handwrittenNoteScene } from './handwritten-note';
import { scribbleCaptionScene } from './scribble-caption';

export const handDrawnScenes: SceneModule[] = [
  handwrittenNoteScene,
  scribbleCaptionScene,
  doodleArrowsScene,
  chalkBadgeScene,
  chalkBadgeGridScene,
  chalkTitleScene,
  chalkBadgesReelScene,
];
