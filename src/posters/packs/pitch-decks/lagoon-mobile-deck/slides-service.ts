import { avatar, circle, icon, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  chip,
  copy,
  type DeckTheme,
  device,
  FRAME,
  HEADING,
  LAGOON,
  pageGradient,
  SH,
  SW,
  statCard,
  title,
  WHITE,
} from './deck-kit';
import {
  CHART_CAPTION,
  CHART_TITLE,
  chartScreen,
  DASH_STATS,
  dashboardScreen,
  PROFILE_NAME,
  PROFILE_STATS,
  profileScreen,
  SCREEN_TITLES,
} from './deck-screens';

const MEMBERS = ['woman-portrait-5', 'man-portrait-1', 'woman-portrait-2'] as const;

export const serviceSlide = (theme: DeckTheme) =>
  themed(
    SW,
    SH,
    {
      colors: {
        background: {
          value: theme.deep,
          hint: 'Page, phone screens and the plus icon; its shades color the far end of the page gradient, the phone frames, the profile numbers and the members pill',
        },
        accent: {
          value: theme.glow,
          hint: 'Avatar rings, the plus button, the bright dashboard tile, the ring chart and the profile dots',
        },
        secondary: { value: theme.warm, hint: 'Warm dashboard tile' },
        text: {
          value: WHITE,
          hint: 'Title, members line and dashboard text; its tinted shade colors the body, its translucent shades the dashboard tiles and rows',
        },
        surface: {
          value: WHITE,
          hint: 'Profile screen; its tints color the profile cards and lines, its dark shade the profile name and title',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'Service That\nFeels Personal' },
        body: {
          label: 'Body',
          value:
            'Every user gets a guided, human experience: instant answers, proactive alerts and support that knows their history before they ask.',
        },
        members: { label: 'Members line', value: 'Join 12,000+\nhappy members' },
        screens: SCREEN_TITLES,
        stats: DASH_STATS,
        name: PROFILE_NAME,
        profileStats: PROFILE_STATS,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const f = { head: t.font('heading'), body: t.font('body') };
      const deep = t.color('background');
      const mid = t.shade('background', theme.mid);
      const frame = t.shade('background', FRAME);
      const glass = t.shade('text', 'rgba(255,255,255,0.14)');
      const [dashTitle = '', profileTitle = ''] = t.list('screens');
      return [
        pageGradient(deep, mid),
        device(
          150,
          110,
          330,
          undefined,
          deep,
          frame,
          dashboardScreen(
            {
              top: deep,
              bottom: mid,
              text: t.color('text'),
              tiles: [glass, t.color('accent'), t.color('secondary'), glass],
              ring: t.color('accent'),
              hole: deep,
              row: t.shade('text', 'rgba(255,255,255,0.12)'),
            },
            f,
            dashTitle,
            t.list('stats'),
          ),
        ),
        device(
          420,
          300,
          330,
          undefined,
          deep,
          frame,
          profileScreen(
            {
              screen: t.color('surface'),
              text: t.shade('surface', theme.ink),
              ring: t.color('accent'),
              stat: t.shade('background', theme.mid),
              card: t.shade('surface', theme.surface),
              dot: t.color('accent'),
              line: t.shade('surface', theme.soft),
            },
            f,
            profileTitle,
            t.copy('name'),
            t.list('profileStats'),
          ),
        ),
        title(f.head)(t.copy('title'), 900, 170, 900, 100, t.color('text')),
        copy(f.body)(t.copy('body'), 900, 430, 860, 30, t.shade('text', theme.soft)),
        rect(900, 760, 700, 140, t.shade('background', 'rgba(0,0,0,0.25)'), {
          cornerRadius: 70,
          name: 'Members pill',
        }),
        MEMBERS.map((member, index) =>
          avatar(member, 980 + index * 80, 830, 46, t.color('accent')),
        ),
        circle(1220, 830, 46, t.color('accent')),
        icon('plus', 1196, 806, 48, deep, { strokeWidth: 3 }),
        text(t.copy('members'), 1300, 788, 300, {
          fontFamily: f.head,
          fontSize: 32,
          fontWeight: 800,
          fill: t.color('text'),
          lineHeight: 1.15,
        }),
      ];
    },
  );

const T = LAGOON;

const impactSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: {
      value: T.mid,
      hint: 'Chip icon tile and the dark stat cards; its darker shades color the phone screen, phone frame and card shadows',
    },
    accent: { value: T.glow, hint: 'Chart line, area and bars' },
    text: {
      value: T.ink,
      hint: 'Title, chip title and the light stat number; its muted shade colors the body and light labels',
    },
    surface: {
      value: WHITE,
      hint: 'Chip, light stat card, chip icon, white numbers and the phone headline; its mint shade colors dark card labels and the chart caption, its translucent shade the tab bar',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Scalable\nImpact' },
    body: {
      label: 'Body',
      value:
        'Teams automate routine work, personalise every flow and see results within the first month of rollout.',
    },
    chipTitle: { label: 'Chip title', value: '+35% Sprint Velocity' },
    chipSub: { label: 'Chip subline', value: 'Ahead of Q3 targets' },
    chartTitle: CHART_TITLE,
    chartCaption: CHART_CAPTION,
    values: { label: 'Stat', value: ['56K', '3.2x', '94%'] },
    labels: { label: 'Stat label', value: ['Hours saved', 'Efficiency gain', 'Task accuracy'] },
  },
} as const satisfies ThemeSpec;

const STATS = [
  { x: 830, y: 240, dark: false },
  { x: 900, y: 720, dark: true },
  { x: 1580, y: 660, dark: true },
] as const;

export const impactSlide = themed(SW, SH, impactSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const deep = t.shade('primary', T.deep);
  const labels = t.list('labels');
  const values = t.list('values');
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    title(f.head)(t.copy('title'), 120, 110, 700, 100, t.color('text')),
    copy(f.body)(t.copy('body'), 120, 360, 640, 30, t.shade('text', T.muted)),
    chip(
      {
        card: t.color('surface'),
        shadow: t.shade('primary', 'rgba(4,38,58,0.18)'),
        tile: t.color('primary'),
        icon: t.color('surface'),
        heading: t.color('text'),
        sub: t.shade('text', T.muted),
      },
      f,
      120,
      760,
      520,
      t.copy('chipTitle'),
      t.copy('chipSub'),
      'trending-up',
    ),
    device(
      1100,
      90,
      420,
      12,
      deep,
      t.shade('primary', FRAME),
      chartScreen(
        {
          screen: deep,
          title: t.color('surface'),
          caption: t.shade('surface', T.soft),
          chart: t.color('accent'),
          fade: t.shade('surface', 'rgba(255,255,255,0)'),
          clear: t.shade('accent', 'rgba(0,0,0,0)'),
          tab: t.shade('surface', 'rgba(255,255,255,0.12)'),
        },
        f,
        t.copy('chartTitle'),
        t.copy('chartCaption'),
      ),
    ),
    STATS.map((stat, index) =>
      statCard(
        stat.dark
          ? {
              card: t.color('primary'),
              shadow: t.shade('primary', 'rgba(4,38,58,0.16)'),
              value: t.color('surface'),
              label: t.shade('surface', T.soft),
            }
          : {
              card: t.color('surface'),
              shadow: t.shade('primary', 'rgba(4,38,58,0.16)'),
              value: t.color('text'),
              label: t.shade('text', T.muted),
            },
        f,
        stat.x,
        stat.y,
        values[index] ?? '',
        labels[index] ?? '',
      ),
    ),
  ];
});
