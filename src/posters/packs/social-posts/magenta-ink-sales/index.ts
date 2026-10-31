import { definePack } from '../../../pack';
import { brandingMistakes, campaignInsights, chatHero, createBrands } from './posts';
import { insightsPost, insightsStory, POSTS } from './posts-extra';

export const magentaInkSalesPack = definePack({
  id: 'magenta-ink-sales',
  title: 'Magenta Ink Sales',
  description:
    'High contrast sales and marketing posts and stories in hot magenta and ink black, with chat bubbles, checklists, myths and lead generation hooks.',
  category: 'social-posts',
  tags: ['b2b', 'small-business', 'instagram', 'story', 'tips'],
  theme: 'dark',

  designs: [
    ...POSTS,
    brandingMistakes,
    createBrands,
    campaignInsights,
    chatHero,
    insightsPost,
    insightsStory,
  ],
});
