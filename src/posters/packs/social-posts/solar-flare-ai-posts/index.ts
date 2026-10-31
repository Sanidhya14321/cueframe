import { definePack } from '../../../pack';
import { solutionsAmber, solutionsViolet } from './posts';
import { adsGrowth, fiveStages, POSTS, powerPost, powerStory } from './posts-more';
import { blueprint } from './posts-power';

export const solarFlareAiPostsPack = definePack({
  id: 'solar-flare-ai-posts',
  title: 'Solar Flare AI Posts',
  description:
    'Glowing black and amber AI and SaaS social posts and stories with stats, launches, quotes and product promos.',
  category: 'social-posts',
  tags: ['ai', 'saas', 'b2b', 'instagram', 'neon'],
  theme: 'dark',

  designs: [
    ...POSTS,
    blueprint,
    powerPost,
    adsGrowth,
    fiveStages,
    solutionsAmber,
    solutionsViolet,
    powerStory,
  ],
});
