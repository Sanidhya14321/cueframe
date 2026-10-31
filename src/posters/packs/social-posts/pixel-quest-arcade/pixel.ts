import { POST_SIZE, rect, text } from '../../../kit';

export const PX = {
  night: '#160a2b',
  deep: '#22124a',
  grid: '#2f1d63',
  pink: '#ff3fa4',
  mint: '#3cf2b0',
  sun: '#ffcc33',
  orange: '#ff7a29',
  sky: '#5b3df5',
  lilac: '#c9a8ff',
  cream: '#fff6e0',
  grey: '#9b8cc4',
  road: '#4a4658',
  white: '#ffffff',
};

const BLOCKY = 'Silkscreen';
const TERMINAL = 'Space Mono';
const CHUNKY = 'Bungee';

const SITE = 'pixelforge.studio';

export const { width: W, height: H } = POST_SIZE;

export const sprite = (
  rows: readonly string[],
  x: number,
  y: number,
  size: number,
  colors: Readonly<Record<string, string>>,
) =>
  rows.flatMap((row, rowIndex) =>
    [...row].flatMap((cell, columnIndex) => {
      const color = colors[cell];
      return color === undefined
        ? []
        : [rect(x + columnIndex * size, y + rowIndex * size, size, size, color, { name: 'Pixel' })];
    }),
  );

export const HEART = ['.PP.PP.', 'PPPPPPP', 'PPPPPPP', '.PPPPP.', '..PPP..', '...P...'];

export const CLOUD = [
  '....WWWW....',
  '..WWWWWWWW..',
  '.WWWWWWWWWW.',
  'WWWWWWWWWWWW',
  '.WWWWWWWWWW.',
];

export const CAR = [
  '..WWWWWWWWWW..',
  '..KK.RRRR.KK..',
  'KKKK.RRRR.KKKK',
  'KKKKRRYYRRKKKK',
  '....RRYYRR....',
  'KKKKRRRRRRKKKK',
  'KKKKRRRRRRKKKK',
  '..KK.RRRR.KK..',
  '....WW..WW....',
];

export const HERO = [
  '..YYYY..',
  '.YYYYYY.',
  '.SSSSSS.',
  '.SKSSKS.',
  '.SSSSSS.',
  '..PPPP..',
  '.PPPPPP.',
  'SPPPPPPS',
  'S.PPPP.S',
  '..BB.BB.',
  '..BB.BB.',
  '.KK..KK.',
];

export const ROBOT = [
  '...MM...',
  '.GGGGGG.',
  '.GKGGKG.',
  '.GGGGGG.',
  '..GGGG..',
  'MMMMMMMM',
  'M.MMMM.M',
  'G.MMMM.G',
  '..MMMM..',
  '..GG.GG.',
  '..GG.GG.',
  '.KK..KK.',
];

export const TREE = ['..GG..', '.GGGG.', 'GGGGGG', '.GGGG.', '..BB..', '..BB..'];

export const PIXEL_FONT = { label: 'Pixel font', value: BLOCKY } as const;
export const MONO_FONT = { label: 'Mono font', value: TERMINAL } as const;
export const HEADING_FONT = { label: 'Heading font', value: CHUNKY } as const;
export const WEBSITE = { label: 'Website', value: SITE } as const;

export const siteFooter = (label: string, y: number, color: string, fontFamily: string) =>
  text(label, 0, y, W, {
    fontFamily,
    fontSize: 28,
    fontWeight: 400,
    fill: color,
    align: 'center',
  });

export const scanlines = (height: number, color: string) =>
  Array.from({ length: Math.floor(height / 30) }, (_, index) =>
    rect(0, index * 30 + 12, W, 3, color, { name: 'Scanline' }),
  );
