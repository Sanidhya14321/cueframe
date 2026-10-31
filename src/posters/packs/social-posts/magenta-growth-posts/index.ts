import { definePack } from '../../../pack';
import { brandTrust, closeTo, EMERALD, gotMail, MAGENTA, moreEyes, tearOffNote } from './posts';
import { dontCheck, reviewWall, stopCreating, toggleBoost, unscramble } from './posts-more';

const EYES = moreEyes(MAGENTA);
const TRUST = brandTrust(MAGENTA);
const NOTE = tearOffNote(MAGENTA);
const MAIL = gotMail(MAGENTA);
const CLOSE = closeTo(MAGENTA);
const SCRAMBLE = unscramble(MAGENTA);
const TOGGLES = toggleBoost(MAGENTA);
const COMMENTS = dontCheck(MAGENTA);
const REVIEW = reviewWall(MAGENTA);
const STOP = stopCreating(MAGENTA);

export const magentaGrowthPostsPack = definePack({
  id: 'magenta-growth-posts',
  title: 'Magenta Growth Posts',
  description:
    'Engagement-driving small business posts in magenta, ink and cream, from quizzes and reviews to newsletter calls.',
  category: 'social-posts',
  tags: ['small-business', 'instagram', 'linkedin', 'story'],
  theme: 'dark',

  designs: [
    MAIL,
    TRUST,
    EYES,
    NOTE,
    COMMENTS,
    STOP,
    SCRAMBLE,
    TOGGLES,
    CLOSE,
    REVIEW,
    toggleBoost(EMERALD),
    reviewWall(EMERALD),
  ],
});
