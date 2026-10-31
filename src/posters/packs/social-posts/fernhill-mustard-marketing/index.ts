import { definePack } from '../../../pack';
import { catalogNewest, openingHours, whatTheySay } from './posts';
import { eventsPost, eventsStory, POSTS, searchAfter, searchBefore } from './posts-extra';
import { marketInsights } from './posts-more';

export const fernhillMustardMarketingPack = definePack({
  id: 'fernhill-mustard-marketing',
  title: 'Fernhill Marketing Posts',
  description:
    'Playful marketing agency posts and stories in forest green and mustard, with quizzes, spin wheels, events, reviews and myth or fact layouts.',
  category: 'social-posts',
  tags: ['b2b', 'small-business', 'instagram', 'story', 'quiz'],
  theme: 'light',

  designs: [
    ...POSTS,
    catalogNewest,
    openingHours,
    whatTheySay,
    marketInsights,
    searchBefore,
    searchAfter,
    eventsPost,
    eventsStory,
  ],
});
