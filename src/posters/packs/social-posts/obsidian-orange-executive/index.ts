import { definePack } from '../../../pack';
import { answerCall, leadershipTips, powerFull, trackRecord } from './posts';
import { helloMonday, helloTuesday, POSTS } from './posts-extra';
import { marketPost, marketStory } from './posts-more';

export const obsidianOrangeExecutivePack = definePack({
  id: 'obsidian-orange-executive',
  title: 'Obsidian Orange Executive',
  description:
    'Bold executive business posts and stories in black and blaze orange, with funnels, track records, big stats and leadership tips.',
  category: 'social-posts',
  tags: ['corporate', 'b2b', 'instagram', 'story', 'stats'],
  theme: 'dark',

  designs: [
    ...POSTS,
    trackRecord,
    leadershipTips,
    answerCall,
    powerFull,
    helloMonday,
    helloTuesday,
    marketPost,
    marketStory,
  ],
});
