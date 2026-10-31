import { definePack } from '../../../pack';
import { type StatsCopy, statTemplates } from './posts';
import type { PostTheme } from './theme';

const LAGOON: PostTheme = {
  background: '#0f7f77',
  backgroundEnd: '#04201f',
  surface: '#ffffff',
  ink: '#0b1f1e',
  text: '#ffffff',
  muted: '#a9d6d1',
  brand: '#c6f432',
  brandText: '#0b1f1e',
  deep: '#062e2b',
  star: '#ffffff',
  headFont: 'Urbanist',
  bodyFont: 'DM Sans',
};

const PEACH: PostTheme = {
  surface: LAGOON.surface,
  headFont: LAGOON.headFont,
  bodyFont: LAGOON.bodyFont,
  background: '#ffe2d4',
  ink: '#3b1206',
  text: '#3b1206',
  muted: '#8a4b3a',
  brand: '#ff5a36',
  brandText: '#ffffff',
  deep: '#ff5a36',
  star: '#ffffff',
};

const COPY: StatsCopy = {
  useCases: {
    title: 'Automation wins that\nlift SaaS revenue',
    subtitle: 'Where product teams put AI to work\nthis quarter. Where do you stand?',
    main: ['64%', 'Support replies'],
    second: ['47%', 'Code review'],
    star: '58%',
    small: '21%',
    notes: ['Lead scoring\nand outreach', 'Reporting and data cleanup'],
  },
  leaders: {
    kicker: 'Product growth report',
    title: 'Where CTOs are\ninvesting this year',
    points: [
      ['48%', 'Cloud cost\ncontrol'],
      ['69%', 'Customer\nonboarding'],
      ['88%', 'AI copilots\nin product'],
    ],
    footer: 'Need a roadmap like this? Send us a message.',
  },
  profit: {
    title: 'Scale Your\nMRR With Us',
    value: '94%',
    body: 'Our retention playbook helps subscription teams cut churn and turn trial users into loyal, paying customers.',
  },
  bars: {
    value: '71%',
    title: 'of SaaS teams lose 15+ hours\na week to manual reporting',
    source: 'Cloud Operations Survey 2026. Automate the busywork.',
  },
  results: {
    kicker: 'Quarterly results',
    title: 'What our clients saw\nafter ninety days',
    items: ['Trial signups grew\nby 38%', 'Churn dropped\nby 12%', 'Onboarding time\ncut in half'],
  },
};

const MAIN = statTemplates(LAGOON, COPY);
const ALT = statTemplates(PEACH, COPY);

export const lagoonSaasStatsPack = definePack({
  id: 'lagoon-saas-stats',
  title: 'Lagoon SaaS Stats',
  description:
    'Key statistic, trend line, result card and growth posts for SaaS teams in deep teal and lime, with a matching story.',
  category: 'social-posts',
  tags: ['stats', 'saas', 'instagram', 'story'],
  theme: 'dark',

  designs: [
    MAIN.results,
    MAIN.bars,
    MAIN.leaders,
    MAIN.useCases,
    MAIN.profit,
    MAIN.story,
    ALT.useCases,
    ALT.results,
  ],
});
