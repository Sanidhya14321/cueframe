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
    primary: {
      value: BERRY.white,
      hint: 'Brand name, headline, search bar outline and text, Swipe and its arrows; its translucent shades tint the search bar and the footer rule',
    },
    secondary: { value: BERRY.blush, hint: 'Brand tagline and website' },
    surface: { value: BERRY.white, hint: 'Round search button' },
    accent: { value: BERRY.hot, hint: 'Arrow inside the search button' },
  },
  fonts: FONTS,
  copy: {
    ...BRAND_COPY,
    headline: { label: 'Headline', value: 'AI is rewriting the\nrules of marketing.' },
    search: { label: 'Search text', value: 'Top 5 questions about AI |' },
    ...FOOTER_COPY,
  },
} as const satisfies ThemeSpec;

const questionsCover = themed(W, H, coverSpec, (t) => [
  berryBackground(t),
  brandMark(t, 0, 330, 'center'),
  text(t.copy('headline'), 60, 530, 960, {
    fontFamily: t.font('heading'),
    fontSize: 80,
    fontWeight: 800,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1.18,
  }),
  rect(160, 840, 760, 110, t.shade('primary', 'rgba(255,255,255,0.14)'), {
    cornerRadius: 55,
    stroke: t.color('primary'),
    strokeWidth: 4,
    name: 'Search bar',
  }),
  text(t.copy('search'), 210, 873, 520, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 600,
    fill: t.color('primary'),
  }),
  rect(770, 852, 136, 86, t.color('surface'), { cornerRadius: 43, name: 'Search button' }),
  icon('arrow-right', 806, 863, 64, t.color('accent'), { strokeWidth: 2.6 }),
  swipeFooter(t),
]);

const questionSlide = (number: string, question: string, answer: string) => {
  const spec = {
    colors: {
      background: PAGE,
      primary: {
        value: BERRY.white,
        hint: 'Question, Swipe and its arrows; its translucent shades tint the panel, its outline and the footer rule',
      },
      secondary: { value: BERRY.blush, hint: 'Website at the bottom' },
      surface: { value: BERRY.white, hint: 'Number badge and answer box' },
      accent: { value: BERRY.hot, hint: 'Question number' },
      text: { value: BERRY.ink, hint: 'Answer' },
    },
    fonts: FONTS,
    copy: {
      number: { label: 'Number', value: number },
      question: { label: 'Question', value: question },
      answer: { label: 'Answer', value: answer },
      ...FOOTER_COPY,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    berryBackground(t),
    rect(60, 250, 1020, 760, t.shade('primary', 'rgba(255,255,255,0.08)'), {
      cornerRadius: 44,
      stroke: t.shade('primary', 'rgba(255,255,255,0.55)'),
      strokeWidth: 4,
      name: 'Panel',
    }),
    circle(190, 250, 64, t.color('surface')),
    text(t.copy('number'), 126, 224, 128, {
      fontFamily: t.font('heading'),
      fontSize: 44,
      fontWeight: 800,
      fill: t.color('accent'),
      align: 'center',
    }),
    text(t.copy('question'), 120, 380, 900, {
      fontFamily: t.font('heading'),
      fontSize: 66,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1.15,
    }),
    rect(120, 660, 820, 220, t.color('surface'), { cornerRadius: 12, name: 'Answer box' }),
    text(t.copy('answer'), 150, 690, 760, {
      fontFamily: t.font('body'),
      fontSize: 40,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.4,
    }),
    swipeFooter(t),
  ]);
};

export const QUESTION_SERIES: readonly Template[] = [
  questionsCover,
  questionSlide(
    '#1',
    'Will AI Replace\nMarketers?',
    'Not the good ones. It takes the busywork so people can focus on ideas, taste and trust.',
  ),
  questionSlide(
    '#2',
    'Are You Working\nWith It, or Against It?',
    'Teams that pair tools with judgment ship faster. Pick one task and try it this week.',
  ),
  questionSlide(
    '#3',
    'Is AI Making Us\nSmarter or Lazier?',
    'It depends on the habit. Use it to think deeper and check every answer it gives.',
  ),
  questionSlide(
    '#4',
    'Where Should\nYou Start?',
    'Start with the task you repeat most. Automate it, measure it, then pick the next.',
  ),
];
