import { icon, pill, poly, rect, type ThemeSpec, themed } from '../../../kit';
import { donut } from './deck-kit';
import { backdrop, body, FONTS, head, marker, NV, SH, SW } from './theme';

const BOLT = [
  [1500, 80],
  [1120, 610],
  [1390, 610],
  [1250, 1000],
  [1780, 420],
  [1500, 420],
  [1700, 80],
] as const;

const poweringSpec = {
  colors: {
    background: {
      value: NV.plum,
      hint: 'Page; its shades color the bolt shadow and the figure and label on the white card',
    },
    primary: { value: NV.coral, hint: 'Bolt and the second stat card' },
    surface: { value: NV.white, hint: 'First stat card' },
    text: { value: NV.white, hint: 'Headline and the figure and label on the coral card' },
    secondary: { value: NV.peach, hint: 'Subtitle' },
  },
  fonts: FONTS,
  copy: {
    headline: { label: 'Headline', value: 'Fuel your\nnext quarter.' },
    subtitle: {
      label: 'Subtitle',
      value: 'A forecast built for sustainable\nrevenue at scale.',
    },
    stats: { label: 'Stat', value: ['62.4K', '18.9K'] },
    labels: { label: 'Stat label', value: ['Leads scored', 'Hours saved'] },
  },
} as const satisfies ThemeSpec;

export const poweringSlide = themed(SW, SH, poweringSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const [first = '', second = ''] = t.list('stats');
  const [firstLabel = '', secondLabel = ''] = t.list('labels');
  return [
    backdrop(t.color('background')),
    poly(
      BOLT.map(([x, y]) => [x + 40, y - 30] as const),
      t.shade('background', NV.plumSoft),
      { name: 'Bolt shadow' },
    ),
    poly(BOLT, t.color('primary'), { name: 'Bolt' }),
    heading(t.copy('headline'), 140, 180, 900, 120, t.color('text'), { fontWeight: 800 }),
    copy(t.copy('subtitle'), 140, 480, 800, 36, t.color('secondary')),
    rect(140, 700, 360, 220, t.color('surface'), { name: 'Stat card', cornerRadius: 28 }),
    heading(first, 180, 735, 300, 84, t.shade('background', NV.ink)),
    copy(firstLabel, 180, 845, 300, 28, t.shade('background', NV.grey)),
    rect(540, 700, 360, 220, t.color('primary'), { name: 'Stat card', cornerRadius: 28 }),
    heading(second, 580, 735, 300, 84, t.color('text')),
    copy(secondLabel, 580, 845, 300, 28, t.color('text')),
  ];
});

const SHARES = [54.2, 28.6, 17.2];

const campaignSpec = {
  colors: {
    background: { value: NV.white, hint: 'Page' },
    primary: { value: NV.coral, hint: 'Accent bar and the Social slice and swatch' },
    secondary: { value: NV.plum, hint: 'Paid search slice and swatch' },
    accent: { value: NV.peach, hint: 'Email slice and swatch' },
    text: {
      value: NV.ink,
      hint: 'Title, channel names and the center figure; its lighter shade colors the subtitle and the figure label',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Campaign\nresults' },
    subtitle: {
      label: 'Subtitle',
      value: 'How each channel turned spend\ninto measurable growth.',
    },
    channels: {
      label: 'Channel',
      value: ['Paid search (54.2%)', 'Social (28.6%)', 'Email (17.2%)'],
    },
    figure: { label: 'Center figure', value: '3.2x' },
    figureLabel: { label: 'Figure label', value: 'Return on spend' },
  },
} as const satisfies ThemeSpec;

export const campaignSlide = themed(SW, SH, campaignSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const colors = [t.color('secondary'), t.color('primary'), t.color('accent')];
  return [
    backdrop(t.color('background')),
    marker(140, 140, t.color('primary')),
    heading(t.copy('title'), 140, 180, 800, 120, t.color('text'), { fontWeight: 800 }),
    copy(t.copy('subtitle'), 140, 460, 760, 36, t.shade('text', NV.grey)),
    t.list('channels').map((channel, index) => [
      rect(140, 660 + index * 90, 90, 44, colors[index] ?? NV.plum, {
        name: 'Legend',
        cornerRadius: 10,
      }),
      copy(channel, 260, 660 + index * 90, 600, 32, t.color('text'), { fontWeight: 500 }),
    ]),
    donut(
      1380,
      540,
      360,
      200,
      SHARES.map((share, index) => [share, colors[index] ?? NV.plum] as const),
    ),
    heading(t.copy('figure'), 1180, 470, 400, 100, t.color('text'), {
      align: 'center',
      fontWeight: 800,
    }),
    copy(t.copy('figureLabel'), 1180, 580, 400, 30, t.shade('text', NV.grey), { align: 'center' }),
  ];
});

const INSIGHT_ROWS = [470, 730];

const impactSpec = {
  colors: {
    background: {
      value: NV.plum,
      hint: 'Page, reviewer pill, quote mark, quote and the text on the coral labels',
    },
    primary: { value: NV.coral, hint: 'Challenge and Result labels and the quote card' },
    surface: { value: NV.white, hint: 'Title, insight cards and the reviewer name' },
    text: { value: NV.ink, hint: 'Insight copy' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Real-world\nimpact' },
    labels: { label: 'Insight label', value: ['Challenge', 'Result'] },
    insights: {
      label: 'Insight',
      value: [
        'Manual reporting slowed every launch and blurred attribution.',
        'Launch cycles fell from 21 days to 6 and MQL to SQL rates rose 38%.',
      ],
    },
    reviewer: { label: 'Reviewer', value: 'Priya N.  /  VP Marketing' },
    quote: {
      label: 'Quote',
      value: 'Lost 12 hours\na week to manual\nreporting before\nNorthvale.',
    },
  },
} as const satisfies ThemeSpec;

export const impactSlide = themed(SW, SH, impactSpec, (t) => {
  const heading = head(t.font('heading'));
  const insights = t.list('insights');
  return [
    backdrop(t.color('background')),
    heading(t.copy('title'), 140, 140, 900, 120, t.color('surface'), { fontWeight: 800 }),
    t.list('labels').map((label, index) => {
      const y = INSIGHT_ROWS[index] ?? 0;
      return [
        rect(140, y, 880, 220, t.color('surface'), { name: 'Insight card', cornerRadius: 28 }),
        pill(label, 180, y + 30, {
          fill: t.color('primary'),
          color: t.color('background'),
          fontSize: 26,
          fontFamily: t.font('body'),
        }),
        body(t.font('body'))(insights[index] ?? '', 180, y + 110, 800, 30, t.color('text')),
      ];
    }),
    rect(1140, 140, 640, 810, t.color('primary'), { name: 'Quote card', cornerRadius: 40 }),
    pill(t.copy('reviewer'), 1190, 200, {
      fill: t.color('background'),
      color: t.color('surface'),
      fontSize: 28,
      fontFamily: t.font('body'),
    }),
    icon('quote', 1190, 340, 90, t.color('background'), { strokeWidth: 2.4 }),
    heading(t.copy('quote'), 1190, 480, 560, 56, t.color('background')),
  ];
});
