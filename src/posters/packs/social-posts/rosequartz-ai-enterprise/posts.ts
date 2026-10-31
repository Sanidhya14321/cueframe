import { type Fill, linear, radial } from '@/design';
import {
  circle,
  ellipse,
  group,
  icon,
  type Nodes,
  POST_SIZE,
  pill,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const ROSE = {
  night: '#12050e',
  plum: '#2c0c24',
  wine: '#4a1238',
  magenta: '#d6246e',
  pink: '#ff6fa8',
  blush: '#ffd3e6',
  paper: '#fff7fb',
  ink: '#1c0a16',
  muted: '#5b4352',
  white: '#ffffff',
};

export const HEADING = { label: 'Heading font', value: 'Sora' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const BRAND = { label: 'Brand', value: 'NOVAFIELD LABS' } as const;
export const { width: W, height: H } = POST_SIZE;

export const brandMark = (
  label: string,
  x: number,
  y: number,
  width: number,
  color: string,
  fontFamily: string,
  align: 'left' | 'center' | 'right' = 'left',
) =>
  text(label, x, y, width, {
    fontFamily,
    fontSize: 26,
    fontWeight: 700,
    fill: color,
    align,
    letterSpacing: 3,
  });

export const darkBackdrop = (height: number, background: Fill, glow: Fill): Nodes[] => [
  rect(0, 0, W, height, background, { name: 'Background' }),
  ellipse(90, 0, 900, 620, glow, { name: 'Top glow' }),
];

export const pinkGlow = (shade: (exact: string) => string, strong: number, soft: number) =>
  radial(
    shade(`rgba(255,111,168,${strong})`),
    shade(`rgba(255,111,168,${soft})`),
    shade('rgba(255,111,168,0)'),
    shade('rgba(255,111,168,0)'),
  );

const pipelinesSpec = {
  colors: {
    background: {
      value: ROSE.paper,
      hint: 'Page gradient; its pink shades are the middle and bottom of the gradient',
    },
    primary: {
      value: ROSE.magenta,
      hint: 'AI Agent and the two tilted pills; its lighter shade starts the pill gradient',
    },
    surface: {
      value: ROSE.white,
      hint: 'Pill labels and the two big echo words in the lower half (90% and 40% opacity)',
    },
    text: { value: ROSE.ink, hint: 'Brand name, Smarter and Pipelines' },
  },
  fonts: { heading: HEADING },
  copy: {
    brand: BRAND,
    intro: { label: 'Headline top', value: 'Smarter' },
    highlight: { label: 'Highlight', value: 'AI Agent' },
    title: { label: 'Headline bottom', value: 'Pipelines' },
    buttons: { label: 'Button', value: ['Ask Agent', 'Start Run'] },
    echo: { label: 'Echo word', value: 'Optimize' },
  },
} as const satisfies ThemeSpec;

export const promptPipelines = themed(W, H, pipelinesSpec, (t) => {
  const font = t.font('heading');
  const [ask = '', start = ''] = t.list('buttons');
  const line = (label: string, y: number, fontWeight: number, fill: string) =>
    text(label, 90, y, 900, { fontFamily: font, fontSize: 104, fontWeight, fill, lineHeight: 1 });
  const button = (label: string, x: number, y: number) =>
    pill(label, x, y, {
      fill: linear(90, t.shade('primary', ROSE.pink), t.color('primary')),
      color: t.color('surface'),
      fontSize: 34,
      fontFamily: font,
    });
  const echo = (y: number, fill: string) =>
    text(t.copy('echo'), 0, y, W, {
      fontFamily: font,
      fontSize: 190,
      fontWeight: 800,
      fill,
      align: 'center',
      lineHeight: 1,
    });
  return [
    rect(
      0,
      0,
      W,
      H,
      linear(
        180,
        t.color('background'),
        t.shade('background', ROSE.blush),
        t.shade('background', '#f59bc2'),
      ),
      { name: 'Background' },
    ),
    brandMark(t.copy('brand'), 0, 90, W, t.color('text'), font, 'center'),
    line(t.copy('intro'), 210, 400, t.color('text')),
    line(t.copy('highlight'), 330, 700, t.color('primary')),
    line(t.copy('title'), 450, 400, t.color('text')),
    rotateNodes(-8, 300, 700, button(ask, 170, 660)),
    rotateNodes(9, 720, 660, button(start, 590, 620)),
    echo(880, t.shade('surface', 'rgba(255,255,255,0.9)')),
    echo(1090, t.shade('surface', 'rgba(255,255,255,0.4)')),
  ];
});

const scaleSpec = {
  colors: {
    background: {
      value: ROSE.wine,
      hint: 'Page gradient; its darker shade fills the lower page',
    },
    primary: {
      value: ROSE.pink,
      hint: 'Top glow, the glow around to Scale, the beam, the dot glow and the arrow tile; its deeper shade ends the tile gradient',
    },
    text: {
      value: ROSE.white,
      hint: 'Brand name, Engineered (at 42%), to Scale, the beam dot and the arrow',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'Engineered' },
    highlight: { label: 'Highlight', value: 'to Scale' },
  },
} as const satisfies ThemeSpec;

export const engineeredToScale = themed(W, H, scaleSpec, (t) => {
  const font = t.font('heading');
  const glowShade = (exact: string) => t.shade('primary', exact);
  return [
    darkBackdrop(
      H,
      linear(
        180,
        t.color('background'),
        t.shade('background', ROSE.night),
        t.shade('background', ROSE.night),
      ),
      pinkGlow(glowShade, 0.34, 0.1),
    ),
    brandMark(t.copy('brand'), 80, 90, 600, t.color('text'), font),
    text(t.copy('headline'), 80, 360, 920, {
      fontFamily: font,
      fontSize: 118,
      fontWeight: 700,
      fill: t.shade('text', 'rgba(255,255,255,0.42)'),
      lineHeight: 1,
    }),
    text(t.copy('highlight'), 80, 500, 920, {
      fontFamily: font,
      fontSize: 150,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1,
      ...shadow(40, 0, t.shade('primary', 'rgba(255,111,168,0.85)')),
    }),
    rect(538, 760, 4, 440, linear(180, t.color('primary'), glowShade('rgba(255,111,168,0)')), {
      name: 'Beam',
    }),
    circle(540, 760, 18, t.color('text'), { ...shadow(40, 0, t.color('primary')) }),
    group(
      rect(880, 1150, 110, 110, linear(135, t.color('primary'), t.shade('primary', ROSE.magenta)), {
        name: 'Arrow tile',
        cornerRadius: 26,
        ...shadow(36, 0, glowShade('rgba(255,111,168,0.7)')),
      }),
      icon('arrow-up-right', 905, 1175, 60, t.color('text'), { strokeWidth: 2.4 }),
    ),
  ];
});

const playbooksSpec = {
  colors: {
    background: {
      value: ROSE.paper,
      hint: 'Page gradient; its pink shades fill the lower page',
    },
    primary: {
      value: ROSE.magenta,
      hint: 'Playbooks and the three feature tiles; its lighter shade starts the tile gradient and its dark shade tints their shadows',
    },
    surface: { value: ROSE.white, hint: 'The 3x Quicker label and the tile icons (at 92%)' },
    text: { value: ROSE.ink, hint: 'Brand name, Ship and the 3x Quicker pill' },
  },
  fonts: { heading: HEADING },
  copy: {
    brand: BRAND,
    title: { label: 'Title', value: 'Ship' },
    highlight: { label: 'Highlight', value: 'Playbooks' },
    badge: { label: 'Badge', value: '3x Quicker' },
  },
} as const satisfies ThemeSpec;

export const shipPlaybooks = themed(W, H, playbooksSpec, (t) => {
  const font = t.font('heading');
  const tile = (
    x: number,
    y: number,
    size: number,
    degrees: number,
    name: 'mic-vocal' | 'search' | 'rocket',
  ) =>
    rotateNodes(degrees, x + size / 2, y + size / 2, [
      rect(x, y, size, size, linear(160, t.shade('primary', '#ff9cc4'), t.color('primary')), {
        name: 'Feature tile',
        cornerRadius: 54,
        ...shadow(40, 18, t.shade('primary', 'rgba(120,10,60,0.3)')),
      }),
      icon(
        name,
        x + size * 0.25,
        y + size * 0.25,
        size * 0.5,
        t.shade('surface', 'rgba(255,255,255,0.92)'),
        { strokeWidth: 1.6 },
      ),
    ]);
  return [
    rect(
      0,
      0,
      W,
      H,
      linear(
        180,
        t.color('background'),
        t.shade('background', '#ffe0ee'),
        t.shade('background', '#ffc4dc'),
      ),
      { name: 'Background' },
    ),
    brandMark(t.copy('brand'), 0, 90, W, t.color('text'), font, 'center'),
    text(t.copy('title'), 0, 200, W, {
      fontFamily: font,
      fontSize: 140,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('highlight'), 0, 350, W, {
      fontFamily: font,
      fontSize: 132,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
    }),
    pill(t.copy('badge'), 420, 540, {
      fill: t.color('text'),
      color: t.color('surface'),
      fontSize: 32,
      fontFamily: font,
      width: 240,
    }),
    tile(50, 860, 320, -10, 'mic-vocal'),
    tile(380, 800, 320, 0, 'search'),
    tile(710, 860, 320, 10, 'rocket'),
  ];
});

const apartSpec = {
  colors: {
    background: {
      value: ROSE.wine,
      hint: 'Page gradient; its darker shade fills the lower page',
    },
    primary: {
      value: ROSE.pink,
      hint: 'Glow behind the headline and the orb with its glow; its pale shades fill the orb center',
    },
    text: {
      value: ROSE.white,
      hint: 'Stand apart., the brand name and the outline rings (at 40%)',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    headline: { label: 'Headline', value: 'Stand apart.' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const standApart = themed(W, H, apartSpec, (t) => {
  const font = t.font('heading');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', ROSE.night)), {
      name: 'Background',
    }),
    ellipse(
      160,
      380,
      760,
      760,
      pinkGlow((exact) => t.shade('primary', exact), 0.5, 0.14),
      { name: 'Glow' },
    ),
    [
      [900, 200, 110],
      [150, 560, 70],
      [890, 1010, 80],
      [240, 1150, 56],
    ].map(([cx = 0, cy = 0, r = 0]) =>
      circle(cx, cy, r, t.shade('text', 'rgba(0,0,0,0)'), {
        name: 'Ring',
        stroke: t.shade('text', 'rgba(255,255,255,0.4)'),
        strokeWidth: 3,
      }),
    ),
    text(t.copy('headline'), 0, 380, W, {
      fontFamily: font,
      fontSize: 104,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    circle(
      540,
      760,
      120,
      radial(t.shade('primary', ROSE.white), t.shade('primary', '#ffd0e4'), t.color('primary')),
      {
        name: 'Orb',
        ...shadow(90, 0, t.shade('primary', 'rgba(255,111,168,0.9)')),
      },
    ),
    brandMark(t.copy('brand'), 0, 1210, W, t.color('text'), font, 'center'),
  ];
});
