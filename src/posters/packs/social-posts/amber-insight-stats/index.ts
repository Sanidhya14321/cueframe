import { definePack } from '../../../pack';
import { AMBER, growProfit, leadersChart, resultsList, SKY } from './posts';
import { aiUseCases, wasteHours } from './posts-more';

const RESULTS = resultsList(AMBER);
const CHART = leadersChart(AMBER);
const PROFIT = growProfit(AMBER);
const HOURS = wasteHours(AMBER);
const BUBBLES = aiUseCases(AMBER);

export const amberInsightStatsPack = definePack({
  id: 'amber-insight-stats',
  title: 'Amber Insight Stats',
  description:
    'Key statistic and results posts for freelancers in amber and deep indigo, with charts, bubbles and matching stories.',
  category: 'social-posts',
  tags: ['stats', 'freelance', 'instagram', 'story'],
  theme: 'dark',

  designs: [CHART, HOURS, RESULTS, BUBBLES, PROFIT, resultsList(SKY), leadersChart(SKY)],
});
