import { definePack } from '../../../pack';
import { clearProcess, clearProcessStory, MINT } from './posts';
import { benefits, POSTS } from './posts-more';

export const cobaltValuePropositionPack = definePack({
  id: 'cobalt-value-proposition',
  title: 'Cobalt Value Proposition',
  description:
    'Service menu, clear process, promise grid, benefits and why choose us posts in cobalt and sunflower, with a matching story.',
  category: 'social-posts',
  tags: ['b2b', 'small-business', 'instagram', 'story'],
  theme: 'dark',

  designs: [...POSTS, clearProcessStory, benefits(MINT), clearProcess(MINT)],
});
