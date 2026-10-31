import { linear, radial } from '@/design';
import {
  circle,
  ellipse,
  icon,
  type Nodes,
  POST_SIZE,
  paint,
  phone,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const ICE = {
  night: '#030a14',
  navy: '#071a33',
  deep: '#0b2a52',
  cyan: '#22d3ee',
  electric: '#0ea5e9',
  ice: '#cffafe',
  paper: '#f0fbff',
  white: '#ffffff',
  muted: 'rgba(255,255,255,0.72)',
};

export const HEADING = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const BRAND = { label: 'Brand', value: 'QUANTA GRID' } as const;
export const { width: W, height: H } = POST_SIZE;

type Role = 'background' | 'primary' | 'text';

export interface Ink {
  color: (key: Role) => string;
  shade: (key: Role, exact: string) => string;
}

export const DARK_BACKGROUND = {
  value: ICE.night,
  hint: 'Page; its lighter shade tints the top of the page',
} as const;

export const brandMark = (
  label: string,
  x: number,
  y: number,
  width: number,
  color: string,
  fontFamily: string,
  align: 'left' | 'center' | 'right' = 'center',
) =>
  text(label, x, y, width, {
    fontFamily,
    fontSize: 28,
    fontWeight: 700,
    fill: color,
    align,
    letterSpacing: 4,
  });

const glow = (ink: Ink, x: number, y: number, width: number, height: number, alpha = 0.32) =>
  ellipse(
    x,
    y,
    width,
    height,
    radial(
      ink.shade('primary', `rgba(34,211,238,${alpha})`),
      ink.shade('primary', `rgba(34,211,238,${alpha * 0.3})`),
      ink.shade('primary', 'rgba(34,211,238,0)'),
      ink.shade('primary', 'rgba(34,211,238,0)'),
    ),
    { name: 'Glow' },
  );

export const darkBg = (ink: Ink, height: number): Nodes[] => [
  rect(
    0,
    0,
    W,
    height,
    linear(
      180,
      ink.shade('background', '#0a2546'),
      ink.color('background'),
      ink.color('background'),
    ),
    { name: 'Background' },
  ),
  glow(ink, 140, 0, 800, 640),
];

export const button = (
  ink: Ink,
  label: string,
  x: number,
  y: number,
  width: number,
  filled: boolean,
  fontFamily: string,
) => [
  rect(
    x,
    y,
    width,
    72,
    filled
      ? linear(90, ink.color('primary'), ink.shade('primary', ICE.electric))
      : ink.shade('text', 'rgba(255,255,255,0.04)'),
    {
      name: `${label} button`,
      cornerRadius: 36,
      stroke: filled ? 'rgba(255,255,255,0.65)' : ink.shade('text', 'rgba(255,255,255,0.65)'),
      strokeWidth: filled ? 0 : 2,
    },
  ),
  text(label, x, y + 20, width, {
    fontFamily,
    fontSize: 28,
    fontWeight: 600,
    fill: filled ? ink.color('background') : ink.color('text'),
    align: 'center',
  }),
];

export const planBuildShip = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ICE.night,
        hint: 'Page and the phone body; its lighter shade tints the top of the page',
      },
      primary: {
        value: ICE.cyan,
        hint: 'Glow at the top; its shades color the phone screen gradient',
      },
      text: {
        value: ICE.white,
        hint: 'Plan, Build, Ship, the brand name and the cloud and cards on the phone',
      },
    },
    fonts: { heading: HEADING },
    copy: {
      lines: { label: 'Headline line', value: ['Plan.', 'Build.', 'Ship.'] },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const big = {
      fontFamily: t.font('heading'),
      fontSize: 230,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1,
    };
    const [plan = '', build = '', ship = ''] = t.list('lines');
    return [
      darkBg(t, H),
      text(plan, 70, 170, 960, big),
      text(build, 70, 500, 960, big),
      text(ship, 70, 830, 960, big),
      paint(
        [
          phone(590, 300, 330, {
            rotation: 10,
            screen: linear(180, t.shade('primary', '#38bdf8'), t.shade('primary', '#cffafe')),
            content: [
              circle(110, 190, 48, t.color('text')),
              circle(165, 165, 64, t.color('text')),
              circle(220, 195, 46, t.color('text')),
              rect(62, 190, 210, 50, t.color('text'), { name: 'Cloud base', cornerRadius: 25 }),
              rect(30, 440, 240, 70, t.shade('text', 'rgba(255,255,255,0.75)'), {
                name: 'Card',
                cornerRadius: 18,
              }),
              rect(30, 526, 170, 46, t.shade('text', 'rgba(255,255,255,0.5)'), {
                name: 'Card',
                cornerRadius: 14,
              }),
            ],
          }),
        ],
        { '#0b0b0f': t.shade('background', '#0b0b0f') },
      ),
      brandMark(t.copy('brand'), 0, 1240, W, t.color('text'), t.font('heading')),
    ];
  },
);

export const riseOfAutopilot = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ICE.night,
        hint: 'Page and the Book a Demo label; its lighter shade tints the top of the page',
      },
      primary: {
        value: ICE.cyan,
        hint: 'Glow, side tiles, the glowing center tile, Autopilot and the Book a Demo button',
      },
      text: {
        value: ICE.white,
        hint: 'Sparkles, The rise of, the Learn More button and the brand name',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      intro: { label: 'Intro', value: 'The rise of' },
      title: { label: 'Headline', value: 'Autopilot' },
      more: { label: 'Outline button', value: 'Learn More' },
      cta: { label: 'Button', value: 'Book a Demo' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const sideTile = (x: number) =>
      rect(x, 330, 240, 240, t.shade('primary', 'rgba(34,211,238,0.08)'), {
        name: 'Side tile',
        cornerRadius: 44,
        stroke: t.shade('primary', 'rgba(34,211,238,0.35)'),
        strokeWidth: 2,
      });
    return [
      darkBg(t, H),
      sideTile(40),
      sideTile(800),
      rect(
        390,
        290,
        300,
        300,
        linear(
          135,
          t.shade('primary', '#a5f3fc'),
          t.color('primary'),
          t.shade('primary', ICE.electric),
        ),
        {
          name: 'Glowing tile',
          cornerRadius: 56,
          ...shadow(90, 0, t.shade('primary', 'rgba(34,211,238,0.85)')),
        },
      ),
      icon('sparkles', 465, 365, 150, t.color('text'), { strokeWidth: 1.8 }),
      text(t.copy('intro'), 0, 720, W, {
        fontFamily: t.font('heading'),
        fontSize: 72,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('title'), 0, 810, W, {
        fontFamily: t.font('heading'),
        fontSize: 124,
        fontWeight: 800,
        fill: t.color('primary'),
        align: 'center',
      }),
      button(t, t.copy('more'), 250, 1020, 270, false, t.font('body')),
      button(t, t.copy('cta'), 560, 1020, 270, true, t.font('body')),
      brandMark(t.copy('brand'), 0, 1240, W, t.color('text'), t.font('heading')),
    ];
  },
);

const ORBS: readonly (readonly [number, number])[] = [
  [170, 300],
  [930, 250],
  [940, 900],
  [160, 1060],
];

export const topThree = themed(
  W,
  H,
  {
    colors: {
      background: DARK_BACKGROUND,
      primary: {
        value: ICE.cyan,
        hint: 'Glow, rings, glowing orbs, Pipelines and the row arrows',
      },
      text: {
        value: ICE.white,
        hint: 'Top 3, the rows and their labels, the orb centers and the brand name',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Top 3' },
      subtitle: { label: 'Subtitle', value: 'Pipelines' },
      items: { label: 'Row', value: ['Vision Models', 'Language Agents', 'Edge Inference'] },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => [
    darkBg(t, H),
    [500, 380, 260].map((radius) =>
      circle(540, 700, radius, t.shade('primary', 'rgba(0,0,0,0)'), {
        name: 'Ring',
        stroke: t.shade('primary', 'rgba(34,211,238,0.16)'),
        strokeWidth: 3,
      }),
    ),
    ORBS.map(([cx, cy]) =>
      circle(cx, cy, 24, radial(t.color('text'), t.color('primary')), {
        name: 'Orb',
        ...shadow(40, 0, t.shade('primary', 'rgba(34,211,238,0.9)')),
      }),
    ),
    text(t.copy('title'), 0, 300, W, {
      fontFamily: t.font('heading'),
      fontSize: 124,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('subtitle'), 0, 430, W, {
      fontFamily: t.font('heading'),
      fontSize: 100,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
    }),
    t.list('items').map((label, index) => {
      const y = 640 + index * 120;
      return [
        rect(280, y, 520, 86, t.shade('text', 'rgba(255,255,255,0.07)'), {
          name: 'Row',
          cornerRadius: 22,
          stroke: t.shade('text', 'rgba(255,255,255,0.5)'),
          strokeWidth: 2,
        }),
        icon('arrow-up-right', 312, y + 23, 40, t.color('primary'), { strokeWidth: 2.4 }),
        text(label, 376, y + 24, 400, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
        }),
      ];
    }),
    brandMark(t.copy('brand'), 0, 1240, W, t.color('text'), t.font('heading')),
  ],
);
