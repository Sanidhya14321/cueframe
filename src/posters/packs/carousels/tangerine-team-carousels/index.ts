import type { Template } from '../../../kit';
import { definePack } from '../../../pack';
import {
  reviewCover,
  statHours,
  statLeads,
  statReplies,
  toneCover,
  toneReader,
  toneValues,
  toneWords,
} from './slides-review';
import {
  insightArjun,
  insightClara,
  insightsCover,
  insightTheo,
  lessonNextStep,
  lessonProof,
  lessonsCover,
  lessonTeach,
} from './slides-team';
import {
  archetypeBuilder,
  archetypeExplorer,
  archetypeStoryteller,
  archetypesCover,
  searchCover,
  tipIntent,
  tipSpeed,
  tipTrust,
} from './slides-voice';

const INSIGHTS: readonly Template[] = [insightsCover, insightArjun, insightClara, insightTheo];
const LESSONS: readonly Template[] = [lessonsCover, lessonProof, lessonTeach, lessonNextStep];
const ARCHETYPES: readonly Template[] = [
  archetypesCover,
  archetypeStoryteller,
  archetypeBuilder,
  archetypeExplorer,
];
const SEARCH: readonly Template[] = [searchCover, tipSpeed, tipIntent, tipTrust];
const TONE: readonly Template[] = [toneCover, toneValues, toneWords, toneReader];
const REVIEW: readonly Template[] = [reviewCover, statLeads, statReplies, statHours];

export const tangerineTeamCarouselsPack = definePack({
  id: 'tangerine-team-carousels',
  title: 'Tangerine Team Carousels',
  description:
    'Six forest green and tangerine carousels for B2B brands: team quotes, lessons, SEO tips, brand tone and yearly results.',
  category: 'carousels',
  tags: ['carousel', 'linkedin', 'b2b', 'quote', 'stats'],
  theme: 'dark',

  designs: [...INSIGHTS, ...LESSONS, ...ARCHETYPES, ...SEARCH, ...TONE, ...REVIEW],
});
