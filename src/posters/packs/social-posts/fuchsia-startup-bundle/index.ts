import { definePack } from '../../../pack';
import { dosDonts, type ShiftTheme } from '../cobalt-before-after/posts';
import { transformHook } from '../cobalt-before-after/posts-more';
import { type StatsCopy, statTemplates } from '../lagoon-saas-stats/posts';
import type { PostTheme } from '../lagoon-saas-stats/theme';
import { type EventTheme, monthCalendar } from '../violet-key-dates/posts';
import { type AgendaCopy, agenda } from '../violet-key-dates/posts-more';
import { benefitsDonut, clearProcess, hiringVertical } from './posts';
import { employeeBadge, expertsFolder } from './posts-team';

const FUCHSIA: PostTheme = {
  background: '#b0249f',
  backgroundEnd: '#1a0420',
  surface: '#ffffff',
  ink: '#1a0420',
  text: '#ffffff',
  muted: '#f0c4f5',
  brand: '#22d3ee',
  brandText: '#1a0420',
  deep: '#2c0833',
  star: '#ffffff',
  headFont: 'Plus Jakarta Sans',
  bodyFont: 'DM Sans',
};

const OCEAN: PostTheme = {
  ...FUCHSIA,
  background: '#0284c7',
  backgroundEnd: '#062033',
  ink: '#062033',
  muted: '#bfe3f7',
  brand: '#facc15',
  brandText: '#062033',
  deep: '#07304a',
};

const EVENT: EventTheme = {
  main: '#a21caf',
  dark: '#1a0420',
  paper: '#ffffff',
  ink: '#1a0420',
  onMain: '#ffffff',
  pop: '#22d3ee',
  star: '#ffffff',
  headFont: 'Plus Jakarta Sans',
  bodyFont: 'DM Sans',
};

const EVENT_OCEAN: EventTheme = {
  ...EVENT,
  main: '#0284c7',
  dark: '#062033',
  ink: '#062033',
  pop: '#facc15',
};

const SHIFT: ShiftTheme = {
  brand: '#c026d3',
  panel: '#2c0833',
  dark: '#12030f',
  paper: '#ffffff',
  ink: '#12030f',
  onBrand: '#ffffff',
  pop: '#22d3ee',
  star: '#ffffff',
  headFont: 'Plus Jakarta Sans',
  bodyFont: 'DM Sans',
};

const STATS: StatsCopy = {
  useCases: {
    title: 'Where startups use\nAI every single day',
    subtitle: 'A snapshot of early stage teams.\nHow does yours compare?',
    main: ['66%', 'Sales outreach'],
    second: ['52%', 'QA testing'],
    star: '59%',
    small: '23%',
    notes: ['Hiring and\nscreening', 'Finance and admin'],
  },
  leaders: {
    kicker: 'Startup pulse',
    title: 'Where Founders are\nbetting this year',
    points: [
      ['46%', 'Partner\nchannels'],
      ['70%', 'Product led\ngrowth'],
      ['86%', 'AI first\nfeatures'],
    ],
    footer: 'Planning your next move? Send us a message.',
  },
  profit: {
    title: 'Grow Your\nARR With Us',
    value: '91%',
    body: 'A tested launch system that helps young SaaS teams land their first thousand paying users.',
  },
  bars: {
    value: '68%',
    title: 'of founders lose 12+ hours\na week to busywork',
    source: 'Startup Ops Pulse 2026. Automate the routine.',
  },
  results: {
    kicker: 'Launch results',
    title: 'What happened after\nour first sprint',
    items: [
      'Demo requests up\nby 42%',
      'Sales cycle shorter\nby 9 days',
      'Support tickets\ndown by 30%',
    ],
  },
};

const AGENDA: AgendaCopy = {
  month: 'SEP',
  rows: [
    { day: '04', title: 'Founder AMA', body: 'Bring your hardest growth\nquestions to our team.' },
    { day: '11', title: 'Product Poll', body: 'Vote on the feature we\nship next quarter.' },
    { day: '18', title: 'Live Demo Day', body: 'Watch the new dashboard\nin action, live.' },
    { day: '25', title: 'Beta Launch', body: 'Early access for our most\nloyal users.' },
  ],
};

const MONTH = {
  kicker: 'Upcoming',
  title: 'September Events',
  days: [
    { day: '02', weekday: 'Tuesday', dark: true, sticker: 'Kickoff\nWebinar' },
    { day: '04', weekday: 'Thursday', dark: false },
    { day: '09', weekday: 'Tuesday', dark: true },
    { day: '11', weekday: 'Thursday', dark: false },
    { day: '16', weekday: 'Tuesday', dark: true, sticker: 'Product\nHunt Day' },
    { day: '18', weekday: 'Thursday', dark: true },
    { day: '23', weekday: 'Tuesday', dark: true, sticker: 'Demo Day' },
    { day: '25', weekday: 'Thursday', dark: false },
    { day: '30', weekday: 'Tuesday', dark: true },
  ],
};

const STAT = statTemplates(FUCHSIA, STATS);
const BENEFITS = benefitsDonut(FUCHSIA);
const HIRING = hiringVertical(FUCHSIA);
const PROCESS = clearProcess(FUCHSIA);
const EXPERTS = expertsFolder(FUCHSIA);
const BADGE = employeeBadge(FUCHSIA);
const CALENDAR = monthCalendar(EVENT, MONTH);
const AGENDA_POST = agenda(EVENT, AGENDA);
const DOS = dosDonts(SHIFT, {
  kicker: 'What you\nshould',
  title: "Do's and Don'ts",
  dos: [
    'Ship small updates\noften',
    'Show real product\nscreens',
    'Answer every\nreply fast',
    'Share customer\nwins',
    'Measure what\nmatters',
  ],
  donts: [
    'Hide your pricing\npage',
    'Post vague feature\nteasers',
    'Ignore churn\nfeedback',
    'Buy fake\nreviews',
    'Chase every\nshiny trend',
  ],
});
const HOOK = transformHook(SHIFT, {
  lines: ['Most launches stall', 'after week one, and few'],
  punch: 'founders know why.',
  body: 'Check the first comment for the three\nmistakes we see every week.',
});

export const fuchsiaStartupBundlePack = definePack({
  id: 'fuchsia-startup-bundle',
  title: 'Fuchsia Startup Bundle',
  description:
    'A big SaaS and startup post bundle with stats, events, hiring, tips and team spotlights in fuchsia and aqua.',
  category: 'social-posts',
  tags: ['saas', 'instagram', 'linkedin', 'hiring', 'stats'],
  theme: 'dark',

  designs: [
    STAT.leaders,
    BENEFITS,
    HIRING,
    CALENDAR,
    PROCESS,
    STAT.profit,
    DOS,
    EXPERTS,
    HOOK,
    BADGE,
    AGENDA_POST,
    STAT.useCases,
    agenda(EVENT_OCEAN, AGENDA),
    employeeBadge(OCEAN),
  ],
});
