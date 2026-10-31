import { poly, rect, type Template, type ThemeSpec, themed } from '../../../kit';
import {
  BODY,
  BRAND,
  bodyText,
  brandMark,
  H,
  HEAD,
  LEAF,
  leafBackground,
  titleLine,
  W,
} from './palette';

const TOP = 170;
const BOTTOM = 1180;
const THICK = 12;
const POST_X = 64;

const doubleChevron = (x: number, y: number, fill: string) =>
  [0, 64].map((shift) =>
    poly(
      [
        [x + shift, y - 40],
        [x + shift + 28, y - 40],
        [x + shift + 68, y],
        [x + shift + 28, y + 40],
        [x + shift, y + 40],
        [x + shift + 40, y],
      ],
      fill,
      { name: 'Chevron' },
    ),
  );

const BACKGROUND = {
  value: LEAF.top,
  hint: 'Backdrop gradient; its darker shade is the bottom of the gradient',
};

const coverSpec = {
  colors: {
    background: BACKGROUND,
    primary: {
      value: LEAF.mint,
      hint: 'Strategy headline and the faint swoosh across the backdrop',
    },
    text: { value: LEAF.white, hint: 'Brand name and the How to Sharpen headline' },
    accent: { value: LEAF.wire, hint: 'Wire along the bottom and its double chevron' },
  },
  fonts: { heading: HEAD },
  copy: {
    brand: BRAND,
    title: { label: 'Title', value: 'How to Sharpen\nYour Content' },
    highlight: { label: 'Highlight', value: 'Strategy' },
  },
} as const satisfies ThemeSpec;

const wireCover = themed(W, H, coverSpec, (t) => [
  leafBackground(t),
  brandMark(t.copy('brand'), t.font('heading'), t.color('text'), 90, 140),
  titleLine(t.copy('title'), t.font('heading'), 90, 400, 88, t.color('text')),
  titleLine(t.copy('highlight'), t.font('heading'), 90, 604, 88, t.color('primary')),
  rect(0, BOTTOM - THICK / 2, W, THICK, t.color('accent'), { name: 'Wire' }),
  doubleChevron(860, BOTTOM, t.color('accent')),
]);

const stepSpec = (lead: string, accent: string, body: string) =>
  ({
    colors: {
      background: BACKGROUND,
      primary: {
        value: LEAF.mint,
        hint: 'Second headline line and the faint swoosh across the backdrop',
      },
      text: { value: LEAF.white, hint: 'First headline line and the description' },
      accent: { value: LEAF.wire, hint: 'Wire running around the slide and its double chevron' },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      lead: { label: 'Headline', value: lead },
      highlight: { label: 'Highlight', value: accent },
      body: { label: 'Description', value: body },
    },
  }) as const satisfies ThemeSpec;

const wireStep = (lead: string, accent: string, body: string, entry: 'bottom' | 'top') =>
  themed(W, H, stepSpec(lead, accent, body), (t) => {
    const enter = entry === 'bottom' ? BOTTOM : TOP;
    const leave = entry === 'bottom' ? TOP : BOTTOM;
    const wire = t.color('accent');
    return [
      leafBackground(t),
      rect(0, enter - THICK / 2, POST_X + THICK, THICK, wire, { name: 'Wire' }),
      rect(POST_X, TOP - THICK / 2, THICK, BOTTOM - TOP + THICK, wire, { name: 'Wire' }),
      rect(POST_X, leave - THICK / 2, W - POST_X, THICK, wire, { name: 'Wire' }),
      doubleChevron(860, leave, wire),
      titleLine(t.copy('lead'), t.font('heading'), 150, 440, 84, t.color('text')),
      titleLine(t.copy('highlight'), t.font('heading'), 150, 540, 84, t.color('primary')),
      bodyText(t.copy('body'), t.font('body'), t.color('text'), 150, 690, 800),
    ];
  });

export const WIRE_SERIES: readonly Template[] = [
  wireCover,
  wireStep(
    'Sharpen Your',
    'Core Message',
    'If people cannot repeat your message, they will not remember it.',
    'bottom',
  ),
  wireStep(
    'Check What Is',
    'Working',
    'Better results start with an honest look at the numbers.',
    'top',
  ),
  wireStep('Trim the', 'Funnel', 'Fewer steps and clearer offers lead to a faster yes.', 'bottom'),
  wireStep(
    'Automate the',
    'Busywork',
    'Hand repeat tasks to tools and give your team time to think.',
    'top',
  ),
];
