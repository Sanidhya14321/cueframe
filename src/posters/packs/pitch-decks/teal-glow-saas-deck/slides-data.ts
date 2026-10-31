import { linear, radial } from '@/design';
import { circle, ellipse, rect, type ThemeSpec, themed } from '../../../kit';
import { arcBand } from '../coral-b2b-agency-deck/deck-kit';
import { BODY_FONT, backdrop, body, glow, HEADING_FONT, HX, head, SH, SW } from './theme';

const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;

const worldwideSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: {
      value: HX.teal,
      hint: 'Glow, the globe outline, its wire lines and city dots and the globe tint',
    },
    text: {
      value: HX.white,
      hint: 'Title and the market numbers; its grey shade colors the intro and the number labels',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Worldwide Market' },
    intro: { label: 'Intro', value: 'Built for scale and trusted by teams on every continent.' },
    labels: { label: 'Stat label', value: ['Active users', 'Teams', 'Partners', 'Regions'] },
    values: { label: 'Stat', value: ['84M', '312K', '146K', '42'] },
  },
} as const satisfies ThemeSpec;

export const worldwideSlide = themed(SW, SH, worldwideSpec, (t) => {
  const teal = (exact: string) => t.shade('primary', exact);
  const wire = { stroke: teal('rgba(25,227,196,0.55)'), strokeWidth: 2 };
  const clear = teal('rgba(0,0,0,0)');
  const cx = 1420;
  const cy = 560;
  const radius = 380;
  const values = t.list('values');
  return [
    backdrop(t.color('background')),
    glow(1420, 540, 500, 0.3, teal),
    circle(cx, cy, radius, radial(teal('rgba(25,227,196,0.22)'), teal('rgba(11,143,134,0.05)')), {
      stroke: t.color('primary'),
      strokeWidth: 3,
      name: 'Globe',
    }),
    [0.82, 0.56, 0.26].map((ratio) =>
      ellipse(cx - radius * ratio, cy - radius, radius * ratio * 2, radius * 2, clear, {
        ...wire,
        name: 'Meridian',
      }),
    ),
    [-0.7, -0.36, 0, 0.36, 0.7].map((offset) => {
      const half = radius * Math.sqrt(1 - offset * offset);
      return ellipse(cx - half, cy + radius * offset - half * 0.12, half * 2, half * 0.24, clear, {
        ...wire,
        name: 'Parallel',
      });
    }),
    [
      [-0.4, -0.3],
      [0.3, -0.5],
      [0.5, 0.2],
      [-0.2, 0.45],
    ].map(([dx = 0, dy = 0]) => circle(cx + dx * radius, cy + dy * radius, 12, t.color('primary'))),
    head(t.font('heading'))(t.copy('title'), 140, 160, 900, 84, t.color('text')),
    body(t.font('body'))(t.copy('intro'), 140, 280, 820, 30, t.shade('text', HX.muted)),
    t.list('labels').map((label, index) => {
      const x = 140 + (index % 2) * 380;
      const y = 500 + Math.floor(index / 2) * 230;
      return [
        body(t.font('body'))(label, x, y, 340, 28, t.shade('text', HX.muted)),
        head(t.font('heading'))(values[index] ?? '', x, y + 50, 340, 84, t.color('text')),
      ];
    }),
  ];
});

const growthSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: {
      value: HX.teal,
      hint: 'Glow and the lit bars; its deeper shade ends the bar gradient',
    },
    text: {
      value: HX.white,
      hint: 'Big percentage; its grey shades color the body text and the unlit bars',
    },
  },
  fonts: FONTS,
  copy: {
    stat: { label: 'Stat', value: '+318%' },
    body: {
      label: 'Body',
      value: 'lift in trial-to-paid conversion within\nthe first quarter after rollout.',
    },
  },
} as const satisfies ThemeSpec;

export const growthSlide = themed(SW, SH, growthSpec, (t) => [
  backdrop(t.color('background')),
  glow(960, 640, 430, 0.35, (exact) => t.shade('primary', exact)),
  Array.from({ length: 16 }, (_, index) =>
    rect(
      300 + index * 84,
      120,
      48,
      300,
      index < 9
        ? linear(180, t.color('primary'), t.shade('primary', HX.deep))
        : linear(180, t.shade('text', '#5a666c'), t.shade('text', '#2a3236')),
      { name: 'Bar', cornerRadius: 24, opacity: index < 9 ? 1 - index * 0.06 : 0.7 },
    ),
  ),
  head(t.font('heading'))(t.copy('stat'), 0, 500, SW, 200, t.color('text'), {
    align: 'center',
    fontWeight: 800,
  }),
  body(t.font('body'))(t.copy('body'), 0, 760, SW, 38, t.shade('text', HX.muted), {
    align: 'center',
  }),
]);

const GAUGE = { cx: 1440, cy: 540 };

const accelerationSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background and the gauge center' },
    surface: { value: HX.panel, hint: 'Gauge dial' },
    primary: {
      value: HX.teal,
      hint: 'Glow and the filled part of the gauge; its deeper shade starts the gauge gradient',
    },
    text: {
      value: HX.white,
      hint: 'Title, gauge knob and reading; its grey shades color the body, the reading label and the empty gauge track',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Product\nAcceleration' },
    body: {
      label: 'Body',
      value:
        'Helixa removes onboarding friction and automates the busywork, so new customers reach real value in days. Teams adopt faster and expand sooner.',
    },
    stat: { label: 'Gauge reading', value: '7,200' },
    statLabel: { label: 'Reading label', value: 'Ops per second' },
  },
} as const satisfies ThemeSpec;

export const accelerationSlide = themed(SW, SH, accelerationSpec, (t) => [
  backdrop(t.color('background')),
  glow(1440, 540, 470, 0.35, (exact) => t.shade('primary', exact)),
  head(t.font('heading'))(t.copy('title'), 140, 200, 800, 90, t.color('text')),
  body(t.font('body'))(t.copy('body'), 140, 440, 720, 30, t.shade('text', HX.muted)),
  circle(GAUGE.cx, GAUGE.cy, 320, t.color('surface')),
  arcBand(GAUGE.cx, GAUGE.cy, 290, 236, -130, 130, t.shade('text', 'rgba(255,255,255,0.1)')),
  arcBand(
    GAUGE.cx,
    GAUGE.cy,
    290,
    236,
    -130,
    60,
    linear(90, t.shade('primary', HX.deep), t.color('primary')),
  ),
  circle(
    GAUGE.cx + 263 * Math.sin(Math.PI / 3),
    GAUGE.cy - 263 * Math.cos(Math.PI / 3),
    22,
    t.color('text'),
  ),
  circle(GAUGE.cx, GAUGE.cy, 190, t.shade('background', '#0b1013')),
  head(t.font('heading'))(t.copy('stat'), GAUGE.cx - 190, GAUGE.cy - 64, 380, 84, t.color('text'), {
    align: 'center',
  }),
  body(t.font('body'))(
    t.copy('statLabel'),
    GAUGE.cx - 190,
    GAUGE.cy + 40,
    380,
    28,
    t.shade('text', HX.muted),
    { align: 'center' },
  ),
]);

const servicesSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: { value: HX.teal, hint: 'Two glows and every second service line' },
    text: {
      value: HX.white,
      hint: 'First and third service lines; its grey shade colors the closing text',
    },
  },
  fonts: FONTS,
  copy: {
    services: {
      label: 'Service',
      value: ['Usage Billing', 'Team Workspaces', 'Enterprise SSO', 'Data Residency'],
    },
    body: {
      label: 'Closing text',
      value:
        'From the first invoice to global compliance, one platform keeps every workflow covered.',
    },
  },
} as const satisfies ThemeSpec;

export const servicesSlide = themed(SW, SH, servicesSpec, (t) => [
  backdrop(t.color('background')),
  glow(380, 700, 370, 0.4, (exact) => t.shade('primary', exact)),
  glow(1500, 380, 370, 0.25, (exact) => t.shade('primary', exact)),
  t
    .list('services')
    .map((line, index) =>
      head(t.font('heading'))(
        line,
        0,
        200 + index * 120,
        SW,
        96,
        index % 2 === 0 ? t.color('text') : t.color('primary'),
        { align: 'center' },
      ),
    ),
  body(t.font('body'))(t.copy('body'), 410, 740, 1100, 30, t.shade('text', HX.muted), {
    align: 'center',
  }),
]);
