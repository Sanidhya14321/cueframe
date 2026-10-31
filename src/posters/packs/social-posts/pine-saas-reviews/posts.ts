import {
  avatar,
  POST_SIZE,
  rating,
  rect,
  rotateNodes,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

export interface ReviewTheme {
  brand: string;
  ink: string;
  deep: string;
  paper: string;
  cream: string;
  gold: string;
  muted: string;
}

export const PINE: ReviewTheme = {
  brand: '#14a37f',
  ink: '#0b3a2c',
  deep: '#04211a',
  paper: '#ffffff',
  cream: '#effbf5',
  gold: '#f5b301',
  muted: '#4f6b61',
};

export const SUNSET: ReviewTheme = {
  brand: '#ff7a1a',
  ink: '#3a1a06',
  deep: '#1f0d02',
  paper: '#ffffff',
  cream: '#fff4e8',
  gold: '#f5b301',
  muted: '#6b5446',
};

export const COBALT: ReviewTheme = {
  brand: '#2f6bff',
  ink: '#0d1f4d',
  deep: '#071233',
  paper: '#ffffff',
  cream: '#eef3ff',
  gold: '#f5b301',
  muted: '#4f5b7a',
};

export const NAME_INK = '#141414';
export const TAG = '#USERLOVE';
export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const { width: PW, height: PH } = POST_SIZE;

export interface CardLook {
  card: string;
  name: string;
  stars: string;
  quote: string;
  heading: string;
  body: string;
}

export const reviewCard = (
  look: CardLook,
  x: number,
  y: number,
  width: number,
  person: { name: string; photo: PosterPhotoName; quote: string },
  degrees = 0,
) =>
  rotateNodes(degrees, x, y, [
    rect(x, y, width, 200, look.card, {
      name: 'Review card',
      cornerRadius: 18,
      ...shadow(26, 10),
    }),
    avatar(person.photo, x + 62, y + 62, 34),
    text(person.name, x + 112, y + 30, width - 140, {
      fontFamily: look.heading,
      fontSize: 28,
      fontWeight: 700,
      fill: look.name,
    }),
    rating(x + 112, y + 68, 24, 5, look.stars),
    text(person.quote, x + 32, y + 118, width - 64, {
      fontFamily: look.body,
      fontSize: 22,
      fontWeight: 500,
      fill: look.quote,
      lineHeight: 1.3,
    }),
  ]);

export const starShape = (x: number, y: number, size: number, fill: string) =>
  star(5, x, y, size, fill, { innerRatio: 0.42 });

const LETTERS = [
  [50, 40, -8],
  [340, 0, 5],
  [640, 40, 10],
  [90, 840, 6],
  [240, 860, -5],
  [540, 840, 4],
] as const;

export const reviewWord = (theme: ReviewTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        background: { value: theme.deep, hint: 'Page and the tag labels' },
        primary: { value: theme.brand, hint: 'The big REVIEW letters' },
        surface: { value: theme.paper, hint: 'Tags, the review card and the two big stars' },
        accent: { value: theme.gold, hint: 'Rating stars' },
        text: { value: NAME_INK, hint: 'Reviewer name; its lighter shade colors the quote' },
      },
      fonts: {
        letters: { label: 'Letter font', value: 'Archivo Black' },
        heading: HEADING,
        body: BODY,
      },
      copy: {
        letters: { label: 'Letter', value: ['R', 'E', 'V', 'I', 'E', 'W'] },
        tag: { label: 'Tag', value: TAG },
        name: { label: 'Reviewer', value: 'Tomas Berg' },
        quote: {
          label: 'Quote',
          value: 'Setup took ten minutes and our support\nqueue dropped by half in week one.',
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const letters = t.list('letters');
      const tag = (x: number, y: number, degrees: number) =>
        rotateNodes(degrees, x, y, [
          rect(x, y, 290, 74, t.color('surface'), { name: 'Tag', cornerRadius: 8 }),
          text(t.copy('tag'), x, y + 14, 290, {
            fontFamily: t.font('heading'),
            fontSize: 38,
            fontWeight: 800,
            fill: t.color('background'),
            align: 'center',
            letterSpacing: 2,
          }),
        ]);
      return [
        rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
        LETTERS.map(([x, y, degrees], index) =>
          text(letters[index] ?? '', x, y, 480, {
            fontFamily: t.font('letters'),
            fontSize: 400,
            fontWeight: 400,
            fill: t.color('primary'),
            rotation: degrees,
            lineHeight: 1,
          }),
        ),
        tag(1010, 250, 90),
        tag(70, 780, -12),
        reviewCard(
          {
            card: t.color('surface'),
            name: t.color('text'),
            stars: t.color('accent'),
            quote: t.shade('text', theme.muted),
            heading: t.font('heading'),
            body: t.font('body'),
          },
          220,
          500,
          640,
          { name: t.copy('name'), photo: 'man-portrait-1', quote: t.copy('quote') },
        ),
        starShape(820, 390, 100, t.color('surface')),
        starShape(950, 1230, 80, t.color('surface')),
      ];
    },
  );

export const lines = (x: number, y: number, widths: readonly number[], color: string, gap = 26) =>
  widths.map((width, index) =>
    rect(x, y + index * gap, width, 12, color, { name: 'Text line', cornerRadius: 6 }),
  );

export const newspaper = (theme: ReviewTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        primary: { value: theme.brand, hint: 'Page and the score box' },
        surface: {
          value: theme.paper,
          hint: 'Headline, front sheet, masthead title, review box, score and its label, the two big stars and the handle; its shades color the back sheets and text lines',
        },
        secondary: { value: theme.ink, hint: 'Masthead bar, review box outline and the rule' },
        accent: { value: theme.gold, hint: 'Rating stars' },
        text: { value: NAME_INK, hint: 'Reviewer name; its lighter shade colors the quote' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Headline', value: 'Loved by product teams' },
        masthead: { label: 'Masthead', value: 'What Our Users Say' },
        name: { label: 'Reviewer', value: 'Hana Kowalski' },
        quote: {
          label: 'Quote',
          value: 'Dashboards our whole team opens.\nFinally, one source of truth.',
        },
        score: { label: 'Score', value: '4.8' },
        scoreLabel: { label: 'Score label', value: 'app store rating' },
        handle: { label: 'Handle', value: 'stackwise.app' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const line = t.shade('surface', '#b9b6c4');
      return [
        rect(0, 0, PW, PH, t.color('primary'), { name: 'Background' }),
        text(t.copy('title'), 0, 150, PW, {
          fontFamily: t.font('heading'),
          fontSize: 50,
          fontWeight: 700,
          fill: t.color('surface'),
          align: 'center',
        }),
        rotateNodes(-5, 150, 380, [
          rect(150, 380, 780, 640, t.shade('surface', '#d9d4cc'), { name: 'Back sheet' }),
        ]),
        rotateNodes(4, 170, 360, [
          rect(170, 360, 780, 640, t.shade('surface', '#ece8e1'), { name: 'Middle sheet' }),
        ]),
        rect(150, 370, 780, 640, t.color('surface'), { name: 'Front sheet', ...shadow(30, 12) }),
        rect(190, 410, 700, 92, t.color('secondary'), { name: 'Masthead' }),
        text(t.copy('masthead'), 190, 432, 700, {
          fontFamily: t.font('heading'),
          fontSize: 42,
          fontWeight: 800,
          fill: t.color('surface'),
          align: 'center',
        }),
        rect(190, 530, 450, 220, t.color('surface'), {
          name: 'Review box',
          stroke: t.color('secondary'),
          strokeWidth: 4,
        }),
        avatar('woman-portrait-5', 245, 585, 30),
        text(t.copy('name'), 290, 562, 330, {
          fontFamily: t.font('heading'),
          fontSize: 26,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        rating(290, 598, 20, 5, t.color('accent')),
        text(t.copy('quote'), 215, 650, 410, {
          fontFamily: t.font('body'),
          fontSize: 20,
          fontWeight: 500,
          fill: t.shade('text', theme.muted),
          lineHeight: 1.35,
        }),
        lines(670, 540, [220, 190, 220, 160, 220, 200, 140], line),
        rect(670, 730, 220, 4, t.color('secondary'), { name: 'Rule' }),
        lines(190, 790, [300, 280, 300, 240, 300, 200], line),
        lines(520, 790, [120, 100, 120, 90], line),
        rect(670, 780, 220, 180, t.color('primary'), { name: 'Score box' }),
        text(t.copy('score'), 670, 800, 220, {
          fontFamily: t.font('heading'),
          fontSize: 72,
          fontWeight: 800,
          fill: t.color('surface'),
          align: 'center',
        }),
        text(t.copy('scoreLabel'), 670, 890, 220, {
          fontFamily: t.font('body'),
          fontSize: 20,
          fontWeight: 600,
          fill: t.color('surface'),
          align: 'center',
        }),
        starShape(80, 260, 110, t.color('surface')),
        starShape(880, 1060, 120, t.color('surface')),
        text(t.copy('handle'), 0, 1220, PW, {
          fontFamily: t.font('heading'),
          fontSize: 28,
          fontWeight: 600,
          fill: t.color('surface'),
          align: 'center',
          letterSpacing: 1,
        }),
      ];
    },
  );
