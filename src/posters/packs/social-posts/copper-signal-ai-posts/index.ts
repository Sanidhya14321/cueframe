import { definePack } from '../../../pack';
import { mistakes, statRows, toggles } from './posts';
import { closeRate, whyUs, workshopPost, workshopStory } from './posts-extra';
import { principles, uploadFile, velocityBars } from './posts-more';
import { quotePost } from './posts-quote';

const POSTS = [
  quotePost,
  principles,
  uploadFile,
  toggles,
  mistakes,
  statRows,
  workshopPost,
  velocityBars,
  whyUs,
  closeRate,
];

export const copperSignalAiPostsPack = definePack({
  id: 'copper-signal-ai-posts',
  title: 'Copper Signal AI Posts',
  description:
    'Enterprise AI and SaaS posts and stories in espresso and glowing copper, with stats, workshops, quotes and product launches.',
  category: 'social-posts',
  tags: ['ai', 'saas', 'b2b', 'instagram', 'story'],
  theme: 'dark',

  designs: [...POSTS, toggles, mistakes, statRows, quotePost, workshopPost, workshopStory],
});
