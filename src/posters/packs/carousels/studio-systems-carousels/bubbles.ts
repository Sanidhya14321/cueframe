import { linear, radial } from '@/design';
import {
  circle,
  icon,
  type Nodes,
  POST_SIZE,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { FONT, KICKER, MUTED, NAVY, ROYAL, SKY, WHITE } from './windows-sliders';

const { width: W, height: H } = POST_SIZE;
const MIDNIGHT_END = '#020617';

const bubbles = (inner: string, outer: string): Nodes[] => {
  const fill = radial(inner, outer);
  return [circle(940, 150, 130, fill), circle(130, 1190, 110, fill)];
};

const coverSpec = {
  colors: {
    background: {
      value: NAVY,
      hint: 'Page gradient and the Swipe to continue button text and arrow; its darker shade colors the bottom of the page',
    },
    primary: { value: SKY, hint: 'Designing With AI and the two corner bubbles' },
    surface: { value: WHITE, hint: 'Swipe to continue button' },
    text: {
      value: WHITE,
      hint: 'Kicker and What I Learned; its grey shade colors the subtitle',
    },
  },
  fonts: { font: FONT },
  copy: {
    kicker: KICKER,
    title: { label: 'Headline', value: 'What I Learned' },
    accent: { label: 'Highlighted line', value: 'Designing With AI' },
    subtitle: {
      label: 'Subtitle',
      value: 'Real lessons from using AI\nin everyday creative work',
    },
    button: { label: 'Button', value: 'Swipe to continue' },
  },
} as const satisfies ThemeSpec;

export const bubblesCover = themed(W, H, coverSpec, (t) => {
  const centered = (label: string, y: number, size: number, weight: number, fill: string) =>
    text(label, 0, y, W, {
      fontFamily: t.font('font'),
      fontSize: size,
      fontWeight: weight,
      fill,
      align: 'center',
    });
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', MIDNIGHT_END)), {
      name: 'Background',
    }),
    bubbles(
      t.shade('primary', 'rgba(125,211,252,0.32)'),
      t.shade('primary', 'rgba(125,211,252,0.04)'),
    ),
    text(t.copy('kicker'), 0, 220, W, {
      fontFamily: t.font('font'),
      fontSize: 34,
      fontWeight: 800,
      fill: t.color('text'),
      letterSpacing: 2,
      align: 'center',
    }),
    centered(t.copy('title'), 420, 84, 800, t.color('text')),
    centered(t.copy('accent'), 520, 84, 800, t.color('primary')),
    text(t.copy('subtitle'), 0, 650, W, {
      fontFamily: t.font('font'),
      fontSize: 42,
      fontWeight: 500,
      fill: t.shade('text', MUTED),
      align: 'center',
      lineHeight: 1.35,
    }),
    rect(320, 840, 440, 100, t.color('surface'), { name: 'Swipe pill', cornerRadius: 50 }),
    text(t.copy('button'), 360, 868, 320, {
      fontFamily: t.font('font'),
      fontSize: 36,
      fontWeight: 700,
      fill: t.color('background'),
    }),
    icon('arrow-right', 686, 866, 48, t.color('background'), { strokeWidth: 2.75 }),
  ];
});

interface LessonStyle {
  from: string;
  to: string;
  accent: string;
  bubble: readonly [string, string];
  tile: string;
  tileEnd: string | undefined;
  number: string;
  ink: string;
  body: string;
  shadeName: string;
}

const DARK: LessonStyle = {
  from: NAVY,
  to: MIDNIGHT_END,
  accent: SKY,
  bubble: ['rgba(125,211,252,0.32)', 'rgba(125,211,252,0.04)'],
  tile: WHITE,
  tileEnd: undefined,
  number: NAVY,
  ink: WHITE,
  body: MUTED,
  shadeName: 'darker',
};

const LIGHT: LessonStyle = {
  from: WHITE,
  to: '#eaf3ff',
  accent: ROYAL,
  bubble: ['rgba(37,99,235,0.16)', 'rgba(37,99,235,0.02)'],
  tile: '#123a7a',
  tileEnd: '#07142b',
  number: WHITE,
  ink: NAVY,
  body: '#475569',
  shadeName: 'pale blue',
};

const lesson = (dark: boolean, number: string, lead: string, accent: string, copy: string) => {
  const style = dark ? DARK : LIGHT;
  return themed(
    W,
    H,
    {
      colors: {
        background: {
          value: style.from,
          hint: `Page gradient and the step number; its ${style.shadeName} shade colors the bottom of the page`,
        },
        primary: { value: style.accent, hint: 'Highlighted line and the two corner bubbles' },
        surface: { value: style.tile, hint: 'Number tile behind the step number' },
        text: {
          value: style.ink,
          hint: 'Lead line and the arrow button; its softer shade colors the body',
        },
      },
      fonts: { font: FONT },
      copy: {
        number: { label: 'Step number', value: number },
        lead: { label: 'Lead line', value: lead },
        accent: { label: 'Highlighted line', value: accent },
        body: { label: 'Body', value: copy },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const centered = (label: string, y: number, fill: string) =>
        text(label, 0, y, W, {
          fontFamily: t.font('font'),
          fontSize: 76,
          fontWeight: 800,
          fill,
          align: 'center',
        });
      return [
        rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', style.to)), {
          name: 'Background',
        }),
        bubbles(t.shade('primary', style.bubble[0]), t.shade('primary', style.bubble[1])),
        rect(
          465,
          300,
          150,
          150,
          style.tileEnd === undefined
            ? t.color('surface')
            : linear(160, t.color('surface'), t.shade('surface', style.tileEnd)),
          { name: 'Number tile', cornerRadius: 26 },
        ),
        text(t.copy('number'), 465, 334, 150, {
          fontFamily: t.font('font'),
          fontSize: 68,
          fontWeight: 800,
          fill: t.shade('background', style.number),
          align: 'center',
        }),
        centered(t.copy('lead'), 510, t.color('text')),
        centered(t.copy('accent'), 600, t.color('primary')),
        text(t.copy('body'), 150, 730, 780, {
          fontFamily: t.font('font'),
          fontSize: 40,
          fontWeight: 500,
          fill: t.shade('text', style.body),
          align: 'center',
          lineHeight: 1.4,
        }),
        rect(430, 960, 220, 84, t.shade('background', 'rgba(0,0,0,0)'), {
          name: 'Arrow pill',
          cornerRadius: 42,
          stroke: t.color('text'),
          strokeWidth: 4,
        }),
        icon('arrow-right', 512, 974, 56, t.color('text'), { strokeWidth: 2.5 }),
      ];
    },
  );
};

export const LESSON_STEPS = [
  lesson(
    false,
    '01',
    'AI Is a',
    'Starting Point',
    'It speeds up ideas, but the human touch is what turns them into impact.',
  ),
  lesson(
    true,
    '02',
    'Sharp Prompts,',
    'Sharper Results',
    'The more intentional your input, the more useful the output.',
  ),
  lesson(
    false,
    '03',
    'AI Boosts',
    'Creativity',
    'It removes friction, so you spend more time refining and less restarting.',
  ),
  lesson(
    true,
    '04',
    'Systems Beat',
    'Shiny Tools',
    'AI works best inside a repeatable workflow and a clear design system.',
  ),
] as const;
