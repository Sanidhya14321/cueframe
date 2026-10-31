import {
  arrow,
  circle,
  icon,
  path,
  rect,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY_FONT,
  COBALT,
  clearProcess,
  H,
  HEADING_FONT,
  ourServices,
  type ValuePalette,
  W,
} from './posts';

const PROMISES = [
  'One clear\nplan',
  'Built for\nresults',
  'Live in\n14 days',
  'Only what\nmatters',
  'Top 1%\nquality',
  'No hidden\nfees',
];

const guessworkSpec = (p: ValuePalette) =>
  ({
    colors: {
      background: { value: p.ink, hint: 'Page' },
      primary: {
        value: p.brand,
        hint: 'Guaranteed, the promise boxes, the plus signs and All in One Place',
      },
      text: {
        value: p.paper,
        hint: 'Zero Guesswork, the promise text, the plus circles and the bottom star',
      },
      accent: { value: p.accent, hint: 'Top star' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      title: { label: 'Title', value: 'Zero Guesswork' },
      highlight: { label: 'Highlighted line', value: 'Guaranteed' },
      promises: { label: 'Promise', value: PROMISES },
      closing: { label: 'Closing line', value: 'All in One Place' },
    },
  }) as const satisfies ThemeSpec;

const zeroGuesswork = (p: ValuePalette) =>
  themed(W, H, guessworkSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 0, 130, W, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('highlight'), 0, 240, W, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    star(5, 900, 70, 90, t.color('accent'), { innerRatio: 0.42 }),
    t.list('promises').map((label, index) => {
      const x = 60 + (index % 3) * 330;
      const y = 440 + Math.floor(index / 3) * 340;
      return [
        rect(x, y, 300, 300, t.color('primary'), { cornerRadius: 10, name: 'Promise box' }),
        circle(x + 50, y + 50, 24, t.color('text')),
        icon('plus', x + 34, y + 34, 32, t.color('primary'), { strokeWidth: 3 }),
        text(label, x + 30, y + 160, 250, {
          fontFamily: t.font('body'),
          fontSize: 38,
          fontWeight: 700,
          fill: t.color('text'),
          lineHeight: 1.2,
        }),
      ];
    }),
    text(t.copy('closing'), 0, 1170, W, {
      fontFamily: t.font('heading'),
      fontSize: 44,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
    }),
    star(5, 80, 1200, 80, t.color('text'), { innerRatio: 0.42 }),
  ]);

const benefitsSpec = (p: ValuePalette) =>
  ({
    colors: {
      background: { value: p.ink, hint: 'Page and the 90% and 40% labels' },
      surface: {
        value: p.paper,
        hint: 'Top and right gauges, the arrow, Benefits, the right star and 60%',
      },
      primary: { value: p.brand, hint: 'for You, the top star and the left gauge' },
      text: { value: '#d1d5db', hint: 'Body copy beside and under the title' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      topStat: { label: 'Top gauge stat', value: '90%' },
      intro: { label: 'Intro', value: 'Boost results you\ncan actually measure.' },
      title: { label: 'Title', value: 'Benefits' },
      highlight: { label: 'Highlighted line', value: 'for You' },
      points: {
        label: 'Benefit',
        value: [
          'Save time, cut\ncomplexity, work\nsmarter.',
          'Turn know-how into\nreal business value.',
        ],
      },
      split: { label: 'Gauge split', value: ['60%', '40%'] },
    },
  }) as const satisfies ThemeSpec;

export const benefits = (p: ValuePalette) =>
  themed(W, H, benefitsSpec(p), (t) => {
    const body = (content: string, x: number, y: number) =>
      text(content, x, y, x === 510 ? 520 : 420, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.35,
      });
    const [save = '', turn = ''] = t.list('points');
    const [left = '', right = ''] = t.list('split');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      path(
        'M 270 0 A 270 270 0 0 1 0 270 L 0 150 A 150 150 0 0 0 150 0 Z',
        0,
        0,
        W,
        H,
        t.color('surface'),
        { width: W, height: H },
        { name: 'Top gauge' },
      ),
      text(t.copy('topStat'), 100, 130, 120, {
        fontFamily: t.font('heading'),
        fontSize: 42,
        fontWeight: 800,
        fill: t.color('background'),
        align: 'center',
      }),
      star(5, 250, 40, 70, t.color('primary'), { innerRatio: 0.42 }),
      arrow(330, 190, 150, t.color('surface'), 4),
      body(t.copy('intro'), 510, 150),
      text(t.copy('title'), 80, 420, 900, {
        fontFamily: t.font('heading'),
        fontSize: 100,
        fontWeight: 800,
        fill: t.color('surface'),
      }),
      text(t.copy('highlight'), 80, 540, 900, {
        fontFamily: t.font('heading'),
        fontSize: 100,
        fontWeight: 800,
        fill: t.color('primary'),
      }),
      star(5, 900, 470, 90, t.color('surface'), { innerRatio: 0.42 }),
      body(save, 80, 740),
      body(turn, 600, 760),
      path(
        'M 240 1350 A 300 300 0 0 1 532 1050 L 532 1180 A 170 170 0 0 0 370 1350 Z',
        0,
        0,
        W,
        H,
        t.color('primary'),
        { width: W, height: H },
        { name: 'Gauge left' },
      ),
      path(
        'M 548 1050 A 300 300 0 0 1 840 1350 L 710 1350 A 170 170 0 0 0 548 1180 Z',
        0,
        0,
        W,
        H,
        t.color('surface'),
        { width: W, height: H },
        { name: 'Gauge right' },
      ),
      text(left, 314, 1160, 120, {
        fontFamily: t.font('heading'),
        fontSize: 40,
        fontWeight: 800,
        fill: t.color('surface'),
        align: 'center',
      }),
      text(right, 646, 1160, 120, {
        fontFamily: t.font('heading'),
        fontSize: 40,
        fontWeight: 800,
        fill: t.color('background'),
        align: 'center',
      }),
    ];
  });

const NOTES = [
  { x: 80, y: 400, height: 360 },
  { x: 80, y: 790, height: 400 },
  { x: 560, y: 250, height: 420 },
  { x: 560, y: 700, height: 300 },
  { x: 560, y: 1030, height: 160 },
] as const;

const whySpec = (p: ValuePalette) =>
  ({
    colors: {
      background: { value: p.brand, hint: 'Page and Studio in the logo card' },
      surface: {
        value: p.paper,
        hint: 'Why choose us?, the logo card, the reason cards and the numbers inside the badges',
      },
      text: { value: p.ink, hint: 'Northpeak, the reason text and the round number badges' },
      accent: { value: p.accent, hint: 'Bottom star' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      title: { label: 'Title', value: 'Why choose us?' },
      brand: { label: 'Brand name', value: 'Northpeak' },
      brandSuffix: { label: 'Brand suffix', value: 'Studio' },
      numbers: { label: 'Badge number', value: ['1', '3', '2', '4', '5'] },
      reasons: {
        label: 'Reason',
        value: [
          'We make the road\nfrom idea to launch\nshort and simple.',
          'We focus on what\nmatters: positioning,\nclarity and results.',
          'No endless drafts.\nWe help you go live\nwith confidence.',
          'Clean, modern and\nmade to turn visitors\ninto clients.',
          'Support that\nanswers fast.',
        ],
      },
    },
  }) as const satisfies ThemeSpec;

const whyChooseUs = (p: ValuePalette) =>
  themed(W, H, whySpec(p), (t) => {
    const numbers = t.list('numbers');
    const reasons = t.list('reasons');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 0, 90, W, {
        fontFamily: t.font('heading'),
        fontSize: 80,
        fontWeight: 800,
        fill: t.color('surface'),
        align: 'center',
      }),
      rect(80, 250, 440, 120, t.color('surface'), { cornerRadius: 10, name: 'Logo card' }),
      text(t.copy('brand'), 110, 285, 260, {
        fontFamily: t.font('heading'),
        fontSize: 38,
        fontWeight: 800,
        fill: t.color('text'),
      }),
      text(t.copy('brandSuffix'), 345, 285, 160, {
        fontFamily: t.font('heading'),
        fontSize: 38,
        fontWeight: 800,
        fill: t.color('background'),
      }),
      NOTES.map(({ x, y, height }, index) => [
        rect(x, y, 440, height, t.color('surface'), { cornerRadius: 10, name: 'Reason card' }),
        circle(x + 400, y + 40, 18, t.color('text')),
        text(numbers[index] ?? '', x + 382, y + 27, 36, {
          fontFamily: t.font('body'),
          fontSize: 22,
          fontWeight: 800,
          fill: t.color('surface'),
          align: 'center',
        }),
        text(reasons[index] ?? '', x + 30, y + height - 150, 390, {
          fontFamily: t.font('body'),
          fontSize: 30,
          fontWeight: 600,
          fill: t.color('text'),
          lineHeight: 1.3,
        }),
      ]),
      star(5, 80, 1215, 90, t.color('accent'), { innerRatio: 0.42 }),
    ];
  });

export const POSTS: readonly [Template, Template, Template, Template, Template] = [
  ourServices(COBALT),
  clearProcess(COBALT),
  zeroGuesswork(COBALT),
  benefits(COBALT),
  whyChooseUs(COBALT),
];
