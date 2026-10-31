import { linear } from '@/design';
import { bars, circle, icon, type Nodes, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  copy,
  device,
  FRAME,
  HEADING,
  kicker,
  LAGOON,
  pageGradient,
  SH,
  SW,
  title,
  WHITE,
} from './deck-kit';

const T = LAGOON;

const revenueSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: {
      value: T.mid,
      hint: 'Multiplier badge, the chart panel and the base of the bars; its darker shade is the top of the panel',
    },
    accent: { value: T.glow, hint: 'Chart kicker and the top of the bars' },
    text: {
      value: T.ink,
      hint: 'Title and the revenue figure; its muted shade colors the body and caption',
    },
    surface: {
      value: WHITE,
      hint: 'Multiplier figure; its translucent shade colors the grid lines, its mint shade the years',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Revenue\nProjections' },
    body: {
      label: 'Body',
      value:
        'Recurring revenue compounds as teams expand seats, add workspaces and upgrade to Scale.',
    },
    multiplier: { label: 'Multiplier', value: '2.5x' },
    revenue: { label: 'Revenue figure', value: '$250k' },
    caption: { label: 'Revenue caption', value: 'Year-two ARR target' },
    years: { label: 'Year', value: ['2026', '2027', '2028', '2029'] },
    kicker: { label: 'Chart kicker', value: 'Annual recurring revenue' },
  },
} as const satisfies ThemeSpec;

export const revenueSlide = themed(SW, SH, revenueSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    title(f.head)(t.copy('title'), 120, 130, 800, 96, t.color('text')),
    copy(f.body)(t.copy('body'), 120, 380, 720, 30, t.shade('text', T.muted)),
    rect(120, 700, 220, 130, t.color('primary'), { cornerRadius: 24, name: 'Multiplier' }),
    text(t.copy('multiplier'), 120, 728, 220, {
      fontFamily: f.head,
      fontSize: 64,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
    }),
    text(t.copy('revenue'), 390, 712, 400, {
      fontFamily: f.head,
      fontSize: 72,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    copy(f.body)(t.copy('caption'), 392, 800, 400, 24, t.shade('text', T.muted)),
    rect(1000, 0, 920, SH, linear(160, t.shade('primary', T.deep), t.color('primary')), {
      name: 'Chart panel',
    }),
    [0, 1, 2, 3].map((index) =>
      rect(1120, 260 + index * 160, 700, 2, t.shade('surface', 'rgba(255,255,255,0.12)'), {
        name: 'Grid',
      }),
    ),
    bars(
      1120,
      300,
      700,
      560,
      [32, 50, 74, 100],
      linear(180, t.color('accent'), t.color('primary')),
      0.4,
    ),
    t.list('years').map((year, index) =>
      text(year, 1120 + index * 175, 890, 175, {
        fontFamily: f.body,
        fontSize: 24,
        fontWeight: 600,
        fill: t.shade('surface', T.soft),
        align: 'center',
      }),
    ),
    kicker(f.body, t.copy('kicker'), 1120, 150, t.color('accent')),
  ];
});

interface SyncPaint {
  top: string;
  bottom: string;
  halo: string;
  cloud: string;
  status: string;
  label: string;
}

const syncScreen =
  (c: SyncPaint, font: string, status: string) =>
  (width: number, height: number): Nodes[] => [
    rect(0, 0, width, height, linear(180, c.top, c.bottom), {
      cornerRadius: width * 0.12,
      name: 'Screen',
    }),
    circle(width / 2, height * 0.42, width * 0.26, c.halo),
    icon('cloud-upload', width * 0.32, height * 0.42 - width * 0.18, width * 0.36, c.cloud, {
      strokeWidth: 1.8,
    }),
    rect(width * 0.18, height * 0.62, width * 0.64, height * 0.07, c.status, {
      cornerRadius: height * 0.035,
      name: 'Status',
    }),
    text(status, width * 0.18, height * 0.637, width * 0.64, {
      fontFamily: font,
      fontSize: width * 0.065,
      fontWeight: 700,
      fill: c.label,
      align: 'center',
    }),
  ];

const syncSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: {
      value: T.mid,
      hint: 'Step tags and the phone screen; its darker shades color the top of the screen, the phone frame and Sync active',
    },
    accent: { value: T.glow, hint: 'Sync status pill' },
    text: {
      value: T.ink,
      hint: 'Title and step titles; its muted shade colors the step text',
    },
    surface: { value: WHITE, hint: 'Cloud icon; its translucent shade colors the ring behind it' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: '4-Step Sync Protocol' },
    status: { label: 'Status', value: 'Sync active' },
    tags: {
      label: 'Step tag',
      value: ['01 / CAPTURE', '02 / SECURE', '03 / PROCESS', '04 / DELIVER'],
    },
    steps: {
      label: 'Step',
      value: ['Live Metrics', 'Zero-Trust Vault', 'Edge Parsing', 'Every Device'],
    },
    details: {
      label: 'Step text',
      value: [
        'Device data collected instantly.',
        'Encrypted at rest and in transit.',
        'Global nodes respond in 50ms.',
        'Seamless, real-time multi-device state.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const syncSlide = themed(SW, SH, syncSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const deep = t.shade('primary', T.deep);
  const steps = t.list('steps');
  const details = t.list('details');
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    title(f.head)(t.copy('title'), 0, 80, SW, 84, t.color('text'), 'center'),
    device(
      810,
      260,
      300,
      undefined,
      deep,
      t.shade('primary', FRAME),
      syncScreen(
        {
          top: deep,
          bottom: t.color('primary'),
          halo: t.shade('surface', 'rgba(255,255,255,0.12)'),
          cloud: t.color('surface'),
          status: t.color('accent'),
          label: deep,
        },
        f.body,
        t.copy('status'),
      ),
    ),
    t.list('tags').map((tag, index) => {
      const right = index >= 2;
      const x = right ? 1220 : 200;
      const y = 360 + (index % 2) * 300;
      const align = right ? 'left' : 'right';
      return [
        text(tag, x, y, 500, {
          fontFamily: f.body,
          fontSize: 22,
          fontWeight: 700,
          fill: t.color('primary'),
          letterSpacing: 2,
          align,
        }),
        text(steps[index] ?? '', x, y + 36, 500, {
          fontFamily: f.head,
          fontSize: 42,
          fontWeight: 800,
          fill: t.color('text'),
          align,
        }),
        text(details[index] ?? '', x, y + 96, 500, {
          fontFamily: f.body,
          fontSize: 26,
          fontWeight: 400,
          fill: t.shade('text', T.muted),
          align,
        }),
      ];
    }),
  ];
});
