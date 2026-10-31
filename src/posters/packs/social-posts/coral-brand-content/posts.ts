import {
  icon,
  path,
  pill,
  poly,
  rect,
  rotateNodes,
  SQUARE_SIZE,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface CoralPalette {
  primary: string;
  ink: string;
  paper: string;
  accent: string;
}

export const CORAL: CoralPalette = {
  primary: '#ff5a36',
  ink: '#141016',
  paper: '#ffffff',
  accent: '#ffd9a0',
};

export const TEAL: CoralPalette = {
  primary: '#ffd9a0',
  ink: '#ffffff',
  paper: '#0f9d8a',
  accent: '#0b3d36',
};

export const HEADING = { label: 'Heading font', value: 'Lexend' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const DISPLAY = { label: 'Display font', value: 'Anton' } as const;
export const SITE = { label: 'Website', value: 'halcyon.studio' } as const;
export const S = SQUARE_SIZE.width;

export const bold = (
  content: string,
  x: number,
  y: number,
  size: number,
  fill: string,
  fontFamily: string,
  align: 'left' | 'center' | 'right' = 'left',
  width = S - x - 60,
) =>
  text(content, x, y, width, {
    fontFamily,
    fontSize: size,
    fontWeight: 800,
    fill,
    align,
    lineHeight: 1.08,
  });

export const site = (label: string, x: number, y: number, fill: string, fontFamily: string) =>
  text(label, x, y, 400, { fontFamily, fontSize: 26, fontWeight: 600, fill });

const STANDOUT_FIGURE = 3;

const standOutSpec = {
  colors: {
    background: { value: CORAL.primary, hint: 'Page' },
    secondary: { value: CORAL.ink, hint: 'Box behind Learn smarter. and the standout figure' },
    text: {
      value: CORAL.paper,
      hint: 'Website, Stand Out., the Learn smarter. text, the other figures, the baseline and the tagline',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE,
    title: { label: 'Title', value: 'Stand Out.' },
    label: { label: 'Label', value: 'Learn smarter.' },
    tagline: { label: 'Tagline', value: 'Clarity through intelligence' },
  },
} as const satisfies ThemeSpec;

export const standOut = themed(S, S, standOutSpec, (t) => [
  rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
  site(t.copy('site'), 680, 80, t.color('text'), t.font('body')),
  bold(t.copy('title'), 80, 130, 96, t.color('text'), t.font('heading')),
  rotateNodes(-4, 80, 270, [
    rect(80, 260, 420, 86, t.color('secondary'), { cornerRadius: 12, name: 'Label' }),
    text(t.copy('label'), 80, 276, 420, {
      fontFamily: t.font('heading'),
      fontSize: 44,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
  ]),
  Array.from({ length: 7 }, (_, index) =>
    icon(
      'user-round',
      70 + index * 135,
      520,
      130,
      index === STANDOUT_FIGURE ? t.color('secondary') : t.color('text'),
      { strokeWidth: 2.4 },
    ),
  ),
  rect(60, 690, 960, 6, t.color('text'), { cornerRadius: 3, name: 'Baseline' }),
  text(t.copy('tagline'), 80, 900, 900, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.color('text'),
  }),
]);

const luxurySpec = {
  colors: {
    background: { value: CORAL.ink, hint: 'Page and the pill label' },
    primary: { value: CORAL.primary, hint: 'Highlights behind Marketing and essential.' },
    text: { value: CORAL.paper, hint: 'Headline lines and the Read the comments pill' },
  },
  fonts: { heading: HEADING },
  copy: {
    lines: {
      label: 'Headline line',
      value: ['Marketing', "isn't a luxury.", "It's a business", 'essential.'],
    },
    cta: { label: 'Pill', value: 'Read the comments' },
  },
} as const satisfies ThemeSpec;

export const luxury = themed(S, S, luxurySpec, (t) => {
  const [first = '', second = '', third = '', last = ''] = t.list('lines');
  const highlight = (content: string, x: number, y: number, width: number) => [
    rect(x - 20, y - 8, width, 110, t.color('primary'), { cornerRadius: 14, name: 'Highlight' }),
    bold(content, x, y, 84, t.color('text'), t.font('heading')),
  ];
  return [
    rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
    highlight(first, 150, 230, 500),
    bold(second, 150, 360, 84, t.color('text'), t.font('heading')),
    bold(third, 150, 470, 84, t.color('text'), t.font('heading')),
    highlight(last, 150, 590, 480),
    pill(t.copy('cta'), 150, 780, {
      fill: t.color('text'),
      color: t.color('background'),
      fontSize: 30,
      fontFamily: t.font('heading'),
    }),
  ];
});

const FOLDER_SHADES = ['#2b2730', '#38323e', '#463f4d', '#544c5c'];

const growSpec = {
  colors: {
    background: { value: CORAL.ink, hint: 'Page and GROW YOUR BRAND.' },
    primary: { value: CORAL.primary, hint: 'Header band' },
    surface: {
      value: FOLDER_SHADES[0] ?? '#2b2730',
      hint: 'Folders; its lighter shades color the lower folders',
    },
    text: { value: CORAL.paper, hint: 'THIS IS HOW WE and the folder labels' },
  },
  fonts: { heading: HEADING },
  copy: {
    title: { label: 'Title', value: 'THIS IS HOW WE' },
    subtitle: { label: 'Second title line', value: 'GROW YOUR BRAND.' },
    services: {
      label: 'Service',
      value: ['Search ads', 'Web design', 'Social media', 'Video editing'],
    },
  },
} as const satisfies ThemeSpec;

export const howWeGrow = themed(S, S, growSpec, (t) => [
  rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
  rect(0, 0, S, 420, t.color('primary'), { name: 'Header' }),
  bold(t.copy('title'), 80, 110, 72, t.color('text'), t.font('heading')),
  bold(t.copy('subtitle'), 80, 195, 72, t.color('background'), t.font('heading')),
  t.list('services').map((label, index) => {
    const y = 360 + index * 160;
    const fill = t.shade('surface', FOLDER_SHADES[index] ?? '#2b2730');
    return [
      rect(100 + index * 210, y, 260, 60, fill, { cornerRadius: 14, name: 'Folder tab' }),
      rect(80, y + 36, 920, 170, fill, { cornerRadius: 18, name: 'Folder' }),
      text(label, index % 2 === 0 ? 130 : 560, y + 80, 380, {
        fontFamily: t.font('heading'),
        fontSize: 38,
        fontWeight: 700,
        fill: t.color('text'),
        align: index % 2 === 0 ? 'left' : 'right',
      }),
    ];
  }),
]);

const bridgeSpec = {
  colors: {
    background: { value: CORAL.paper, hint: 'Page and the word Bridge.' },
    primary: { value: CORAL.primary, hint: 'Highlight behind Bridge. and the three walkers' },
    text: { value: CORAL.ink, hint: 'Every other line, the pencil, the cliffs and the bridge' },
  },
  fonts: { heading: HEADING },
  copy: {
    yours: { label: 'Your line', value: 'You focus on' },
    yourPart: { label: 'Your part', value: 'Walking.' },
    ours: { label: 'Our line', value: 'We focus on' },
    joiner: { label: 'Joining word', value: 'the' },
    ourPart: { label: 'Our part', value: 'Bridge.' },
  },
} as const satisfies ThemeSpec;

export const focusBridge = themed(S, S, bridgeSpec, (t) => [
  rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
  text(t.copy('yours'), 80, 110, 600, {
    fontFamily: t.font('heading'),
    fontSize: 52,
    fontWeight: 400,
    fill: t.color('text'),
  }),
  bold(t.copy('yourPart'), 80, 175, 64, t.color('text'), t.font('heading')),
  text(t.copy('ours'), 80, 290, 600, {
    fontFamily: t.font('heading'),
    fontSize: 52,
    fontWeight: 400,
    fill: t.color('text'),
  }),
  text(t.copy('joiner'), 80, 358, 200, {
    fontFamily: t.font('heading'),
    fontSize: 60,
    fontWeight: 400,
    fill: t.color('text'),
  }),
  rect(192, 350, 290, 88, t.color('primary'), { cornerRadius: 14, name: 'Highlight' }),
  bold(t.copy('ourPart'), 210, 358, 64, t.color('background'), t.font('heading')),
  icon('pencil', 600, 360, 400, t.color('text'), { strokeWidth: 1.4 }),
  poly(
    [
      [0, S],
      [0, 780],
      [230, 780],
      [270, S],
    ],
    t.color('text'),
    { name: 'Left cliff' },
  ),
  poly(
    [
      [S, S],
      [S, 780],
      [860, 780],
      [820, S],
    ],
    t.color('text'),
    { name: 'Right cliff' },
  ),
  rect(230, 776, 400, 8, t.color('text'), { name: 'Bridge' }),
  [40, 100, 160].map((x) =>
    icon('user-round', x, 710, 60, t.color('primary'), { strokeWidth: 2.6 }),
  ),
]);

const servicesSpec = {
  colors: {
    background: { value: CORAL.primary, hint: 'Page' },
    primary: {
      value: CORAL.ink,
      hint: 'Subtitle, the bridge drawing and the comment pill label',
    },
    text: {
      value: CORAL.paper,
      hint: 'OUR SERVICES, the comment pill and the bottom line',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'OUR SERVICES' },
    subtitle: { label: 'Subtitle', value: 'We bridge the gap between brand and buyer' },
    cta: { label: 'Pill', value: 'Comment "STUDIO"' },
    footer: { label: 'Footer', value: 'Your Business x Your Customers' },
  },
} as const satisfies ThemeSpec;

export const ourServices = themed(S, S, servicesSpec, (t) => {
  const ink = t.color('primary');
  const cable = (data: string, x: number, y: number, width: number, height: number) =>
    path(
      data,
      x,
      y,
      width,
      height,
      t.shade('primary', 'rgba(0,0,0,0)'),
      { width, height },
      { stroke: ink, strokeWidth: 6, name: 'Cable' },
    );
  return [
    rect(0, 0, S, S, t.color('background'), { name: 'Background' }),
    bold(t.copy('title'), 0, 120, 92, t.color('text'), t.font('heading'), 'center', S),
    text(t.copy('subtitle'), 0, 245, S, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: ink,
      align: 'center',
    }),
    rect(300, 470, 24, 300, ink, { cornerRadius: 6, name: 'Tower' }),
    rect(756, 470, 24, 300, ink, { cornerRadius: 6, name: 'Tower' }),
    rect(60, 740, 960, 16, ink, { cornerRadius: 4, name: 'Deck' }),
    cable('M0 0 Q228 420 456 0', 312, 480, 456, 210),
    cable('M0 260 Q150 200 252 0', 60, 480, 252, 260),
    cable('M0 0 Q102 200 252 260', 768, 480, 252, 260),
    [380, 450, 540, 630, 700].map((x) =>
      rect(x, x === 540 ? 690 : 640, 4, x === 540 ? 50 : 100, ink, { name: 'Hanger' }),
    ),
    pill(t.copy('cta'), 355, 830, {
      fill: t.color('text'),
      color: ink,
      fontSize: 32,
      fontFamily: t.font('heading'),
      fontWeight: 700,
      width: 370,
    }),
    text(t.copy('footer'), 0, 970, S, {
      fontFamily: t.font('heading'),
      fontSize: 34,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
});
