import { linear, radial } from '@/design';
import { circle, icon, poly, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, CLEAR, FLARE, glow, H, HEAD, headline, W } from './posts';

const blueprintSpec = {
  colors: {
    background: {
      value: FLARE.black,
      hint: 'Page and the check on the active tile; its warm shade is the bottom of the page gradient',
    },
    primary: {
      value: FLARE.amber,
      hint: 'Blueprint, the active tile border and the check badges; its orange shade colors the glow',
    },
    surface: {
      value: FLARE.panel,
      hint: 'Tool tiles and the idle check badges; its darker shade is the bottom of the tiles',
    },
    text: {
      value: FLARE.white,
      hint: 'The, for Growth and the tool icons; its shades color the idle tile borders and the body text',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    lead: { label: 'Title start', value: 'The' },
    highlight: { label: 'Title highlight', value: 'Blueprint' },
    title: { label: 'Title end', value: 'for Growth' },
    body: {
      label: 'Body',
      value: 'Turn hours of manual work into\nseconds of precision.\nReclaim your week.',
    },
  },
} as const satisfies ThemeSpec;

const TILES = [
  { x: 170, name: 'rocket' as const, active: false },
  { x: 430, name: 'mic' as const, active: true },
  { x: 690, name: 'navigation' as const, active: false },
];

export const blueprint = themed(W, H, blueprintSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#1a1209')), {
    name: 'Background',
  }),
  glow(540, 620, 460, t.shade('primary', 'rgba(255,106,26,0.22)'), t.shade('background', CLEAR)),
  text(t.copy('lead'), 0, 220, 365, {
    fontFamily: t.font('heading'),
    fontSize: 92,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'right',
  }),
  text(t.copy('highlight'), 390, 220, 600, {
    fontFamily: t.font('heading'),
    fontSize: 92,
    fontWeight: 700,
    fill: t.color('primary'),
  }),
  headline(t.font('heading'), t.copy('title'), 330, 92, t.color('text'), 400),
  TILES.map((tile) => [
    rect(tile.x, 560, 220, 220, linear(160, t.color('surface'), t.shade('surface', FLARE.coal)), {
      name: 'Tool tile',
      cornerRadius: 40,
      stroke: tile.active ? t.color('primary') : t.shade('text', 'rgba(255,255,255,0.25)'),
      strokeWidth: tile.active ? 5 : 2,
      ...shadow(40, 16, 'rgba(0,0,0,0.6)'),
    }),
    icon(tile.name, tile.x + 60, 620, 100, t.color('text'), { strokeWidth: 1.8 }),
    circle(tile.x + 20, 560, 30, tile.active ? t.color('primary') : t.color('surface'), {
      name: 'Check badge',
      stroke: t.color('primary'),
      strokeWidth: 3,
    }),
    icon('check', tile.x + 4, 544, 32, tile.active ? t.color('background') : t.color('primary'), {
      strokeWidth: 3,
    }),
  ]),
  text(t.copy('body'), 0, 900, W, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 400,
    fill: t.shade('text', FLARE.grey),
    align: 'center',
    lineHeight: 1.45,
  }),
]);

const powerSpec = {
  colors: {
    background: { value: FLARE.black, hint: 'Page, the sparkles in the orb and Learn More' },
    primary: {
      value: FLARE.amber,
      hint: 'Intelligent, the orb and the Learn More button; its shades color the glow, the orb core and its halo',
    },
    surface: {
      value: '#c9c2bb',
      hint: 'Metal cable, joint and claw arms; its darker shades are their shading',
    },
    text: {
      value: FLARE.white,
      hint: 'Built for, Power and Talk to Us; its faint shades color the button group',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    lead: { label: 'Headline', value: 'Built for' },
    highlight: { label: 'Highlight', value: 'Intelligent' },
    closing: { label: 'Headline end', value: 'Power' },
    primary: { label: 'Main button', value: 'Learn More' },
    secondary: { label: 'Second button', value: 'Talk to Us' },
  },
} as const satisfies ThemeSpec;

export const builtForPower = (height: number) => {
  const dy = (height - H) / 2;
  return themed(W, height, powerSpec, (t) => {
    const head = t.font('heading');
    const metal = (exact: string) => t.shade('surface', exact);
    const button = (label: string, x: number, width: number, fill: string) =>
      text(label, x, 1160 + dy, width, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 600,
        fill,
        align: 'center',
      });
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      glow(
        540,
        520 + dy,
        420,
        t.shade('primary', 'rgba(255,140,40,0.35)'),
        t.shade('background', CLEAR),
      ),
      rect(
        495,
        0,
        90,
        280 + dy,
        linear(90, metal('#57504a'), t.color('surface'), metal('#57504a')),
        {
          name: 'Cable',
        },
      ),
      circle(540, 300 + dy, 56, linear(90, metal('#6b635c'), metal('#e7e2dc'), metal('#6b635c')), {
        name: 'Joint',
      }),
      circle(
        540,
        520 + dy,
        150,
        radial(t.shade('primary', '#fff7e8'), t.color('primary'), t.shade('primary', FLARE.orange)),
        { name: 'Orb', ...shadow(80, 0, t.shade('primary', 'rgba(255,150,50,0.9)')) },
      ),
      icon('sparkles', 470, 450 + dy, 140, t.color('background'), { strokeWidth: 1.6 }),
      poly(
        [
          [505, 320 + dy],
          [390, 410 + dy],
          [360, 620 + dy],
          [400, 690 + dy],
          [420, 640 + dy],
          [410, 440 + dy],
          [520, 350 + dy],
        ],
        linear(90, metal('#4a443f'), metal('#d6d0ca')),
        { name: 'Claw arm' },
      ),
      poly(
        [
          [575, 320 + dy],
          [690, 410 + dy],
          [720, 620 + dy],
          [680, 690 + dy],
          [660, 640 + dy],
          [670, 440 + dy],
          [560, 350 + dy],
        ],
        linear(90, metal('#d6d0ca'), metal('#4a443f')),
        { name: 'Claw arm' },
      ),
      headline(head, t.copy('lead'), 760 + dy, 100, t.color('text'), 700),
      headline(head, t.copy('highlight'), 865 + dy, 100, t.color('primary'), 800),
      headline(head, t.copy('closing'), 970 + dy, 100, t.color('text'), 700),
      rect(290, 1130 + dy, 500, 96, t.shade('text', 'rgba(255,255,255,0.06)'), {
        name: 'Button group',
        cornerRadius: 48,
        stroke: t.shade('text', 'rgba(255,255,255,0.35)'),
        strokeWidth: 2,
      }),
      rect(298, 1138 + dy, 250, 80, t.color('primary'), {
        name: 'Primary button',
        cornerRadius: 40,
      }),
      button(t.copy('primary'), 298, 250, t.color('background')),
      button(t.copy('secondary'), 548, 236, t.color('text')),
    ];
  });
};
