import { definePack } from '../../../pack';
import { ideasFlight, leadTrend, portfolio } from './posts';
import { POSTS, trendsPost, trendsStory, webinarDark, webinarNavy } from './posts-extra';
import { seoMagnifier } from './posts-more';

export const harborCoralMarketingPack = definePack({
  id: 'harbor-coral-marketing',
  title: 'Harbor Coral Marketing',
  description:
    'Navy and coral marketing posts and stories with stats, webinars, checklists, portfolio and trend graphics.',
  category: 'social-posts',
  tags: ['small-business', 'b2b', 'instagram', 'story', 'photo'],
  theme: 'light',

  designs: [
    ...POSTS,
    ideasFlight,
    portfolio,
    leadTrend,
    seoMagnifier,
    webinarNavy,
    webinarDark,
    trendsPost,
    trendsStory,
  ],
});
