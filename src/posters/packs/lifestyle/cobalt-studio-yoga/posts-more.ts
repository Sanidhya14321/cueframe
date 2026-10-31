import { linear } from '@/design';
import {
  circle,
  POST_SIZE,
  photo,
  rect,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, BRAND, brandMark, CO, centeredMark, HEADING, SCRIPT } from './palette';

const { width: W, height: H } = POST_SIZE;

const scheduleSpec = {
  colors: {
    background: { value: CO.paper, hint: 'Page' },
    primary: { value: CO.cobalt, hint: 'YOGA SCHEDULE title, the star and the day dots' },
    surface: { value: CO.white, hint: 'Schedule card; its grey tint colors the dividers' },
    text: {
      value: CO.ink,
      hint: 'Brand mark and day names; its grey shade colors the times and the note, its faint tint the card shadow',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'YOGA' },
    subtitle: { label: 'Second title line', value: 'SCHEDULE' },
    brand: BRAND,
    days: { label: 'Day', value: ['MONDAY', 'WEDNESDAY', 'FRIDAY'] },
    times: {
      label: 'Session times',
      value: [
        '7:00 AM - 8:00 AM\n5:30 PM - 6:30 PM',
        '7:00 AM - 8:00 AM\n6:00 PM - 7:00 PM',
        '8:00 AM - 9:00 AM\n5:00 PM - 6:00 PM',
      ],
    },
    note: { label: 'Note', value: 'Private sessions by\nappointment only' },
  },
} as const satisfies ThemeSpec;

export const yogaSchedule = themed(W, H, scheduleSpec, (t) => {
  const days = t.list('days');
  const times = t.list('times');
  const grey = t.shade('text', CO.grey);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 60, 60, 800, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1,
      letterSpacing: -4,
    }),
    text(t.copy('subtitle'), 60, 230, 900, {
      fontFamily: t.font('heading'),
      fontSize: 120,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1,
      letterSpacing: -3,
    }),
    star(8, 880, 80, 130, t.color('primary'), { innerRatio: 0.35 }),
    brandMark(64, 380, t.color('text'), t.copy('brand'), t.font('heading'), 32),
    photo('yoga-2', 0, 480, 560, 870, { name: 'Pose' }),
    rect(560, 470, 460, 780, t.color('surface'), {
      cornerRadius: 30,
      name: 'Schedule card',
      ...shadow(36, 14, t.shade('text', 'rgba(13,15,26,0.15)')),
    }),
    days.map((day, index) => {
      const y = 520 + index * 200;
      return [
        text(day, 600, y, 320, {
          fontFamily: t.font('heading'),
          fontSize: 36,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        circle(970, y + 22, 12, t.color('primary')),
        text(times[index] ?? '', 600, y + 56, 400, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 500,
          fill: grey,
          lineHeight: 1.4,
        }),
        index < days.length - 1
          ? rect(600, y + 160, 380, 2, t.shade('surface', '#e3e5ee'), { name: 'Divider' })
          : [],
      ];
    }),
    text(t.copy('note'), 600, 1130, 400, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 500,
      fill: grey,
      lineHeight: 1.35,
    }),
  ];
});

const moodSpec = {
  colors: {
    background: { value: CO.cobalt, hint: 'Page gradient; its darker shade ends it' },
    accent: { value: CO.lilac, hint: 'Mood questions on the left' },
    text: { value: CO.white, hint: 'Yoga. answers and the brand mark' },
  },
  fonts: { heading: HEADING, script: SCRIPT },
  copy: {
    moods: {
      label: 'Mood',
      value: ['Good day?', 'Bad day?', 'Stressed?', 'Happy?', 'Tired?', 'Restless?'],
    },
    answer: { label: 'Answer', value: 'Yoga.' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const moodYoga = themed(W, H, moodSpec, (t) => [
  rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', CO.deep)), {
    name: 'Background',
  }),
  t.list('moods').map((mood, index) => [
    text(mood, 80, 300 + index * 120, 480, {
      fontFamily: t.font('script'),
      fontSize: 68,
      fontWeight: 500,
      italic: true,
      fill: t.color('accent'),
      align: 'right',
    }),
    text(t.copy('answer'), 600, 300 + index * 120, 400, {
      fontFamily: t.font('heading'),
      fontSize: 68,
      fontWeight: 800,
      fill: t.color('text'),
    }),
  ]),
  centeredMark(540, 1220, t.color('text'), t.copy('brand'), t.font('heading')),
]);

const unwindSpec = {
  colors: {
    background: { value: CO.ink, hint: 'Page and the fade over the top of the photo' },
    accent: { value: CO.lilac, hint: 'Unwind' },
    text: { value: CO.white, hint: 'Today I will and the brand mark' },
  },
  fonts: { heading: HEADING, script: SCRIPT },
  copy: {
    intro: { label: 'Intro', value: 'Today I will' },
    title: { label: 'Title', value: 'Unwind' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const unwind = themed(W, H, unwindSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('yoga-2', 0, 420, W, 930, { name: 'Meditation' }),
  rect(
    0,
    420,
    W,
    300,
    linear(180, t.color('background'), t.shade('background', 'rgba(13,15,26,0)')),
    {
      name: 'Fade',
    },
  ),
  text(t.copy('intro'), 0, 110, W, {
    fontFamily: t.font('heading'),
    fontSize: 46,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('title'), 0, 170, W, {
    fontFamily: t.font('script'),
    fontSize: 230,
    fontWeight: 700,
    italic: true,
    fill: t.color('accent'),
    align: 'center',
  }),
  centeredMark(540, 1230, t.color('text'), t.copy('brand'), t.font('heading')),
]);

const togglesSpec = {
  colors: {
    background: {
      value: CO.ink,
      hint: 'Page behind the photo, the dim over it and the switched off toggle',
    },
    primary: { value: CO.cobalt, hint: 'Switched on toggle' },
    text: { value: CO.white, hint: 'Both labels, the toggle knobs and the brand mark' },
  },
  fonts: { heading: HEADING },
  copy: {
    off: { label: 'Off label', value: 'stress off' },
    on: { label: 'On label', value: 'yoga on' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const toggles = themed(W, H, togglesSpec, (t) => {
  const label = (content: string, y: number) =>
    text(content, 0, y, W, {
      fontFamily: t.font('heading'),
      fontSize: 60,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    });
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('self-care', 0, 0, W, H, { name: 'Backdrop' }),
    rect(0, 0, W, H, t.shade('background', 'rgba(13,15,26,0.45)'), { name: 'Dim' }),
    label(t.copy('off'), 360),
    rect(390, 460, 300, 150, t.color('background'), { cornerRadius: 75, name: 'Toggle off' }),
    circle(465, 535, 58, t.color('text')),
    label(t.copy('on'), 700),
    rect(390, 800, 300, 150, t.color('primary'), { cornerRadius: 75, name: 'Toggle on' }),
    circle(615, 875, 58, t.color('text')),
    centeredMark(540, 1230, t.color('text'), t.copy('brand'), t.font('heading')),
  ];
});

const benefitsSpec = {
  colors: {
    background: { value: CO.paper, hint: 'Page behind the photo and the haze over it' },
    surface: { value: CO.white, hint: 'Benefit cards' },
    primary: { value: CO.cobalt, hint: 'Benefit titles' },
    text: {
      value: CO.ink,
      hint: 'Brand mark and benefit details; its faint tint colors the card shadows',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    titles: { label: 'Benefit', value: ['Core Strength', 'Better Posture', 'Calm Mind'] },
    details: {
      label: 'Benefit detail',
      value: [
        'Build stability and power\nwith controlled movement.',
        'Align the spine and ease\ntension from long days.',
        'Breathe deeper and leave\nthe noise at the door.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const benefits = themed(W, H, benefitsSpec, (t) => {
  const details = t.list('details');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('yoga-1', 0, 0, W, H, { name: 'Backdrop' }),
    rect(0, 0, W, H, t.shade('background', 'rgba(244,242,236,0.55)'), { name: 'Haze' }),
    centeredMark(540, 80, t.color('text'), t.copy('brand'), t.font('heading')),
    t.list('titles').map((title, index) => {
      const y = 220 + index * 340;
      return [
        rect(200, y, 680, 290, t.shade('surface', 'rgba(255,255,255,0.94)'), {
          cornerRadius: 30,
          name: 'Benefit card',
          ...shadow(30, 12, t.shade('text', 'rgba(13,15,26,0.15)')),
        }),
        text(title, 200, y + 50, 680, {
          fontFamily: t.font('heading'),
          fontSize: 50,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
        }),
        text(details[index] ?? '', 200, y + 130, 680, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.35,
        }),
      ];
    }),
  ];
});
