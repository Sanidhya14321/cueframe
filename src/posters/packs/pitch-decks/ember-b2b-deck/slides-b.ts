import type { DesignIconName } from '@/design';
import {
  avatar,
  checklist,
  circle,
  icon,
  line,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import {
  BODY_FONT,
  background,
  body,
  EMBER,
  HEADING_FONT,
  heading,
  ratingDots,
  SH,
  SW,
  strong,
} from './deck-kit';

const E = EMBER;

const metricsSpec = {
  colors: {
    background: { value: E.accent, hint: 'Page' },
    primary: {
      value: E.ink,
      hint: 'Tallest step, and every metric, channel and value on the orange page and white step',
    },
    surface: { value: E.paper, hint: 'Middle step and the text on the tallest step' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    metrics: { label: 'Metric', value: ['CTR', 'ROI', 'REV'] },
    channels: {
      label: 'Channel',
      value: ['Paid social ads', 'Email marketing', 'Content marketing'],
    },
    values: { label: 'Value', value: ['30x', '75%', '500+'] },
  },
} as const satisfies ThemeSpec;

const STEPS = [
  { x: 90, y: 60 },
  { x: 700, y: 300 },
  { x: 1340, y: 560 },
] as const;

export const metricsSlide = themed(SW, SH, metricsSpec, (t) => {
  const head = heading(t.font('heading'));
  const copy = body(t.font('body'));
  const [ctr = '', roi = '', rev = ''] = t.list('metrics');
  const [social = '', email = '', content = ''] = t.list('channels');
  const ink = t.color('primary');
  const paper = t.color('surface');
  return [
    background(t.color('background')),
    head(ctr, STEPS[0].x, STEPS[0].y, 120, ink, 500),
    copy(social, 90, 200, 500, 30, ink),
    rect(640, 260, 1280, 820, paper, { name: 'Step' }),
    head(roi, STEPS[1].x, STEPS[1].y, 120, ink, 500),
    copy(email, 700, 440, 500, 30, ink),
    rect(1280, 520, 640, 560, ink, { name: 'Step' }),
    head(rev, STEPS[2].x, STEPS[2].y, 120, paper, 500),
    copy(content, 1340, 700, 500, 30, paper),
    t
      .list('values')
      .map((value, index) =>
        head(value, STEPS[index]?.x ?? 0, 860, 170, index === 2 ? paper : ink, 500),
      ),
  ];
});

const TEAM_PHOTOS: readonly PosterPhotoName[] = [
  'woman-portrait-1',
  'man-portrait-1',
  'woman-portrait-5',
];

const teamSpec = {
  colors: {
    background: { value: E.ink, hint: 'Page' },
    text: { value: E.paper, hint: 'Title and names; its dimmer shade colors the bios' },
    accent: { value: E.accent, hint: 'Photo rings and job titles' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Meet Our Team' },
    names: { label: 'Name', value: ['Samira Cole', 'Jonas Reed', 'Elise Moreau'] },
    roles: {
      label: 'Job title',
      value: ['LEAD STRATEGIST', 'CREATIVE DIRECTOR', 'SYSTEMS LEAD'],
    },
    bios: {
      label: 'Bio',
      value: [
        'Shapes go-to-market plans and positioning for every client.',
        'Builds brand worlds that stay sharp across every channel.',
        'Automates reporting so teams can focus on the next idea.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const teamSlide = themed(SW, SH, teamSpec, (t) => {
  const head = heading(t.font('heading'));
  const roles = t.list('roles');
  const bios = t.list('bios');
  return [
    background(t.color('background')),
    head(t.copy('title'), 0, 70, 130, t.color('text'), SW, 'center'),
    t.list('names').map((name, index) => {
      const cx = 420 + index * 540;
      return [
        avatar(TEAM_PHOTOS[index] ?? 'woman-portrait-1', cx, 460, 170, t.color('accent')),
        head(name, cx - 250, 680, 60, t.color('text'), 500, 'center'),
        text(roles[index] ?? '', cx - 250, 762, 500, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 800,
          fill: t.color('accent'),
          align: 'center',
          letterSpacing: 2,
        }),
        body(t.font('body'))(
          bios[index] ?? '',
          cx - 210,
          810,
          420,
          24,
          t.shade('text', E.mist),
          'center',
        ),
      ];
    }),
  ];
});

const PLAN_ICONS: readonly DesignIconName[] = ['rocket', 'trending-up', 'building-2'];

const pricingSpec = {
  colors: {
    background: {
      value: E.ink,
      hint: 'Page, and the plan icons, names, features, checks and prices on the cards',
    },
    surface: { value: E.paper, hint: 'Pricing Options title and the Enterprise card' },
    accent: {
      value: E.accent,
      hint: 'Startup card; its lighter tint colors the Growth card',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Pricing Options' },
    plans: { label: 'Plan', value: ['Startup', 'Growth', 'Enterprise'] },
    features: {
      label: 'Feature',
      hint: 'Four features per plan, in plan order',
      value: [
        'Dedicated lead',
        'Social campaigns',
        'Monthly reports',
        'Channel tuning',
        'Dedicated team',
        'Bi-weekly calls',
        'Custom web design',
        'CRM integration',
        'Full agency access',
        'Account-based ads',
        'Live dashboard',
        'Round-the-clock help',
      ],
    },
    prices: { label: 'Price', value: ['$0 /mo', '$10 /mo', '$25 /mo'] },
  },
} as const satisfies ThemeSpec;

export const pricingSlide = themed(SW, SH, pricingSpec, (t) => {
  const head = heading(t.font('heading'));
  const features = t.list('features');
  const prices = t.list('prices');
  const ink = t.color('background');
  const cards = [t.color('accent'), t.shade('accent', E.soft), t.color('surface')];
  return [
    background(ink),
    head(t.copy('title'), 100, 70, 130, t.color('surface')),
    t.list('plans').map((plan, index) => {
      const x = 100 + index * 590;
      return [
        rect(x, 290, 540, 720, cards[index] ?? '', { cornerRadius: 32, name: 'Plan card' }),
        icon(PLAN_ICONS[index] ?? 'rocket', x + 235, 330, 70, ink, { strokeWidth: 2 }),
        head(plan, x, 420, 72, ink, 540, 'center'),
        checklist(features.slice(index * 4, index * 4 + 4), x + 70, 540, 420, {
          color: ink,
          iconColor: ink,
          icon: 'check',
          fontSize: 28,
          gap: 62,
          fontFamily: t.font('body'),
        }),
        head(prices[index] ?? '', x, 860, 90, ink, 540, 'center'),
      ];
    }),
  ];
});

const NODES: readonly { icon: DesignIconName; x: number; y: number }[] = [
  { icon: 'database', x: 1350, y: 190 },
  { icon: 'globe', x: 1720, y: 360 },
  { icon: 'git-branch', x: 1720, y: 720 },
  { icon: 'cloud', x: 1350, y: 890 },
  { icon: 'layers', x: 980, y: 720 },
  { icon: 'zap', x: 980, y: 360 },
];

const link = (x1: number, y1: number, x2: number, y2: number, stroke: string) =>
  line(x1, y1, Math.hypot(x2 - x1, y2 - y1), stroke, 4, {
    rotation: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
    name: 'Link',
  });

const networkSpec = {
  colors: {
    background: { value: E.paper, hint: 'Page and the hub and node labels' },
    primary: {
      value: E.ink,
      hint: 'Title, the Live line, the hub, nodes and links; its lighter shade colors the paragraph',
    },
    accent: { value: E.accent, hint: 'Ember Sync, and the hub and node icons' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Integrated\nNetwork' },
    paragraph: {
      label: 'Paragraph',
      value:
        'Your stack, connected. We plug into the tools your team already uses and keep every channel in sync.',
    },
    product: { label: 'Product', value: 'Ember Sync' },
    timing: { label: 'Timing', value: 'Live in 2 weeks' },
    hub: { label: 'Hub label', value: 'ORBITAL HUB' },
    nodes: {
      label: 'Node',
      value: ['KITEBASE', 'ORBITLY', 'PINEWIRE', 'HALCYON', 'QUARRY', 'BRIGHTLOOP'],
    },
  },
} as const satisfies ThemeSpec;

export const networkSlide = themed(SW, SH, networkSpec, (t) => {
  const copy = body(t.font('body'));
  const ink = t.color('primary');
  const labels = t.list('nodes');
  return [
    background(t.color('background')),
    heading(t.font('heading'))(t.copy('title'), 100, 100, 130, ink),
    copy(t.copy('paragraph'), 100, 400, 640, 32, t.shade('primary', E.grey)),
    strong(t.font('body'))(t.copy('product'), 100, 820, 600, 48, t.color('accent')),
    copy(t.copy('timing'), 100, 890, 600, 30, ink),
    NODES.map((node, index) => {
      const next = NODES[(index + 1) % NODES.length] ?? node;
      return [link(node.x, node.y, 1350, 540, ink), link(node.x, node.y, next.x, next.y, ink)];
    }),
    circle(1350, 540, 130, ink),
    icon('target', 1300, 440, 100, t.color('accent'), { strokeWidth: 2 }),
    text(t.copy('hub'), 1220, 560, 260, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
    }),
    NODES.map((node, index) => [
      circle(node.x, node.y, 74, ink),
      icon(node.icon, node.x - 32, node.y - 46, 64, t.color('accent'), { strokeWidth: 2 }),
      text(labels[index] ?? '', node.x - 70, node.y + 22, 140, {
        fontFamily: t.font('body'),
        fontSize: 17,
        fontWeight: 800,
        fill: t.color('background'),
        align: 'center',
      }),
    ]),
  ];
});

const SCORES: readonly (readonly number[])[] = [
  [3, 3, 3, 3, 3],
  [2, 2, 2, 1, 0],
  [1, 2, 1, 2, 1],
];

const matrixSpec = {
  colors: {
    background: { value: E.ink, hint: 'Page and the Our Firm header text' },
    text: {
      value: E.paper,
      hint: 'Title, column and row labels, competitor dots, and the row rules (faint shade)',
    },
    accent: { value: E.accent, hint: 'Our Firm header and its score dots' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Competitive Matrix' },
    columns: { label: 'Column', value: ['OUR FIRM', 'COMPETITOR A', 'COMPETITOR B'] },
    criteria: {
      label: 'Criterion',
      value: ['STRATEGY', 'ONBOARDING', 'PERFORMANCE', 'INTEGRATION', 'PRICING'],
    },
  },
} as const satisfies ThemeSpec;

export const matrixSlide = themed(SW, SH, matrixSpec, (t) => {
  const paper = t.color('text');

  return [
    background(t.color('background')),
    heading(t.font('heading'))(t.copy('title'), 0, 70, 130, paper, SW, 'center'),
    t.list('columns').map((column, index) => [
      index === 0
        ? rect(760, 290, 340, 60, t.color('accent'), { cornerRadius: 12, name: 'Header' })
        : [],
      text(column, 760 + index * 370, 304, 340, {
        fontFamily: t.font('body'),
        fontSize: 24,
        fontWeight: 800,
        fill: index === 0 ? t.color('background') : paper,
        align: 'center',
        letterSpacing: 1,
      }),
    ]),
    t.list('criteria').map((criterion, row) => {
      const y = 400 + row * 120;
      return [
        text(criterion, 260, y + 24, 420, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 800,
          fill: paper,
          letterSpacing: 1,
        }),
        rect(260, y + 96, 1440, 3, t.shade('text', 'rgba(255,255,255,0.18)'), {
          name: 'Row rule',
        }),
        SCORES.map((values, column) =>
          ratingDots(
            890 + column * 370,
            y + 40,
            values[row] ?? 0,
            column === 0 ? t.color('accent') : paper,
            paper,
            t.shade('text', 'rgba(255,255,255,0)'),
          ),
        ),
      ];
    }),
  ];
});
