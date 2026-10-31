import { definePack } from '../../../pack';
import { accelerationSlide, growthSlide, servicesSlide, worldwideSlide } from './slides-data';
import { pricingSlide, roadmapSlide, standardSlide, timelineSlide } from './slides-plan';
import {
  adoptionSlide,
  contentsSlide,
  coverSlide,
  empoweringSlide,
  potentialSlide,
  teamSlide,
} from './slides-story';

const INTRO = [
  coverSlide,
  contentsSlide,
  empoweringSlide,
  adoptionSlide,
  potentialSlide,
  teamSlide,
];
const DATA = [
  worldwideSlide,
  growthSlide,
  accelerationSlide,
  servicesSlide,
  standardSlide,
  timelineSlide,
];

export const tealGlowSaasDeckPack = definePack({
  id: 'teal-glow-saas-deck',
  title: 'Teal Glow SaaS Deck',
  description:
    'A black and teal glow investor deck for SaaS and AI platforms with roadmap, pricing, team and growth slides.',
  category: 'pitch-decks',
  tags: ['pitch-deck', 'saas', 'ai', 'stats'],
  theme: 'dark',

  designs: [
    coverSlide,
    servicesSlide,
    growthSlide,
    roadmapSlide,
    teamSlide,
    empoweringSlide,
    pricingSlide,
    adoptionSlide,
    standardSlide,
    worldwideSlide,
    accelerationSlide,
    timelineSlide,
    potentialSlide,
    contentsSlide,
    ...INTRO,
    ...DATA,
  ],
});
