import { linear } from '@/design';
import {
  circle,
  ellipse,
  icon,
  laptop,
  paint,
  poly,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, BRAND, brandMark, H, HEADING, TIDE, W } from './posts';

const HANDLE_SPOTS = [
  [234, 444],
  [834, 444],
  [234, 540],
  [834, 540],
] as const;

const websiteSpec = {
  colors: {
    background: {
      value: TIDE.night,
      hint: 'Page gradient; its shades color the bottom of the gradient, the laptop body and the cursor outline',
    },
    primary: {
      value: TIDE.aqua,
      hint: 'is now live, the address box and the glow under the laptop',
    },
    text: {
      value: TIDE.white,
      hint: 'Brand mark, New Website, the address, box handles and cursor; its shades color the caption, laptop base, screen and cloud',
    },
    secondary: { value: '#7dd3fc', hint: 'Sky on the laptop screen' },
    accent: { value: '#3f9b5c', hint: 'Hills on the laptop screen' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    title: { label: 'Title', value: 'New Website' },
    highlight: { label: 'Highlighted title', value: 'is now live' },
    address: { label: 'Address', value: 'tideline.io' },
    caption: { label: 'Caption', value: 'Explore the new experience' },
  },
} as const satisfies ThemeSpec;

export const websiteLive = themed(W, H, websiteSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', TIDE.deep)), {
    name: 'Background',
  }),
  brandMark(t.copy('brand'), 0, 80, W, t.color('text'), t.font('heading'), 'center'),
  text(t.copy('title'), 0, 160, W, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('highlight'), 0, 280, W, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('primary'),
    align: 'center',
  }),
  rect(240, 450, 600, 96, t.shade('primary', 'rgba(15,165,150,0.22)'), {
    name: 'Address box',
    stroke: t.color('primary'),
    strokeWidth: 3,
  }),
  HANDLE_SPOTS.map(([x, y]) => rect(x, y, 12, 12, t.color('text'), { name: 'Handle' })),
  text(t.copy('address'), 240, 472, 600, {
    fontFamily: t.font('body'),
    fontSize: 44,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
  }),
  poly(
    [
      [820, 520],
      [820, 590],
      [838, 574],
      [852, 604],
      [866, 598],
      [852, 568],
      [876, 568],
    ],
    t.color('text'),
    { name: 'Cursor', stroke: t.shade('background', TIDE.ink), strokeWidth: 3 },
  ),
  ellipse(180, 1040, 720, 120, t.shade('primary', 'rgba(94,234,212,0.18)'), { name: 'Glow' }),
  paint(
    [
      laptop(250, 680, 580, {
        body: t.shade('background', '#1b2b2a'),
        screen: t.color('text'),
        content: [
          rect(0, 0, 551, 331, linear(180, t.color('secondary'), t.shade('secondary', '#e0f7f4')), {
            name: 'Sky',
          }),
          ellipse(330, 50, 120, 40, t.shade('text', 'rgba(255,255,255,0.9)'), { name: 'Cloud' }),
          poly(
            [
              [0, 220],
              [180, 170],
              [360, 210],
              [551, 160],
              [551, 331],
              [0, 331],
            ],
            t.color('accent'),
            { name: 'Hill' },
          ),
          poly(
            [
              [0, 280],
              [260, 230],
              [551, 270],
              [551, 331],
              [0, 331],
            ],
            t.shade('accent', '#2f7a47'),
            { name: 'Hill' },
          ),
        ],
      }),
    ],
    { '#cbd5e1': t.shade('text', '#cbd5e1') },
  ),
  text(t.copy('caption'), 0, 1170, W, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 500,
    fill: t.shade('text', TIDE.grey),
    align: 'center',
  }),
]);

const pollSpec = {
  colors: {
    background: {
      value: TIDE.white,
      hint: 'Page gradient; its shades color the bottom of the gradient and the option outlines',
    },
    surface: { value: TIDE.white, hint: 'Answer cards, the Quick Poll label and the vote arrow' },
    primary: {
      value: TIDE.teal,
      hint: 'Quick Poll tag, check boxes and the vote button; its darker shade colors the site address and the tag gradient',
    },
    text: {
      value: TIDE.ink,
      hint: 'Brand mark, question and answers; its see-through shade is the answer card shadows',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    site: { label: 'Website', value: 'TIDELINE.IO' },
    tag: { label: 'Tag', value: 'Quick Poll' },
    question: { label: 'Question', value: 'Which Skill Drives\nB2B Growth Most?' },
    options: {
      label: 'Answer',
      value: ['Account Planning', 'Content Strategy', 'Data Storytelling', 'Partner Selling'],
    },
  },
} as const satisfies ThemeSpec;

export const skillPoll = themed(W, H, pollSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', TIDE.mist)), {
    name: 'Background',
  }),
  brandMark(t.copy('brand'), 70, 70, 500, t.color('text'), t.font('heading')),
  text(t.copy('site'), 560, 74, 450, {
    fontFamily: t.font('body'),
    fontSize: 24,
    fontWeight: 600,
    fill: t.shade('primary', TIDE.sea),
    align: 'right',
    letterSpacing: 2,
  }),
  rect(370, 180, 340, 84, linear(90, t.color('primary'), t.shade('primary', TIDE.sea)), {
    name: 'Poll tag',
    cornerRadius: 12,
  }),
  text(t.copy('tag'), 370, 197, 340, {
    fontFamily: t.font('heading'),
    fontSize: 42,
    fontWeight: 700,
    fill: t.color('surface'),
    align: 'center',
  }),
  text(t.copy('question'), 0, 310, W, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.15,
  }),
  t.list('options').map((option, index) => {
    const y = 560 + index * 130;
    return [
      rect(200, y, 680, 100, t.color('surface'), {
        name: 'Option',
        cornerRadius: 18,
        stroke: t.shade('background', '#cfe3df'),
        strokeWidth: 2,
        ...shadow(20, 6, t.shade('text', 'rgba(10,31,30,0.08)')),
      }),
      icon('square-check', 236, y + 28, 44, t.color('primary')),
      text(option, 306, y + 29, 540, {
        fontFamily: t.font('body'),
        fontSize: 36,
        fontWeight: 500,
        fill: t.color('text'),
      }),
    ];
  }),
  circle(540, 1170, 54, t.color('primary'), { name: 'Vote button' }),
  icon('arrow-down', 510, 1140, 60, t.color('surface'), { strokeWidth: 2.5 }),
]);
