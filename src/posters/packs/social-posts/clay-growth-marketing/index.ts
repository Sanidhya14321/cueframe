import { definePack } from '../../../pack';
import { TIDE } from './clay';
import { doorHanger, marketPortrait, reviewWords } from './posts';
import { POSTS } from './posts-crowd';
import { seoChecklist, TIME_WAITS, timeWaits } from './posts-lists';
import { consistencyPost, consistencyStory } from './posts-more';

export const clayGrowthMarketingPack = definePack({
  id: 'clay-growth-marketing',
  title: 'Clay Growth Marketing',
  description:
    'Modern marketing posts and stories in terracotta and cream, with reviews, checklists, webinars, quizzes and growth tips.',
  category: 'social-posts',
  tags: ['b2b', 'instagram', 'linkedin', 'story', 'tips'],
  theme: 'light',

  designs: [
    ...POSTS,
    marketPortrait,
    doorHanger,
    seoChecklist,
    reviewWords,
    TIME_WAITS,
    timeWaits(TIDE, ['Own Today', 'thrive tomorrow', 'Begin now']),
    consistencyPost,
    consistencyStory,
  ],
});
