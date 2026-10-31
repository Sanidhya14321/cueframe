import { linear } from '@/design';
import {
  avatar,
  group,
  icon,
  type Nodes,
  POST_SIZE,
  photo,
  pill,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const NV = {
  teal: '#0f5560',
  deep: '#0a3840',
  coral: '#ff7a5c',
  coralSoft: '#ffd6c9',
  cream: '#fff6ef',
  mist: '#e6f1f0',
  ink: '#16323a',
  white: '#ffffff',
};

export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const BRAND = { label: 'Brand name', value: 'NORTHVALE\nCAPITAL' } as const;
export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

type TextStyle = Parameters<typeof text>[4];

export const head =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    weight = 700,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      lineHeight: 1.15,
      ...style,
    });

export const copy =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: 400,
      fill,
      lineHeight: 1.4,
      ...style,
    });

export const logo = (
  cx: number,
  y: number,
  color: string,
  label: string,
  fontFamily: string,
): Nodes[] => {
  const left = cx - 100;
  return group(
    [18, 30, 42].map((height, index) =>
      rect(left + index * 16, y + 46 - height, 11, height, color, {
        cornerRadius: 3,
        name: 'Logo bar',
      }),
    ),
    head(fontFamily)(label, left + 58, y, 160, 22, color, 800, {
      lineHeight: 1.05,
      letterSpacing: 1.5,
    }),
  );
};

export const button = (
  label: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  fontFamily: string,
) => pill(label, x, y, { fill, color, fontSize: 26, fontFamily, fontWeight: 700 });

const chip = (
  name: Parameters<typeof icon>[0],
  x: number,
  y: number,
  fill: string,
  color: string,
) =>
  group(
    rect(x, y, 112, 112, fill, {
      cornerRadius: 30,
      name: 'Icon chip',
      ...shadow(30, 12, 'rgba(0,0,0,0.25)'),
    }),
    icon(name, x + 30, y + 30, 52, color, { strokeWidth: 2.2 }),
  );

const choiceSpec = {
  colors: {
    background: {
      value: NV.teal,
      hint: 'Page gradient and the icons in the white chips',
    },
    primary: { value: NV.coral, hint: 'Banking for You headline and the block behind the photo' },
    surface: { value: NV.white, hint: 'Icon chips around the photo' },
    text: {
      value: NV.white,
      hint: 'Logo and Choose the right; its tint colors the tagline at the bottom',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    intro: { label: 'Intro', value: 'Choose the right' },
    headline: { label: 'Headline', value: 'Banking for You' },
    tagline: { label: 'Tagline', value: 'Accounts that grow with every stage of life' },
  },
} as const satisfies ThemeSpec;

export const bankingChoice = themed(W, H, choiceSpec, (t) => {
  const heading = head(t.font('heading'));
  const chipOf = (name: Parameters<typeof icon>[0], x: number, y: number) =>
    chip(name, x, y, t.color('surface'), t.color('background'));
  return [
    rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', NV.deep)), {
      name: 'Background',
    }),
    logo(540, 80, t.color('text'), t.copy('brand'), t.font('heading')),
    heading(t.copy('intro'), 0, 200, W, 62, t.color('text'), 500, { align: 'center' }),
    heading(t.copy('headline'), 0, 280, W, 88, t.color('primary'), 800, { align: 'center' }),
    rect(310, 500, 520, 700, t.color('primary'), { cornerRadius: 44, name: 'Accent block' }),
    photo('man-portrait-1', 270, 460, 520, 700, { cornerRadius: 44 }),
    chipOf('house', 190, 560),
    chipOf('car', 760, 520),
    chipOf('chart-line', 790, 900),
    chipOf('piggy-bank', 180, 980),
    copy(t.font('body'))(t.copy('tagline'), 0, 1240, W, 30, t.shade('text', NV.mist), {
      align: 'center',
    }),
  ];
});

const loansSpec = {
  colors: {
    background: { value: NV.cream, hint: 'Page; its white tint colors the button label' },
    primary: {
      value: NV.teal,
      hint: 'We provide, faster loans, the teal column blocks, the Apply button and the logo',
    },
    accent: {
      value: NV.coral,
      hint: 'The big 5x and the coral column blocks; its soft tint colors the small block under the photo',
    },
    text: { value: NV.ink, hint: 'Body copy' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'We provide' },
    stat: { label: 'Big number', value: '5x' },
    headline: { label: 'Headline', value: 'faster loans' },
    body: { label: 'Body', value: 'Approval in hours, not weeks.\nNo paperwork piles.' },
    cta: { label: 'Button', value: 'Apply Today' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const fasterLoans = themed(W, H, loansSpec, (t) => {
  const heading = head(t.font('heading'));
  const block = (x: number, y: number, width: number, height: number, fill: string) =>
    rect(x, y, width, height, fill, { cornerRadius: 28, name: 'Column block' });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    block(700, 0, 160, 230, t.color('primary')),
    block(700, 1110, 160, 240, t.color('accent')),
    block(880, 0, 160, 360, t.color('accent')),
    block(880, 960, 160, 390, t.color('primary')),
    photo('man-portrait-3', 640, 270, 400, 660, { cornerRadius: 36 }),
    block(640, 950, 200, 140, t.shade('accent', NV.coralSoft)),
    heading(t.copy('intro'), 80, 360, 540, 54, t.color('primary'), 600),
    heading(t.copy('stat'), 66, 420, 560, 330, t.color('accent'), 800, { lineHeight: 1 }),
    heading(t.copy('headline'), 80, 770, 540, 62, t.color('primary'), 700),
    copy(t.font('body'))(t.copy('body'), 80, 860, 520, 30, t.color('text')),
    button(
      t.copy('cta'),
      80,
      990,
      t.color('primary'),
      t.shade('background', NV.white),
      t.font('body'),
    ),
    logo(180, 1210, t.color('primary'), t.copy('brand'), t.font('heading')),
  ];
});

const LINES: readonly [number, number, number, number][] = [
  [80, 200, 900, 4],
  [300, 200, 4, 460],
  [300, 656, 520, 4],
  [816, 300, 4, 360],
  [816, 300, 264, 4],
  [560, 200, 4, 240],
  [560, 436, 520, 4],
  [160, 436, 4, 340],
  [0, 772, 164, 4],
];

const plansSpec = {
  colors: {
    background: { value: NV.teal, hint: 'Page gradient' },
    primary: {
      value: NV.coral,
      hint: 'Financial Plans headline, the circuit nodes and the Get Started button',
    },
    text: {
      value: NV.white,
      hint: 'Enabling Smarter, the photo rings, the Book a Call outline, button labels and the logo; its faint tint colors the circuit lines',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Enabling Smarter' },
    headline: { label: 'Headline', value: 'Financial Plans' },
    secondaryCta: { label: 'Outline button', value: 'Book a Call' },
    cta: { label: 'Button', value: 'Get Started' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const smarterPlans = themed(W, H, plansSpec, (t) => {
  const heading = head(t.font('heading'));
  return [
    rect(0, 0, W, H, linear(165, t.color('background'), t.shade('background', NV.deep)), {
      name: 'Background',
    }),
    LINES.map(([x, y, width, height]) =>
      rect(x, y, width, height, t.shade('text', 'rgba(255,255,255,0.28)'), {
        name: 'Circuit line',
      }),
    ),
    [
      [560, 202],
      [818, 658],
      [1000, 438],
      [162, 560],
    ].map(([x = 0, y = 0]) =>
      rect(x - 18, y - 18, 36, 36, t.color('primary'), { cornerRadius: 8, name: 'Node' }),
    ),
    avatar('woman-portrait-1', 302, 202, 62, t.color('text')),
    avatar('man-portrait-2', 818, 302, 62, t.color('text')),
    avatar('woman-portrait-4', 562, 438, 62, t.color('text')),
    avatar('man-portrait-1', 302, 658, 62, t.color('text')),
    heading(t.copy('intro'), 0, 830, W, 58, t.color('text'), 500, { align: 'center' }),
    heading(t.copy('headline'), 0, 900, W, 92, t.color('primary'), 800, { align: 'center' }),
    pill(t.copy('secondaryCta'), 316, 1060, {
      fill: t.shade('text', 'rgba(0,0,0,0)'),
      stroke: t.color('text'),
      strokeWidth: 3,
      color: t.color('text'),
      fontSize: 26,
      fontFamily: t.font('body'),
      fontWeight: 700,
    }),
    button(t.copy('cta'), 556, 1060, t.color('primary'), t.color('text'), t.font('body')),
    logo(540, 1210, t.color('text'), t.copy('brand'), t.font('heading')),
  ];
});

const webinarSpec = {
  colors: {
    background: { value: NV.white, hint: 'Page; its misty tint colors the bottom of the gradient' },
    primary: { value: NV.teal, hint: 'Webinar kicker, the teal bands and the session line' },
    accent: {
      value: NV.coral,
      hint: 'Middle headline line and the coral bands; its soft tint colors the right band',
    },
    text: { value: NV.deep, hint: 'First and last headline lines and the logo' },
    surface: { value: NV.white, hint: 'Speaker names, roles and photo rings' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Webinar' },
    title: { label: 'First headline line', value: 'Practical steps' },
    highlight: { label: 'Highlighted line', value: 'for growing your' },
    closing: { label: 'Last headline line', value: 'wealth plan.' },
    names: { label: 'Speaker', value: ['Maya Linwood', 'Daniel Okafor'] },
    roles: { label: 'Speaker role', value: ['Wealth Strategist', 'Retirement Advisor'] },
    schedule: { label: 'Schedule', value: 'Live session  ·  Thursday, 6 PM' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const webinarSteps = themed(W, H, webinarSpec, (t) => {
  const heading = head(t.font('heading'));
  const body = copy(t.font('body'));
  const [maya = '', daniel = ''] = t.list('names');
  const [mayaRole = '', danielRole = ''] = t.list('roles');
  const band = (x: number, y: number, width: number, fill: string, name = 'Band') =>
    rect(x, y, width, 120, fill, { cornerRadius: 60, name });
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NV.mist)), {
      name: 'Background',
    }),
    heading(t.copy('kicker'), 80, 120, 400, 40, t.color('primary'), 500),
    heading(t.copy('title'), 80, 190, 920, 84, t.color('text'), 800),
    heading(t.copy('highlight'), 80, 290, 920, 84, t.color('accent'), 800),
    heading(t.copy('closing'), 80, 390, 920, 84, t.color('text'), 800),
    band(0, 600, 190, t.color('primary')),
    avatar('woman-portrait-1', 290, 660, 62, t.color('surface')),
    band(370, 600, 420, t.color('accent'), 'Name chip'),
    heading(maya, 410, 620, 360, 34, t.color('surface'), 700),
    body(mayaRole, 410, 664, 360, 24, t.color('surface')),
    band(810, 600, 270, t.color('primary')),
    band(0, 750, 120, t.color('accent')),
    band(140, 750, 440, t.color('primary'), 'Name chip'),
    heading(daniel, 186, 770, 360, 34, t.color('surface'), 700),
    body(danielRole, 186, 814, 360, 24, t.color('surface')),
    avatar('man-portrait-2', 660, 810, 62, t.color('surface')),
    band(750, 750, 330, t.shade('accent', NV.coralSoft)),
    body(t.copy('schedule'), 0, 960, W, 32, t.color('primary'), {
      align: 'center',
      fontWeight: 600,
    }),
    logo(540, 1170, t.color('text'), t.copy('brand'), t.font('heading')),
  ];
});
