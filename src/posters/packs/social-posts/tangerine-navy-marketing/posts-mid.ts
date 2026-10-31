import { type Fill, linear } from '@/design';
import {
  circle,
  ellipse,
  type Nodes,
  photo,
  poly,
  rect,
  STORY_SIZE,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY_FONT, H, HASHTAG, HEADING_FONT, hashtag, TAN, W } from './posts';

const spotlightSpec = {
  colors: {
    background: { value: TAN.ink, hint: 'Night backdrop' },
    primary: {
      value: TAN.tangerine,
      hint: 'Audience headline gradient',
    },
    surface: {
      value: TAN.cream,
      hint: 'Light beam, its glow around the lens and the Spotlight Your line',
    },
    text: {
      value: TAN.white,
      hint: 'Subtitle, the torch lens and the faint grid lines',
    },
    secondary: { value: '#46557e', hint: 'Torch head and handle' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    lead: { label: 'Lead line', value: 'Spotlight Your' },
    headline: { label: 'Headline', value: 'Audience' },
    subtitle: { label: 'Subtitle', value: 'Discover what really converts' },
  },
} as const satisfies ThemeSpec;

const spotlightNodes = (t: Theme<typeof spotlightSpec>, height: number): Nodes[] => {
  const top = (height - H) / 2;
  const gridLine = t.shade('text', 'rgba(255,255,255,0.05)');
  const heading = (content: string, y: number, size: number, fill: Fill) =>
    text(content, 0, y, W, {
      fontFamily: t.font('heading'),
      fontSize: size,
      fontWeight: 800,
      fill,
      align: 'center',
    });
  return [
    rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
    Array.from({ length: 12 }, (_, index) =>
      rect(index * 96 + 12, 0, 2, height, gridLine, { name: 'Grid line' }),
    ),
    Array.from({ length: Math.ceil(height / 96) }, (_, index) =>
      rect(0, index * 96 + 30, W, 2, gridLine, { name: 'Grid line' }),
    ),
    poly(
      [
        [470, top + 990],
        [610, top + 990],
        [1040, top + 140],
        [40, top + 140],
      ],
      linear(
        0,
        t.shade('surface', 'rgba(255,244,232,0.45)'),
        t.shade('surface', 'rgba(255,244,232,0.08)'),
        t.shade('surface', 'rgba(255,244,232,0)'),
      ),
      { name: 'Light cone' },
    ),
    heading(t.copy('lead'), top + 230, 64, t.color('surface')),
    heading(
      t.copy('headline'),
      top + 300,
      168,
      linear(180, t.shade('primary', TAN.peach), t.color('primary')),
    ),
    text(t.copy('subtitle'), 0, top + 510, W, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    ellipse(455, top + 965, 170, 54, t.color('text'), {
      name: 'Lens',
      ...shadow(70, 0, t.shade('surface', 'rgba(255,244,232,0.95)')),
    }),
    rect(
      460,
      top + 990,
      160,
      100,
      linear(
        90,
        t.shade('secondary', '#1c2747'),
        t.color('secondary'),
        t.shade('secondary', '#1c2747'),
      ),
      { name: 'Torch head', cornerRadius: 14 },
    ),
    rect(
      490,
      top + 1090,
      100,
      height - top - 1090,
      linear(
        90,
        t.shade('secondary', '#141d38'),
        t.shade('secondary', '#3a4a72'),
        t.shade('secondary', '#141d38'),
      ),
      { name: 'Torch body', cornerRadius: 8 },
    ),
  ];
};

export const spotlightPost = themed(W, H, spotlightSpec, (t) => spotlightNodes(t, H));

export const spotlightStory = themed(STORY_SIZE.width, STORY_SIZE.height, spotlightSpec, (t) =>
  spotlightNodes(t, STORY_SIZE.height),
);

interface PlanCopy {
  accent: string;
  light: string;
  question: string;
  answer: string;
  steps: readonly [string, string, string, string];
}

const planSpec = (copy: PlanCopy) =>
  ({
    colors: {
      background: { value: TAN.white, hint: 'Page gradient' },
      primary: {
        value: copy.accent,
        hint: 'Step pill gradients, the step numbers and the answer headline',
      },
      surface: { value: TAN.white, hint: 'Number discs and the step labels on the pills' },
      text: { value: TAN.navy, hint: 'Question line, the hashtag and the pill shadows' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      numbers: { label: 'Step number', value: ['1', '2', '3', '4'] },
      steps: { label: 'Step', value: copy.steps },
      question: { label: 'Question', value: copy.question },
      answer: { label: 'Answer', value: copy.answer },
      hashtag: HASHTAG,
    },
  }) as const satisfies ThemeSpec;

const gamePlan = (copy: PlanCopy) =>
  themed(W, H, planSpec(copy), (t) => {
    const numbers = t.list('numbers');
    const heading = (content: string, y: number, size: number, fontWeight: number, fill: string) =>
      text(content, 0, y, W, {
        fontFamily: t.font('heading'),
        fontSize: size,
        fontWeight,
        fill,
        align: 'center',
      });
    return [
      rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', TAN.paper)), {
        name: 'Background',
      }),
      photo('woman-portrait-4', 70, 130, 480, 590, { cornerRadius: 40 }),
      t.list('steps').map((step, index) => {
        const y = 190 + index * 124;
        return [
          rect(520, y, 490, 96, linear(90, t.color('primary'), t.shade('primary', copy.light)), {
            name: 'Step pill',
            cornerRadius: 48,
            ...shadow(24, 10, t.shade('text', 'rgba(10,17,40,0.18)')),
          }),
          circle(570, y + 48, 32, t.color('surface')),
          text(numbers[index] ?? '', 538, y + 28, 64, {
            fontFamily: t.font('heading'),
            fontSize: 34,
            fontWeight: 800,
            fill: t.color('primary'),
            align: 'center',
          }),
          text(step, 620, y + 28, 380, {
            fontFamily: t.font('body'),
            fontSize: 32,
            fontWeight: 600,
            fill: t.color('surface'),
          }),
        ];
      }),
      heading(t.copy('question'), 800, 80, 700, t.color('text')),
      heading(t.copy('answer'), 890, 138, 800, t.color('primary')),
      hashtag(t.copy('hashtag'), 1130, t.color('text'), t.font('heading')),
    ];
  });

export const gamePlanTangerine = gamePlan({
  accent: TAN.tangerine,
  light: TAN.peach,
  question: "What's your",
  answer: 'Game Plan?',
  steps: ['Paid ads', 'Social media', 'Content plans', 'Branding'],
});

export const gamePlanCobalt = gamePlan({
  accent: '#2f5bea',
  light: '#7aa2ff',
  question: 'How will you',
  answer: 'Scale Up?',
  steps: ['Smart funnels', 'Community', 'Video series', 'Partnerships'],
});
