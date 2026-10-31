import { linear } from '@/design';
import {
  avatar,
  card,
  circle,
  icon,
  paint,
  path,
  phone,
  phoneScreen,
  photo,
  poly,
  rating,
  rect,
  STORY_SIZE,
  type ThemeSpec,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  bankingChoice,
  button,
  copy,
  fasterLoans,
  H,
  HEADING,
  head,
  logo,
  NV,
  smarterPlans,
  W,
  webinarSteps,
} from './posts';

const hillPath = (width: number, height: number, corner: number) =>
  `M0 70 C ${width * 0.3} 0 ${width * 0.6} 10 ${width} 60 L${width} ${height - corner} Q${width} ${height} ${width - corner} ${height} L${corner} ${height} Q0 ${height} 0 ${height - corner} Z`;

const PHONE_INK = '#0b0b0f';

const futureSpec = {
  colors: {
    background: { value: NV.cream, hint: 'Page' },
    primary: {
      value: NV.teal,
      hint: 'The future of finance, the Get Started button, the hill and the growth figure on the phone',
    },
    accent: {
      value: NV.coral,
      hint: 'is digital., the front wave and the sun; its tints color the back wave and the end of the front wave',
    },
    secondary: { value: '#bfe6f2', hint: 'Sky on the phone screen' },
    surface: { value: NV.white, hint: 'Button label, balance card and the logo' },
    text: { value: NV.ink, hint: 'Body copy, the Savings label and the phone frame' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'The future of finance' },
    highlight: { label: 'Highlighted line', value: 'is digital.' },
    body: {
      label: 'Body',
      value: 'Manage every account, card and goal\nright from your pocket.',
    },
    cta: { label: 'Button', value: 'Get Started Free' },
    cardLabel: { label: 'Card label', value: 'Savings' },
    cardValue: { label: 'Card figure', value: '+12.4%' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const futureDigital = (height: number) =>
  themed(W, height, futureSpec, (t) => {
    const heading = head(t.font('heading'));
    const body = copy(t.font('body'));
    const tall = height > 1500;
    const top = tall ? 260 : 110;
    const phoneWidth = tall ? 440 : 330;
    const screen = phoneScreen(phoneWidth);
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      heading(t.copy('title'), 80, top, 940, 74, t.color('primary'), 600),
      heading(t.copy('highlight'), 80, top + 88, 940, 104, t.color('accent'), 800),
      body(t.copy('body'), 80, top + 240, 900, 32, t.color('text')),
      button(t.copy('cta'), 80, top + 360, t.color('primary'), t.color('surface'), t.font('body')),
      path(
        'M0 170 C 260 40 620 320 1080 90 L1080 520 L0 520 Z',
        0,
        height - 520,
        W,
        520,
        t.shade('accent', NV.coralSoft),
        { width: 1080, height: 520 },
        { name: 'Wave back' },
      ),
      path(
        'M0 300 C 320 160 700 420 1080 230 L1080 520 L0 520 Z',
        0,
        height - 520,
        W,
        520,
        linear(90, t.color('accent'), t.shade('accent', '#ff9a6b')),
        { width: 1080, height: 520 },
        { name: 'Wave front' },
      ),
      paint(
        [
          phone(tall ? 520 : 620, height - (tall ? 1180 : 860), phoneWidth, {
            rotation: 8,
            body: t.shade('text', PHONE_INK),
            screen: linear(180, t.color('secondary'), t.shade('secondary', '#f2fbff')),
            content: [
              path(
                hillPath(screen.width, screen.height * 0.38, phoneWidth * 0.12),
                0,
                screen.height * 0.62,
                screen.width,
                screen.height * 0.38,
                t.color('primary'),
                { width: screen.width, height: screen.height * 0.38 },
                { name: 'Hill' },
              ),
              circle(screen.width * 0.72, screen.height * 0.13, 40, t.color('accent'), {
                name: 'Sun',
              }),
              rect(30, screen.height * 0.36, screen.width - 60, 110, t.color('surface'), {
                cornerRadius: 22,
                name: 'Balance card',
              }),
              body(t.copy('cardLabel'), 52, screen.height * 0.36 + 14, 200, 22, t.color('text')),
              heading(
                t.copy('cardValue'),
                52,
                screen.height * 0.36 + 44,
                220,
                44,
                t.color('primary'),
                800,
              ),
            ],
          }),
        ],
        { [PHONE_INK]: t.shade('text', PHONE_INK) },
      ),
      logo(190, height - 120, t.color('surface'), t.copy('brand'), t.font('heading')),
    ];
  });

export const futureDigitalPost = futureDigital(H);
export const futureDigitalStory = futureDigital(STORY_SIZE.height);

const REVIEWS = [
  { photo: 'woman-portrait-2', x: 100 },
  { photo: 'man-portrait-3', x: 180 },
  { photo: 'woman-portrait-5', x: 120 },
] as const;

const CARD_SHADOW = 'rgba(15,23,42,0.14)';

const reviewsSpec = {
  colors: {
    background: {
      value: NV.teal,
      hint: 'Page gradient; its darkest shade tints the card shadows',
    },
    surface: { value: NV.white, hint: 'Review cards, the title and the logo' },
    accent: {
      value: NV.coral,
      hint: 'Stars and the top sparkle; its soft tint colors the photo rings and the bottom sparkle',
    },
    text: { value: NV.ink, hint: 'Quotes; its darker shade colors the reviewer names' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'What clients say' },
    names: { label: 'Reviewer', value: ['Priya Malhotra', 'Leon Barrett', 'Ana Whitfield'] },
    quotes: {
      label: 'Quote',
      value: [
        'Clear advice and quick answers.\nMy savings finally make sense.',
        'Simple to set up and easy to trust.\nHighly recommended.',
        'The smartest way I have ever\nplanned my money.',
      ],
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const testimonials = themed(W, H, reviewsSpec, (t) => {
  const heading = head(t.font('heading'));
  const quotes = t.list('quotes');
  return [
    rect(0, 0, W, H, linear(170, t.color('background'), t.shade('background', NV.deep)), {
      name: 'Background',
    }),
    heading(t.copy('title'), 0, 100, W, 60, t.color('surface'), 700, { align: 'center' }),
    t.list('names').map((name, index) => {
      const review = REVIEWS[index] ?? REVIEWS[0];
      const y = 240 + index * 260;
      return [
        paint([card(review.x, y, 800, 220, { fill: t.color('surface'), radius: 32 })], {
          [CARD_SHADOW]: t.shade('background', CARD_SHADOW),
        }),
        avatar(review.photo, review.x + 90, y + 110, 56, t.shade('accent', NV.coralSoft)),
        heading(name, review.x + 175, y + 36, 380, 32, t.shade('text', NV.deep), 700),
        rating(review.x + 590, y + 42, 26, 5, t.color('accent'), 0.2),
        copy(t.font('body'))(quotes[index] ?? '', review.x + 175, y + 90, 600, 26, t.color('text')),
      ];
    }),
    icon('sparkles', 930, 150, 80, t.color('accent'), { strokeWidth: 2 }),
    icon('sparkles', 50, 1010, 64, t.shade('accent', NV.coralSoft), { strokeWidth: 2 }),
    logo(540, 1180, t.color('surface'), t.copy('brand'), t.font('heading')),
  ];
});

const insightsSpec = {
  colors: {
    background: { value: NV.mist, hint: 'Page and the fade under the photo' },
    primary: {
      value: NV.teal,
      hint: 'First stat badge; its darker shade colors the headline, the second badge and the logo',
    },
    accent: { value: NV.coral, hint: 'into Insights and the third stat badge' },
    surface: { value: NV.white, hint: 'Stat numbers and labels' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Headline', value: 'Turning\nFinancial Data' },
    highlight: { label: 'Highlighted line', value: 'into Insights' },
    values: { label: 'Stat', value: ['27%', '4x', '98%'] },
    labels: {
      label: 'Stat label',
      value: ['Higher\nsavings', 'More new\nclients', 'Client\nhappiness'],
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const dataInsights = themed(W, H, insightsSpec, (t) => {
  const heading = head(t.font('heading'));
  const labels = t.list('labels');
  const fills = [t.color('primary'), t.shade('primary', NV.deep), t.color('accent')];
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('woman-portrait-4', 0, 0, W, 560, { crop: { zoom: 1, focusX: 0.5, focusY: 0.3 } }),
    rect(
      0,
      300,
      W,
      262,
      linear(180, t.shade('background', 'rgba(230,241,240,0)'), t.color('background')),
      { name: 'Fade' },
    ),
    heading(t.copy('title'), 80, 520, 920, 80, t.shade('primary', NV.deep), 700, {
      lineHeight: 1.1,
    }),
    heading(t.copy('highlight'), 80, 696, 920, 80, t.color('accent'), 800),
    t.list('values').map((value, index) => {
      const x = 80 + index * 325;
      const fill = fills[index] ?? t.color('primary');
      return [
        rect(x, 840, 270, 230, fill, { cornerRadius: 30, name: 'Stat badge' }),
        poly(
          [
            [x + 105, 1068],
            [x + 165, 1068],
            [x + 135, 1106],
          ],
          fill,
          { name: 'Badge pointer' },
        ),
        heading(value, x, 866, 270, 84, t.color('surface'), 800, { align: 'center' }),
        copy(t.font('body'))(labels[index] ?? '', x, 970, 270, 26, t.color('surface'), {
          align: 'center',
          lineHeight: 1.25,
        }),
      ];
    }),
    logo(540, 1190, t.shade('primary', NV.deep), t.copy('brand'), t.font('heading')),
  ];
});

const securitySpec = {
  colors: {
    background: { value: NV.white, hint: 'Page; its misty tint colors the bottom of the gradient' },
    primary: {
      value: NV.teal,
      hint: 'See How It Works button; its darker shade colors the logo, the header box and the Encrypted headline',
    },
    accent: {
      value: NV.coral,
      hint: 'Header icon square, the subtitle and the security tiles; its lighter tint starts the tile gradient',
    },
    surface: { value: NV.white, hint: 'Header title, all icons and the button label' },
    text: { value: NV.ink, hint: 'Body copy' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    headerTitle: { label: 'Header title', value: 'Your data stays protected' },
    headerSubtitle: { label: 'Header subtitle', value: 'by bank-grade security' },
    headline: { label: 'Headline', value: 'Encrypted & Secure Account Data.' },
    body: {
      label: 'Body',
      value: 'We take your privacy seriously,\nso you never have to worry.',
    },
    cta: { label: 'Button', value: 'See How It Works' },
  },
} as const satisfies ThemeSpec;

const securityPost = themed(W, H, securitySpec, (t) => {
  const heading = head(t.font('heading'));
  const deep = t.shade('primary', NV.deep);
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NV.mist)), {
      name: 'Background',
    }),
    logo(540, 120, deep, t.copy('brand'), t.font('heading')),
    rect(120, 300, 840, 160, deep, { cornerRadius: 28, name: 'Header box' }),
    rect(150, 330, 100, 100, t.color('accent'), { cornerRadius: 22, name: 'Header icon' }),
    icon('shield-check', 172, 352, 56, t.color('surface'), { strokeWidth: 2.4 }),
    heading(t.copy('headerTitle'), 280, 334, 660, 40, t.color('surface'), 700),
    heading(t.copy('headerSubtitle'), 280, 386, 660, 32, t.color('accent'), 600),
    (['lock', 'shield-check', 'key-round'] as const).map((name, index) => [
      rect(
        120 + index * 290,
        540,
        260,
        260,
        linear(150, t.shade('accent', '#ff9a6b'), t.color('accent')),
        { cornerRadius: 40, name: 'Security tile' },
      ),
      icon(name, 185 + index * 290, 605, 130, t.color('surface'), { strokeWidth: 1.8 }),
    ]),
    heading(t.copy('headline'), 0, 900, W, 44, deep, 800, { align: 'center' }),
    copy(t.font('body'))(t.copy('body'), 0, 970, W, 34, t.color('text'), { align: 'center' }),
    button(t.copy('cta'), 395, 1140, t.color('primary'), t.color('surface'), t.font('body')),
  ];
});

export const POSTS = [
  bankingChoice,
  securityPost,
  smarterPlans,
  futureDigitalPost,
  testimonials,
  dataInsights,
  fasterLoans,
  webinarSteps,
];
