import {
  group,
  POST_SIZE,
  photo,
  pill,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import { AUT, BODY, HAND, PACIFICO, SERIF, snap } from './palette';

const { width: W, height: H } = POST_SIZE;

interface EssentialsCopy {
  first: string;
  second: string;
  tag: string;
  ink: string;
  tagFill: string;
  photos: readonly [PosterPhotoName, PosterPhotoName, PosterPhotoName, PosterPhotoName];
}

const essentials = (copy: EssentialsCopy) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: AUT.oat,
          hint: 'Page and the tag text; its darker shade colors the grid lines',
        },
        surface: { value: AUT.white, hint: 'Photo borders' },
        primary: {
          value: copy.ink,
          hint: `${copy.first} and ${copy.second} titles; its dark shade tints the photo shadows`,
        },
        accent: { value: copy.tagFill, hint: `${copy.tag} tag` },
      },
      fonts: { heading: SERIF },
      copy: {
        first: { label: 'Title', value: copy.first },
        second: { label: 'Second title line', value: copy.second },
        tag: { label: 'Tag', value: copy.tag },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const [a, b, c, d] = copy.photos;
      const border = t.color('surface');
      const tint = t.shade('primary', 'rgba(43,29,24,0.25)');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        Array.from({ length: 18 }, (_, index) =>
          rect(index * 64, 0, 2, H, t.shade('background', AUT.line), { name: 'Grid line' }),
        ),
        Array.from({ length: 22 }, (_, index) =>
          rect(0, index * 64, W, 2, t.shade('background', AUT.line), { name: 'Grid line' }),
        ),
        text(t.copy('first'), 0, 80, W, {
          fontFamily: t.font('heading'),
          fontSize: 140,
          fontWeight: 500,
          fill: t.color('primary'),
          align: 'center',
          lineHeight: 1,
        }),
        text(t.copy('second'), 0, 220, W, {
          fontFamily: t.font('heading'),
          fontSize: 120,
          fontWeight: 500,
          italic: true,
          fill: t.color('primary'),
          align: 'center',
          lineHeight: 1,
        }),
        pill(t.copy('tag'), 600, 370, {
          width: 280,
          fill: t.color('accent'),
          color: t.color('background'),
          fontSize: 32,
          fontFamily: t.font('heading'),
          fontWeight: 500,
        }),
        snap(a, 120, 520, 380, 300, -5, border, tint),
        snap(b, 590, 500, 360, 420, 4, border, tint),
        snap(c, 140, 900, 360, 300, 3, border, tint),
        snap(d, 600, 990, 330, 240, -4, border, tint),
      ];
    },
  );

export const autumnEssentials = essentials({
  first: 'Autumn',
  second: 'Essentials',
  tag: 'Cozy Edition',
  ink: AUT.plum,
  tagFill: AUT.berry,
  photos: ['autumn-mug', 'coffee-book', 'self-care', 'coffee-1'],
});

export const winterFavorites = essentials({
  first: 'Winter',
  second: 'Favorites',
  tag: 'Warm Edition',
  ink: '#2f4a3a',
  tagFill: '#a8323e',
  photos: ['interior-1', 'coffee-1', 'candles', 'coffee-book'],
});

const SIP_SLOTS = [
  [60, 430],
  [60, 700],
  [60, 970],
  [800, 430],
  [800, 700],
  [800, 970],
] as const;

const sipsSpec = {
  colors: {
    background: { value: AUT.espresso, hint: 'Page' },
    text: { value: AUT.oat, hint: 'Fall Sips title; its faint shade colors the rules' },
    accent: { value: AUT.rose, hint: 'Ring around the photo and the cafe line at the bottom' },
    secondary: { value: AUT.butter, hint: 'Drink names' },
  },
  fonts: { title: PACIFICO, script: HAND, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Fall Sips' },
    drinks: {
      label: 'Drink',
      value: [
        'Maple\nOat Latte',
        'Chai\nCinnamon',
        'Salted\nCaramel Cocoa',
        'Pumpkin\nCold Brew',
        'Spiced\nApple Cider',
        'Honey\nLavender Tea',
      ],
    },
    footer: { label: 'Footer', value: 'the mapleandmoss cafe guide' },
  },
} as const satisfies ThemeSpec;

export const fallSips = themed(W, H, sipsSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  Array.from({ length: 6 }, (_, index) =>
    rect(0, 340 + index * 170, W, 2, t.shade('text', 'rgba(245,239,228,0.08)'), { name: 'Rule' }),
  ),
  text(t.copy('title'), 0, 90, W, {
    fontFamily: t.font('title'),
    fontSize: 130,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
  }),
  rect(300, 520, 480, 480, t.color('accent'), { cornerRadius: 240, name: 'Ring' }),
  photo('coffee-1', 315, 535, 450, 450, { cornerRadius: 225 }),
  t.list('drinks').map((label, index) => {
    const [x, y] = SIP_SLOTS[index] ?? [60, 430];
    return text(label, x, y, 240, {
      fontFamily: t.font('script'),
      fontSize: 50,
      fontWeight: 600,
      fill: t.color('secondary'),
      align: x < 400 ? 'left' : 'right',
      lineHeight: 1,
    });
  }),
  text(t.copy('footer'), 0, 1230, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 500,
    fill: t.color('accent'),
    align: 'center',
    letterSpacing: 3,
  }),
]);

const snacksSpec = {
  colors: {
    background: { value: AUT.oat, hint: 'Page and the offset shadow behind Autumn' },
    accent: { value: AUT.rose, hint: 'Gingham stripes' },
    primary: {
      value: AUT.plum,
      hint: 'Snacks; its shades color Autumn, the numbers and the card shadow',
    },
    surface: { value: AUT.white, hint: 'Snack card' },
    text: { value: AUT.espresso, hint: 'Snack names' },
  },
  fonts: { heading: SERIF, script: PACIFICO, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Autumn' },
    subtitle: { label: 'Subtitle', value: 'Snacks' },
    numbers: { label: 'Number', value: ['01', '02', '03', '04', '05'] },
    snacks: {
      label: 'Snack',
      value: [
        'Maple pecan bread',
        'Apple cider donuts',
        'Pumpkin granola',
        'Cinnamon pear rolls',
        'Baked brie & figs',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const autumnSnacks = themed(W, H, snacksSpec, (t) => {
  const numbers = t.list('numbers');
  const gingham = t.shade('accent', 'rgba(201,139,139,0.32)');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    Array.from({ length: 12 }, (_, index) =>
      rect(index * 96, 0, 48, H, gingham, { name: 'Gingham' }),
    ),
    Array.from({ length: 15 }, (_, index) =>
      rect(0, index * 96, W, 48, gingham, { name: 'Gingham' }),
    ),
    text(t.copy('title'), 0, 90, W, {
      fontFamily: t.font('heading'),
      fontSize: 130,
      fontWeight: 800,
      fill: t.shade('primary', AUT.berry),
      align: 'center',
      lineHeight: 1,
      shadow: { color: t.color('background'), blur: 0, offsetX: 6, offsetY: 6 },
    }),
    text(t.copy('subtitle'), 0, 220, W, {
      fontFamily: t.font('script'),
      fontSize: 104,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    rect(150, 450, 780, 740, t.color('surface'), {
      cornerRadius: 40,
      name: 'Card',
      ...shadow(30, 12, t.shade('primary', 'rgba(74,35,56,0.2)')),
    }),
    group(
      t.list('snacks').map((item, index) => [
        text(numbers[index] ?? '', 220, 530 + index * 130, 84, {
          fontSize: 42 * 1.1,
          fontWeight: 800,
          fontFamily: t.font('body'),
          fill: t.shade('primary', AUT.berry),
        }),
        text(item, 220 + 42 * 2.2, 530 + index * 130 + 42 * 0.08, 680 - 42 * 2.2, {
          fontSize: 42,
          fontWeight: 600,
          fontFamily: t.font('body'),
          fill: t.color('text'),
          lineHeight: 1.2,
        }),
      ]),
    ),
  ];
});

const SHADES = [
  ['Plum Wine', 150, 160, -3],
  ['Dusty Rose', 570, 180, 3],
  ['Sage Leaf', 150, 700, 2],
  ['Butter Cream', 570, 690, -2],
] as const;

const shadesSpec = {
  colors: {
    surface: {
      value: AUT.white,
      hint: 'Shade cards; its warm shade colors the line at the bottom',
    },
    text: {
      value: AUT.espresso,
      hint: 'Shade codes, shade names and the page behind the photo; its translucent shade dims the photo',
    },
    primary: { value: AUT.plum, hint: 'Plum Wine swatch' },
    secondary: { value: AUT.rose, hint: 'Dusty Rose swatch' },
    accent: { value: AUT.sage, hint: 'Sage Leaf swatch' },
    background: { value: AUT.butter, hint: 'Butter Cream swatch' },
  },
  fonts: { body: BODY, heading: SERIF, script: HAND },
  copy: {
    codes: { label: 'Shade code', value: ['SHADE 01', 'SHADE 02', 'SHADE 03', 'SHADE 04'] },
    names: { label: 'Shade name', value: ['Plum Wine', 'Dusty Rose', 'Sage Leaf', 'Butter Cream'] },
    footer: { label: 'Footer', value: 'my autumn palette' },
  },
} as const satisfies ThemeSpec;

export const shadeCards = themed(W, H, shadesSpec, (t) => {
  const codes = t.list('codes');
  const names = t.list('names');
  const swatches = [
    t.color('primary'),
    t.color('secondary'),
    t.color('accent'),
    t.color('background'),
  ];
  return [
    rect(0, 0, W, H, t.color('text'), { name: 'Background' }),
    photo('autumn-mug', 0, 0, W, H, { name: 'Backdrop' }),
    rect(0, 0, W, H, t.shade('text', 'rgba(43,29,24,0.35)'), { name: 'Dim' }),
    SHADES.map(([name, x, y, rotation], index) =>
      rotateNodes(rotation, x + 180, y + 230, [
        rect(x, y, 360, 460, t.color('surface'), {
          name: `${name} card`,
          ...shadow(24, 10, 'rgba(0,0,0,0.3)'),
        }),
        rect(x + 18, y + 18, 324, 320, swatches[index] ?? t.color('primary'), {
          name: `${name} swatch`,
        }),
        text(codes[index] ?? '', x + 24, y + 358, 320, {
          fontFamily: t.font('body'),
          fontSize: 22,
          fontWeight: 700,
          fill: t.color('text'),
          letterSpacing: 4,
        }),
        text(names[index] ?? '', x + 24, y + 392, 320, {
          fontFamily: t.font('heading'),
          fontSize: 36,
          fontWeight: 600,
          fill: t.color('text'),
        }),
      ]),
    ),
    text(t.copy('footer'), 0, 1250, W, {
      fontFamily: t.font('script'),
      fontSize: 56,
      fontWeight: 600,
      fill: t.shade('surface', AUT.oat),
      align: 'center',
    }),
  ];
});
