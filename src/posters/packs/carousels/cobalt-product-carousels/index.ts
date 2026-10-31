import { definePack } from '../../../pack';
import { PLAN_SERIES } from './cards';
import { WAYS_SERIES } from './steps';
import { MINDSET_SERIES } from './topics';

export const cobaltProductCarouselsPack = definePack({
  id: 'cobalt-product-carousels',
  title: 'Cobalt Product Carousels',
  description:
    'Three product management carousels for LinkedIn and Instagram in ink black with electric blue gradients.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'saas', 'tips'],
  theme: 'dark',

  designs: [...WAYS_SERIES, ...PLAN_SERIES, ...MINDSET_SERIES],
});
