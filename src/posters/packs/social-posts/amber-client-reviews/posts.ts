import { linear } from '@/design';
import {
  avatar,
  type Nodes,
  POST_SIZE,
  photo,
  rating,
  rect,
  rotateNodes,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

export interface ReviewPalette {
  from: string;
  to: string;
  ink: string;
  paper: string;
  soft: string;
}

export const AMBER: ReviewPalette = {
  from: '#ffb703',
  to: '#f76707',
  ink: '#121212',
  paper: '#ffffff',
  soft: '#fff3d6',
};

export const ROSE: ReviewPalette = {
  from: '#ff5d8f',
  to: '#b5179e',
  ink: '#1a0b16',
  paper: '#ffffff',
  soft: '#ffe3ee',
};

export const QUOTE_GREY = '#3f3f46';
export const HEADING = { label: 'Heading font', value: 'Figtree' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

export const sparkle = (x: number, y: number, size: number, fill: string) =>
  star(5, x, y, size, fill, { innerRatio: 0.42, name: 'Sparkle' });

export interface CardLook {
  card: string;
  name: string;
  stars: string;
  quote: string;
  heading: string;
  body: string;
}

export const reviewCard = (
  x: number,
  y: number,
  width: number,
  look: CardLook,
  who: { name: string; face: PosterPhotoName; quote: string },
  scale = 1,
): Nodes[] => [
  rect(x, y, width, 250 * scale, look.card, {
    cornerRadius: 18 * scale,
    name: 'Review card',
    ...shadow(30 * scale, 10 * scale),
  }),
  avatar(who.face, x + 56 * scale, y + 58 * scale, 30 * scale),
  text(who.name, x + 104 * scale, y + 30 * scale, width - 130 * scale, {
    fontFamily: look.heading,
    fontSize: 30 * scale,
    fontWeight: 800,
    fill: look.name,
  }),
  rating(x + 104 * scale, y + 72 * scale, 22 * scale, 5, look.stars, 0.2),
  text(who.quote, x + 28 * scale, y + 118 * scale, width - 56 * scale, {
    fontFamily: look.body,
    fontSize: 26 * scale,
    fontWeight: 500,
    fill: look.quote,
    lineHeight: 1.35,
  }),
];

const LETTERS = [
  [60, 40, -10],
  [360, 90, 6],
  [650, 30, -6],
  [120, 900, 8],
  [330, 920, -8],
  [600, 900, 6],
] as const;

export const reviewLetters = (p: ReviewPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page and the label on the lighter ribbon' },
        primary: {
          value: p.from,
          hint: 'Top of the REVIEW letters, the lighter ribbon and the stars; its deeper shade is the bottom of the letters and the darker ribbon',
        },
        surface: {
          value: p.paper,
          hint: 'Review card, the label on the darker ribbon and the sparkles',
        },
        text: { value: p.ink, hint: 'Reviewer name; its lighter shade colors the quote' },
      },
      fonts: {
        letters: { label: 'Letter font', value: 'Archivo Black' },
        heading: HEADING,
        body: BODY,
      },
      copy: {
        letters: { label: 'Letter', value: ['R', 'E', 'V', 'I', 'E', 'W'] },
        ribbon: { label: 'Ribbon label', value: '#REVIEW' },
        name: { label: 'Reviewer', value: 'Jordan Mills' },
        quote: {
          label: 'Quote',
          value: 'Our ads finally make sense. Leads are up and\nreporting takes minutes, not days.',
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const ribbonLabel = (x: number, y: number, fill: string) =>
        text(t.copy('ribbon'), x, y, 260, {
          fontFamily: t.font('heading'),
          fontSize: 34,
          fontWeight: 900,
          fill,
          align: 'center',
          letterSpacing: 3,
        });
      const letters = t.list('letters');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        LETTERS.map(([x, y, angle], index) =>
          rotateNodes(angle, x + 150, y + 180, [
            text(letters[index] ?? '', x, y, 380, {
              fontFamily: t.font('letters'),
              fontSize: 380,
              fontWeight: 400,
              fill: linear(160, t.color('primary'), t.shade('primary', p.to)),
              lineHeight: 1,
            }),
          ]),
        ),
        rotateNodes(-70, 960, 700, [
          rect(830, 670, 260, 60, t.shade('primary', p.to), { name: 'Ribbon' }),
          ribbonLabel(830, 680, t.color('surface')),
        ]),
        rotateNodes(-70, 110, 660, [
          rect(-20, 630, 260, 60, t.color('primary'), { name: 'Ribbon' }),
          ribbonLabel(-20, 640, t.color('background')),
        ]),
        reviewCard(
          170,
          540,
          740,
          {
            card: t.color('surface'),
            name: t.color('text'),
            stars: t.color('primary'),
            quote: t.shade('text', QUOTE_GREY),
            heading: t.font('heading'),
            body: t.font('body'),
          },
          { name: t.copy('name'), face: 'man-portrait-3', quote: t.copy('quote') },
        ),
        sparkle(860, 250, 110, t.color('surface')),
        sparkle(930, 860, 70, t.color('surface')),
        sparkle(900, 1180, 90, t.color('surface')),
      ];
    },
  );

const paperSheet = (x: number, y: number, angle: number, fill: string) =>
  rotateNodes(angle, x + 380, y + 300, [
    rect(x, y, 760, 600, fill, { cornerRadius: 8, name: 'Paper', ...shadow(24, 8) }),
  ]);

export const clientsSay = (p: ReviewPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        primary: {
          value: p.from,
          hint: 'Top of the page and ad box gradients; its shades color the bottom of the gradients, the stars and the story box',
        },
        surface: {
          value: p.paper,
          hint: 'Front newspaper sheet, the masthead title and the sparkles; its shades color the back sheets and column lines',
        },
        text: {
          value: p.ink,
          hint: 'Headline, masthead, reviewer name, story, headline bars and handle',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Headline', value: 'Real words from\nreal partners' },
        masthead: { label: 'Masthead', value: 'What Our Clients Say' },
        name: { label: 'Reviewer', value: 'Priya Shah' },
        quote: { label: 'Quote', value: 'The campaign paid for\nitself in three weeks.' },
        handle: { label: 'Handle', value: 'brightline.studio' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const gradient = linear(160, t.color('primary'), t.shade('primary', p.to));
      return [
        rect(0, 0, W, H, gradient, { name: 'Background' }),
        text(t.copy('title'), 0, 110, W, {
          fontFamily: t.font('heading'),
          fontSize: 70,
          fontWeight: 900,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.1,
        }),
        paperSheet(160, 420, -7, t.shade('surface', '#e9e9ee')),
        paperSheet(160, 420, 4, t.shade('surface', '#f4f4f6')),
        paperSheet(160, 420, 0, t.color('surface')),
        rect(200, 460, 680, 90, t.color('text'), { name: 'Masthead' }),
        text(t.copy('masthead'), 220, 480, 640, {
          fontFamily: t.font('heading'),
          fontSize: 46,
          fontWeight: 900,
          fill: t.color('surface'),
        }),
        rect(200, 580, 440, 240, t.shade('primary', p.soft), {
          cornerRadius: 10,
          name: 'Story box',
        }),
        avatar('woman-portrait-4', 250, 630, 32),
        text(t.copy('name'), 296, 604, 300, {
          fontFamily: t.font('heading'),
          fontSize: 28,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        rating(296, 642, 20, 5, t.shade('primary', p.to), 0.2),
        text(t.copy('quote'), 222, 700, 400, {
          fontFamily: t.font('body'),
          fontSize: 26,
          fontWeight: 600,
          fill: t.color('text'),
          lineHeight: 1.35,
        }),
        [0, 1, 2, 3, 4, 5].map((row) =>
          rect(670, 590 + row * 40, 210, 14, t.shade('surface', '#c9c9d1'), {
            cornerRadius: 7,
            name: 'Column line',
          }),
        ),
        rect(670, 830, 210, 150, gradient, { cornerRadius: 10, name: 'Ad box' }),
        [0, 1].map((row) =>
          rect(200, 860 + row * 50, 440, 22, t.color('text'), {
            cornerRadius: 4,
            name: 'Headline bar',
          }),
        ),
        sparkle(110, 360, 120, t.color('surface')),
        sparkle(890, 980, 110, t.color('surface')),
        text(t.copy('handle'), 0, 1230, W, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 700,
          fill: t.color('text'),
          align: 'center',
        }),
      ];
    },
  );

const photoQuoteSpec = {
  colors: {
    background: { value: AMBER.ink, hint: 'Dark shade fading over the bottom of the photo' },
    primary: {
      value: AMBER.from,
      hint: 'Photo frame and the #REVIEW tag; its deeper shade colors the stars and the reviewer line',
    },
    surface: { value: AMBER.paper, hint: 'Quote box, the big quote mark and the sparkle' },
    text: { value: AMBER.ink, hint: 'Tag label and the quote' },
  },
  fonts: {
    heading: HEADING,
    mark: { label: 'Quote mark font', value: 'Archivo Black' },
    body: BODY,
  },
  copy: {
    tag: { label: 'Tag', value: '#REVIEW' },
    mark: { label: 'Quote mark', value: '“' },
    quote: {
      label: 'Quote',
      value:
        '"Brightline turned our scattered posts into a\nsystem. Inbound calls doubled in a quarter."',
    },
    reviewer: { label: 'Reviewer', value: 'Marco Bianchi, Founder at Tessaro' },
  },
} as const satisfies ThemeSpec;

export const photoQuote = themed(W, H, photoQuoteSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('meeting-1', 0, 0, W, H, { name: 'Meeting photo' }),
  rect(
    0,
    0,
    W,
    H,
    linear(
      180,
      t.shade('background', 'rgba(18,18,18,0.05)'),
      t.shade('background', 'rgba(18,18,18,0.75)'),
    ),
    { name: 'Shade' },
  ),
  rect(110, 150, 860, 820, t.shade('primary', 'rgba(0,0,0,0)'), {
    stroke: t.color('primary'),
    strokeWidth: 18,
    name: 'Frame',
  }),
  rect(110, 90, 250, 70, t.color('primary'), { name: 'Tag' }),
  text(t.copy('tag'), 110, 104, 250, {
    fontFamily: t.font('heading'),
    fontSize: 38,
    fontWeight: 900,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('mark'), 790, 20, 220, {
    fontFamily: t.font('mark'),
    fontSize: 340,
    fontWeight: 400,
    fill: t.color('surface'),
    align: 'center',
    lineHeight: 1,
  }),
  rect(110, 1000, 860, 250, t.color('surface'), { cornerRadius: 22, name: 'Quote box' }),
  rating(150, 1036, 30, 5, t.shade('primary', AMBER.to), 0.2),
  text(t.copy('quote'), 150, 1090, 800, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.color('text'),
    lineHeight: 1.35,
  }),
  text(t.copy('reviewer'), 150, 1190, 800, {
    fontFamily: t.font('heading'),
    fontSize: 26,
    fontWeight: 800,
    fill: t.shade('primary', AMBER.to),
  }),
  sparkle(900, 900, 120, t.color('surface')),
]);
