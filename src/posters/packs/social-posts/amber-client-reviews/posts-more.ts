import { linear } from '@/design';
import {
  avatar,
  circle,
  icon,
  type Nodes,
  pill,
  poly,
  rating,
  rect,
  rotateNodes,
  STORY_SIZE,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  AMBER,
  BODY,
  type CardLook,
  H,
  HEADING,
  QUOTE_GREY,
  type ReviewPalette,
  reviewCard,
  sparkle,
  W,
} from './posts';

const FACES = ['woman-portrait-1', 'man-portrait-2', 'woman-portrait-5', 'man-portrait-3'] as const;

export const typewriter = (p: ReviewPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: p.ink,
          hint: 'Page, the keyboard and the second headline; its lighter shades color the roller and the name lines',
        },
        primary: {
          value: p.from,
          hint: 'Top of the side panel and typewriter gradients and the roller knobs; its deeper shade colors the bottom of the gradients and the stars',
        },
        surface: {
          value: p.paper,
          hint: 'First headline, the keys and the sparkles; its shades color the paper roll, paper guide and text lines',
        },
      },
      fonts: { heading: HEADING },
      copy: {
        headline: { label: 'Headline', value: 'Digital\nMarketing' },
        subline: { label: 'Second headline', value: 'Results\nthat speak' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const gradient = linear(160, t.color('primary'), t.shade('primary', p.to));
      const headline = (content: string, y: number, fill: string) =>
        text(content, 640, y, 420, {
          fontFamily: t.font('heading'),
          fontSize: 72,
          fontWeight: 900,
          fill,
          lineHeight: 1.05,
        });
      const textLine = t.shade('surface', '#cfc6b6');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rect(560, 300, 520, 560, gradient, { name: 'Panel' }),
        rect(200, 60, 380, 830, t.shade('surface', '#fff8ec'), {
          name: 'Paper roll',
          cornerRadius: 6,
        }),
        FACES.map((face, index) => {
          const y = 100 + index * 190;
          return [
            avatar(face, 250, y + 40, 26),
            rect(290, y + 20, 180, 14, t.shade('background', '#2b2b2b'), {
              cornerRadius: 7,
              name: 'Name line',
            }),
            rating(290, y + 46, 16, 5, t.shade('primary', p.to), 0.2),
            rect(230, y + 92, 320, 10, textLine, { cornerRadius: 5, name: 'Text line' }),
            rect(230, y + 116, 260, 10, textLine, { cornerRadius: 5, name: 'Text line' }),
            rect(220, y + 160, 340, 2, t.shade('surface', '#e6dccb'), { name: 'Rule' }),
          ];
        }),
        rect(130, 860, 520, 70, t.shade('background', '#3a3a3f'), {
          cornerRadius: 30,
          name: 'Roller',
        }),
        circle(130, 895, 40, t.color('primary')),
        circle(650, 895, 40, t.color('primary')),
        rect(180, 880, 420, 26, t.shade('surface', '#d4d4d8'), {
          cornerRadius: 6,
          name: 'Paper guide',
        }),
        rect(100, 920, 580, 330, linear(180, t.color('primary'), t.shade('primary', p.to)), {
          cornerRadius: 50,
          name: 'Typewriter body',
        }),
        rect(150, 1000, 480, 190, t.color('background'), { cornerRadius: 26, name: 'Keyboard' }),
        [0, 1, 2].map((row) =>
          Array.from({ length: 8 - row }, (_, key) =>
            circle(195 + row * 28 + key * 56, 1045 + row * 52, 18, t.color('surface')),
          ),
        ),
        headline(t.copy('headline'), 420, t.color('surface')),
        headline(t.copy('subline'), 600, t.color('background')),
        sparkle(560, 230, 110, t.color('surface')),
        sparkle(900, 900, 120, t.color('surface')),
      ];
    },
  );

const envelopeColors = (story: boolean) => ({
  primary: {
    value: AMBER.from,
    hint: 'Top of the page gradient and the stars; its deeper shade is the bottom of the gradient',
  },
  secondary: {
    value: '#1f1f1f',
    hint: 'Envelope; its lighter shades color the envelope front and fold',
  },
  surface: {
    value: AMBER.paper,
    hint: story
      ? 'The word reviews, the review cards, the button label and the sparkle'
      : 'The word reviews, the review cards and the white sparkle',
  },
  text: {
    value: AMBER.ink,
    hint: story
      ? 'CLIENT, reviewer names, the button and the arrow; its lighter shade colors the quotes'
      : 'CLIENT, reviewer names and the dark sparkle; its lighter shade colors the quotes',
  },
});

const envelopeCopy = {
  title: { label: 'Title', value: 'CLIENT' },
  subtitle: { label: 'Subtitle', value: 'reviews' },
  names: { label: 'Reviewer', value: ['Ava Kim', 'Leo Grant', 'Nia Brooks'] },
  quotes: {
    label: 'Quote',
    value: [
      'Clear plan, fast results.',
      'Best agency call we made.',
      'Our reach tripled in a month.',
    ],
  },
} as const;

const envelopeSpec = {
  colors: envelopeColors(false),
  fonts: { heading: HEADING, body: BODY },
  copy: envelopeCopy,
} as const satisfies ThemeSpec;

const envelopeStorySpec = {
  colors: envelopeColors(true),
  fonts: { heading: HEADING, body: BODY },
  copy: { ...envelopeCopy, button: { label: 'Button', value: 'Read them all' } },
} as const satisfies ThemeSpec;

type EnvelopeTheme = Theme<typeof envelopeSpec>;

const REVIEW_FACES = ['woman-portrait-2', 'man-portrait-1', 'woman-portrait-6'] as const;

const envelope = (t: EnvelopeTheme, top: number): Nodes[] => [
  rect(220, top, 640, 400, t.color('secondary'), { cornerRadius: 30, name: 'Envelope' }),
  poly(
    [
      [220, top + 30],
      [540, top + 250],
      [860, top + 30],
      [860, top + 370],
      [220, top + 370],
    ],
    t.shade('secondary', '#2c2c2c'),
    { name: 'Envelope front' },
  ),
  poly(
    [
      [240, top + 380],
      [540, top + 170],
      [840, top + 380],
    ],
    t.shade('secondary', '#383838'),
    { name: 'Envelope fold' },
  ),
];

const envelopeScene = (t: EnvelopeTheme, offsetY: number): Nodes[] => {
  const look: CardLook = {
    card: t.color('surface'),
    name: t.color('text'),
    stars: t.color('primary'),
    quote: t.shade('text', QUOTE_GREY),
    heading: t.font('heading'),
    body: t.font('body'),
  };
  const quotes = t.list('quotes');
  return [
    t.list('names').map((name, index) =>
      rotateNodes([-6, 5, -3][index] ?? 0, 540, offsetY + 100 + index * 165, [
        reviewCard(
          250 + (index % 2) * 60,
          offsetY + index * 165,
          520,
          look,
          {
            name,
            face: REVIEW_FACES[index] ?? 'woman-portrait-2',
            quote: quotes[index] ?? '',
          },
          0.85,
        ),
      ]),
    ),
    envelope(t, offsetY + 500),
  ];
};

const titles = (t: EnvelopeTheme, top: number, sizes: readonly [number, number, number]) => [
  text(t.copy('title'), 0, top, W, {
    fontFamily: t.font('heading'),
    fontSize: sizes[0],
    fontWeight: 900,
    fill: t.color('text'),
    align: 'center',
    letterSpacing: 4,
  }),
  text(t.copy('subtitle'), 0, top + sizes[2], W, {
    fontFamily: t.font('heading'),
    fontSize: sizes[1],
    fontWeight: 600,
    fill: t.color('surface'),
    align: 'center',
  }),
];

export const clientEnvelope = themed(W, H, envelopeSpec, (t) => [
  rect(0, 0, W, H, linear(160, t.color('primary'), t.shade('primary', AMBER.to)), {
    name: 'Background',
  }),
  titles(t, 90, [130, 56, 150]),
  envelopeScene(t, 400),
  sparkle(860, 380, 110, t.color('surface')),
  sparkle(120, 1150, 90, t.color('text')),
]);

const { width: SW, height: SH } = STORY_SIZE;

export const clientEnvelopeStory = themed(SW, SH, envelopeStorySpec, (t) => [
  rect(0, 0, SW, SH, linear(160, t.color('primary'), t.shade('primary', AMBER.to)), {
    name: 'Background',
  }),
  titles(t, 230, [150, 64, 170]),
  envelopeScene(t, 620),
  pill(t.copy('button'), 370, 1600, {
    fill: t.color('text'),
    color: t.color('surface'),
    fontSize: 36,
    fontFamily: t.font('heading'),
    fontWeight: 800,
  }),
  icon('arrow-down', 510, 1750, 60, t.color('text'), { strokeWidth: 2.6 }),
  sparkle(860, 560, 120, t.color('surface')),
]);
