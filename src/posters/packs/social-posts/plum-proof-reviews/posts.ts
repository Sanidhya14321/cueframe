import {
  avatar,
  group,
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

export interface ReviewTheme {
  brand: string;
  ink: string;
  paper: string;
  accent: string;
  shade: string;
}

export const PLUM: ReviewTheme = {
  brand: '#8b5cf6',
  ink: '#140b24',
  paper: '#ffffff',
  accent: '#facc15',
  shade: '#2a1d45',
};

export const SPRUCE: ReviewTheme = {
  brand: '#14b8a6',
  ink: '#062925',
  paper: '#ffffff',
  accent: '#fb7185',
  shade: '#0d3b36',
};

export const { width: W, height: H } = POST_SIZE;
export const QUOTE_GREY = '#4b5563';
export const DISPLAY = { label: 'Display font', value: 'Archivo Black' } as const;
export const HEADING = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;

export const FACES: readonly PosterPhotoName[] = [
  'woman-portrait-2',
  'man-portrait-1',
  'woman-portrait-4',
];
export const NAMES = ['Maya Lindqvist', 'Tomas Reyes', 'Aisha Benton'];
export const QUOTES = [
  'They rebuilt our launch plan in a week and our bookings doubled within a month.',
  'Clear strategy, fast replies and content our customers actually share.',
  'The friendliest team we have hired. Every post felt exactly like us.',
];

export interface CardStyle {
  card: string;
  name: string;
  stars: string;
  quote: string;
  heading: string;
  body: string;
}

export const reviewCard = (
  style: CardStyle,
  x: number,
  y: number,
  width: number,
  face: PosterPhotoName,
  name: string,
  quote: string,
) =>
  group(
    rect(x, y, width, 250, style.card, {
      name: 'Review card',
      cornerRadius: 16,
      ...shadow(28, 12, 'rgba(0,0,0,0.3)'),
    }),
    avatar(face, x + 62, y + 62, 36),
    text(name, x + 116, y + 30, width - 140, {
      fontFamily: style.heading,
      fontSize: 30,
      fontWeight: 700,
      fill: style.name,
    }),
    rating(x + 116, y + 72, 24, 5, style.stars),
    text(quote, x + 30, y + 124, width - 60, {
      fontFamily: style.body,
      fontSize: 25,
      fontWeight: 500,
      fill: style.quote,
      lineHeight: 1.4,
    }),
  );

const wordSpec = (theme: ReviewTheme) =>
  ({
    colors: {
      background: { value: theme.ink, hint: 'Page and the reviewer name' },
      surface: { value: theme.paper, hint: 'Review card, #REVIEW tags and the white stars' },
      primary: { value: theme.brand, hint: 'REV, IEW and the #REVIEW tag text' },
      accent: { value: theme.accent, hint: 'Rating stars and the small star' },
      text: { value: QUOTE_GREY, hint: 'Review quote' },
    },
    fonts: { display: DISPLAY, heading: HEADING, body: BODY },
    copy: {
      top: { label: 'Title start', value: 'REV' },
      bottom: { label: 'Title end', value: 'IEW' },
      tag: { label: 'Tag', value: '#REVIEW' },
      name: { label: 'Reviewer', value: NAMES[0] ?? '' },
      quote: { label: 'Quote', value: QUOTES[0] ?? '' },
    },
  }) as const satisfies ThemeSpec;

export const reviewWord = (theme: ReviewTheme) =>
  themed(W, H, wordSpec(theme), (t) => {
    const word = (content: string, x: number, y: number, width: number) =>
      text(content, x, y, width, {
        fontFamily: t.font('display'),
        fontSize: 380,
        fontWeight: 400,
        fill: t.color('primary'),
        lineHeight: 1,
        rotation: -8,
      });
    const tag = (x: number, y: number) =>
      rotateNodes(-64, x, y, [
        rect(x, y, 300, 66, t.color('surface'), { name: 'Tag' }),
        text(t.copy('tag'), x, y + 12, 300, {
          fontFamily: t.font('display'),
          fontSize: 36,
          fontWeight: 400,
          fill: t.color('primary'),
          align: 'center',
          letterSpacing: 2,
        }),
      ]);
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      word(t.copy('top'), 60, 170, 960),
      word(t.copy('bottom'), 150, 850, 920),
      tag(40, 820),
      tag(900, 1290),
      reviewCard(
        {
          card: t.color('surface'),
          name: t.color('background'),
          stars: t.color('accent'),
          quote: t.color('text'),
          heading: t.font('heading'),
          body: t.font('body'),
        },
        150,
        520,
        780,
        FACES[0] ?? 'woman-portrait-2',
        t.copy('name'),
        t.copy('quote'),
      ),
      star(5, 880, 60, 110, t.color('surface'), { innerRatio: 0.42 }),
      star(5, 90, 1180, 80, t.color('surface'), { innerRatio: 0.42 }),
      star(5, 560, 1220, 60, t.color('accent'), { innerRatio: 0.42 }),
    ];
  });

const clientsSpec = (theme: ReviewTheme) =>
  ({
    colors: {
      background: {
        value: theme.brand,
        hint: 'Page, the review box outline and the 120+ badge box',
      },
      surface: {
        value: theme.paper,
        hint: 'Front paper sheet and the review box; its shades color the sheets behind',
      },
      primary: {
        value: theme.ink,
        hint: 'Header bar, the RATED column, the body lines and the reviewer name; its shades color the footer bar and the quote',
      },
      accent: { value: theme.accent, hint: 'Rating stars and the small star' },
      text: {
        value: theme.paper,
        hint: 'Header title, RATED label, 120+ badge text, the closing line and the white stars',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Header title', value: 'What Our Clients Say' },
      name: { label: 'Reviewer', value: NAMES[1] ?? '' },
      quote: { label: 'Quote', value: QUOTES[1] ?? '' },
      rated: { label: 'Rating label', value: 'RATED 4.9' },
      badge: { label: 'Badge', value: '120+\nhappy brands' },
      closing: { label: 'Closing line', value: 'Real words from real clients' },
    },
  }) as const satisfies ThemeSpec;

export const clientsSay = (theme: ReviewTheme) =>
  themed(W, H, clientsSpec(theme), (t) => {
    const heading = t.font('heading');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      rect(170, 300, 760, 720, t.shade('surface', '#e9e4f5'), {
        rotation: 5,
        name: 'Back sheet',
      }),
      rect(140, 330, 760, 720, t.shade('surface', '#f6f3fb'), {
        rotation: -4,
        name: 'Middle sheet',
      }),
      rect(160, 320, 760, 720, t.color('surface'), { name: 'Front sheet', ...shadow(30, 14) }),
      rect(200, 360, 680, 92, t.color('primary'), { name: 'Header' }),
      text(t.copy('title'), 200, 380, 680, {
        fontFamily: heading,
        fontSize: 46,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      rect(200, 480, 440, 250, t.color('surface'), {
        stroke: t.color('background'),
        strokeWidth: 6,
        name: 'Review box',
      }),
      avatar(FACES[1] ?? 'man-portrait-1', 252, 534, 30),
      text(t.copy('name'), 296, 508, 330, {
        fontFamily: heading,
        fontSize: 26,
        fontWeight: 700,
        fill: t.color('primary'),
      }),
      rating(296, 546, 20, 5, t.color('accent')),
      text(t.copy('quote'), 224, 596, 396, {
        fontFamily: t.font('body'),
        fontSize: 22,
        fontWeight: 500,
        fill: t.shade('primary', QUOTE_GREY),
        lineHeight: 1.4,
      }),
      rect(670, 480, 210, 46, t.color('primary'), { name: 'Column head' }),
      text(t.copy('rated'), 670, 488, 210, {
        fontFamily: heading,
        fontSize: 24,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      Array.from({ length: 6 }, (_, index) =>
        rect(670, 548 + index * 32, 210, 14, t.color('primary'), { name: 'Column line' }),
      ),
      Array.from({ length: 4 }, (_, index) =>
        rect(200, 770 + index * 40, index === 3 ? 360 : 400, 18, t.color('primary'), {
          name: 'Body line',
        }),
      ),
      rect(640, 770, 240, 150, t.color('background'), { name: 'Badge box' }),
      text(t.copy('badge'), 640, 788, 240, {
        fontFamily: heading,
        fontSize: 34,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1.15,
      }),
      rect(200, 950, 680, 50, t.shade('primary', theme.shade), { name: 'Footer bar' }),
      text(t.copy('closing'), 0, 1130, W, {
        fontFamily: heading,
        fontSize: 52,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      star(5, 90, 220, 100, t.color('text'), { innerRatio: 0.42 }),
      star(5, 900, 990, 90, t.color('text'), { innerRatio: 0.42 }),
      star(5, 930, 170, 60, t.color('accent'), { innerRatio: 0.42 }),
    ];
  });

const photoSpec = (theme: ReviewTheme) =>
  ({
    colors: {
      background: {
        value: theme.ink,
        hint: 'Page behind the photo, the quote box and the quote mark; its shade tints the photo',
      },
      primary: {
        value: theme.brand,
        hint: 'Photo frame, #REVIEW tag, the quote mark block and the reviewer line',
      },
      text: { value: theme.paper, hint: '#REVIEW, the quote and the star' },
    },
    fonts: { display: DISPLAY, heading: HEADING, body: BODY },
    copy: {
      tag: { label: 'Tag', value: '#REVIEW' },
      mark: { label: 'Quote mark', value: '“' },
      quote: { label: 'Quote', value: `“${QUOTES[2] ?? ''}”` },
      name: { label: 'Reviewer', value: `${NAMES[2] ?? ''}, Founder` },
    },
  }) as const satisfies ThemeSpec;

export const photoQuote = (theme: ReviewTheme) =>
  themed(W, H, photoSpec(theme), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('team-3', 0, 0, W, H),
    rect(0, 0, W, H, t.shade('background', 'rgba(10,6,20,0.2)'), { name: 'Tint' }),
    rect(100, 170, 880, 1010, t.shade('primary', 'rgba(0,0,0,0)'), {
      stroke: t.color('primary'),
      strokeWidth: 30,
      name: 'Frame',
    }),
    rect(100, 120, 270, 74, t.color('primary'), { name: 'Tag' }),
    text(t.copy('tag'), 100, 136, 270, {
      fontFamily: t.font('display'),
      fontSize: 36,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    rect(790, 110, 190, 180, t.color('primary'), { name: 'Quote block' }),
    text(t.copy('mark'), 790, 90, 190, {
      fontFamily: t.font('display'),
      fontSize: 280,
      fontWeight: 400,
      fill: t.color('background'),
      align: 'center',
      lineHeight: 1,
    }),
    rect(150, 920, 780, 220, t.color('background'), { name: 'Quote box' }),
    text(t.copy('quote'), 190, 950, 700, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.4,
    }),
    text(t.copy('name'), 190, 1080, 700, {
      fontFamily: t.font('heading'),
      fontSize: 28,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    star(5, 50, 1120, 100, t.color('text'), { innerRatio: 0.42 }),
  ]);
