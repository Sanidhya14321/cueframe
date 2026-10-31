import { definePack } from '../../../pack';
import { everythingCtrl, startImpact, webinarSpeaker } from './posts';
import { MONDAY, TUESDAY } from './posts-day';
import { stagesPost, stagesStory, weAreHiring, wordStack } from './posts-extra';
import { didYouKnow, mythFact, peopleStat, roiStats } from './posts-more';

const POSTS = [
  startImpact,
  MONDAY,
  webinarSpeaker,
  everythingCtrl,
  mythFact,
  didYouKnow,
  peopleStat,
  roiStats,
  stagesPost,
  weAreHiring,
  wordStack,
];

export const sunsetOpsCorporatePack = definePack({
  id: 'sunset-ops-corporate',
  title: 'Sunset Ops Corporate',
  description:
    'Corporate business posts and stories in sunset orange and charcoal, with stats, myths, webinars, hiring and bold type.',
  category: 'social-posts',
  tags: ['corporate', 'b2b', 'linkedin', 'story', 'photo'],
  theme: 'light',

  designs: [
    ...POSTS,
    webinarSpeaker,
    MONDAY,
    everythingCtrl,
    startImpact,
    TUESDAY,
    stagesPost,
    stagesStory,
  ],
});
