import { linear, radial } from '@/design';
import {
  circle,
  ellipse,
  POST_SIZE,
  path,
  poly,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const FLARE = {
  black: '#080605',
  coal: '#16120f',
  panel: '#221c17',
  orange: '#ff6a1a',
  amber: '#ffb648',
  white: '#ffffff',
  grey: '#a8a29e',
  violet: '#8b5cf6',
  lilac: '#c4b5fd',
};

export const HEAD = { label: 'Heading font', value: 'Sora' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const { width: W, height: H } = POST_SIZE;
export const CLEAR = 'rgba(0,0,0,0)';

export const glow = (cx: number, cy: number, radius: number, color: string, clear: string) =>
  circle(cx, cy, radius, radial(color, clear), { name: 'Glow' });

export const headline = (
  fontFamily: string,
  content: string,
  y: number,
  size: number,
  fill: string,
  weight = 700,
  x = 0,
  width: number = W,
  align: 'left' | 'center' = 'center',
) =>
  text(content, x, y, width, {
    fontFamily,
    fontSize: size,
    fontWeight: weight,
    fill,
    align,
    lineHeight: 1.05,
  });

export const gridFloor = (top: number, bottom: number, color: string, clear: string) => {
  const depth = bottom - top;
  const rows = Array.from({ length: 7 }, (_, index) => {
    const y = top + depth * (index / 6) ** 2;
    return `M 0 ${y.toFixed(1)} L ${W} ${y.toFixed(1)}`;
  });
  const rays = Array.from({ length: 9 }, (_, index) => {
    const step = index - 4;
    return `M ${540 + step * 60} ${top} L ${540 + step * 125} ${bottom}`;
  });
  return path([...rows, ...rays].join(' '), 0, 0, W, H, clear, POST_SIZE, {
    name: 'Grid floor',
    stroke: color,
    strokeWidth: 3,
  });
};

const chargedSpec = {
  colors: {
    background: { value: FLARE.black, hint: 'Page' },
    primary: { value: FLARE.amber, hint: '50%, the top of the bolt and next big move.' },
    secondary: {
      value: FLARE.orange,
      hint: 'Lower bolt; its translucent shades color the glow, the bolt fade and its halo',
    },
    text: { value: FLARE.white, hint: 'Charged and Powering your' },
  },
  fonts: { heading: HEAD },
  copy: {
    stat: { label: 'Stat', value: '50%' },
    label: { label: 'Stat label', value: 'Charged' },
    lead: { label: 'Tagline', value: 'Powering your' },
    highlight: { label: 'Tagline highlight', value: 'next big move.' },
  },
} as const satisfies ThemeSpec;

export const percentCharged = themed(W, H, chargedSpec, (t) => {
  const head = t.font('heading');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(
      640,
      650,
      420,
      t.shade('secondary', 'rgba(255,106,26,0.35)'),
      t.shade('background', CLEAR),
    ),
    headline(head, t.copy('stat'), 90, 180, t.color('primary'), 800, 80, 600, 'left'),
    headline(head, t.copy('label'), 290, 64, t.color('text'), 500, 84, 600, 'left'),
    poly(
      [
        [760, 140],
        [330, 720],
        [580, 720],
        [400, 1120],
        [940, 540],
        [680, 540],
        [930, 140],
      ],
      linear(
        160,
        t.color('primary'),
        t.color('secondary'),
        t.shade('secondary', 'rgba(255,106,26,0.25)'),
      ),
      { name: 'Bolt', ...shadow(60, 0, t.shade('secondary', 'rgba(255,140,40,0.6)')) },
    ),
    headline(head, t.copy('lead'), 1100, 54, t.color('text'), 500, 80, 800, 'left'),
    headline(head, t.copy('highlight'), 1170, 54, t.color('primary'), 700, 80, 800, 'left'),
  ];
});

const patternsSpec = {
  colors: {
    background: { value: FLARE.black, hint: 'Page' },
    primary: {
      value: FLARE.amber,
      hint: 'Build them, the front ring and its glow',
    },
    text: {
      value: FLARE.white,
      hint: "Don't follow patterns and the back rings; its shades color the grid and the brand name",
    },
  },
  fonts: { heading: HEAD },
  copy: {
    lead: { label: 'Headline', value: "Don't follow patterns," },
    highlight: { label: 'Highlight', value: 'Build them' },
    brand: { label: 'Brand', value: 'HALOGEN AI' },
  },
} as const satisfies ThemeSpec;

export const buildPatterns = themed(W, H, patternsSpec, (t) => {
  const grid = t.shade('text', 'rgba(255,255,255,0.05)');
  const clear = t.shade('background', CLEAR);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 12 }, (_, index) =>
      rect(index * 90 + 45, 0, 2, H, grid, { name: 'Grid line' }),
    ),
    Array.from({ length: 15 }, (_, index) =>
      rect(0, index * 90 + 45, W, 2, grid, { name: 'Grid line' }),
    ),
    glow(700, 330, 300, t.shade('primary', 'rgba(255,182,72,0.4)'), clear),
    ellipse(220, 360, 300, 300, clear, {
      name: 'Ring',
      stroke: t.shade('text', 'rgba(255,255,255,0.45)'),
      strokeWidth: 4,
    }),
    ellipse(390, 270, 300, 300, clear, {
      name: 'Ring',
      stroke: t.shade('text', 'rgba(255,255,255,0.75)'),
      strokeWidth: 4,
    }),
    ellipse(560, 180, 300, 300, t.shade('primary', 'rgba(255,182,72,0.12)'), {
      name: 'Ring',
      stroke: t.color('primary'),
      strokeWidth: 6,
      ...shadow(30, 0, t.shade('primary', 'rgba(255,182,72,0.8)')),
    }),
    headline(t.font('heading'), t.copy('lead'), 880, 58, t.color('text'), 500),
    headline(t.font('heading'), t.copy('highlight'), 960, 120, t.color('primary'), 800),
    text(t.copy('brand'), 0, 1230, W, {
      fontFamily: t.font('heading'),
      fontSize: 28,
      fontWeight: 700,
      fill: t.shade('text', FLARE.grey),
      align: 'center',
      letterSpacing: 6,
    }),
  ];
});

interface BeamCopy {
  lines: readonly [string, string, string];
  left: readonly [string, string];
  right: readonly [string, string];
}

const BANK: readonly (readonly [number, number])[] = [
  [0, 1050],
  [70, 990],
  [150, 1010],
  [220, 940],
  [310, 980],
  [350, 1060],
  [420, 1110],
  [430, 1200],
  [400, 1270],
  [430, 1350],
];

const cloudPaths = (mirror: boolean) => {
  const at = (x: number) => (mirror ? W - x : x).toFixed(0);
  const [first, ...rest] = BANK;
  const start = first ?? [0, 1050];
  const segments = rest.map(([x, y], index) => {
    const [px, py] = BANK[index] ?? start;
    return `Q ${at((px + x) / 2)} ${Math.min(py, y) - 50} ${at(x)} ${y}`;
  });
  const contour = [`M ${at(start[0])} ${start[1]}`, ...segments].join(' ');
  return { bank: `M ${at(0)} ${H} L ${contour.slice(2)} Z`, contour };
};

const solutionsBeam = (accent: string, rim: string, copy: BeamCopy) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: FLARE.black, hint: 'Page' },
        primary: {
          value: accent,
          hint: `${copy.lines[1]}, the light beam, the stats and the glowing cloud rims`,
        },
        text: {
          value: FLARE.white,
          hint: `${copy.lines[0]}, ${copy.lines[2]} and the stat labels`,
        },
        surface: { value: '#3b3531', hint: 'Cloud banks; its darker shade is their outer edge' },
      },
      fonts: { heading: HEAD, body: BODY },
      copy: {
        lines: { label: 'Headline line', value: [...copy.lines] },
        stats: { label: 'Stat', value: [copy.right[0], copy.left[0]] },
        labels: { label: 'Stat label', value: [copy.right[1], copy.left[1]] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const head = t.font('heading');
      const [first = '', second = '', third = ''] = t.list('lines');
      const [rightStat = '', leftStat = ''] = t.list('stats');
      const [rightLabel = '', leftLabel = ''] = t.list('labels');
      const rimColor = t.shade('primary', rim);
      const clear = t.shade('primary', CLEAR);
      const cloud = (mirror: boolean) => {
        const { bank, contour } = cloudPaths(mirror);
        return [
          path(
            bank,
            0,
            0,
            W,
            H,
            radial(t.color('surface'), t.shade('surface', '#0f0c0a')),
            POST_SIZE,
            { name: 'Cloud bank' },
          ),
          path(contour, 0, 0, W, H, clear, POST_SIZE, {
            name: 'Cloud rim',
            stroke: rimColor,
            strokeWidth: 8,
            ...shadow(40, 0, rimColor),
          }),
        ];
      };
      const statLabel = (label: string, x: number, y: number) =>
        text(label, x, y, 300, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 500,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.3,
        });
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        headline(head, first, 110, 104, t.color('text'), 700),
        headline(head, second, 220, 104, t.color('primary'), 700),
        headline(head, third, 330, 104, t.color('text'), 700),
        rect(440, 480, 200, 870, linear(180, clear, t.color('primary')), { name: 'Beam' }),
        headline(head, rightStat, 560, 90, t.color('primary'), 800, 680, 300),
        statLabel(rightLabel, 680, 670),
        headline(head, leftStat, 720, 90, t.color('primary'), 800, 100, 300),
        statLabel(leftLabel, 100, 830),
        cloud(false),
        cloud(true),
      ];
    },
  );

export const solutionsAmber = solutionsBeam(FLARE.amber, 'rgba(255,182,72,0.55)', {
  lines: ['AI Solutions', 'that carry you', 'Further'],
  left: ['6x', 'Tasks finished\nevery day'],
  right: ['12+', 'Hours saved\neach week'],
});

export const solutionsViolet = solutionsBeam(FLARE.lilac, 'rgba(139,92,246,0.6)', {
  lines: ['Lift your', 'Workflow to', 'New Heights'],
  left: ['9+', 'Industry\nawards'],
  right: ['#1', 'Rated by\nteams'],
});
