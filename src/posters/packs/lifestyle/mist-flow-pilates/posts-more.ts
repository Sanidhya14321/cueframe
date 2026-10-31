import { linear } from '@/design';
import {
  icon,
  line,
  POST_SIZE,
  photo,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, MIST, SERIF, TALL } from './palette';

const { width: W, height: H } = POST_SIZE;

const classSpec = {
  colors: {
    background: {
      value: MIST.mist,
      hint: 'Top of the page gradient; its darker shade colors the bottom',
    },
    primary: { value: MIST.ink, hint: 'CLASS title and the second and fourth class rows' },
    secondary: { value: MIST.slate, hint: 'First and third class rows' },
    accent: {
      value: MIST.sage,
      hint: 'Calendar subtitle; its lighter shade colors the AUG month tags',
    },
    text: {
      value: MIST.white,
      hint: 'Class dates, names and dividers; its darker shade colors the studio and time line',
    },
  },
  fonts: { display: TALL, serif: SERIF, body: BODY },
  copy: {
    title: { label: 'Title', value: 'CLASS' },
    subtitle: { label: 'Subtitle', value: 'Calendar' },
    days: { label: 'Day', value: ['09', '14', '21', '28'] },
    classes: {
      label: 'Class',
      value: ['Morning Flow', 'Core & Balance', 'Reformer Basics', 'Sunset Stretch'],
    },
    details: {
      label: 'Place and time',
      value: [
        'Studio A  ·  7:00 AM',
        'Studio B  ·  6:30 PM',
        'Studio A  ·  8:00 AM',
        'Rooftop  ·  7:15 PM',
      ],
    },
    month: { label: 'Month', value: 'AUG' },
  },
} as const satisfies ThemeSpec;

export const classCalendar = themed(W, H, classSpec, (t) => {
  const days = t.list('days');
  const details = t.list('details');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', MIST.fog)), {
      name: 'Background',
    }),
    text(t.copy('title'), 0, 60, W, {
      fontFamily: t.font('display'),
      fontSize: 220,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1.1,
      letterSpacing: 10,
    }),
    text(t.copy('subtitle'), 0, 250, W, {
      fontFamily: t.font('serif'),
      fontSize: 140,
      fontWeight: 400,
      italic: true,
      fill: t.color('accent'),
      align: 'center',
    }),
    t.list('classes').map((name, index) => {
      const y = 500 + index * 180;
      const dark = index % 2 === 1;
      return [
        rect(130, y, 820, 150, dark ? t.color('primary') : t.color('secondary'), {
          cornerRadius: 18,
          name: 'Class row',
        }),
        text(days[index] ?? '', 160, y + 18, 150, {
          fontFamily: t.font('serif'),
          fontSize: 100,
          fontWeight: 400,
          fill: t.color('text'),
          align: 'center',
        }),
        rect(330, y + 30, 2, 90, t.shade('text', 'rgba(255,255,255,0.4)'), { name: 'Divider' }),
        text(name, 360, y + 34, 460, {
          fontFamily: t.font('body'),
          fontSize: 38,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(details[index] ?? '', 360, y + 86, 460, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 500,
          fill: t.shade('text', MIST.fog),
        }),
        text(t.copy('month'), 920, y + 32, 100, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 700,
          fill: t.shade('accent', MIST.mint),
          letterSpacing: 4,
          rotation: 90,
        }),
      ];
    }),
  ];
});

const NOTE_SPOTS = [
  [50, 470, 330, 520],
  [760, 420, 700, 450],
  [760, 820, 700, 850],
  [50, 1040, 330, 1080],
] as const;

const tipsSpec = {
  colors: {
    background: {
      value: MIST.white,
      hint: 'Top of the page gradient; its darker shade colors the bottom',
    },
    primary: { value: MIST.ink, hint: 'form tips title and the pointer lines' },
    secondary: { value: MIST.slate, hint: '(Warrior II) and the form notes' },
  },
  fonts: { serif: SERIF, body: BODY },
  copy: {
    title: { label: 'Title', value: 'form tips' },
    pose: { label: 'Pose', value: '(Warrior II)' },
    notes: {
      label: 'Form note',
      value: [
        'Arms reach long,\nparallel to the mat',
        'Gaze softly over\nthe front fingers',
        'Front knee stacked\nabove the ankle',
        'Back foot grounded\nand angled in',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const formTips = themed(W, H, tipsSpec, (t) => {
  const notes = t.list('notes');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', MIST.mist)), {
      name: 'Background',
    }),
    text(t.copy('title'), 0, 50, W, {
      fontFamily: t.font('serif'),
      fontSize: 150,
      fontWeight: 400,
      italic: true,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('pose'), 0, 230, W, {
      fontFamily: t.font('serif'),
      fontSize: 54,
      fontWeight: 400,
      italic: true,
      fill: t.color('secondary'),
      align: 'center',
    }),
    photo('woman-portrait-3', 390, 340, 300, 900, { cornerRadius: 150 }),
    NOTE_SPOTS.map(([x, y, lineX, lineY], index) => [
      text(notes[index] ?? '', x, y, 270, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 500,
        fill: t.color('secondary'),
        lineHeight: 1.3,
      }),
      line(lineX, lineY, 60, t.color('primary'), 2),
    ]),
  ];
});

const principlesSpec = {
  colors: {
    primary: { value: MIST.ink, hint: 'Dim over the photo and the page behind it' },
    text: {
      value: MIST.white,
      hint: 'PILATES, numbers, principle names and rules; its darker shade colors the descriptions',
    },
    accent: { value: MIST.mint, hint: 'three core principles subtitle' },
  },
  fonts: { display: TALL, serif: SERIF, body: BODY },
  copy: {
    title: { label: 'Title', value: 'PILATES' },
    subtitle: { label: 'Subtitle', value: 'three core principles' },
    numbers: { label: 'Number', value: ['1', '2', '3'] },
    names: { label: 'Principle', value: ['Centering', 'Precision', 'Flow'] },
    details: {
      label: 'Description',
      value: [
        'Start every move from a steady, engaged core.',
        'Small, exact movements build lasting strength.',
        'Link each motion smoothly with your breath.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const principles = themed(W, H, principlesSpec, (t) => {
  const numbers = t.list('numbers');
  const details = t.list('details');
  return [
    rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
    photo('yoga-2', 0, 0, W, H, { name: 'Backdrop' }),
    rect(0, 0, W, H, t.shade('primary', 'rgba(30,42,51,0.78)'), { name: 'Dim' }),
    text(t.copy('title'), 80, 70, 920, {
      fontFamily: t.font('display'),
      fontSize: 170,
      fontWeight: 400,
      fill: t.color('text'),
      letterSpacing: 6,
    }),
    text(t.copy('subtitle'), 80, 290, 920, {
      fontFamily: t.font('serif'),
      fontSize: 64,
      fontWeight: 400,
      italic: true,
      fill: t.color('accent'),
    }),
    t.list('names').map((title, index) => {
      const y = 450 + index * 270;
      return [
        rect(80, y - 30, 920, 2, t.shade('text', 'rgba(255,255,255,0.25)'), { name: 'Rule' }),
        text(numbers[index] ?? '', 80, y, 120, {
          fontFamily: t.font('serif'),
          fontSize: 150,
          fontWeight: 400,
          fill: t.color('text'),
          lineHeight: 1,
        }),
        text(title, 240, y + 16, 760, {
          fontFamily: t.font('body'),
          fontSize: 46,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(details[index] ?? '', 240, y + 86, 740, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 400,
          fill: t.shade('text', MIST.fog),
          lineHeight: 1.35,
        }),
      ];
    }),
  ];
});

const searchSpec = {
  colors: {
    background: { value: MIST.mist, hint: 'Page and the lines between results' },
    surface: { value: MIST.white, hint: 'Search bar and results card' },
    primary: { value: MIST.ink, hint: 'Search question, the poses and the card shadows' },
    secondary: { value: MIST.slate, hint: 'Microphone icon' },
    accent: { value: MIST.sage, hint: 'Search icons beside the poses' },
  },
  fonts: { body: BODY },
  copy: {
    query: { label: 'Search question', value: 'What are the best yoga poses?' },
    poses: { label: 'Pose', value: ['Warrior II', "Child's Pose", 'Downward Dog', 'Cobra Pose'] },
  },
} as const satisfies ThemeSpec;

export const searchPoses = themed(W, H, searchSpec, (t) => {
  const poses = t.list('poses');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('woman-portrait-4', 0, 640, W, 710, { name: 'Portrait' }),
    rect(130, 120, 820, 116, t.color('surface'), {
      cornerRadius: 58,
      name: 'Search bar',
      ...shadow(30, 10, t.shade('primary', 'rgba(30,42,51,0.15)')),
    }),
    text(t.copy('query'), 190, 154, 640, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.color('primary'),
    }),
    icon('mic', 860, 152, 52, t.color('secondary')),
    rect(180, 280, 720, 440, t.color('surface'), {
      cornerRadius: 30,
      name: 'Results card',
      ...shadow(36, 14, t.shade('primary', 'rgba(30,42,51,0.2)')),
    }),
    poses.map((pose, index) => [
      icon('search', 230, 326 + index * 96, 40, t.color('accent')),
      text(pose, 300, 322 + index * 96, 560, {
        fontFamily: t.font('body'),
        fontSize: 40,
        fontWeight: 500,
        fill: t.color('primary'),
      }),
      index < poses.length - 1
        ? rect(230, 392 + index * 96, 620, 2, t.color('background'), { name: 'Divider' })
        : [],
    ]),
  ];
});
