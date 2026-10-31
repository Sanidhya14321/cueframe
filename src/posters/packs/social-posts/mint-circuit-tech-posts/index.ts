import { definePack } from '../../../pack';
import { amplifyBars, worldReach } from './posts';
import { POSTS, rocketPost, rocketStory } from './posts-extra';
import { quoteBox, teamRing } from './posts-more';

export const mintCircuitTechPostsPack = definePack({
  id: 'mint-circuit-tech-posts',
  title: 'Mint Circuit Tech Posts',
  description:
    'Dark enterprise tech posts and stories with glowing mint accents, pricing, quotes, stats and product launch layouts.',
  category: 'social-posts',
  tags: ['saas', 'b2b', 'instagram', 'story', 'neon'],
  theme: 'dark',

  designs: [...POSTS, quoteBox, worldReach, teamRing, amplifyBars, rocketPost, rocketStory],
});
