import { linear } from '@/design';
import {
  circle,
  line,
  POST_SIZE,
  path,
  rect,
  star,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface StatPalette {
  top: string;
  deep: string;
  accent: string;
  paper: string;
  ink: string;
  soft: string;
}

export const RUBY: StatPalette = {
  top: '#e11d48',
  deep: '#22040c',
  accent: '#fbbf24',
  paper: '#ffffff',
  ink: '#16050a',
  soft: '#fecdd3',
};

export const TEAL: StatPalette = {
  top: '#14b8a6',
  deep: '#032b2a',
  accent: '#a3e635',
  paper: '#ffffff',
  ink: '#04201f',
  soft: '#ccfbf1',
};

export const HEAD = { label: 'Heading font', value: 'Plus Jakarta Sans' } as const;
export const BODY = { label: 'Body font', value: 'Inter' } as const;
export const { width: W, height: H } = POST_SIZE;
export const GLOW =
  'Page gradient, full strength at the bottom; its darkest shade is the top of the page';

const clear = (hex: string) => {
  const channel = (start: number) => Number.parseInt(hex.slice(start, start + 2), 16);
  return `rgba(${channel(1)},${channel(3)},${channel(5)},0)`;
};

interface GlowSpec extends ThemeSpec {
  colors: { primary: { value: string; hint: string } };
}

export const glowPage = <S extends GlowSpec>(t: Theme<S>, p: StatPalette) =>
  rect(0, 0, W, H, linear(165, t.shade('primary', p.deep), t.color('primary')), {
    name: 'Background',
  });

export const kicker = (label: string, y: number, fill: string, fontFamily: string) =>
  text(label, 80, y, 700, {
    fontFamily,
    fontSize: 26,
    fontWeight: 600,
    fill,
    letterSpacing: 1,
  });

const POINTS = [
  { x: 230, y: 1060 },
  { x: 520, y: 900 },
  { x: 820, y: 800 },
];

const chartSpec = (p: StatPalette) =>
  ({
    colors: {
      primary: { value: p.top, hint: GLOW },
      secondary: {
        value: p.soft,
        hint: 'Kicker, point labels, dashed guides and the closing line',
      },
      accent: { value: p.accent, hint: 'Star and the dots on the trend line' },
      text: { value: p.paper, hint: 'Headline, percentages and the trend line' },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      kicker: { label: 'Kicker', value: 'Growth report 2026' },
      title: { label: 'Headline', value: 'Where top teams\nare investing now' },
      values: { label: 'Percentage', value: ['48%', '71%', '86%'] },
      labels: {
        label: 'Point label',
        value: ['Workflow\nautomation', 'Customer\nretention', 'Speed to\nlaunch'],
      },
      closing: { label: 'Closing line', value: 'Want numbers like these? Send us a message.' },
    },
  }) as const satisfies ThemeSpec;

export const leadersChart = (p: StatPalette) =>
  themed(W, H, chartSpec(p), (t) => {
    const labels = t.list('labels');
    return [
      glowPage(t, p),
      kicker(t.copy('kicker'), 90, t.color('secondary'), t.font('body')),
      text(t.copy('title'), 80, 140, 900, {
        fontFamily: t.font('heading'),
        fontSize: 72,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.1,
      }),
      star(5, 900, 80, 110, t.color('accent'), { innerRatio: 0.42 }),
      path(
        'M0 1160 C 120 1140 180 1080 230 1060 S 420 960 520 900 S 700 820 820 800 S 1000 770 1080 760',
        0,
        0,
        W,
        H,
        t.shade('text', clear(p.paper)),
        { width: W, height: H },
        { stroke: t.color('text'), strokeWidth: 6, name: 'Trend line' },
      ),
      t.list('values').map((value, index) => {
        const point = POINTS[index] ?? { x: 0, y: 0 };
        return [
          text(value, point.x - 110, point.y - 300, 220, {
            fontFamily: t.font('heading'),
            fontSize: 68,
            fontWeight: 800,
            fill: t.color('text'),
            align: 'center',
          }),
          text(labels[index] ?? '', point.x - 110, point.y - 214, 220, {
            fontFamily: t.font('body'),
            fontSize: 24,
            fontWeight: 500,
            fill: t.color('secondary'),
            align: 'center',
            lineHeight: 1.25,
          }),
          line(point.x, point.y - 140, 120, t.color('secondary'), 3, {
            dashed: true,
            rotation: 90,
          }),
          circle(point.x, point.y, 16, t.color('accent')),
        ];
      }),
      text(t.copy('closing'), 0, 1250, W, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 500,
        fill: t.color('secondary'),
        align: 'center',
      }),
    ];
  });

const bubbleSpec = (p: StatPalette) =>
  ({
    colors: {
      primary: {
        value: p.top,
        hint: 'Page gradient, full strength at the bottom; its darker shades color the top of the page, fill the bubbles and color the numbers on the stars',
      },
      secondary: { value: p.soft, hint: 'Subtitle, bubble rings and bubble labels' },
      accent: { value: p.accent, hint: 'Star at the bottom left' },
      text: {
        value: p.paper,
        hint: 'Headline, bubble percentages, the large star and the labels beside the stars',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      title: { label: 'Headline', value: 'Where AI pays off\nfor small teams' },
      subtitle: {
        label: 'Subtitle',
        value: 'How owners use AI to grow faster.\nWhere would you start?',
      },
      values: { label: 'Percentage', value: ['64%', '49%', '57%', '22%'] },
      labels: {
        label: 'Use case',
        value: ['Content creation', 'Lead generation', 'Smart support', 'Admin tasks'],
      },
    },
  }) as const satisfies ThemeSpec;

export const caseBubbles = (p: StatPalette) =>
  themed(W, H, bubbleSpec(p), (t) => {
    const [first = '', second = '', third = '', fourth = ''] = t.list('values');
    const [content = '', leads = '', support = '', admin = ''] = t.list('labels');
    const bubble = (cx: number, cy: number, r: number, value: string, label: string) => [
      circle(cx, cy, r, t.shade('primary', 'rgba(0,0,0,0.32)'), {
        stroke: t.color('secondary'),
        strokeWidth: 3,
      }),
      text(value, cx - r, cy - r * 0.42, r * 2, {
        fontFamily: t.font('heading'),
        fontSize: r * 0.44,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(label, cx - r, cy + r * 0.18, r * 2, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 500,
        fill: t.color('secondary'),
        align: 'center',
      }),
    ];
    const starLabel = (label: string, x: number, y: number, width: number) =>
      text(label, x, y, width, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      });
    const starValue = (value: string, x: number, y: number, width: number, size: number) =>
      text(value, x, y, width, {
        fontFamily: t.font('heading'),
        fontSize: size,
        fontWeight: 800,
        fill: t.shade('primary', p.ink),
        align: 'center',
      });
    return [
      glowPage(t, p),
      text(t.copy('title'), 80, 100, 920, {
        fontFamily: t.font('heading'),
        fontSize: 66,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.1,
      }),
      text(t.copy('subtitle'), 80, 270, 920, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 400,
        fill: t.color('secondary'),
        lineHeight: 1.35,
      }),
      bubble(310, 760, 180, first, content),
      starLabel(leads, 600, 470, 240),
      star(5, 560, 520, 320, t.color('text'), { innerRatio: 0.48 }),
      starValue(second, 620, 668, 200, 58),
      bubble(720, 1050, 150, third, support),
      star(5, 200, 1000, 190, t.color('accent'), { innerRatio: 0.48 }),
      starValue(fourth, 215, 1090, 160, 38),
      starLabel(admin, 160, 1220, 280),
    ];
  });
