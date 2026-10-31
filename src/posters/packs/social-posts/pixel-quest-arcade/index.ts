import { definePack } from '../../../pack';
import { liveWorkshop, newClients, ourServices } from './posts';
import { raceAutumn, raceSummer, trueOrFalse } from './posts-extra';
import { growthStats, keyFactors, tetrisFit, tetrisFitStory } from './posts-more';
import { versus } from './posts-versus';

const POSTS = [
  newClients,
  raceSummer,
  tetrisFit,
  keyFactors,
  liveWorkshop,
  growthStats,
  versus,
  ourServices,
  trueOrFalse,
];

export const pixelQuestArcadePack = definePack({
  id: 'pixel-quest-arcade',
  title: 'Pixel Quest Arcade',
  description:
    'Retro 8-bit marketing posts with high scores, versus screens, stat boards and block puzzles for agencies and creators.',
  category: 'social-posts',
  tags: ['retro', 'b2b', 'instagram', 'story', 'stats'],
  theme: 'dark',

  designs: [
    ...POSTS,
    newClients,
    liveWorkshop,
    ourServices,
    versus,
    keyFactors,
    growthStats,
    trueOrFalse,
    tetrisFit,
    raceSummer,
    raceAutumn,
    tetrisFitStory,
  ],
});
