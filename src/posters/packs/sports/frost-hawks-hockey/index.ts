import { definePack } from '../../../pack';
import { finalStats, playerCard, puckDrop } from './posts';
import { quoteFrost, quoteNight, schedule, startingLineup } from './posts-more';
import { gameDayPost, gameDayStory, playerOfYear } from './posts-player';
import { countdown, rivalGame } from './posts-rival';

const POSTS = [
  finalStats,
  puckDrop,
  playerCard,
  playerOfYear,
  gameDayPost,
  quoteNight,
  startingLineup,
  schedule,
  rivalGame,
  countdown,
];

export const frostHawksHockeyPack = definePack({
  id: 'frost-hawks-hockey',
  title: 'Frost Hawks Hockey',
  description:
    'Game day, stats, lineup, schedule and player graphics for a hockey club in midnight navy, ice blue and amber.',
  category: 'sports',
  tags: ['sports', 'instagram', 'story', 'photo'],
  theme: 'light',

  designs: [
    ...POSTS,
    quoteFrost,
    finalStats,
    puckDrop,
    playerCard,
    playerOfYear,
    schedule,
    countdown,
    rivalGame,
    startingLineup,
    gameDayPost,
    quoteNight,
    gameDayStory,
  ],
});
