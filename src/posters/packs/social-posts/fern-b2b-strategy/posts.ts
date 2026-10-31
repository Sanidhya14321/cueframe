import { linear } from '@/design';
import {
  circle,
  group,
  POST_SIZE,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const FERN = {
  forest: '#1f4d3a',
  deep: '#0f2a20',
  fern: '#3fa36b',
  mint: '#cfe8d8',
  light: '#eef7f1',
  white: '#ffffff',
  sage: '#7fa894',
};

export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Plus Jakarta Sans' } as const;

export const { width: W, height: H } = POST_SIZE;

export const backdrop = (from: string, to: string, angle: number, height: number = H) =>
  rect(0, 0, W, height, linear(angle, from, to), { name: 'Background' });

interface HighlightStyle {
  fill: string;
  color: string;
  fontFamily: string;
}

export const highlight = (
  label: string,
  x: number,
  y: number,
  width: number,
  size: number,
  style: HighlightStyle,
) =>
  group(
    rect(x, y, width, size * 1.3, style.fill, { cornerRadius: 10, name: `${label} highlight` }),
    text(label, x, y + size * 0.1, width, {
      fontFamily: style.fontFamily,
      fontSize: size,
      fontWeight: 800,
      fill: style.color,
      align: 'center',
    }),
  );

const ACROSS = [
  { word: 'REACH', row: 0, start: 3 },
  { word: 'INSIGHT', row: 3, start: 2 },
  { word: 'ENGAGE', row: 5, start: 4 },
  { word: 'STRATEGY', row: 7, start: 0 },
] as const;

const SPINE = 'AUDIENCE';
const SPINE_COLUMN = 5;

const acrossLetters = (index: number) => {
  const entry = ACROSS[index];
  return entry === undefined
    ? []
    : [...entry.word].filter((_, letter) => entry.start + letter !== SPINE_COLUMN);
};

const crosswordSpec = {
  colors: {
    background: {
      value: FERN.mint,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: { value: FERN.white, hint: 'Letter tiles' },
    text: {
      value: FERN.deep,
      hint: 'Title, letters and the tile shadows; its lighter shade colors the handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Find the words that grow a brand' },
    down: {
      label: 'Down word letters',
      value: [...SPINE],
      hint: 'One letter per tile, top to bottom; each one also crosses an across word',
    },
    first: {
      label: 'First across word letters',
      value: acrossLetters(0),
      hint: 'Every letter except the one it shares with the down word',
    },
    second: {
      label: 'Second across word letters',
      value: acrossLetters(1),
      hint: 'Every letter except the one it shares with the down word',
    },
    third: {
      label: 'Third across word letters',
      value: acrossLetters(2),
      hint: 'Every letter except the one it shares with the down word',
    },
    fourth: {
      label: 'Fourth across word letters',
      value: acrossLetters(3),
      hint: 'Every letter except the one it shares with the down word',
    },
    handle: { label: 'Handle', value: 'fernworks.co' },
  },
} as const satisfies ThemeSpec;

const ACROSS_KEYS = ['first', 'second', 'third', 'fourth'] as const;

export const crossword = themed(W, H, crosswordSpec, (t) => {
  const cell = (letter: string, column: number, row: number) => {
    const size = 84;
    const x = 75 + column * (size + 9);
    const y = 300 + row * (size + 9);
    return group(
      rect(x, y, size, size, t.color('surface'), {
        cornerRadius: 10,
        name: 'Letter tile',
        ...shadow(14, 6, t.shade('text', 'rgba(15,42,32,0.2)')),
      }),
      text(letter, x, y + 16, size, {
        fontFamily: t.font('heading'),
        fontSize: 48,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
      }),
    );
  };
  return [
    backdrop(t.color('background'), t.shade('background', '#9fceb3'), 180),
    text(t.copy('title'), 0, 140, W, {
      fontFamily: t.font('heading'),
      fontSize: 40,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    t.list('down').map((letter, row) => cell(letter, SPINE_COLUMN, row)),
    ACROSS.map(({ row, start }, wordIndex) => {
      const letters = t.list(ACROSS_KEYS[wordIndex] ?? 'first');
      return letters.map((letter, index) => {
        const column = start + index;
        return cell(letter, column >= SPINE_COLUMN ? column + 1 : column, row);
      });
    }),
    text(t.copy('handle'), 0, 1200, W, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 600,
      fill: t.shade('text', FERN.forest),
      align: 'center',
      letterSpacing: 2,
    }),
  ];
});

const block = (x: number, y: number, size: number, fill: string, side: string) =>
  group(
    poly(
      [
        [x, y],
        [x + size * 0.3, y - size * 0.25],
        [x + size * 1.3, y - size * 0.25],
        [x + size, y],
      ],
      side,
      { name: 'Block top' },
    ),
    poly(
      [
        [x + size, y],
        [x + size * 1.3, y - size * 0.25],
        [x + size * 1.3, y + size * 0.75],
        [x + size, y + size],
      ],
      side,
      { name: 'Block side', opacity: 0.7 },
    ),
    rect(x, y, size, size, fill, { name: 'Block face' }),
  );

const leadSpec = {
  colors: {
    background: {
      value: FERN.white,
      hint: 'Page gradient top and the Trend word; its tinted shade is the bottom of the gradient',
    },
    surface: {
      value: '#f7faf8',
      hint: 'Faces of the three plain blocks; its darker shade colors their tops and sides',
    },
    primary: {
      value: FERN.fern,
      hint: 'Trend highlight and the tilted front block; its darker shade colors that block top and side',
    },
    text: { value: FERN.deep, hint: 'Headline' },
  },
  fonts: { heading: HEADING },
  copy: {
    headline: { label: 'Headline', value: "Don't just\nfollow,\nLead the" },
    highlight: { label: 'Highlighted word', value: 'Trend' },
  },
} as const satisfies ThemeSpec;

export const leadTrend = themed(W, H, leadSpec, (t) => {
  const face = t.color('surface');
  const side = t.shade('surface', '#b9cec1');
  return [
    backdrop(t.color('background'), t.shade('background', FERN.light), 180),
    text(t.copy('headline'), 0, 150, W, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.1,
    }),
    highlight(t.copy('highlight'), 360, 480, 360, 96, {
      fill: t.color('primary'),
      color: t.color('background'),
      fontFamily: t.font('heading'),
    }),
    block(40, 1010, 210, face, side),
    block(260, 960, 210, face, side),
    rotateNodes(-14, 580, 980, [
      block(490, 880, 220, t.color('primary'), t.shade('primary', FERN.forest)),
    ]),
    block(760, 990, 210, face, side),
  ];
});

const webinarSpec = {
  colors: {
    background: {
      value: FERN.light,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    primary: {
      value: FERN.forest,
      hint: 'Watch strap, hour ticks and the date; its darker shade colors the watch case and the bottom of the strap',
    },
    accent: { value: FERN.fern, hint: 'Webinar' },
    surface: { value: FERN.white, hint: 'Watch face' },
    text: { value: FERN.deep, hint: 'Online and the session topic' },
  },
  fonts: {
    script: { label: 'Script font', value: 'Dancing Script' },
    heading: HEADING,
    body: BODY,
  },
  copy: {
    intro: { label: 'Intro', value: 'Online' },
    title: { label: 'Title', value: 'Webinar' },
    topic: { label: 'Topic', value: 'Strategy 101' },
    date: { label: 'Date and time', value: 'Wednesday, June 18\nat 6 PM GMT' },
  },
} as const satisfies ThemeSpec;

export const watchWebinar = themed(W, H, webinarSpec, (t) => [
  backdrop(t.color('background'), t.shade('background', FERN.mint), 180),
  rect(360, 0, 360, H, linear(180, t.color('primary'), t.shade('primary', FERN.deep)), {
    cornerRadius: 40,
    name: 'Watch strap',
  }),
  circle(540, 675, 400, t.shade('primary', FERN.deep), {
    name: 'Watch case',
    ...shadow(50, 20, 'rgba(0,0,0,0.35)'),
  }),
  circle(540, 675, 360, t.color('surface'), { name: 'Watch face' }),
  Array.from({ length: 12 }, (_, index) =>
    rotateNodes(index * 30, 540, 675, [
      rect(533, 330, 14, index % 3 === 0 ? 50 : 30, t.color('primary'), {
        cornerRadius: 7,
        name: 'Tick',
      }),
    ]),
  ),
  text(t.copy('intro'), 340, 440, 400, {
    fontFamily: t.font('script'),
    fontSize: 90,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('title'), 340, 540, 400, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 800,
    fill: t.color('accent'),
    align: 'center',
  }),
  text(t.copy('topic'), 340, 660, 400, {
    fontFamily: t.font('heading'),
    fontSize: 44,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('date'), 340, 730, 400, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 500,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1.35,
  }),
]);

const percentSpec = {
  colors: {
    background: {
      value: FERN.forest,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: { value: FERN.white, hint: 'Diagonal band across the bottom' },
    text: { value: FERN.white, hint: 'Lead-in lines and the highlighted word' },
    accent: { value: FERN.fern, hint: 'Highlight behind the key word' },
    primary: {
      value: FERN.mint,
      hint: 'Big statistic gradient; its deeper shade is the bottom of the gradient',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    lead: { label: 'Lead-in', value: 'of B2B teams now' },
    highlight: { label: 'Highlighted word', value: 'automate' },
    tail: { label: 'Closing line', value: 'their weekly reports' },
    stat: { label: 'Statistic', value: '72%' },
  },
} as const satisfies ThemeSpec;

export const bigPercent = themed(W, H, percentSpec, (t) => [
  backdrop(t.color('background'), t.shade('background', FERN.deep), 165),
  poly(
    [
      [1080, 520],
      [1080, 700],
      [300, 1350],
      [100, 1350],
    ],
    t.color('surface'),
    { name: 'Diagonal band' },
  ),
  text(t.copy('lead'), 90, 150, 900, {
    fontFamily: t.font('body'),
    fontSize: 54,
    fontWeight: 600,
    fill: t.color('text'),
  }),
  highlight(t.copy('highlight'), 90, 228, 300, 52, {
    fill: t.color('accent'),
    color: t.color('text'),
    fontFamily: t.font('heading'),
  }),
  text(t.copy('tail'), 90, 310, 900, {
    fontFamily: t.font('body'),
    fontSize: 54,
    fontWeight: 600,
    fill: t.color('text'),
  }),
  text(t.copy('stat'), 50, 640, 1000, {
    fontFamily: t.font('heading'),
    fontSize: 400,
    fontWeight: 800,
    fill: linear(180, t.color('primary'), t.shade('primary', '#8fd3ac')),
    lineHeight: 1,
    letterSpacing: -12,
    ...shadow(30, 12, 'rgba(0,0,0,0.35)'),
  }),
]);
