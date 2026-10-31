import { type DesignIconName, linear } from '@/design';
import { icon, rect, shadow, type ThemeSpec, themed } from '../../../kit';
import { centered, DARK_PAGE, darkGlow, FONT, H, HANDLE, NEON, say, site, W } from './palette';

const impactCoverSpec = {
  colors: {
    background: {
      value: NEON.night,
      hint: 'Page gradient and the arrow inside the button',
    },
    primary: {
      value: NEON.pink,
      hint: 'Soft glow; its light rose shade colors the glow line beside Impact',
    },
    secondary: {
      value: NEON.lilac,
      hint: 'Ways To Build; its muted shade colors the subtitle',
    },
    text: { value: NEON.white, hint: 'Handle, Impact and the arrow button' },
  },
  fonts: { body: FONT },
  copy: {
    handle: HANDLE,
    kicker: { label: 'Kicker', value: 'Ways\nTo Build' },
    title: { label: 'Title', value: 'Impact' },
    subtitle: { label: 'Subtitle', value: 'in a fast moving\nAI industry' },
  },
} as const satisfies ThemeSpec;

export const impactCover = themed(W, H, impactCoverSpec, (t) => {
  const write = say(t.font('body'));
  return [
    darkGlow(t),
    site(t.copy('handle'), t.font('body'), 80, 90, t.color('text'), 'left'),
    write(t.copy('kicker'), 80, 380, 800, 92, t.color('secondary'), 300, { lineHeight: 1.1 }),
    write(t.copy('title'), 80, 590, 800, 140, t.color('text'), 800, { lineHeight: 1 }),
    rect(
      620,
      668,
      460,
      4,
      linear(90, t.shade('primary', NEON.rose), t.shade('primary', 'rgba(255,179,209,0)')),
      { name: 'Glow line' },
    ),
    write(t.copy('subtitle'), 80, 790, 800, 40, t.shade('secondary', NEON.muted), 400),
    rect(860, 1130, 120, 120, t.color('text'), { name: 'Arrow button', cornerRadius: 28 }),
    icon('arrow-right', 885, 1155, 70, t.shade('background', NEON.ink), { strokeWidth: 2.4 }),
  ];
});

const impactStep = (symbol: DesignIconName, title: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: NEON.night,
          hint: 'Page gradient and the icon inside the tile',
        },
        primary: {
          value: NEON.pink,
          hint: 'Soft glow and the tile glow; its rose shades color the glow line and the stem',
        },
        secondary: { value: NEON.muted, hint: 'Body paragraph' },
        text: { value: NEON.white, hint: 'Icon tile and the title' },
      },
      fonts: { body: FONT },
      copy: {
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const center = centered(t.font('body'));
      return [
        darkGlow(t),
        rect(
          0,
          640,
          W,
          4,
          linear(
            90,
            t.shade('primary', 'rgba(230,217,255,0)'),
            t.shade('primary', NEON.rose),
            t.shade('primary', 'rgba(230,217,255,0)'),
          ),
          { name: 'Glow line' },
        ),
        rect(538, 400, 4, 240, t.shade('primary', 'rgba(255,179,209,0.6)'), { name: 'Stem' }),
        rect(455, 240, 170, 170, t.color('text'), {
          name: 'Icon tile',
          cornerRadius: 36,
          ...shadow(60, 0, t.shade('primary', 'rgba(255,95,162,0.65)')),
        }),
        icon(symbol, 490, 275, 100, t.shade('background', NEON.ink), { strokeWidth: 2 }),
        center(t.copy('title'), 720, 70, t.color('text'), 700),
        center(t.copy('body'), 840, 36, t.color('secondary'), 400, { lineHeight: 1.5 }),
      ];
    },
  );

export const impactSystems = impactStep(
  'workflow',
  'Ship Small Systems',
  'Build AI tools that remove friction\nand respect how people work. Small,\nreliable wins beat big promises.',
);

export const impactCurious = impactStep(
  'lightbulb',
  'Stay Curious',
  "Don't just read about new tools.\nPrototype with them every week to\nbuild a real feel for what works.",
);

export const impactAgents = impactStep(
  'bot',
  'Lead the Agents',
  'Learn to frame clear problems and\nhand them to agents that can solve\nthem while you focus on strategy.',
);

const STACK_EDGE = 'rgba(230,217,255,0.16)';

const stackedCard = (surface: string, edge: string, lilac: string, glow: string) => [
  rect(0, 160, 64, 1030, edge, { name: 'Stack edge', cornerRadius: 30 }),
  rect(1016, 160, 64, 1030, edge, { name: 'Stack edge', cornerRadius: 30 }),
  rect(180, 0, 720, 70, edge, { name: 'Stack edge', cornerRadius: 26 }),
  rect(180, 1280, 720, 70, edge, { name: 'Stack edge', cornerRadius: 26 }),
  rect(100, 100, 880, 1150, linear(180, surface, lilac), {
    name: 'Card',
    cornerRadius: 64,
    ...shadow(50, 10, glow),
  }),
];

const darkPill = (
  label: string,
  x: number,
  y: number,
  width: number,
  fill: string,
  color: string,
  font: string,
) => [
  rect(x, y, width, 80, fill, { name: 'Dark pill', cornerRadius: 40 }),
  say(font)(label, x, y + 21, width, 30, color, 600, { align: 'center' }),
];

const flowCoverSpec = {
  colors: {
    background: DARK_PAGE,
    primary: {
      value: NEON.pink,
      hint: 'Workflows, the soft glow and the glow under the card',
    },
    surface: {
      value: NEON.white,
      hint: 'Card gradient, the stacked edges behind it and the pill labels',
    },
    text: { value: NEON.ink, hint: 'Handle, the title and both pills' },
  },
  fonts: { body: FONT },
  copy: {
    handle: HANDLE,
    kicker: { label: 'Kicker pill', value: 'Learn How' },
    title: { label: 'Title', value: 'To Automate\nUser Friendly' },
    highlight: { label: 'Highlight', value: 'Workflows' },
    swipe: { label: 'Swipe pill', value: 'Swipe to continue  →' },
  },
} as const satisfies ThemeSpec;

export const flowCover = themed(W, H, flowCoverSpec, (t) => {
  const center = centered(t.font('body'));
  const pill = (label: string, x: number, y: number, width: number) =>
    darkPill(label, x, y, width, t.color('text'), t.color('surface'), t.font('body'));
  return [
    darkGlow(t),
    stackedCard(
      t.color('surface'),
      t.shade('surface', STACK_EDGE),
      t.shade('surface', NEON.lilac),
      t.shade('primary', 'rgba(255,95,162,0.35)'),
    ),
    center(t.copy('handle'), 170, 30, t.color('text'), 500),
    pill(t.copy('kicker'), 410, 330, 260),
    center(t.copy('title'), 460, 80, t.color('text'), 400, { lineHeight: 1.1 }),
    center(t.copy('highlight'), 640, 96, t.color('primary'), 800),
    pill(t.copy('swipe'), 310, 830, 460),
  ];
});

const flowStep = (number: string, lead: string, accent: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: DARK_PAGE,
        primary: {
          value: NEON.pink,
          hint: 'Highlighted line, the soft glow and the glow under the card',
        },
        surface: {
          value: NEON.white,
          hint: 'Card gradient, the stacked edges behind it, the number and the arrow',
        },
        text: {
          value: NEON.ink,
          hint: 'Number tile, lead line and arrow pill; its softer shade colors the body',
        },
      },
      fonts: { body: FONT },
      copy: {
        number: { label: 'Number', value: number },
        lead: { label: 'Lead line', value: lead },
        accent: { label: 'Highlighted line', value: accent },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      const center = centered(t.font('body'));
      return [
        darkGlow(t),
        stackedCard(
          t.color('surface'),
          t.shade('surface', STACK_EDGE),
          t.shade('surface', NEON.lilac),
          t.shade('primary', 'rgba(255,95,162,0.35)'),
        ),
        rect(470, 250, 140, 140, t.color('text'), { name: 'Number tile', cornerRadius: 28 }),
        write(t.copy('number'), 470, 288, 140, 56, t.color('surface'), 700, {
          align: 'center',
          lineHeight: 1.1,
        }),
        center(t.copy('lead'), 460, 72, t.color('text'), 700, { lineHeight: 1.1 }),
        center(t.copy('accent'), 545, 72, t.color('primary'), 700, { lineHeight: 1.1 }),
        write(t.copy('body'), 170, 690, 740, 36, t.shade('text', '#4a3d5c'), 400, {
          align: 'center',
          lineHeight: 1.5,
        }),
        rect(440, 1010, 200, 80, t.color('text'), { name: 'Arrow pill', cornerRadius: 40 }),
        icon('arrow-right', 510, 1020, 60, t.color('surface'), { strokeWidth: 2.4 }),
      ];
    },
  );

export const flowJourney = flowStep(
  '01',
  'Sketch the',
  'Whole Journey',
  'Before choosing a tool, draw every\nstep a person takes from the first\nclick to the finished task.',
);

export const flowPrompts = flowStep(
  '02',
  'Sharper Prompts,',
  'Sharper Output',
  'The more specific your request,\nthe more useful the result.\nContext is the shortcut.',
);

export const flowFeedback = flowStep(
  '03',
  'Close the',
  'Feedback Loop',
  'Always show people what the\nsystem just did, with a simple\nstatus or a confirmation.',
);
