import type { Template } from '../../../kit';
import { definePack } from '../../../pack';
import {
  roadmapAudit,
  roadmapCover,
  roadmapScale,
  roadmapTeam,
  tipAgents,
  tipData,
  tipPrompts,
  waysCover,
} from './slides-blueprint';
import {
  automationCover,
  automationFramework,
  automationFriction,
  automationQuiet,
  smoothContext,
  smoothCover,
  smoothFeedback,
  smoothReview,
} from './slides-friction';
import {
  flowCover,
  flowFeedback,
  flowJourney,
  flowPrompts,
  impactAgents,
  impactCover,
  impactCurious,
  impactSystems,
} from './slides-impact';

const ROADMAP: readonly Template[] = [roadmapCover, roadmapAudit, roadmapTeam, roadmapScale];
const WAYS: readonly Template[] = [waysCover, tipAgents, tipPrompts, tipData];
const IMPACT: readonly Template[] = [impactCover, impactSystems, impactCurious, impactAgents];
const FLOW: readonly Template[] = [flowCover, flowJourney, flowPrompts, flowFeedback];
const AUTOMATION: readonly Template[] = [
  automationCover,
  automationFriction,
  automationFramework,
  automationQuiet,
];
const SMOOTH: readonly Template[] = [smoothCover, smoothFeedback, smoothContext, smoothReview];

export const neonAiCarouselsPack = definePack({
  id: 'neon-ai-carousels',
  title: 'Neon AI Carousels',
  description:
    'Six midnight and neon pink carousels about AI workflows, agents and automation for tech and SaaS brands.',
  category: 'carousels',
  tags: ['carousel', 'ai', 'saas', 'linkedin', 'tips'],
  theme: 'dark',

  designs: [...ROADMAP, ...WAYS, ...IMPACT, ...FLOW, ...AUTOMATION, ...SMOOTH],
});
