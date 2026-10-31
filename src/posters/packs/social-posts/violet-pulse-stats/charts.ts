import {
  circle,
  type Nodes,
  path,
  rect,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { FONTS, kicker, PH, PW, type StatTheme } from './shared';

interface BubbleStyle {
  fill: string;
  ink: string;
  heading: string;
  body: string;
}

const bubble = (
  style: BubbleStyle,
  cx: number,
  cy: number,
  radius: number,
  value: string,
  label: string,
) => [
  circle(cx, cy, radius, style.fill),
  text(value, cx - radius, cy - radius * 0.42, radius * 2, {
    fontFamily: style.heading,
    fontSize: radius * 0.52,
    fontWeight: 800,
    fill: style.ink,
    align: 'center',
  }),
  text(label, cx - radius, cy + radius * 0.22, radius * 2, {
    fontFamily: style.body,
    fontSize: radius * 0.16,
    fontWeight: 600,
    fill: style.ink,
    align: 'center',
  }),
];

export const aiUsage = (theme: StatTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        background: { value: theme.surface, hint: 'Page' },
        primary: {
          value: theme.brand,
          hint: 'Second headline line, the bubbles and the numbers inside the stars',
        },
        text: {
          value: theme.copy,
          hint: 'First headline line, the stars and their labels; its softer shade colors the question',
        },
        surface: { value: '#ffffff', hint: 'Numbers and labels inside the bubbles' },
      },
      fonts: FONTS,
      copy: {
        headline: { label: 'Headline', value: 'Where AI saves' },
        highlight: { label: 'Highlighted line', value: 'the most hours' },
        question: {
          label: 'Question',
          value: 'How do teams use AI every week?\nWhat about yours?',
        },
        values: { label: 'Stat', value: ['49%', '64%', '57%', '21%'] },
        labels: {
          label: 'Stat label',
          value: ['Sales outreach', 'Content drafts', 'Lead research', 'Admin tasks'],
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const [outreach = '', drafts = '', research = '', admin = ''] = t.list('labels');
      const [outreachValue = '', draftsValue = '', researchValue = '', adminValue = ''] =
        t.list('values');
      const style = {
        fill: t.color('primary'),
        ink: t.color('surface'),
        heading: t.font('heading'),
        body: t.font('body'),
      };
      return [
        rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
        text(t.copy('headline'), 90, 110, 940, {
          fontFamily: t.font('heading'),
          fontSize: 70,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        text(t.copy('highlight'), 90, 196, 940, {
          fontFamily: t.font('heading'),
          fontSize: 70,
          fontWeight: 800,
          fill: t.color('primary'),
        }),
        text(t.copy('question'), 90, 316, 900, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: 500,
          fill: t.shade('text', theme.muted),
          lineHeight: 1.35,
        }),
        text(outreach, 800, 500, 260, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 600,
          fill: t.color('text'),
        }),
        star(5, 640, 540, 340, t.color('text'), { innerRatio: 0.48 }),
        text(outreachValue, 690, 676, 240, {
          fontFamily: t.font('heading'),
          fontSize: 62,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
        }),
        bubble(style, 300, 800, 180, draftsValue, drafts),
        bubble(style, 650, 1080, 150, researchValue, research),
        star(5, 150, 1010, 190, t.color('text'), { innerRatio: 0.48 }),
        text(adminValue, 175, 1084, 140, {
          fontFamily: t.font('heading'),
          fontSize: 34,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
        }),
        text(admin, 120, 1236, 300, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 600,
          fill: t.color('text'),
        }),
      ];
    },
  );

interface MarkerStyle {
  paper: string;
  ink: string;
  heading: string;
  body: string;
}

const marker = (
  style: MarkerStyle,
  x: number,
  top: number,
  pointY: number,
  value: string,
  label: string,
): Nodes[] => [
  text(value, x - 120, top, 240, {
    fontFamily: style.heading,
    fontSize: 64,
    fontWeight: 800,
    fill: style.paper,
    align: 'center',
  }),
  text(label, x - 120, top + 84, 240, {
    fontFamily: style.body,
    fontSize: 24,
    fontWeight: 600,
    fill: style.paper,
    align: 'center',
    lineHeight: 1.2,
  }),
  rect(x - 2, top + 160, 4, pointY - top - 160, style.paper, { name: 'Marker line' }),
  circle(x, pointY, 16, style.paper, { stroke: style.ink, strokeWidth: 6 }),
];

const MARKER_SPOTS = [
  { x: 240, top: 780, pointY: 1150 },
  { x: 520, top: 620, pointY: 1050 },
  { x: 800, top: 460, pointY: 960 },
] as const;

export const leadersChart = (theme: StatTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        background: { value: theme.brand, hint: 'Page' },
        surface: {
          value: theme.paper,
          hint: 'Kicker, headline, chart numbers and labels, marker lines and dots, the small star and the footer',
        },
        accent: { value: theme.ink, hint: 'Top star, the trend line and the dot rings' },
      },
      fonts: FONTS,
      copy: {
        kicker: { label: 'Kicker', value: 'REVENUE OPERATIONS' },
        headline: { label: 'Headline', value: 'Where top teams\ninvest right now' },
        values: { label: 'Stat', value: ['48%', '69%', '83%'] },
        labels: {
          label: 'Stat label',
          value: ['AI and\nautomation', 'Customer\nacquisition', 'Delivery\nspeed'],
        },
        footer: { label: 'Footer', value: 'Want the full report? Send us a message.' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const labels = t.list('labels');
      const style = {
        paper: t.color('surface'),
        ink: t.color('accent'),
        heading: t.font('heading'),
        body: t.font('body'),
      };
      return [
        rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
        kicker(t.copy('kicker'), t.color('surface'), t.font('body')),
        text(t.copy('headline'), 90, 150, 760, {
          fontFamily: t.font('heading'),
          fontSize: 66,
          fontWeight: 800,
          fill: t.color('surface'),
          lineHeight: 1.12,
        }),
        star(5, 860, 60, 140, t.color('accent'), { innerRatio: 0.42 }),
        path(
          'M0 1180 C 120 1175, 180 1165, 240 1150 S 420 1080, 520 1050 S 700 975, 800 960 S 960 920, 1080 860',
          0,
          0,
          PW,
          PH,
          t.shade('accent', 'rgba(0,0,0,0)'),
          { width: PW, height: PH },
          { stroke: t.color('accent'), strokeWidth: 8 },
        ),
        t.list('values').map((value, index) => {
          const spot = MARKER_SPOTS[index] ?? MARKER_SPOTS[0];
          return marker(style, spot.x, spot.top, spot.pointY, value, labels[index] ?? '');
        }),
        star(5, 940, 700, 110, t.color('surface'), { innerRatio: 0.42 }),
        text(t.copy('footer'), 90, 1260, 900, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 600,
          fill: t.color('surface'),
          align: 'right',
        }),
      ];
    },
  );
