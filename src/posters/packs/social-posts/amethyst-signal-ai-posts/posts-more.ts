import { linear } from '@/design';
import {
  avatar,
  circle,
  icon,
  pill,
  rect,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  brandMark,
  button,
  campaignRoi,
  crewPower,
  darkBg,
  H,
  HEADING,
  pickDirection,
  primaryFill,
  ringArc,
  VIO,
  violetGlow,
  W,
} from './posts';
import { buildFaster, quoteCloser, topFivePost } from './posts-mid';

const DARK_PAGE = {
  value: VIO.night,
  hint: 'Page; its plum shade colors the top of the gradient',
} as const;

const velocityGauge = themed(
  W,
  H,
  {
    colors: {
      background: DARK_PAGE,
      primary: {
        value: VIO.bright,
        hint: 'Filled gauge arc, the sparkles, next-level output, the buttons and the glow',
      },
      text: {
        value: VIO.white,
        hint: 'Brand name, the needle icon, the first headline line and button labels; its translucent shades color the empty gauge, paragraph and Watch Demo fill',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      title: { label: 'Headline', value: 'Pushing momentum to' },
      highlight: { label: 'Highlighted line', value: 'next-level output.' },
      body: {
        label: 'Paragraph',
        value: 'Built to speed up workflows, cut friction and keep every system moving in sync.',
      },
      secondary: { label: 'Outline button', value: 'Watch Demo' },
      action: { label: 'Main button', value: 'Start Free' },
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    brandMark(t.copy('brand'), t.font('heading'), 0, 90, W, t.color('text')),
    violetGlow(t, 240, 260, 600, 500, 0.5),
    ringArc(
      540,
      640,
      360,
      250,
      180,
      300,
      linear(90, t.shade('primary', VIO.violet), t.color('primary')),
    ),
    ringArc(540, 640, 360, 250, 300, 360, t.shade('text', 'rgba(255,255,255,0.35)')),
    ringArc(540, 640, 250, 236, 180, 360, t.shade('text', 'rgba(255,255,255,0.12)')),
    icon('navigation', 500, 520, 80, t.color('text'), { strokeWidth: 2 }),
    icon('sparkles', 150, 740, 64, t.color('primary'), { strokeWidth: 2 }),
    text(t.copy('title'), 240, 730, 760, {
      fontFamily: t.font('heading'),
      fontSize: 46,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    text(t.copy('highlight'), 240, 792, 760, {
      fontFamily: t.font('heading'),
      fontSize: 46,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    text(t.copy('body'), 150, 900, 780, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.shade('text', VIO.muted),
      align: 'center',
      lineHeight: 1.45,
    }),
    button(t, t.copy('secondary'), t.font('body'), 250, 1080, 270, false),
    button(t, t.copy('action'), t.font('body'), 560, 1080, 270, true),
  ],
);

const TAG_SPOTS = [
  { x: 80, y: 200, width: 250, filled: true },
  { x: 350, y: 200, width: 260, filled: false },
  { x: 630, y: 200, width: 250, filled: false },
  { x: 80, y: 350, width: 240, filled: false },
  { x: 340, y: 350, width: 470, filled: true },
] as const;

const DETAIL_ROWS = [760, 828, 960] as const;

const workshopTags = themed(
  W,
  H,
  {
    colors: {
      background: DARK_PAGE,
      primary: {
        value: VIO.bright,
        hint: 'Filled tags, tag outlines, the bullet dots, the arrow and the glow',
      },
      text: {
        value: VIO.white,
        hint: 'Tag words, the arrow pill, the date, the sign up line and brand name; its translucent shade colors the time',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tags: { label: 'Tag', value: ['SAVE', 'YOUR', 'SEAT', 'LIVE', 'WORKSHOP'] },
      details: {
        label: 'Detail',
        value: ['March 18, 2027', '3:00 PM to 4:30 PM', 'Register at lumenstack.io'],
      },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const details = t.list('details');
    return [
      darkBg(t, H),
      violetGlow(t, 560, 500, 600, 600, 0.35),
      t.list('tags').map((tag, index) => {
        const spot = TAG_SPOTS[index] ?? TAG_SPOTS[0];
        return pill(tag, spot.x, spot.y, {
          fill: spot.filled ? primaryFill(t) : t.shade('primary', 'rgba(0,0,0,0)'),
          stroke: t.color('primary'),
          strokeWidth: spot.filled ? 0 : 3,
          color: t.color('text'),
          fontSize: 56,
          fontFamily: t.font('heading'),
          fontWeight: 800,
          width: spot.width,
        });
      }),
      rect(80, 500, 260, 134, t.color('text'), { name: 'Arrow pill', cornerRadius: 67 }),
      icon('arrow-right', 165, 522, 90, t.shade('primary', VIO.violet), { strokeWidth: 2.6 }),
      DETAIL_ROWS.map((y, index) => [
        index === 1 ? [] : circle(100, y + 26, 14, t.color('primary')),
        text(details[index] ?? '', 140, y, 860, {
          fontFamily: t.font('body'),
          fontSize: 44,
          fontWeight: index === 1 ? 500 : 700,
          fill: index === 1 ? t.shade('text', VIO.muted) : t.color('text'),
        }),
      ]),
      brandMark(t.copy('brand'), t.font('heading'), 80, 1240, 600, t.color('text'), 'left'),
    ];
  },
);

const reviewCard = themed(
  W,
  H,
  {
    colors: {
      background: DARK_PAGE,
      surface: {
        value: '#2a1d4d',
        hint: 'Review card; its darker shade colors the bottom of the card',
      },
      primary: {
        value: VIO.bright,
        hint: 'Logo badge, the star and the active slide dot',
      },
      text: {
        value: VIO.white,
        hint: 'Brand name, score, review, reviewer name and the logo icon; its translucent shades color the role, card outlines and other dots',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      score: { label: 'Score', value: '5.0' },
      review: {
        label: 'Review',
        value:
          'Lumen Stack turned our rough roadmap into a product our customers rave about. Calm, sharp and always a step ahead.',
      },
      name: { label: 'Reviewer', value: 'Theo Marlow' },
      role: { label: 'Reviewer role', value: 'Founder, Driftlane' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const ghost = (x: number) =>
      rect(x, 430, 220, 520, t.shade('text', 'rgba(255,255,255,0.03)'), {
        name: 'Ghost card',
        cornerRadius: 36,
        stroke: t.shade('text', 'rgba(255,255,255,0.1)'),
        strokeWidth: 2,
      });
    return [
      darkBg(t, H),
      brandMark(t.copy('brand'), t.font('heading'), 0, 90, W, t.color('text')),
      [0, 1, 2, 3, 4].map((index) =>
        circle(
          460 + index * 40,
          1180,
          9,
          index === 2 ? t.color('primary') : t.shade('text', 'rgba(255,255,255,0.3)'),
        ),
      ),
      ghost(40),
      ghost(820),
      rect(260, 330, 560, 760, linear(180, t.color('surface'), t.shade('surface', VIO.ink)), {
        name: 'Review card',
        cornerRadius: 44,
        stroke: t.shade('text', 'rgba(255,255,255,0.45)'),
        strokeWidth: 3,
        ...shadow(60, 20, 'rgba(0,0,0,0.5)'),
      }),
      circle(340, 420, 40, primaryFill(t, 135)),
      icon('layers', 318, 398, 44, t.color('text'), { strokeWidth: 2 }),
      star(5, 650, 400, 40, t.color('primary'), { innerRatio: 0.45 }),
      text(t.copy('score'), 700, 400, 90, {
        fontFamily: t.font('heading'),
        fontSize: 36,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      text(t.copy('review'), 310, 520, 460, {
        fontFamily: t.font('body'),
        fontSize: 33,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.45,
      }),
      avatar('man-portrait-3', 350, 970, 46),
      text(t.copy('name'), 415, 940, 380, {
        fontFamily: t.font('heading'),
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      text(t.copy('role'), 415, 982, 380, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 500,
        fill: t.shade('text', VIO.muted),
      }),
    ];
  },
);

export const POSTS: readonly Template[] = [
  crewPower,
  campaignRoi,
  pickDirection,
  buildFaster,
  topFivePost,
  quoteCloser,
  velocityGauge,
  workshopTags,
  reviewCard,
];
