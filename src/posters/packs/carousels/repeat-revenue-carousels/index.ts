import { definePack } from '../../../pack';
import { DROP_STEPS, dropCover } from './drops';
import { habitsCover, pairStep, streakStep, tinyStep } from './habits';
import { LEVER_STEPS, leversCover, WAVE_STEPS, waveCover } from './levers';
import { blocksStep, calendarCover, RITUAL_STEPS } from './routines';

const leversDeck = [leversCover, ...LEVER_STEPS] as const;
const waveDeck = [waveCover, ...WAVE_STEPS] as const;
const calendarDeck = [calendarCover, blocksStep, ...RITUAL_STEPS] as const;
const dropDeck = [dropCover, ...DROP_STEPS] as const;
const habitsDeck = [habitsCover, tinyStep, pairStep, streakStep] as const;

export const repeatRevenueCarouselsPack = definePack({
  id: 'repeat-revenue-carousels',
  title: 'Repeat Revenue Carousels',
  description:
    'Five wine and mint business carousels on customer loyalty, calendar blocking and habits that stick.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'b2b', 'tips'],
  theme: 'dark',

  designs: [
    ...leversDeck,
    ...waveDeck,
    ...calendarDeck,
    ...dropDeck,
    ...habitsDeck,
    leversDeck[0],
    leversDeck[1],
    leversDeck[2],
    waveDeck[0],
    waveDeck[1],
    waveDeck[2],
    calendarDeck[0],
    calendarDeck[1],
    calendarDeck[2],
    dropDeck[0],
    dropDeck[1],
    dropDeck[2],
    habitsDeck[0],
    habitsDeck[1],
    habitsDeck[2],
  ],
});
