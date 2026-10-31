import { linear } from '@/design';
import { circle, icon, pill, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY_FONT, backdrop, body, glow, HEADING_FONT, HX, head, SH, SW } from './theme';

const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;

const TRACKS = [
  { start: 0, span: 1, hot: true },
  { start: 0.6, span: 1.1, hot: false },
  { start: 1.2, span: 0.9, hot: true },
  { start: 1.7, span: 1.3, hot: false },
  { start: 2.8, span: 1.2, hot: true },
] as const;

const roadmapSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background and the notes on the bars' },
    primary: {
      value: HX.teal,
      hint: 'Glow and the highlighted bars; its deeper shade starts the bar gradient',
    },
    text: {
      value: HX.white,
      hint: 'Title, quarters, track names and the plain bars; its grey shades color the intro and the grid rules',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Roadmap' },
    intro: {
      label: 'Intro',
      value: 'A timeline that balances quick wins with long-term enterprise readiness.',
    },
    quarters: { label: 'Quarter', value: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'] },
    tracks: {
      label: 'Track',
      value: [
        'Product-led growth',
        'Compliance & scale',
        'Workflow retention',
        'Value realisation',
        'Platform value',
      ],
    },
    notes: {
      label: 'Bar note',
      value: ['+40% activation', 'SOC 2 ready', '+22% retention', '3x faster ROI', '$12M ARR'],
    },
  },
} as const satisfies ThemeSpec;

export const roadmapSlide = themed(SW, SH, roadmapSpec, (t) => {
  const rule = t.shade('text', HX.rule);
  const notes = t.list('notes');
  return [
    backdrop(t.color('background')),
    glow(1500, 700, 370, 0.3, (exact) => t.shade('primary', exact)),
    head(t.font('heading'))(t.copy('title'), 140, 110, 800, 88, t.color('text')),
    body(t.font('body'))(t.copy('intro'), 140, 225, 1100, 30, t.shade('text', HX.muted)),
    t.list('quarters').map((quarter, index) => [
      body(t.font('body'))(quarter, 640 + index * 285, 360, 285, 28, t.color('text'), {
        align: 'center',
        fontWeight: 600,
      }),
      rect(640 + index * 285, 340, 2, 620, rule, { name: 'Column rule' }),
    ]),
    rect(140, 420, 1640, 2, rule, { name: 'Header rule' }),
    t.list('tracks').map((label, row) => {
      const track = TRACKS[row] ?? TRACKS[0];
      const y = 470 + row * 98;
      const x = 640 + track.start * 285;
      return [
        body(t.font('body'))(label, 140, y + 4, 480, 30, t.color('text')),
        rect(
          x + 8,
          y,
          track.span * 285 - 16,
          50,
          track.hot ? linear(90, t.shade('primary', HX.deep), t.color('primary')) : t.color('text'),
          { name: 'Bar', cornerRadius: 10 },
        ),
        body(t.font('body'))(
          notes[row] ?? '',
          x + 28,
          y + 12,
          track.span * 285 - 40,
          22,
          t.color('background'),
          { fontWeight: 600 },
        ),
      ];
    }),
  ];
});

const standardSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: { value: HX.teal, hint: 'Glow and the first proof number' },
    text: {
      value: HX.white,
      hint: 'Title and the other proof numbers; its grey shade colors the intro and the labels',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'The new standard\nfor operations' },
    intro: {
      label: 'Intro',
      value: 'Built to carry the heavy lifting so your people can focus on what matters.',
    },
    values: { label: 'Proof number', value: ['04min', '170%', '250M+'] },
    labels: {
      label: 'Proof label',
      value: [
        'Average time to launch\na new workflow',
        'More output per team\nin the first month',
        'Tasks automated across\nall customers',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const standardSlide = themed(SW, SH, standardSpec, (t) => {
  const labels = t.list('labels');
  return [
    backdrop(t.color('background')),
    glow(960, 380, 370, 0.4, (exact) => t.shade('primary', exact)),
    head(t.font('heading'))(t.copy('title'), 0, 160, SW, 90, t.color('text'), { align: 'center' }),
    body(t.font('body'))(t.copy('intro'), 410, 400, 1100, 30, t.shade('text', HX.muted), {
      align: 'center',
    }),
    t
      .list('values')
      .map((value, index) => [
        head(t.font('heading'))(
          value,
          370 + index * 400,
          590,
          380,
          96,
          index === 0 ? t.color('primary') : t.color('text'),
          { align: 'center', fontWeight: 800 },
        ),
        body(t.font('body'))(
          labels[index] ?? '',
          370 + index * 400,
          730,
          380,
          28,
          t.shade('text', HX.muted),
          { align: 'center' },
        ),
      ]),
  ];
});

const timelineSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: { value: HX.teal, hint: 'Glow and the highlighted Q3 dot and label' },
    text: {
      value: HX.white,
      hint: 'Year, the other dots and quarter labels; its grey shades color the kicker, the year fade, the line and the milestones',
    },
  },
  fonts: FONTS,
  copy: {
    kicker: { label: 'Kicker', value: 'TIMELINE' },
    year: { label: 'Year', value: '2027' },
    quarters: { label: 'Quarter', value: ['Q1', 'Q2', 'Q3', 'Q4'] },
    milestones: {
      label: 'Milestone',
      value: [
        'Pilot with five\ndesign partners',
        'Self-serve launch\nand billing',
        'Enterprise tier\nand SSO',
        'Expansion into\nthree new regions',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const timelineSlide = themed(SW, SH, timelineSpec, (t) => {
  const milestones = t.list('milestones');
  return [
    backdrop(t.color('background')),
    glow(960, 380, 370, 0.4, (exact) => t.shade('primary', exact)),
    body(t.font('body'))(t.copy('kicker'), 0, 140, SW, 34, t.shade('text', HX.muted), {
      align: 'center',
      letterSpacing: 12,
    }),
    head(t.font('heading'))(
      t.copy('year'),
      0,
      200,
      SW,
      300,
      linear(180, t.color('text'), t.shade('text', 'rgba(255,255,255,0.12)')),
      { align: 'center', fontWeight: 800 },
    ),
    rect(140, 640, 1640, 3, t.shade('text', HX.rule), { name: 'Timeline' }),
    t.list('quarters').map((label, index) => {
      const cx = 420 + index * 360;
      const hot = index === 2;
      const color = hot ? t.color('primary') : t.color('text');
      return [
        circle(cx, 641, hot ? 20 : 15, color),
        head(t.font('heading'))(label, cx - 150, 690, 300, 44, color, { align: 'center' }),
        body(t.font('body'))(
          milestones[index] ?? '',
          cx - 150,
          760,
          300,
          24,
          t.shade('text', HX.muted),
          { align: 'center' },
        ),
      ];
    }),
  ];
});

const SEATS = [176, 204, 224] as const;

const pricingSpec = {
  colors: {
    background: {
      value: HX.night,
      hint: 'Slide background, the badge on the featured card, the button labels and the text on the featured card',
    },
    surface: { value: HX.panel, hint: 'Plan cards on each side' },
    primary: {
      value: HX.teal,
      hint: 'Glow, the buttons, the check marks and the badge text; its deeper shade starts the button gradient',
    },
    text: {
      value: HX.white,
      hint: 'Title, the featured card and the prices and features on the side cards; its grey shades color the intro, plan text and card borders',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Annual Pricing Plan' },
    intro: {
      label: 'Intro',
      value: 'Transparent pricing that grows with your team. No hidden fees.',
    },
    plans: { label: 'Plan', value: ['Starter', 'Pro', 'Business'] },
    prices: { label: 'Price', value: ['$0', '$12', '$29'] },
    unit: { label: 'Price unit', value: '/ seat' },
    badge: { label: 'Badge', value: 'Most popular' },
    descriptions: {
      label: 'Plan description',
      value: [
        'Core automations for small teams.',
        'Advanced models and faster processing.',
        'Scale with dedicated custom tuning.',
      ],
    },
    cta: { label: 'Button', value: 'Start today' },
    features: {
      label: 'Feature',
      value: [
        '3 workflows',
        'Email support',
        'Up to 5 users',
        'Unlimited workflows',
        'Priority support',
        'Up to 50 users',
        'Custom models',
        'SSO and audit logs',
        'Unlimited users',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const pricingSlide = themed(SW, SH, pricingSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const prices = t.list('prices');
  const descriptions = t.list('descriptions');
  const features = t.list('features');
  return [
    backdrop(t.color('background')),
    glow(420, 380, 370, 0.35, (exact) => t.shade('primary', exact)),
    heading(t.copy('title'), 140, 100, 1200, 80, t.color('text')),
    copy(t.copy('intro'), 140, 210, 1100, 30, t.shade('text', HX.muted)),
    t.list('plans').map((plan, index) => {
      const x = 140 + index * 560;
      const lead = index === 1;
      const ink = lead ? t.color('background') : t.color('text');
      const soft = lead ? t.shade('background', '#4b5559') : t.shade('text', HX.muted);
      return [
        rect(x, 320, 520, 690, lead ? t.color('text') : t.color('surface'), {
          name: 'Tier card',
          cornerRadius: 28,
          stroke: t.shade('text', HX.rule),
          strokeWidth: lead ? 0 : 2,
        }),
        copy(plan, x + 40, 364, 260, 28, soft, { fontWeight: 600 }),
        heading(prices[index] ?? '', x + 40, 410, 200, 84, ink),
        copy(t.copy('unit'), x + (SEATS[index] ?? 0), 452, 160, 26, soft),
        lead
          ? pill(t.copy('badge'), x + 300, 356, {
              fill: t.color('background'),
              color: t.color('primary'),
              fontSize: 20,
              fontFamily: t.font('body'),
            })
          : [],
        copy(descriptions[index] ?? '', x + 40, 530, 440, 28, soft),
        rect(x + 40, 620, 440, 68, linear(90, t.shade('primary', HX.deep), t.color('primary')), {
          name: 'Button',
          cornerRadius: 34,
        }),
        copy(t.copy('cta'), x + 40, 638, 440, 26, t.color('background'), {
          align: 'center',
          fontWeight: 700,
        }),
        [0, 1, 2].map((row) => [
          icon('check', x + 40, 740 + row * 76, 34, t.color('primary'), { strokeWidth: 3 }),
          copy(features[index * 3 + row] ?? '', x + 92, 740 + row * 76, 400, 28, ink),
        ]),
      ];
    }),
  ];
});
