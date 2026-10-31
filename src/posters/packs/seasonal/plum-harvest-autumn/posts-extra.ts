import {
  icon,
  POST_SIZE,
  photo,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { AUT, HAND, SERIF } from './palette';

const { width: W, height: H } = POST_SIZE;

const TILES = [
  ['N', 0, 0],
  ['O', 1, 0],
  ['V', 2, 0],
  ['E', 0, 1],
  ['M', 1, 1],
  ['B', 2, 1],
  ['E', 0, 2],
  ['R', 1, 2],
] as const;

const novemberSpec = {
  colors: {
    background: { value: AUT.espresso, hint: 'Page between the photos and the camera icon' },
    text: {
      value: AUT.oat,
      hint: 'Photo Shoot, the first and fifth tiles and the letters on the dark tiles',
    },
    primary: {
      value: AUT.berry,
      hint: 'Second and sixth tiles and the letters on the light tiles; its deeper shade tints the photos',
    },
    accent: { value: AUT.rose, hint: 'Third and seventh tiles' },
    secondary: { value: AUT.butter, hint: 'Fourth and eighth tiles' },
    surface: { value: AUT.white, hint: 'Camera tile' },
  },
  fonts: { script: HAND, heading: SERIF },
  copy: {
    title: { label: 'Title', value: 'Photo  Shoot' },
    letters: { label: 'Tile letter', value: ['N', 'O', 'V', 'E', 'M', 'B', 'E', 'R'] },
  },
} as const satisfies ThemeSpec;

const november = (height: number) =>
  themed(W, height, novemberSpec, (t) => {
    const half = height / 2;
    const top = half - 300;
    const letters = t.list('letters');
    const fills = [t.color('text'), t.color('primary'), t.color('accent'), t.color('secondary')];
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      photo('woman-portrait-4', 0, 0, W / 2 - 4, half - 4),
      photo('autumn-leaves', W / 2 + 4, 0, W / 2 - 4, half - 4),
      photo('autumn-mug', 0, half + 4, W / 2 - 4, half - 4),
      photo('woman-portrait-6', W / 2 + 4, half + 4, W / 2 - 4, half - 4),
      rect(0, 0, W, height, t.shade('primary', 'rgba(74,35,56,0.28)'), { name: 'Tint' }),
      text(t.copy('title'), 0, top - 120, W, {
        fontFamily: t.font('script'),
        fontSize: 96,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
        rotation: -4,
      }),
      TILES.map(([name, column, row], index) => {
        const x = 300 + column * 165;
        const y = top + row * 200;
        const dark = index % 4 === 1;
        return rotateNodes(index % 2 === 0 ? -5 : 4, x + 75, y + 85, [
          rect(x, y, 150, 180, fills[index % 4] ?? t.color('text'), {
            name: `${name} tile`,
            ...shadow(16, 8, 'rgba(0,0,0,0.3)'),
          }),
          text(letters[index] ?? '', x, y + 4, 150, {
            fontFamily: t.font('heading'),
            fontSize: 140,
            fontWeight: 800,
            fill: dark ? t.color('text') : t.color('primary'),
            align: 'center',
            lineHeight: 1.1,
          }),
        ]);
      }),
      rotateNodes(6, 705, top + 485, [
        rect(630, top + 400, 150, 170, t.color('surface'), { name: 'Camera tile' }),
        icon('camera', 655, top + 435, 100, t.color('background'), { strokeWidth: 1.8 }),
      ]),
    ];
  });

export const novemberPost = november(H);
export const novemberStory = november(STORY_SIZE.height);
