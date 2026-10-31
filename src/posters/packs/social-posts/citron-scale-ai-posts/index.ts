import { definePack } from '../../../pack';
import { counterGrow, levelUp, versionLive } from './posts';
import { flowmindPost, flowmindStory, roadmapShines } from './posts-mid';
import { POSTS } from './posts-more';

export const citronScaleAiPostsPack = definePack({
  id: 'citron-scale-ai-posts',
  title: 'Citron Scale AI Posts',
  description:
    'AI product and SaaS social posts and stories in citron lime on charcoal, with launches, gauges, counters and feature panels.',
  category: 'social-posts',
  tags: ['ai', 'saas', 'product', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    ...POSTS,
    levelUp,
    counterGrow,
    versionLive,
    roadmapShines,
    flowmindPost,
    flowmindStory,
  ],
});
