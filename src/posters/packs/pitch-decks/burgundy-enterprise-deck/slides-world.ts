import { linear, radial } from '@/design';
import { circle, ellipse, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, CV, fontsOf, glass, glow, HEADING, SH, SW } from './theme';

const GLOBE = { cx: 1420, cy: 560, r: 410 };
const LINE = 'rgba(255,214,223,0.32)';
const CITIES = [
  [1240, 420],
  [1530, 380],
  [1660, 640],
  [1340, 760],
  [1480, 520],
] as const;

const worldSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient and the globe shadow; its dark shades color the text on the white stat card',
    },
    primary: {
      value: CV.rose,
      hint: 'Global Market, the pink stat card, the glow, globe lines and city dots, in lighter and darker shades',
    },
    surface: { value: CV.white, hint: 'White stat card' },
    text: { value: CV.white, hint: 'Discover the, the stat numbers and the pink card text' },
    secondary: { value: CV.muted, hint: 'Paragraph and the stat labels under it' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Discover the' },
    highlight: { label: 'Highlighted title', value: 'Global Market' },
    body: {
      label: 'Paragraph',
      value:
        'Automation is changing how enterprises grow, and Corvane puts that leverage in every regional team.',
    },
    values: { label: 'Stat value', value: ['640+', '210%', '52M', '31M'] },
    labels: {
      label: 'Stat label',
      value: ['New locations', 'Faster rollout', 'Regional users', 'Active accounts'],
    },
  },
} as const satisfies ThemeSpec;

export const worldMarketSlide = themed(SW, SH, worldSpec, (t) => {
  const { head, body } = fontsOf(t);
  const tint = (exact: string) => t.shade('primary', exact);
  const [first = '', second = '', third = '', fourth = ''] = t.list('values');
  const [firstLabel = '', secondLabel = '', thirdLabel = '', fourthLabel = ''] = t.list('labels');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    glow(1420, 560, 560, tint, 0.18),
    circle(
      GLOBE.cx,
      GLOBE.cy,
      GLOBE.r,
      radial(tint('rgba(241,155,176,0.28)'), t.shade('background', 'rgba(31,10,18,0.2)')),
      { stroke: tint(LINE), strokeWidth: 2 },
    ),
    [0.2, 0.5, 0.78].map((ratio) =>
      ellipse(
        GLOBE.cx - GLOBE.r * ratio,
        GLOBE.cy - GLOBE.r,
        GLOBE.r * ratio * 2,
        GLOBE.r * 2,
        tint(CV.clear),
        { stroke: tint(LINE), strokeWidth: 2 },
      ),
    ),
    [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75].map((ratio) => {
      const half = GLOBE.r * Math.sqrt(1 - ratio * ratio);
      return rect(GLOBE.cx - half, GLOBE.cy + GLOBE.r * ratio, half * 2, 2, tint(LINE), {
        name: 'Parallel',
      });
    }),
    CITIES.map(([x, y]) => circle(x, y, 9, tint(CV.blush))),
    head(t.copy('title'), 120, 170, 760, 84, t.color('text')),
    head(t.copy('highlight'), 120, 265, 760, 84, t.color('primary')),
    body(t.copy('body'), 120, 420, 700, 30, t.color('secondary')),
    head(first, 120, 720, 300, 80, t.color('text')),
    body(firstLabel, 120, 818, 300, 28, t.color('secondary')),
    head(second, 460, 720, 300, 80, t.color('text')),
    body(secondLabel, 460, 818, 300, 28, t.color('secondary')),
    rect(1500, 260, 300, 190, t.color('surface'), { name: 'Stat card', cornerRadius: 24 }),
    head(third, 1536, 290, 240, 72, t.shade('background', CV.ink)),
    body(thirdLabel, 1536, 380, 240, 26, t.shade('background', CV.cardText)),
    rect(1060, 660, 300, 190, linear(135, t.color('primary'), tint('#c25b7e')), {
      name: 'Stat card',
      cornerRadius: 24,
    }),
    head(fourth, 1096, 690, 240, 72, t.color('text')),
    body(fourthLabel, 1096, 780, 240, 26, t.color('text')),
  ];
});

const QUARTERS = [
  { title: 'Discovery', text: 'Baseline models and\nhardware review.', progress: 1 },
  { title: 'Build', text: 'Pilot rollout with\ntwo core teams.', progress: 1 },
  { title: 'Expansion', text: 'Scale to every\nregional office.', progress: 0.64 },
  { title: 'Integration', text: 'Connect billing\nand analytics.', progress: 0.2 },
];

const ACTIVE_QUARTER = 2;

const quarterlySpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient; its dark shades color the text on the active quarter card',
    },
    primary: {
      value: CV.rose,
      hint: 'Progress bars and the active timeline dot; its deeper shade colors the active quarter number, rule and bar, and its faint shade draws the timeline and card edges',
    },
    surface: {
      value: CV.white,
      hint: 'Active quarter card, glass cards, progress tracks and timeline dots',
    },
    text: { value: CV.white, hint: 'Title and the quarter numbers and names on the glass cards' },
    secondary: { value: CV.muted, hint: 'Quarter details and progress on the glass cards' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Quarterly Analysis' },
    quarters: { label: 'Quarter', value: QUARTERS.map((_, index) => `Q${index + 1}`) },
    names: { label: 'Quarter name', value: QUARTERS.map((quarter) => quarter.title) },
    details: { label: 'Quarter detail', value: QUARTERS.map((quarter) => quarter.text) },
    progress: {
      label: 'Progress label',
      value: QUARTERS.map((quarter) => `${Math.round(quarter.progress * 100)}% complete`),
    },
  },
} as const satisfies ThemeSpec;

export const quarterlySlide = themed(SW, SH, quarterlySpec, (t) => {
  const { head, body } = fontsOf(t);
  const tint = (exact: string) => t.shade('primary', exact);
  const names = t.list('names');
  const details = t.list('details');
  const progress = t.list('progress');
  const idle = {
    card: (x: number) => glass(x, 280, 315, 470, t.shade('surface', CV.glass), tint(CV.edge)),
    number: t.color('text'),
    rule: tint(CV.edge),
    title: t.color('text'),
    text: t.color('secondary'),
    track: t.shade('surface', 'rgba(255,255,255,0.12)'),
    bar: t.color('primary'),
    dot: t.color('surface'),
    dotRadius: 16,
    ring: 0,
  };
  const active = {
    card: (x: number) =>
      rect(x, 280, 315, 470, linear(160, t.color('surface'), t.shade('surface', CV.blush)), {
        name: 'Active quarter',
        cornerRadius: 28,
      }),
    number: tint(CV.berry),
    rule: tint(CV.berry),
    title: t.shade('background', CV.ink),
    text: t.shade('background', CV.cardText),
    track: tint('rgba(92,26,46,0.15)'),
    bar: tint(CV.berry),
    dot: t.color('primary'),
    dotRadius: 22,
    ring: 6,
  };
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    head(t.copy('title'), 0, 110, SW, 76, t.color('text'), { align: 'center' }),
    rect(240, 869, 1440, 3, tint(CV.edge), { name: 'Timeline' }),
    t.list('quarters').map((label, index) => {
      const quarter = QUARTERS[index] ?? { progress: 0 };
      const x = 240 + index * 375;
      const tone = index === ACTIVE_QUARTER ? active : idle;
      return [
        tone.card(x),
        head(label, x + 36, 320, 240, 88, tone.number),
        rect(x + 36, 440, 243, 2, tone.rule, { name: 'Rule' }),
        head(names[index] ?? '', x + 36, 470, 260, 36, tone.title),
        body(details[index] ?? '', x + 36, 530, 260, 26, tone.text),
        body(progress[index] ?? '', x + 36, 640, 260, 24, tone.text, { fontWeight: 600 }),
        rect(x + 36, 684, 243, 12, tone.track, { name: 'Progress track', cornerRadius: 6 }),
        rect(x + 36, 684, 243 * quarter.progress, 12, tone.bar, {
          name: 'Progress',
          cornerRadius: 6,
        }),
        circle(x + 157, 870, tone.dotRadius, tone.dot, {
          stroke: tint(CV.blush),
          strokeWidth: tone.ring,
        }),
      ];
    }),
  ];
});
