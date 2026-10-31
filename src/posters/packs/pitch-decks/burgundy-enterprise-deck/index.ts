import { definePack } from '../../../pack';
import { coreFocusSlide } from './slides-focus';
import { growthSlide } from './slides-growth';
import { contentsSlide, coverSlide, empoweringSlide, welcomeSlide } from './slides-intro';
import { benchmarksSlide, feedbackSlide } from './slides-market';
import { ecosystemSlide, performanceSlide, quoteSlide, spotlightSlide } from './slides-proof';
import { quarterlySlide, worldMarketSlide } from './slides-world';

const INTRO = [
  coverSlide,
  contentsSlide,
  welcomeSlide,
  empoweringSlide,
  coreFocusSlide,
  performanceSlide,
];
const PROOF = [
  spotlightSlide,
  ecosystemSlide,
  quoteSlide,
  growthSlide,
  benchmarksSlide,
  feedbackSlide,
];

export const burgundyEnterpriseDeckPack = definePack({
  id: 'burgundy-enterprise-deck',
  title: 'Burgundy Enterprise Deck',
  description:
    'A wine and rose glass-style SaaS pitch deck with orbit cover, benchmarks, market globe, growth charts and quarterly plans.',
  category: 'pitch-decks',
  tags: ['pitch-deck', 'saas', 'corporate', 'stats'],
  theme: 'dark',

  designs: [
    coverSlide,
    empoweringSlide,
    spotlightSlide,
    welcomeSlide,
    performanceSlide,
    quarterlySlide,
    ecosystemSlide,
    worldMarketSlide,
    benchmarksSlide,
    contentsSlide,
    coreFocusSlide,
    growthSlide,
    ...INTRO,
    ...PROOF,
  ],
});
