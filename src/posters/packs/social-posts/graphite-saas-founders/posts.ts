import { linear } from '@/design';
import {
  bars,
  checklist,
  circle,
  icon,
  line,
  POST_SIZE,
  path,
  pill,
  rect,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface SaasPalette {
  top: string;
  deep: string;
  accent: string;
  paper: string;
  soft: string;
  card: string;
  onAccent: string;
}

export const LIME: SaasPalette = {
  top: '#26330f',
  deep: '#0b0d10',
  accent: '#c6f432',
  paper: '#ffffff',
  soft: '#aab3a0',
  card: '#171b20',
  onAccent: '#0b0d10',
};

export const LILAC: SaasPalette = {
  top: '#8b5cf6',
  deep: '#2e1065',
  accent: '#f5d0fe',
  paper: '#ffffff',
  soft: '#ddd6fe',
  card: '#3b1a7a',
  onAccent: '#2e1065',
};

export const HEADING = { label: 'Heading font', value: 'Space Grotesk' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const BRAND = { label: 'Brand', value: 'Vectra Labs' } as const;
export const { width: W, height: H } = POST_SIZE;

export const page = (p: SaasPalette, hint: string) => ({
  value: p.deep,
  hint: `Page, with its ${hint}`,
});

interface CoreSpec {
  colors: Record<'background' | 'text', { value: string; hint: string }>;
  fonts: Record<'heading' | 'body', { label: string; value: string }>;
  copy: Record<'tag', { label: string; value: string }>;
}

export type SaasTheme = Pick<Theme<CoreSpec>, 'color' | 'shade' | 'font' | 'copy'>;

export const tagCopy = (value: string) => ({ label: 'Section tag', value });

export const base = (t: SaasTheme, p: SaasPalette, tag: string) => {
  const width = tag.length * 14 + 48;
  return [
    rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', p.top)), {
      name: 'Background',
    }),
    rect(70, 70, width, 52, t.shade('text', 'rgba(0,0,0,0)'), {
      cornerRadius: 26,
      stroke: t.shade('text', p.soft),
      strokeWidth: 2,
      name: 'Section tag',
    }),
    text(t.copy('tag'), 70, 83, width, {
      fontFamily: t.font('body'),
      fontSize: 22,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    line(width + 92, 96, 260, t.shade('text', p.soft), 2),
  ];
};

export const brandMark = (label: string, x: number, y: number, fill: string, fontFamily: string) =>
  text(label, x, y, 240, { fontFamily, fontSize: 26, fontWeight: 700, fill });

const COVERAGE_TAG = 'Product demo';

const coverageSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, and the base of the globe'),
      surface: { value: p.card, hint: 'Start free today pill and the top of the globe' },
      primary: {
        value: p.accent,
        hint: 'Local speed and its glow, the pill and globe outlines, and the globe dots',
      },
      text: {
        value: p.paper,
        hint: 'Section tag, Global reach and the pill label; its softer shade colors the tag outline, rule, brand and globe lines',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(COVERAGE_TAG),
      brand: BRAND,
      headline: { label: 'Headline', value: 'Global reach,' },
      title: { label: 'Highlighted line', value: 'Local speed' },
      cta: { label: 'Button', value: 'Start free today' },
    },
  }) as const satisfies ThemeSpec;

const globeDots = (fill: string) =>
  Array.from({ length: 30 * 15 }, (_, index) => {
    const column = index % 30;
    const row = Math.floor(index / 30);
    const x = 120 + column * 29;
    const y = 935 + row * 28;
    const inside = (x - 540) ** 2 + (y - 1350) ** 2 < 420 ** 2 && y < 1335;
    const land = (column * 7 + row * 13 + Math.floor(column / 4) * 5) % 9 < 4;
    return inside && land ? [circle(x, y, 6, fill, { opacity: 0.55 })] : [];
  });

export const globalCoverage = (p: SaasPalette) =>
  themed(W, H, coverageSpec(p), (t) => {
    const soft = t.shade('text', p.soft);
    const clear = t.shade('text', 'rgba(0,0,0,0)');
    return [
      base(t, p, COVERAGE_TAG),
      brandMark(t.copy('brand'), 800, 82, soft, t.font('heading')),
      text(t.copy('headline'), 0, 290, W, {
        fontFamily: t.font('heading'),
        fontSize: 80,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('title'), 0, 385, W, {
        fontFamily: t.font('heading'),
        fontSize: 92,
        fontWeight: 700,
        fill: t.color('primary'),
        align: 'center',
        ...shadow(30, 0, t.color('primary')),
      }),
      pill(t.copy('cta'), 370, 540, {
        fill: t.color('surface'),
        color: t.color('text'),
        stroke: t.color('primary'),
        strokeWidth: 2,
        fontSize: 32,
        fontFamily: t.font('body'),
        width: 340,
      }),
      path(
        'M 90 1350 A 450 450 0 0 1 990 1350 Z',
        0,
        0,
        W,
        H,
        linear(180, t.color('surface'), t.color('background')),
        { width: W, height: H },
        { stroke: t.color('primary'), strokeWidth: 4, name: 'Globe' },
      ),
      path(
        'M 240 1350 A 300 450 0 0 1 840 1350',
        0,
        0,
        W,
        H,
        clear,
        { width: W, height: H },
        { stroke: soft, strokeWidth: 2, name: 'Meridian' },
      ),
      path(
        'M 390 1350 A 150 450 0 0 1 690 1350',
        0,
        0,
        W,
        H,
        clear,
        { width: W, height: H },
        { stroke: soft, strokeWidth: 2, name: 'Meridian' },
      ),
      line(116, 1200, 848, soft, 2),
      line(205, 1050, 670, soft, 2),
      globeDots(t.color('primary')),
    ];
  });

const ANALYTICS_TAG = 'Feature breakdown';

const analyticsSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, and the label on the change pill'),
      surface: { value: p.card, hint: 'Dashboard card' },
      primary: { value: p.accent, hint: 'Change pill, chart bars and the check icons' },
      text: {
        value: p.paper,
        hint: 'Section tag, title, revenue figure and checklist; its softer shades color the tag outline, rule, subtitle, revenue label and card edge',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(ANALYTICS_TAG),
      title: { label: 'Title', value: 'AI Analytics' },
      subtitle: { label: 'Subtitle', value: 'See what drives growth, in real time.' },
      metric: { label: 'Metric label', value: 'Weekly revenue' },
      value: { label: 'Metric value', value: '$48.2k' },
      change: { label: 'Change', value: '+18%' },
      points: {
        label: 'Checklist item',
        value: [
          'Spot trends before they peak',
          'Forecast with one click',
          'Share reports with your team',
        ],
      },
    },
  }) as const satisfies ThemeSpec;

export const aiAnalytics = (p: SaasPalette) =>
  themed(W, H, analyticsSpec(p), (t) => [
    base(t, p, ANALYTICS_TAG),
    text(t.copy('title'), 0, 200, W, {
      fontFamily: t.font('heading'),
      fontSize: 96,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 0, 330, W, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 500,
      fill: t.shade('text', p.soft),
      align: 'center',
    }),
    rect(110, 430, 860, 560, t.color('surface'), {
      cornerRadius: 28,
      stroke: t.shade('text', 'rgba(255,255,255,0.1)'),
      strokeWidth: 2,
      name: 'Dashboard',
    }),
    text(t.copy('metric'), 160, 475, 400, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 500,
      fill: t.shade('text', p.soft),
    }),
    text(t.copy('value'), 160, 515, 400, {
      fontFamily: t.font('heading'),
      fontSize: 64,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    pill(t.copy('change'), 790, 490, {
      fill: t.color('primary'),
      color: t.shade('background', p.onAccent),
      fontSize: 28,
      fontFamily: t.font('body'),
      fontWeight: 700,
      width: 130,
    }),
    bars(160, 640, 760, 310, [40, 62, 48, 80, 66, 92, 74], t.color('primary'), 0.4),
    checklist(t.list('points'), 150, 1050, 820, {
      color: t.color('text'),
      iconColor: t.color('primary'),
      fontSize: 32,
      gap: 62,
      fontFamily: t.font('body'),
    }),
  ]);

const QUOTE_TAG = 'User reviews';

const quoteSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, and the squares behind the quote marks'),
      primary: { value: p.accent, hint: 'Quote marks' },
      text: {
        value: p.paper,
        hint: 'Section tag, quote frame and quote; its softer shade colors the tag outline, rule, author and brand',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(QUOTE_TAG),
      quote: {
        label: 'Quote',
        value: 'Time is money.\nWith Vectra we\nsave hours every\nweek and win\nmore customers.',
      },
      author: { label: 'Author', value: 'Maya Chen, founder at Brightpath' },
      brand: BRAND,
    },
  }) as const satisfies ThemeSpec;

export const quoteCard = (p: SaasPalette) =>
  themed(W, H, quoteSpec(p), (t) => [
    base(t, p, QUOTE_TAG),
    rect(170, 330, 760, 760, t.shade('text', 'rgba(0,0,0,0)'), {
      cornerRadius: 24,
      stroke: t.color('text'),
      strokeWidth: 3,
      name: 'Quote frame',
    }),
    rect(110, 250, 150, 150, t.color('background'), { cornerRadius: 20, name: 'Quote backdrop' }),
    icon('quote', 120, 260, 130, t.color('primary'), { strokeWidth: 2.4 }),
    text(t.copy('quote'), 230, 430, 660, {
      fontFamily: t.font('heading'),
      fontSize: 60,
      fontWeight: 700,
      fill: t.color('text'),
      lineHeight: 1.22,
    }),
    text(t.copy('author'), 230, 900, 660, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 500,
      fill: t.shade('text', p.soft),
    }),
    rect(820, 1020, 150, 150, t.color('background'), { cornerRadius: 20, name: 'Quote backdrop' }),
    icon('quote', 830, 1030, 130, t.color('primary'), { strokeWidth: 2.4 }),
    brandMark(t.copy('brand'), 80, 1260, t.shade('text', p.soft), t.font('heading')),
  ]);
