import { linear, NO_FILTERS } from '@/design';
import { icon, photo, rect, shadow, type ThemeSpec, themed } from '../../../kit';
import { BODY_FONT, backdrop, body, glow, HEADING_FONT, HX, head, SH, SW } from './theme';

const GRAY = { filters: { ...NO_FILTERS, grayscale: 1 } };
const FONTS = { heading: HEADING_FONT, body: BODY_FONT } as const;

const coverSpec = {
  colors: {
    background: {
      value: HX.night,
      hint: 'Slide background, the fade at the bottom and the dark tile grid',
    },
    primary: {
      value: HX.teal,
      hint: 'Glow, the app tile and the title; its shades color the tile edge and the title gradient',
    },
    text: {
      value: HX.white,
      hint: 'Subtitle and the sparkles icon; its grey shade colors the tagline',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Cloud Platform' },
    subtitle: { label: 'Subtitle', value: 'Investor Deck' },
    tagline: { label: 'Tagline', value: 'HELIXA  /  SERIES B  /  2027' },
  },
} as const satisfies ThemeSpec;

export const coverSlide = themed(SW, SH, coverSpec, (t) => {
  const teal = (exact: string) => t.shade('primary', exact);
  return [
    backdrop(t.color('background')),
    Array.from({ length: 40 }, (_, index) =>
      rect(
        12 + (index % 8) * 240,
        12 + Math.floor(index / 8) * 216,
        216,
        192,
        t.shade('background', '#0d1215'),
        {
          name: 'Tile',
          cornerRadius: 32,
          stroke: t.shade('background', '#182024'),
          strokeWidth: 2,
        },
      ),
    ),
    glow(960, 380, 370, 0.5, teal),
    rect(
      0,
      640,
      SW,
      440,
      linear(180, t.shade('background', 'rgba(7,9,11,0)'), t.color('background')),
      { name: 'Fade' },
    ),
    rect(860, 230, 200, 200, linear(135, t.color('primary'), teal(HX.deep)), {
      name: 'App tile',
      cornerRadius: 48,
      ...shadow(80, 0, teal('rgba(25,227,196,0.7)')),
    }),
    icon('sparkles', 910, 280, 100, t.color('text'), { strokeWidth: 2 }),
    head(t.font('heading'))(
      t.copy('title'),
      0,
      540,
      SW,
      120,
      linear(90, t.color('primary'), teal('#7ff5e2')),
      { align: 'center', fontWeight: 800 },
    ),
    head(t.font('heading'))(t.copy('subtitle'), 0, 680, SW, 120, t.color('text'), {
      align: 'center',
      fontWeight: 800,
    }),
    body(t.font('body'))(t.copy('tagline'), 0, 880, SW, 28, t.shade('text', HX.muted), {
      align: 'center',
      letterSpacing: 6,
    }),
  ];
});

const contentsSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: { value: HX.teal, hint: 'Glow behind the title' },
    text: {
      value: HX.white,
      hint: 'Contents title and the chapter numbers; its grey shades color the number fade, intro and chapter names',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Contents' },
    intro: { label: 'Intro', value: 'Nine short chapters,\none clear story.' },
    numbers: {
      label: 'Chapter number',
      value: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
    },
    chapters: {
      label: 'Chapter',
      value: [
        'Intro',
        'Team',
        'Platform',
        'Metrics',
        'Finance',
        'Insights',
        'Pricing',
        'Roadmap',
        'Close',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const contentsSlide = themed(SW, SH, contentsSpec, (t) => {
  const numbers = t.list('numbers');
  return [
    backdrop(t.color('background')),
    glow(420, 700, 370, 0.4, (exact) => t.shade('primary', exact)),
    head(t.font('heading'))(t.copy('title'), 140, 140, 640, 96, t.color('text')),
    body(t.font('body'))(t.copy('intro'), 140, 270, 600, 32, t.shade('text', HX.muted)),
    t.list('chapters').map((label, index) => {
      const x = 860 + (index % 3) * 330;
      const y = 120 + Math.floor(index / 3) * 300;
      return [
        head(t.font('heading'))(
          numbers[index] ?? '',
          x,
          y,
          300,
          150,
          linear(180, t.color('text'), t.shade('text', '#55636a')),
          { fontWeight: 800 },
        ),
        body(t.font('body'))(label, x + 6, y + 172, 300, 30, t.shade('text', HX.muted)),
      ];
    }),
  ];
});

const empoweringSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: {
      value: HX.teal,
      hint: 'Glow and the round halo behind the portrait; its deeper shade ends the halo gradient',
    },
    text: {
      value: HX.white,
      hint: 'Headline and the closing line; its grey shade colors the body text',
    },
  },
  fonts: FONTS,
  copy: {
    headline: { label: 'Headline', value: 'Technology\nthat empowers' },
    body: {
      label: 'Body',
      value:
        'Helixa gives modern teams one product-led\nplatform that turns scattered tools into\na single, reliable operating layer.',
    },
    closing: {
      label: 'Closing line',
      value: 'Onboarding takes days, not months, and every team gets value from the first login.',
    },
  },
} as const satisfies ThemeSpec;

export const empoweringSlide = themed(SW, SH, empoweringSpec, (t) => [
  backdrop(t.color('background')),
  glow(560, 540, 530, 0.5, (exact) => t.shade('primary', exact)),
  rect(160, 140, 800, 800, linear(160, t.color('primary'), t.shade('primary', HX.deep)), {
    name: 'Halo',
    cornerRadius: 400,
  }),
  photo('man-portrait-2', 230, 210, 660, 660, { cornerRadius: 330, ...GRAY }),
  head(t.font('heading'))(t.copy('headline'), 1100, 220, 760, 90, t.color('text')),
  body(t.font('body'))(t.copy('body'), 1100, 460, 680, 32, t.shade('text', HX.muted)),
  body(t.font('body'))(t.copy('closing'), 1100, 720, 680, 32, t.color('text')),
]);

const adoptionSpec = {
  colors: {
    background: {
      value: HX.night,
      hint: 'Slide background and the numbers and labels on the stat cards',
    },
    surface: { value: HX.white, hint: 'First stat card' },
    primary: {
      value: HX.teal,
      hint: 'Glow, the second stat card and the first row of people icons',
    },
    text: {
      value: HX.white,
      hint: 'Headline and the middle rows of people icons; its grey shades color the second line and the faded last row',
    },
  },
  fonts: FONTS,
  copy: {
    headline: { label: 'Headline', value: 'Three in four' },
    subhead: { label: 'Second line', value: 'teams automate\ntheir reporting' },
    stats: { label: 'Stat', value: ['56.2K', '91.4K'] },
    labels: { label: 'Stat label', value: ['Hours reclaimed', 'Reports automated'] },
  },
} as const satisfies ThemeSpec;

export const adoptionSlide = themed(SW, SH, adoptionSpec, (t) => {
  const [first = '', second = ''] = t.list('stats');
  const [firstLabel = '', secondLabel = ''] = t.list('labels');
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  return [
    backdrop(t.color('background')),
    glow(1400, 540, 520, 0.32, (exact) => t.shade('primary', exact)),
    heading(t.copy('headline'), 140, 150, 900, 96, t.color('text')),
    heading(t.copy('subhead'), 140, 254, 900, 96, t.shade('text', HX.muted)),
    rect(140, 640, 340, 200, t.color('surface'), { name: 'Stat card', cornerRadius: 24 }),
    heading(first, 172, 672, 280, 72, t.color('background')),
    copy(firstLabel, 172, 774, 280, 26, t.shade('background', '#4b5559')),
    rect(510, 640, 340, 200, linear(135, t.color('primary'), t.shade('primary', HX.deep)), {
      name: 'Stat card',
      cornerRadius: 24,
    }),
    heading(second, 542, 672, 280, 72, t.color('background')),
    copy(secondLabel, 542, 774, 280, 26, t.color('background')),
    Array.from({ length: 24 }, (_, index) => {
      const row = Math.floor(index / 6);
      const color =
        row === 0
          ? t.color('primary')
          : row < 3
            ? t.color('text')
            : t.shade('text', 'rgba(255,255,255,0.22)');
      return icon('user', 1100 + (index % 6) * 120, 200 + row * 180, 100, color, {
        strokeWidth: 2.2,
      });
    }),
  ];
});

const potentialSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: { value: HX.teal, hint: 'Glow behind the headline' },
    text: {
      value: HX.white,
      hint: 'Headline and the closing line; its grey shade colors the body text',
    },
  },
  fonts: FONTS,
  copy: {
    headline: { label: 'Headline', value: 'Unlock full\npotential' },
    body: {
      label: 'Body',
      value:
        'Bring growth, security and operations into one view, so teams stop chasing data and start shipping outcomes.',
    },
    closing: {
      label: 'Closing line',
      value: 'Fewer handoffs, faster answers and a calmer\nroadmap for everyone involved.',
    },
  },
} as const satisfies ThemeSpec;

export const potentialSlide = themed(SW, SH, potentialSpec, (t) => [
  backdrop(t.color('background')),
  glow(420, 700, 370, 0.38, (exact) => t.shade('primary', exact)),
  head(t.font('heading'))(t.copy('headline'), 140, 170, 800, 96, t.color('text')),
  body(t.font('body'))(t.copy('body'), 140, 420, 740, 32, t.shade('text', HX.muted)),
  body(t.font('body'))(t.copy('closing'), 140, 700, 740, 32, t.color('text')),
  photo('meeting-1', 1000, 140, 780, 800, { cornerRadius: 28, ...GRAY }),
]);

const PHOTOS = [
  'woman-portrait-1',
  'man-portrait-1',
  'man-portrait-2',
  'woman-portrait-5',
] as const;

const teamSpec = {
  colors: {
    background: { value: HX.night, hint: 'Slide background' },
    primary: {
      value: HX.teal,
      hint: 'Glow and the frames behind the portraits; its deeper shade ends the frame gradient',
    },
    text: {
      value: HX.white,
      hint: 'Title and names; its grey shade colors the intro and the roles',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Meet the Team' },
    intro: {
      label: 'Intro',
      value: 'The engineers who turn complex data into quiet, dependable systems.',
    },
    names: { label: 'Name', value: ['Lena Varga', 'Omar Haddad', 'Felix Brandt', 'Nadia Pires'] },
    roles: {
      label: 'Role',
      value: ['Program Lead', 'Systems Architect', 'Head of Platform', 'Security Engineer'],
    },
  },
} as const satisfies ThemeSpec;

export const teamSlide = themed(SW, SH, teamSpec, (t) => {
  const roles = t.list('roles');
  return [
    backdrop(t.color('background')),
    glow(960, 380, 370, 0.4, (exact) => t.shade('primary', exact)),
    head(t.font('heading'))(t.copy('title'), 0, 110, SW, 88, t.color('text'), { align: 'center' }),
    body(t.font('body'))(t.copy('intro'), 0, 230, SW, 30, t.shade('text', HX.muted), {
      align: 'center',
    }),
    t.list('names').map((name, index) => {
      const x = 180 + index * 400;
      return [
        rect(x, 360, 360, 480, linear(180, t.color('primary'), t.shade('primary', HX.deep)), {
          name: 'Card',
          cornerRadius: 28,
        }),
        photo(PHOTOS[index] ?? 'man-portrait-1', x + 16, 376, 328, 448, { cornerRadius: 20 }),
        head(t.font('heading'))(name, x, 872, 360, 32, t.color('text'), { align: 'center' }),
        body(t.font('body'))(roles[index] ?? '', x, 922, 360, 24, t.shade('text', HX.muted), {
          align: 'center',
        }),
      ];
    }),
  ];
});
