import { circle, rating, rect, rotateNodes, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, fade, fonts, glow, HEADING, K, SH, SW } from './theme';

type Tone = 'lime' | 'white' | 'dark';

const TILES: readonly { x: number; y: number; width: number; height: number; tone: Tone }[] = [
  { x: 860, y: 260, width: 340, height: 320, tone: 'lime' },
  { x: 860, y: 620, width: 340, height: 320, tone: 'dark' },
  { x: 1240, y: 100, width: 580, height: 300, tone: 'dark' },
  { x: 1240, y: 440, width: 580, height: 260, tone: 'white' },
];

export const figuresSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page and the text on the lime and white tiles' },
      surface: { value: K.panel, hint: 'Dark figure tiles and the rating tile' },
      primary: { value: K.lime, hint: 'First figure tile, the rating stars and the green wash' },
      text: {
        value: K.white,
        hint: 'Title, the white tile, the figures on dark tiles and the tile outlines; its grey shade colors the paragraph and the dark tile labels',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Behind\nEvery\nFigure' },
      paragraph: {
        label: 'Paragraph',
        value:
          'Every number here is a team that shipped faster, spent less and trusted the data behind its decisions.',
      },
      values: { label: 'Figure', value: ['50+', '8x', '20x', '2027'] },
      labels: {
        label: 'Figure label',
        value: ['Native features', 'More layouts', 'Less time on reports', 'Global launch year'],
      },
      score: { label: 'Score', value: '4.8' },
      scoreLabel: { label: 'Score label', value: 'Average review score' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const muted = t.shade('text', K.muted);
    const line = t.shade('text', K.line);
    const labels = t.list('labels');
    const tileFill = { lime: t.color('primary'), white: t.color('text'), dark: t.color('surface') };
    return [
      backdrop(t, 220),
      head(t.copy('title'), 100, 180, 640, 120, t.color('text')),
      body(t.copy('paragraph'), 100, 620, 600, 32, muted),
      t.list('values').map((value, index) => {
        const tile = TILES[index] ?? { x: 0, y: 0, width: 0, height: 0, tone: 'dark' };
        const ink = tile.tone === 'dark' ? t.color('text') : t.color('background');
        return [
          rect(tile.x, tile.y, tile.width, tile.height, tileFill[tile.tone], {
            name: 'Figure tile',
            cornerRadius: 28,
            stroke: tile.tone === 'dark' ? line : K.line,
            strokeWidth: tile.tone === 'dark' ? 2 : 0,
          }),
          head(value, tile.x + 40, tile.y + 36, tile.width - 80, 96, ink),
          body(
            labels[index] ?? '',
            tile.x + 40,
            tile.y + 150,
            tile.width - 80,
            28,
            tile.tone === 'dark' ? muted : t.color('background'),
            { fontWeight: 600 },
          ),
        ];
      }),
      rect(1240, 740, 580, 200, t.color('surface'), {
        name: 'Rating tile',
        cornerRadius: 28,
        stroke: line,
        strokeWidth: 2,
      }),
      head(t.copy('score'), 1280, 780, 200, 96, t.color('text')),
      rating(1480, 812, 52, 5, t.color('primary')),
      body(t.copy('scoreLabel'), 1480, 876, 320, 26, muted),
    ];
  },
);

export const revenueSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page' },
      primary: { value: K.lime, hint: 'Last figure, Million, the glow and the green wash' },
      text: {
        value: K.white,
        hint: 'Title, the first two figures, the year dots and rules; its grey shade colors the paragraph and the years',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Revenue\nFocus' },
      paragraph: {
        label: 'Paragraph',
        value:
          'We moved from growth at any cost to efficient, durable revenue: fewer pilots, bigger contracts and expansion inside every account.',
      },
      years: { label: 'Year', value: ['2025', '2026', '2027'] },
      figures: { label: 'Figure line', value: ['20', '27', '45'] },
      unit: { label: 'Unit', value: 'Million' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const [first = '', second = '', third = ''] = t.list('figures');
    return [
      backdrop(t, 160),
      glow(t, 1360, 800, 280, 0.35),
      head(t.copy('title'), 100, 140, 700, 120, t.color('text')),
      body(t.copy('paragraph'), 100, 450, 640, 32, t.shade('text', K.muted)),
      t.list('years').map((year, index) => [
        body(year, 860, 200 + index * 250, 160, 30, t.shade('text', K.muted), {
          fontWeight: 600,
        }),
        rect(860, 250 + index * 250, 220, 3, t.shade('text', K.line), { name: 'Year rule' }),
        circle(1080, 251 + index * 250, 9, t.color('text')),
      ]),
      head(first, 1140, 60, 600, 280, t.color('text'), { lineHeight: 1 }),
      head(second, 1140, 310, 600, 280, fade(t, 'rgba(255,255,255,0.9)'), { lineHeight: 1 }),
      head(third, 1140, 560, 600, 280, t.color('primary'), { lineHeight: 1 }),
      head(t.copy('unit'), 1490, 760, 400, 72, t.color('primary')),
    ];
  },
);

export const gaugeSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page' },
      primary: { value: K.lime, hint: 'Center gauge tick, the glow and the green wash' },
      text: {
        value: K.white,
        hint: 'Main figure, the side figures and the other ticks; its grey shade colors the caption',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      figures: { label: 'Figure', value: ['91%', '92%', '93%'] },
      caption: {
        label: 'Caption',
        value: 'Average time saved by automating legacy workflows\nwith Kestrel agents.',
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const [low = '', main = '', high = ''] = t.list('figures');
    const faint = t.shade('text', 'rgba(255,255,255,0.22)');
    return [
      backdrop(t),
      glow(t, 960, 640, 420, 0.25),
      Array.from({ length: 7 }, (_, index) => {
        const angle = -45 + index * 15;
        const center = angle === 0;
        return rotateNodes(angle, 960, 940, [
          rect(
            950,
            340,
            20,
            center ? 120 : 90,
            center ? t.color('primary') : t.shade('text', 'rgba(255,255,255,0.5)'),
            { name: 'Tick', cornerRadius: 10 },
          ),
        ]);
      }),
      head(low, 180, 560, 400, 140, faint),
      head(main, 0, 500, SW, 230, t.color('text'), { align: 'center' }),
      head(high, 1440, 560, 400, 140, faint, { align: 'right' }),
      body(t.copy('caption'), 0, 820, SW, 36, t.shade('text', K.muted), { align: 'center' }),
    ];
  },
);

export const legacySlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: K.black, hint: 'Page' },
      primary: { value: K.lime, hint: 'Big figure, the glow and the green wash' },
      text: {
        value: K.white,
        hint: 'Figure label, the title and the closing paragraph; its grey shade colors the first paragraph',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      figure: { label: 'Figure', value: '$120B+' },
      figureLabel: { label: 'Figure label', value: 'Lost to downtime every year' },
      title: { label: 'Title', value: 'Legacy\nSystems' },
      paragraph: {
        label: 'Paragraph',
        value:
          'Old maintenance is reactive: teams firefight, outages compound and costs climb quarter after quarter.',
      },
      closing: {
        label: 'Closing paragraph',
        value:
          'Kestrel turns that cycle around, predicting failures and fixing them before customers notice.',
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    return [
      backdrop(t, 200),
      glow(t, 520, 540, 420, 0.3),
      head(t.copy('figure'), 100, 400, 900, 200, t.color('primary')),
      body(t.copy('figureLabel'), 110, 640, 800, 36, t.color('text'), { fontWeight: 600 }),
      head(t.copy('title'), 1120, 120, 700, 110, t.color('text')),
      body(t.copy('paragraph'), 1120, 400, 700, 30, t.shade('text', K.muted)),
      body(t.copy('closing'), 1120, 620, 700, 30, t.color('text'), { fontWeight: 600 }),
    ];
  },
);
