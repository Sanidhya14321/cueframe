import { type DesignIconName, linear } from '@/design';
import { circle, icon, photo, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  chip,
  copy,
  device,
  FRAME,
  HEADING,
  iconTile,
  kicker,
  LAGOON,
  pageGradient,
  SH,
  SW,
  title,
  WHITE,
  wordmark,
} from './deck-kit';
import {
  CHART_CAPTION,
  CHART_TITLE,
  chartScreen,
  DASH_STATS,
  DASH_TITLE,
  dashboardScreen,
} from './deck-screens';

const T = LAGOON;
const CHIP = {
  title: { label: 'Chip title', value: '+35% Sprint Velocity' },
  sub: { label: 'Chip subline', value: 'Ahead of Q3 targets' },
} as const;

const coverSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: {
      value: T.mid,
      hint: 'Hero panel and the dashboard screen; its darker shades color the panel top, phone screens, phone frames and the arrow icon',
    },
    accent: { value: T.glow, hint: 'Logo mark, the chart and the bright dashboard tile and ring' },
    secondary: { value: T.warm, hint: 'Amber dashboard tile' },
    text: {
      value: WHITE,
      hint: 'Logo name, title, screen text, logo dot and the arrow button; its mint shade colors the body and chart caption, its translucent shades the screen tiles and rows',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: { label: 'Brand name', value: 'nimbo' },
    title: { label: 'Title', value: 'Mobile Product\nPitch Deck' },
    body: {
      label: 'Body',
      value:
        'A next-generation engagement platform built for speed, retention and happier customers.',
    },
    chartTitle: CHART_TITLE,
    chartCaption: CHART_CAPTION,
    dashTitle: DASH_TITLE,
    stats: DASH_STATS,
  },
} as const satisfies ThemeSpec;

export const coverSlide = themed(SW, SH, coverSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const deep = t.shade('primary', T.deep);
  const frame = t.shade('primary', FRAME);
  const glass = t.shade('text', 'rgba(255,255,255,0.14)');
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    rect(70, 70, 1780, 940, linear(125, deep, t.color('primary')), {
      cornerRadius: 48,
      name: 'Panel',
    }),
    wordmark(
      { mark: t.color('accent'), dot: t.color('text'), text: t.color('text') },
      f.head,
      t.copy('brand'),
      150,
      150,
      64,
    ),
    title(f.head)(t.copy('title'), 150, 320, 1000, 112, t.color('text')),
    copy(f.body)(t.copy('body'), 150, 600, 760, 32, t.shade('text', T.soft)),
    device(
      1110,
      130,
      330,
      -8,
      deep,
      frame,
      chartScreen(
        {
          screen: deep,
          title: t.color('text'),
          caption: t.shade('text', T.soft),
          chart: t.color('accent'),
          fade: t.shade('text', 'rgba(255,255,255,0)'),
          clear: t.shade('accent', 'rgba(0,0,0,0)'),
          tab: t.shade('text', 'rgba(255,255,255,0.12)'),
        },
        f,
        t.copy('chartTitle'),
        t.copy('chartCaption'),
      ),
    ),
    device(
      1390,
      210,
      300,
      7,
      deep,
      frame,
      dashboardScreen(
        {
          top: deep,
          bottom: t.color('primary'),
          text: t.color('text'),
          tiles: [glass, t.color('accent'), t.color('secondary'), glass],
          ring: t.color('accent'),
          hole: deep,
          row: t.shade('text', 'rgba(255,255,255,0.12)'),
        },
        f,
        t.copy('dashTitle'),
        t.list('stats'),
      ),
    ),
    rect(1690, 850, 110, 110, t.color('text'), { cornerRadius: 26, name: 'Arrow button' }),
    icon('arrow-up-right', 1715, 875, 60, t.shade('primary', T.ink), { strokeWidth: 2.6 }),
  ];
});

const PROGRESS = [0.84, 0.68, 0.91] as const;

const spotlightSpec = {
  colors: {
    background: {
      value: T.deep,
      hint: 'Page and the fade over the photo; its shades color the far end of the page gradient and the chip shadow',
    },
    primary: { value: T.mid, hint: 'Start of the progress fills and the chip icon tile' },
    accent: { value: T.glow, hint: 'Customer spotlight kicker and the end of the progress fills' },
    text: {
      value: WHITE,
      hint: 'Title and the progress labels; its mint shade colors the quote, its translucent shade the progress tracks',
    },
    surface: {
      value: WHITE,
      hint: 'Progress knobs, the chip card and its icon; its dark shades color the percentages and the chip text',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Customer spotlight' },
    title: { label: 'Title', value: 'Head of Product' },
    quote: {
      label: 'Quote',
      value:
        '"Nimbo reshaped our onboarding in six weeks. Setup friction dropped and daily active use climbed faster than any launch we have run."',
    },
    labels: {
      label: 'Progress label',
      value: ['Onboarding completion', 'Feature adoption', 'Weekly productivity'],
    },
    percents: { label: 'Progress value', value: ['84%', '68%', '91%'] },
    chipTitle: CHIP.title,
    chipSub: CHIP.sub,
  },
} as const satisfies ThemeSpec;

export const spotlightSlide = themed(SW, SH, spotlightSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const percents = t.list('percents');
  const progress = (label: string, index: number) => {
    const value = PROGRESS[index] ?? 0;
    const y = 560 + index * 100;
    return [
      rect(120, y, 780, 60, t.shade('text', 'rgba(255,255,255,0.12)'), {
        cornerRadius: 30,
        name: 'Track',
      }),
      rect(120, y, 780 * value, 60, linear(90, t.color('primary'), t.color('accent')), {
        cornerRadius: 30,
        name: 'Fill',
      }),
      text(label, 150, y + 15, 500, {
        fontFamily: f.body,
        fontSize: 26,
        fontWeight: 600,
        fill: t.color('text'),
      }),
      circle(120 + 780 * value, y + 30, 40, t.color('surface')),
      text(percents[index] ?? '', 80 + 780 * value, y + 17, 80, {
        fontFamily: f.head,
        fontSize: 24,
        fontWeight: 800,
        fill: t.shade('surface', T.ink),
        align: 'center',
      }),
    ];
  };
  return [
    pageGradient(t.color('background'), t.shade('background', T.mid)),
    photo('man-portrait-3', 1060, 0, 860, SH),
    rect(
      1060,
      0,
      360,
      SH,
      linear(90, t.color('background'), t.shade('background', 'rgba(4,38,58,0)')),
      { name: 'Fade' },
    ),
    kicker(f.body, t.copy('kicker'), 120, 130, t.color('accent')),
    title(f.head)(t.copy('title'), 120, 175, 900, 96, t.color('text')),
    copy(f.body)(t.copy('quote'), 120, 320, 840, 30, t.shade('text', T.soft)),
    t.list('labels').map(progress),
    chip(
      {
        card: t.color('surface'),
        shadow: t.shade('background', 'rgba(4,38,58,0.18)'),
        tile: t.color('primary'),
        icon: t.color('surface'),
        heading: t.shade('surface', T.ink),
        sub: t.shade('surface', T.muted),
      },
      f,
      1240,
      780,
      480,
      t.copy('chipTitle'),
      t.copy('chipSub'),
      'trending-up',
    ),
  ];
});

const PILLAR_ICONS: readonly DesignIconName[] = ['shield-check', 'gauge', 'brain'];

const pillarsSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: { value: T.mid, hint: 'Pillar cards; its darker shade is the top of each card' },
    text: {
      value: T.ink,
      hint: 'Title; its muted shade colors the intro, its black shade the notches on the pillar cards',
    },
    surface: {
      value: WHITE,
      hint: 'Pillar titles and icons; its translucent shade colors the icon tiles, its mint shade the pillar text',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Built on Three Pillars' },
    intro: {
      label: 'Intro',
      value:
        'How our core platform removes friction, drives daily engagement and scales without manual work.',
    },
    names: {
      label: 'Pillar',
      value: ['Bank-Grade Security', 'Sub-50ms Sync', 'Predictive Engine'],
    },
    bodies: {
      label: 'Pillar text',
      value: [
        'End-to-end encryption with audit-ready logs.',
        'Real-time data on every device, worldwide.',
        'Models that learn what each user needs next.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const pillarsSlide = themed(SW, SH, pillarsSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const bodies = t.list('bodies');
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    title(f.head)(t.copy('title'), 0, 100, SW, 88, t.color('text'), 'center'),
    copy(f.body)(t.copy('intro'), 360, 220, 1200, 30, t.shade('text', T.muted), 'center'),
    t.list('names').map((name, index) => {
      const x = 300 + index * 460;
      return [
        rect(x, 420, 360, 660, linear(180, t.shade('primary', T.deep), t.color('primary')), {
          cornerRadius: 56,
          name: 'Phone top',
        }),
        rect(x + 135, 440, 90, 26, t.shade('text', '#000000'), {
          cornerRadius: 13,
          name: 'Island',
        }),
        iconTile(
          PILLAR_ICONS[index] ?? 'star',
          x + 135,
          540,
          90,
          t.shade('surface', 'rgba(255,255,255,0.14)'),
          t.color('surface'),
        ),
        text(name, x + 10, 670, 340, {
          fontFamily: f.head,
          fontSize: 30,
          fontWeight: 800,
          fill: t.color('surface'),
          align: 'center',
        }),
        copy(f.body)(
          bodies[index] ?? '',
          x + 40,
          725,
          280,
          22,
          t.shade('surface', T.soft),
          'center',
        ),
      ];
    }),
  ];
});
