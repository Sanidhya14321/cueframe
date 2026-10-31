import { definePack } from '../../../pack';
import { brandTraps } from './posts';
import { gamePlanCobalt, gamePlanTangerine, spotlightPost, spotlightStory } from './posts-mid';
import { clientHappiness, POSTS } from './posts-more';

export const tangerineNavyMarketingPack = definePack({
  id: 'tangerine-navy-marketing',
  title: 'Tangerine Marketing Posts',
  description:
    'Bold B2B marketing social posts and stories in tangerine, navy and cream, with checklists, reviews, hiring and strategy layouts.',
  category: 'social-posts',
  tags: ['b2b', 'small-business', 'instagram', 'story', 'review'],
  theme: 'light',

  designs: [
    ...POSTS,
    brandTraps,
    spotlightPost,
    gamePlanTangerine,
    clientHappiness,
    gamePlanCobalt,
    spotlightStory,
  ],
});
