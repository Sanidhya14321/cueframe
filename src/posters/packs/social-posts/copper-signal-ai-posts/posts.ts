import { linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  pill,
  poly,
  polygon,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const COPPER = {
  black: '#110b07',
  panel: '#211710',
  copper: '#ff8a3d',
  burnt: '#7a3a12',
  amber: '#ffc07a',
  pale: '#ffeedd',
  grey: '#b8a291',
  white: '#ffffff',
  cream: '#fff7ef',
  ink: '#2a1a10',
  clear: 'rgba(255,138,61,0)',
};

export const HEADING = { label: 'Heading font', value: 'Urbanist' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const BRAND = { label: 'Brand', value: 'KILNWORKS AI' } as const;

export const { width: W, height: H } = POST_SIZE;

export const copperFill = (copper: string, amber: string) => linear(90, copper, amber);

export const brand = (label: string, y: number, color: string, fontFamily: string) =>
  text(label, 0, y, W, {
    fontFamily,
    fontSize: 30,
    fontWeight: 800,
    fill: color,
    align: 'center',
    letterSpacing: 4,
  });

export const glow = (
  cx: number,
  cy: number,
  radius: number,
  inner: string,
  clear: string,
  height: number = H,
) =>
  circle(
    cx,
    cy,
    Math.min(radius, cx, W - cx, cy, height - cy),
    {
      type: 'radial',
      stops: [
        { offset: 0, color: inner },
        { offset: 0.7, color: clear },
        { offset: 1, color: clear },
      ],
    },
    { name: 'Glow' },
  );

export const glowStop = (strength: number) => `rgba(255,138,61,${strength})`;

const cursor = (x: number, y: number, scale: number, fill: string) =>
  poly(
    [
      [x, y],
      [x, y + 70 * scale],
      [x + 18 * scale, y + 54 * scale],
      [x + 32 * scale, y + 84 * scale],
      [x + 44 * scale, y + 78 * scale],
      [x + 30 * scale, y + 49 * scale],
      [x + 54 * scale, y + 49 * scale],
    ],
    fill,
    { name: 'Cursor' },
  );

export const centered = (
  content: string,
  y: number,
  size: number,
  weight: number,
  fill: string | ReturnType<typeof linear>,
  fontFamily: string,
) =>
  text(content, 0, y, W, {
    fontFamily,
    fontSize: size,
    fontWeight: weight,
    fill,
    align: 'center',
  });

const TOGGLES = [
  { label: '24/7\nSupport', x: 150, y: 480 },
  { label: 'Expert\nTeam', x: 490, y: 650 },
  { label: 'Clear\nReports', x: 150, y: 820 },
];

const togglesSpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page gradient; its warmer shade colors the top of the page',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow, Real Outcomes and the toggles; its amber and burnt shades finish those gradients',
    },
    text: {
      value: COPPER.white,
      hint: 'Designed to Deliver, the toggle labels and knobs and the brand name',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Designed to Deliver' },
    accent: { label: 'Highlighted line', value: 'Real Outcomes' },
    toggles: { label: 'Toggle', value: TOGGLES.map((item) => item.label) },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const toggles = themed(W, H, togglesSpec, (t) => {
  const labels = t.list('toggles');
  return [
    rect(0, 0, W, H, linear(160, t.shade('background', '#26180e'), t.color('background')), {
      name: 'Background',
    }),
    glow(540, 760, 460, t.shade('primary', glowStop(0.32)), t.shade('primary', COPPER.clear)),
    centered(t.copy('title'), 150, 64, 500, t.color('text'), t.font('heading')),
    centered(
      t.copy('accent'),
      230,
      92,
      800,
      copperFill(t.color('primary'), t.shade('primary', COPPER.amber)),
      t.font('heading'),
    ),
    TOGGLES.map((item, index) => [
      rect(
        item.x,
        item.y,
        440,
        130,
        linear(90, t.shade('primary', COPPER.burnt), t.color('primary')),
        {
          cornerRadius: 65,
          name: 'Toggle',
        },
      ),
      circle(item.x + 375, item.y + 65, 50, t.color('text'), { name: 'Knob' }),
      text(labels[index] ?? '', item.x + 44, item.y + 26, 280, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 700,
        fill: t.color('text'),
        lineHeight: 1.15,
      }),
    ]),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const MISTAKE_PILLS = [
  { label: 'Bias', x: 250, y: 320 },
  { label: 'Overreliance', x: 640, y: 400 },
  { label: 'Data leaks', x: 200, y: 900 },
] as const;

const mistakesSpec = {
  colors: {
    background: {
      value: COPPER.cream,
      hint: 'Page gradient; its peach shade colors the bottom of the page',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow and AI Mistakes; its amber shade finishes the title gradient',
    },
    surface: { value: COPPER.white, hint: 'Pill lettering' },
    text: {
      value: COPPER.ink,
      hint: "Brand name, pills, You Can't Afford, the cursor and the Learn more button; its brown shade colors the body text",
    },
  },
  fonts: { heading: HEADING, body: BODY, tag: { label: 'Pill font', value: 'Inter' } },
  copy: {
    brand: BRAND,
    pills: { label: 'Pill', value: MISTAKE_PILLS.map((item) => item.label) },
    title: { label: 'Title', value: 'AI Mistakes' },
    subtitle: { label: 'Subtitle', value: "You Can't Afford" },
    body: {
      label: 'Body',
      value: 'Skip these traps and get better\nresults from every model you use.',
    },
    cta: { label: 'Button', value: 'Learn more' },
  },
} as const satisfies ThemeSpec;

export const mistakes = themed(W, H, mistakesSpec, (t) => {
  const pills = t.list('pills');
  const pillNode = (index: number) => {
    const item = MISTAKE_PILLS[index] ?? MISTAKE_PILLS[0];
    return pill(pills[index] ?? '', item.x, item.y, {
      fill: t.color('text'),
      color: t.color('surface'),
      fontSize: 26,
      fontFamily: t.font('tag'),
    });
  };
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#ffdcc0')), {
      name: 'Background',
    }),
    glow(860, 1150, 300, t.shade('primary', glowStop(0.35)), t.shade('primary', COPPER.clear)),
    brand(t.copy('brand'), 90, t.color('text'), t.font('heading')),
    pillNode(0),
    pillNode(1),
    centered(
      t.copy('title'),
      470,
      120,
      800,
      copperFill(t.color('primary'), t.shade('primary', COPPER.amber)),
      t.font('heading'),
    ),
    centered(t.copy('subtitle'), 610, 70, 500, t.color('text'), t.font('heading')),
    text(t.copy('body'), 0, 720, W, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 500,
      fill: t.shade('text', '#6b5446'),
      align: 'center',
      lineHeight: 1.4,
    }),
    pillNode(2),
    cursor(600, 930, 1.3, t.color('text')),
    rect(700, 1080, 260, 76, t.shade('background', 'rgba(0,0,0,0)'), {
      cornerRadius: 38,
      stroke: t.color('text'),
      strokeWidth: 3,
      name: 'Button',
    }),
    text(t.copy('cta'), 700, 1100, 260, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
});

const STATS: {
  icon: 'users' | 'clipboard-list' | 'gauge';
  label: string;
  value: string;
  unit: string;
}[] = [
  { icon: 'users', label: 'Active members', value: '2.4', unit: 'Million' },
  { icon: 'clipboard-list', label: 'Approval score', value: '98.7', unit: '' },
  { icon: 'gauge', label: 'Growth rate', value: '86%', unit: '' },
];

const statSpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page gradient; its warmer shade colors the top of the page',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow, hexagon outlines and the unit; its tints fill the hexagons and color the icons',
    },
    secondary: { value: COPPER.grey, hint: 'Stat labels' },
    text: { value: COPPER.white, hint: 'Stat values and the brand name' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    labels: { label: 'Stat label', value: STATS.map((item) => item.label) },
    values: { label: 'Stat value', value: STATS.map((item) => item.value) },
    unit: { label: 'Unit', value: 'Million', hint: 'Shown after the first value' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const statRows = themed(W, H, statSpec, (t) => {
  const labels = t.list('labels');
  const values = t.list('values');
  return [
    rect(0, 0, W, H, linear(160, t.shade('background', '#26180e'), t.color('background')), {
      name: 'Background',
    }),
    glow(760, 640, 380, t.shade('primary', glowStop(0.3)), t.shade('primary', COPPER.clear)),
    STATS.map((item, index): Nodes[] => {
      const y = 170 + index * 320;
      return [
        polygon(6, 110, y, 200, 200, t.shade('primary', 'rgba(255,138,61,0.08)'), {
          stroke: t.color('primary'),
          strokeWidth: 4,
          name: 'Hexagon',
        }),
        icon(item.icon, 160, y + 50, 100, t.shade('primary', COPPER.amber), { strokeWidth: 1.8 }),
        text(labels[index] ?? '', 360, y + 20, 600, {
          fontFamily: t.font('body'),
          fontSize: 30,
          fontWeight: 600,
          fill: t.color('secondary'),
        }),
        text(values[index] ?? '', 356, y + 64, 400, {
          fontFamily: t.font('heading'),
          fontSize: 124,
          fontWeight: 800,
          fill: t.color('text'),
          lineHeight: 1,
        }),
        item.unit === ''
          ? []
          : text(t.copy('unit'), 548, y + 128, 300, {
              fontFamily: t.font('heading'),
              fontSize: 48,
              fontWeight: 800,
              fill: copperFill(t.color('primary'), t.shade('primary', COPPER.amber)),
            }),
      ];
    }),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});
