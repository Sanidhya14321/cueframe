import { linear } from '@/design';
import { circle, icon, photo, rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, darkBg, EV, fonts, GRAY, glass, HEADING, headings, lightBg, SH, SW } from './theme';

export const coverSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.forest, hint: 'Page and the inner disc behind the title' },
      primary: {
        value: EV.mint,
        hint: 'The three rings around the title and the subtitle under it',
      },
      text: { value: EV.white, hint: 'Title; its translucent shade colors the website line' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      website: { label: 'Website', value: 'fernbrook.ai' },
      title: { label: 'Title', value: 'AI Platform\nPitch Deck' },
      subtitle: {
        label: 'Subtitle',
        value: 'Powering the next generation of\nself-running operations',
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    return [
      darkBg(t),
      circle(960, 540, 510, t.shade('primary', 'rgba(95,211,168,0.06)'), {
        stroke: t.shade('primary', EV.emerald),
        strokeWidth: 26,
      }),
      circle(960, 540, 430, t.shade('primary', 'rgba(0,0,0,0)'), {
        stroke: t.shade('primary', 'rgba(95,211,168,0.3)'),
        strokeWidth: 4,
      }),
      circle(960, 540, 360, t.color('background'), {
        stroke: t.shade('primary', 'rgba(95,211,168,0.22)'),
        strokeWidth: 3,
      }),
      body(t.copy('website'), 0, 330, SW, 28, t.shade('text', EV.soft), {
        align: 'center',
        letterSpacing: 2,
      }),
      head(t.copy('title'), 0, 390, SW, 100, t.color('text'), {
        align: 'center',
        fontWeight: 800,
      }),
      body(t.copy('subtitle'), 0, 640, SW, 30, t.color('primary'), { align: 'center' }),
    ];
  },
);

export const contentsSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.white, hint: 'Page; its mint shade colors the lower corner' },
      primary: { value: EV.emerald, hint: 'Chapter numbers and the dot grid' },
      text: { value: EV.ink, hint: 'Title and chapter names' },
    },
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: 'Table of\nContents' },
      chapters: {
        label: 'Chapter',
        value: ['OVERVIEW', 'PLATFORM', 'OUR TEAM', 'PRICING', 'METRICS', 'ROADMAP'],
      },
      numbers: { label: 'Chapter number', value: ['01', '02', '03', '04', '05', '06'] },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const head = headings(t);
    const numbers = t.list('numbers');
    return [
      lightBg(t),
      photo('workspace-1', 140, 140, 560, 440, { cornerRadius: 24, ...GRAY }),
      head(t.copy('title'), 140, 660, 600, 96, t.color('text'), { fontWeight: 600 }),
      t.list('chapters').map((chapter, index) => [
        head(chapter, 1000, 190 + index * 120, 560, 54, t.color('text'), { fontWeight: 500 }),
        head(numbers[index] ?? '', 1580, 190 + index * 120, 200, 54, t.color('primary'), {
          align: 'right',
        }),
      ]),
    ];
  },
);

const welcomeSpec = {
  colors: {
    background: { value: EV.forest, hint: 'Page' },
    primary: { value: EV.mint, hint: 'Glass tiles, the product name and the short rule' },
    text: {
      value: EV.white,
      hint: 'Welcome to, the tile labels, tile outlines and the wordmark; its translucent shade colors the intro',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    tiles: {
      label: 'Tile label',
      value: ['Automation', 'Insights', 'Security', 'Workflows', 'Forecasts', 'Support'],
    },
    greeting: { label: 'Greeting', value: 'Welcome to' },
    title: { label: 'Product name', value: 'Fernbrook AI' },
    intro: {
      label: 'Intro',
      value:
        'Fernbrook replaces repetitive busywork with an intelligent layer that forecasts demand, routes tasks and keeps every team in sync. Built for scale, tuned for people.',
    },
    wordmark: { label: 'Wordmark', value: 'FERNBROOK' },
  },
} as const satisfies ThemeSpec;

export const welcomeSlide = themed(SW, SH, welcomeSpec, (t) => {
  const { head, body } = fonts(t);
  const tiles = t.list('tiles');
  const tile = (index: number, opacity: number) => {
    const column = index % 3;
    const x = 140 + column * 240;
    const top = 150 + Math.floor(index / 3) * 290 + (column === 1 ? -50 : 0);
    return [
      rect(
        x,
        top,
        210,
        250,
        linear(
          180,
          t.shade('primary', 'rgba(95,211,168,0.55)'),
          t.shade('primary', 'rgba(47,158,124,0.12)'),
        ),
        {
          name: 'Glass tile',
          cornerRadius: 18,
          stroke: t.shade('text', 'rgba(255,255,255,0.25)'),
          strokeWidth: 2,
          opacity,
        },
      ),
      index < 6
        ? body(tiles[index] ?? '', x + 20, top + 20, 180, 22, t.color('text'), {
            opacity: opacity * 0.9,
          })
        : [],
    ];
  };
  return [
    darkBg(t),
    [0, 1, 2, 3, 4, 5].map((index) => tile(index, 1)),
    [6, 7, 8].map((index) => tile(index, 0.22)),
    head(t.copy('greeting'), 1000, 190, 800, 80, t.color('text')),
    head(t.copy('title'), 1000, 280, 800, 80, t.color('primary')),
    body(t.copy('intro'), 1000, 420, 780, 30, t.shade('text', EV.soft)),
    rect(1000, 870, 60, 6, t.color('primary'), { name: 'Rule', cornerRadius: 3 }),
    head(t.copy('wordmark'), 1000, 900, 600, 36, t.color('text'), { letterSpacing: 6 }),
  ];
});

export const quoteSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.white, hint: 'Page; its mint shade colors the lower corner' },
      primary: {
        value: EV.emerald,
        hint: 'The highlighted quote line and the dot grid; its light shade colors the big quote mark',
      },
      text: { value: EV.ink, hint: 'The rest of the quote' },
    },
    fonts: { heading: HEADING },
    copy: {
      mark: { label: 'Quote mark', value: '“' },
      opening: { label: 'Quote opening', value: 'Artificial\nintelligence' },
      highlight: { label: 'Highlighted line', value: 'is a co-pilot,' },
      closing: { label: 'Quote ending', value: 'not a stand-in.' },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const head = headings(t);
    return [
      lightBg(t),
      head(t.copy('mark'), 380, 170, 300, 420, t.shade('primary', EV.mint), {
        fontWeight: 800,
        lineHeight: 1,
      }),
      head(t.copy('opening'), 680, 250, 1100, 104, t.color('text'), {
        fontWeight: 500,
        lineHeight: 1.18,
      }),
      head(t.copy('highlight'), 680, 495, 1100, 104, t.color('primary'), { fontWeight: 600 }),
      head(t.copy('closing'), 680, 618, 1100, 104, t.color('text'), { fontWeight: 500 }),
    ];
  },
);

const PILLAR_ICONS = ['cpu', 'share-2', 'shield-check'] as const;

export const empoweringSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: { value: EV.forest, hint: 'Page' },
      primary: { value: EV.mint, hint: 'Digital Transformation and the glass cards' },
      text: {
        value: EV.white,
        hint: 'Title, icons and card titles; its translucent shades color the intro, card text, icon chips and card outlines',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Empowering Teams' },
      subtitle: { label: 'Highlighted title', value: 'Digital Transformation' },
      intro: {
        label: 'Intro',
        value:
          'Partnering with you to navigate a shifting tech\nlandscape with solutions that scale.',
      },
      pillars: {
        label: 'Card title',
        value: ['Edge Devices', 'Core Platform', 'Managed Ops'],
      },
      details: {
        label: 'Card text',
        value: [
          'Procurement and lifecycle care for every device.',
          'Cuts cycle times by 40% with live orchestration.',
          'Round-the-clock monitoring and self-healing.',
        ],
      },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const details = t.list('details');
    return [
      darkBg(t),
      head(t.copy('title'), 140, 120, 900, 64, t.color('text')),
      head(t.copy('subtitle'), 140, 200, 900, 64, t.color('primary'), { fontWeight: 500 }),
      body(t.copy('intro'), 140, 310, 900, 28, t.shade('text', EV.soft)),
      t.list('pillars').map((pillar, index) => {
        const x = 140 + index * 310;
        return [
          glass(t, x, 480, 280, 400, 22),
          rect(x + 30, 510, 76, 76, t.shade('text', 'rgba(255,255,255,0.14)'), {
            name: 'Icon chip',
            cornerRadius: 18,
          }),
          icon(PILLAR_ICONS[index] ?? 'cpu', x + 48, 528, 40, t.color('text'), { strokeWidth: 2 }),
          head(pillar, x + 30, 680, 240, 30, t.color('text')),
          body(details[index] ?? '', x + 30, 730, 230, 22, t.shade('text', EV.soft)),
        ];
      }),
      photo('laptop-analytics', 1100, 120, 680, 760, { cornerRadius: 28, ...GRAY }),
    ];
  },
);
