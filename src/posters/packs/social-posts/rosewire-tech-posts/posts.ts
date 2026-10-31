import { linear } from '@/design';
import {
  circle,
  POST_SIZE,
  path,
  poly,
  rect,
  rotateNodes,
  shadow,
  text,
  themed,
} from '../../../kit';

export const ROSE = {
  black: '#0b080d',
  panel: '#1a131d',
  rose: '#ff4f8b',
  pink: '#ff9cbf',
  pale: '#ffe1ec',
  grey: '#ab9aa4',
  white: '#ffffff',
  clear: 'rgba(255,79,139,0)',
};

export const HEADING = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const BRAND = { label: 'Brand', value: 'ROSEWIRE TECH' } as const;

export const { width: W, height: H } = POST_SIZE;

export type Tone = (exact: string) => string;

export const roseFill = (from: string, to: string) => linear(90, from, to);

export const brand = (
  label: string,
  fontFamily: string,
  y: number,
  color: string,
  align: 'left' | 'center' = 'center',
) =>
  text(label, align === 'center' ? 0 : 80, y, align === 'center' ? W : 600, {
    fontFamily,
    fontSize: 28,
    fontWeight: 800,
    fill: color,
    align,
    letterSpacing: 3,
  });

export const glow = (
  tone: Tone,
  cx: number,
  cy: number,
  radius: number,
  strength = 0.4,
  height: number = H,
) =>
  circle(
    cx,
    cy,
    Math.min(radius, cx, W - cx, cy, height - cy),
    {
      type: 'radial',
      stops: [
        { offset: 0, color: tone(`rgba(255,79,139,${strength})`) },
        { offset: 0.7, color: tone(ROSE.clear) },
        { offset: 1, color: tone(ROSE.clear) },
      ],
    },
    { name: 'Glow' },
  );

export const cursor = (x: number, y: number, scale: number, fill: string) =>
  poly(
    [
      [x, y],
      [x, y + 70 * scale],
      [x + 18 * scale, y + 54 * scale],
      [x + 32 * scale, y + 84 * scale],
      [x + 44 * scale, y + 78 * scale],
      [x + 30 * scale, y + 49 * scale],
      [x + 54 * scale, y + 49 * scale],
    ],
    fill,
    { name: 'Cursor' },
  );

const grid = (fill: string) => [
  Array.from({ length: 11 }, (_, index) =>
    rect(index * 108 + 52, 0, 2, H, fill, { name: 'Grid line' }),
  ),
  Array.from({ length: 12 }, (_, index) =>
    rect(0, index * 112 + 60, W, 2, fill, { name: 'Grid line' }),
  ),
];

export const modularClick = themed(
  W,
  H,
  {
    colors: {
      background: { value: ROSE.black, hint: 'Page, the hollow chart points and the button label' },
      primary: {
        value: ROSE.rose,
        hint: 'Glow, One Click and the button; its pink shade colors the trend line and the end of the gradients',
      },
      text: {
        value: ROSE.white,
        hint: 'Brand, headline, the faint grid, the chart points and the cursor',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      headline: { label: 'Headline', value: 'Smarter Tools\nPicked in' },
      highlight: { label: 'Highlight', value: 'One Click' },
      cta: { label: 'Button', value: 'Learn more' },
    },
  },
  (t) => {
    const gradient = roseFill(t.color('primary'), t.shade('primary', ROSE.pink));
    const hollow = (cx: number, cy: number) =>
      circle(cx, cy, 14, t.color('background'), {
        stroke: t.color('text'),
        strokeWidth: 4,
        name: 'Point',
      });
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      grid(t.shade('text', 'rgba(255,255,255,0.05)')),
      glow((exact) => t.shade('primary', exact), 640, 960, 420, 0.4),
      brand(t.copy('brand'), t.font('heading'), 90, t.color('text'), 'left'),
      text(t.copy('headline'), 80, 200, 920, {
        fontFamily: t.font('heading'),
        fontSize: 86,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.12,
      }),
      text(t.copy('highlight'), 80, 394, 920, {
        fontFamily: t.font('heading'),
        fontSize: 86,
        fontWeight: 800,
        fill: gradient,
      }),
      rect(80, 540, 250, 76, roseFill(t.color('primary'), t.shade('primary', ROSE.pink)), {
        cornerRadius: 38,
        name: 'Button',
      }),
      text(t.copy('cta'), 80, 560, 250, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 700,
        fill: t.color('background'),
        align: 'center',
      }),
      path(
        'M 100 1130 C 220 1130 250 960 360 960 C 470 960 500 1060 600 1050 C 720 1040 760 820 880 800',
        0,
        0,
        W,
        H,
        t.shade('primary', 'rgba(0,0,0,0)'),
        { width: W, height: H },
        { stroke: t.shade('primary', ROSE.pink), strokeWidth: 6, name: 'Trend line' },
      ),
      hollow(360, 960),
      hollow(600, 1050),
      circle(880, 800, 18, t.color('text'), { name: 'Point' }),
      cursor(910, 830, 1.4, t.color('text')),
    ];
  },
);

const KEYS = [
  { label: 'Draft', x: 290, y: 740, rotation: -8, hot: false },
  { label: 'Automate', x: 620, y: 800, rotation: 10, hot: false },
  { label: 'Ship', x: 150, y: 900, rotation: 6, hot: true },
  { label: 'Insights', x: 500, y: 990, rotation: -4, hot: false },
  { label: 'Voice', x: 110, y: 1110, rotation: -9, hot: false },
  { label: 'Scale', x: 690, y: 1140, rotation: 7, hot: true },
];

export const blueprintKeys = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ROSE.black,
        hint: 'Page and the key labels; its lighter shade colors the top of the page',
      },
      primary: {
        value: ROSE.rose,
        hint: 'Glow, Smarter Growth and the highlighted keys; its shades color the gradient ends and key edges',
      },
      surface: {
        value: ROSE.white,
        hint: 'Plain keys; its pink and mauve shades color their gradient and edges',
      },
      text: {
        value: ROSE.white,
        hint: 'Brand and the intro line; its grey shade colors the body text',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      intro: { label: 'Intro', value: 'Your Playbook for' },
      title: { label: 'Title', value: 'Smarter Growth' },
      body: {
        label: 'Body',
        value:
          'From the first prompt to a full rollout, we give your\nteam the systems it needs to move faster.',
      },
      keys: { label: 'Key', value: KEYS.map((key) => key.label) },
    },
  },
  (t) => {
    const keys = t.list('keys');
    return [
      rect(0, 0, W, H, linear(180, t.shade('background', '#1a111d'), t.color('background')), {
        name: 'Background',
      }),
      glow((exact) => t.shade('primary', exact), 540, 1080, 420, 0.45),
      brand(t.copy('brand'), t.font('heading'), 90, t.color('text')),
      text(t.copy('intro'), 0, 190, W, {
        fontFamily: t.font('heading'),
        fontSize: 70,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('title'), 0, 274, W, {
        fontFamily: t.font('heading'),
        fontSize: 76,
        fontWeight: 800,
        fill: roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
        align: 'center',
      }),
      text(t.copy('body'), 90, 400, 900, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 400,
        fill: t.shade('text', ROSE.grey),
        align: 'center',
      }),
      KEYS.map((key, index) =>
        rotateNodes(key.rotation, key.x + 140, key.y + 55, [
          rect(
            key.x,
            key.y,
            280,
            110,
            key.hot
              ? roseFill(t.color('primary'), t.shade('primary', ROSE.pink))
              : linear(180, t.color('surface'), t.shade('surface', '#f1d9e2')),
            {
              cornerRadius: 24,
              name: `${key.label} key`,
              ...shadow(
                0,
                12,
                key.hot ? t.shade('primary', '#a3244f') : t.shade('surface', '#8f7a84'),
              ),
            },
          ),
          text(keys[index] ?? '', key.x, key.y + 30, 280, {
            fontFamily: t.font('heading'),
            fontSize: 42,
            fontWeight: 800,
            fill: t.color('background'),
            align: 'center',
          }),
        ]),
      ),
    ];
  },
);
