import type { ClipModule } from '../../registry';
import {
  laptopWipeRevealDefaults,
  laptopWipeRevealMeta,
  laptopWipeRevealSchema,
} from './laptop-wipe-reveal';
import { laptopWipeRevealControls } from './laptop-wipe-reveal-controls';
import {
  websiteFoundSpotlightDefaults,
  websiteFoundSpotlightMeta,
  websiteFoundSpotlightSchema,
} from './website-found-spotlight';
import { websiteFoundSpotlightControls } from './website-found-spotlight-controls';

export const deskScenesClips: ClipModule[] = [
  {
    id: 'laptop-wipe-reveal',
    schema: laptopWipeRevealSchema,
    defaults: laptopWipeRevealDefaults,
    meta: laptopWipeRevealMeta,
    controls: laptopWipeRevealControls,
  },
  {
    id: 'website-found-spotlight',
    schema: websiteFoundSpotlightSchema,
    defaults: websiteFoundSpotlightDefaults,
    meta: websiteFoundSpotlightMeta,
    controls: websiteFoundSpotlightControls,
  },
];
