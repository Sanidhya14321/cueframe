import { definePack } from '../../../pack';
import { creativeTeams, growMore, strategyMotion, targetGoals, transforming } from './posts';
import { beYourself, chargedBolt, paceQuote, tagCloud, testimonial } from './posts-more';
import { messaging, messagingStory } from './posts-story';

const POSTS = [
  transforming,
  creativeTeams,
  growMore,
  strategyMotion,
  targetGoals,
  chargedBolt,
  testimonial,
  beYourself,
  messaging,
  tagCloud,
  paceQuote,
];

export const harborB2bMarketingPack = definePack({
  id: 'harbor-b2b-marketing',
  title: 'Harbor B2B Marketing',
  description:
    'Modern B2B marketing posts and stories in deep navy, coral and cream for agencies and SaaS teams.',
  category: 'social-posts',
  tags: ['b2b', 'instagram', 'linkedin', 'story', 'photo'],
  theme: 'dark',

  designs: [...POSTS, transforming, creativeTeams, growMore, messaging, messagingStory],
});
