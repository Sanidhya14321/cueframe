import { definePack } from '../../../pack';
import { figuresSlide, gaugeSlide, legacySlide, revenueSlide } from './slides-figures';
import { contentsSlide, coverSlide, empoweringSlide } from './slides-intro';
import { assistSlide, auditSlide } from './slides-metrics';
import { pricingSlide } from './slides-pricing';
import { conversionsSlide, numbersSlide, velocitySlide } from './slides-stats';
import { messagingSlide, quoteSlide } from './slides-story';

const INTRO = [
  coverSlide,
  contentsSlide,
  empoweringSlide,
  quoteSlide,
  messagingSlide,
  figuresSlide,
];
const METRICS = [
  auditSlide,
  assistSlide,
  legacySlide,
  velocitySlide,
  numbersSlide,
  conversionsSlide,
];

export const chartreuseAiEnterpriseDeckPack = definePack({
  id: 'chartreuse-ai-enterprise-deck',
  title: 'Chartreuse AI Deck',
  description:
    'A black and chartreuse enterprise AI pitch deck with glowing stats, pricing tiers, roadmaps and team slides.',
  category: 'pitch-decks',
  tags: ['pitch-deck', 'ai', 'saas', 'stats'],
  theme: 'dark',

  designs: [
    coverSlide,
    numbersSlide,
    pricingSlide,
    gaugeSlide,
    conversionsSlide,
    figuresSlide,
    velocitySlide,
    revenueSlide,
    empoweringSlide,
    quoteSlide,
    auditSlide,
    assistSlide,
    ...INTRO,
    ...METRICS,
    legacySlide,
  ],
});
