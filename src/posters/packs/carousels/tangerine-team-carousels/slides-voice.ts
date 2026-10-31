import { type DesignIconName, linear, radial } from '@/design';
import { circle, ellipse, icon, rect, type ThemeSpec, themed } from '../../../kit';
import {
  DARK_PAGE,
  darkBackground,
  FONT,
  H,
  HANDLE,
  lightBackground,
  nextArrow,
  say,
  TANGERINE,
  W,
} from './palette';

const person = (cx: number, top: number, scale: number, fill: string) => [
  circle(cx, top + 90 * scale, 90 * scale, fill),
  ellipse(cx - 170 * scale, top + 200 * scale, 340 * scale, H - top - 200 * scale, fill, {
    name: 'Shoulders',
  }),
];

const archetypesSpec = {
  colors: {
    background: {
      value: TANGERINE.forest,
      hint: `${DARK_PAGE}, plus The Creator on the tag`,
    },
    primary: {
      value: TANGERINE.orange,
      hint: 'Archetypes title box; its lighter shade colors the front figure',
    },
    secondary: { value: TANGERINE.teal, hint: 'The two figures at the back' },
    text: { value: TANGERINE.white, hint: 'Tag, Archetypes title and the swipe pill' },
  },
  fonts: { body: FONT },
  copy: {
    tag: { label: 'Tag', value: 'The Creator' },
    title: { label: 'Title', value: 'Archetypes' },
    swipe: { label: 'Swipe label', value: 'Swipe to read  →' },
  },
} as const satisfies ThemeSpec;

export const archetypesCover = themed(W, H, archetypesSpec, (t) => {
  const write = say(t.font('body'));
  return [
    darkBackground(t),
    rect(90, 260, 320, 70, t.color('text'), { name: 'Tag', cornerRadius: 8 }),
    write(t.copy('tag'), 90, 272, 320, 38, t.color('background'), 800, {
      align: 'center',
      lineHeight: 1.2,
    }),
    rect(90, 350, 680, 140, t.color('primary'), { name: 'Title box', cornerRadius: 10 }),
    write(t.copy('title'), 90, 362, 680, 104, t.color('text'), 800, {
      align: 'center',
      lineHeight: 1.1,
    }),
    rect(90, 540, 330, 76, t.shade('text', 'rgba(0,0,0,0)'), {
      name: 'Swipe pill',
      cornerRadius: 38,
      stroke: t.color('text'),
      strokeWidth: 3,
    }),
    write(t.copy('swipe'), 90, 559, 330, 30, t.color('text'), 600, { align: 'center' }),
    person(250, 900, 0.75, t.color('secondary')),
    person(830, 900, 0.75, t.color('secondary')),
    person(540, 820, 1, t.shade('primary', '#ff9f5f')),
  ];
});

const archetype = (title: string, body: string, symbol: DesignIconName) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: TANGERINE.forest, hint: DARK_PAGE },
        primary: {
          value: TANGERINE.orange,
          hint: 'Quote mark, title, badge ring and the soft glow behind the badge',
        },
        secondary: {
          value: TANGERINE.teal,
          hint: 'Badge gradient; its darker shade is the bottom of the badge',
        },
        text: { value: TANGERINE.white, hint: 'Body paragraph and the badge icon' },
      },
      fonts: { body: FONT },
      copy: {
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        darkBackground(t),
        icon('quote', 90, 110, 110, t.color('primary'), { strokeWidth: 1.6 }),
        write(t.copy('title'), 90, 250, 900, 84, t.color('primary'), 800),
        write(t.copy('body'), 90, 370, 880, 40, t.color('text'), 400, { lineHeight: 1.4 }),
        circle(
          700,
          940,
          290,
          radial(
            t.shade('primary', 'rgba(255,138,61,0.35)'),
            t.shade('primary', 'rgba(255,138,61,0)'),
          ),
          { name: 'Glow' },
        ),
        circle(
          700,
          940,
          210,
          linear(160, t.color('secondary'), t.shade('secondary', TANGERINE.forest)),
          { name: 'Badge', stroke: t.color('primary'), strokeWidth: 6 },
        ),
        icon(symbol, 570, 810, 260, t.color('text'), { strokeWidth: 1.3 }),
      ];
    },
  );

export const archetypeStoryteller = archetype(
  'Storyteller',
  'Turns complex ideas into\nstories people remember.',
  'megaphone',
);

export const archetypeBuilder = archetype(
  'Builder',
  'Designs content systems that\ngrow with data, not guesses.',
  'pen-tool',
);

export const archetypeExplorer = archetype(
  'Explorer',
  'Tests new channels with a\ncurious, hands-on strategy.',
  'compass',
);

const searchCoverSpec = {
  colors: {
    background: { value: TANGERINE.white, hint: 'Page gradient' },
    primary: {
      value: TANGERINE.forest,
      hint: 'Handle, lens badge, subtitle and the swipe pill',
    },
    accent: { value: TANGERINE.orange, hint: 'Rank Higher title box' },
    text: { value: TANGERINE.white, hint: 'Search icon, Rank Higher and the swipe label' },
  },
  fonts: { body: FONT },
  copy: {
    handle: HANDLE,
    title: { label: 'Title', value: 'Rank Higher' },
    subtitle: { label: 'Subtitle', value: 'in a Noisy Search World' },
    swipe: { label: 'Swipe label', value: 'Swipe to read  →' },
  },
} as const satisfies ThemeSpec;

export const searchCover = themed(W, H, searchCoverSpec, (t) => {
  const write = say(t.font('body'));
  return [
    lightBackground(t),
    write(t.copy('handle'), 0, 70, W, 32, t.color('primary'), 600, { align: 'center' }),
    circle(540, 440, 170, t.color('primary'), { name: 'Lens badge' }),
    icon('search', 440, 340, 200, t.color('text'), { strokeWidth: 2 }),
    rect(140, 690, 800, 140, t.color('accent'), { name: 'Title box', cornerRadius: 12 }),
    write(t.copy('title'), 140, 704, 800, 100, t.color('text'), 800, {
      align: 'center',
      lineHeight: 1.1,
    }),
    write(t.copy('subtitle'), 0, 870, W, 48, t.color('primary'), 600, { align: 'center' }),
    rect(370, 990, 340, 84, t.color('primary'), { name: 'Swipe pill', cornerRadius: 42 }),
    write(t.copy('swipe'), 370, 1012, 340, 32, t.color('text'), 600, { align: 'center' }),
  ];
});

const searchTip = (word: string, title: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: TANGERINE.forest, hint: DARK_PAGE },
        primary: {
          value: TANGERINE.orange,
          hint: 'Accent rule under the title; its faint tint colors the big sideways word',
        },
        secondary: { value: TANGERINE.sage, hint: 'Body paragraph' },
        text: { value: TANGERINE.white, hint: 'Title and the next arrow' },
      },
      fonts: { body: FONT },
      copy: {
        word: { label: 'Sideways word', value: word },
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const write = say(t.font('body'));
      return [
        darkBackground(t),
        write(
          t.copy('word'),
          50,
          1300,
          1250,
          250,
          t.shade('primary', 'rgba(255,138,61,0.16)'),
          800,
          {
            lineHeight: 1,
            rotation: -90,
          },
        ),
        write(t.copy('title'), 380, 220, 640, 76, t.color('text'), 800, { lineHeight: 1.1 }),
        rect(380, 420, 120, 8, t.color('primary'), { name: 'Accent rule', cornerRadius: 4 }),
        write(t.copy('body'), 380, 470, 640, 36, t.color('secondary'), 400, { lineHeight: 1.5 }),
        nextArrow(t.color('text')),
      ];
    },
  );

export const tipSpeed = searchTip(
  'SPEED',
  'Fast\nPages',
  'Visitors and search bots\nboth leave slow sites.\nCompress images, trim\nscripts and aim for a load\nunder two seconds.',
);

export const tipIntent = searchTip(
  'INTENT',
  'Search\nIntent',
  'Match what people really\nwant. A how-to search\nneeds clear steps, not a\nsales page. Answer the\nwhy behind every query.',
);

export const tipTrust = searchTip(
  'TRUST',
  'Earned\nLinks',
  'One mention from a trusted\nsite in your niche is worth\nmore than a hundred\nrandom directory links.',
);
