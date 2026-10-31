import {
  avatar,
  circle,
  cycle,
  poly,
  rating,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  DISPLAY,
  FACES,
  H,
  HEADING,
  NAMES,
  QUOTE_GREY,
  QUOTES,
  type ReviewTheme,
  reviewCard,
  W,
} from './posts';

const typewriterSpec = (theme: ReviewTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      surface: {
        value: '#fbfaf7',
        hint: 'Paper sheet in the typewriter; its shade colors the text lines',
      },
      primary: {
        value: theme.ink,
        hint: 'Lower band, name lines, platen knobs and that speak; its shade colors the platen, keyboard and base',
      },
      accent: { value: theme.accent, hint: 'Rating stars, the typewriter body and the small star' },
      text: {
        value: theme.paper,
        hint: 'Marketing results, the body copy, the keys and the big star',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Marketing\nresults' },
      highlight: { label: 'Highlight', value: 'that\nspeak' },
      body: { label: 'Body', value: 'Five stars, written by\nthe people we serve.' },
    },
  }) as const satisfies ThemeSpec;

export const typewriterScroll = (theme: ReviewTheme) =>
  themed(W, H, typewriterSpec(theme), (t) => {
    const ink = t.color('primary');
    const dark = t.shade('primary', theme.shade);
    const line = t.shade('surface', '#c4c0cc');
    const heading = (content: string, y: number, fill: string) =>
      text(content, 560, y, 480, {
        fontFamily: t.font('heading'),
        fontSize: 84,
        fontWeight: 800,
        fill,
        lineHeight: 1.08,
      });
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      rect(0, 860, W, H - 860, ink, { name: 'Lower band' }),
      rect(130, 0, 360, 1010, t.color('surface'), { name: 'Paper', ...shadow(24, 8) }),
      Array.from({ length: 5 }, (_, index) => {
        const y = 36 + index * 180;
        return [
          avatar(cycle(FACES, index), 180, y + 30, 24),
          rect(216, y + 14, 150, 14, ink, { cornerRadius: 7, name: 'Name line' }),
          rating(216, y + 38, 16, 5, t.color('accent')),
          rect(160, y + 76, 300, 10, line, { cornerRadius: 5, name: 'Text line' }),
          rect(160, y + 96, 300, 10, line, { cornerRadius: 5, name: 'Text line' }),
          rect(160, y + 116, 220, 10, line, { cornerRadius: 5, name: 'Text line' }),
        ];
      }),
      rect(80, 990, 460, 54, dark, { cornerRadius: 27, name: 'Platen' }),
      circle(80, 1017, 34, ink),
      circle(540, 1017, 34, ink),
      poly(
        [
          [110, 1044],
          [510, 1044],
          [550, 1250],
          [70, 1250],
        ],
        t.color('accent'),
        { name: 'Typewriter body' },
      ),
      rect(120, 1110, 380, 120, dark, { cornerRadius: 18, name: 'Keyboard' }),
      Array.from({ length: 21 }, (_, index) =>
        circle(150 + (index % 7) * 53, 1136 + Math.floor(index / 7) * 34, 12, t.color('text')),
      ),
      rect(50, 1250, 520, 34, dark, { cornerRadius: 12, name: 'Base' }),
      heading(t.copy('title'), 260, t.color('text')),
      heading(t.copy('highlight'), 452, ink),
      text(t.copy('body'), 560, 670, 480, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.4,
      }),
      star(5, 820, 960, 120, t.color('text'), { innerRatio: 0.42 }),
      star(5, 940, 120, 70, t.color('accent'), { innerRatio: 0.42 }),
    ];
  });

const envelopeSpec = (theme: ReviewTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      surface: { value: theme.paper, hint: 'Review cards' },
      primary: {
        value: theme.ink,
        hint: 'CLIENT, the envelope pocket and the reviewer names; its shades color the envelope back and flap, the fold and the quotes',
      },
      accent: { value: theme.accent, hint: 'Rating stars and the small star' },
      text: { value: theme.paper, hint: 'reviews and the white stars' },
    },
    fonts: { display: DISPLAY, heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'CLIENT' },
      subtitle: { label: 'Subtitle', value: 'reviews' },
      names: { label: 'Reviewer', value: NAMES },
      quotes: { label: 'Quote', value: QUOTES },
    },
  }) as const satisfies ThemeSpec;

const CARD_SPOTS = [
  { degrees: -7, x: 200, y: 380 },
  { degrees: 5, x: 320, y: 560 },
  { degrees: -3, x: 230, y: 760 },
] as const;

export const envelopeReviews = (theme: ReviewTheme) =>
  themed(W, H, envelopeSpec(theme), (t) => {
    const style = {
      card: t.color('surface'),
      name: t.color('primary'),
      stars: t.color('accent'),
      quote: t.shade('primary', QUOTE_GREY),
      heading: t.font('heading'),
      body: t.font('body'),
    };
    const quotes = t.list('quotes');
    const back = t.shade('primary', theme.shade);
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 0, 80, W, {
        fontFamily: t.font('display'),
        fontSize: 130,
        fontWeight: 400,
        fill: t.color('primary'),
        align: 'center',
      }),
      text(t.copy('subtitle'), 0, 240, W, {
        fontFamily: t.font('heading'),
        fontSize: 56,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      }),
      rect(200, 900, 680, 360, back, { cornerRadius: 30, name: 'Envelope back' }),
      poly(
        [
          [200, 920],
          [540, 700],
          [880, 920],
        ],
        back,
        { name: 'Open flap' },
      ),
      t.list('names').map((name, index) => {
        const spot = cycle(CARD_SPOTS, index);
        return rotateNodes(
          spot.degrees,
          spot.x,
          spot.y,
          reviewCard(style, spot.x, spot.y, 580, cycle(FACES, index), name, quotes[index] ?? ''),
        );
      }),
      poly(
        [
          [200, 1000],
          [540, 1150],
          [880, 1000],
          [880, 1260],
          [200, 1260],
        ],
        t.color('primary'),
        { name: 'Envelope pocket' },
      ),
      poly(
        [
          [200, 1260],
          [540, 1110],
          [880, 1260],
        ],
        t.shade('primary', '#000000'),
        { name: 'Envelope fold', opacity: 0.35 },
      ),
      star(5, 110, 160, 90, t.color('text'), { innerRatio: 0.42 }),
      star(5, 900, 1110, 100, t.color('text'), { innerRatio: 0.42 }),
      star(5, 900, 300, 60, t.color('accent'), { innerRatio: 0.42 }),
    ];
  });

const storySpec = (theme: ReviewTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      surface: { value: theme.paper, hint: 'Review cards' },
      primary: {
        value: theme.ink,
        hint: 'CLIENT LOVE, the button and the reviewer names; its shade colors the quotes',
      },
      accent: { value: theme.accent, hint: 'Rating stars' },
      text: { value: theme.paper, hint: 'Subtitle, the button label and the star' },
    },
    fonts: { display: DISPLAY, heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'CLIENT\nLOVE' },
      subtitle: { label: 'Subtitle', value: 'Swipe through what our\nclients say this month' },
      names: { label: 'Reviewer', value: NAMES },
      quotes: { label: 'Quote', value: QUOTES },
      button: { label: 'Button', value: 'Book your free call' },
    },
  }) as const satisfies ThemeSpec;

export const reviewStory = (theme: ReviewTheme) =>
  themed(STORY_SIZE.width, STORY_SIZE.height, storySpec(theme), (t) => {
    const style = {
      card: t.color('surface'),
      name: t.color('primary'),
      stars: t.color('accent'),
      quote: t.shade('primary', QUOTE_GREY),
      heading: t.font('heading'),
      body: t.font('body'),
    };
    const quotes = t.list('quotes');
    return [
      rect(0, 0, STORY_SIZE.width, STORY_SIZE.height, t.color('background'), {
        name: 'Background',
      }),
      text(t.copy('title'), 80, 140, 920, {
        fontFamily: t.font('display'),
        fontSize: 200,
        fontWeight: 400,
        fill: t.color('primary'),
        lineHeight: 1,
      }),
      text(t.copy('subtitle'), 80, 580, 920, {
        fontFamily: t.font('heading'),
        fontSize: 50,
        fontWeight: 600,
        fill: t.color('text'),
        lineHeight: 1.25,
      }),
      t
        .list('names')
        .map((name, index) =>
          reviewCard(
            style,
            80,
            800 + index * 300,
            920,
            cycle(FACES, index),
            name,
            quotes[index] ?? '',
          ),
        ),
      star(5, 860, 120, 140, t.color('text'), { innerRatio: 0.42 }),
      rect(80, 1730, 920, 100, t.color('primary'), { cornerRadius: 50, name: 'Button' }),
      text(t.copy('button'), 80, 1756, 920, {
        fontFamily: t.font('heading'),
        fontSize: 42,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  });
