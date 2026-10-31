import { linear } from '@/design';
import {
  ellipse,
  icon,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  aiSearch,
  analyticsBars,
  BODY,
  BRAND,
  brandMark,
  eventsBoard,
  H,
  HEADING,
  TIDE,
  W,
} from './posts';
import { clientsSay, powerWords, statRing, stayAhead } from './posts-more';
import { skillPoll, websiteLive } from './posts-web';

const boostSpec = {
  colors: {
    background: { value: TIDE.night, hint: 'Page' },
    primary: {
      value: TIDE.aqua,
      hint: 'Engagement, the number rings and the chevrons; its see-through shades color the grid, the glow and the number fills',
    },
    text: {
      value: TIDE.white,
      hint: 'Headline, step numbers, step text and the step outlines',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: '4 Steps to Lift' },
    highlight: { label: 'Highlighted title', value: 'Engagement' },
    numbers: { label: 'Step number', value: ['01', '02', '03', '04'] },
    steps: {
      label: 'Step',
      value: [
        'Map who you are talking to and the\nproblems they need solved first.',
        'Share useful insight, not pitches, so\nevery post earns attention.',
        'Ask questions and run quick polls to\nturn readers into conversations.',
        'Post on a steady rhythm so your brand\nfeels familiar and dependable.',
      ],
    },
  },
} as const satisfies ThemeSpec;

const boostSteps = themed(W, H, boostSpec, (t) => {
  const steps = t.list('steps');
  const grid = t.shade('primary', 'rgba(94,234,212,0.07)');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 12 }, (_, index) =>
      rect(index * 90 + 45, 0, 2, H, grid, { name: 'Grid line' }),
    ),
    Array.from({ length: 15 }, (_, index) =>
      rect(0, index * 90 + 45, W, 2, grid, { name: 'Grid line' }),
    ),
    ellipse(140, 300, 800, 700, t.shade('primary', 'rgba(15,165,150,0.12)'), { name: 'Glow' }),
    text(t.copy('title'), 0, 110, W, {
      fontFamily: t.font('heading'),
      fontSize: 76,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('highlight'), 0, 200, W, {
      fontFamily: t.font('heading'),
      fontSize: 76,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    t.list('numbers').map((number, index) => {
      const y = 380 + index * 200;
      return [
        rect(110, y, 860, 160, t.shade('text', 'rgba(255,255,255,0.03)'), {
          name: 'Step row',
          cornerRadius: 80,
          stroke: t.shade('text', 'rgba(255,255,255,0.75)'),
          strokeWidth: 3,
        }),
        ellipse(130, y + 20, 120, 120, t.shade('primary', 'rgba(15,165,150,0.25)'), {
          name: 'Step number',
          stroke: t.color('primary'),
          strokeWidth: 3,
        }),
        text(number, 130, y + 52, 120, {
          fontFamily: t.font('heading'),
          fontSize: 46,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
        text(steps[index] ?? '', 290, y + 40, 640, {
          fontFamily: t.font('body'),
          fontSize: 28,
          fontWeight: 500,
          fill: t.color('text'),
          lineHeight: 1.35,
        }),
      ];
    }),
    icon('chevrons-right', 500, 1190, 80, t.color('primary')),
  ];
});

const NOTE_SPOTS = [
  [160, 590, -6],
  [430, 570, 4],
  [700, 590, -3],
  [290, 850, 5],
  [580, 850, -4],
] as const;

const stickySpec = {
  colors: {
    background: {
      value: '#0b1918',
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    accent: {
      value: TIDE.amber,
      hint: 'Sticky notes and the intro line; its darkest shade colors the note words',
    },
    primary: {
      value: TIDE.aqua,
      hint: 'Growth headline gradient; its deeper shade is the end of the gradient',
    },
    text: { value: TIDE.white, hint: 'B2B headline and the brand mark' },
  },
  fonts: { heading: HEADING, body: BODY, script: { label: 'Script font', value: 'Caveat' } },
  copy: {
    intro: { label: 'Intro', value: 'Things to master in' },
    title: { label: 'Title', value: 'B2B' },
    highlight: { label: 'Highlighted title', value: 'Growth' },
    notes: { label: 'Note', value: ['Audience', 'Trust', 'Pipeline', 'Value', 'Retention'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const stickyNotes = (height: number) => {
  const dy = (height - H) / 2;
  return themed(W, height, stickySpec, (t) => {
    const notes = t.list('notes');
    return [
      rect(0, 0, W, height, linear(180, t.color('background'), t.shade('background', TIDE.night)), {
        name: 'Background',
      }),
      text(t.copy('intro'), 0, 150 + dy, W, {
        fontFamily: t.font('body'),
        fontSize: 42,
        fontWeight: 500,
        fill: t.color('accent'),
        align: 'center',
      }),
      text(t.copy('title'), 0, 220 + dy, W, {
        fontFamily: t.font('heading'),
        fontSize: 130,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
      }),
      text(t.copy('highlight'), 0, 350 + dy, W, {
        fontFamily: t.font('heading'),
        fontSize: 130,
        fontWeight: 800,
        fill: linear(90, t.color('primary'), t.shade('primary', TIDE.teal)),
        align: 'center',
        lineHeight: 1,
      }),
      NOTE_SPOTS.map(([x, y, rotation], index) =>
        rotateNodes(rotation, x, y + dy, [
          rect(x, y + dy, 220, 210, t.color('accent'), {
            name: 'Sticky note',
            ...shadow(18, 10, 'rgba(0,0,0,0.35)'),
          }),
          text(notes[index] ?? '', x, y + dy + 80, 220, {
            fontFamily: t.font('script'),
            fontSize: 46,
            fontWeight: 600,
            fill: t.shade('accent', TIDE.ink),
            align: 'center',
          }),
        ]),
      ),
      brandMark(t.copy('brand'), 0, 1200 + dy, W, t.color('text'), t.font('heading'), 'center'),
    ];
  });
};

export const stickyPost = stickyNotes(H);
export const stickyStory = stickyNotes(STORY_SIZE.height);

export const POSTS = [
  eventsBoard,
  analyticsBars,
  aiSearch,
  websiteLive,
  skillPoll,
  statRing,
  powerWords,
  stickyPost,
  stayAhead,
  clientsSay,
  boostSteps,
];
