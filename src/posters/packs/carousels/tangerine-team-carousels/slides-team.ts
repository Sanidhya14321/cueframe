import { linear } from '@/design';
import {
  checklist,
  circle,
  icon,
  photo,
  pill,
  rect,
  shadow,
  type ThemeSpec,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import {
  DARK_PAGE,
  darkBackground,
  FONT,
  H,
  HANDLE,
  nextArrow,
  orangeBackground,
  say,
  TANGERINE,
  W,
} from './palette';

const portrait = (
  name: PosterPhotoName,
  label: string,
  x: number,
  y: number,
  frame: string,
  fade: { from: string; to: string },
  write: ReturnType<typeof say>,
  labelColor: string,
) => [
  photo(name, x, y, 270, 340, { cornerRadius: 26, stroke: frame, strokeWidth: 4 }),
  rect(x, y + 200, 270, 140, linear(180, fade.from, fade.to), {
    name: 'Fade',
    cornerRadius: 26,
  }),
  write(label, x, y + 290, 270, 28, labelColor, 700, { align: 'center' }),
];

const coverSpec = {
  colors: {
    background: {
      value: TANGERINE.forest,
      hint: `${DARK_PAGE}, plus the dark fade under each name`,
    },
    primary: {
      value: TANGERINE.orange,
      hint: 'Quote mark, our Team and the photo frames; its lighter shade colors the script word with',
    },
    text: { value: TANGERINE.white, hint: 'Headline, team names and the next arrow' },
  },
  fonts: { body: FONT, script: { label: 'Script font', value: 'Caveat' } },
  copy: {
    title: { label: 'Headline', value: 'Insights you\nshould know from' },
    highlight: { label: 'Highlight', value: 'our Team' },
    connector: { label: 'Script word', value: 'with' },
    names: { label: 'Team member', value: ['Arjun Mehta', 'Theo Brandt', 'Clara Voss'] },
  },
} as const satisfies ThemeSpec;

const COVER_PEOPLE = [
  { photo: 'man-portrait-1', x: 120, y: 660 },
  { photo: 'man-portrait-3', x: 690, y: 660 },
  { photo: 'woman-portrait-1', x: 405, y: 630 },
] as const;

export const insightsCover = themed(W, H, coverSpec, (t) => {
  const write = say(t.font('body'));
  const fade = {
    from: t.shade('background', 'rgba(6,35,31,0)'),
    to: t.shade('background', 'rgba(6,35,31,0.9)'),
  };
  const names = t.list('names');
  return [
    darkBackground(t),
    icon('quote', 470, 90, 140, t.color('primary'), { strokeWidth: 1.6 }),
    write(t.copy('title'), 0, 270, W, 76, t.color('text'), 800, {
      align: 'center',
      lineHeight: 1.1,
    }),
    write(t.copy('highlight'), 0, 440, W, 76, t.color('primary'), 800, { align: 'center' }),
    write(t.copy('connector'), 0, 545, W, 54, t.shade('primary', TANGERINE.apricot), 700, {
      align: 'center',
      fontFamily: t.font('script'),
    }),
    COVER_PEOPLE.map((person, index) =>
      portrait(
        person.photo,
        names[index] ?? '',
        person.x,
        person.y,
        t.color('primary'),
        fade,
        write,
        t.color('text'),
      ),
    ),
    nextArrow(t.color('text'), 492, 1130),
  ];
});

interface InsightStyle {
  person: PosterPhotoName;
  name: string;
  role: string;
  quote: string;
  body: string;
}

const insight = (style: InsightStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: TANGERINE.forest,
          hint: `${DARK_PAGE}; its darkest shade colors the Team Insights label`,
        },
        primary: {
          value: TANGERINE.orange,
          hint: 'Quote mark and Team Insights pill; its lighter shade colors the job title',
        },
        secondary: { value: TANGERINE.sage, hint: 'Body paragraph' },
        text: { value: TANGERINE.white, hint: 'Name, quote and the next arrow' },
      },
      fonts: { body: FONT },
      copy: {
        name: { label: 'Name', value: style.name },
        role: { label: 'Job title', value: style.role },
        quote: { label: 'Quote', value: style.quote },
        body: { label: 'Body', value: style.body },
        tag: { label: 'Pill label', value: 'Team Insights' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        darkBackground(t),
        photo(style.person, 90, 110, 150, 150, { cornerRadius: 26 }),
        write(t.copy('name'), 270, 128, 600, 46, t.color('text'), 800),
        write(t.copy('role'), 270, 192, 600, 30, t.shade('primary', TANGERINE.apricot), 500),
        icon('quote', 830, 220, 170, t.color('primary'), { strokeWidth: 1.4 }),
        write(t.copy('quote'), 90, 430, 900, 62, t.color('text'), 800, { lineHeight: 1.15 }),
        write(t.copy('body'), 90, 780, 860, 34, t.color('secondary'), 400, { lineHeight: 1.45 }),
        pill(t.copy('tag'), 90, 1140, {
          fill: t.color('primary'),
          color: t.shade('background', TANGERINE.deep),
          fontSize: 32,
          fontFamily: t.font('body'),
          fontWeight: 700,
        }),
        nextArrow(t.color('text')),
      ];
    },
  );

export const insightArjun = insight({
  person: 'man-portrait-1',
  name: 'Arjun Mehta',
  role: 'Head of Growth',
  quote: "Your brand isn't what\nyou say. It's what\npeople repeat.",
  body: 'Consistency beats volume. Every post is a\npromise, and when you keep it people start\ntelling your story for you.',
});

export const insightClara = insight({
  person: 'woman-portrait-1',
  name: 'Clara Voss',
  role: 'Brand Director',
  quote: 'Numbers show what\nhappened. Stories\nexplain why.',
  body: 'Data gives you the map, but people connect\nwith people. Never let the dashboard do all\nof the talking.',
});

export const insightTheo = insight({
  person: 'man-portrait-3',
  name: 'Theo Brandt',
  role: 'Content Lead',
  quote: 'Solve one problem for\none reader, really\nwell.',
  body: 'Stop shouting at everyone. Pick a single\nreader and write as if they asked you the\nquestion directly.',
});

const spiralTop = (x: number, y: number, width: number, fill: string) =>
  Array.from({ length: 12 }, (_, index) => {
    const cx = x + 60 + (index * (width - 120)) / 11;
    return [
      circle(cx, y + 26, 11, fill),
      rect(cx - 5, y - 22, 10, 50, fill, { name: 'Ring', cornerRadius: 5 }),
    ];
  });

const spiralSide = (x: number, y: number, height: number, fill: string) =>
  Array.from({ length: 10 }, (_, index) => {
    const cy = y + 60 + (index * (height - 120)) / 9;
    return [
      circle(x + 26, cy, 11, fill),
      rect(x - 22, cy - 5, 50, 10, fill, { name: 'Ring', cornerRadius: 5 }),
    ];
  });

const NOTEBOOK_SHADOW = 'rgba(120,40,0,0.25)';

const lessonsCoverSpec = {
  colors: {
    background: {
      value: '#ff9b55',
      hint: 'Page gradient, its grid lines and the notebook shadow',
    },
    surface: {
      value: TANGERINE.white,
      hint: 'Notebook page, the handle and the words on the highlights',
    },
    primary: {
      value: TANGERINE.forest,
      hint: 'Notebook rings, Learn, Clients, the Win highlight and the swipe line',
    },
    accent: { value: TANGERINE.orange, hint: 'How To highlight and the arrow' },
  },
  fonts: { body: FONT },
  copy: {
    handle: HANDLE,
    start: { label: 'Title start', value: 'Learn' },
    highlight: { label: 'Highlight', value: 'How To' },
    second: { label: 'Second highlight', value: 'Win' },
    end: { label: 'Title end', value: 'Clients.' },
    swipe: { label: 'Swipe line', value: 'Swipe to read\nmore on this\ntopic' },
  },
} as const satisfies ThemeSpec;

export const lessonsCover = themed(W, H, lessonsCoverSpec, (t) => {
  const write = say(t.font('body'));
  const highlight = (label: string, x: number, y: number, width: number, fill: string) => [
    rect(x, y, width, 104, fill, { name: `${label} highlight`, cornerRadius: 10 }),
    write(label, x, y + 6, width, 80, t.color('surface'), 800, {
      align: 'center',
      lineHeight: 1.1,
    }),
  ];
  return [
    orangeBackground(t),
    write(t.copy('handle'), 0, 70, W, 32, t.color('surface'), 600, { align: 'center' }),
    rect(110, 190, 860, 1010, t.color('surface'), {
      name: 'Notebook',
      cornerRadius: 36,
      ...shadow(40, 18, t.shade('background', NOTEBOOK_SHADOW)),
    }),
    spiralTop(110, 190, 860, t.color('primary')),
    write(t.copy('start'), 170, 300, 260, 80, t.color('primary'), 800, { lineHeight: 1.1 }),
    highlight(t.copy('highlight'), 420, 296, 320, t.color('accent')),
    highlight(t.copy('second'), 170, 420, 190, t.color('primary')),
    write(t.copy('end'), 380, 424, 500, 80, t.color('primary'), 800, { lineHeight: 1.1 }),
    icon('corner-down-right', 170, 600, 80, t.color('accent'), { strokeWidth: 2.4 }),
    write(t.copy('swipe'), 170, 700, 330, 34, t.color('primary'), 500),
    photo('man-portrait-3', 520, 600, 400, 560, { cornerRadius: 28 }),
  ];
});

interface LessonStyle {
  label: string;
  title: string;
  body: string | readonly string[];
}

const lesson = (style: LessonStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: '#ff9b55',
          hint: 'Page gradient, its grid lines and the notebook shadow',
        },
        surface: {
          value: TANGERINE.white,
          hint: 'Notebook page, the lesson label and the next arrow',
        },
        primary: { value: TANGERINE.forest, hint: 'Notebook rings and the title' },
        accent: {
          value: TANGERINE.orange,
          hint:
            typeof style.body === 'string' ? 'Lesson tag' : 'Lesson tag and the checklist ticks',
        },
        text: {
          value: '#24413b',
          hint: typeof style.body === 'string' ? 'Body paragraph' : 'Checklist items',
        },
      },
      fonts: { body: FONT },
      copy: {
        label: { label: 'Lesson label', value: style.label },
        title: { label: 'Title', value: style.title },
        body: {
          label: typeof style.body === 'string' ? 'Body' : 'Checklist item',
          value: style.body,
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      const content =
        typeof style.body === 'string'
          ? write(t.copy('body'), 250, 660, 660, 40, t.color('text'), 400, { lineHeight: 1.5 })
          : checklist(t.list('body'), 250, 680, 660, {
              color: t.color('text'),
              iconColor: t.color('accent'),
              fontSize: 40,
              fontFamily: t.font('body'),
              gap: 100,
            });
      return [
        orangeBackground(t),
        rect(150, 230, 800, 820, t.color('surface'), {
          name: 'Notebook',
          cornerRadius: 36,
          ...shadow(40, 18, t.shade('background', NOTEBOOK_SHADOW)),
        }),
        spiralSide(150, 230, 820, t.color('primary')),
        rect(250, 320, 260, 72, t.color('accent'), { name: 'Lesson tag', cornerRadius: 10 }),
        write(t.copy('label'), 250, 332, 260, 40, t.color('surface'), 800, {
          align: 'center',
          lineHeight: 1.2,
        }),
        write(t.copy('title'), 250, 440, 660, 68, t.color('primary'), 800, { lineHeight: 1.12 }),
        content,
        nextArrow(t.color('surface'), 492, 1140),
      ];
    },
  );

export const lessonProof = lesson({
  label: 'Lesson 1',
  title: 'Lead With\nReal Proof',
  body: ['Share client results', 'Show before and after', 'Quote happy buyers'],
});

export const lessonTeach = lesson({
  label: 'Lesson 2',
  title: 'Teach Before\nYou Sell',
  body: 'Give away your best tips.\nWhen people learn from you,\nthey already trust you by\nthe time they want to buy.',
});

export const lessonNextStep = lesson({
  label: 'Lesson 3',
  title: 'Make the Next\nStep Easy',
  body: 'One clear call to action\nper post. When people have\nto guess what to do next,\nthey usually do nothing.',
});
