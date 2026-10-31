import { definePack } from '../../../pack';
import { ERA_SERIES } from './era';
import { SPARK_SERIES } from './posts';
import { VOICE_SERIES } from './voice';

export const coralTideCarouselsPack = definePack({
  id: 'coral-tide-carousels',
  title: 'Coral Tide Carousels',
  description:
    'Three LinkedIn and Instagram carousels on ideas, growth strategy and brand voice in deep teal and coral.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'b2b', 'tips'],
  theme: 'dark',

  designs: [...SPARK_SERIES.slice(0, 5), ...ERA_SERIES, ...VOICE_SERIES, ...SPARK_SERIES],
});
