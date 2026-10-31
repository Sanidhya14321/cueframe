import type { SceneModule } from '../../scene-module';
import { phoneFlatLayScene } from './phone-flat-lay';
import { phonePedestalScene } from './phone-pedestal';
import { phoneSpinInScene } from './phone-spin-in';
import { phoneTurnaroundScene } from './phone-turnaround';

export const phoneRevealsScenes: SceneModule[] = [
  phoneSpinInScene,
  phoneTurnaroundScene,
  phonePedestalScene,
  phoneFlatLayScene,
];
