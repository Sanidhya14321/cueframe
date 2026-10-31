import { linear } from '@/design';
import {
  circle,
  group,
  icon,
  type Nodes,
  POST_SIZE,
  photo,
  pill,
  rating,
  rect,
  rotateNodes,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface ReviewPalette {
  brand: string;
  deep: string;
  paper: string;
  ink: string;
}

export const CORAL: ReviewPalette = {
  brand: '#ff6b4a',
  deep: '#141a33',
  paper: '#fff4ec',
  ink: '#0d1022',
};

export const LAGOON: ReviewPalette = {
  brand: '#14b8a6',
  deep: '#0b2422',
  paper: '#effcf9',
  ink: '#061514',
};

export const HEADING_FONT = { label: 'Heading font', value: 'Outfit' } as const;
const BODY_FONT = { label: 'Body font', value: 'DM Sans' } as const;
export const STAR_GOLD = '#f5b400';
export const { width: W, height: H } = POST_SIZE;

export interface ReviewCardStyle {
  card: string;
  badge: string;
  icon: string;
  name: string;
  stars: string;
  line: string;
  font: string;
}

export const reviewCard = (
  x: number,
  y: number,
  width: number,
  name: string,
  style: ReviewCardStyle,
  lines = 3,
): Nodes[] => {
  const height = 150 + lines * 34;
  return group(
    rect(x, y, width, height, style.card, {
      cornerRadius: 18,
      name: 'Review card',
      shadow: { color: 'rgba(0,0,0,0.3)', blur: 30, offsetX: 0, offsetY: 12 },
    }),
    circle(x + 54, y + 56, 28, style.badge),
    icon('user', x + 38, y + 40, 32, style.icon),
    text(name, x + 98, y + 30, width - 130, {
      fontFamily: style.font,
      fontSize: 30,
      fontWeight: 700,
      fill: style.name,
    }),
    rating(x + 98, y + 72, 24, 5, style.stars, 0.2),
    Array.from({ length: lines }, (_, index) =>
      rect(
        x + 34,
        y + 130 + index * 34,
        (width - 68) * (index === lines - 1 ? 0.6 : 1),
        14,
        style.line,
        { cornerRadius: 7, name: 'Review line' },
      ),
    ),
  );
};

const lettersSpec = (p: ReviewPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Page and the hashtags on the band; its darker shade colors the reviewer name',
      },
      primary: {
        value: p.brand,
        hint: 'REVIEW, the tag band, the avatar circle and the small star',
      },
      surface: {
        value: '#ffffff',
        hint: 'Review card and the user icon; its grey shade colors the review lines',
      },
      text: { value: p.paper, hint: 'Client feedback, 5.0 and the big star' },
      accent: { value: STAR_GOLD, hint: 'Rating stars' },
    },
    fonts: {
      display: { label: 'Display font', value: 'Anton' },
      heading: HEADING_FONT,
      body: BODY_FONT,
    },
    copy: {
      word: { label: 'Big word', value: 'REVIEW' },
      tags: { label: 'Band hashtags', value: '#REVIEW   #REVIEW   #REVIEW' },
      reviewer: { label: 'Reviewer', value: 'Leah Moreno' },
      label: { label: 'Score label', value: 'Client feedback' },
      score: { label: 'Score', value: '5.0' },
    },
  }) as const satisfies ThemeSpec;

export const reviewLetters = (p: ReviewPalette): Template =>
  themed(W, H, lettersSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('word'), 40, 1310, 1240, {
      fontFamily: t.font('display'),
      fontSize: 380,
      fontWeight: 400,
      fill: t.color('primary'),
      rotation: -90,
      lineHeight: 1,
    }),
    rect(480, 0, 140, H, t.color('primary'), { name: 'Tag band' }),
    text(t.copy('tags'), 525, 1300, 1260, {
      fontFamily: t.font('heading'),
      fontSize: 50,
      fontWeight: 800,
      fill: t.color('background'),
      rotation: -90,
      letterSpacing: 4,
    }),
    reviewCard(
      330,
      470,
      640,
      t.copy('reviewer'),
      {
        card: t.color('surface'),
        badge: t.color('primary'),
        icon: t.color('surface'),
        name: t.shade('background', p.ink),
        stars: t.color('accent'),
        line: t.shade('surface', '#e5e7eb'),
        font: t.font('heading'),
      },
      4,
    ),
    text(t.copy('label'), 660, 120, 380, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    text(t.copy('score'), 660, 170, 380, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    star(5, 910, 1140, 110, t.color('text'), { innerRatio: 0.45 }),
    star(5, 700, 980, 60, t.color('primary'), { innerRatio: 0.45 }),
  ]);

const paperSpec = (p: ReviewPalette) =>
  ({
    colors: {
      background: { value: p.brand, hint: 'Page, the review box border and the 5.0 badge' },
      primary: {
        value: p.deep,
        hint: 'Headline, the left star and the button; its darker shade colors the masthead, column head, reviewer name and body lines',
      },
      surface: {
        value: '#ffffff',
        hint: 'Front sheet, the review box, the masthead, column and badge text; its grey shades color the back sheets and text lines',
      },
      text: { value: p.paper, hint: 'Button label and the right star' },
      accent: { value: STAR_GOLD, hint: 'Rating stars' },
    },
    fonts: { heading: HEADING_FONT },
    copy: {
      headline: { label: 'Headline', value: 'Real words from\nreal clients' },
      masthead: { label: 'Masthead', value: 'What Our Clients Say' },
      reviewer: { label: 'Reviewer', value: 'Amir Hassan' },
      column: { label: 'Column title', value: 'Top rated' },
      badge: { label: 'Badge', value: '5.0 ★' },
      button: { label: 'Button', value: 'Read all 120+ reviews' },
    },
  }) as const satisfies ThemeSpec;

export const clientsSay = (p: ReviewPalette): Template =>
  themed(W, H, paperSpec(p), (t): Nodes[] => {
    const ink = t.shade('primary', p.ink);
    const white = t.color('surface');
    const grey = t.shade('surface', '#d6d3d1');
    const heading = t.font('heading');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('headline'), 90, 110, 900, {
        fontFamily: heading,
        fontSize: 76,
        fontWeight: 800,
        fill: t.color('primary'),
        lineHeight: 1.05,
      }),
      rotateNodes(-7, 540, 700, [
        rect(170, 400, 740, 600, t.shade('surface', '#e7e5e4'), {
          cornerRadius: 6,
          name: 'Back sheet',
        }),
      ]),
      rotateNodes(5, 540, 700, [
        rect(170, 400, 740, 600, t.shade('surface', '#f5f5f4'), {
          cornerRadius: 6,
          name: 'Middle sheet',
        }),
      ]),
      rect(170, 400, 740, 600, white, {
        cornerRadius: 6,
        name: 'Front sheet',
        shadow: { color: 'rgba(0,0,0,0.3)', blur: 30, offsetX: 0, offsetY: 14 },
      }),
      rect(200, 430, 680, 90, ink, { name: 'Masthead' }),
      text(t.copy('masthead'), 200, 452, 680, {
        fontFamily: heading,
        fontSize: 44,
        fontWeight: 800,
        fill: white,
        align: 'center',
      }),
      rect(200, 540, 410, 250, t.color('background'), { cornerRadius: 6, name: 'Review box' }),
      rect(214, 554, 382, 222, white, { cornerRadius: 4, name: 'Review box inner' }),
      text(t.copy('reviewer'), 240, 572, 320, {
        fontFamily: heading,
        fontSize: 28,
        fontWeight: 700,
        fill: ink,
      }),
      rating(240, 616, 22, 5, t.color('accent'), 0.2),
      [0, 1, 2].map((index) =>
        rect(240, 668 + index * 30, index === 2 ? 200 : 330, 12, grey, {
          cornerRadius: 6,
          name: 'Review line',
        }),
      ),
      rect(630, 540, 250, 40, ink, { name: 'Column head' }),
      text(t.copy('column'), 630, 546, 250, {
        fontFamily: heading,
        fontSize: 24,
        fontWeight: 700,
        fill: white,
        align: 'center',
      }),
      Array.from({ length: 6 }, (_, index) =>
        rect(630, 600 + index * 32, index % 3 === 2 ? 170 : 250, 12, grey, {
          cornerRadius: 6,
          name: 'Column line',
        }),
      ),
      Array.from({ length: 4 }, (_, index) =>
        rect(200, 820 + index * 36, index === 3 ? 380 : 680, 16, ink, {
          cornerRadius: 3,
          name: 'Body line',
        }),
      ),
      rect(720, 900, 160, 70, t.color('background'), { cornerRadius: 6, name: 'Badge' }),
      text(t.copy('badge'), 720, 914, 160, {
        fontFamily: heading,
        fontSize: 32,
        fontWeight: 800,
        fill: white,
        align: 'center',
      }),
      star(5, 110, 330, 90, t.color('primary'), { innerRatio: 0.45 }),
      star(5, 880, 1080, 110, t.color('text'), { innerRatio: 0.45 }),
      pill(t.copy('button'), 90, 1170, {
        fill: t.color('primary'),
        color: t.color('text'),
        fontSize: 34,
        fontFamily: heading,
        fontWeight: 700,
      }),
    ];
  });

const quoteSpec = (p: ReviewPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Page, the fade over the photo, the quote mark and the #REVIEW tag',
      },
      primary: { value: p.brand, hint: 'Frame, the quote block and the rating stars' },
      text: { value: p.paper, hint: 'Quote, the client name, the tag label and the star' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      tag: { label: 'Tag', value: '#REVIEW' },
      quote: {
        label: 'Quote',
        value:
          'They rebuilt our booking flow in two weeks. Enquiries doubled and the team finally has evenings back.',
      },
      client: { label: 'Client', value: 'Owen Price, Fieldhouse Cafe' },
    },
  }) as const satisfies ThemeSpec;

export const photoQuote = (p: ReviewPalette): Template =>
  themed(W, H, quoteSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('team-3', 0, 0, W, 1000),
    rect(
      0,
      640,
      W,
      360,
      linear(180, t.shade('background', 'rgba(20,26,51,0)'), t.color('background')),
      { name: 'Photo fade' },
    ),
    rect(80, 130, 920, 880, t.shade('primary', 'rgba(0,0,0,0)'), {
      stroke: t.color('primary'),
      strokeWidth: 18,
      name: 'Frame',
    }),
    rect(810, 60, 170, 150, t.color('primary'), { name: 'Quote block' }),
    icon('quote', 845, 85, 100, t.color('background'), { strokeWidth: 2.4 }),
    pill(t.copy('tag'), 120, 170, {
      fill: t.color('background'),
      color: t.color('text'),
      fontSize: 32,
      fontFamily: t.font('heading'),
      fontWeight: 800,
    }),
    text(t.copy('quote'), 120, 1050, 840, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.35,
    }),
    rating(120, 1230, 34, 5, t.color('primary'), 0.25),
    text(t.copy('client'), 400, 1230, 600, {
      fontFamily: t.font('heading'),
      fontSize: 30,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    star(5, 40, 960, 80, t.color('text'), { innerRatio: 0.45 }),
  ]);
