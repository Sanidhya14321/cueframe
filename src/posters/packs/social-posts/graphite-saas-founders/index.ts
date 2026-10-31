import { definePack } from '../../../pack';
import { globalCoverage, LILAC, quoteCard } from './posts';
import { POSTS } from './posts-more';

export const graphiteSaasFoundersPack = definePack({
  id: 'graphite-saas-founders',
  title: 'Graphite SaaS Founders',
  description:
    'Product demo, analytics, testimonial, event and lead posts for SaaS and AI startups in graphite and electric lime.',
  category: 'social-posts',
  tags: ['saas', 'ai', 'instagram', 'linkedin', 'review'],
  theme: 'dark',

  designs: [...POSTS, globalCoverage(LILAC), quoteCard(LILAC)],
});
