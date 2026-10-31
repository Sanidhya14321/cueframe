import { circle, group, icon, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { BROWN_SHADOW, backdrop, H, HEADING, label, SUNSET, W } from './posts';

const CARD_Y = [560, 870] as const;

const mythSpec = {
  colors: {
    background: {
      value: SUNSET.charcoal,
      hint: 'Page; its lighter shade colors the top of the page',
    },
    surface: { value: SUNSET.smoke, hint: 'Myth and Fact cards' },
    primary: { value: SUNSET.orange, hint: 'Circle behind or and the Myth and Fact tags' },
    text: {
      value: SUNSET.white,
      hint: 'Myth, or, Fact, the tag words and the card copy; its faint shades color the stripes and card outlines',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    first: { label: 'First title', value: 'Myth' },
    joiner: { label: 'Joiner', value: 'or' },
    second: { label: 'Second title', value: 'Fact' },
    tags: { label: 'Card tag', value: ['Myth', 'Fact'] },
    statements: {
      label: 'Card copy',
      value: [
        'Top performers should always reply\nto messages late at night.',
        'Protected evenings keep teams sharp\nand make better decisions.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const mythFact = themed(W, H, mythSpec, (t) => {
  const font = t.font('heading');
  const title = (content: string, y: number) =>
    text(content, 0, y, W, {
      fontFamily: font,
      fontSize: 170,
      fontWeight: 900,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    });
  const statements = t.list('statements');
  return [
    backdrop(t.shade('background', SUNSET.smoke), t.color('background')),
    Array.from({ length: 6 }, (_, index) =>
      rect(index * 180, 0, 90, H, t.shade('text', 'rgba(255,255,255,0.03)'), { name: 'Stripe' }),
    ),
    title(t.copy('first'), 130),
    circle(540, 340, 46, t.color('primary')),
    text(t.copy('joiner'), 490, 314, 100, {
      fontFamily: font,
      fontSize: 42,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    title(t.copy('second'), 370),
    t.list('tags').map((tag, index) => {
      const y = CARD_Y[index] ?? CARD_Y[0];
      return group(
        rect(110, y, 860, 200, t.color('surface'), {
          cornerRadius: 26,
          stroke: t.shade('text', 'rgba(255,255,255,0.35)'),
          strokeWidth: 2,
          name: `${tag} card`,
          ...shadow(30, 12, 'rgba(0,0,0,0.5)'),
        }),
        label(
          tag,
          index === 0 ? 150 : 790,
          y - 28,
          30,
          140,
          t.color('primary'),
          t.color('text'),
          font,
        ),
        text(statements[index] ?? '', 110, y + 62, 860, {
          fontFamily: font,
          fontSize: 36,
          fontWeight: 600,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.3,
        }),
      );
    }),
  ];
});

const knowSpec = {
  colors: {
    background: {
      value: SUNSET.ember,
      hint: 'Page; its lighter shade colors the top corner and its dark shade the question mark shadow',
    },
    text: {
      value: SUNSET.white,
      hint: 'Question mark, Did You, the Know? label words and A sharp strategy',
    },
    secondary: { value: SUNSET.charcoal, hint: 'Know? label and Drives 3x Growth' },
  },
  fonts: { heading: HEADING },
  copy: {
    mark: { label: 'Big mark', value: '?' },
    title: { label: 'Title', value: 'Did You' },
    label: { label: 'Label', value: 'Know?' },
    intro: { label: 'Intro', value: 'A sharp strategy' },
    payoff: { label: 'Payoff', value: 'Drives 3x Growth' },
  },
} as const satisfies ThemeSpec;

export const didYouKnow = themed(W, H, knowSpec, (t) => {
  const font = t.font('heading');
  return [
    backdrop(t.shade('background', SUNSET.glow), t.color('background'), 165),
    text(t.copy('mark'), 500, 40, 560, {
      fontFamily: font,
      fontSize: 760,
      fontWeight: 900,
      fill: t.color('text'),
      lineHeight: 1,
      ...shadow(40, 16, t.shade('background', BROWN_SHADOW)),
    }),
    text(t.copy('title'), 90, 700, 700, {
      fontFamily: font,
      fontSize: 120,
      fontWeight: 900,
      fill: t.color('text'),
    }),
    label(t.copy('label'), 90, 850, 110, 380, t.color('secondary'), t.color('text'), font),
    text(t.copy('intro'), 90, 1060, 700, {
      fontFamily: font,
      fontSize: 48,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    text(t.copy('payoff'), 90, 1120, 700, {
      fontFamily: font,
      fontSize: 54,
      fontWeight: 800,
      fill: t.color('secondary'),
    }),
  ];
});

const peopleSpec = {
  colors: {
    background: { value: SUNSET.white, hint: 'Page; its warm shade colors the bottom of the page' },
    primary: { value: SUNSET.orange, hint: 'Highlighted people icons and the big percentage' },
    secondary: { value: '#d9cfc8', hint: 'Remaining people icons' },
    text: { value: SUNSET.charcoal, hint: 'Caption under the percentage' },
  },
  fonts: { heading: HEADING },
  copy: {
    stat: { label: 'Stat', value: '60%' },
    caption: { label: 'Caption', value: 'of buyers check your posts\nbefore they ever reply' },
  },
} as const satisfies ThemeSpec;

export const peopleStat = themed(W, H, peopleSpec, (t) => [
  backdrop(t.color('background'), t.shade('background', SUNSET.soft)),
  Array.from({ length: 40 }, (_, index) =>
    icon(
      'user-round',
      100 + (index % 8) * 112,
      120 + Math.floor(index / 8) * 120,
      100,
      index < 24 ? t.color('primary') : t.color('secondary'),
      { strokeWidth: 2.6 },
    ),
  ),
  text(t.copy('stat'), 0, 760, W, {
    fontFamily: t.font('heading'),
    fontSize: 260,
    fontWeight: 900,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('caption'), 0, 1060, W, {
    fontFamily: t.font('heading'),
    fontSize: 46,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.3,
  }),
]);

const roiSpec = {
  colors: {
    background: { value: SUNSET.ember, hint: 'Page; its lighter shade colors the top corner' },
    text: {
      value: SUNSET.white,
      hint: 'Title and the big numbers; its translucent shade colors the dividers',
    },
    secondary: { value: SUNSET.charcoal, hint: 'Stat descriptions' },
  },
  fonts: { heading: HEADING },
  copy: {
    title: { label: 'Title', value: 'The numbers\nspeak for us' },
    values: { label: 'Stat', value: ['10x', '20h', '5+'] },
    captions: {
      label: 'Stat description',
      value: [
        'Return on spend\nthrough clear strategy',
        'Saved every week\non routine operations',
        'New markets reached\nin a single year',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const roiStats = themed(W, H, roiSpec, (t) => {
  const font = t.font('heading');
  const values = t.list('values');
  const captions = t.list('captions');
  return [
    backdrop(t.shade('background', SUNSET.glow), t.color('background'), 165),
    text(t.copy('title'), 90, 110, 900, {
      fontFamily: font,
      fontSize: 84,
      fontWeight: 900,
      fill: t.color('text'),
      lineHeight: 1.05,
    }),
    values.map((value, index) => {
      const y = 420 + index * 300;
      return group(
        text(value, 90, y, 380, {
          fontFamily: font,
          fontSize: 150,
          fontWeight: 900,
          fill: t.color('text'),
          lineHeight: 1,
        }),
        text(captions[index] ?? '', 500, y + 30, 520, {
          fontFamily: font,
          fontSize: 40,
          fontWeight: 700,
          fill: t.color('secondary'),
          lineHeight: 1.25,
        }),
        index < values.length - 1
          ? rect(90, y + 230, 900, 3, t.shade('text', 'rgba(255,255,255,0.6)'), { name: 'Divider' })
          : [],
      );
    }),
  ];
});
