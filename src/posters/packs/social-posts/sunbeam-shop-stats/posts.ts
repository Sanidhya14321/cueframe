import { type Fill, linear } from '@/design';
import {
  circle,
  dots,
  type Nodes,
  POST_SIZE,
  path,
  rect,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

export const SUN = { yellow: '#ffc83d', navy: '#101a3a', grey: '#4a4f63' } as const;
export const NIGHT = { navy: '#0e1530', lilac: '#a9b1d6' } as const;
export const BERRY = {
  violet: '#8a2be2',
  plum: '#2a0a4a',
  lilac: '#d6c2f0',
  deep: '#3c1170',
} as const;
export const WHITE = '#ffffff';
export const GOLD = '#ffc83d';

export const HEADING = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;

export const head = (fontFamily: string, size: number, fill: string) => ({
  fontFamily,
  fontSize: size,
  fontWeight: 800,
  fill,
  lineHeight: 1.1,
});

export const copyText = (fontFamily: string, size: number, fill: string, weight = 400) => ({
  fontFamily,
  fontSize: size,
  fontWeight: weight,
  fill,
  lineHeight: 1.35,
});

export const backdrop = (fill: Fill, height: number) =>
  rect(0, 0, W, height, fill, { name: 'Background' });

const disc = (
  fonts: { heading: string; body: string },
  colors: { disc: string; label: string },
  cx: number,
  cy: number,
  radius: number,
  figure: string,
  label: string,
): Nodes[] => [
  circle(cx, cy, radius, colors.disc, {
    name: 'Stat disc',
    ...shadow(40, 16, 'rgba(0,0,0,0.25)'),
  }),
  text(figure, cx - radius, cy - 62, radius * 2, {
    ...head(fonts.heading, 84, colors.label),
    align: 'center',
    lineHeight: 1,
  }),
  text(label, cx - radius, cy + 36, radius * 2, {
    ...copyText(fonts.body, 26, colors.label, 500),
    align: 'center',
  }),
];

const starStat = (
  fontFamily: string,
  x: number,
  y: number,
  size: number,
  value: string,
  colors: { fill: string; label: string },
) => [
  star(5, x, y, size, colors.fill, { innerRatio: 0.48, name: 'Stat star' }),
  text(value, x, y + size * 0.47, size, {
    ...head(fontFamily, size * 0.15, colors.label),
    align: 'center',
    lineHeight: 1,
  }),
];

const useCasesSpec = {
  colors: {
    background: { value: SUN.yellow, hint: 'Page and the figure on the small star' },
    primary: {
      value: SUN.navy,
      hint: 'Title, stat discs, small star, the figure on the big star, note rule and notes',
    },
    surface: { value: WHITE, hint: 'Big star and the figures and labels on the discs' },
    text: { value: SUN.grey, hint: 'Subtitle' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Smart tools local\nshops rely on' },
    subtitle: {
      label: 'Subtitle',
      value: 'How small stores save time every\nweek. Which ones do you use?',
    },
    figures: { label: 'Figure', value: ['72%', '49%', '61%', '27%'] },
    labels: { label: 'Disc label', value: ['Online booking', 'Email offers'] },
    notes: { label: 'Note', value: ['Stock level\nalerts', 'Bookkeeping and invoices'] },
  },
} as const satisfies ThemeSpec;

export const useCases = themed(W, H, useCasesSpec, (t) => {
  const fonts = { heading: t.font('heading'), body: t.font('body') };
  const [main = '', second = '', big = '', small = ''] = t.list('figures');
  const [mainLabel = '', secondLabel = ''] = t.list('labels');
  const [stock = '', books = ''] = t.list('notes');
  const discColors = { disc: t.color('primary'), label: t.color('surface') };
  return [
    backdrop(t.color('background'), H),
    text(t.copy('title'), 80, 100, 920, head(fonts.heading, 66, t.color('primary'))),
    text(t.copy('subtitle'), 80, 270, 900, copyText(fonts.body, 36, t.color('text'))),
    disc(fonts, discColors, 320, 790, 200, main, mainLabel),
    disc(fonts, discColors, 700, 1080, 170, second, secondLabel),
    starStat(fonts.heading, 560, 480, 380, big, {
      fill: t.color('surface'),
      label: t.color('primary'),
    }),
    starStat(fonts.heading, 150, 950, 230, small, {
      fill: t.color('primary'),
      label: t.color('background'),
    }),
    text(stock, 830, 420, 220, copyText(fonts.body, 24, t.color('primary'), 600)),
    rect(830, 400, 60, 4, t.color('primary'), { name: 'Note rule', cornerRadius: 2 }),
    text(books, 80, 1260, 480, copyText(fonts.body, 24, t.color('primary'), 600)),
  ];
});

interface LeadersPaint {
  page: Fill;
  kicker: string;
  title: string;
  star: string;
  line: string;
  clear: string;
  figure: string;
  topFigure: string;
  label: string;
  guide: string;
  point: string;
  endStar: string;
  footer: string;
}

interface LeadersCopy {
  kicker: string;
  title: string;
  figures: readonly string[];
  labels: readonly string[];
  footer: string;
}

const ANCHORS = [
  { x: 300, y: 1150, top: 860 },
  { x: 530, y: 1110, top: 700 },
  { x: 770, y: 1030, top: 560 },
] as const;

const leadersNodes = (
  fonts: { heading: string; body: string },
  paint: LeadersPaint,
  copy: LeadersCopy,
): Nodes[] => [
  backdrop(paint.page, H),
  text(copy.kicker, 80, 100, 700, copyText(fonts.body, 26, paint.kicker, 600)),
  text(copy.title, 80, 146, 920, head(fonts.heading, 66, paint.title)),
  star(5, 860, 50, 130, paint.star, { innerRatio: 0.48, name: 'Star' }),
  path(
    'M0 380 C120 370 220 300 300 300 C400 300 440 260 530 260 C630 260 680 180 770 180 C870 180 980 140 1080 110',
    0,
    850,
    W,
    400,
    paint.clear,
    { width: W, height: 400 },
    { stroke: paint.line, strokeWidth: 8, name: 'Trend line' },
  ),
  ANCHORS.map((anchor, index) => {
    const labelEnd = anchor.top + 170;
    return [
      text(copy.figures[index] ?? '', anchor.x - 120, anchor.top, 240, {
        ...head(fonts.heading, 76, index === 2 ? paint.topFigure : paint.figure),
        align: 'center',
        lineHeight: 1,
      }),
      text(copy.labels[index] ?? '', anchor.x - 120, anchor.top + 88, 240, {
        ...copyText(fonts.body, 24, paint.label, 500),
        align: 'center',
        lineHeight: 1.2,
      }),
      dots(anchor.x, labelEnd, 1, Math.floor((anchor.y - labelEnd - 20) / 18), 18, paint.guide, 3),
      circle(anchor.x, anchor.y, 14, paint.point, { name: 'Point' }),
    ];
  }),
  star(5, 940, 820, 130, paint.endStar, { innerRatio: 0.48, name: 'Star' }),
  text(copy.footer, 0, 1268, W, {
    ...copyText(fonts.body, 26, paint.footer, 600),
    align: 'center',
  }),
];

const LEADERS_COPY = {
  kicker: { label: 'Kicker', value: 'Main street pulse' },
  title: { label: 'Title', value: 'Where Owners are\nspending this season' },
  figures: { label: 'Figure', value: ['44%', '67%', '83%'] },
  labels: { label: 'Figure label', value: ['Local\nads', 'Loyalty\nrewards', 'Online\nordering'] },
  footer: { label: 'Footer', value: 'Want a plan for your shop? Message us today.' },
} as const;

const nightLeadersSpec = {
  colors: {
    background: { value: NIGHT.navy, hint: 'Page' },
    primary: {
      value: GOLD,
      hint: 'Both stars, the trend line and the last figure',
    },
    text: {
      value: WHITE,
      hint: 'Title, first two figures, dotted guides, points and footer; its muted shade colors the kicker and figure labels',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: LEADERS_COPY,
} as const satisfies ThemeSpec;

export const nightLeaders = themed(W, H, nightLeadersSpec, (t) =>
  leadersNodes(
    { heading: t.font('heading'), body: t.font('body') },
    {
      page: t.color('background'),
      kicker: t.shade('text', NIGHT.lilac),
      title: t.color('text'),
      star: t.color('primary'),
      line: t.color('primary'),
      clear: t.shade('primary', 'rgba(0,0,0,0)'),
      figure: t.color('text'),
      topFigure: t.color('primary'),
      label: t.shade('text', NIGHT.lilac),
      guide: t.color('text'),
      point: t.color('text'),
      endStar: t.color('primary'),
      footer: t.color('text'),
    },
    {
      kicker: t.copy('kicker'),
      title: t.copy('title'),
      figures: t.list('figures'),
      labels: t.list('labels'),
      footer: t.copy('footer'),
    },
  ),
);

const berryLeadersSpec = {
  colors: {
    background: {
      value: BERRY.violet,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    primary: { value: GOLD, hint: 'Corner star, trend line and the last figure' },
    text: {
      value: WHITE,
      hint: 'Title, first two figures, dotted guides, points, the star by the line and footer; its lilac shade colors the kicker and figure labels',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: LEADERS_COPY,
} as const satisfies ThemeSpec;

export const berryLeaders = themed(W, H, berryLeadersSpec, (t) =>
  leadersNodes(
    { heading: t.font('heading'), body: t.font('body') },
    {
      page: linear(200, t.color('background'), t.shade('background', BERRY.plum)),
      kicker: t.shade('text', BERRY.lilac),
      title: t.color('text'),
      star: t.color('primary'),
      line: t.color('primary'),
      clear: t.shade('primary', 'rgba(0,0,0,0)'),
      figure: t.color('text'),
      topFigure: t.color('primary'),
      label: t.shade('text', BERRY.lilac),
      guide: t.color('text'),
      point: t.color('text'),
      endStar: t.color('text'),
      footer: t.color('text'),
    },
    {
      kicker: t.copy('kicker'),
      title: t.copy('title'),
      figures: t.list('figures'),
      labels: t.list('labels'),
      footer: t.copy('footer'),
    },
  ),
);
