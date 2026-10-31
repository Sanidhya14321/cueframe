import { type Fill, linear } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  poly,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const MINT = {
  black: '#050807',
  panel: '#0e1a16',
  mint: '#5ef2b4',
  deep: '#139a6a',
  pale: '#dcfff1',
  grey: '#8fa69c',
  white: '#ffffff',
  clear: 'rgba(94,242,180,0)',
};

export const HEADING = { label: 'Heading font', value: 'Sora' } as const;
export const BODY = { label: 'Body font', value: 'Manrope' } as const;
export const BRAND = { label: 'Brand', value: 'NODEWAVE LABS' } as const;

export const { width: W, height: H } = POST_SIZE;

type Shade = (exact: string) => string;

export const mintText = (primary: string, shade: Shade) => linear(90, primary, shade(MINT.pale));

export const brand = (
  label: string,
  y: number,
  fill: string,
  fontFamily: string,
  width: number = W,
  x = 0,
  align: 'left' | 'center' = 'center',
) =>
  text(label, x, y, width, {
    fontFamily,
    fontSize: 28,
    fontWeight: 700,
    fill,
    align,
    letterSpacing: 4,
  });

export const headline = (
  first: string,
  second: string,
  y: number,
  size: number,
  colors: { first: string; second: Fill; font: string },
  width: number = W,
  x = 0,
): Nodes[] => [
  text(first, x, y, width, {
    fontFamily: colors.font,
    fontSize: size * 0.86,
    fontWeight: 400,
    fill: colors.first,
    align: 'center',
  }),
  text(second, x, y + size * 1.08, width, {
    fontFamily: colors.font,
    fontSize: size,
    fontWeight: 800,
    fill: colors.second,
    align: 'center',
  }),
];

export const glow = (
  shade: Shade,
  cx: number,
  cy: number,
  radius: number,
  strength = 0.45,
  height: number = H,
) =>
  circle(
    cx,
    cy,
    Math.min(radius, cx, W - cx, cy, height - cy),
    {
      type: 'radial',
      stops: [
        { offset: 0, color: shade(`rgba(94,242,180,${strength})`) },
        { offset: 0.7, color: shade(MINT.clear) },
        { offset: 1, color: shade(MINT.clear) },
      ],
    },
    { name: 'Glow' },
  );

const cursor = (x: number, y: number, scale: number, fill: string) =>
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

const ringsSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page' },
    primary: {
      value: MINT.mint,
      hint: 'Glows, the four rings and the second headline line; its pale shade ends the headline gradient',
    },
    text: { value: MINT.white, hint: 'Brand name, first headline line and the sparkles icon' },
  },
  fonts: { heading: HEADING },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'The pulse of' },
    highlight: { label: 'Highlight', value: 'Smart Workflows' },
  },
} as const satisfies ThemeSpec;

export const powerRings = themed(W, H, ringsSpec, (t) => {
  const shade: Shade = (exact) => t.shade('primary', exact);
  const font = t.font('heading');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(shade, 540, 860, 520, 0.18),
    brand(t.copy('brand'), 90, t.color('text'), font),
    headline(t.copy('headline'), t.copy('highlight'), 190, 82, {
      first: t.color('text'),
      second: mintText(t.color('primary'), shade),
      font,
    }),
    [440, 360, 280, 200].map((radius, index) =>
      circle(540, 860, radius, shade('rgba(0,0,0,0)'), {
        stroke: shade(`rgba(94,242,180,${0.12 + index * 0.12})`),
        strokeWidth: 3,
        name: 'Ring',
      }),
    ),
    glow(shade, 540, 860, 220, 0.6),
    icon('sparkles', 460, 780, 160, t.color('text'), { strokeWidth: 1.6 }),
  ];
});

const foldersSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page; its green tint starts the page gradient' },
    primary: {
      value: MINT.mint,
      hint: 'Glow, the headline and the three folders; its pale shade ends the headline gradient and its deep shade colors the folder tabs',
    },
    text: {
      value: MINT.white,
      hint: 'Smart folders, the cursor and the brand name; its grey shade colors the folder labels',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Smart folders' },
    headline: { label: 'Headline', value: 'Docs That\nStay Tidy' },
    folders: { label: 'Folder', value: ['Roadmap', 'Release Notes', 'Help Center'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const docsFolders = themed(W, H, foldersSpec, (t) => {
  const shade: Shade = (exact) => t.shade('primary', exact);
  const heading = t.font('heading');
  const folder = (x: number, y: number, label: string) => [
    rect(x, y, 80, 34, shade(MINT.deep), { cornerRadius: 10, name: 'Folder tab' }),
    rect(x, y + 20, 200, 140, linear(160, t.color('primary'), shade(MINT.deep)), {
      cornerRadius: 16,
      name: 'Folder',
    }),
    text(label, x - 40, y + 180, 280, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 600,
      fill: t.shade('text', MINT.grey),
      align: 'center',
    }),
  ];
  return [
    rect(0, 0, W, H, linear(160, t.shade('background', '#0f2019'), t.color('background')), {
      name: 'Background',
    }),
    glow(shade, 330, 560, 330, 0.3),
    text(t.copy('kicker'), 80, 340, 560, {
      fontFamily: heading,
      fontSize: 52,
      fontWeight: 400,
      fill: t.color('text'),
    }),
    text(t.copy('headline'), 80, 420, 680, {
      fontFamily: heading,
      fontSize: 112,
      fontWeight: 800,
      fill: mintText(t.color('primary'), shade),
      lineHeight: 1,
    }),
    t.list('folders').map((label, index) => folder(780, 170 + index * 330, label)),
    cursor(860, 380, 1.3, t.color('text')),
    brand(t.copy('brand'), 1240, t.color('text'), heading, 600, 80, 'left'),
  ];
});

const GLOBE = { cx: 540, cy: 1500, r: 560 };

const globeDots = (fill: string) => {
  const nodes: Nodes[] = [];
  for (let y = 980; y < 1340; y += 34) {
    for (let x = 20; x < 1070; x += 34) {
      const dx = x - GLOBE.cx;
      const dy = y - GLOBE.cy;
      const inside = Math.hypot(dx, dy) < GLOBE.r - 30;
      const land = Math.sin(x / 90) + Math.cos(y / 60) + Math.sin((x + y) / 140) > 0.4;
      if (inside && land) {
        nodes.push(circle(x, y, 6, fill, { name: 'Map dot' }));
      }
    }
  }
  return nodes;
};

const reachSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page, the play icon and the bottom of the globe' },
    primary: {
      value: MINT.mint,
      hint: 'Glow, second headline line, button outline, play circle, globe outline and its dots; its dark shade fills the top of the globe',
    },
    text: {
      value: MINT.white,
      hint: 'Brand name, first headline line, button label and the faint button fill',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'Worldwide Reach' },
    highlight: { label: 'Highlight', value: 'Local Speed' },
    button: { label: 'Button', value: 'Join the network' },
  },
} as const satisfies ThemeSpec;

export const worldReach = themed(W, H, reachSpec, (t) => {
  const shade: Shade = (exact) => t.shade('primary', exact);
  const heading = t.font('heading');
  const lift = Math.asin((GLOBE.cy - H) / GLOBE.r);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(shade, 540, 980, 620, 0.35),
    brand(t.copy('brand'), 90, t.color('text'), heading),
    headline(t.copy('headline'), t.copy('highlight'), 200, 84, {
      first: t.color('text'),
      second: mintText(t.color('primary'), shade),
      font: heading,
    }),
    rect(330, 440, 420, 84, t.shade('text', 'rgba(255,255,255,0.06)'), {
      cornerRadius: 42,
      stroke: shade('rgba(94,242,180,0.5)'),
      strokeWidth: 2,
      name: 'Button',
    }),
    circle(378, 482, 30, t.color('primary')),
    icon('play', 364, 468, 28, t.color('background')),
    text(t.copy('button'), 420, 462, 320, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    poly(
      Array.from({ length: 49 }, (_, index): [number, number] => {
        const angle = Math.PI + lift + ((Math.PI - 2 * lift) * index) / 48;
        return [GLOBE.cx + GLOBE.r * Math.cos(angle), GLOBE.cy + GLOBE.r * Math.sin(angle)];
      }),
      linear(180, shade('#1d4a39'), t.color('background')),
      { name: 'Globe', stroke: t.color('primary'), strokeWidth: 4 },
    ),
    globeDots(shade('rgba(220,255,241,0.55)')),
  ];
});

const BAR_HEIGHTS = [
  260, 420, 330, 520, 380, 600, 450, 300, 560, 480, 640, 400, 520, 360, 580, 440, 310, 500, 380,
  560, 290, 450,
];

const barsSpec = {
  colors: {
    background: {
      value: MINT.black,
      hint: 'Page and the Learn more label; its green tint ends the page gradient',
    },
    primary: {
      value: MINT.mint,
      hint: 'Glow, second headline line, button group outline, the Learn more button and the bars; its pale shade ends the gradients',
    },
    text: {
      value: MINT.white,
      hint: 'Brand name, first headline line, Contact us and the faint button group fill',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'Amplify Your' },
    highlight: { label: 'Highlight', value: 'Output' },
    buttons: { label: 'Button', value: ['Learn more', 'Contact us'] },
  },
} as const satisfies ThemeSpec;

export const amplifyBars = themed(W, H, barsSpec, (t) => {
  const shade: Shade = (exact) => t.shade('primary', exact);
  const heading = t.font('heading');
  const body = t.font('body');
  const [learn = '', contact = ''] = t.list('buttons');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#0c1f18')), {
      name: 'Background',
    }),
    glow(shade, 540, 1000, 350, 0.4),
    brand(t.copy('brand'), 90, t.color('text'), heading),
    headline(t.copy('headline'), t.copy('highlight'), 200, 96, {
      first: t.color('text'),
      second: mintText(t.color('primary'), shade),
      font: heading,
    }),
    rect(300, 470, 480, 84, t.shade('text', 'rgba(255,255,255,0.06)'), {
      cornerRadius: 42,
      stroke: shade('rgba(94,242,180,0.4)'),
      strokeWidth: 2,
      name: 'Button group',
    }),
    rect(308, 478, 236, 68, mintText(t.color('primary'), shade), {
      cornerRadius: 34,
      name: 'Primary button',
    }),
    text(learn, 308, 494, 236, {
      fontFamily: body,
      fontSize: 28,
      fontWeight: 700,
      fill: t.color('background'),
      align: 'center',
    }),
    text(contact, 544, 494, 236, {
      fontFamily: body,
      fontSize: 28,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    BAR_HEIGHTS.map((height, index) =>
      rect(
        70 + index * 43,
        1300 - height,
        28,
        height,
        linear(180, shade(MINT.pale), shade(MINT.clear)),
        {
          cornerRadius: 14,
          name: 'Bar',
        },
      ),
    ),
  ];
});
