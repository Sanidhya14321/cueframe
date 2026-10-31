import type { Template } from '../../../kit';
import { definePack } from '../../../pack';
import { cardContrarian, cardCover, cardProcess, cardRemix } from './slides-cards';
import { qaCarousel, qaCover, qaPosting, qaReach } from './slides-qa';
import {
  gapCloser,
  gapCover,
  gapLast,
  gapSwipe,
  movePublish,
  moveRepeat,
  moveResearch,
  movesCover,
} from './slides-steps';
import {
  termChurn,
  termPipeline,
  termRetention,
  termsCover,
  waveCover,
  waveFinale,
  waveMiddle,
  waveRise,
} from './slides-wave';

const MOVES: readonly Template[] = [movesCover, moveResearch, movePublish, moveRepeat];
const GAP: readonly Template[] = [gapCover, gapCloser, gapSwipe, gapLast];
const CARDS: readonly Template[] = [cardCover, cardRemix, cardProcess, cardContrarian];
const WAVE: readonly Template[] = [waveCover, waveMiddle, waveRise, waveFinale];
const TERMS: readonly Template[] = [termsCover, termRetention, termChurn, termPipeline];
const QA: readonly Template[] = [qaCover, qaReach, qaPosting, qaCarousel];

export const mulberryGrowthCarouselsPack = definePack({
  id: 'mulberry-growth-carousels',
  title: 'Mulberry Growth Carousels',
  description:
    'Six swipeable marketing carousels in mulberry and peach for LinkedIn and Instagram, from step guides to Q&A posts.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'instagram', 'b2b', 'tips'],
  theme: 'dark',

  designs: [...MOVES, ...GAP, ...CARDS, ...WAVE, ...TERMS, ...QA],
});
