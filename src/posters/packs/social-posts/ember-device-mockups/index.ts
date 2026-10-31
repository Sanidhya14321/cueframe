import { definePack } from '../../../pack';
import { assistLaunch, monthlyPlan, performBetter, showcase, smartKit } from './posts';
import {
  bigRelease,
  everyDevice,
  newPage,
  newPageStory,
  newStore,
  upgradeFlow,
} from './posts-more';

const POSTS = [
  performBetter,
  showcase,
  smartKit,
  assistLaunch,
  newPage,
  upgradeFlow,
  monthlyPlan,
  bigRelease,
  everyDevice,
];

export const emberDeviceMockupsPack = definePack({
  id: 'ember-device-mockups',
  title: 'Ember Device Mockups',
  description:
    'Laptop, tablet, phone and monitor mockup posts for SaaS launches and digital products in black and ember orange.',
  category: 'social-posts',
  tags: ['mockup', 'saas', 'product', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    ...POSTS,
    performBetter,
    assistLaunch,
    showcase,
    smartKit,
    bigRelease,
    monthlyPlan,
    upgradeFlow,
    everyDevice,
    newPage,
    newStore,
    newPageStory,
  ],
});
