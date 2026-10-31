import type { SceneModule } from '../../scene-module';
import { archSaveTheDateScene } from './arch-save-the-date';
import { botanicalSaveTheDateScene } from './botanical-save-the-date';
import { goldMonogramInviteScene } from './gold-monogram-invite';
import { miniaturePanoramaScene } from './miniature-panorama';
import { weddingItineraryPagesScene } from './wedding-itinerary-pages';

export const invitationsScenes: SceneModule[] = [
  archSaveTheDateScene,
  botanicalSaveTheDateScene,
  goldMonogramInviteScene,
  miniaturePanoramaScene,
  weddingItineraryPagesScene,
];
