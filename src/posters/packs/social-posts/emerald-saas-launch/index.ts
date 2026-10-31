import { definePack } from '../../../pack';
import { allInOne, EMERALD, hundredClients, SUNSET, saasBusiness, zeroConfusion } from './posts';
import {
  aiAutomations,
  clearDecision,
  getInformed,
  newFeature,
  threeSteps,
  usersChoose,
} from './posts-more';

export const emeraldSaasLaunchPack = definePack({
  id: 'emerald-saas-launch',
  title: 'Emerald SaaS Posts',
  description:
    'Glassy emerald posts for SaaS and AI startups: features, stats, steps and product updates.',
  category: 'social-posts',
  tags: ['saas', 'ai', 'instagram', 'linkedin', 'gradient'],
  theme: 'dark',

  designs: [
    ...[
      allInOne,
      zeroConfusion,
      saasBusiness,
      hundredClients,
      usersChoose,
      aiAutomations,
      newFeature,
      threeSteps,
      getInformed,
      clearDecision,
    ].map((build) => build(EMERALD)),
    getInformed(SUNSET),
    newFeature(SUNSET),
  ],
});
