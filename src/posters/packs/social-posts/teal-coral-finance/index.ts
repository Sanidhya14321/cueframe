import { definePack } from '../../../pack';
import { bankingChoice, fasterLoans, smarterPlans, webinarSteps } from './posts';
import { futureDigitalPost, futureDigitalStory, POSTS } from './posts-more';

export const tealCoralFinancePack = definePack({
  id: 'teal-coral-finance',
  title: 'Teal Coral Finance',
  description:
    'Corporate finance and banking posts and stories in deep teal and coral, with loans, reviews, security and data insight layouts.',
  category: 'social-posts',
  tags: ['corporate', 'b2b', 'instagram', 'story', 'stats'],
  theme: 'dark',

  designs: [
    ...POSTS,
    bankingChoice,
    fasterLoans,
    smarterPlans,
    webinarSteps,
    futureDigitalPost,
    futureDigitalStory,
  ],
});
