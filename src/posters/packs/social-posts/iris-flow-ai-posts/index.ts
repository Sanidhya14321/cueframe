import { definePack } from '../../../pack';
import { growOnline, magicRoutines, quoteFloat, stayAhead } from './posts';
import { effortlessPost, effortlessStory, POSTS } from './posts-more';

export const irisFlowAiPostsPack = definePack({
  id: 'iris-flow-ai-posts',
  title: 'Iris Flow AI Posts',
  description:
    'Bright enterprise AI and automation posts and stories in iris violet and lilac, with quotes, stats, launches and workflow promos.',
  category: 'social-posts',
  tags: ['ai', 'saas', 'gradient', 'instagram', 'story'],
  theme: 'light',

  designs: [
    ...POSTS,
    magicRoutines,
    growOnline,
    stayAhead,
    quoteFloat,
    effortlessPost,
    effortlessStory,
  ],
});
