import { definePack } from '../../../pack';
import { coffinWebinar, happyHalloween, tombstoneQuote, trickOrTreat } from './posts';
import { builtToBite } from './posts-bite';
import { comicCover, comicRemix, computerPost, computerStory } from './posts-extra';
import { frightNight, octoberChecklist, servicesTags, spookyDeal } from './posts-more';

const POSTS = [
  happyHalloween,
  tombstoneQuote,
  trickOrTreat,
  coffinWebinar,
  servicesTags,
  builtToBite,
  computerPost,
  frightNight,
  comicCover,
  spookyDeal,
  octoberChecklist,
];

export const cryptLanternHalloweenPack = definePack({
  id: 'crypt-lantern-halloween',
  title: 'Crypt Lantern Halloween',
  description:
    'Spooky October marketing posts and stories for brands and studios in midnight teal, blood red and mustard.',
  category: 'seasonal',
  tags: ['holiday', 'instagram', 'story', 'small-business', 'sale'],
  theme: 'dark',

  designs: [
    ...POSTS,
    happyHalloween,
    trickOrTreat,
    coffinWebinar,
    builtToBite,
    octoberChecklist,
    tombstoneQuote,
    spookyDeal,
    servicesTags,
    frightNight,
    comicCover,
    comicRemix,
    computerPost,
    computerStory,
  ],
});
