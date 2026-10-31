import { linear } from '@/design';
import { avatar, circle, icon, rect, rotateNodes, type ThemeSpec, themed } from '../../../kit';
import {
  BODY,
  backdrop,
  CV,
  fontsOf,
  glow,
  HEADING,
  halfRing,
  headingOf,
  SH,
  SW,
  wash,
} from './theme';

const orbitPoint = (radius: number, degrees: number) => ({
  x: 960 + radius * Math.cos((degrees * Math.PI) / 180),
  y: 1080 - radius * Math.sin((degrees * Math.PI) / 180),
});

const coverSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient and the plus signs; its lighter shade is the gradient end',
    },
    primary: {
      value: CV.rose,
      hint: 'Investor Deck, the glow, orbit rings, plus dots, photo rings and the half sun, in lighter and darker shades',
    },
    text: { value: CV.white, hint: 'Company name' },
  },
  fonts: { heading: HEADING },
  copy: {
    title: { label: 'Company name', value: 'Corvane Cloud' },
    subtitle: { label: 'Subtitle', value: 'Investor Deck' },
  },
} as const satisfies ThemeSpec;

export const coverSlide = themed(SW, SH, coverSpec, (t) => {
  const head = headingOf(t.font('heading'));
  const tint = (exact: string) => t.shade('primary', exact);
  const plusNode = (radius: number, degrees: number) => {
    const { x, y } = orbitPoint(radius, degrees);
    return [
      circle(x, y, 22, t.color('primary')),
      icon('plus', x - 14, y - 14, 28, t.color('background'), { strokeWidth: 3 }),
    ];
  };
  const orbitAvatar = (name: 'woman-portrait-1' | 'man-portrait-1', degrees: number) => {
    const { x, y } = orbitPoint(470, degrees);
    return avatar(name, x, y, 50, tint(CV.blush));
  };
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    wash(0, tint, 0.24),
    halfRing(960, 1080, 640, 636, tint('rgba(255,214,223,0.35)')),
    halfRing(960, 1080, 472, 468, tint('rgba(255,214,223,0.45)')),
    halfRing(960, 1080, 300, 0.01, linear(180, tint('#f6b3c3'), tint(CV.berry))),
    plusNode(636, 112),
    plusNode(636, 64),
    orbitAvatar('woman-portrait-1', 140),
    orbitAvatar('man-portrait-1', 38),
    head(t.copy('title'), 0, 150, SW, 128, t.color('text'), { align: 'center' }),
    head(t.copy('subtitle'), 0, 290, SW, 128, t.color('primary'), { align: 'center' }),
  ];
});

const CHAPTERS = [
  'Overview',
  'Our team',
  'Platform',
  'Pricing',
  'Key metrics',
  'Financials',
  'Roadmap',
  'Next steps',
];

const contentsSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient; its lighter shade is the gradient end',
    },
    primary: {
      value: CV.rose,
      hint: 'First chapter number and the corner glow; its faint shade draws the column dividers',
    },
    text: { value: CV.white, hint: 'Title and the other chapter numbers' },
    secondary: { value: CV.muted, hint: 'Subtitle and chapter names' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Table of Contents' },
    subtitle: { label: 'Subtitle', value: 'Eight short chapters, from vision to next steps.' },
    numbers: {
      label: 'Chapter number',
      value: CHAPTERS.map((_, index) => String(index + 1).padStart(2, '0')),
    },
    chapters: { label: 'Chapter', value: CHAPTERS },
  },
} as const satisfies ThemeSpec;

export const contentsSlide = themed(SW, SH, contentsSpec, (t) => {
  const { head, body } = fontsOf(t);
  const chapters = t.list('chapters');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    wash(225, (exact) => t.shade('primary', exact), 0.16),
    head(t.copy('title'), 140, 130, 1200, 72, t.color('text')),
    body(t.copy('subtitle'), 140, 230, 1000, 32, t.color('secondary')),
    [1, 2, 3].map((column) =>
      rect(220 + column * 400 - 40, 400, 2, 520, t.shade('primary', CV.edge), { name: 'Divider' }),
    ),
    t.list('numbers').map((number, index) => {
      const x = 220 + (index % 4) * 400;
      const y = 400 + Math.floor(index / 4) * 280;
      return [
        head(number, x, y, 320, 120, index === 0 ? t.color('primary') : t.color('text')),
        body(chapters[index] ?? '', x, y + 150, 320, 32, t.color('secondary')),
      ];
    }),
  ];
});

const CHIPS = ['radio-tower', 'workflow', 'layers', 'rocket', 'database', 'send'] as const;

const welcomeSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient and the center plus sign; its lighter shades are the gradient end and the icon chips',
    },
    primary: {
      value: CV.rose,
      hint: 'Center glow, rings, the center button and the chip icons, in lighter shades',
    },
    text: { value: CV.white, hint: 'Title' },
    secondary: { value: CV.muted, hint: 'Intro paragraph' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Welcome to Corvane' },
    body: {
      label: 'Intro',
      value:
        'We turn scattered tools into one calm, connected platform, so enterprise teams spend\nless time stitching data together and more time shipping work that matters.',
    },
  },
} as const satisfies ThemeSpec;

export const welcomeSlide = themed(SW, SH, welcomeSpec, (t) => {
  const { head, body } = fontsOf(t);
  const tint = (exact: string) => t.shade('primary', exact);
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    head(t.copy('title'), 0, 110, SW, 76, t.color('text'), { align: 'center' }),
    body(t.copy('body'), 160, 220, 1600, 32, t.color('secondary'), { align: 'center' }),
    glow(960, 700, 360, tint, 0.35),
    [320, 240, 160].map((radius, index) =>
      circle(960, 700, radius, tint(`rgba(241,155,176,${0.05 + index * 0.04})`), {
        stroke: tint(CV.edge),
        strokeWidth: 2,
      }),
    ),
    circle(960, 700, 84, linear(160, tint(CV.blush), t.color('primary'))),
    icon('plus', 920, 660, 80, t.color('background'), { strokeWidth: 2.4 }),
    CHIPS.map((name, index) => {
      const slot = index < 3 ? index - 3 : index - 2;
      const cx = 960 + slot * 190;
      return [
        circle(cx, 700, 50, t.shade('background', '#3d1424'), {
          stroke: tint(CV.edge),
          strokeWidth: 2,
        }),
        icon(name, cx - 22, 678, 44, tint(CV.blush), { strokeWidth: 2 }),
      ];
    }),
  ];
});

const PILLARS = [
  {
    icon: 'server',
    title: 'Infrastructure',
    text: 'Scalable clusters with managed upgrades built in.',
    light: true,
    tilt: -8,
  },
  {
    icon: 'workflow',
    title: 'Automation',
    text: 'Cut hand-offs by 45% with event-driven workflows.',
    light: false,
    tilt: 0,
  },
  {
    icon: 'shield-check',
    title: 'Security',
    text: 'Continuous monitoring with audit trails built in.',
    light: true,
    tilt: 7,
  },
] as const;

const empoweringSpec = {
  colors: {
    background: {
      value: CV.wine,
      hint: 'Slide gradient, the middle card and the icon on its tile; its dark shades color the text on the light cards',
    },
    surface: {
      value: CV.white,
      hint: 'Light cards and their tile icons; its pink shade is the bottom of the card gradient',
    },
    primary: {
      value: CV.rose,
      hint: 'Corner glow, the middle card tile and edge; its deep shade colors the light card tiles',
    },
    text: { value: CV.white, hint: 'Title and the middle card text' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Empowering Businesses\nThrough Digital Change' },
    pillars: { label: 'Pillar title', value: PILLARS.map((pillar) => pillar.title) },
    texts: { label: 'Pillar text', value: PILLARS.map((pillar) => pillar.text) },
  },
} as const satisfies ThemeSpec;

export const empoweringSlide = themed(SW, SH, empoweringSpec, (t) => {
  const { head, body } = fontsOf(t);
  const titles = t.list('pillars');
  const texts = t.list('texts');
  return [
    backdrop(t.color('background'), t.shade('background', CV.plum)),
    wash(0, (exact) => t.shade('primary', exact), 0.18),
    head(t.copy('title'), 0, 110, SW, 68, t.color('text'), {
      align: 'center',
      lineHeight: 1.15,
    }),
    PILLARS.map((pillar, index) => {
      const x = 330 + index * 440;
      const y = index === 1 ? 470 : 530;
      const ink = pillar.light ? t.shade('background', CV.ink) : t.color('text');
      return rotateNodes(pillar.tilt, x + 220, y + 220, [
        rect(
          x,
          y,
          440,
          440,
          pillar.light
            ? linear(160, t.color('surface'), t.shade('surface', CV.blush))
            : linear(160, t.shade('background', '#4a1528'), t.shade('background', CV.ink)),
          {
            name: 'Pillar card',
            cornerRadius: 32,
            stroke: t.shade('primary', CV.edge),
            strokeWidth: pillar.light ? 0 : 2,
          },
        ),
        rect(
          x + 40,
          y + 40,
          84,
          84,
          pillar.light ? t.shade('primary', CV.berry) : t.color('primary'),
          {
            name: 'Icon tile',
            cornerRadius: 22,
          },
        ),
        icon(
          pillar.icon,
          x + 60,
          y + 60,
          44,
          pillar.light ? t.color('surface') : t.color('background'),
          {
            strokeWidth: 2,
          },
        ),
        head(titles[index] ?? '', x + 40, y + 170, 360, 42, ink),
        body(texts[index] ?? '', x + 40, y + 240, 360, 28, ink, { opacity: 0.85 }),
      ]);
    }),
  ];
});
