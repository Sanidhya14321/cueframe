import { linear } from '@/design';
import { dots, rect, STORY_SIZE, type ThemeSpec, text, themed } from '../../../kit';
import {
  H,
  HEADING_FONT,
  HEART,
  MONO_FONT,
  PIXEL_FONT,
  PX,
  siteFooter,
  sprite,
  W,
  WEBSITE,
} from './pixel';

const statsSpec = {
  colors: {
    background: { value: PX.night, hint: 'Page' },
    primary: {
      value: PX.sun,
      hint: 'Top of the GROWTH gradient; its orange shade colors the bottom',
    },
    accent: { value: PX.pink, hint: 'Outline around GROWTH' },
    secondary: { value: PX.mint, hint: 'Stat labels' },
    text: {
      value: PX.white,
      hint: 'STATS and the stat values; its tints color the dot grid and the website',
    },
  },
  fonts: { heading: HEADING_FONT, pixel: PIXEL_FONT, mono: MONO_FONT },
  copy: {
    title: { label: 'Title', value: 'GROWTH' },
    subtitle: { label: 'Subtitle', value: 'STATS' },
    labels: { label: 'Stat label', value: ['ROI', 'CAC', 'CTR', 'LTV', 'NPS'] },
    values: { label: 'Stat value', value: ['240%', '$18', '4.2%', '$960', '72'] },
    site: WEBSITE,
  },
} as const satisfies ThemeSpec;

export const growthStats = themed(W, H, statsSpec, (t) => {
  const mono = t.font('mono');
  const values = t.list('values');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    dots(60, 60, 18, 23, 56, t.shade('text', 'rgba(201,168,255,0.12)'), 3),
    text(t.copy('title'), 0, 110, W, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 400,
      fill: linear(180, t.color('primary'), t.shade('primary', PX.orange)),
      stroke: t.color('accent'),
      strokeWidth: 4,
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('subtitle'), 0, 310, W, {
      fontFamily: t.font('pixel'),
      fontSize: 64,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    t.list('labels').map((label, index) => [
      text(label, 200, 450 + index * 135, 360, {
        fontFamily: mono,
        fontSize: 104,
        fontWeight: 700,
        fill: t.color('secondary'),
        lineHeight: 1,
      }),
      text(values[index] ?? '', 520, 450 + index * 135, 360, {
        fontFamily: mono,
        fontSize: 104,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'right',
        lineHeight: 1,
      }),
    ]),
    siteFooter(t.copy('site'), 1250, t.shade('text', PX.grey), t.font('pixel')),
  ];
});

const FACTOR_SCORES = [92, 85, 78, 64];

const factorsSpec = {
  colors: {
    background: {
      value: PX.night,
      hint: 'Page; its lighter shade colors the empty meter segments',
    },
    primary: { value: PX.mint, hint: 'B2B GROWTH, the filled meter segments and the closing line' },
    secondary: { value: PX.sun, hint: 'Percentages' },
    accent: { value: PX.pink, hint: 'Hearts' },
    text: {
      value: PX.white,
      hint: 'KEY FACTORS FOR and the factor names; its grey shade colors the website',
    },
  },
  fonts: { heading: HEADING_FONT, pixel: PIXEL_FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'KEY FACTORS FOR' },
    title: { label: 'Title', value: 'B2B GROWTH' },
    factors: {
      label: 'Factor',
      value: ['CAMPAIGN PLANNING', 'DATA INSIGHTS', 'CONTENT ENGINE', 'PERFECT TIMING'],
    },
    scores: { label: 'Percentage', value: FACTOR_SCORES.map((score) => `${score}%`) },
    closing: { label: 'Closing line', value: 'SCORE YOUR FUNNEL TODAY' },
    site: WEBSITE,
  },
} as const satisfies ThemeSpec;

export const keyFactors = themed(W, H, factorsSpec, (t) => {
  const pixel = t.font('pixel');
  const scores = t.list('scores');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('kicker'), 0, 100, W, {
      fontFamily: pixel,
      fontSize: 40,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('title'), 0, 170, W, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    t.list('factors').map((factor, index) => {
      const y = 420 + index * 180;
      const filled = Math.round((FACTOR_SCORES[index] ?? 0) / 10);
      return [
        sprite(HEART, 80, y + 2, 7, { P: t.color('accent') }),
        text(factor, 160, y, 560, {
          fontFamily: pixel,
          fontSize: 34,
          fontWeight: 400,
          fill: t.color('text'),
        }),
        text(scores[index] ?? '', 700, y, 300, {
          fontFamily: pixel,
          fontSize: 36,
          fontWeight: 400,
          fill: t.color('secondary'),
          align: 'right',
        }),
        Array.from({ length: 10 }, (_, segment) =>
          rect(
            160 + segment * 84,
            y + 64,
            76,
            46,
            segment < filled ? t.color('primary') : t.shade('background', PX.grid),
            { name: 'Segment' },
          ),
        ),
      ];
    }),
    text(t.copy('closing'), 0, 1140, W, {
      fontFamily: pixel,
      fontSize: 34,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    siteFooter(t.copy('site'), 1250, t.shade('text', PX.grey), pixel),
  ];
});

const BLOCK = 108;

const STACK = ['SS.....MMK', 'SSP...PMKK', 'OPPP.PPMKO', 'OOMMSSPPKO'];

const tetrisSpec = {
  colors: {
    background: {
      value: '#2a1a6e',
      hint: 'Top of the page gradient; its darker shade colors the bottom and the block outlines',
    },
    primary: {
      value: PX.orange,
      hint: 'Falling piece and the orange blocks; its pink shade colors the pink blocks',
    },
    accent: { value: PX.sun, hint: 'YOUR AUDIENCE and the yellow blocks' },
    secondary: {
      value: PX.mint,
      hint: 'Mint blocks; its blue shade colors the blue blocks',
    },
    text: { value: PX.white, hint: 'FIT IN WITH and the shine on every block' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    title: { label: 'Title', value: 'FIT IN WITH' },
    subtitle: { label: 'Subtitle', value: 'YOUR AUDIENCE' },
  },
} as const satisfies ThemeSpec;

const tetris = (height: number) =>
  themed(W, height, tetrisSpec, (t) => {
    const stackTop = height - STACK.length * BLOCK;
    const fallTop = height * 0.34;
    const colors: Readonly<Record<string, string>> = {
      S: t.color('accent'),
      M: t.color('secondary'),
      P: t.shade('primary', PX.pink),
      O: t.color('primary'),
      K: t.shade('secondary', PX.sky),
    };
    const block = (x: number, y: number, color: string) => [
      rect(x, y, BLOCK, BLOCK, color, {
        stroke: t.shade('background', PX.night),
        strokeWidth: 5,
        name: 'Block',
      }),
      rect(x + 14, y + 14, BLOCK - 40, 14, t.shade('text', 'rgba(255,255,255,0.35)'), {
        name: 'Block shine',
      }),
    ];
    return [
      rect(0, 0, W, height, linear(180, t.color('background'), t.shade('background', PX.night)), {
        name: 'Background',
      }),
      text(t.copy('title'), 0, height * 0.07, W, {
        fontFamily: t.font('heading'),
        fontSize: 80,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('subtitle'), 0, height * 0.07 + 100, W, {
        fontFamily: t.font('heading'),
        fontSize: 80,
        fontWeight: 400,
        fill: t.color('accent'),
        align: 'center',
      }),
      [3, 4, 5].map((column) => block(column * BLOCK, fallTop, t.color('primary'))),
      block(4 * BLOCK, fallTop + BLOCK, t.color('primary')),
      STACK.map((row, rowIndex) =>
        [...row].map((cell, columnIndex) => {
          const color = colors[cell];
          return color === undefined
            ? []
            : block(columnIndex * BLOCK, stackTop + rowIndex * BLOCK, color);
        }),
      ),
    ];
  });

export const tetrisFit = tetris(H);

export const tetrisFitStory = tetris(STORY_SIZE.height);
