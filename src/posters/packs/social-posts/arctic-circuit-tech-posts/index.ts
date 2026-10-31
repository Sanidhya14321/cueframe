import { definePack } from '../../../pack';
import { planBuildShip, riseOfAutopilot, topThree } from './posts';
import { precisionTracking } from './posts-mid';
import {
  breakthroughPost,
  breakthroughStory,
  busyworkAmber,
  busyworkCyan,
  POSTS,
} from './posts-more';

export const arcticCircuitTechPostsPack = definePack({
  id: 'arctic-circuit-tech-posts',
  title: 'Arctic Circuit Tech Posts',
  description:
    'Dark enterprise tech social posts and stories with glowing cyan tiles, myth busters, quotes and launch graphics.',
  category: 'social-posts',
  tags: ['ai', 'saas', 'b2b', 'instagram', 'neon'],
  theme: 'dark',

  designs: [
    ...POSTS,
    planBuildShip,
    riseOfAutopilot,
    topThree,
    precisionTracking,
    busyworkCyan,
    busyworkAmber,
    breakthroughPost,
    breakthroughStory,
  ],
});
