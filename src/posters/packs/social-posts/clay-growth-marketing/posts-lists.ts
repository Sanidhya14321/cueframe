import { linear } from '@/design';
import { circle, icon, poly, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, backdrop, button, CLAY, type ClayPalette, H, HEADING, W } from './clay';

const SEO_ICONS = ['search', 'key', 'refresh-cw', 'file-text', 'link', 'chart-line'] as const;

const seoSpec = {
  colors: {
    background: {
      value: CLAY.light,
      hint: 'Top of the page gradient; its deeper shade colors the bottom',
    },
    primary: { value: CLAY.brand, hint: 'SEO Checklist, the switched on toggles and the icons' },
    surface: {
      value: CLAY.paper,
      hint: 'Checklist card and toggle knobs; its shades color the switched off toggles and dividers',
    },
    text: {
      value: CLAY.ink,
      hint: 'Tasks; its lighter shade colors Your Monthly and the card shadow',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Your Monthly' },
    title: { label: 'Title', value: 'SEO Checklist' },
    tasks: {
      label: 'Task',
      value: [
        'Site health audit',
        'Keyword shortlist',
        'Refresh key pages',
        'Publish two articles',
        'Earn quality links',
        'Review the results',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const seoChecklist = themed(W, H, seoSpec, (t) => {
  const tasks = t.list('tasks');
  const toggle = (x: number, y: number, on: boolean) => [
    rect(x, y, 72, 40, on ? t.color('primary') : t.shade('surface', '#e7d6cd'), {
      cornerRadius: 20,
      name: 'Toggle',
    }),
    circle(on ? x + 52 : x + 20, y + 20, 15, t.color('surface')),
  ];
  return [
    backdrop(t.color('background'), t.shade('background', CLAY.soft)),
    text(t.copy('kicker'), 0, 120, W, {
      fontFamily: t.font('heading'),
      fontSize: 58,
      fontWeight: 500,
      fill: t.shade('text', CLAY.deep),
      align: 'center',
    }),
    text(t.copy('title'), 0, 196, W, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    rect(150, 380, 780, 800, t.color('surface'), {
      cornerRadius: 40,
      name: 'Checklist card',
      ...shadow(50, 22, t.shade('text', 'rgba(74,31,23,0.22)')),
    }),
    tasks.map((task, index) => {
      const y = 440 + index * 120;
      return [
        toggle(210, y + 4, index < 4),
        text(task, 310, y + 2, 460, {
          fontFamily: t.font('body'),
          fontSize: 36,
          fontWeight: 600,
          fill: t.color('text'),
        }),
        icon(SEO_ICONS[index] ?? 'search', 820, y, 46, t.color('primary')),
        index < tasks.length - 1
          ? rect(210, y + 84, 660, 2, t.shade('surface', '#f1e3db'), { name: 'Divider' })
          : [],
      ];
    }),
  ];
});

const knowSpec = {
  colors: {
    primary: {
      value: CLAY.brand,
      hint: 'Page gradient; its lighter shade colors the top of the page',
    },
    surface: {
      value: CLAY.paper,
      hint: 'DID YOU KNOW, the intro line, the button and the faded question marks',
    },
    secondary: { value: CLAY.deep, hint: 'Highlight behind YOU and the button label' },
    text: { value: CLAY.ink, hint: 'Punchline' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    marks: { label: 'Question mark', value: ['?', '?'] },
    words: { label: 'Headline word', value: ['DID', 'YOU', 'KNOW?'] },
    intro: { label: 'Intro', value: 'One clear plan' },
    punchline: { label: 'Punchline', value: 'Triples Your Reach' },
    cta: { label: 'Button', value: 'Read more' },
  },
} as const satisfies ThemeSpec;

export const didYouKnow = themed(W, H, knowSpec, (t) => {
  const heading = t.font('heading');
  const [bigMark = '', smallMark = ''] = t.list('marks');
  const [did = '', you = '', know = ''] = t.list('words');
  const headline = { fontFamily: heading, fontSize: 170, fontWeight: 800, lineHeight: 1 };
  return [
    rect(0, 0, W, H, linear(170, t.shade('primary', '#eba487'), t.color('primary')), {
      name: 'Background',
    }),
    text(bigMark, 640, 120, 400, {
      fontFamily: heading,
      fontSize: 520,
      fontWeight: 800,
      fill: t.shade('surface', 'rgba(255,255,255,0.75)'),
      lineHeight: 1,
    }),
    text(smallMark, 760, 760, 260, {
      fontFamily: heading,
      fontSize: 340,
      fontWeight: 800,
      fill: t.shade('surface', 'rgba(255,255,255,0.45)'),
      lineHeight: 1,
    }),
    text(did, 90, 200, 600, { ...headline, fill: t.color('surface') }),
    rect(90, 400, 420, 170, t.color('secondary'), {
      cornerRadius: 18,
      rotation: -5,
      name: 'Highlight',
    }),
    text(you, 120, 405, 400, {
      ...headline,
      fontSize: 150,
      fill: t.color('surface'),
      rotation: -5,
    }),
    text(know, 90, 590, 960, { ...headline, fill: t.color('surface') }),
    text(t.copy('intro'), 90, 840, 700, {
      fontFamily: t.font('body'),
      fontSize: 46,
      fontWeight: 500,
      fill: t.color('surface'),
    }),
    text(t.copy('punchline'), 90, 900, 760, {
      fontFamily: heading,
      fontSize: 54,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    button(t.copy('cta'), 90, 1100, t.color('surface'), t.color('secondary'), t.font('body')),
  ];
});

export const timeWaits = (palette: ClayPalette, lines: readonly [string, string, string]) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: palette.paper,
          hint: 'Top of the page gradient and the button label; its tint colors the bottom of the page',
        },
        primary: { value: palette.brand, hint: 'Headline and the sand' },
        secondary: {
          value: palette.deep,
          hint: 'Hourglass frame and outline, the subline and the button',
        },
        surface: { value: palette.soft, hint: 'Hourglass glass' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Headline', value: lines[0] },
        subtitle: { label: 'Subline', value: lines[1] },
        cta: { label: 'Button', value: lines[2] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const frame = t.color('secondary');
      const glass = { opacity: 0.45, stroke: frame, strokeWidth: 4 };
      return [
        backdrop(t.color('background'), t.shade('background', palette.light)),
        rect(640, 120, 380, 40, frame, { cornerRadius: 20, name: 'Hourglass cap' }),
        rect(640, 1180, 380, 40, frame, { cornerRadius: 20, name: 'Hourglass base' }),
        poly(
          [
            [670, 160],
            [990, 160],
            [850, 670],
            [810, 670],
          ],
          t.color('surface'),
          { name: 'Upper glass', ...glass },
        ),
        poly(
          [
            [810, 670],
            [850, 670],
            [990, 1180],
            [670, 1180],
          ],
          t.color('surface'),
          { name: 'Lower glass', ...glass },
        ),
        poly(
          [
            [740, 420],
            [920, 420],
            [850, 670],
            [810, 670],
          ],
          t.color('primary'),
          { name: 'Upper sand' },
        ),
        rect(824, 670, 12, 330, t.color('primary'), { name: 'Sand stream' }),
        poly(
          [
            [830, 990],
            [960, 1180],
            [700, 1180],
          ],
          t.color('primary'),
          { name: 'Lower sand' },
        ),
        text(t.copy('title'), 80, 470, 620, {
          fontFamily: t.font('heading'),
          fontSize: 92,
          fontWeight: 800,
          fill: t.color('primary'),
          lineHeight: 1,
        }),
        text(t.copy('subtitle'), 80, 580, 620, {
          fontFamily: t.font('heading'),
          fontSize: 64,
          fontWeight: 400,
          fill: frame,
        }),
        button(t.copy('cta'), 80, 720, frame, t.color('background'), t.font('body')),
      ];
    },
  );

export const TIME_WAITS = timeWaits(CLAY, ['Time Waits', 'for nobody', 'Start today']);
