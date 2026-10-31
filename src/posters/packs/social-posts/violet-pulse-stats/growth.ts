import {
  circle,
  icon,
  type Nodes,
  rect,
  STORY_SIZE,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { FONTS, PH, PW, type StatTheme } from './shared';

const growthCopy = {
  headline: { label: 'Headline', value: 'Scale Your\nRevenue With Us' },
  stat: { label: 'Stat', value: '94%' },
  body: {
    label: 'Body',
    value:
      'Our proven playbook helps service teams build steady, predictable revenue every single quarter.',
  },
} as const;

const growthColors = (theme: StatTheme, story: boolean) => ({
  background: { value: theme.brand, hint: 'Page' },
  surface: {
    value: theme.paper,
    hint: story
      ? 'Progress bars, the small star, headline, stat, arrow, body and the button label'
      : 'Progress bars, the small star, headline, stat, arrow and body',
  },
  accent: {
    value: theme.ink,
    hint: story
      ? 'Arrow circle, the short rule, the bottom star and the button'
      : 'Arrow circle, the short rule and the bottom star',
  },
});

interface GrowthStyle {
  background: string;
  paper: string;
  ink: string;
  heading: string;
  body: string;
  headline: string;
  stat: string;
  copy: string;
}

const growth = (style: GrowthStyle, height: number, story: boolean): Nodes[] => {
  const shift = story ? 260 : 0;
  const { paper, ink } = style;
  return [
    rect(0, 0, PW, height, style.background, { name: 'Background' }),
    [0, 1, 2, 3].map((index) =>
      rect(90 + index * 210, story ? 110 : 80, 190, 12, paper, {
        name: 'Progress',
        cornerRadius: 6,
        opacity: index < 2 ? 1 : 0.35,
      }),
    ),
    star(5, 950, story ? 70 : 40, 100, paper, { innerRatio: 0.42 }),
    text(style.headline, 90, 220 + shift, 940, {
      fontFamily: style.heading,
      fontSize: 84,
      fontWeight: 800,
      fill: paper,
      lineHeight: 1.1,
    }),
    text(style.stat, 90, 470 + shift, 500, {
      fontFamily: style.heading,
      fontSize: 160,
      fontWeight: 800,
      fill: paper,
      lineHeight: 1,
    }),
    circle(560, 553 + shift, 62, ink),
    icon('arrow-up-right', 523, 516 + shift, 74, paper, { strokeWidth: 2.6 }),
    rect(90, 720 + shift, 120, 8, ink, { name: 'Rule', cornerRadius: 4 }),
    text(style.copy, 90, 770 + shift, 800, {
      fontFamily: style.body,
      fontSize: 36,
      fontWeight: 500,
      fill: paper,
      lineHeight: 1.4,
    }),
    star(5, 70, height - 230, 150, ink, { innerRatio: 0.42 }),
  ];
};

export const growProfit = (theme: StatTheme): Template =>
  themed(
    PW,
    PH,
    { colors: growthColors(theme, false), fonts: FONTS, copy: growthCopy } satisfies ThemeSpec,
    (t) =>
      growth(
        {
          background: t.color('background'),
          paper: t.color('surface'),
          ink: t.color('accent'),
          heading: t.font('heading'),
          body: t.font('body'),
          headline: t.copy('headline'),
          stat: t.copy('stat'),
          copy: t.copy('body'),
        },
        PH,
        false,
      ),
  );

export const growStory = (theme: StatTheme): Template =>
  themed(
    STORY_SIZE.width,
    STORY_SIZE.height,
    {
      colors: growthColors(theme, true),
      fonts: FONTS,
      copy: { ...growthCopy, cta: { label: 'Button', value: 'Book a strategy call' } },
    } satisfies ThemeSpec,
    (t) => [
      growth(
        {
          background: t.color('background'),
          paper: t.color('surface'),
          ink: t.color('accent'),
          heading: t.font('heading'),
          body: t.font('body'),
          headline: t.copy('headline'),
          stat: t.copy('stat'),
          copy: t.copy('body'),
        },
        STORY_SIZE.height,
        true,
      ),
      rect(90, 1560, 900, 120, t.color('accent'), { name: 'Button', cornerRadius: 60 }),
      text(t.copy('cta'), 90, 1598, 900, {
        fontFamily: t.font('heading'),
        fontSize: 38,
        fontWeight: 700,
        fill: t.color('surface'),
        align: 'center',
      }),
    ],
  );
