import type { ClipModule } from '../../registry';
import { filmDustDefaults, filmDustMeta, filmDustSchema } from './film-dust';
import { filmDustControls } from './film-dust-controls';
import { floatingCardsDefaults, floatingCardsMeta, floatingCardsSchema } from './floating-cards';
import { floatingCardsControls } from './floating-cards-controls';
import {
  spiderWebServicesDefaults,
  spiderWebServicesMeta,
  spiderWebServicesSchema,
} from './spider-web-services';
import { spiderWebServicesControls } from './spider-web-services-controls';

export const overlaysClips: ClipModule[] = [
  {
    id: 'floating-cards',
    schema: floatingCardsSchema,
    defaults: floatingCardsDefaults,
    meta: floatingCardsMeta,
    controls: floatingCardsControls,
  },
  {
    id: 'film-dust',
    schema: filmDustSchema,
    defaults: filmDustDefaults,
    meta: filmDustMeta,
    controls: filmDustControls,
  },
  {
    id: 'spider-web-services',
    schema: spiderWebServicesSchema,
    defaults: spiderWebServicesDefaults,
    meta: spiderWebServicesMeta,
    controls: spiderWebServicesControls,
  },
];
