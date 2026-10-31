import { definePack } from '../../../pack';
import { countdownPost, countdownStory, gameDay, matchups } from './posts';
import { finalScore, gameStats, playerOfWeek, topFive } from './posts-more';
import { gameTimes, rivalNight, rivalRemix } from './posts-schedule';

const POSTS = [
  gameDay,
  gameTimes,
  rivalNight,
  matchups,
  countdownPost,
  topFive,
  gameStats,
  finalScore,
  playerOfWeek,
];

export const blazeFoxesFootballPack = definePack({
  id: 'blaze-foxes-football',
  title: 'Blaze Foxes Football',
  description:
    'Gameday, countdown, schedule, poll, stats and player graphics for a football club in charcoal and blaze orange.',
  category: 'sports',
  tags: ['sports', 'instagram', 'story', 'stats'],
  theme: 'dark',

  designs: [
    ...POSTS,
    gameStats,
    matchups,
    finalScore,
    gameDay,
    topFive,
    playerOfWeek,
    countdownPost,
    gameTimes,
    rivalNight,
    rivalRemix,
    countdownStory,
  ],
});
