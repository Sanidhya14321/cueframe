import { type DesignIconName, linear } from '@/design';
import { path, pill, rating, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  CLEAR,
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
} from './deck-kit';
import {
  DASH_STATS,
  dashboardScreen,
  PROFILE_NAME,
  PROFILE_STATS,
  profileScreen,
  SCREEN_TITLES,
} from './deck-screens';

const T = LAGOON;

const point = (degrees: number) => {
  const radians = (degrees * Math.PI) / 180;
  return `${(100 + 80 * Math.sin(radians)).toFixed(2)} ${(100 - 80 * Math.cos(radians)).toFixed(2)}`;
};

const arc = (
  x: number,
  y: number,
  size: number,
  from: number,
  to: number,
  color: string,
  clear: string,
  width: number,
) =>
  path(
    `M${point(from)} A80 80 0 ${to - from > 180 ? 1 : 0} 1 ${point(to)}`,
    x,
    y,
    size,
    size,
    clear,
    { width: 200, height: 200 },
    { stroke: color, strokeWidth: width, name: 'Arc' },
  );

const SEGMENT_ICONS: readonly DesignIconName[] = ['briefcase', 'megaphone', 'rocket'];

const audienceSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: { value: T.mid, hint: 'First arc and the first segment tile' },
    accent: { value: T.glow, hint: 'Second arc and the second segment tile' },
    secondary: { value: T.warm, hint: 'Third arc and the third segment tile' },
    text: {
      value: T.ink,
      hint: 'Title, Key Segments and segment names; its muted shade colors the descriptions',
    },
    surface: { value: WHITE, hint: 'Segment icons' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Target Audience' },
    center: { label: 'Chart label', value: 'Key\nSegments' },
    segments: {
      label: 'Segment',
      value: ['58%  Product Leaders', '26%  Growth Marketers', '16%  Startup Founders'],
    },
    details: {
      label: 'Segment text',
      value: [
        'Own roadmaps and need clear usage data.',
        'Run lifecycle campaigns across channels.',
        'Want fast insight without a data team.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const audienceSlide = themed(SW, SH, audienceSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const details = t.list('details');
  const tints = [t.color('primary'), t.color('accent'), t.color('secondary')];
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    title(f.head)(t.copy('title'), 120, 100, 1000, 88, t.color('text')),
    arc(220, 300, 620, 2, 207, t.color('primary'), t.shade('primary', CLEAR), 34),
    arc(220, 300, 620, 211, 299, t.color('accent'), t.shade('accent', CLEAR), 34),
    arc(220, 300, 620, 303, 358, t.color('secondary'), t.shade('secondary', CLEAR), 34),
    text(t.copy('center'), 220, 545, 620, {
      fontFamily: f.head,
      fontSize: 54,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.1,
    }),
    t.list('segments').map((segment, index) => {
      const y = 320 + index * 200;
      return [
        iconTile(
          SEGMENT_ICONS[index] ?? 'briefcase',
          960,
          y,
          96,
          tints[index] ?? t.color('primary'),
          t.color('surface'),
        ),
        text(segment, 1090, y + 6, 720, {
          fontFamily: f.head,
          fontSize: 40,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        copy(f.body)(details[index] ?? '', 1090, y + 60, 720, 26, t.shade('text', T.muted)),
      ];
    }),
  ];
});

const reviewsSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient and the profile cards; its shades are the white top, the mint bottom and the profile lines',
    },
    primary: {
      value: T.mid,
      hint: 'Score badge, kicker, Read story buttons and profile numbers; its darker shades color the badge top, phone screens and frames',
    },
    accent: {
      value: T.glow,
      hint: 'Bright dashboard tile, the ring chart, the avatar ring and the profile dots',
    },
    secondary: { value: T.warm, hint: 'Stars and the amber dashboard tile' },
    text: {
      value: T.ink,
      hint: 'Title, quotes, reviewer names and profile text; its muted shade colors the reviewer roles',
    },
    surface: {
      value: WHITE,
      hint: 'Review cards, profile screen, button labels, the score and dashboard text; its mint shade colors App score, its translucent shades the dashboard tiles and rows',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    screens: SCREEN_TITLES,
    stats: DASH_STATS,
    name: PROFILE_NAME,
    profileStats: PROFILE_STATS,
    scoreLabel: { label: 'Score label', value: 'App score' },
    score: { label: 'Score', value: '4.7' },
    kicker: { label: 'Kicker', value: 'User testimonials' },
    title: { label: 'Title', value: 'Rave Reviews' },
    quotes: {
      label: 'Quote',
      value: [
        '"The dashboards finally made our weekly reviews fast. We cut prep time in half."',
        '"Onboarding new teammates takes minutes now. The alerts alone paid for it."',
      ],
    },
    names: { label: 'Reviewer', value: ['Priya Raman', 'Marcus Holt'] },
    roles: {
      label: 'Reviewer role',
      value: ['VP Customer Success, Fernwell', 'Product Lead, Brightpath'],
    },
    button: { label: 'Button', value: 'Read story', hint: 'Shown on every review card' },
  },
} as const satisfies ThemeSpec;

export const reviewsSlide = themed(SW, SH, reviewsSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const deep = t.shade('primary', T.deep);
  const frame = t.shade('primary', FRAME);
  const glass = t.shade('surface', 'rgba(255,255,255,0.14)');
  const [dashTitle = '', profileTitle = ''] = t.list('screens');
  const names = t.list('names');
  const roles = t.list('roles');
  const review = (quote: string, index: number) => {
    const y = 320 + index * 320;
    return [
      rect(900, y, 900, 270, t.color('surface'), { cornerRadius: 28, name: 'Review card' }),
      rating(940, y + 36, 30, 5, t.color('secondary')),
      copy(f.body)(quote, 940, y + 86, 820, 28, t.color('text')),
      text(names[index] ?? '', 940, y + 186, 500, {
        fontFamily: f.head,
        fontSize: 28,
        fontWeight: 800,
        fill: t.color('text'),
      }),
      text(roles[index] ?? '', 940, y + 222, 500, {
        fontFamily: f.body,
        fontSize: 22,
        fontWeight: 500,
        fill: t.shade('text', T.muted),
      }),
      pill(t.copy('button'), 1580, y + 196, {
        fill: t.color('primary'),
        color: t.color('surface'),
        fontSize: 22,
        fontFamily: f.body,
      }),
    ];
  };
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    device(
      130,
      140,
      300,
      -6,
      deep,
      frame,
      dashboardScreen(
        {
          top: deep,
          bottom: t.color('primary'),
          text: t.color('surface'),
          tiles: [glass, t.color('accent'), t.color('secondary'), glass],
          ring: t.color('accent'),
          hole: deep,
          row: t.shade('surface', 'rgba(255,255,255,0.12)'),
        },
        f,
        dashTitle,
        t.list('stats'),
      ),
    ),
    device(
      400,
      230,
      300,
      6,
      deep,
      frame,
      profileScreen(
        {
          screen: t.color('surface'),
          text: t.color('text'),
          ring: t.color('accent'),
          stat: t.color('primary'),
          card: t.color('background'),
          dot: t.color('accent'),
          line: t.shade('background', T.soft),
        },
        f,
        profileTitle,
        t.copy('name'),
        t.list('profileStats'),
      ),
    ),
    rect(560, 760, 230, 200, linear(150, deep, t.color('primary')), {
      cornerRadius: 32,
      name: 'Score badge',
    }),
    text(t.copy('scoreLabel'), 560, 790, 230, {
      fontFamily: f.body,
      fontSize: 24,
      fontWeight: 600,
      fill: t.shade('surface', T.soft),
      align: 'center',
    }),
    text(t.copy('score'), 560, 830, 230, {
      fontFamily: f.head,
      fontSize: 88,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
    }),
    kicker(f.body, t.copy('kicker'), 900, 110, t.color('primary')),
    title(f.head)(t.copy('title'), 900, 150, 900, 96, t.color('text')),
    t.list('quotes').map(review),
  ];
});
