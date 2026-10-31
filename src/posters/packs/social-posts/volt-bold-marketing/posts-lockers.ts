import {
  checklist,
  group,
  icon,
  type Nodes,
  POST_SIZE,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY_FONT,
  DARK_BACKDROP,
  darkBackdrop,
  HEADING_FONT,
  SCRIPT_FONT,
  VOLT,
} from './volt-kit';

const { width: W, height: H } = POST_SIZE;

interface LockerPalette {
  metal: string;
  shade: string;
  ink: string;
  tag: string;
}

const LIME_LOCKER: LockerPalette = {
  metal: VOLT.lime,
  shade: VOLT.limeDeep,
  ink: VOLT.black,
  tag: VOLT.white,
};

export const VIOLET_LOCKER: LockerPalette = {
  metal: '#a78bfa',
  shade: '#7c5ce6',
  ink: '#1b1033',
  tag: '#ffffff',
};

const tilt = (index: number) => (index % 3 === 0 ? -4 : index % 3 === 1 ? 3 : 0);

export const lockers = (palette: LockerPalette, words: readonly [string, string, string, string]) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: palette.metal,
          hint: 'Page and locker doors; its darker shade colors the door outlines, vents and handles',
        },
        primary: {
          value: palette.ink,
          hint: 'Tag pill, button, dark letter cards, the letters on light cards and the icons',
        },
        surface: {
          value: palette.tag,
          hint: 'Tag and button text, light letter cards and the letters on dark cards',
        },
      },
      fonts: {
        heading: HEADING_FONT,
        letters: { label: 'Letter font', value: 'Abril Fatface' },
        body: BODY_FONT,
      },
      copy: {
        tag: { label: 'Tag', value: words[0] },
        top: { label: 'First word letter', value: [...words[1]] },
        bottom: { label: 'Second word letter', value: [...words[2]] },
        button: { label: 'Button', value: words[3] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const ink = t.color('primary');
      const light = t.color('surface');
      const shade = t.shade('background', palette.shade);
      const ransom = (letters: readonly string[], y: number) => {
        const size = 120;
        const start = (W - letters.length * size) / 2;
        return letters.map((letter, index) => {
          const dark = index % 2 === 0;
          return group(
            rect(start + index * size + 6, y, size - 12, 150, dark ? ink : light, {
              cornerRadius: 8,
              rotation: tilt(index),
              name: 'Letter card',
            }),
            text(letter, start + index * size + 6, y + 22, size - 12, {
              fontFamily: dark ? t.font('heading') : t.font('letters'),
              fontSize: 92,
              fontWeight: 400,
              fill: dark ? light : ink,
              align: 'center',
              rotation: tilt(index),
            }),
          );
        });
      };
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        [0, 1, 2].map((index) => [
          rect(20 + index * 350, 20, 340, H - 40, t.color('background'), {
            cornerRadius: 10,
            stroke: shade,
            strokeWidth: 8,
            name: 'Locker door',
          }),
          Array.from({ length: 5 }, (_, vent) =>
            rect(110 + index * 350, 80 + vent * 34, 160, 14, shade, {
              cornerRadius: 7,
              name: 'Vent',
            }),
          ),
          rect(310 + index * 350, 620, 22, 110, shade, { cornerRadius: 11, name: 'Handle' }),
        ]),
        group(
          rect(420, 380, 240, 90, ink, { cornerRadius: 45, name: 'Tag pill' }),
          text(t.copy('tag'), 420, 398, 240, {
            fontFamily: t.font('heading'),
            fontSize: 46,
            fontWeight: 400,
            fill: light,
            align: 'center',
          }),
        ),
        ransom(t.list('top'), 520),
        ransom(t.list('bottom'), 700),
        group(
          rect(340, 930, 400, 80, ink, { cornerRadius: 40, name: 'Read button' }),
          text(t.copy('button'), 340, 952, 400, {
            fontFamily: t.font('body'),
            fontSize: 30,
            fontWeight: 800,
            fill: light,
            align: 'center',
            letterSpacing: 2,
          }),
        ),
        icon('lightbulb', 80, 1110, 110, ink, { strokeWidth: 2 }),
        icon('rocket', 890, 1110, 110, ink, { strokeWidth: 2 }),
        icon('message-circle', 80, 230, 90, ink, { strokeWidth: 2.2 }),
        icon('sparkles', 910, 230, 90, ink, { strokeWidth: 2.2 }),
      ];
    },
  );

export const LIME_LOCKERS = lockers(LIME_LOCKER, ['BLOG', 'BRAND', 'MOVES', 'READ THE LATEST']);

const guideSpec = {
  colors: {
    background: DARK_BACKDROP,
    surface: { value: VOLT.white, hint: 'Campaign and the guide card' },
    accent: {
      value: VOLT.lime,
      hint: 'Guide and the pencil; its darker shade colors the check marks',
    },
    text: { value: VOLT.black, hint: 'Checklist steps' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT, script: SCRIPT_FONT },
  copy: {
    script: { label: 'Script word', value: 'Campaign' },
    title: { label: 'Title', value: 'Guide' },
    steps: {
      label: 'Step',
      value: [
        'Know your audience',
        'Audit what you have',
        'Pick three key metrics',
        'Launch and review',
      ],
    },
  },
} as const satisfies ThemeSpec;

const guide = (width: number, height: number) =>
  themed(width, height, guideSpec, (t): Nodes[] => {
    const top = (height - H) / 2;
    return [
      darkBackdrop(t.color('background'), t.shade('background', VOLT.black), height),
      text(t.copy('script'), 0, top + 140, W, {
        fontFamily: t.font('script'),
        fontSize: 120,
        fontWeight: 400,
        fill: t.color('surface'),
        align: 'center',
      }),
      text(t.copy('title'), 0, top + 270, W, {
        fontFamily: t.font('heading'),
        fontSize: 150,
        fontWeight: 400,
        fill: t.color('accent'),
        align: 'center',
      }),
      rect(170, top + 520, 740, 620, t.color('surface'), {
        cornerRadius: 28,
        rotation: -3,
        name: 'Guide card',
        ...shadow(40, 16, 'rgba(0,0,0,0.5)'),
      }),
      checklist(t.list('steps'), 240, top + 620, 620, {
        color: t.color('text'),
        iconColor: t.shade('accent', VOLT.limeDark),
        icon: 'circle-check',
        fontSize: 42,
        gap: 120,
        fontFamily: t.font('body'),
        fontWeight: 700,
      }),
      icon('pencil', 800, top + 1000, 190, t.color('accent'), { strokeWidth: 1.8 }),
    ];
  });

export const guidePost = guide(W, H);

export const guideStory = guide(STORY_SIZE.width, STORY_SIZE.height);
