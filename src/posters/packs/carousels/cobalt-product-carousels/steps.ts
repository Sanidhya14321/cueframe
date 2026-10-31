import { icon, poly, rect, type Template, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  BRAND,
  brandLine,
  COBALT,
  glow,
  H,
  HEADING_FONT,
  inkBackground,
  SITE,
  W,
} from './palette';

const coverSpec = {
  colors: {
    background: { value: COBALT.ink, hint: 'Page' },
    surface: { value: COBALT.white, hint: 'Card; its grey shade colors the dividers' },
    text: {
      value: COBALT.ink,
      hint: 'Brand line, the headline and the website; its lighter shade colors 4 Ways and the tagline',
    },
    primary: { value: COBALT.blue, hint: 'Mindset and the arrows' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    brand: BRAND,
    kicker: { label: 'Kicker', value: '4 Ways' },
    headline: { label: 'Headline', value: 'To Build a More\nProduct-Led' },
    highlight: { label: 'Highlighted word', value: 'Mindset' },
    tagline: { label: 'Tagline', value: 'A field guide for growing teams' },
    site: SITE,
  },
} as const satisfies ThemeSpec;

const waysCover = themed(W, H, coverSpec, (t) => {
  const grey = t.shade('text', COBALT.grey);
  const divider = t.shade('surface', COBALT.line);
  return [
    inkBackground(t.color('background')),
    rect(80, 220, 1000, 930, t.color('surface'), { cornerRadius: 44, name: 'Card' }),
    brandLine(t.copy('brand'), 140, 290, t.color('text'), t.font('heading')),
    rect(140, 370, 880, 3, divider, { name: 'Divider' }),
    text(t.copy('kicker'), 140, 420, 600, {
      fontFamily: t.font('body'),
      fontSize: 44,
      fontWeight: 500,
      fill: grey,
    }),
    text(t.copy('headline'), 140, 510, 880, {
      fontFamily: t.font('heading'),
      fontSize: 88,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.12,
    }),
    text(t.copy('highlight'), 140, 707, 880, {
      fontFamily: t.font('heading'),
      fontSize: 88,
      fontWeight: 800,
      fill: t.color('primary'),
      lineHeight: 1.12,
    }),
    text(t.copy('tagline'), 140, 860, 860, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: grey,
    }),
    rect(140, 960, 880, 3, divider, { name: 'Divider' }),
    text(t.copy('site'), 140, 1040, 500, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    icon('chevrons-right', 900, 1010, 100, t.color('primary'), { strokeWidth: 2.6 }),
  ];
});

const stepCard = (
  number: number,
  lines: readonly (readonly [string, boolean])[],
  body: string,
  last = false,
) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: COBALT.ink,
          hint: last ? 'Page' : 'Page and the notch cut into the glow block',
        },
        primary: {
          value: COBALT.sky,
          hint: 'Top of the glow block gradient; its deeper shade is the bottom',
        },
        surface: { value: COBALT.white, hint: 'Card and the notch on the left edge' },
        secondary: { value: COBALT.blue, hint: 'Step number and the highlighted headline line' },
        text: {
          value: COBALT.ink,
          hint: 'Headline lines; its lighter shade colors the body text',
        },
      },
      fonts: { heading: HEADING_FONT, body: BODY_FONT },
      copy: {
        number: { label: 'Step number', value: `#${number}` },
        lines: { label: 'Headline line', value: lines.map(([line]) => line) },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      inkBackground(t.color('background')),
      rect(620, 130, 460, 1090, glow(t.color('primary'), t.shade('primary', COBALT.deepBlue)), {
        cornerRadius: 60,
        name: 'Glow block',
      }),
      poly(
        [
          [0, 630],
          [36, 670],
          [0, 710],
        ],
        t.color('surface'),
        { name: 'Notch' },
      ),
      rect(170, 230, 740, 860, t.color('surface'), { cornerRadius: 50, name: 'Card' }),
      text(t.copy('number'), 170, 290, 740, {
        fontFamily: t.font('heading'),
        fontSize: 64,
        fontWeight: 800,
        fill: t.color('secondary'),
        align: 'center',
      }),
      t.list('lines').map((line, index) =>
        text(line, 170, 390 + index * 84, 740, {
          fontFamily: t.font('heading'),
          fontSize: 72,
          fontWeight: 800,
          fill: lines[index]?.[1] === true ? t.color('secondary') : t.color('text'),
          align: 'center',
        }),
      ),
      text(t.copy('body'), 220, 680, 640, {
        fontFamily: t.font('body'),
        fontSize: 38,
        fontWeight: 400,
        fill: t.shade('text', COBALT.grey),
        align: 'center',
        lineHeight: 1.5,
      }),
      last
        ? []
        : poly(
            [
              [1044, 630],
              [1080, 670],
              [1044, 710],
            ],
            t.color('background'),
            { name: 'Notch' },
          ),
    ],
  );

export const WAYS_SERIES: readonly Template[] = [
  waysCover,
  stepCard(
    1,
    [
      ['Know your', false],
      ['customer pains', true],
      ['and goals', false],
    ],
    'Product focus starts with real curiosity about the people you serve: what they need, what slows them down and why.',
  ),
  stepCard(
    2,
    [
      ['Set a sharp', false],
      ['product vision', true],
      ['and roadmap', false],
    ],
    'A clear vision acts as a north star. The roadmap shows the route, the audience and the value you will deliver.',
  ),
  stepCard(
    3,
    [
      ['Prioritise', false],
      ['by real value', true],
      ['not by noise', false],
    ],
    'Skip the trap of doing everything. Rank ideas by impact on customers and the business, then cut the rest.',
  ),
  stepCard(
    4,
    [
      ['Ship, learn', false],
      ['and repeat', true],
      ['every sprint', false],
    ],
    'Release small, measure honestly and feed every lesson back into the next plan.',
    true,
  ),
];
