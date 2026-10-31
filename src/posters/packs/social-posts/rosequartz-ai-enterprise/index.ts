import { definePack } from '../../../pack';
import { engineeredToScale, promptPipelines, shipPlaybooks, standApart } from './posts';
import { counterPost, counterStory, POSTS } from './posts-more';

export const rosequartzAiEnterprisePack = definePack({
  id: 'rosequartz-ai-enterprise',
  title: 'Rosequartz AI Enterprise',
  description:
    'Enterprise AI and SaaS social posts and stories in rose, magenta and deep plum, with agent chats, counters and feature tiles.',
  category: 'social-posts',
  tags: ['ai', 'saas', 'b2b', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    ...POSTS,
    promptPipelines,
    engineeredToScale,
    shipPlaybooks,
    standApart,
    counterPost,
    counterStory,
  ],
});
