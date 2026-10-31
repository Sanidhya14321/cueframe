import { circle, rect, star, type Template, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, H, HEAD, type StatPalette, W } from './posts';

const SKYLINE = [520, 380, 600, 460, 640, 420];

const hoursSpec = (p: StatPalette) =>
  ({
    colors: {
      background: { value: p.deep, hint: 'Page' },
      primary: { value: p.brand, hint: 'Skyline bars and both stars' },
      secondary: { value: p.muted, hint: 'Source line' },
      text: {
        value: p.paper,
        hint: 'The percentage and the statement; its faint shade colors the caps on the bars',
      },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      stat: { label: 'Statistic', value: '73%' },
      statement: {
        label: 'Statement',
        value: 'of small firms lose 20+ hours\na week on tasks AI can handle',
      },
      source: {
        label: 'Source',
        value: 'Ops Pulse Report 2026. Stop losing time, start automating.',
      },
    },
  }) as const satisfies ThemeSpec;

export const wasteHours = (p: StatPalette): Template =>
  themed(W, H, hoursSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('stat'), 90, 110, 600, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    star(5, 760, 90, 130, t.color('primary'), { innerRatio: 0.45 }),
    text(t.copy('statement'), 90, 330, 920, {
      fontFamily: t.font('heading'),
      fontSize: 46,
      fontWeight: 700,
      fill: t.color('text'),
      lineHeight: 1.25,
    }),
    text(t.copy('source'), 90, 480, 920, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 500,
      fill: t.color('secondary'),
    }),
    SKYLINE.map((height, index) =>
      rect(60 + index * 160, H - height, 160, height, t.color('primary'), { name: 'Bar' }),
    ),
    SKYLINE.map((height, index) =>
      index % 2 === 0
        ? rect(60 + index * 160, H - height, 160, 14, t.shade('text', 'rgba(255,255,255,0.35)'), {
            name: 'Bar cap',
          })
        : [],
    ),
    star(5, 20, 700, 100, t.color('primary'), { innerRatio: 0.45 }),
  ]);

const casesSpec = (p: StatPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Page and the percentages and labels inside the bubbles and stars',
      },
      primary: { value: p.brand, hint: 'The two bubbles' },
      secondary: { value: p.muted, hint: 'Subtitle and the labels beside the stars' },
      text: { value: p.paper, hint: 'Headline and the two large stars' },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      title: { label: 'Headline', value: 'AI use cases that\nlift business results' },
      subtitle: { label: 'Subtitle', value: 'How teams use AI to grow. What about you?' },
      values: { label: 'Percentage', value: ['68%', '52%', '55%', '24%'] },
      labels: {
        label: 'Use case',
        value: ['Support chat', 'Lead scoring', 'Content drafts', 'Admin tasks'],
      },
    },
  }) as const satisfies ThemeSpec;

export const aiUseCases = (p: StatPalette): Template =>
  themed(W, H, casesSpec(p), (t) => {
    const [first = '', second = '', third = '', fourth = ''] = t.list('values');
    const [support = '', scoring = '', drafts = '', admin = ''] = t.list('labels');
    const ink = t.color('background');
    const bubble = (cx: number, cy: number, radius: number, value: string, label: string) => [
      circle(cx, cy, radius, t.color('primary')),
      text(value, cx - radius, cy - radius * 0.42, radius * 2, {
        fontFamily: t.font('heading'),
        fontSize: radius * 0.5,
        fontWeight: 700,
        fill: ink,
        align: 'center',
      }),
      text(label, cx - radius, cy + radius * 0.18, radius * 2, {
        fontFamily: t.font('body'),
        fontSize: Math.max(22, radius * 0.16),
        fontWeight: 600,
        fill: ink,
        align: 'center',
      }),
    ];
    const starValue = (value: string, x: number, y: number, width: number, size: number) =>
      text(value, x, y, width, {
        fontFamily: t.font('heading'),
        fontSize: size,
        fontWeight: 700,
        fill: ink,
        align: 'center',
      });
    const starLabel = (label: string, x: number, y: number, width: number) =>
      text(label, x, y, width, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 600,
        fill: t.color('secondary'),
        align: 'center',
      });
    return [
      rect(0, 0, W, H, ink, { name: 'Background' }),
      text(t.copy('title'), 90, 110, 920, {
        fontFamily: t.font('heading'),
        fontSize: 66,
        fontWeight: 700,
        fill: t.color('text'),
        lineHeight: 1.15,
      }),
      text(t.copy('subtitle'), 90, 290, 920, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 500,
        fill: t.color('secondary'),
      }),
      bubble(360, 760, 200, first, support),
      star(5, 560, 470, 330, t.color('text'), { innerRatio: 0.5 }),
      starValue(second, 610, 600, 230, 64),
      starLabel(scoring, 780, 800, 280),
      bubble(760, 1070, 160, third, drafts),
      star(5, 150, 990, 210, t.color('text'), { innerRatio: 0.5 }),
      starValue(fourth, 165, 1080, 180, 44),
      starLabel(admin, 120, 1220, 300),
    ];
  });
