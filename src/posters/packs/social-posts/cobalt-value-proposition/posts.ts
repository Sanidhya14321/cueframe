import {
  avatar,
  circle,
  line,
  POST_SIZE,
  rect,
  rotateNodes,
  STORY_SIZE,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface ValuePalette {
  brand: string;
  ink: string;
  paper: string;
  accent: string;
  soft: string;
}

export const COBALT: ValuePalette = {
  brand: '#3355ff',
  ink: '#090b16',
  paper: '#ffffff',
  accent: '#ffd23f',
  soft: '#c7d0ff',
};

export const MINT: ValuePalette = {
  brand: '#10b981',
  ink: '#05140f',
  paper: '#ffffff',
  accent: '#fde047',
  soft: '#c8f5e3',
};

const HEAD = 'Poppins';
const BODY = 'Manrope';
export const HEADING_FONT = { label: 'Heading font', value: HEAD } as const;
export const BODY_FONT = { label: 'Body font', value: BODY } as const;
export const { width: W, height: H } = POST_SIZE;

const SERVICES = ['SEO', 'PAID ADS', 'EMAIL', 'WEBSITE', 'SOCIAL', 'BRANDING'];

const servicesSpec = (p: ValuePalette) =>
  ({
    colors: {
      background: { value: p.ink, hint: 'Page' },
      surface: {
        value: p.paper,
        hint: 'Flyer, the bottom star and the pulled tab label; its grey shades color the tabs, tab outlines and dashed line',
      },
      primary: { value: p.brand, hint: 'Tape, the studio line and the pulled tab' },
      accent: { value: p.accent, hint: 'Top star' },
      text: { value: p.ink, hint: 'Our Services title and the tab labels' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      title: { label: 'Title', value: 'Our Services' },
      subtitle: { label: 'Studio line', value: 'at Northpeak Studio' },
      services: { label: 'Service', value: SERVICES },
    },
  }) as const satisfies ThemeSpec;

export const ourServices = (p: ValuePalette) =>
  themed(W, H, servicesSpec(p), (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    star(5, 900, 90, 100, t.color('accent'), { innerRatio: 0.42 }),
    star(5, 70, 1180, 70, t.color('surface'), { innerRatio: 0.42 }),
    rotateNodes(-4, 540, 670, [
      rect(150, 180, 780, 980, t.color('surface'), {
        cornerRadius: 6,
        shadow: { color: 'rgba(0,0,0,0.45)', blur: 40, offsetX: 0, offsetY: 16 },
        name: 'Flyer',
      }),
      rect(420, 150, 240, 64, t.color('primary'), { cornerRadius: 6, name: 'Tape' }),
      text(t.copy('title'), 150, 270, 780, {
        fontFamily: t.font('heading'),
        fontSize: 86,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('subtitle'), 150, 390, 780, {
        fontFamily: t.font('body'),
        fontSize: 36,
        fontWeight: 700,
        fill: t.color('primary'),
        align: 'center',
      }),
      line(190, 560, 700, t.shade('surface', '#9ca3af'), 3, { dashed: true }),
      t.list('services').map((label, index) => {
        const x = 190 + index * 118;
        const pulled = index === 4;
        return rotateNodes(pulled ? -5 : 0, x + 55, 590, [
          rect(
            x,
            pulled ? 610 : 580,
            110,
            440,
            pulled ? t.color('primary') : t.shade('surface', '#f3f4f6'),
            {
              cornerRadius: 4,
              stroke: t.shade('surface', '#d1d5db'),
              strokeWidth: 2,
              name: `${label} tab`,
            },
          ),
          text(label, x + 30, pulled ? 990 : 960, 360, {
            fontFamily: t.font('heading'),
            fontSize: 44,
            fontWeight: 700,
            fill: pulled ? t.color('surface') : t.color('text'),
            rotation: -90,
            letterSpacing: 2,
          }),
        ]);
      }),
    ]),
  ]);

const WORLD = [
  '   #####       ##     ######        ',
  ' ##########   ###  ############### #',
  '  ##########  #   ################# ',
  '   ########      #################  ',
  '    ######      ##############  #   ',
  '     ####       ############## #    ',
  '      ##        ####  ######        ',
  '       ###     ######  ####   #     ',
  '        ####   #######  ##   ##     ',
  '        #####   #####         ##    ',
  '         ####    ####          ###  ',
  '         ###     ###        ####    ',
  '         ##      ##        ######   ',
  '         #                  ####    ',
  '        #                           ',
];

const worldDots = (x: number, y: number, spacing: number, color: string) =>
  WORLD.flatMap((row, rowIndex) =>
    [...row].flatMap((cell, column) =>
      cell === '#'
        ? [circle(x + column * spacing, y + rowIndex * spacing, spacing * 0.36, color)]
        : [],
    ),
  );

const processSpec = (p: ValuePalette) =>
  ({
    colors: {
      background: { value: p.brand, hint: 'Page' },
      primary: { value: p.ink, hint: 'Clear process title and the dotted world map' },
      text: {
        value: p.paper,
        hint: 'Tagline, the body text, the rings around the photos and the star',
      },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      title: { label: 'Title', value: 'Clear process.' },
      tagline: { label: 'Tagline', value: 'Simple. Proven. Fast.' },
      body: { label: 'Body', value: 'Strategy, design and launch,\nhandled by one team.' },
    },
  }) as const satisfies ThemeSpec;

const clearProcessAt = (p: ValuePalette, height: number) => {
  const shift = height > H ? 280 : 0;
  return themed(W, height, processSpec(p), (t) => [
    rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 0, 120 + shift, W, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('tagline'), 0, 240 + shift, W, {
      fontFamily: t.font('heading'),
      fontSize: 48,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    worldDots(85, 520 + shift, 26, t.color('primary')),
    avatar('woman-portrait-2', 300, 600 + shift, 62, t.color('text')),
    avatar('man-portrait-3', 700, 560 + shift, 58, t.color('text')),
    avatar('woman-portrait-5', 520, 820 + shift, 54, t.color('text')),
    text(t.copy('body'), 0, 1050 + shift, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.35,
    }),
    star(5, 490, height - 150 - shift * 0.5, 100, t.color('text'), { innerRatio: 0.42 }),
  ]);
};

export const clearProcess = (p: ValuePalette) => clearProcessAt(p, H);

export const clearProcessStory = clearProcessAt(COBALT, STORY_SIZE.height);
