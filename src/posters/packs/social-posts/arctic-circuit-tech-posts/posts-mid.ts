import { linear } from '@/design';
import {
  circle,
  ellipse,
  photo,
  pill,
  poly,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, BRAND, brandMark, DARK_BACKGROUND, darkBg, H, HEADING, ICE, W } from './posts';

const along = (
  tipX: number,
  tipY: number,
  degrees: number,
  points: readonly (readonly [number, number])[],
): [number, number][] => {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return points.map(([x, y]) => [tipX + x * cos - y * sin, tipY + x * sin + y * cos]);
};

const TARGET = [
  { width: 880, height: 400, fill: ICE.deep },
  { width: 680, height: 310, fill: ICE.navy },
  { width: 480, height: 218, fill: ICE.deep },
  { width: 280, height: 128, fill: ICE.navy },
];

export const precisionTracking = themed(
  W,
  H,
  {
    colors: {
      background: DARK_BACKGROUND,
      surface: {
        value: ICE.deep,
        hint: 'Target rings; its darker shade colors every other ring',
      },
      primary: {
        value: ICE.cyan,
        hint: 'Glow, ring outlines, the bullseye, the dart fins and Every Metric',
      },
      text: {
        value: ICE.white,
        hint: 'Brand name, Precision Tracking of and the dart shaft',
      },
    },
    fonts: { heading: HEADING },
    copy: {
      lines: { label: 'Headline line', value: ['Precision', 'Tracking of', 'Every Metric'] },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const [first = '', second = '', third = ''] = t.list('lines');
    const line = (content: string, y: number, fontWeight: number, fill: string) =>
      text(content, 80, y, 920, {
        fontFamily: t.font('heading'),
        fontSize: 104,
        fontWeight,
        fill,
        lineHeight: 1,
      });
    return [
      darkBg(t, H),
      brandMark(t.copy('brand'), 80, 90, 600, t.color('text'), t.font('heading'), 'left'),
      line(first, 210, 300, t.color('text')),
      line(second, 325, 300, t.color('text')),
      line(third, 440, 800, t.color('primary')),
      TARGET.map((ring) =>
        ellipse(
          600 - ring.width / 2,
          1010 - ring.height / 2,
          ring.width,
          ring.height,
          t.shade('surface', ring.fill),
          {
            name: 'Target ring',
            stroke: t.shade('primary', 'rgba(34,211,238,0.45)'),
            strokeWidth: 3,
          },
        ),
      ),
      ellipse(540, 983, 120, 54, t.color('primary'), {
        name: 'Bullseye',
        ...shadow(60, 0, t.shade('primary', 'rgba(34,211,238,0.95)')),
      }),
      poly(
        along(600, 1005, -55, [
          [0, 0],
          [70, -9],
          [430, -6],
          [430, 6],
          [70, 9],
        ]),
        linear(90, t.color('text'), t.shade('text', '#94a3b8')),
        { name: 'Dart shaft' },
      ),
      poly(
        along(600, 1005, -55, [
          [360, 0],
          [470, -70],
          [520, -70],
          [450, 0],
        ]),
        t.color('primary'),
        { name: 'Dart fin' },
      ),
      poly(
        along(600, 1005, -55, [
          [360, 0],
          [470, 70],
          [520, 70],
          [450, 0],
        ]),
        t.shade('primary', ICE.electric),
        { name: 'Dart fin' },
      ),
    ];
  },
);

export const mythFact = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ICE.night,
        hint: 'Page and the labels on the pills; its lighter shade tints the top of the page',
      },
      primary: { value: ICE.cyan, hint: 'Glow, the or pill and the Myth pill' },
      text: {
        value: ICE.white,
        hint: 'Myth and Fact titles, the cards, their statements, the Fact pill and the brand name',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      myth: { label: 'Myth label', value: 'Myth' },
      joiner: { label: 'Joiner', value: 'or' },
      fact: { label: 'Fact label', value: 'Fact' },
      statements: {
        label: 'Statement',
        value: [
          'AI will replace every analyst\non your team by next year.',
          'AI clears the busywork so analysts\ncan focus on real decisions.',
        ],
      },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const [mythText = '', factText = ''] = t.list('statements');
    const title = (content: string, y: number) =>
      text(content, 0, y, W, {
        fontFamily: t.font('heading'),
        fontSize: 160,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
      });
    const tag = (label: string, x: number, fill: string, y: number, width: number) =>
      pill(label, x, y, {
        fill,
        color: t.color('background'),
        fontSize: 30,
        fontFamily: t.font('body'),
        fontWeight: 700,
        width,
      });
    const factCard = (y: number, label: string, body: string, tagRight: boolean) => [
      rect(120, y, 840, 230, t.shade('text', 'rgba(255,255,255,0.05)'), {
        name: 'Card',
        cornerRadius: 40,
        stroke: t.shade('text', 'rgba(255,255,255,0.45)'),
        strokeWidth: 2,
      }),
      tag(
        label,
        tagRight ? 790 : 160,
        tagRight ? t.color('text') : t.color('primary'),
        y - 30,
        130,
      ),
      text(body, 170, y + 70, 740, {
        fontFamily: t.font('body'),
        fontSize: 36,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1.35,
      }),
    ];
    return [
      darkBg(t, H),
      title(t.copy('myth'), 110),
      tag(t.copy('joiner'), 500, t.color('primary'), 280, 80),
      title(t.copy('fact'), 340),
      factCard(600, t.copy('myth'), mythText, false),
      factCard(900, t.copy('fact'), factText, true),
      brandMark(t.copy('brand'), 0, 1240, W, t.color('text'), t.font('heading')),
    ];
  },
);

export const quoteRival = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ICE.white,
        hint: 'Page; its cooler shades color the bottom of the page gradient',
      },
      text: {
        value: ICE.night,
        hint: 'Quote marks, the plain quote lines, the name and the brand name; its lighter shade colors the job title',
      },
      primary: {
        value: ICE.electric,
        hint: 'Highlighted quote line, the photo border, the dots and the rule under the brand',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      lines: {
        label: 'Quote line',
        value: ['Automation is', 'a partner,', 'not a rival.'],
      },
      name: { label: 'Name', value: 'Dorian Vale' },
      role: { label: 'Job title', value: 'Systems Architect' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const [first = '', second = '', third = ''] = t.list('lines');
    const quoteLine = (content: string, y: number, fontWeight: number, fill: string) =>
      text(content, 520, y, 520, {
        fontFamily: t.font('heading'),
        fontSize: 64,
        fontWeight,
        fill,
        lineHeight: 1.1,
      });
    const quoteMark = (x: number, tail: [number, number][]) => [
      rect(x, 470, 170, 170, t.color('text'), { name: 'Quote block', cornerRadius: 22 }),
      poly(tail, t.color('text'), { name: 'Quote tail' }),
    ];
    return [
      rect(
        0,
        0,
        W,
        H,
        linear(
          180,
          t.color('background'),
          t.shade('background', '#e0f7ff'),
          t.shade('background', '#9be7f5'),
        ),
        { name: 'Background' },
      ),
      quoteMark(80, [
        [180, 640],
        [250, 640],
        [150, 850],
        [96, 850],
      ]),
      quoteMark(290, [
        [390, 640],
        [460, 640],
        [360, 850],
        [306, 850],
      ]),
      quoteLine(first, 470, 400, t.color('text')),
      quoteLine(second, 550, 800, t.color('primary')),
      quoteLine(third, 630, 400, t.color('text')),
      photo('man-portrait-1', 760, 830, 220, 220, {
        cornerRadius: 24,
        stroke: t.color('primary'),
        strokeWidth: 6,
      }),
      text(t.copy('name'), 640, 1075, 340, {
        fontFamily: t.font('heading'),
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'right',
      }),
      text(t.copy('role'), 640, 1118, 340, {
        fontFamily: t.font('body'),
        fontSize: 24,
        fontWeight: 500,
        fill: t.shade('text', '#335070'),
        align: 'right',
      }),
      circle(165, 1090, 10, t.color('primary')),
      circle(205, 1090, 10, t.shade('primary', 'rgba(14,165,233,0.4)')),
      circle(245, 1090, 10, t.shade('primary', 'rgba(14,165,233,0.4)')),
      brandMark(t.copy('brand'), 80, 110, 600, t.color('text'), t.font('heading'), 'left'),
      rect(80, 160, 80, 6, t.color('primary'), { name: 'Rule', cornerRadius: 3 }),
    ];
  },
);
