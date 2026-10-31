import { linear, radial } from '@/design';
import {
  avatar,
  circle,
  dots,
  icon,
  POST_SIZE,
  path,
  poly,
  rect,
  rotateNodes,
  shadow,
  star,
  type ThemeSpec,
  themed,
} from '../../../kit';
import { brandLine, FONT, H, HANDLE, MINT, W, writer } from './posts';

const folder = (
  x: number,
  y: number,
  width: number,
  rotation: number,
  colors: { back: string; front: [string, string, string]; glow: string },
) =>
  rotateNodes(rotation, x + width / 2, y + width * 0.36, [
    rect(x, y, width * 0.42, width * 0.2, colors.back, { name: 'Folder tab', cornerRadius: 18 }),
    rect(x, y + width * 0.08, width, width * 0.62, colors.back, {
      name: 'Folder back',
      cornerRadius: 22,
    }),
    rect(x, y + width * 0.16, width, width * 0.54, linear(160, ...colors.front), {
      name: 'Folder front',
      cornerRadius: 22,
      ...shadow(30, 16, colors.glow),
    }),
  ]);

export const struggling = (height: number) => {
  const ty = height / 2 - 205;
  const spec = {
    colors: {
      background: {
        value: MINT.white,
        hint: 'Page gradient; its darker shade is the bottom of the page',
      },
      primary: {
        value: MINT.green,
        hint: 'Struggling, the arrow and the folder fronts with their lighter and darker shades',
      },
      secondary: {
        value: MINT.deep,
        hint: 'Folder tabs and backs; its shade tints the folder shadows',
      },
      text: { value: MINT.ink, hint: 'Headline and the help line' },
    },
    fonts: { body: FONT },
    copy: {
      highlight: { label: 'Highlighted word', value: 'Struggling' },
      joiner: { label: 'Joining word', value: 'to' },
      headline: { label: 'Headline', value: 'keep up with\ncampaign ideas?' },
      body: { label: 'Help line', value: 'Learn more on\nhow we can help\nyou get organised.' },
    },
  } as const satisfies ThemeSpec;
  return themed(W, height, spec, (t) => {
    const say = writer(t.font('body'));
    const colors = {
      back: t.color('secondary'),
      front: [
        t.shade('primary', MINT.light),
        t.color('primary'),
        t.shade('primary', '#059669'),
      ] as [string, string, string],
      glow: t.shade('secondary', 'rgba(4,120,87,0.35)'),
    };
    return [
      rect(0, 0, W, height, linear(180, t.color('background'), t.shade('background', '#e3ebe8')), {
        name: 'Background',
      }),
      folder(90, 70, 420, -12, colors),
      folder(720, ty - 230, 300, 14, colors),
      folder(110, height - 400, 460, 8, colors),
      say(t.copy('highlight'), 120, ty, 520, 78, t.color('primary'), 800),
      say(t.copy('joiner'), 552, ty, 200, 78, t.color('text'), 500),
      say(t.copy('headline'), 120, ty + 92, 800, 78, t.color('text'), 500),
      icon('corner-down-right', 470, ty + 300, 70, t.color('primary'), { strokeWidth: 2.4 }),
      say(t.copy('body'), 560, ty + 300, 440, 32, t.color('text'), 600),
    ];
  });
};

const PINS: readonly (readonly [number, number])[] = [
  [250, 250],
  [520, 160],
  [430, 400],
  [720, 300],
  [900, 190],
  [620, 580],
  [880, 640],
  [300, 640],
];

const LINKS = [
  [2, 0],
  [2, 1],
  [2, 3],
  [3, 4],
  [2, 5],
  [5, 6],
  [2, 7],
  [3, 6],
]
  .map(([from = 0, to = 0]) => {
    const [x1, y1] = PINS[from] ?? [0, 0];
    const [x2, y2] = PINS[to] ?? [0, 0];
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  })
  .join(' ');

const connectingTeamsSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page and the plus sign' },
    surface: { value: MINT.white, hint: 'Pins, the person icons, photo rings and the more button' },
    primary: { value: MINT.green, hint: 'worldwide and the pin cores; its shade is the pin glow' },
    text: {
      value: MINT.white,
      hint: 'Connecting teams; its faint shades draw the dot grid and the links',
    },
  },
  fonts: { body: FONT },
  copy: {
    headline: { label: 'Headline', value: 'Connecting\nteams' },
    highlight: { label: 'Highlighted word', value: 'worldwide' },
  },
} as const satisfies ThemeSpec;

export const connectingTeams = themed(W, H, connectingTeamsSpec, (t) => {
  const say = writer(t.font('body'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    dots(60, 70, 18, 14, 56, t.shade('text', 'rgba(255,255,255,0.09)'), 5),
    path(LINKS, 0, 0, W, H, t.shade('text', MINT.clear), POST_SIZE, {
      name: 'Links',
      stroke: t.shade('text', 'rgba(255,255,255,0.4)'),
      strokeWidth: 3,
    }),
    PINS.map(([x, y]) => [
      circle(x, y, 40, t.color('surface'), {
        name: 'Pin',
        ...shadow(24, 0, t.shade('primary', 'rgba(16,185,129,0.6)')),
      }),
      circle(x, y, 28, t.color('primary'), { name: 'Pin core' }),
      icon('user', x - 15, y - 15, 30, t.color('surface'), { strokeWidth: 2.5 }),
    ]),
    say(t.copy('headline'), 80, 840, 900, 88, t.color('text'), 600),
    say(t.copy('highlight'), 80, 1042, 900, 88, t.color('primary'), 800),
    avatar('woman-portrait-6', 124, 1226, 44, t.color('surface')),
    avatar('man-portrait-1', 194, 1226, 44, t.color('surface')),
    avatar('woman-portrait-2', 264, 1226, 44, t.color('surface')),
    circle(334, 1226, 46, t.color('surface'), { name: 'More' }),
    icon('plus', 314, 1206, 40, t.shade('background', MINT.ink), { strokeWidth: 3 }),
  ];
});

const ideasResultsSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page and the word on the highlight' },
    primary: {
      value: MINT.green,
      hint: 'Highlight, the arrow, the glow behind the clock and the small star',
    },
    text: {
      value: MINT.white,
      hint: 'Headline, the clock and the big stars; its grey shade colors the prompt and the handle',
    },
  },
  fonts: { body: FONT },
  copy: {
    headline: { label: 'Headline', value: 'Where Ideas' },
    second: { label: 'Second line', value: 'Turn Into' },
    highlight: { label: 'Highlighted word', value: 'Results' },
    prompt: { label: 'Comment prompt', value: 'Comment "GROW" to\nget the free playbook' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const ideasResults = themed(W, H, ideasResultsSpec, (t) => {
  const say = writer(t.font('body'));
  const grey = t.shade('text', MINT.grey);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    say(t.copy('headline'), 80, 140, 900, 78, t.color('text'), 500),
    say(t.copy('second'), 80, 236, 420, 78, t.color('text'), 500),
    rect(470, 234, 330, 98, t.color('primary'), { name: 'Highlight', cornerRadius: 10 }),
    say(t.copy('highlight'), 470, 240, 330, 72, t.shade('background', MINT.ink), 800, 'center'),
    say(t.copy('prompt'), 80, 410, 600, 32, grey, 500),
    path('M 140 520 Q 170 640 330 650', 0, 0, W, H, t.shade('primary', MINT.clear), POST_SIZE, {
      name: 'Arrow curve',
      stroke: t.color('primary'),
      strokeWidth: 6,
    }),
    poly(
      [
        [320, 628],
        [356, 652],
        [318, 672],
      ],
      t.color('primary'),
      { name: 'Arrow head' },
    ),
    circle(
      640,
      820,
      330,
      radial(t.shade('primary', 'rgba(16,185,129,0.4)'), t.shade('primary', MINT.clear)),
      { name: 'Glow' },
    ),
    icon('alarm-clock', 420, 600, 440, t.color('text'), { strokeWidth: 1.4 }),
    star(4, 900, 500, 80, t.color('text'), { innerRatio: 0.3 }),
    star(4, 180, 1040, 64, t.color('text'), { innerRatio: 0.3 }),
    star(4, 940, 1120, 40, t.color('primary'), { innerRatio: 0.3 }),
    brandLine(t.copy('handle'), 1240, grey, t.font('body')),
  ];
});
