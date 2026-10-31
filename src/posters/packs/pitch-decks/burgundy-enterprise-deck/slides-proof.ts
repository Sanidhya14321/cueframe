import { linear } from '@/design';
import { avatar, icon, photo, rating, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, CV, fontsOf, glow, HEADING, SH, SW, wash } from './theme';

const TOP_ROW = ['Uptime', 'Support', 'Scalability', 'Security', 'Onboarding'];
const BOTTOM_ROW = ['Integrations', 'Reporting', 'Automation', 'Analytics'];

const performanceSpec = {
  colors: {
    background: { value: CV.wine, hint: 'Slide gradient; its lighter shade is the gradient end' },
    primary: {
      value: CV.rose,
      hint: 'Top glow, the rating pills and their stars, in deeper and paler shades',
    },
    text: { value: CV.white, hint: 'Title and the rating labels' },
    secondary: { value: CV.muted, hint: 'Paragraph' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    labels: {
      label: 'Rating label',
      value: [...TOP_ROW, ...BOTTOM_ROW],
      hint: 'Five on the top row, then four on the bottom row',
    },
    title: { label: 'Title', value: 'Performance Unmatched' },
    body: {
      label: 'Paragraph',
      value:
        'Built for speed, backed by dependable uptime\nand a team that answers within minutes.',
    },
  },
} as const satisfies ThemeSpec;

const PILL_SLOTS = [
  ...TOP_ROW.map((_, index) => ({ x: 120 + index * 340, y: 130, stars: index === 3 ? 4 : 5 })),
  ...BOTTOM_ROW.map((_, index) => ({ x: 290 + index * 340, y: 360, stars: index === 1 ? 4 : 5 })),
];

export const performanceSlide = themed(SW, SH, performanceSpec, (t) => {
  const { head, body } = fontsOf(t);
  const tint = (exact: string) => t.shade('primary', exact);
  const labels = t.list('labels');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    wash(0, tint, 0.2),
    PILL_SLOTS.map(({ x, y, stars }, index) => [
      body(labels[index] ?? '', x, y, 300, 26, t.color('text'), {
        align: 'center',
        fontWeight: 600,
      }),
      rect(x, y + 50, 300, 80, linear(90, tint('#6e2340'), tint('#b4567a')), {
        name: 'Rating pill',
        cornerRadius: 40,
        stroke: tint(CV.edge),
        strokeWidth: 2,
      }),
      rating(x + 39, y + 72, 36, 5, tint(CV.blush), 0.3).map((element, star) =>
        star < stars ? element : { ...element, opacity: 0.35 },
      ),
    ]),
    head(t.copy('title'), 0, 680, SW, 80, t.color('text'), { align: 'center' }),
    body(t.copy('body'), 0, 800, SW, 34, t.color('secondary'), { align: 'center' }),
  ];
});

const spotlightSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient; its dark shades color the text on the white stat card',
    },
    primary: { value: CV.rose, hint: 'Corner glow and the pink stat card' },
    surface: { value: CV.white, hint: 'White stat card' },
    text: { value: CV.white, hint: 'Title and the pink stat card text' },
    secondary: { value: CV.muted, hint: 'Story paragraph' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Client Success\nSpotlight' },
    body: {
      label: 'Story',
      value:
        'Before Corvane, a fragmented stack cost this logistics leader hours of manual syncing every week. Now one workspace keeps every region aligned.',
    },
    values: { label: 'Stat value', value: ['91%', '12K hrs'] },
    labels: { label: 'Stat label', value: ['Fewer manual tasks', 'Saved every year'] },
  },
} as const satisfies ThemeSpec;

export const spotlightSlide = themed(SW, SH, spotlightSpec, (t) => {
  const { head, body } = fontsOf(t);
  const tint = (exact: string) => t.shade('primary', exact);
  const [first = '', second = ''] = t.list('values');
  const [firstLabel = '', secondLabel = ''] = t.list('labels');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    wash(45, tint, 0.16),
    head(t.copy('title'), 120, 150, 820, 84, t.color('text')),
    body(t.copy('body'), 120, 380, 780, 32, t.color('secondary')),
    rect(120, 680, 330, 210, t.color('surface'), { name: 'Stat card', cornerRadius: 28 }),
    head(first, 156, 716, 280, 76, t.shade('background', CV.ink)),
    body(firstLabel, 156, 818, 280, 28, t.shade('background', CV.cardText)),
    rect(480, 680, 330, 210, linear(135, t.color('primary'), tint('#c25b7e')), {
      name: 'Stat card',
      cornerRadius: 28,
    }),
    head(second, 516, 722, 290, 64, t.color('text')),
    body(secondLabel, 516, 818, 280, 28, t.color('text')),
    photo('meeting-1', 1000, 120, 800, 840, { cornerRadius: 32 }),
  ];
});

const NODES = [
  { name: 'Relay', icon: 'zap', text: 'Event triggers that\nsync every app in seconds.' },
  {
    name: 'Flowbase',
    icon: 'workflow',
    text: 'Visual pipelines that\nmove data where it belongs.',
  },
  { name: 'Codepath', icon: 'code', text: 'Open APIs for teams\nthat want full control.' },
] as const;

const ecosystemSpec = {
  colors: {
    background: { value: CV.wine, hint: 'Slide gradient; its lighter shade is the gradient end' },
    primary: {
      value: CV.rose,
      hint: 'Connector line and the glows behind the tiles; its deep shade colors the tile icons',
    },
    surface: {
      value: CV.white,
      hint: 'Product tiles; its pink shade is the bottom of the tile gradient',
    },
    text: { value: CV.white, hint: 'Title and product names' },
    secondary: { value: CV.muted, hint: 'Subtitle and product descriptions' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Ecosystem Connectivity' },
    subtitle: {
      label: 'Subtitle',
      value: 'A phased, structured approach to linking your tools and data.',
    },
    names: { label: 'Product', value: NODES.map((node) => node.name) },
    texts: { label: 'Product description', value: NODES.map((node) => node.text) },
  },
} as const satisfies ThemeSpec;

export const ecosystemSlide = themed(SW, SH, ecosystemSpec, (t) => {
  const { head, body } = fontsOf(t);
  const tint = (exact: string) => t.shade('primary', exact);
  const names = t.list('names');
  const texts = t.list('texts');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    head(t.copy('title'), 0, 130, SW, 76, t.color('text'), { align: 'center' }),
    body(t.copy('subtitle'), 0, 240, SW, 32, t.color('secondary'), { align: 'center' }),
    rect(480, 519, 960, 3, tint('rgba(241,155,176,0.5)'), { name: 'Connector' }),
    NODES.map((node, index) => {
      const cx = 480 + index * 480;
      return [
        glow(cx, 520, 170, tint, 0.3),
        rect(
          cx - 75,
          445,
          150,
          150,
          linear(160, t.color('surface'), t.shade('surface', CV.blush)),
          {
            name: 'Node tile',
            cornerRadius: 34,
          },
        ),
        icon(node.icon, cx - 36, 484, 72, tint(CV.berry), { strokeWidth: 2 }),
        head(names[index] ?? '', cx - 220, 650, 440, 46, t.color('text'), { align: 'center' }),
        body(texts[index] ?? '', cx - 220, 720, 440, 28, t.color('secondary'), {
          align: 'center',
        }),
      ];
    }),
  ];
});

const quoteSpec = {
  colors: {
    background: { value: CV.wine, hint: 'Slide gradient; its lighter shade is the gradient end' },
    primary: {
      value: CV.rose,
      hint: 'Quote mark, photo ring and the corner glow; its faint shade draws the divider rule',
    },
    text: { value: CV.white, hint: 'Quote and the speaker name' },
    secondary: { value: CV.muted, hint: 'Speaker role' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    quote: {
      label: 'Quote',
      value: 'Beyond clean data, they gave our analysts two hours of focus back every single day.',
    },
    name: { label: 'Speaker', value: 'Lena Whitfield' },
    role: { label: 'Speaker role', value: 'COO, Brightline Labs' },
  },
} as const satisfies ThemeSpec;

export const quoteSlide = themed(SW, SH, quoteSpec, (t) => {
  const { head, body } = fontsOf(t);
  const tint = (exact: string) => t.shade('primary', exact);
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    wash(225, tint, 0.18),
    icon('quote', 140, 130, 150, t.color('primary'), { strokeWidth: 2 }),
    head(t.copy('quote'), 140, 360, 1560, 72, t.color('text'), { lineHeight: 1.2 }),
    rect(140, 760, 1640, 2, tint(CV.edge), { name: 'Rule' }),
    avatar('woman-portrait-5', 1290, 880, 58, t.color('primary')),
    head(t.copy('name'), 1372, 840, 420, 36, t.color('text')),
    body(t.copy('role'), 1372, 886, 420, 28, t.color('secondary')),
  ];
});
