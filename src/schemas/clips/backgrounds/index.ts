import type { ClipModule } from '../../registry';
import {
  reliefBackdropDefaults,
  reliefBackdropMeta,
  reliefBackdropSchema,
} from './relief-backdrop';
import { reliefBackdropControls } from './relief-backdrop-controls';

export const backgroundsClips: ClipModule[] = [
  {
    id: 'relief-backdrop',
    schema: reliefBackdropSchema,
    defaults: reliefBackdropDefaults,
    meta: reliefBackdropMeta,
    controls: reliefBackdropControls,
  },
];
