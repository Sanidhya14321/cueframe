import type { SceneModule } from '../../scene-module';
import { filmDustScene } from './film-dust';
import { floatingCardsScene } from './floating-cards';
import { spiderWebServicesScene } from './spider-web-services';

export const overlaysScenes: SceneModule[] = [
  floatingCardsScene,
  filmDustScene,
  spiderWebServicesScene,
];
