import { linear } from '@/design';
import { circle, rect, star, type ThemeSpec, text, themed } from '../../../kit';
import {
  BACKGROUND,
  BODY,
  backdrop,
  CONDENSED,
  H,
  HANDLE,
  HEADING,
  MULBERRY,
  nextArrow,
  SCRIPT,
  say,
  W,
} from './palette';

const MOVE_COLORS = {
  background: BACKGROUND,
  primary: { value: MULBERRY.peach, hint: 'Script move label and the timeline dot' },
  secondary: { value: MULBERRY.blush, hint: 'Timeline, the dot ring and the body line' },
  text: { value: MULBERRY.white, hint: 'Big title and the next arrow' },
} as const;

const MOVE_FONTS = { heading: CONDENSED, script: SCRIPT, body: BODY } as const;

const moveSlide = (
  dotX: number,
  label: string,
  title: string,
  size: number,
  body: string,
  [bodyY, bodyWidth, bodySize]: readonly [number, number, number],
) =>
  themed(
    W,
    H,
    {
      colors: MOVE_COLORS,
      fonts: MOVE_FONTS,
      copy: {
        label: { label: 'Script label', value: label },
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
      rect(0, 206, W, 10, t.color('secondary'), { name: 'Timeline' }),
      circle(dotX, 211, 40, t.color('primary'), {
        stroke: t.color('secondary'),
        strokeWidth: 8,
      }),
      text(t.copy('title'), 90, 420, 940, {
        fontFamily: t.font('heading'),
        fontSize: size,
        fontWeight: 700,
        fill: t.color('text'),
        lineHeight: 0.95,
      }),
      text(t.copy('label'), 84, 300, 700, {
        fontFamily: t.font('script'),
        fontSize: 150,
        fontWeight: 700,
        fill: t.color('primary'),
        rotation: -4,
        lineHeight: 1,
      }),
      say(t.font('body'))(t.copy('body'), 90, bodyY, bodyWidth, bodySize, t.color('secondary')),
      nextArrow(t.color('text')),
    ],
  );

export const movesCover = moveSlide(
  420,
  '3 Moves',
  'TO OWN\nYOUR\nNICHE',
  210,
  'A simple plan for a crowded feed',
  [1080, 760, 38],
);

export const moveResearch = moveSlide(
  580,
  'Move 1',
  'RESEARCH\n& POSITION',
  180,
  'Pick one problem and own it\nbefore you chase reach.',
  [860, 820, 40],
);

export const movePublish = moveSlide(
  740,
  'Move 2',
  'PUBLISH\n& HOOK',
  180,
  'Lead with the payoff so people\nstop scrolling in a second.',
  [860, 820, 40],
);

export const moveRepeat = moveSlide(
  900,
  'Move 3',
  'REPEAT\n& RETAIN',
  180,
  'Turn quick attention into\ntrust that lasts all year.',
  [860, 820, 40],
);

const BAR_TOP = 720;
const BAR_HEIGHT = 230;

const GAP_COLORS = {
  background: BACKGROUND,
  primary: {
    value: MULBERRY.peach,
    hint: 'Highlighted word and the big bars; its deeper shade is the end of the bar gradient',
  },
  secondary: { value: MULBERRY.blush, hint: 'Small bars, the tagline and the handle' },
  text: { value: MULBERRY.white, hint: 'Headline' },
} as const;

const gapBars = (gap: number, start: string, end: string, small: string) => {
  const leftEnd = (W - gap) / 2;
  const fill = linear(180, start, end);
  return [
    rect(0, BAR_TOP, leftEnd, BAR_HEIGHT, fill, {
      name: 'Left bar',
      cornerRadius: BAR_HEIGHT / 2,
    }),
    rect(0, BAR_TOP + BAR_HEIGHT + 40, leftEnd - 120, 110, small, {
      name: 'Left bar small',
      cornerRadius: 55,
    }),
    rect(leftEnd + gap, BAR_TOP, W - leftEnd - gap, BAR_HEIGHT, fill, {
      name: 'Right bar',
      cornerRadius: BAR_HEIGHT / 2,
    }),
    rect(leftEnd + gap + 120, BAR_TOP - 150, W - leftEnd - gap - 120, 110, small, {
      name: 'Right bar small',
      cornerRadius: 55,
    }),
  ];
};

export const gapCover = themed(
  W,
  H,
  {
    colors: GAP_COLORS,
    fonts: { heading: HEADING, body: BODY },
    copy: {
      first: { label: 'First word', value: 'Close' },
      second: { label: 'Second word', value: 'the' },
      highlight: { label: 'Highlighted word', value: 'Gap' },
      tagline: { label: 'Tagline', value: "You're this close" },
      handle: HANDLE,
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const heading = say(t.font('heading'));
    const body = say(t.font('body'));
    return [
      backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
      heading(t.copy('first'), 90, 150, 800, 150, t.color('text'), 800, { lineHeight: 1 }),
      heading(t.copy('second'), 90, 310, 300, 150, t.color('text'), 800, { lineHeight: 1 }),
      heading(t.copy('highlight'), 350, 310, 500, 150, t.color('primary'), 800, {
        lineHeight: 1,
      }),
      body(t.copy('tagline'), 90, 500, 600, 40, t.color('secondary'), 500),
      gapBars(440, t.color('primary'), t.shade('primary', '#f2875b'), t.color('secondary')),
      body(t.copy('handle'), 90, 1230, 600, 34, t.color('secondary'), 500),
    ];
  },
);

const gapStep = (gap: number, line: string, accent: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: BACKGROUND,
        primary: {
          value: MULBERRY.peach,
          hint: 'Second line, the big bars and the star; its deeper shade is the end of the bar gradient',
        },
        secondary: { value: MULBERRY.blush, hint: 'Small bars' },
        text: { value: MULBERRY.white, hint: 'First line' },
      },
      fonts: { heading: HEADING },
      copy: {
        line: { label: 'First line', value: line },
        accent: { label: 'Second line', value: accent },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = say(t.font('heading'));
      return [
        backdrop(t.color('background'), t.shade('background', MULBERRY.deep)),
        heading(t.copy('line'), 90, 360, 800, 64, t.color('text'), 700, { lineHeight: 1.1 }),
        heading(t.copy('accent'), 90, 436, 800, 64, t.color('primary'), 700, { lineHeight: 1.1 }),
        gapBars(gap, t.color('primary'), t.shade('primary', '#f2875b'), t.color('secondary')),
        star(4, 520, 230, 50, t.color('primary'), { innerRatio: 0.3 }),
      ];
    },
  );

export const gapCloser = gapStep(260, 'Getting', 'closer.');
export const gapSwipe = gapStep(130, 'Keep', 'swiping.');
export const gapLast = gapStep(30, 'One swipe', 'away.');
