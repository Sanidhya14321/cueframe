import { linear } from '@/design';
import { avatar, circle, icon, rect, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, BRAND, brand, glow, H, HEADING, headline, MINT, mintText, W } from './posts';

const quoteSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page; its green tint starts the page gradient' },
    primary: {
      value: MINT.mint,
      hint: 'Glow, the closing quote mark and the first quote line; its pale shade ends that line gradient',
    },
    text: {
      value: MINT.white,
      hint: 'Opening quote mark, the rest of the quote, the card outline and fill and the brand name; its grey shade colors the author',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    highlight: { label: 'Quote opening', value: 'Great tools' },
    quote: { label: 'Quote', value: 'disappear so\nyour people\ncan shine.' },
    author: { label: 'Author', value: 'Imani Cole, Product Lead' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const quoteBox = themed(W, H, quoteSpec, (t) => {
  const shade = (exact: string) => t.shade('primary', exact);
  const heading = t.font('heading');
  return [
    rect(0, 0, W, H, linear(150, t.shade('background', '#13291f'), t.color('background')), {
      name: 'Background',
    }),
    glow(shade, 760, 340, 320, 0.3),
    rect(170, 380, 740, 560, t.shade('text', 'rgba(255,255,255,0.04)'), {
      cornerRadius: 28,
      stroke: t.shade('text', 'rgba(220,255,241,0.55)'),
      strokeWidth: 3,
      name: 'Quote card',
    }),
    icon('quote', 270, 480, 190, t.color('text'), { strokeWidth: 2.4, rotation: 180 }),
    icon('quote', 810, 840, 190, t.color('primary'), { strokeWidth: 2.4 }),
    text(t.copy('highlight'), 240, 470, 620, {
      fontFamily: heading,
      fontSize: 64,
      fontWeight: 800,
      fill: mintText(t.color('primary'), shade),
    }),
    text(t.copy('quote'), 240, 548, 620, {
      fontFamily: heading,
      fontSize: 64,
      fontWeight: 400,
      fill: t.color('text'),
      lineHeight: 1.18,
    }),
    text(t.copy('author'), 240, 840, 620, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 600,
      fill: t.shade('text', MINT.grey),
    }),
    brand(t.copy('brand'), 1220, t.color('text'), heading),
  ];
});

const teamSpec = {
  colors: {
    background: {
      value: MINT.black,
      hint: 'Page, the ring hole, the plus badge and the user count; its dark green shade colors the Active users label',
    },
    primary: {
      value: MINT.mint,
      hint: 'Glow, the big ring, the inner ring outline, the second headline line and the users pill; its pale shade lightens the headline and pill gradients',
    },
    text: {
      value: MINT.white,
      hint: 'Brand name, first headline line, the avatar rings and the plus icon',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    headline: { label: 'Headline', value: 'Software that' },
    highlight: { label: 'Highlight', value: 'grows your team' },
    stat: { label: 'Stat', value: '82K+' },
    statLabel: { label: 'Stat label', value: 'Active users' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const teamRing = themed(W, H, teamSpec, (t) => {
  const shade = (exact: string) => t.shade('primary', exact);
  const heading = t.font('heading');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(shade, 540, 675, 640, 0.3),
    circle(540, 675, 500, linear(160, t.color('primary'), shade('#0b3d2b')), { name: 'Ring' }),
    circle(540, 675, 440, t.color('background'), { name: 'Ring hole' }),
    circle(540, 675, 400, shade('rgba(0,0,0,0)'), {
      stroke: shade('rgba(94,242,180,0.35)'),
      strokeWidth: 3,
      name: 'Inner ring',
    }),
    headline(t.copy('headline'), t.copy('highlight'), 440, 72, {
      first: t.color('text'),
      second: mintText(t.color('primary'), shade),
      font: heading,
    }),
    rect(250, 680, 580, 130, linear(90, shade(MINT.pale), t.color('primary')), {
      cornerRadius: 65,
      name: 'Users pill',
    }),
    avatar('woman-portrait-1', 320, 745, 48, t.color('text')),
    avatar('man-portrait-3', 396, 745, 48, t.color('text')),
    avatar('woman-portrait-4', 472, 745, 48, t.color('text')),
    circle(548, 745, 48, t.color('background')),
    icon('plus', 524, 721, 48, t.color('text'), { strokeWidth: 3 }),
    text(t.copy('stat'), 616, 700, 200, {
      fontFamily: heading,
      fontSize: 54,
      fontWeight: 800,
      fill: t.color('background'),
    }),
    text(t.copy('statLabel'), 618, 764, 200, {
      fontFamily: t.font('body'),
      fontSize: 22,
      fontWeight: 600,
      fill: t.shade('background', '#1f3a30'),
    }),
    brand(t.copy('brand'), 1230, t.color('text'), heading),
  ];
});

const countdownSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page' },
    primary: { value: MINT.mint, hint: 'Glow and the bottom of the last number gradient' },
    text: {
      value: MINT.white,
      hint: 'Brand name and the top of the last number; its dim shades color the two earlier numbers and its pale shade the caption',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    numbers: { label: 'Number', value: ['98', '99', '100'] },
    caption: { label: 'Caption', value: 'days of non-stop shipping' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const countdown = themed(W, H, countdownSpec, (t) => {
  const heading = t.font('heading');
  const fills = [
    t.shade('text', '#17261f'),
    t.shade('text', '#4f6d61'),
    linear(180, t.color('text'), t.color('primary')),
  ];
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow((exact) => t.shade('primary', exact), 540, 900, 560, 0.3),
    t.list('numbers').map((number, index) =>
      text(number, 0, 90 + index * 300, W, {
        fontFamily: heading,
        fontSize: 300,
        fontWeight: 800,
        fill: fills[index] ?? t.color('text'),
        align: 'center',
        lineHeight: 1,
      }),
    ),
    text(t.copy('caption'), 0, 1060, W, {
      fontFamily: t.font('body'),
      fontSize: 40,
      fontWeight: 600,
      fill: t.shade('text', MINT.pale),
      align: 'center',
    }),
    brand(t.copy('brand'), 1230, t.color('text'), heading),
  ];
});

const WORD_ALPHA = [0.14, 0.32, 1, 0.32, 0.18, 0.08];

const wordsSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page; its green tint starts the page gradient' },
    primary: { value: MINT.mint, hint: 'Glow, the arrow and the underline' },
    text: {
      value: MINT.white,
      hint: 'The highlighted third word; its grey shade colors the faded words around it',
    },
  },
  fonts: { heading: HEADING },
  copy: {
    words: { label: 'Word', value: ['Plan', 'Build', 'Deploy', 'Measure', 'Scale', 'Repeat'] },
  },
} as const satisfies ThemeSpec;

export const wordList = themed(W, H, wordsSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.shade('background', '#0b1712'), t.color('background')), {
    name: 'Background',
  }),
  glow((exact) => t.shade('primary', exact), 420, 560, 460, 0.25),
  t.list('words').map((word, index) =>
    text(word, 300, 110 + index * 190, 700, {
      fontFamily: t.font('heading'),
      fontSize: 104,
      fontWeight: 800,
      fill: index === 2 ? t.color('text') : t.shade('text', MINT.grey),
      opacity: WORD_ALPHA[index] ?? 0.2,
    }),
  ),
  icon('arrow-right', 150, 512, 110, t.color('primary'), { strokeWidth: 2.4 }),
  rect(300, 640, 120, 8, t.color('primary'), { cornerRadius: 4, name: 'Underline' }),
]);
