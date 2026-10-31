import { radial } from '@/design';
import { circle, icon, rect, type ThemeSpec, themed } from '../../../kit';
import {
  BODY_FONT,
  creamBackground,
  H,
  HEADING_FONT,
  type Paint,
  SUN,
  say,
  swipeArrow,
  W,
} from './palette';

const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;

const bubble = (t: Paint<'background' | 'primary' | 'surface'>) =>
  circle(
    740,
    1040,
    300,
    radial(
      t.shade('surface', 'rgba(255,255,255,0.95)'),
      t.shade('background', 'rgba(255,239,196,0.6)'),
      t.shade('primary', 'rgba(255,201,60,0.18)'),
    ),
    { name: 'Bubble', stroke: t.shade('surface', 'rgba(255,255,255,0.9)'), strokeWidth: 4 },
  );

const coverSpec = {
  colors: {
    background: {
      value: SUN.cream,
      hint: 'Cream page gradient and the butter tint inside the bubble',
    },
    primary: {
      value: SUN.gold,
      hint: 'Sales tip tag, the arrow chip, the warm glow, the golden edge of the bubble and, in its darker shade, the Leads headline',
    },
    surface: {
      value: SUN.white,
      hint: 'Glass bubble, the Sales tip label and the chevron on the arrow chip',
    },
    text: {
      value: SUN.ink,
      hint: 'Handle and How to Convert; its grey shade colors Swipe to read',
    },
  },
  fonts: FONTS,
  copy: {
    handle: { label: 'Handle', value: 'harbourline.co' },
    tag: { label: 'Tag', value: 'Sales tip' },
    title: { label: 'Title', value: 'How to\nConvert' },
    highlight: { label: 'Highlight', value: 'Leads' },
    swipe: { label: 'Swipe line', value: 'Swipe to read' },
  },
} as const satisfies ThemeSpec;

export const leadsCover = themed(W, H, coverSpec, (t) => {
  const heading = say(t.font('heading'));
  const body = say(t.font('body'));
  return [
    creamBackground(t),
    bubble(t),
    body(t.copy('handle'), 90, 90, 500, 30, t.color('text'), 600),
    rect(90, 430, 210, 60, t.color('primary'), { name: 'Tag', cornerRadius: 30 }),
    body(t.copy('tag'), 90, 442, 210, 30, t.color('surface'), 700, { align: 'center' }),
    heading(t.copy('title'), 90, 520, 900, 110, t.color('text'), 800, { lineHeight: 1.02 }),
    heading(t.copy('highlight'), 90, 744, 900, 110, t.shade('primary', SUN.amber), 800, {
      lineHeight: 1.02,
    }),
    body(t.copy('swipe'), 90, 920, 400, 32, t.shade('text', SUN.muted), 500),
    rect(320, 914, 56, 44, t.color('primary'), { name: 'Arrow chip', cornerRadius: 12 }),
    icon('chevron-right', 330, 918, 36, t.color('surface'), { strokeWidth: 3 }),
  ];
});

const stepSpec = (label: string, title: string, body: string) =>
  ({
    colors: {
      background: {
        value: SUN.cream,
        hint: 'Cream page gradient and the butter tint inside the bubble',
      },
      primary: {
        value: SUN.gold,
        hint: 'Side tab, the warm glow, the golden edge of the bubble and, in its darker shade, the step label',
      },
      surface: { value: SUN.white, hint: 'Glass bubble centre and its rim' },
      text: {
        value: SUN.ink,
        hint: 'Step title and the swipe arrow; its grey shade colors the explanation',
      },
    },
    fonts: FONTS,
    copy: {
      label: { label: 'Step label', value: label },
      title: { label: 'Step title', value: title },
      body: { label: 'Explanation', value: body },
    },
  }) as const satisfies ThemeSpec;

const leadStep = (label: string, title: string, body: string, side: 'left' | 'right') =>
  themed(W, H, stepSpec(label, title, body), (t) => {
    const heading = say(t.font('heading'));
    return [
      creamBackground(t),
      bubble(t),
      rect(side === 'left' ? 0 : W - 44, 420, 44, 520, t.color('primary'), {
        name: 'Side tab',
        cornerRadius: 22,
      }),
      heading(t.copy('label'), 110, 300, 800, 46, t.shade('primary', SUN.amber), 800),
      heading(t.copy('title'), 110, 380, 900, 84, t.color('text'), 800, { lineHeight: 1.1 }),
      say(t.font('body'))(t.copy('body'), 110, 600, 860, 44, t.shade('text', SUN.muted), 500, {
        lineHeight: 1.45,
      }),
      swipeArrow(t.color('text')),
    ];
  });

export const leadSpeed = leadStep(
  'Speed Matters',
  'Reply to Leads\nWithin the Hour',
  'The faster you answer, the\nwarmer the conversation stays.',
  'right',
);

export const leadQuestions = leadStep(
  'Ask First',
  'Ask Questions\nBefore You Pitch',
  'Understand their problem\nbefore you offer the fix.',
  'left',
);

export const leadValue = leadStep(
  'Lead With Value',
  'Sell the Outcome,\nNot the Features',
  'Show how life looks once\ntheir pain is finally solved.',
  'right',
);
