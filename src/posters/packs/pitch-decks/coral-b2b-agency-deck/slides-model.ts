import { circle, icon, rect, type ThemeSpec, themed } from '../../../kit';
import { backdrop, body, FONTS, head, marker, NV, SH, SW } from './theme';

const MARKS = [
  [true, true, true, true, true],
  [true, true, false, true, false],
  [false, true, false, false, true],
];

const matrixSpec = {
  colors: {
    background: { value: NV.cream, hint: 'Page; its darker shade colors the row rules' },
    primary: { value: NV.coral, hint: 'Accent bar and the highlighted Northvale column' },
    surface: { value: NV.white, hint: 'Northvale name and checks on the highlighted column' },
    text: {
      value: NV.ink,
      hint: 'Title, criteria, rival names and checks; its lighter shade colors the crosses',
    },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Competitive matrix' },
    rivals: { label: 'Company', value: ['Northvale', 'Agency B', 'Agency C'] },
    criteria: {
      label: 'Criterion',
      value: ['Strategy', 'Onboarding', 'Reporting', 'Integrations', 'Pricing'],
    },
  },
} as const satisfies ThemeSpec;

export const matrixSlide = themed(SW, SH, matrixSpec, (t) => {
  const heading = head(t.font('heading'));
  const markColor = (mark: boolean) => (mark ? t.color('text') : t.shade('text', NV.grey));
  return [
    backdrop(t.color('background')),
    marker(140, 120, t.color('primary')),
    heading(t.copy('title'), 140, 160, 1200, 110, t.color('text'), { fontWeight: 800 }),
    rect(680, 330, 360, 670, t.color('primary'), { name: 'Highlight column', cornerRadius: 24 }),
    t
      .list('rivals')
      .map((rival, column) => [
        heading(
          rival,
          680 + column * 380,
          360,
          360,
          38,
          column === 0 ? t.color('surface') : t.color('text'),
          { align: 'center' },
        ),
        (MARKS[column] ?? []).map((mark, row) =>
          icon(
            mark ? 'check' : 'x',
            835 + column * 380,
            455 + row * 110,
            50,
            column === 0 ? t.color('surface') : markColor(mark),
            { strokeWidth: 3 },
          ),
        ),
      ]),
    t.list('criteria').map((label, row) => [
      rect(140, 430 + row * 110, 1680, 2, t.shade('background', NV.line), { name: 'Row rule' }),
      body(t.font('body'))(label, 140, 460 + row * 110, 500, 34, t.color('text'), {
        fontWeight: 600,
      }),
    ]),
  ];
});

const STEP_ICONS = ['search', 'lightbulb', 'rocket'] as const;

const processSpec = {
  colors: {
    background: { value: NV.plum, hint: 'Page and the step icons' },
    primary: { value: NV.coral, hint: 'Step circles' },
    text: {
      value: NV.white,
      hint: 'Title and step names; its faded shades color the timeline and step details',
    },
    secondary: { value: NV.peach, hint: 'Intro paragraph' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'How our\npartnership\nworks' },
    intro: {
      label: 'Intro',
      value:
        'A step-by-step roadmap that aligns teams, speeds up execution and proves ROI from week one.',
    },
    steps: {
      label: 'Step',
      value: ['Onboarding & audit', 'Strategy sprint', 'Campaign launch'],
    },
    details: {
      label: 'Step detail',
      value: [
        'We map your funnel, data and team.',
        'Audience, offers and channels locked in.',
        'Roadmap, assets and tracking go live.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const processSlide = themed(SW, SH, processSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const details = t.list('details');
  return [
    backdrop(t.color('background')),
    heading(t.copy('title'), 140, 160, 760, 110, t.color('text'), { fontWeight: 800 }),
    copy(t.copy('intro'), 140, 600, 720, 34, t.color('secondary')),
    rect(1040, 220, 6, 580, t.shade('text', 'rgba(255,255,255,0.25)'), { name: 'Timeline' }),
    t.list('steps').map((step, index) => {
      const y = 170 + index * 290;
      return [
        circle(1043, y + 50, 52, t.color('primary')),
        icon(STEP_ICONS[index] ?? 'rocket', 1017, y + 24, 52, t.color('background'), {
          strokeWidth: 2.2,
        }),
        heading(step, 1140, y + 6, 660, 48, t.color('text')),
        copy(
          details[index] ?? '',
          1140,
          y + 72,
          660,
          32,
          t.shade('text', 'rgba(255,255,255,0.72)'),
        ),
      ];
    }),
  ];
});

const PHASE_ICONS = ['target', 'timer', 'wallet'] as const;
const QUESTIONS_PER_PHASE = 2;

const onboardingSpec = {
  colors: {
    background: { value: NV.cream, hint: 'Page' },
    secondary: {
      value: NV.plum,
      hint: 'First phase card and the text, icons and rules on the other two cards',
    },
    primary: { value: NV.coral, hint: 'Second phase card' },
    accent: { value: NV.peach, hint: 'Third phase card' },
    surface: { value: NV.white, hint: 'Text, icon and rule on the first phase card' },
    text: { value: NV.ink, hint: 'Title' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Client onboarding\n& delivery model' },
    phases: { label: 'Phase', value: ['Scope & goals', 'Speed & delivery', 'Commercials'] },
    questions: {
      label: 'Question',
      value: [
        'What will we own?',
        'How do we measure it?',
        'How fast do we start?',
        'What about capacity?',
        'Is pricing flexible?',
        'How is ROI reported?',
      ],
    },
    answers: {
      label: 'Answer',
      value: [
        'Positioning, demand gen and reporting.',
        'Pipeline, CAC and payback, monthly.',
        'Kick-off within five working days.',
        'A dedicated pod of four specialists.',
        'Monthly retainers, no lock-in.',
        'A live dashboard shared with you.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const onboardingSlide = themed(SW, SH, onboardingSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const fills = [t.color('secondary'), t.color('primary'), t.color('accent')];
  const inks = [t.color('surface'), t.color('secondary'), t.color('secondary')];
  const questions = t.list('questions');
  const answers = t.list('answers');
  return [
    backdrop(t.color('background')),
    heading(t.copy('title'), 140, 110, 1300, 100, t.color('text'), { fontWeight: 800 }),
    t.list('phases').map((phase, index) => {
      const x = 140 + index * 570;
      const ink = inks[index] ?? NV.plum;
      return [
        rect(x, 400, 530, 580, fills[index] ?? NV.plum, { name: 'Phase card', cornerRadius: 32 }),
        icon(PHASE_ICONS[index] ?? 'target', x + 40, 440, 56, ink, { strokeWidth: 2.2 }),
        heading(phase, x + 120, 448, 380, 40, ink),
        rect(x + 40, 540, 450, 2, ink, { name: 'Rule', opacity: 0.3 }),
        Array.from({ length: QUESTIONS_PER_PHASE }, (_, row) => {
          const item = index * QUESTIONS_PER_PHASE + row;
          return [
            copy(questions[item] ?? '', x + 40, 580 + row * 190, 450, 30, ink, {
              fontWeight: 700,
            }),
            copy(answers[item] ?? '', x + 40, 630 + row * 190, 450, 28, ink, { opacity: 0.85 }),
          ];
        }),
      ];
    }),
  ];
});
