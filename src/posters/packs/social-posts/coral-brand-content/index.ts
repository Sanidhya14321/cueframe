import { definePack } from '../../../pack';
import { CORAL, focusBridge, howWeGrow, luxury, ourServices, standOut, TEAL } from './posts';
import {
  creativity,
  didYouKnow,
  everyMoment,
  nextLevel,
  nextLevelStory,
  seoInsights,
  takeTheSeat,
} from './posts-more';

const POSTS = [
  standOut,
  luxury,
  howWeGrow,
  creativity,
  focusBridge,
  ourServices,
  takeTheSeat,
  everyMoment(CORAL),
  seoInsights(CORAL),
  nextLevel,
  didYouKnow,
];

export const coralBrandContentPack = definePack({
  id: 'coral-brand-content',
  title: 'Coral Brand Content',
  description:
    'Square brand authority posts for agencies and B2B teams in coral, ink and plum, with a story size.',
  category: 'social-posts',
  tags: ['b2b', 'instagram', 'linkedin', 'small-business', 'photo'],
  theme: 'dark',

  designs: [...POSTS, everyMoment(TEAL), seoInsights(TEAL), nextLevelStory],
});
