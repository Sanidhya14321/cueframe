import { type Fill, linear } from '@/design';
import {
  circle,
  icon,
  poly,
  rect,
  STORY_SIZE,
  shadow,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  brandMark,
  darkBackdrop,
  engineeredToScale,
  H,
  HEADING,
  pinkGlow,
  promptPipelines,
  ROSE,
  shipPlaybooks,
  standApart,
  W,
} from './posts';

const ROLLING_STEPS = [-2, -1, 1, 2];

const counterSpec = {
  colors: {
    background: {
      value: ROSE.wine,
      hint: 'Page gradient; its darker shade fills the lower page',
    },
    primary: {
      value: ROSE.pink,
      hint: 'Top glow and the highlighted number; its deeper shade ends the number gradient',
    },
    text: {
      value: ROSE.white,
      hint: 'Left number, label, brand name, the faded rolling numbers and the subline (60%); its grey shade ends the left number gradient',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    rolling: { label: 'Rolling number', value: ['80', '81', '83', '84'] },
    left: { label: 'Left number', value: '31' },
    highlight: { label: 'Highlight number', value: '82' },
    label: { label: 'Label', value: 'New Teams' },
    subline: { label: 'Subline', value: 'joined this quarter' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const counter = (height: number) =>
  themed(W, height, counterSpec, (t) => {
    const center = height * 0.44;
    const row = 240;
    const heading = t.font('heading');
    const body = t.font('body');
    const number = (label: string, x: number, width: number, fill: Fill, align: 'left' | 'right') =>
      text(label, x, center - 120, width, {
        fontFamily: heading,
        fontSize: 220,
        fontWeight: 800,
        fill,
        align,
        lineHeight: 1,
      });
    return [
      darkBackdrop(
        height,
        linear(
          180,
          t.color('background'),
          t.shade('background', ROSE.night),
          t.shade('background', ROSE.night),
        ),
        pinkGlow((exact) => t.shade('primary', exact), 0.34, 0.1),
      ),
      t.list('rolling').map((value, index) => {
        const step = ROLLING_STEPS[index] ?? 0;
        return text(value, 560, center - 120 + step * row, 420, {
          fontFamily: heading,
          fontSize: 220,
          fontWeight: 800,
          fill: t.shade('text', `rgba(255,255,255,${Math.abs(step) === 1 ? 0.22 : 0.08})`),
          lineHeight: 1,
        });
      }),
      number(
        t.copy('left'),
        80,
        470,
        linear(180, t.color('text'), t.shade('text', '#c9b4c0')),
        'right',
      ),
      number(
        t.copy('highlight'),
        560,
        420,
        linear(180, t.color('primary'), t.shade('primary', ROSE.magenta)),
        'left',
      ),
      text(t.copy('label'), 180, center + 130, 400, {
        fontFamily: body,
        fontSize: 46,
        fontWeight: 500,
        fill: t.color('text'),
      }),
      text(t.copy('subline'), 180, center + 192, 380, {
        fontFamily: body,
        fontSize: 30,
        fontWeight: 400,
        fill: t.shade('text', 'rgba(255,255,255,0.6)'),
      }),
      brandMark(t.copy('brand'), 0, height - 140, W, t.color('text'), heading, 'center'),
    ];
  });

export const counterPost = counter(H);

export const counterStory = counter(STORY_SIZE.height);

const noiseSpec = {
  colors: {
    background: {
      value: ROSE.paper,
      hint: 'Page gradient; its pink shades fill the lower right',
    },
    primary: {
      value: ROSE.magenta,
      hint: 'More and the arrow; its lighter shades color Less noise. and start the arrow gradients',
    },
    text: {
      value: ROSE.ink,
      hint: 'Brand name and signal; its muted shade colors the body copy',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    first: { label: 'Headline top', value: 'Less noise.' },
    second: { label: 'Headline middle', value: 'More' },
    third: { label: 'Headline bottom', value: 'signal' },
    body: { label: 'Body', value: 'Let AI sort what\nmatters in your\nsales pipeline' },
  },
} as const satisfies ThemeSpec;

const lessNoise = themed(W, H, noiseSpec, (t) => {
  const heading = t.font('heading');
  const line = (label: string, y: number, fill: string) =>
    text(label, 80, y, 920, {
      fontFamily: heading,
      fontSize: 104,
      fontWeight: 700,
      fill,
      lineHeight: 1,
    });
  return [
    rect(
      0,
      0,
      W,
      H,
      linear(
        160,
        t.color('background'),
        t.shade('background', '#ffe4f0'),
        t.shade('background', '#ffc6de'),
      ),
      { name: 'Background' },
    ),
    brandMark(t.copy('brand'), 80, 90, 600, t.color('text'), heading),
    line(t.copy('first'), 220, t.shade('primary', ROSE.pink)),
    line(t.copy('second'), 340, t.color('primary')),
    line(t.copy('third'), 460, t.color('text')),
    text(t.copy('body'), 80, 680, 520, {
      fontFamily: t.font('body'),
      fontSize: 44,
      fontWeight: 400,
      fill: t.shade('text', ROSE.muted),
      lineHeight: 1.3,
    }),
    poly(
      [
        [560, 700],
        [640, 620],
        [900, 880],
        [820, 960],
      ],
      linear(135, t.shade('primary', '#ff9cc4'), t.color('primary')),
      { name: 'Arrow shaft' },
    ),
    poly(
      [
        [1000, 760],
        [1000, 1100],
        [660, 1100],
      ],
      linear(135, t.shade('primary', ROSE.pink), t.color('primary')),
      { name: 'Arrow head' },
    ),
  ];
});

const topSpec = {
  colors: {
    background: { value: ROSE.paper, hint: 'Page gradient; its pink shade fills the bottom' },
    primary: {
      value: ROSE.magenta,
      hint: 'Playbooks, the faint big number (10%) and the row arrows; its dark shade tints the row shadows',
    },
    surface: { value: ROSE.white, hint: 'Playbook rows' },
    text: { value: ROSE.ink, hint: 'Top 5, the playbook names and the brand name' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    number: { label: 'Big number', value: '5' },
    title: { label: 'Title', value: 'Top 5' },
    highlight: { label: 'Highlight', value: 'Playbooks' },
    rows: {
      label: 'Playbook',
      value: ['Lead Scoring', 'Inbox Triage', 'Churn Alerts', 'Deal Forecasts', 'Onboarding Flows'],
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const topFive = themed(W, H, topSpec, (t) => {
  const heading = t.font('heading');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#ffd0e4')), {
      name: 'Background',
    }),
    text(t.copy('number'), 400, 300, 660, {
      fontFamily: heading,
      fontSize: 900,
      fontWeight: 800,
      fill: t.shade('primary', 'rgba(214,36,110,0.1)'),
      lineHeight: 1,
    }),
    text(t.copy('title'), 0, 110, W, {
      fontFamily: heading,
      fontSize: 112,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1,
    }),
    text(t.copy('highlight'), 0, 230, W, {
      fontFamily: heading,
      fontSize: 100,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
    }),
    t.list('rows').map((label, index) => {
      const y = 420 + index * 124;
      return [
        rect(250, y, 580, 88, t.color('surface'), {
          name: 'Row',
          cornerRadius: 44,
          ...shadow(24, 8, t.shade('primary', 'rgba(120,10,60,0.14)')),
        }),
        icon('arrow-up-right', 282, y + 24, 40, t.color('primary'), { strokeWidth: 2.4 }),
        text(label, 346, y + 24, 460, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: 600,
          fill: t.color('text'),
        }),
      ];
    }),
    brandMark(t.copy('brand'), 0, 1210, W, t.color('text'), heading, 'center'),
  ];
});

const chatSpec = {
  colors: {
    background: {
      value: ROSE.wine,
      hint: 'Page gradient; its darker shades fill the lower page and the customer icon',
    },
    primary: {
      value: ROSE.pink,
      hint: 'Top glow and the glow around the agent badge; its deeper shade colors the sparkles icon',
    },
    surface: { value: ROSE.white, hint: 'Customer and agent avatar circles' },
    text: {
      value: ROSE.white,
      hint: 'Message, brand name, speaker labels (60%), typing dots and the message bubble outline and faint fill',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    speakers: { label: 'Speaker', value: ['Customer', 'AI Agent'] },
    message: { label: 'Message', value: 'Can you tidy up my backlog?' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const agentChat = themed(W, H, chatSpec, (t) => {
  const body = t.font('body');
  const [customer = '', agent = ''] = t.list('speakers');
  const speaker = (label: string, x: number, y: number, width: number) =>
    text(label, x, y, width, {
      fontFamily: body,
      fontSize: 30,
      fontWeight: 500,
      fill: t.shade('text', 'rgba(255,255,255,0.6)'),
    });
  return [
    darkBackdrop(
      H,
      linear(
        180,
        t.color('background'),
        t.shade('background', ROSE.night),
        t.shade('background', ROSE.night),
      ),
      pinkGlow((exact) => t.shade('primary', exact), 0.34, 0.1),
    ),
    speaker(customer, 230, 600, 400),
    circle(150, 690, 46, t.color('surface')),
    icon('user', 124, 664, 52, t.shade('background', ROSE.ink), { strokeWidth: 2.2 }),
    rect(230, 645, 700, 92, t.shade('text', 'rgba(255,255,255,0.06)'), {
      name: 'Message bubble',
      cornerRadius: 46,
      stroke: t.shade('text', 'rgba(255,255,255,0.55)'),
      strokeWidth: 2,
    }),
    text(t.copy('message'), 230, 670, 700, {
      fontFamily: body,
      fontSize: 36,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    speaker(agent, 640, 860, 300),
    [0, 1, 2].map((index) =>
      circle(
        660 + index * 34,
        960 - (index === 1 ? 12 : 0),
        11,
        t.shade('text', `rgba(255,255,255,${0.5 + index * 0.2})`),
      ),
    ),
    circle(840, 960, 62, t.color('surface'), {
      ...shadow(50, 0, t.shade('primary', 'rgba(255,111,168,0.9)')),
    }),
    icon('sparkles', 806, 926, 68, t.shade('primary', ROSE.magenta), { strokeWidth: 2 }),
    brandMark(t.copy('brand'), 0, 1210, W, t.color('text'), t.font('heading'), 'center'),
  ];
});

export const POSTS: readonly Template[] = [
  promptPipelines,
  engineeredToScale,
  standApart,
  counterPost,
  shipPlaybooks,
  lessNoise,
  agentChat,
  topFive,
];
