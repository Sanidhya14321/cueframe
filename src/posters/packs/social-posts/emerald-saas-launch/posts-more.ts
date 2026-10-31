import { linear } from '@/design';
import { circle, icon, pill, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  BRAND,
  backdrop,
  brandMark,
  darkTile,
  glass,
  H,
  HEADING,
  type SaasPalette,
  saasColors,
  title,
  W,
} from './posts';

const ORBIT = [
  ['sparkles', 300, 610],
  ['zap', 780, 610],
  ['workflow', 300, 1030],
  ['brain', 780, 1030],
] as const;

const automationsSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary:
        'Page gradient and the robot core; its darker shade colors the Learn more button, the satellites and the bottom of the core',
      accent: 'Subtitle, satellite rings and icons, and Studio',
      text: 'AI Automations, the button label, the robot and Northpeak',
      surface: 'Orbit disc and the outlines of the orbit and the button',
    }),
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: 'AI Automations' },
      subtitle: { label: 'Subtitle', value: 'A solution built for you.' },
      cta: { label: 'Button', value: 'Learn more' },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const aiAutomations = (p: SaasPalette) =>
  themed(W, H, automationsSpec(p), (t) => [
    backdrop(t, p),
    title(t, t.copy('title'), 130, 90),
    title(t, t.copy('subtitle'), 245, 44, t.color('accent'), 600),
    pill(t.copy('cta'), 390, 340, {
      fill: t.shade('primary', p.deep),
      color: t.color('text'),
      fontSize: 34,
      fontFamily: t.font('heading'),
      fontWeight: 700,
      width: 300,
      stroke: t.shade('surface', 'rgba(255,255,255,0.4)'),
      strokeWidth: 2,
    }),
    circle(540, 820, 250, t.shade('surface', 'rgba(255,255,255,0.1)'), {
      stroke: t.shade('surface', 'rgba(255,255,255,0.35)'),
      strokeWidth: 2,
      name: 'Orbit',
    }),
    circle(540, 820, 150, linear(180, t.color('primary'), t.shade('primary', p.deep)), {
      name: 'Core',
    }),
    icon('bot', 450, 730, 180, t.color('text'), { strokeWidth: 1.6 }),
    ORBIT.map(([name, cx, cy]) => [
      circle(cx, cy, 56, t.shade('primary', p.deep), {
        stroke: t.color('accent'),
        strokeWidth: 3,
        name: 'Satellite',
      }),
      icon(name, cx - 30, cy - 30, 60, t.color('accent'), { strokeWidth: 2 }),
    ]),
    brandMark(t),
  ]);

const featureSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient; its darker shade colors the progress track',
      accent: 'Version line, the progress bar and Studio',
      text: 'Titles, Smart Inbox and Northpeak',
      surface: 'Glass card, the folder icon and the check mark',
    }),
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'New Feature' },
      subtitle: { label: 'Subtitle', value: 'Check your app today!' },
      feature: { label: 'Feature', value: 'Smart Inbox' },
      version: { label: 'Version', value: 'Version 2.4 · 38.6 MB' },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const newFeature = (p: SaasPalette) =>
  themed(W, H, featureSpec(p), (t) => [
    backdrop(t, p),
    title(t, t.copy('title'), 150, 100),
    title(t, t.copy('subtitle'), 275, 46, t.color('text'), 600),
    glass(t, 150, 420, 780, 560, 40),
    icon('folder', 220, 490, 180, t.color('surface'), { strokeWidth: 1.4 }),
    text(t.copy('feature'), 440, 520, 460, {
      fontFamily: t.font('heading'),
      fontSize: 56,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    text(t.copy('version'), 440, 595, 460, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('accent'),
    }),
    rect(220, 780, 640, 120, t.shade('primary', p.deep), {
      cornerRadius: 60,
      name: 'Progress track',
    }),
    rect(256, 818, 470, 44, t.color('accent'), { cornerRadius: 22, name: 'Progress' }),
    icon('circle-check', 752, 802, 76, t.color('surface'), { strokeWidth: 2 }),
    brandMark(t),
  ]);

const informedSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary:
        'Page gradient; its shades color the phone body, the bell disc, the notification text and Northpeak',
      accent: 'Subtitle, the bottom of the phone screen and Studio',
      text: 'Get informed',
      surface: 'Notification card, the bell and the top of the phone screen',
    }),
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Get informed' },
      subtitle: { label: 'Subtitle', value: 'Turn on alerts and win $100' },
      alert: { label: 'Notification title', value: 'Notification' },
      message: { label: 'Notification message', value: 'A reward is waiting for you' },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const getInformed = (p: SaasPalette) =>
  themed(W, H, informedSpec(p), (t) => [
    backdrop(t, p),
    title(t, t.copy('title'), 120, 100),
    title(t, t.copy('subtitle'), 245, 42, t.color('accent'), 600),
    rect(290, 400, 500, 950, t.shade('primary', '#0b0b0f'), {
      cornerRadius: 70,
      name: 'Phone body',
    }),
    rect(310, 420, 460, 930, linear(180, t.shade('surface', '#f8fafc'), t.color('accent')), {
      cornerRadius: 56,
      name: 'Phone screen',
    }),
    rect(470, 440, 140, 40, t.shade('primary', '#0b0b0f'), {
      cornerRadius: 20,
      name: 'Dynamic island',
    }),
    rect(200, 680, 680, 180, t.shade('surface', 'rgba(255,255,255,0.94)'), {
      cornerRadius: 34,
      stroke: t.shade('surface', 'rgba(255,255,255,1)'),
      strokeWidth: 2,
      name: 'Notification',
    }),
    circle(290, 770, 50, t.shade('primary', p.mid)),
    icon('bell', 262, 742, 56, t.color('surface'), { strokeWidth: 2.2 }),
    text(t.copy('alert'), 370, 712, 480, {
      fontFamily: t.font('heading'),
      fontSize: 42,
      fontWeight: 800,
      fill: t.shade('primary', p.deep),
    }),
    text(t.copy('message'), 370, 774, 480, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.shade('primary', '#475569'),
    }),
    brandMark(t, 1230, t.shade('primary', p.deep)),
  ]);

const stepsSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient; its darker shade colors the step badges',
      accent: 'Engagement, the badge rings and Studio',
      text: 'Title, step numbers, steps and Northpeak',
      surface: 'Glass step cards',
    }),
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: '3 Steps to Boost' },
      subtitle: { label: 'Subtitle', value: 'Engagement' },
      numbers: { label: 'Step number', value: ['01', '02', '03'] },
      steps: {
        label: 'Step',
        value: [
          'Know your audience and the\nproblem they need solved.',
          'Post one useful idea a day\nand reply to every comment.',
          'Track what works, then\ndouble down every week.',
        ],
      },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const threeSteps = (p: SaasPalette) =>
  themed(W, H, stepsSpec(p), (t) => {
    const numbers = t.list('numbers');
    return [
      backdrop(t, p),
      title(t, t.copy('title'), 120, 84),
      title(t, t.copy('subtitle'), 225, 70, t.color('accent'), 600),
      t.list('steps').map((step, index) => {
        const y = 400 + index * 250;
        return [
          glass(t, 110, y, 860, 200, 36),
          circle(215, y + 100, 58, t.shade('primary', p.deep), {
            stroke: t.color('accent'),
            strokeWidth: 3,
            name: 'Step badge',
          }),
          text(numbers[index] ?? '', 157, y + 74, 116, {
            fontFamily: t.font('heading'),
            fontSize: 44,
            fontWeight: 800,
            fill: t.color('text'),
            align: 'center',
          }),
          text(step, 310, y + 52, 620, {
            fontFamily: t.font('body'),
            fontSize: 34,
            fontWeight: 500,
            fill: t.color('text'),
            lineHeight: 1.35,
          }),
        ];
      }),
      brandMark(t),
    ];
  });

const SLIDERS = [0.3, 0.55, 0.2, 0.7, 0.45, 0.6];

const decisionSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient; its darker shades color the panel and the button label',
      accent: 'Highlighted slider knob, the subtitle and Studio',
      text: 'Clear decisions and Northpeak',
      surface: 'Slider tracks and knobs, the panel outline and the Try it now button',
    }),
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Title', value: 'Clear decisions' },
      subtitle: { label: 'Subtitle', value: 'based on clear data' },
      cta: { label: 'Button', value: 'Try it now' },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const clearDecision = (p: SaasPalette) =>
  themed(W, H, decisionSpec(p), (t) => [
    backdrop(t, p),
    SLIDERS.map((level, index) => {
      const x = 190 + index * 140;
      return [
        rect(x - 30, 150, 60, 440, t.shade('surface', 'rgba(255,255,255,0.15)'), {
          cornerRadius: 30,
          name: 'Slider track',
        }),
        circle(x, 150 + 30 + level * 380, 36, index === 3 ? t.color('accent') : t.color('surface')),
      ];
    }),
    darkTile(t, p, 140, 670, 800, 420),
    title(t, t.copy('title'), 720, 76),
    title(t, t.copy('subtitle'), 815, 50, t.color('accent'), 600),
    pill(t.copy('cta'), 400, 940, {
      fill: t.color('surface'),
      color: t.shade('primary', p.deep),
      fontSize: 36,
      fontFamily: t.font('heading'),
      fontWeight: 800,
      width: 280,
    }),
    brandMark(t),
  ]);

const usersSpec = (p: SaasPalette) =>
  ({
    colors: saasColors(p, {
      primary: 'Page gradient',
      accent: '85%, the outer ring, Average setup and Studio',
      text: 'The claim under 85%, 4 min and Northpeak',
      surface: 'Inner ring and the glass card',
    }),
    fonts: { heading: HEADING, body: BODY },
    copy: {
      stat: { label: 'Stat', value: '85%' },
      claim: { label: 'Claim', value: 'of users choose\nfaster solutions.' },
      label: { label: 'Card label', value: 'Average setup' },
      value: { label: 'Card value', value: '4 min' },
      ...BRAND,
    },
  }) as const satisfies ThemeSpec;

export const usersChoose = (p: SaasPalette) =>
  themed(W, H, usersSpec(p), (t) => [
    backdrop(t, p),
    circle(300, 960, 220, t.shade('accent', 'rgba(0,0,0,0)'), {
      stroke: t.color('accent'),
      strokeWidth: 28,
      name: 'Ring',
    }),
    circle(300, 960, 140, t.shade('surface', 'rgba(0,0,0,0)'), {
      stroke: t.shade('surface', 'rgba(255,255,255,0.35)'),
      strokeWidth: 20,
      name: 'Ring',
    }),
    text(t.copy('stat'), 80, 120, 900, {
      fontFamily: t.font('heading'),
      fontSize: 210,
      fontWeight: 800,
      fill: t.color('accent'),
      lineHeight: 1,
    }),
    text(t.copy('claim'), 80, 360, 920, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.12,
    }),
    glass(t, 600, 800, 400, 270),
    text(t.copy('label'), 640, 840, 340, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('accent'),
    }),
    text(t.copy('value'), 640, 890, 340, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    brandMark(t),
  ]);
