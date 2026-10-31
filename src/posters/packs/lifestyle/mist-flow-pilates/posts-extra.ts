import { linear } from '@/design';
import {
  circle,
  ellipse,
  icon,
  POST_SIZE,
  photo,
  pill,
  rect,
  STORY_SIZE,
  shadow,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, MIST, SERIF, TALL } from './palette';

const { width: W, height: H } = POST_SIZE;

interface ScheduleStyle {
  top: string;
  bottom: string;
  chip: string;
  bar: string;
  start: string;
  end: string;
  title: string;
}

const scheduleSpec = (style: ScheduleStyle) =>
  ({
    colors: {
      background: {
        value: style.top,
        hint: 'Top of the page gradient; its darker shade colors the bottom',
      },
      surface: { value: MIST.white, hint: 'Calendar card' },
      primary: { value: MIST.ink, hint: 'Class name and the calendar card shadow' },
      secondary: {
        value: MIST.slate,
        hint: 'Start and end times, the clock and the time range; its lighter shade colors the hour line',
      },
      accent: { value: style.chip, hint: 'Class block; its deeper shade colors the block bar' },
    },
    fonts: { body: BODY },
    copy: {
      start: { label: 'Start time', value: style.start },
      end: { label: 'End time', value: style.end },
      title: { label: 'Class', value: style.title },
      range: { label: 'Time range', value: `${style.start} - ${style.end}` },
    },
  }) as const satisfies ThemeSpec;

const schedule = (style: ScheduleStyle): Template =>
  themed(W, H, scheduleSpec(style), (t) => {
    const time = (content: string, y: number) =>
      text(content, 140, y, 120, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 500,
        fill: t.color('secondary'),
      });
    return [
      rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', style.bottom)), {
        name: 'Background',
      }),
      photo('yoga-2', 170, 480, 740, 800, { cornerRadius: 48 }),
      rect(110, 170, 860, 230, t.color('surface'), {
        cornerRadius: 26,
        name: 'Calendar card',
        ...shadow(40, 16, t.shade('primary', 'rgba(30,42,51,0.2)')),
      }),
      time(t.copy('start'), 196),
      time(t.copy('end'), 336),
      rect(270, 230, 670, 2, t.shade('secondary', MIST.fog), { name: 'Hour line' }),
      rect(270, 238, 670, 120, t.color('accent'), { name: 'Event' }),
      rect(270, 238, 10, 120, t.shade('accent', style.bar), { name: 'Event bar' }),
      text(t.copy('title'), 306, 254, 600, {
        fontFamily: t.font('body'),
        fontSize: 38,
        fontWeight: 700,
        fill: t.color('primary'),
      }),
      icon('clock', 306, 310, 30, t.color('secondary')),
      text(t.copy('range'), 346, 308, 400, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 500,
        fill: t.color('secondary'),
      }),
    ];
  });

export const sundayPilates = schedule({
  top: MIST.mist,
  bottom: MIST.fog,
  chip: MIST.mint,
  bar: MIST.sage,
  start: '07:00',
  end: '08:00',
  title: 'Sunday Pilates',
});

export const morningMeditation = schedule({
  top: MIST.white,
  bottom: '#f2eefb',
  chip: '#e6defa',
  bar: '#7b6bb5',
  start: '05:30',
  end: '06:30',
  title: 'Morning Meditation',
});

const treeSpec = {
  colors: {
    background: {
      value: MIST.white,
      hint: 'Top of the page gradient; its darker shade colors the bottom',
    },
    primary: { value: MIST.ink, hint: 'Pose name and the pill text' },
    secondary: { value: MIST.slate, hint: 'Pose description' },
    accent: { value: MIST.mint, hint: 'Hold for 5 breaths pill' },
  },
  fonts: { serif: SERIF, body: BODY },
  copy: {
    title: { label: 'Pose', value: '{tree pose}' },
    body: {
      label: 'Description',
      value:
        'A standing balance where\nyour weight rests on one\nleg while the other foot\npresses into the inner\ncalf or thigh. Palms meet\nat the heart or reach up.',
    },
    cue: { label: 'Pill text', value: 'Hold for 5 breaths' },
  },
} as const satisfies ThemeSpec;

const treePose = (height: number): Template =>
  themed(W, height, treeSpec, (t) => {
    const mid = height / 2;
    return [
      rect(0, 0, W, height, linear(180, t.color('background'), t.shade('background', MIST.fog)), {
        name: 'Background',
      }),
      photo('woman-portrait-3', 60, 100, 470, height - 200, { cornerRadius: 40 }),
      text(t.copy('title'), 580, mid - 290, 460, {
        fontFamily: t.font('serif'),
        fontSize: 92,
        fontWeight: 400,
        fill: t.color('primary'),
      }),
      text(t.copy('body'), 584, mid - 150, 440, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 400,
        fill: t.color('secondary'),
        lineHeight: 1.5,
      }),
      pill(t.copy('cue'), 584, mid + 160, {
        width: 330,
        fill: t.color('accent'),
        color: t.color('primary'),
        fontSize: 28,
        fontFamily: t.font('body'),
        fontWeight: 600,
      }),
    ];
  });

export const treePosePost = treePose(H);
export const treePoseStory = treePose(STORY_SIZE.height);

const stressSpec = {
  colors: {
    background: { value: MIST.mist, hint: 'Page behind the tiles' },
    surface: {
      value: MIST.white,
      hint: 'Tile lines and the top of the glass; its darker shade colors the bottom of the glass',
    },
    secondary: { value: MIST.slate, hint: 'Box frame around the glass' },
    text: {
      value: MIST.ink,
      hint: 'IN CASE OF, EMERGENCY, the BREAK THE GLASS footer and the box shadow',
    },
    primary: { value: MIST.sage, hint: 'STRESS headline' },
    accent: { value: MIST.sand, hint: 'Rolled yoga mat; its darker shade colors the mat ends' },
  },
  fonts: { display: TALL, body: BODY },
  copy: {
    top: { label: 'Top line', value: 'IN CASE OF' },
    headline: { label: 'Headline', value: 'STRESS' },
    bottom: { label: 'Bottom line', value: 'EMERGENCY' },
    footer: { label: 'Footer', value: 'BREAK THE GLASS. UNROLL THE MAT.' },
  },
} as const satisfies ThemeSpec;

export const stressEmergency = themed(W, H, stressSpec, (t) => {
  const matEnd = t.shade('accent', '#c49f7f');
  const label = (content: string, y: number, size: number, fill: string) =>
    text(content, 180, y, 720, {
      fontFamily: t.font('display'),
      fontSize: size,
      fontWeight: 400,
      fill,
      align: 'center',
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 9 }, (_, index) =>
      rect(index * 135, 0, 3, H, t.color('surface'), { name: 'Tile line' }),
    ),
    Array.from({ length: 10 }, (_, index) =>
      rect(0, index * 135, W, 3, t.color('surface'), { name: 'Tile line' }),
    ),
    rect(130, 190, 820, 940, t.color('secondary'), {
      cornerRadius: 14,
      name: 'Box frame',
      ...shadow(40, 18, t.shade('text', 'rgba(30,42,51,0.3)')),
    }),
    rect(180, 240, 720, 840, linear(160, t.color('surface'), t.shade('surface', MIST.fog)), {
      name: 'Glass',
    }),
    label(t.copy('top'), 300, 96, t.color('text')),
    label(t.copy('headline'), 410, 190, t.color('primary')),
    label(t.copy('bottom'), 640, 96, t.color('text')),
    rect(270, 860, 520, 150, t.color('accent'), { cornerRadius: 75, name: 'Mat roll' }),
    ellipse(700, 860, 120, 150, matEnd, { name: 'Mat end' }),
    circle(760, 935, 42, t.color('accent')),
    circle(760, 935, 18, matEnd),
    text(t.copy('footer'), 0, 1190, W, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
      letterSpacing: 3,
    }),
  ];
});
