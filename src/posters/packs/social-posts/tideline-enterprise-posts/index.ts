import { definePack } from '../../../pack';
import { analyticsBars } from './posts';
import { POSTS, stickyPost, stickyStory } from './posts-extra';
import { stayAhead } from './posts-more';
import { skillPoll, websiteLive } from './posts-web';

export const tidelineEnterprisePostsPack = definePack({
  id: 'tideline-enterprise-posts',
  title: 'Tideline Enterprise Posts',
  description:
    'Enterprise B2B social posts and stories in deep teal and aqua, with events, polls, stats, reviews and launch graphics.',
  category: 'social-posts',
  tags: ['b2b', 'corporate', 'instagram', 'story', 'stats'],
  theme: 'dark',

  designs: [...POSTS, analyticsBars, websiteLive, skillPoll, stayAhead, stickyPost, stickyStory],
});
