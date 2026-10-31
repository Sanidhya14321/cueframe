import { definePack } from '../../../pack';
import { accelerationSlide, ecosystemSlide, legacySlide, quadrantSlide } from './slides-data';
import {
  contentsSlide,
  coverSlide,
  empoweringSlide,
  quoteSlide,
  welcomeSlide,
} from './slides-intro';
import { collaborationSlide, teamSlide } from './slides-people';
import { architectureSlide, quarterlySlide } from './slides-roadmap';
import { performanceSlide, worldwideSlide } from './slides-world';

const INTRO = [coverSlide, contentsSlide, welcomeSlide, quoteSlide, empoweringSlide, teamSlide];
const DATA = [
  ecosystemSlide,
  legacySlide,
  accelerationSlide,
  quadrantSlide,
  quarterlySlide,
  architectureSlide,
];
const EXTRA = [performanceSlide, collaborationSlide, worldwideSlide];

export const evergreenAiSaasDeckPack = definePack({
  id: 'evergreen-ai-saas-deck',
  title: 'Evergreen AI SaaS Deck',
  description:
    'A forest and mint enterprise pitch deck for AI and SaaS platforms with roadmap, market, team and architecture slides.',
  category: 'pitch-decks',
  tags: ['pitch-deck', 'ai', 'saas', 'corporate'],
  theme: 'light',

  designs: [
    quoteSlide,
    architectureSlide,
    empoweringSlide,
    legacySlide,
    welcomeSlide,
    ecosystemSlide,
    accelerationSlide,
    worldwideSlide,
    collaborationSlide,
    performanceSlide,
    teamSlide,
    quarterlySlide,
    quadrantSlide,
    ...INTRO,
    ...DATA,
    ...EXTRA,
  ],
});
