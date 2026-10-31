import { definePack } from '../../../pack';
import { STAGE_SERIES } from './stages';
import { TRUST_SERIES } from './trust';
import { WIRE_SERIES } from './wire';

export const emeraldAuthorityCarouselsPack = definePack({
  id: 'emerald-authority-carousels',
  title: 'Emerald Authority Carousels',
  description:
    'Three LinkedIn and Instagram carousels on building a trusted voice, sharper strategy and audience trust in deep emerald and mint.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'b2b', 'tips'],
  theme: 'dark',

  designs: [...STAGE_SERIES, ...WIRE_SERIES, ...TRUST_SERIES],
});
