import { icon, pill, rect, type Template, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, BRAND, brandFooter, darkBackground, H, HEAD, TIDE, W } from './palette';
import { trail } from './slide-kit';

const CLEAR = 'rgba(0,0,0,0)';

const highlight = (
  label: string,
  x: number,
  y: number,
  size: number,
  fontFamily: string,
  fill: string,
  color: string,
) => {
  const width = label.length * size * 0.7 + size * 0.9;
  return [
    rect(x, y, width, size * 1.55, fill, { cornerRadius: 10, name: 'Highlight' }),
    text(label, x, y + size * 0.2, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 800,
      fill: color,
      align: 'center',
    }),
  ];
};

const BACKGROUND = {
  value: TIDE.teal,
  hint: 'Page gradient and the text on the coral highlight; its darker shade is the bottom of the gradient',
} as const;

const sparkSpec = {
  colors: {
    background: BACKGROUND,
    primary: { value: TIDE.coral, hint: 'Sparks, the Momentum highlight and the arrow' },
    secondary: { value: TIDE.mist, hint: 'Dashed trail line' },
    text: { value: TIDE.white, hint: 'Turn, Into and the brand name' },
  },
  fonts: { heading: HEAD },
  copy: {
    lead: { label: 'Title start', value: 'Turn' },
    title: { label: 'Title', value: 'Sparks' },
    joiner: { label: 'Title joiner', value: 'Into' },
    highlight: { label: 'Highlight', value: 'Momentum' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const sparkCover = themed(W, H, sparkSpec, (t) => {
  const head = t.font('heading');
  const italic = (label: string, y: number) =>
    text(label, 90, y, 600, {
      fontFamily: head,
      fontSize: 110,
      fontWeight: 400,
      italic: true,
      fill: t.color('text'),
    });
  return [
    darkBackground(t.color('background'), t.shade('background', TIDE.night)),
    italic(t.copy('lead'), 290),
    text(t.copy('title'), 90, 410, 800, {
      fontFamily: head,
      fontSize: 170,
      fontWeight: 800,
      fill: t.color('primary'),
    }),
    italic(t.copy('joiner'), 610),
    highlight(
      t.copy('highlight'),
      80,
      760,
      110,
      head,
      t.color('primary'),
      t.shade('background', TIDE.deep),
    ),
    trail(
      'M0 70 C70 10 150 110 210 40',
      850,
      790,
      220,
      120,
      t.color('secondary'),
      t.shade('secondary', CLEAR),
      6,
      true,
    ),
    brandFooter(t.copy('brand'), head, t.color('text'), t.color('primary')),
  ];
});

const planeStep = (title: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: BACKGROUND,
        primary: { value: TIDE.coral, hint: `${title} highlight` },
        secondary: { value: TIDE.mist, hint: 'Dashed flight trails' },
        text: { value: TIDE.white, hint: 'Paper plane and the body text' },
      },
      fonts: { heading: HEAD, body: BODY },
      copy: {
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const line = t.color('secondary');
      const clear = t.shade('secondary', CLEAR);
      return [
        darkBackground(t.color('background'), t.shade('background', TIDE.night)),
        trail(
          'M0 330 C140 330 200 190 300 230 C390 266 340 340 290 300 C240 260 330 110 560 60',
          0,
          170,
          580,
          360,
          line,
          clear,
          6,
          true,
        ),
        icon('send', 560, 120, 200, t.color('text'), { strokeWidth: 1.4 }),
        highlight(
          t.copy('title'),
          240,
          560,
          62,
          t.font('heading'),
          t.color('primary'),
          t.shade('background', TIDE.deep),
        ),
        text(t.copy('body'), 240, 700, 720, {
          fontFamily: t.font('body'),
          fontSize: 52,
          fontWeight: 500,
          fill: t.color('text'),
          lineHeight: 1.4,
        }),
        trail(
          'M0 130 C80 130 120 20 220 40 C260 48 280 20 300 0',
          780,
          1110,
          300,
          140,
          line,
          clear,
          6,
          true,
        ),
      ];
    },
  );

const keepSpec = {
  colors: {
    background: {
      ...BACKGROUND,
      hint: 'Page gradient and the text on the coral highlight and button; its darker shade is the bottom of the gradient',
    },
    primary: { value: TIDE.coral, hint: 'Keep Going highlight and the Comment below button' },
    secondary: { value: TIDE.mist, hint: 'Dashed trail line' },
    text: { value: TIDE.white, hint: 'Main message' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Keep Going' },
    message: {
      label: 'Message',
      value: 'Follow for more and\nsend this to someone\nwho needs a push!',
    },
    button: { label: 'Button', value: 'Comment below' },
  },
} as const satisfies ThemeSpec;

const keepGoing = themed(W, H, keepSpec, (t) => [
  darkBackground(t.color('background'), t.shade('background', TIDE.night)),
  highlight(
    t.copy('title'),
    280,
    300,
    66,
    t.font('heading'),
    t.color('primary'),
    t.shade('background', TIDE.deep),
  ),
  text(t.copy('message'), 60, 470, 960, {
    fontFamily: t.font('heading'),
    fontSize: 74,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.25,
  }),
  pill(t.copy('button'), 370, 880, {
    fill: t.color('primary'),
    color: t.shade('background', TIDE.deep),
    fontSize: 38,
    fontFamily: t.font('body'),
    fontWeight: 700,
    width: 340,
  }),
  trail(
    'M0 260 C120 260 200 120 340 150 C420 168 440 80 360 60',
    0,
    920,
    440,
    280,
    t.color('secondary'),
    t.shade('secondary', CLEAR),
    6,
    true,
  ),
]);

export const SPARK_SERIES: readonly Template[] = [
  sparkCover,
  planeStep(
    'Catch Ideas',
    'Every big win starts as a small thought. Write it down before it slips away.',
  ),
  planeStep(
    'Map the Route',
    'Break the idea into clear steps, set a goal and pick the first move today.',
  ),
  planeStep('Make the Move', 'Plans only work once you act. Ship a rough version and learn fast.'),
  planeStep(
    'Read the Signals',
    'Track what lands, cut what does not and let real numbers guide the next step.',
  ),
  keepGoing,
];
