import { linear, radial } from '@/design';
import {
  circle,
  ellipse,
  type Nodes,
  POST_SIZE,
  path,
  poly,
  rect,
  rotateNodes,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface TipPalette {
  brand: string;
  ink: string;
  paper: string;
  steel: string;
}

export const COBALT: TipPalette = {
  brand: '#2f6bff',
  ink: '#0b0d12',
  paper: '#ffffff',
  steel: '#dfe4ee',
};

export const CRIMSON: TipPalette = {
  brand: '#ff3b5c',
  ink: '#170a0e',
  paper: '#fff8f5',
  steel: '#f1e4e4',
};

export const HEADING = { label: 'Heading font', value: 'Montserrat' } as const;
export const { width: W, height: H } = POST_SIZE;

const ladder = (x: number, top: number, bottom: number, rail: string, rung: string): Nodes[] => [
  rect(x, top, 24, bottom - top, rail, { cornerRadius: 8, name: 'Ladder rail' }),
  rect(x + 132, top, 24, bottom - top, rail, { cornerRadius: 8, name: 'Ladder rail' }),
  Array.from({ length: Math.floor((bottom - top - 40) / 72) }, (_, index) =>
    rect(x + 24, top + 40 + index * 72, 108, 16, rung, { cornerRadius: 4, name: 'Ladder rung' }),
  ),
];

export const sellProblem = (p: TipPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.brand, hint: 'Page' },
        primary: {
          value: p.ink,
          hint: 'Punchline, the hole and the top left star; its translucent shade is the ladder shadow',
        },
        surface: {
          value: p.paper,
          hint: 'Headline and the right star; its translucent shade is the hole rim',
        },
        secondary: { value: p.steel, hint: 'Ladder rails; its darker shade colors the rungs' },
      },
      fonts: { heading: HEADING },
      copy: {
        headline: { label: 'Headline', value: 'SELL THE\nPROBLEM YOU\nSOLVE,' },
        punchline: { label: 'Punchline', value: 'NOT THE\nPRODUCT.' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const ladderShadow = t.shade('primary', 'rgba(0,0,0,0.16)');
      const headline = (content: string, y: number, fill: string) =>
        text(content, 80, y, 900, {
          fontFamily: t.font('heading'),
          fontSize: 78,
          fontWeight: 800,
          fill,
          lineHeight: 1.05,
        });
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        star(5, 60, 60, 90, t.color('primary'), { innerRatio: 0.45 }),
        star(5, 930, 250, 70, t.color('surface'), { innerRatio: 0.45 }),
        rotateNodes(-72, 640, 640, ladder(562, 160, 640, ladderShadow, ladderShadow)),
        ellipse(410, 580, 460, 130, t.color('primary'), { name: 'Hole' }),
        ellipse(440, 596, 400, 90, t.shade('surface', 'rgba(255,255,255,0.08)'), {
          name: 'Hole rim',
        }),
        rotateNodes(
          14,
          640,
          690,
          ladder(562, 140, 690, t.color('secondary'), t.shade('secondary', '#a8b0bf')),
        ),
        path(
          'M0 0 C0 86 460 86 460 0 Z',
          410,
          645,
          460,
          65,
          t.color('primary'),
          { width: 460, height: 65 },
          { name: 'Hole lip' },
        ),
        headline(t.copy('headline'), 850, t.color('surface')),
        headline(t.copy('punchline'), 1100, t.color('primary')),
      ];
    },
  );

const TOOL_LINES = [
  'Site stats: traffic + sales',
  'Search console: SEO health',
  'Design editor: quick visuals',
  'Notes app: plans and ideas',
  'Ads manager: paid social',
  'Writing helper: captions',
  'Keyword finder: research',
  'Mail tool: weekly newsletter',
];

export const toDoTools = (p: TipPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.paper, hint: 'Page' },
        primary: {
          value: p.brand,
          hint: 'Backdrop words, the highlight, the bullets and the pen cap',
        },
        surface: { value: '#ffffff', hint: 'Notebook page' },
        secondary: { value: p.steel, hint: 'Spiral holes' },
        text: {
          value: p.ink,
          hint: 'Title, spiral rings, the pen and the corner star; its lighter shade colors the tool list',
        },
      },
      fonts: {
        display: { label: 'Backdrop font', value: 'Anton' },
        heading: HEADING,
      },
      copy: {
        backdrop: { label: 'Backdrop words', value: 'TO DO\nTO DO\nTO DO' },
        title: { label: 'Title', value: 'Essential' },
        highlight: { label: 'Highlight', value: 'Growth Tools' },
        tools: { label: 'Tool', value: TOOL_LINES },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('backdrop'), 0, 60, W, {
        fontFamily: t.font('display'),
        fontSize: 400,
        fontWeight: 400,
        fill: t.color('primary'),
        align: 'center',
        lineHeight: 0.98,
      }),
      rotateNodes(-8, 540, 720, [
        rect(250, 330, 600, 780, t.color('surface'), {
          cornerRadius: 18,
          name: 'Notebook',
          shadow: { color: 'rgba(0,0,0,0.3)', blur: 40, offsetX: 0, offsetY: 18 },
        }),
        Array.from({ length: 9 }, (_, index) => [
          circle(300 + index * 62, 360, 14, t.color('secondary')),
          rect(296 + index * 62, 312, 8, 50, t.color('text'), {
            cornerRadius: 4,
            name: 'Spiral ring',
          }),
        ]),
        text(t.copy('title'), 300, 420, 520, {
          fontFamily: t.font('heading'),
          fontSize: 52,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        text(t.copy('highlight'), 300, 482, 520, {
          fontFamily: t.font('heading'),
          fontSize: 52,
          fontWeight: 800,
          fill: t.color('primary'),
        }),
        t.list('tools').map((item, index) => [
          circle(310, 597 + index * 58, 6, t.color('primary')),
          text(item, 330, 582 + index * 58, 500, {
            fontFamily: t.font('heading'),
            fontSize: 25,
            fontWeight: 500,
            fill: t.shade('text', '#374151'),
          }),
        ]),
        rect(790, 360, 24, 300, t.color('text'), { cornerRadius: 12, rotation: 8, name: 'Pen' }),
        rect(790, 360, 24, 60, t.color('primary'), {
          cornerRadius: 12,
          rotation: 8,
          name: 'Pen cap',
        }),
      ]),
      star(5, 60, 1190, 100, t.color('text'), { innerRatio: 0.45 }),
    ],
  );

const FACETS: [number, number][][] = [
  [
    [420, 620],
    [560, 580],
    [500, 720],
  ],
  [
    [560, 580],
    [680, 660],
    [600, 760],
  ],
  [
    [380, 760],
    [500, 720],
    [470, 880],
  ],
  [
    [600, 760],
    [700, 800],
    [620, 900],
  ],
];

const SHARDS = Array.from({ length: 52 }, (_, index) => {
  const angle = (index * 137.5 * Math.PI) / 180;
  const distance = 170 + ((index * 53) % 220);
  return {
    x: 550 + Math.cos(angle) * distance,
    y: 730 + Math.sin(angle) * distance * 0.78,
    size: 22 + ((index * 7) % 26),
    rotation: (index * 29) % 90,
  };
});

export const lessIsMore = (p: TipPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page' },
        surface: { value: p.paper, hint: 'Studio name, first and last lines and the star' },
        primary: { value: p.brand, hint: 'Highlight and the coloured shards' },
        secondary: {
          value: '#f4f4f5',
          hint: 'Statue and the light shards; its shades color the statue shading and facets',
        },
      },
      fonts: { heading: HEADING },
      copy: {
        studio: { label: 'Studio name', value: 'Brightline Studio' },
        lead: { label: 'First line', value: 'WHY' },
        highlight: { label: 'Highlight', value: 'LESS IS MORE' },
        closing: { label: 'Last line', value: 'IN DESIGN?' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const line = (content: string, y: number, fill: string) =>
        text(content, 80, y, 900, {
          fontFamily: t.font('heading'),
          fontSize: 84,
          fontWeight: 800,
          fill,
        });
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('studio'), 80, 90, 600, {
          fontFamily: t.font('heading'),
          fontSize: 34,
          fontWeight: 500,
          fill: t.color('surface'),
        }),
        line(t.copy('lead'), 150, t.color('surface')),
        line(t.copy('highlight'), 245, t.color('primary')),
        line(t.copy('closing'), 340, t.color('surface')),
        star(5, 900, 80, 100, t.color('surface'), { innerRatio: 0.45 }),
        poly(
          [
            [470, 880],
            [610, 880],
            [646, 1100],
            [434, 1100],
          ],
          linear(180, t.shade('secondary', '#c4c4cc'), t.shade('secondary', '#8e8e98')),
          { name: 'Neck' },
        ),
        path(
          'M0 330 C30 150 170 50 370 50 C570 50 710 150 740 330 Z',
          170,
          1020,
          740,
          330,
          linear(180, t.color('secondary'), t.shade('secondary', '#9ca3af')),
          { width: 740, height: 330 },
          { name: 'Shoulders' },
        ),
        circle(
          540,
          750,
          190,
          radial(t.shade('secondary', '#ffffff'), t.shade('secondary', '#b4b4bb')),
          {
            name: 'Head',
          },
        ),
        FACETS.map((points, index) =>
          poly(
            points,
            index % 2 === 0
              ? t.shade('secondary', 'rgba(0,0,0,0.07)')
              : t.shade('secondary', 'rgba(255,255,255,0.35)'),
            { name: 'Facet' },
          ),
        ),
        SHARDS.map((shard, index) =>
          rect(
            shard.x,
            shard.y,
            shard.size,
            shard.size * 0.8,
            index % 9 === 0 ? t.color('primary') : t.color('secondary'),
            {
              rotation: shard.rotation,
              name: 'Shard',
              shadow: { color: 'rgba(0,0,0,0.35)', blur: 8, offsetX: 0, offsetY: 4 },
            },
          ),
        ),
      ];
    },
  );
