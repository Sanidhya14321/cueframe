import type { DesignIconName } from '@/design';
import {
  circle,
  icon,
  rect,
  rotateNodes,
  shadow,
  type Template,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  aiAnalytics,
  BODY,
  BRAND,
  base,
  brandMark,
  globalCoverage,
  H,
  HEADING,
  LIME,
  page,
  quoteCard,
  type SaasPalette,
  tagCopy,
  W,
} from './posts';
import { buildLeads, clientsCount, feedbackWall } from './posts-proof';

const TRUST_ICONS: readonly DesignIconName[] = ['layout-grid', 'zap', 'sparkles'];
const TRUST_TAG = 'Product demo';

const trustSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, and the row icons'),
      surface: { value: p.card, hint: 'Reason rows' },
      primary: { value: p.accent, hint: 'Vectra Labs? and its glow, and the icon tiles' },
      text: {
        value: p.paper,
        hint: 'Section tag, Why teams trust and the reasons; its faded shade colors the row edges and its softer shade the tag outline, rule, footer and brand',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(TRUST_TAG),
      headline: { label: 'Headline', value: 'Why teams trust' },
      title: { label: 'Highlighted line', value: 'Vectra Labs?' },
      reasons: {
        label: 'Reason',
        value: [
          'Launch faster with\nready-made flows',
          'No code needed to\nget started',
          'Clean, polished\nresults instantly',
        ],
      },
      footer: { label: 'Footer', value: 'Trusted by 1,200+ product teams' },
      brand: BRAND,
    },
  }) as const satisfies ThemeSpec;

const whyTeamsTrust = (p: SaasPalette) =>
  themed(W, H, trustSpec(p), (t) => [
    base(t, p, TRUST_TAG),
    text(t.copy('headline'), 0, 220, W, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('title'), 0, 310, W, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
      ...shadow(26, 0, t.color('primary')),
    }),
    t.list('reasons').map((reason, index) => {
      const y = 480 + index * 200;
      return [
        rect(110, y, 860, 170, t.color('surface'), {
          cornerRadius: 22,
          stroke: t.shade('text', 'rgba(255,255,255,0.1)'),
          strokeWidth: 2,
          name: 'Trust row',
        }),
        rect(140, y + 30, 110, 110, t.color('primary'), { cornerRadius: 20, name: 'Icon tile' }),
        icon(TRUST_ICONS[index] ?? 'sparkles', 165, y + 55, 60, t.shade('background', p.onAccent), {
          strokeWidth: 2.2,
        }),
        text(reason, 290, y + 40, 640, {
          fontFamily: t.font('body'),
          fontSize: 36,
          fontWeight: 600,
          fill: t.color('text'),
          lineHeight: 1.2,
        }),
      ];
    }),
    text(t.copy('footer'), 0, 1130, W, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.shade('text', p.soft),
      align: 'center',
    }),
    brandMark(t.copy('brand'), 800, 1260, t.shade('text', p.soft), t.font('heading')),
  ]);

const TIME_TAG = 'Behind the brand';

const timeSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, and the Time waits label'),
      surface: { value: p.card, hint: 'Clock face' },
      primary: { value: p.accent, hint: 'Time waits tag, hour hand and clock pin' },
      text: {
        value: p.paper,
        hint: 'Section tag, For No One and its glow, the clock rim, ticks and minute hand; its softer shade colors the tag outline, rule and subtitle',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(TIME_TAG),
      label: { label: 'Tag label', value: 'Time waits' },
      title: { label: 'Title', value: 'For No One' },
      subtitle: { label: 'Subtitle', value: 'Post when it matters' },
    },
  }) as const satisfies ThemeSpec;

const timeWaits = (p: SaasPalette) =>
  themed(W, H, timeSpec(p), (t) => [
    base(t, p, TIME_TAG),
    rotateNodes(-8, 450, 265, [
      rect(300, 230, 300, 70, t.color('primary'), { cornerRadius: 8, name: 'Time tag' }),
      text(t.copy('label'), 300, 242, 300, {
        fontFamily: t.font('heading'),
        fontSize: 40,
        fontWeight: 700,
        fill: t.shade('background', p.onAccent),
        align: 'center',
      }),
    ]),
    text(t.copy('title'), 0, 310, W, {
      fontFamily: t.font('heading'),
      fontSize: 116,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
      ...shadow(30, 0, t.shade('text', 'rgba(255,255,255,0.35)')),
    }),
    text(t.copy('subtitle'), 0, 460, W, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: t.shade('text', p.soft),
      align: 'center',
    }),
    circle(540, 950, 300, t.color('surface'), { stroke: t.color('text'), strokeWidth: 6 }),
    Array.from({ length: 12 }, (_, index) =>
      rotateNodes(index * 30, 540, 950, [
        rect(533, 670, 14, index % 3 === 0 ? 60 : 36, t.color('text'), {
          cornerRadius: 4,
          name: 'Tick',
        }),
      ]),
    ),
    rotateNodes(-55, 540, 950, [
      rect(532, 770, 16, 190, t.color('primary'), { cornerRadius: 8, name: 'Hour hand' }),
    ]),
    rotateNodes(40, 540, 950, [
      rect(535, 700, 10, 260, t.color('text'), { cornerRadius: 5, name: 'Minute hand' }),
    ]),
    circle(540, 950, 20, t.color('primary')),
  ]);

const EVENTS_TAG = 'Company news';

const eventsSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, and the calendar icon'),
      surface: { value: p.card, hint: 'Event cards' },
      primary: { value: p.accent, hint: 'Events, the event dates and the calendar card' },
      text: {
        value: p.paper,
        hint: 'Section tag, Upcoming and the event titles; its faded shade colors the card edges and its softer shade the tag outline, rule, event details and brand',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(EVENTS_TAG),
      headline: { label: 'Headline', value: 'Upcoming' },
      title: { label: 'Highlighted line', value: 'Events' },
      dates: { label: 'Event date', value: ['03/10', '10/08', '09/02'] },
      events: {
        label: 'Event',
        value: ['Product launch live', 'Q&A session', 'New growth guide'],
      },
      details: {
        label: 'Event detail',
        value: [
          'See every new feature in\naction with our founders.',
          'Bring your toughest\nquestions.',
          'How to boost content\nreach in 30 days.',
        ],
      },
      brand: BRAND,
    },
  }) as const satisfies ThemeSpec;

const EVENT_SLOTS = [
  { x: 80, y: 470, width: 600 },
  { x: 80, y: 800, width: 440 },
  { x: 560, y: 800, width: 440 },
] as const;

const eventCard = (t: Theme<ReturnType<typeof eventsSpec>>, p: SaasPalette, index: number) => {
  const { x, y, width } = EVENT_SLOTS[index] ?? EVENT_SLOTS[0];
  return [
    rect(x, y, width, 300, t.color('surface'), {
      cornerRadius: 22,
      stroke: t.shade('text', 'rgba(255,255,255,0.1)'),
      strokeWidth: 2,
      name: 'Event card',
    }),
    text(t.list('dates')[index] ?? '', x + 36, y + 34, width - 72, {
      fontFamily: t.font('heading'),
      fontSize: 40,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    text(t.list('events')[index] ?? '', x + 36, y + 96, width - 72, {
      fontFamily: t.font('heading'),
      fontSize: 38,
      fontWeight: 600,
      fill: t.color('text'),
      lineHeight: 1.15,
    }),
    text(t.list('details')[index] ?? '', x + 36, y + 200, width - 72, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 500,
      fill: t.shade('text', p.soft),
      lineHeight: 1.35,
    }),
  ];
};

const upcomingEvents = (p: SaasPalette) =>
  themed(W, H, eventsSpec(p), (t) => [
    base(t, p, EVENTS_TAG),
    text(t.copy('headline'), 80, 190, 900, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    text(t.copy('title'), 80, 295, 900, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    eventCard(t, p, 0),
    rect(720, 470, 280, 300, t.color('primary'), { cornerRadius: 22, name: 'Icon card' }),
    icon('calendar', 800, 560, 120, t.shade('background', p.onAccent), { strokeWidth: 2 }),
    eventCard(t, p, 1),
    eventCard(t, p, 2),
    brandMark(t.copy('brand'), 800, 1260, t.shade('text', p.soft), t.font('heading')),
  ]);

export const POSTS: readonly Template[] = [
  globalCoverage(LIME),
  aiAnalytics(LIME),
  quoteCard(LIME),
  feedbackWall(LIME),
  clientsCount(LIME),
  whyTeamsTrust(LIME),
  timeWaits(LIME),
  buildLeads(LIME),
  upcomingEvents(LIME),
];
