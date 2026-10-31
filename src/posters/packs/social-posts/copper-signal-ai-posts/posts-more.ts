import { linear } from '@/design';
import { icon, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  BRAND,
  brand,
  COPPER,
  centered,
  copperFill,
  glow,
  glowStop,
  H,
  HEADING,
  W,
} from './posts';

const PRINCIPLES = [
  { label: 'Oversight', x: 100, y: 620, height: 360 },
  { label: 'Clarity', x: 330, y: 520, height: 320 },
  { label: 'Fairness', x: 560, y: 660, height: 320 },
  { label: 'Privacy', x: 790, y: 560, height: 360 },
];

const principlesSpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page gradient; its warmer shade colors the top of the page',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow, Trustworthy? and the principle cards; its amber shades color the card outlines and the gradient end',
    },
    text: { value: COPPER.white, hint: 'What Makes AI, card labels, arrows and the brand name' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'What Makes AI' },
    accent: { label: 'Highlighted line', value: 'Trustworthy?' },
    principles: { label: 'Principle', value: PRINCIPLES.map((item) => item.label) },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const principles = themed(W, H, principlesSpec, (t) => {
  const labels = t.list('principles');
  return [
    rect(0, 0, W, H, linear(180, t.shade('background', '#28190f'), t.color('background')), {
      name: 'Background',
    }),
    glow(540, 760, 460, t.shade('primary', glowStop(0.3)), t.shade('primary', COPPER.clear)),
    centered(t.copy('title'), 150, 72, 500, t.color('text'), t.font('heading')),
    centered(
      t.copy('accent'),
      236,
      96,
      800,
      copperFill(t.color('primary'), t.shade('primary', COPPER.amber)),
      t.font('heading'),
    ),
    PRINCIPLES.map((item, index) => [
      rect(
        item.x,
        item.y,
        200,
        item.height,
        linear(
          180,
          t.shade('primary', 'rgba(255,138,61,0.6)'),
          t.shade('primary', 'rgba(255,138,61,0.06)'),
        ),
        {
          cornerRadius: 26,
          stroke: t.shade('primary', 'rgba(255,192,122,0.55)'),
          strokeWidth: 2,
          name: 'Principle card',
        },
      ),
      icon('arrow-up-right', item.x + 142, item.y + 20, 38, t.color('text'), { strokeWidth: 2.4 }),
      text(labels[index] ?? '', item.x, item.y + item.height - 64, 200, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
      }),
    ]),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const uploadSpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page; its brown shade colors the Uploading label',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow, Autopilot, the folder and the progress bar; its shades color the folder tab, outlines and gradient ends',
    },
    secondary: {
      value: COPPER.grey,
      hint: 'Bottom of the Introducing gradient, the file size and the close icon',
    },
    text: {
      value: COPPER.white,
      hint: 'Introducing, the file name and the brand name; its faint tints color the grid lines and panels, its pale shade the tagline',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Introducing' },
    title: { label: 'Product', value: 'Autopilot' },
    file: { label: 'File name', value: 'autopilot_v3.zip' },
    size: { label: 'File size', value: '84.2 MB' },
    progress: { label: 'Progress label', value: 'Uploading  72%' },
    tagline: { label: 'Tagline', value: 'Ship updates without the wait.' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const uploadFile = themed(W, H, uploadSpec, (t) => {
  const copper = copperFill(t.color('primary'), t.shade('primary', COPPER.amber));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 10 }, (_, index) =>
      rect(index * 120 + 0, 0, 2, H, t.shade('text', 'rgba(255,255,255,0.04)'), {
        name: 'Grid line',
      }),
    ),
    glow(540, 680, 460, t.shade('primary', glowStop(0.3)), t.shade('primary', COPPER.clear)),
    centered(
      t.copy('kicker'),
      150,
      74,
      500,
      linear(180, t.color('text'), t.color('secondary')),
      t.font('heading'),
    ),
    centered(t.copy('title'), 240, 100, 800, copper, t.font('heading')),
    rect(130, 470, 820, 400, t.shade('text', 'rgba(255,255,255,0.05)'), {
      cornerRadius: 34,
      stroke: t.shade('primary', 'rgba(255,192,122,0.45)'),
      strokeWidth: 2,
      name: 'Upload panel',
    }),
    rect(190, 534, 70, 30, t.shade('primary', COPPER.burnt), {
      cornerRadius: 8,
      name: 'Folder tab',
    }),
    rect(190, 550, 150, 108, copper, { cornerRadius: 14, name: 'Folder' }),
    text(t.copy('file'), 380, 548, 460, {
      fontFamily: t.font('heading'),
      fontSize: 44,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    text(t.copy('size'), 380, 610, 300, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 500,
      fill: t.color('secondary'),
    }),
    icon('circle-x', 856, 506, 52, t.color('secondary'), { strokeWidth: 2 }),
    rect(190, 730, 700, 74, t.shade('text', 'rgba(255,255,255,0.06)'), {
      cornerRadius: 37,
      stroke: t.shade('primary', 'rgba(255,192,122,0.35)'),
      strokeWidth: 2,
      name: 'Progress track',
    }),
    rect(198, 738, 490, 58, copper, { cornerRadius: 29, name: 'Progress' }),
    text(t.copy('progress'), 230, 750, 420, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 700,
      fill: t.shade('background', COPPER.ink),
    }),
    text(t.copy('tagline'), 0, 960, W, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.shade('text', COPPER.pale),
      align: 'center',
    }),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const BARS = [
  { value: '35%', height: 300 },
  { value: '62%', height: 470 },
  { value: '88%', height: 640 },
];

const velocitySpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page gradient; its warmer shade colors the bottom of the page, its brown shade the bar values',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Glow, Velocity and the bars; its amber shades color the bar tops and outlines',
    },
    secondary: { value: COPPER.grey, hint: 'Body text' },
    text: { value: COPPER.white, hint: 'Pipeline' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Pipeline' },
    accent: { label: 'Highlighted line', value: 'Velocity' },
    body: {
      label: 'Body',
      value: 'Move deals from the first call to a signed\ncontract in record time.',
    },
    values: { label: 'Bar value', value: BARS.map((bar) => bar.value) },
  },
} as const satisfies ThemeSpec;

export const velocityBars = themed(W, H, velocitySpec, (t) => {
  const values = t.list('values');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#24170e')), {
      name: 'Background',
    }),
    glow(780, 1000, 300, t.shade('primary', glowStop(0.35)), t.shade('primary', COPPER.clear)),
    text(t.copy('title'), 80, 130, 900, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    text(t.copy('accent'), 80, 236, 900, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 800,
      fill: copperFill(t.color('primary'), t.shade('primary', COPPER.amber)),
    }),
    text(t.copy('body'), 80, 372, 920, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 400,
      fill: t.color('secondary'),
      lineHeight: 1.4,
    }),
    BARS.map((bar, index) => {
      const x = 220 + index * 230;
      const y = 1260 - bar.height;
      return [
        rect(
          x,
          y,
          180,
          bar.height,
          linear(
            180,
            t.shade('primary', 'rgba(255,192,122,0.95)'),
            t.shade('primary', 'rgba(255,138,61,0.2)'),
          ),
          {
            cornerRadius: 90,
            stroke: t.shade('primary', 'rgba(255,192,122,0.6)'),
            strokeWidth: 2,
            name: 'Bar',
          },
        ),
        text(values[index] ?? '', x, y + 66, 180, {
          fontFamily: t.font('heading'),
          fontSize: 44,
          fontWeight: 800,
          fill: t.shade('background', COPPER.ink),
          align: 'center',
        }),
      ];
    }),
  ];
});
