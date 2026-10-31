import { definePack } from '../../../pack';
import { bigPercent, crossword, leadTrend, watchWebinar } from './posts';
import { clientFeedback, stillMatters, whyChooseUs } from './posts-extra';
import { CORAL_GROW, clipboardGoals, GROW_POST, growWithUs, monthEvents } from './posts-more';
import { mythPost, mythStory } from './posts-myth';

const POSTS = [
  crossword,
  leadTrend,
  watchWebinar,
  bigPercent,
  monthEvents,
  clipboardGoals,
  GROW_POST,
  mythPost,
  stillMatters,
  clientFeedback,
  whyChooseUs,
];

export const fernB2bStrategyPack = definePack({
  id: 'fern-b2b-strategy',
  title: 'Fern B2B Strategy',
  description:
    'B2B marketing posts and stories in forest and mint, with puzzles, events, stats, webinars and client feedback.',
  category: 'social-posts',
  tags: ['b2b', 'linkedin', 'instagram', 'story', 'stats'],
  theme: 'light',

  designs: [
    ...POSTS,
    leadTrend,
    watchWebinar,
    bigPercent,
    crossword,
    GROW_POST,
    growWithUs(CORAL_GROW, '#KeepGrowing'),
    mythPost,
    mythStory,
  ],
});
