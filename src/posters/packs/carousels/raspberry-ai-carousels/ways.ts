import { circle, icon, rect, type Template, type ThemeSpec, text, themed } from '../../../kit';
import {
  BERRY,
  BRAND_COPY,
  berryBackground,
  brandMark,
  FONTS,
  FOOTER_COPY,
  H,
  PAGE,
  swipeFooter,
  W,
} from './palette';

const coverSpec = {
  colors: {
    background: PAGE,
    primary: { value: BERRY.white, hint: 'Brand name, headline and the arrow in the next button' },
    secondary: { value: BERRY.blush, hint: 'Subtitle and brand tagline' },
    surface: { value: BERRY.ink, hint: 'Number box and the round next button' },
    accent: { value: BERRY.hot, hint: 'Number inside the number box' },
  },
  fonts: FONTS,
  copy: {
    number: { label: 'Number', value: '5 Shifts' },
    headline: { label: 'Headline', value: 'AI Is Reshaping\nMarketing in 2026' },
    subtitle: { label: 'Subtitle', value: 'It is not replacing marketers.\nIt is upgrading them.' },
    ...BRAND_COPY,
  },
} as const satisfies ThemeSpec;

const shiftsCover = themed(W, H, coverSpec, (t) => [
  berryBackground(t),
  rect(60, 250, 1020, 230, t.color('surface'), { cornerRadius: 34, name: 'Number box' }),
  text(t.copy('number'), 110, 282, 900, {
    fontFamily: t.font('heading'),
    fontSize: 150,
    fontWeight: 800,
    fill: t.color('accent'),
    lineHeight: 1.05,
  }),
  text(t.copy('headline'), 80, 560, 920, {
    fontFamily: t.font('heading'),
    fontSize: 78,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1.15,
  }),
  text(t.copy('subtitle'), 80, 780, 900, {
    fontFamily: t.font('body'),
    fontSize: 40,
    fontWeight: 500,
    fill: t.color('secondary'),
    lineHeight: 1.4,
  }),
  brandMark(t, 80, 1140),
  circle(950, 1170, 60, t.color('surface')),
  icon('chevron-right', 915, 1135, 70, t.color('primary'), { strokeWidth: 2.6 }),
]);

const shiftSlide = (number: string, title: string, body: string, dark: boolean) => {
  const spec = {
    colors: {
      background: PAGE,
      primary: {
        value: BERRY.white,
        hint: dark
          ? 'Title, the next box peeking in, Swipe and its arrows; its translucent shade colors the footer rule'
          : 'Title, Swipe and its arrows; its translucent shade colors the footer rule',
      },
      secondary: { value: BERRY.blush, hint: 'Body text and website' },
      surface: { value: dark ? BERRY.ink : BERRY.white, hint: 'Number box' },
      accent: {
        value: dark ? BERRY.hot : BERRY.deep,
        hint: dark ? 'Number' : 'Number; its darkest shade colors the next box peeking in',
      },
    },
    fonts: FONTS,
    copy: {
      number: { label: 'Number', value: number },
      title: { label: 'Title', value: title },
      body: { label: 'Body', value: body },
      ...FOOTER_COPY,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    berryBackground(t),
    rect(60, 250, 340, 230, t.color('surface'), { cornerRadius: 34, name: 'Number box' }),
    text(t.copy('number'), 60, 282, 340, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 800,
      fill: t.color('accent'),
      align: 'center',
      lineHeight: 1.05,
    }),
    rect(900, 250, 180, 230, dark ? t.color('primary') : t.shade('accent', BERRY.ink), {
      cornerRadius: 34,
      name: 'Next box',
    }),
    text(t.copy('title'), 80, 580, 920, {
      fontFamily: t.font('heading'),
      fontSize: 84,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1.15,
    }),
    text(t.copy('body'), 80, 820, 860, {
      fontFamily: t.font('body'),
      fontSize: 46,
      fontWeight: 500,
      fill: t.color('secondary'),
      lineHeight: 1.4,
    }),
    swipeFooter(t),
  ]);
};

export const SHIFT_SERIES: readonly Template[] = [
  shiftsCover,
  shiftSlide(
    '01',
    'One-to-One\nat Scale',
    'Smart tools tailor every message to each customer as they browse.',
    true,
  ),
  shiftSlide(
    '02',
    'Sharper Ad\nTargeting',
    'Models learn who converts and move budget to the best audiences on their own.',
    false,
  ),
  shiftSlide(
    '03',
    'Predictive\nInsights',
    'Forecasts show what your audience will want next, before they ask for it.',
    true,
  ),
  shiftSlide(
    '04',
    'Content on\nDemand',
    'Drafts, captions and variations in minutes, ready for a human polish.',
    false,
  ),
];
