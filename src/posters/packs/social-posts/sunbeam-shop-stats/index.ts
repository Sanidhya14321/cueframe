import { definePack } from '../../../pack';
import { berryLeaders, nightLeaders, useCases } from './posts';
import { barsPost, barsStory, berryResults, profit, sunResults } from './posts-more';

export const sunbeamShopStatsPack = definePack({
  id: 'sunbeam-shop-stats',
  title: 'Sunbeam Shop Stats',
  description:
    'Small business statistic, trend, result and growth posts in sunflower yellow and midnight navy, with a matching story.',
  category: 'social-posts',
  tags: ['stats', 'small-business', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    sunResults,
    profit,
    useCases,
    nightLeaders,
    barsPost,
    barsStory,
    berryResults,
    berryLeaders,
  ],
});
