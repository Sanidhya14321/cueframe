import { linear } from '@/design';
import {
  arrow,
  circle,
  icon,
  POST_SIZE,
  rect,
  rotateNodes,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

const { width: W, height: H } = POST_SIZE;
const FONT = 'Inter';
const INK = '#0f172a';
const FONTS = {
  heading: { label: 'Heading font', value: FONT },
  body: { label: 'Body font', value: FONT },
} as const;

type GlowSpec = {
  colors: {
    background: { value: string; hint: string };
    primary: { value: string; hint: string };
  };
};

const glowFrame = <S extends ThemeSpec & GlowSpec>(t: Theme<S>, panel: string) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  rect(
    40,
    40,
    W - 80,
    H - 80,
    linear(135, t.shade('primary', '#a3e635'), t.color('primary'), t.shade('primary', '#6366f1')),
    {
      name: 'Glow frame',
      cornerRadius: 64,
      ...shadow(36, 0, t.shade('primary', 'rgba(20,184,166,0.5)')),
    },
  ),
  rect(54, 54, W - 108, H - 108, panel, { name: 'Panel', cornerRadius: 52 }),
];

const GLOW_HINT = 'Glow frame gradient and its glow';

const promptCoverSpec = {
  colors: {
    background: {
      value: '#ffffff',
      hint: 'Page and the panel inside the glow frame, the swipe bar and the arrow in its round button',
    },
    primary: { value: '#14b8a6', hint: `${GLOW_HINT}, and the swipe bar outline` },
    text: {
      value: INK,
      hint: 'Kicker, headline, sparkles icon, swipe label and the round arrow button',
    },
  },
  fonts: FONTS,
  copy: {
    kicker: { label: 'Kicker', value: 'SAVE HOURS EVERY WEEK' },
    title: { label: 'Headline', value: '3 Prompts\nthat Unlock\nDeep Work' },
    swipe: { label: 'Swipe label', value: 'Swipe to continue' },
  },
} as const satisfies ThemeSpec;

export const promptCover = themed(W, H, promptCoverSpec, (t) => [
  glowFrame(t, t.color('background')),
  text(t.copy('kicker'), 120, 420, 840, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 700,
    fill: t.color('text'),
    letterSpacing: 2,
  }),
  text(t.copy('title'), 120, 480, 860, {
    fontFamily: t.font('heading'),
    fontSize: 108,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.04,
  }),
  rect(110, 1080, 860, 104, t.color('background'), {
    name: 'Swipe bar',
    cornerRadius: 52,
    stroke: t.color('primary'),
    strokeWidth: 4,
  }),
  icon('sparkles', 150, 1110, 46, t.color('text'), { strokeWidth: 2 }),
  text(t.copy('swipe'), 216, 1110, 500, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  circle(906, 1132, 36, t.color('text')),
  icon('arrow-right', 886, 1112, 40, t.color('background'), { strokeWidth: 2.5 }),
]);

const promptStep = (title: string, body: string, prompt: string) => {
  const spec = {
    colors: {
      background: { value: '#ffffff', hint: 'Page corners outside the glow frame' },
      surface: {
        value: '#0a1412',
        hint: 'Dark panel inside the frame; its shades color the prompt box outline and the play icon',
      },
      primary: { value: '#14b8a6', hint: GLOW_HINT },
      text: {
        value: '#ffffff',
        hint: 'Title, mic icon and play button; its shades color the description, the prompt and the prompt box tint',
      },
    },
    fonts: FONTS,
    copy: {
      title: { label: 'Title', value: title },
      body: { label: 'Description', value: body },
      prompt: { label: 'Prompt', value: prompt },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    glowFrame(t, t.color('surface')),
    text(t.copy('title'), 100, 290, 880, {
      fontFamily: t.font('heading'),
      fontSize: 70,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('body'), 150, 400, 780, {
      fontFamily: t.font('body'),
      fontSize: 46,
      fontWeight: 400,
      fill: t.shade('text', '#d1d5db'),
      align: 'center',
      lineHeight: 1.35,
    }),
    rect(150, 730, 780, 400, t.shade('text', 'rgba(255,255,255,0.05)'), {
      name: 'Prompt box',
      cornerRadius: 36,
      stroke: t.shade('surface', '#3b4a47'),
      strokeWidth: 3,
    }),
    text(t.copy('prompt'), 195, 775, 690, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 400,
      fill: t.shade('text', '#e5e7eb'),
      lineHeight: 1.45,
    }),
    icon('mic', 770, 1050, 46, t.color('text'), { strokeWidth: 2 }),
    circle(880, 1073, 34, t.color('text')),
    icon('play', 864, 1056, 34, t.shade('surface', INK), { strokeWidth: 2.5 }),
  ]);
};

export const PROMPT_STEPS = [
  promptStep(
    'Name the Goal',
    'Tell the AI what a great result looks like before you ask for anything.',
    'Draft a weekly update for our sales team that highlights three wins and one blocker.',
  ),
  promptStep(
    'Ask for a Format',
    'Request steps, tables or bullets so the answer arrives ready to use.',
    'Turn these meeting notes into a five step checklist with owners and due dates.',
  ),
  promptStep(
    'Give It Context',
    'Share the audience, tone and limits so the draft sounds like you.',
    'Write a friendly teaser for busy clinic owners in under eighty words, no jargon.',
  ),
] as const;

const plannerCoverSpec = {
  colors: {
    background: { value: '#ffffff', hint: 'Page gradient' },
    surface: { value: '#ffffff', hint: 'Calendar card, the WEEK label and the tag text' },
    primary: { value: '#0d9488', hint: 'Calendar header' },
    accent: { value: '#f97316', hint: 'Content Planner tag and its glow' },
    text: {
      value: INK,
      hint: 'Calendar number, Weekly Template and the arrow; its shade tints the calendar shadow',
    },
  },
  fonts: { heading: { label: 'Heading font', value: FONT } },
  copy: {
    header: { label: 'Calendar header', value: 'WEEK' },
    day: { label: 'Calendar number', value: '7' },
    tag: { label: 'Tag', value: 'Content Planner' },
    title: { label: 'Title', value: 'Weekly Template' },
  },
} as const satisfies ThemeSpec;

export const plannerCover = themed(W, H, plannerCoverSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#eef2f1')), {
    name: 'Background',
  }),
  rect(370, 230, 340, 380, t.color('surface'), {
    name: 'Calendar',
    cornerRadius: 40,
    ...shadow(40, 18, t.shade('text', 'rgba(15,23,42,0.18)')),
  }),
  rect(370, 230, 340, 120, t.color('primary'), { name: 'Calendar header', cornerRadius: 40 }),
  rect(370, 310, 340, 40, t.color('primary'), { name: 'Calendar header edge' }),
  text(t.copy('header'), 370, 256, 340, {
    fontFamily: t.font('heading'),
    fontSize: 56,
    fontWeight: 800,
    fill: t.color('surface'),
    align: 'center',
    letterSpacing: 4,
  }),
  text(t.copy('day'), 370, 360, 340, {
    fontFamily: t.font('heading'),
    fontSize: 220,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1,
  }),
  rotateNodes(-4, 540, 730, [
    rect(230, 670, 620, 120, t.color('accent'), {
      name: 'Tag',
      cornerRadius: 28,
      ...shadow(20, 8, t.shade('accent', 'rgba(249,115,22,0.35)')),
    }),
    text(t.copy('tag'), 230, 690, 620, {
      fontFamily: t.font('heading'),
      fontSize: 66,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
    }),
  ]),
  text(t.copy('title'), 0, 840, W, {
    fontFamily: t.font('heading'),
    fontSize: 66,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
  }),
  arrow(450, 1010, 180, t.color('text'), 8),
]);

interface PlannerDay {
  day: string;
  tasks: readonly string[];
}

const plannerStepSpec = (title: string, range: string, days: readonly PlannerDay[]) =>
  ({
    colors: {
      background: { value: '#ffffff', hint: 'Page and the active step number' },
      surface: {
        value: '#f1f5f9',
        hint: 'Step bar at the top; its shade colors the rule under it',
      },
      primary: { value: '#0d9488', hint: 'Teal task bars: the edge and its light fill' },
      secondary: { value: '#6366f1', hint: 'Indigo task bars: the edge and its light fill' },
      accent: {
        value: '#f97316',
        hint: 'Active step circle and the orange task bars; its shades color the yellow task bars',
      },
      text: {
        value: INK,
        hint: 'Title, step numbers and tasks; its shades color the date range and day labels',
      },
    },
    fonts: FONTS,
    copy: {
      steps: { label: 'Step number', value: ['1', '2', '3'] },
      title: { label: 'Title', value: title },
      range: { label: 'Date range', value: range },
      days: { label: 'Day', value: days.map((group) => group.day) },
      tasks: { label: 'Task', value: days.flatMap((group) => group.tasks) },
    },
  }) as const satisfies ThemeSpec;

type PlannerTheme = Theme<ReturnType<typeof plannerStepSpec>>;

const taskTones = (t: PlannerTheme) => [
  { fill: t.shade('primary', '#ccfbf1'), edge: t.color('primary') },
  { fill: t.shade('accent', '#ffedd5'), edge: t.color('accent') },
  { fill: t.shade('secondary', '#e0e7ff'), edge: t.color('secondary') },
  { fill: t.shade('accent', '#fef9c3'), edge: t.shade('accent', '#ca8a04') },
];

const plannerStep = (active: number, title: string, range: string, days: readonly PlannerDay[]) =>
  themed(W, H, plannerStepSpec(title, range, days), (t) => {
    const tones = taskTones(t);
    const dayLabels = t.list('days');
    const tasks = t.list('tasks');
    let y = 440;
    let taskCursor = 0;
    const rows = days.map((group, groupIndex) => {
      const startY = y;
      const bars = group.tasks.map((_, taskIndex) => {
        const tone = tones[(groupIndex * 2 + taskIndex + active) % tones.length] ?? tones[0];
        const barY = startY + taskIndex * 150;
        const task = tasks[taskCursor] ?? '';
        taskCursor += 1;
        return [
          rect(210, barY, 810, 110, tone?.fill ?? '', { name: 'Task', cornerRadius: 10 }),
          rect(210, barY, 12, 110, tone?.edge ?? '', { name: 'Task edge', cornerRadius: 6 }),
          text(task, 250, barY + 30, 750, {
            fontFamily: t.font('body'),
            fontSize: 40,
            fontWeight: 700,
            fill: t.color('text'),
          }),
        ];
      });
      y = startY + group.tasks.length * 150 + 60;
      return [
        text(dayLabels[groupIndex] ?? '', 60, startY + 30, 140, {
          fontFamily: t.font('body'),
          fontSize: 38,
          fontWeight: 700,
          fill: t.shade('text', '#334155'),
        }),
        bars,
      ];
    });
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      rect(0, 0, W, 170, t.color('surface'), { name: 'Step bar' }),
      rect(0, 168, W, 3, t.shade('surface', '#e2e8f0'), { name: 'Step rule' }),
      t.list('steps').map((step, index) => [
        index === active ? circle(400 + index * 140, 85, 44, t.color('accent')) : [],
        text(step, 350 + index * 140, 58, 100, {
          fontFamily: t.font('body'),
          fontSize: 50,
          fontWeight: 600,
          fill: index === active ? t.color('background') : t.color('text'),
          align: 'center',
        }),
      ]),
      text(t.copy('title'), 0, 220, W, {
        fontFamily: t.font('heading'),
        fontSize: 78,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('range'), 0, 320, W, {
        fontFamily: t.font('body'),
        fontSize: 42,
        fontWeight: 400,
        fill: t.shade('text', '#475569'),
        align: 'center',
      }),
      rows,
    ];
  });

export const PLANNER_STEPS = [
  plannerStep(0, 'Plan & Draft', 'Monday to Tuesday', [
    { day: 'Mon', tasks: ['Audit last week numbers', 'Pick three post topics'] },
    { day: 'Tue', tasks: ['Sketch the visuals', 'Write hooks and captions'] },
  ]),
  plannerStep(1, 'Publish & Share', 'Wednesday to Thursday', [
    { day: 'Wed', tasks: ['Schedule every post', 'Polish captions and tags'] },
    { day: 'Thu', tasks: ['Share in two groups', 'Check early results'] },
  ]),
  plannerStep(2, 'Reply & Review', 'Friday', [
    {
      day: 'Fri',
      tasks: [
        'Answer every comment',
        'Join two conversations',
        'Review the analytics',
        'Draft next week plan',
      ],
    },
  ]),
] as const;
