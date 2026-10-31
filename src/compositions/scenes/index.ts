import type { SceneModule } from '../scene-module';
import { adRevealsScenes } from './ad-reveals';
import { backgroundsScenes } from './backgrounds';
import { brandScenes } from './brand';
import { deskScenesScenes } from './desk-scenes';
import { handDrawnScenes } from './hand-drawn';
import { importedScenes } from './imported';
import { invitationsScenes } from './invitations';
import { kineticTypeScenes } from './kinetic-type';
import { listPickersScenes } from './list-pickers';
import { overlaysScenes } from './overlays';
import { phoneLayoutsScenes } from './phone-layouts';
import { phoneRevealsScenes } from './phone-reveals';
import { screenDemosScenes } from './screen-demos';
import { textRevealsScenes } from './text-reveals';
import { transitionsScenes } from './transitions';

export const CLIP_SCENES: SceneModule[] = [
  ...importedScenes,
  ...kineticTypeScenes,
  ...textRevealsScenes,
  ...handDrawnScenes,
  ...phoneRevealsScenes,
  ...phoneLayoutsScenes,
  ...screenDemosScenes,
  ...deskScenesScenes,
  ...overlaysScenes,
  ...listPickersScenes,
  ...brandScenes,
  ...adRevealsScenes,
  ...backgroundsScenes,
  ...transitionsScenes,
  ...invitationsScenes,
];
