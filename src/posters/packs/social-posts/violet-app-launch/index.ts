import { definePack } from '../../../pack';
import { SUNSET } from './device';
import { addsUp, downloadApp, ideasHappen, workspace } from './posts';
import { ALERTS, futureHand, textAlerts } from './posts-alerts';
import { freshUpdate, growth, growthStory, trackTasks } from './posts-more';

export const violetAppLaunchPack = definePack({
  id: 'violet-app-launch',
  title: 'Violet App Launch',
  description:
    'Phone mockup posts and stories for a mobile app or tech startup launch in violet and coral.',
  category: 'social-posts',
  tags: ['saas', 'instagram', 'story', 'mockup', 'phone'],
  theme: 'light',

  designs: [
    addsUp,
    downloadApp,
    ideasHappen,
    workspace,
    trackTasks,
    freshUpdate,
    growth,
    ALERTS,
    futureHand,
    textAlerts(SUNSET),
    growthStory,
  ],
});
