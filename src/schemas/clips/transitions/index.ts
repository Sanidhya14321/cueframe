import type { ClipModule } from '../../registry';
import {
  sceneTransitionDefaults,
  sceneTransitionMeta,
  sceneTransitionSchema,
} from './scene-transition';
import { sceneTransitionControls } from './scene-transition-controls';

export const transitionsClips: ClipModule[] = [
  {
    id: 'scene-transition',
    schema: sceneTransitionSchema,
    defaults: sceneTransitionDefaults,
    meta: sceneTransitionMeta,
    controls: sceneTransitionControls,
  },
];
