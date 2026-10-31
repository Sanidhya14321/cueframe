import { definePack } from '../../../pack';
import { playerFeature, saveTheDate, schedule, startingFive } from './posts';
import { allStar, allStarPost, CRIMSON_RECORD, POSTS, record } from './posts-more';

export const courtKingsPack = definePack({
  id: 'court-kings',
  title: 'Court Kings Basketball',
  description:
    'Game day, schedule, roster and stat graphics for a basketball club in forest green and gold.',
  category: 'sports',
  tags: ['sports', 'instagram', 'story', 'photo'],
  theme: 'dark',

  designs: [
    ...POSTS,
    playerFeature,
    saveTheDate,
    startingFive,
    schedule,
    record,
    CRIMSON_RECORD,
    allStarPost,
    allStar,
  ],
});
