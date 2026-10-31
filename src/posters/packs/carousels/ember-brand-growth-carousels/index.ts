import { definePack } from '../../../pack';
import { GRID_STEPS, gridCover, STAT_STEPS, statsCover } from './grid-stats';
import { LAUNCH_STEPS, launchCover } from './launch-lists';
import { KEY_STEPS, keysCover, MISTAKE_STEPS, mistakesCover } from './mistakes-keys';

const gridDeck = [gridCover, ...GRID_STEPS] as const;
const launchDeck = [launchCover, ...LAUNCH_STEPS] as const;
const statsDeck = [statsCover, ...STAT_STEPS] as const;
const mistakesDeck = [mistakesCover, ...MISTAKE_STEPS] as const;
const keysDeck = [keysCover, ...KEY_STEPS] as const;

export const emberBrandGrowthCarouselsPack = definePack({
  id: 'ember-brand-growth-carousels',
  title: 'Ember Brand Growth',
  description:
    'Five bold black and ember carousels on audience growth, launch checklists, quarterly stats and community.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'small-business', 'stats'],
  theme: 'dark',

  designs: [
    ...gridDeck,
    ...launchDeck,
    ...statsDeck,
    ...mistakesDeck,
    ...keysDeck,
    gridDeck[0],
    gridDeck[1],
    gridDeck[2],
    launchDeck[0],
    launchDeck[1],
    launchDeck[2],
    statsDeck[0],
    statsDeck[1],
    statsDeck[2],
    mistakesDeck[0],
    mistakesDeck[1],
    mistakesDeck[2],
    keysDeck[0],
    keysDeck[1],
    keysDeck[2],
  ],
});
