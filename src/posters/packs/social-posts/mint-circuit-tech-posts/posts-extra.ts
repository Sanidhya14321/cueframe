import { linear } from '@/design';
import { icon, rect, STORY_SIZE, type ThemeSpec, text, themed } from '../../../kit';
import {
  amplifyBars,
  BODY,
  BRAND,
  brand,
  docsFolders,
  glow,
  H,
  HEADING,
  headline,
  MINT,
  mintText,
  powerRings,
  W,
  worldReach,
} from './posts';
import { countdown, quoteBox, teamRing, wordList } from './posts-more';

const pricingSpec = {
  colors: {
    background: {
      value: MINT.black,
      hint: 'Page, the badge behind Popular and the featured plan name and price; its dark green shade colors the featured plan description',
    },
    surface: { value: MINT.panel, hint: 'The two regular plan cards' },
    primary: {
      value: MINT.mint,
      hint: 'Glow, the second headline line, the featured plan card, the card outlines and Popular; its pale shade ends the gradients',
    },
    text: {
      value: MINT.white,
      hint: 'Brand name, first headline line and the regular plan names and prices; its grey shade colors their descriptions',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    headline: { label: 'Headline', value: 'Choose the plan' },
    highlight: { label: 'Highlight', value: 'that fits you' },
    plans: { label: 'Plan', value: ['Starter', 'Growth', 'Scale'] },
    bodies: {
      label: 'Plan description',
      value: [
        'One workspace and core\nautomations for solo teams.',
        'Unlimited flows, analytics\nand priority support.',
        'SSO, audit logs and a\ndedicated success manager.',
      ],
    },
    prices: { label: 'Price', value: ['$0/mo', '$19/mo', '$49/mo'] },
    badge: { label: 'Badge', value: 'Popular' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const pricingPlans = themed(W, H, pricingSpec, (t) => {
  const shade = (exact: string) => t.shade('primary', exact);
  const heading = t.font('heading');
  const body = t.font('body');
  const bodies = t.list('bodies');
  const prices = t.list('prices');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(shade, 540, 760, 560, 0.2),
    headline(t.copy('headline'), t.copy('highlight'), 110, 76, {
      first: t.color('text'),
      second: mintText(t.color('primary'), shade),
      font: heading,
    }),
    t.list('plans').map((plan, index) => {
      const y = 380 + index * 260;
      const featured = index === 1;
      const ink = featured ? t.color('background') : t.color('text');
      return [
        rect(90, y, 900, 220, featured ? mintText(t.color('primary'), shade) : t.color('surface'), {
          cornerRadius: 28,
          stroke: shade('rgba(94,242,180,0.3)'),
          strokeWidth: featured ? 0 : 2,
          name: 'Plan card',
        }),
        text(plan, 140, y + 40, 400, {
          fontFamily: heading,
          fontSize: 42,
          fontWeight: 800,
          fill: ink,
        }),
        featured
          ? [
              rect(360, y + 46, 150, 44, t.color('background'), {
                cornerRadius: 22,
                name: 'Badge',
              }),
              text(t.copy('badge'), 360, y + 54, 150, {
                fontFamily: body,
                fontSize: 22,
                fontWeight: 700,
                fill: t.color('primary'),
                align: 'center',
              }),
            ]
          : [],
        text(bodies[index] ?? '', 140, y + 108, 520, {
          fontFamily: body,
          fontSize: 26,
          fontWeight: 500,
          fill: featured ? t.shade('background', '#1f3a30') : t.shade('text', MINT.grey),
          lineHeight: 1.35,
        }),
        text(prices[index] ?? '', 640, y + 76, 300, {
          fontFamily: heading,
          fontSize: 54,
          fontWeight: 800,
          fill: ink,
          align: 'right',
        }),
      ];
    }),
    brand(t.copy('brand'), 1230, t.color('text'), heading),
  ];
});

const rocketSpec = {
  colors: {
    background: { value: MINT.black, hint: 'Page and the badge label' },
    primary: {
      value: MINT.mint,
      hint: 'Glow, the first headline word, the badge and the rocket; its pale shade lightens the word and badge gradients',
    },
    text: {
      value: MINT.white,
      hint: 'Brand name and the second headline word; its grey shade colors the subline',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    highlight: { label: 'Highlight', value: 'Smart' },
    badge: { label: 'Badge', value: 'UX' },
    title: { label: 'Title', value: 'Design' },
    subline: { label: 'Subline', value: 'And it keeps getting sharper.' },
  },
} as const satisfies ThemeSpec;

const rocket = (height: number, top: number, size: number) =>
  themed(W, height, rocketSpec, (t) => {
    const shade = (exact: string) => t.shade('primary', exact);
    const heading = t.font('heading');
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      glow(shade, 480, height - size * 0.72, 560, 0.35, height),
      brand(t.copy('brand'), top - 130, t.color('text'), heading),
      text(t.copy('highlight'), 130, top, 520, {
        fontFamily: heading,
        fontSize: 130,
        fontWeight: 800,
        fill: mintText(t.color('primary'), shade),
      }),
      rect(590, top - 10, 130, 120, linear(150, shade(MINT.pale), t.color('primary')), {
        cornerRadius: 24,
        rotation: 10,
        name: 'Badge',
      }),
      text(t.copy('badge'), 590, top + 22, 120, {
        fontFamily: heading,
        fontSize: 54,
        fontWeight: 800,
        fill: t.color('background'),
        align: 'center',
        rotation: 10,
      }),
      text(t.copy('title'), 130, top + 150, 820, {
        fontFamily: heading,
        fontSize: 130,
        fontWeight: 400,
        fill: t.color('text'),
      }),
      text(t.copy('subline'), 136, top + 310, 820, {
        fontFamily: t.font('body'),
        fontSize: 36,
        fontWeight: 500,
        fill: t.shade('text', MINT.grey),
      }),
      icon('rocket', 490 - size / 2, height - size - 140, size, t.color('primary'), {
        strokeWidth: 1.1,
      }),
    ];
  });

export const rocketPost = rocket(H, 220, 620);

export const rocketStory = rocket(STORY_SIZE.height, 420, 820);

export const POSTS = [
  powerRings,
  docsFolders,
  worldReach,
  amplifyBars,
  quoteBox,
  rocketPost,
  teamRing,
  countdown,
  wordList,
  pricingPlans,
];
