import { definePack } from '../../../pack';
import { aiUsage, leadersChart } from './charts';
import { growProfit, growStory } from './growth';
import { bigStat, resultsNotes } from './posts';
import { CORAL, MIDNIGHT, VIOLET } from './shared';

const notes = resultsNotes(VIOLET);
const stat = bigStat(VIOLET);
const cases = aiUsage(VIOLET);
const chart = leadersChart(VIOLET);
const grow = growProfit(VIOLET);

export const violetPulseStatsPack = definePack({
  id: 'violet-pulse-stats',
  title: 'Violet Pulse Stats',
  description:
    'Key statistic, bar chart, trend line and growth posts in violet and lime, with a matching story.',
  category: 'social-posts',
  tags: ['stats', 'linkedin', 'ai', 'story'],
  theme: 'dark',

  designs: [
    notes,
    stat,
    cases,
    chart,
    grow,
    growStory(VIOLET),
    leadersChart(CORAL),
    aiUsage(MIDNIGHT),
  ],
});
