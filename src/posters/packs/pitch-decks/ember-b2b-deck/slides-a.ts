import type { DesignIconName } from '@/design';
import { circle, icon, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  background,
  body,
  EMBER,
  HEADING_FONT,
  heading,
  iconBadge,
  person,
  SH,
  SW,
  strong,
  tag,
} from './deck-kit';

const E = EMBER;

const coverSpec = {
  colors: {
    background: { value: E.accent, hint: 'Page' },
    text: { value: E.ink, hint: 'Website, the big arrow and the Pitch Deck title' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    website: { label: 'Website', value: 'studioember.co' },
    title: { label: 'Title', value: 'Pitch Deck' },
  },
} as const satisfies ThemeSpec;

export const coverSlide = themed(SW, SH, coverSpec, (t) => [
  background(t.color('background')),
  text(t.copy('website'), 100, 90, 600, {
    fontFamily: t.font('body'),
    fontSize: 28,
    fontWeight: 600,
    fill: t.color('text'),
  }),
  icon('arrow-up-right', 1520, 60, 320, t.color('text'), { strokeWidth: 2.8 }),
  heading(t.font('heading'))(t.copy('title'), 90, 630, 330, t.color('text')),
]);

const contentsSpec = {
  colors: {
    background: { value: E.ink, hint: 'Page' },
    text: {
      value: E.paper,
      hint: 'Contents title, phone and email with their icons, and the chapter names',
    },
    accent: {
      value: E.accent,
      hint: 'Full stop, Contact Us label, chapter numbers and the highlighted first chapter',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Contents' },
    contact: { label: 'Contact label', value: 'CONTACT US' },
    phone: { label: 'Phone', value: '(555) 730-1180' },
    email: { label: 'Email', value: 'hello@studioember.co' },
    numbers: { label: 'Chapter number', value: ['01', '02', '03', '04', '05', '06'] },
    chapters: {
      label: 'Chapter',
      value: ['Overview', 'Services', 'Revenue', 'Projects', 'Business', 'Roadmap'],
    },
  },
} as const satisfies ThemeSpec;

export const contentsSlide = themed(SW, SH, contentsSpec, (t) => {
  const head = heading(t.font('heading'));
  const copy = body(t.font('body'));
  const numbers = t.list('numbers');
  return [
    background(t.color('background')),
    head(t.copy('title'), 100, 100, 140, t.color('text')),
    rect(614, 214, 30, 30, t.color('accent'), { name: 'Full stop' }),
    strong(t.font('body'))(t.copy('contact'), 100, 760, 500, 26, t.color('accent')),
    icon('phone', 100, 820, 34, t.color('text')),
    copy(t.copy('phone'), 150, 818, 500, 28, t.color('text')),
    icon('mail', 100, 880, 34, t.color('text')),
    copy(t.copy('email'), 150, 878, 500, 28, t.color('text')),
    t
      .list('chapters')
      .map((chapter, index) => [
        head(numbers[index] ?? '', 1100, 110 + index * 140, 96, t.color('accent'), 200),
        head(
          chapter,
          1260,
          110 + index * 140,
          96,
          index === 0 ? t.color('accent') : t.color('text'),
          600,
        ),
      ]),
  ];
});

const OFFER_ICONS: readonly DesignIconName[] = ['gem', 'monitor', 'globe'];

const offeringsSpec = {
  colors: {
    background: { value: E.paper, hint: 'Page' },
    accent: { value: E.accent, hint: 'Featured Branding card' },
    text: {
      value: E.ink,
      hint: 'Title, icons, service names and the featured description; its lighter shade colors the other descriptions',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Core Offerings' },
    services: { label: 'Service', value: ['Branding', 'Presentation', 'Website'] },
    descriptions: {
      label: 'Description',
      value: [
        'Complete visual identities that put your company at the top of the shortlist.',
        'Executive storytelling that turns bullet points into confident decisions.',
        'Fast, focused sites built to show your best work and convert visitors.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const offeringsSlide = themed(SW, SH, offeringsSpec, (t) => {
  const head = heading(t.font('heading'));
  const descriptions = t.list('descriptions');
  return [
    background(t.color('background')),
    head(t.copy('title'), 100, 90, 120, t.color('text')),
    t.list('services').map((service, index) => {
      const x = 100 + index * 580;
      const featured = index === 0;
      return [
        featured
          ? rect(x, 300, 540, 660, t.color('accent'), { cornerRadius: 32, name: 'Feature card' })
          : [],
        icon(OFFER_ICONS[index] ?? 'gem', x + 50, 350, 100, t.color('text'), { strokeWidth: 1.8 }),
        head(service, x + 50, 500, 64, t.color('text'), 460),
        body(t.font('body'))(
          descriptions[index] ?? '',
          x + 50,
          600,
          440,
          30,
          featured ? t.color('text') : t.shade('text', E.grey),
        ),
      ];
    }),
  ];
});

const marketSpec = {
  colors: {
    background: { value: E.ink, hint: 'Page, and the numbers and labels on both stat cards' },
    text: {
      value: E.paper,
      hint: 'Title and the second stat card; its dimmer shade colors the paragraph',
    },
    accent: { value: E.accent, hint: 'First stat card and the big lightbulb' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Market\nOpportunity' },
    paragraph: {
      label: 'Paragraph',
      value:
        'Forecasts point to steady, compounding growth. Every new dollar of revenue costs less to acquire than the one before it.',
    },
    stats: { label: 'Stat', value: ['56.2K', '95.5K'] },
    labels: { label: 'Stat label', value: ['Hours saved', 'Tasks automated'] },
  },
} as const satisfies ThemeSpec;

export const marketSlide = themed(SW, SH, marketSpec, (t) => {
  const head = heading(t.font('heading'));
  const label = strong(t.font('body'));
  const labels = t.list('labels');
  const cards = [t.color('accent'), t.color('text')];
  return [
    background(t.color('background')),
    head(t.copy('title'), 100, 100, 130, t.color('text')),
    body(t.font('body'))(t.copy('paragraph'), 100, 400, 760, 30, t.shade('text', E.mist)),
    t.list('stats').map((stat, index) => {
      const x = 100 + index * 350;
      return [
        rect(x, 700, 320, 200, cards[index] ?? '', { cornerRadius: 24, name: 'Stat' }),
        head(stat, x + 30, 720, 100, t.color('background'), 280),
        label(labels[index] ?? '', x + 30, 840, 280, 24, t.color('background')),
      ];
    }),
    icon('lightbulb', 1060, 120, 820, t.color('accent'), { strokeWidth: 2.2 }),
  ];
});

const realWorldSpec = {
  colors: {
    background: { value: E.paper, hint: 'Page, the Impact tag text and the quote' },
    text: {
      value: E.ink,
      hint: 'Title, both paragraphs, the Impact tag, the quote card and the text on the orange tags',
    },
    accent: { value: E.accent, hint: 'Solution tag and the speaker tag' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Real-World\nApplication' },
    solutionTag: { label: 'Solution tag', value: 'Solution' },
    solution: {
      label: 'Solution',
      value: 'Automate reporting and asset handoffs so approvals stop stalling launches.',
    },
    impactTag: { label: 'Impact tag', value: 'Impact' },
    impact: {
      label: 'Impact',
      value: 'Kickoff time fell from 14 days to 3, and pipeline conversion climbed by 22%.',
    },
    speaker: { label: 'Speaker', value: 'Lena, VP Growth' },
    quote: {
      label: 'Quote',
      value: 'Spends 15+ hours a week on manual reports, slowing every launch.',
    },
  },
} as const satisfies ThemeSpec;

export const realWorldSlide = themed(SW, SH, realWorldSpec, (t) => {
  const copy = body(t.font('body'));
  const bodyFont = t.font('body');
  return [
    background(t.color('background')),
    heading(t.font('heading'))(t.copy('title'), 100, 100, 130, t.color('text')),
    tag(t.copy('solutionTag'), 100, 430, t.color('accent'), t.color('text'), bodyFont),
    copy(t.copy('solution'), 100, 510, 900, 32, t.color('text')),
    tag(t.copy('impactTag'), 100, 680, t.color('text'), t.color('background'), bodyFont),
    copy(t.copy('impact'), 100, 760, 900, 32, t.color('text')),
    rect(1180, 110, 640, 860, t.color('text'), { cornerRadius: 36, name: 'Quote card' }),
    tag(t.copy('speaker'), 1230, 170, t.color('accent'), t.color('text'), bodyFont),
    text(t.copy('quote'), 1230, 320, 540, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 400,
      fill: t.color('background'),
      lineHeight: 1.1,
      uppercase: true,
    }),
  ];
});

const accountsSpec = {
  colors: {
    background: { value: E.ink, hint: 'Page and the trend arrow' },
    text: { value: E.paper, hint: 'Legend and 250K; its dimmer shade colors the caption' },
    accent: { value: E.accent, hint: 'Engaged dot, the top row of people and the trend badge' },
    secondary: {
      value: E.grey,
      hint: 'In nurture dot; its darker shade colors the other rows of people',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    legend: { label: 'Legend', value: ['Engaged (58.3%)', 'In nurture (41.7%)'] },
    stat: { label: 'Stat', value: '250K' },
    caption: { label: 'Caption', value: 'Accounts opened this year' },
  },
} as const satisfies ThemeSpec;

export const accountsSlide = themed(SW, SH, accountsSpec, (t) => {
  const copy = body(t.font('body'));
  const dots = [t.color('accent'), t.color('secondary')];
  return [
    background(t.color('background')),
    t
      .list('legend')
      .map((entry, index) => [
        circle(115, 120 + index * 60, 15, dots[index] ?? ''),
        copy(entry, 145, 100 + index * 60, 500, 28, t.color('text')),
      ]),
    heading(t.font('heading'))(t.copy('stat'), 100, 520, 280, t.color('text'), 900),
    copy(t.copy('caption'), 100, 860, 800, 36, t.shade('text', E.mist)),
    [0, 1, 2].map((row) =>
      [0, 1, 2, 3, 4].map((column) =>
        person(
          1000 + column * 175,
          120 + row * 320,
          160,
          row === 0 ? t.color('accent') : t.shade('secondary', E.dim),
        ),
      ),
    ),
    iconBadge('trending-up', 640, 610, 110, t.color('accent'), t.color('background')),
  ];
});
