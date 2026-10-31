import { definePack } from '../../../pack';
import { clockPost, sevenHundred, spotlightPost, spotlightStory, whatYouNeed } from './posts';
import { calendarGrid, milestones, seventyPercent } from './posts-extra';
import {
  AMBER_INTERACT,
  decisionSteps,
  departmentsPie,
  hiring,
  INTERACT_POST,
  interact,
} from './posts-more';

const POSTS = [
  sevenHundred,
  whatYouNeed,
  clockPost,
  spotlightPost,
  INTERACT_POST,
  departmentsPie,
  decisionSteps,
  hiring,
  milestones,
  calendarGrid,
  seventyPercent,
];

export const crimsonCorporateEdgePack = definePack({
  id: 'crimson-corporate-edge',
  title: 'Crimson Corporate Edge',
  description:
    'Corporate business posts and stories in crimson and blush with mono photos, stats, hiring, planning and team spotlights.',
  category: 'social-posts',
  tags: ['corporate', 'b2b', 'linkedin', 'story', 'stats'],
  theme: 'dark',

  designs: [
    ...POSTS,
    whatYouNeed,
    clockPost,
    decisionSteps,
    sevenHundred,
    INTERACT_POST,
    interact(AMBER_INTERACT, ['Learn how to', 'Connect', 'with every client']),
    spotlightPost,
    spotlightStory,
  ],
});
