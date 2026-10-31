import { definePack } from '../../../pack';
import { highlightQuote, lockScreen, notesCard, searchWord } from './posts';
import { bloom, bloomStory, challenge, definition, polaroid } from './posts-more';

const POSTS = [
  lockScreen,
  bloom,
  polaroid,
  definition,
  highlightQuote,
  challenge,
  notesCard,
  searchWord,
];

export const lilacHourSelfcarePack = definePack({
  id: 'lilac-hour-selfcare',
  title: 'Lilac Hour Self Care',
  description:
    'Soft lifestyle and self care posts with lock screens, notes, quotes and a five day challenge in lilac and plum.',
  category: 'lifestyle',
  tags: ['wellness', 'instagram', 'story', 'quote', 'photo'],
  theme: 'light',

  designs: [
    ...POSTS,
    lockScreen,
    highlightQuote,
    notesCard,
    searchWord,
    polaroid,
    definition,
    challenge,
    bloom,
    bloomStory,
  ],
});
