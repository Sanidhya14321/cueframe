import { definePack } from '../../../pack';
import { buildPills, opportunities, unlockInsights, verbList } from './posts';
import { POSTS, teamPost, teamStory } from './posts-extra';

export const violetWaveSalesPack = definePack({
  id: 'violet-wave-sales',
  title: 'Violet Wave Sales',
  description:
    'Modern sales and marketing posts and stories in electric violet and ink, with bold pill stacks, testimonials, team features and growth hooks.',
  category: 'social-posts',
  tags: ['b2b', 'corporate', 'instagram', 'story', 'review'],
  theme: 'dark',

  designs: [...POSTS, buildPills, opportunities, unlockInsights, verbList, teamPost, teamStory],
});
