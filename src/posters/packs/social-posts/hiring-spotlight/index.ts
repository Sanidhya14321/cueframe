import { definePack } from '../../../pack';
import { COBALT, PLUM, spotlightBadge, verticalHiring } from './posts';
import { MINI_POSTS } from './posts-more';

export const hiringSpotlightPack = definePack({
  id: 'hiring-spotlight',
  title: 'Hiring Spotlight',
  description:
    'Recruitment, welcome and team spotlight posts in cobalt and sunflower, with matching stories.',
  category: 'social-posts',
  tags: ['hiring', 'instagram', 'small-business', 'photo'],
  theme: 'dark',

  designs: [
    ...MINI_POSTS.map((build) => build(COBALT)),
    verticalHiring(PLUM),
    spotlightBadge(PLUM),
  ],
});
