import {
  circle,
  group,
  type Nodes,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { H, HANDLE, HEADING, SUNSET, W } from './posts';

interface DayPalette {
  background: string;
  word: string;
  face: string;
  ring: string;
  hand: string;
  button: string;
  buttonText: string;
}

const ORANGE_DAY: DayPalette = {
  background: SUNSET.orange,
  word: SUNSET.white,
  face: SUNSET.white,
  ring: SUNSET.charcoal,
  hand: SUNSET.orange,
  button: SUNSET.white,
  buttonText: SUNSET.charcoal,
};

const TEAL_DAY: DayPalette = {
  background: '#e9f7f5',
  word: '#0d3b3a',
  face: '#ffffff',
  ring: '#14b8a6',
  hand: '#0d3b3a',
  button: '#0d3b3a',
  buttonText: '#ffffff',
};

interface DialColors {
  face: string;
  ring: string;
  hand: string;
}

const dial = (cx: number, cy: number, radius: number, colors: DialColors): Nodes[] => [
  circle(cx, cy, radius + 16, colors.ring, { name: 'Clock rim', ...shadow(30, 12) }),
  circle(cx, cy, radius, colors.face, { name: 'Clock face' }),
  Array.from({ length: 12 }, (_, index) =>
    rotateNodes(index * 30, cx, cy, [
      rect(cx - 4, cy - radius + 12, 8, index % 3 === 0 ? 26 : 14, colors.ring, {
        cornerRadius: 3,
        name: 'Mark',
      }),
    ]),
  ),
  rotateNodes(-40, cx, cy, [
    rect(cx - 6, cy - radius * 0.5, 12, radius * 0.5, colors.hand, {
      cornerRadius: 6,
      name: 'Hand',
    }),
  ]),
  rotateNodes(90, cx, cy, [
    rect(cx - 4, cy - radius * 0.75, 8, radius * 0.75, colors.ring, {
      cornerRadius: 4,
      name: 'Hand',
    }),
  ]),
  circle(cx, cy, 10, colors.hand),
];

const dayPost = (palette: DayPalette, words: readonly [string, string, string, string]) => {
  const spec = {
    colors: {
      background: { value: palette.background, hint: 'Page' },
      text: {
        value: palette.word,
        hint: 'Day name, the D and Y letters, the tagline and the website',
      },
      surface: { value: palette.face, hint: 'Clock face' },
      primary: { value: palette.ring, hint: 'Clock rim, hour marks and the minute hand' },
      accent: { value: palette.hand, hint: 'Hour hand and the centre pin of the clock' },
      secondary: {
        value: palette.button,
        hint: 'Button; its contrasting shade colors the button label',
      },
    },
    fonts: { heading: HEADING },
    copy: {
      day: { label: 'Day', value: words[0] },
      letters: { label: 'Side letter', value: ['D', 'Y'] },
      tagline: { label: 'Tagline', value: words[1] },
      button: { label: 'Button', value: words[2] },
      handle: { ...HANDLE, value: words[3] },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => {
    const font = t.font('heading');
    const [first = '', last = ''] = t.list('letters');
    const letter = (content: string, x: number) =>
      text(content, x, 500, 260, {
        fontFamily: font,
        fontSize: 300,
        fontWeight: 900,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
      });
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('day'), 0, 210, W, {
        fontFamily: font,
        fontSize: 300,
        fontWeight: 900,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1,
      }),
      letter(first, 130),
      dial(540, 650, 140, {
        face: t.color('surface'),
        ring: t.color('primary'),
        hand: t.color('accent'),
      }),
      letter(last, 690),
      text(t.copy('tagline'), 0, 880, W, {
        fontFamily: font,
        fontSize: 40,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 3,
      }),
      group(
        rect(370, 990, 340, 84, t.color('secondary'), { cornerRadius: 42, name: 'Button' }),
        text(t.copy('button'), 370, 1012, 340, {
          fontFamily: font,
          fontSize: 32,
          fontWeight: 800,
          fill: t.shade('secondary', palette.buttonText),
          align: 'center',
        }),
      ),
      text(t.copy('handle'), 0, 1210, W, {
        fontFamily: font,
        fontSize: 30,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  });
};

export const MONDAY = dayPost(ORANGE_DAY, [
  'MON',
  "LET'S SET THE AGENDA",
  'Book a call',
  'emberline.co',
]);

export const TUESDAY = dayPost(TEAL_DAY, [
  'TUE',
  "LET'S MAKE IT COUNT",
  'Get in touch',
  'emberline.co',
]);
