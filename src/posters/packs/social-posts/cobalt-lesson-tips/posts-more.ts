import { linear } from '@/design';
import {
  circle,
  ellipse,
  type Nodes,
  poly,
  rect,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { H, HEADING, type TipPalette, W } from './posts';

const person = (cx: number, baseY: number, size: number, color: string): Nodes[] => [
  rect(cx - size * 0.3, baseY - size * 0.62, size * 0.6, size * 0.62, color, {
    cornerRadius: size * 0.22,
    name: 'Person body',
  }),
  circle(cx, baseY - size * 0.82, size * 0.19, color),
];

const CROWD_ROWS = [
  { y: 600, size: 70, count: 12, span: 780 },
  { y: 680, size: 86, count: 10, span: 740 },
  { y: 775, size: 104, count: 8, span: 700 },
  { y: 885, size: 124, count: 6, span: 620 },
];

export const targeting = (p: TipPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.paper, hint: 'Page' },
        text: {
          value: p.ink,
          hint: 'First line, closing line, the crowd and the star; its translucent shade is the crowd shadow',
        },
        primary: { value: p.brand, hint: 'Title, closing word and the highlighted people' },
      },
      fonts: { heading: HEADING },
      copy: {
        lead: { label: 'First line', value: "You're" },
        title: { label: 'Title', value: 'TARGETING' },
        closingLead: { label: 'Closing line', value: 'a massive' },
        closing: { label: 'Closing word', value: 'MARKET.' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const line = (
        content: string,
        x: number,
        y: number,
        width: number,
        size: number,
        weight: number,
        fill: string,
      ) =>
        text(content, x, y, width, {
          fontFamily: t.font('heading'),
          fontSize: size,
          fontWeight: weight,
          fill,
        });
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        star(5, 900, 80, 100, t.color('text'), { innerRatio: 0.45 }),
        line(t.copy('lead'), 110, 160, 600, 52, 500, t.color('text')),
        line(t.copy('title'), 110, 226, 900, 104, 800, t.color('primary')),
        ellipse(120, 880, 840, 70, t.shade('text', 'rgba(0,0,0,0.07)'), {
          name: 'Crowd shadow',
        }),
        CROWD_ROWS.map((row, rowIndex) => {
          const step = row.span / (row.count - 1);
          return Array.from({ length: row.count }, (_, index) =>
            person(
              540 - row.span / 2 + index * step + (((index + rowIndex) * 37) % 30) - 15,
              row.y,
              row.size,
              (index * 3 + rowIndex) % 7 === 0 ? t.color('primary') : t.color('text'),
            ),
          );
        }),
        line(t.copy('closingLead'), 520, 990, 500, 46, 500, t.color('text')),
        line(t.copy('closing'), 520, 1046, 520, 104, 800, t.color('primary')),
      ];
    },
  );

const jagged = (x: number, depth: number, flip: number): [number, number][] =>
  Array.from({ length: 19 }, (_, index) => [
    x + flip * (((index * 41) % depth) + 6),
    (index * H) / 18,
  ]);

export const turnSuccess = (p: TipPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page, the wall edges and the bullseye' },
        primary: {
          value: p.brand,
          hint: 'Target rings, dart barrel and top flight, the kicker and the top star',
        },
        surface: {
          value: p.paper,
          hint: 'Light target rings, the lower flight, the headline and the bottom star; its translucent shade is the motion lines',
        },
        secondary: {
          value: '#9a9ca6',
          hint: 'Stone wall; its shades color the wall shadows, stone chips and the dart shaft and tip',
        },
      },
      fonts: { heading: HEADING },
      copy: {
        kicker: { label: 'Kicker', value: "WE'RE HERE TO" },
        headline: { label: 'Headline', value: 'TURN\nYOUR\nBUSINESS\nINTO\nA SUCCESS!' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      rect(
        690,
        0,
        250,
        H,
        linear(
          90,
          t.shade('secondary', '#2c2d33'),
          t.color('secondary'),
          t.shade('secondary', '#3b3d45'),
        ),
        { name: 'Stone wall' },
      ),
      poly([[690, 0], ...jagged(690, 34, 1), [690, H]], t.color('background'), {
        name: 'Wall edge',
      }),
      poly([[940, 0], ...jagged(940, 34, -1), [940, H]], t.color('background'), {
        name: 'Wall edge',
      }),
      [0, 1, 2, 3, 4, 5].map((index) =>
        rect(
          740 + ((index * 53) % 120),
          120 + index * 200,
          46,
          22,
          t.shade('secondary', 'rgba(0,0,0,0.28)'),
          { cornerRadius: 6, rotation: (index * 31) % 50, name: 'Stone chip' },
        ),
      ),
      circle(780, 560, 132, t.color('surface')),
      circle(780, 560, 102, t.color('primary')),
      circle(780, 560, 72, t.color('surface')),
      circle(780, 560, 42, t.color('primary')),
      circle(780, 560, 12, t.color('background')),
      [0, 1, 2].map((index) =>
        rect(
          130 + index * 30,
          500 + index * 50,
          130 - index * 30,
          6,
          t.shade('surface', 'rgba(255,255,255,0.3)'),
          { cornerRadius: 3, name: 'Motion line' },
        ),
      ),
      rect(330, 552, 420, 16, t.shade('secondary', '#e5e7eb'), {
        cornerRadius: 8,
        name: 'Dart shaft',
      }),
      rect(560, 542, 130, 36, t.color('primary'), { cornerRadius: 12, name: 'Dart barrel' }),
      poly(
        [
          [748, 550],
          [782, 560],
          [748, 570],
        ],
        t.shade('secondary', '#d1d5db'),
        { name: 'Dart tip' },
      ),
      poly(
        [
          [360, 560],
          [270, 490],
          [300, 560],
        ],
        t.color('primary'),
        { name: 'Dart flight' },
      ),
      poly(
        [
          [360, 560],
          [270, 630],
          [300, 560],
        ],
        t.color('surface'),
        { name: 'Dart flight' },
      ),
      text(t.copy('kicker'), 80, 710, 560, {
        fontFamily: t.font('heading'),
        fontSize: 34,
        fontWeight: 800,
        fill: t.color('primary'),
        letterSpacing: 2,
      }),
      text(t.copy('headline'), 80, 770, 580, {
        fontFamily: t.font('heading'),
        fontSize: 72,
        fontWeight: 800,
        fill: t.color('surface'),
        lineHeight: 1.08,
      }),
      star(5, 70, 70, 84, t.color('primary'), { innerRatio: 0.45 }),
      star(5, 440, 1210, 76, t.color('surface'), { innerRatio: 0.45 }),
    ],
  );
