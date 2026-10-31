import { definePack } from '../../../pack';
import { campaignRoi, crewPower, pickDirection } from './posts';
import { buildFaster, topFivePost, topFiveStory } from './posts-mid';
import { POSTS } from './posts-more';

export const amethystSignalAiPostsPack = definePack({
  id: 'amethyst-signal-ai-posts',
  title: 'Amethyst Signal Posts',
  description:
    'Dark AI and tech company social posts and stories in glowing violet, with team, event, review and growth layouts.',
  category: 'social-posts',
  tags: ['ai', 'b2b', 'corporate', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    ...POSTS,
    crewPower,
    campaignRoi,
    pickDirection,
    buildFaster,
    topFivePost,
    topFiveStory,
  ],
});
