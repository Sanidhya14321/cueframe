import { definePack } from '../../../pack';
import { automationCard, wifiSpeed } from './posts';
import { clientReviews } from './posts-reviews';
import { architect, POSTS } from './posts-web';
import { launchPost, launchStory, wordsBlue, wordsGreen } from './posts-words';

export const voltageBlueAiPostsPack = definePack({
  id: 'voltage-blue-ai-posts',
  title: 'Voltage Blue AI Posts',
  description:
    'Dark electric blue AI and SaaS social posts and stories with launches, reviews, stats, webinars and bold type.',
  category: 'social-posts',
  tags: ['ai', 'saas', 'instagram', 'story', 'neon'],
  theme: 'dark',

  designs: [
    ...POSTS,
    wifiSpeed,
    automationCard,
    clientReviews,
    architect,
    wordsBlue,
    wordsGreen,
    launchPost,
    launchStory,
  ],
});
