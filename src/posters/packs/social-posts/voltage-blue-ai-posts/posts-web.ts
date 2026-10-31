import { linear, radial } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  path,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  automationCard,
  BODY,
  backdrop,
  CLEAR,
  GLOW,
  H,
  HEADING,
  shine,
  VOLT,
  W,
  wifiSpeed,
  words,
} from './posts';
import { nowList, scaleGauge, statsGlobe } from './posts-more';
import { aiBeginners, clientReviews } from './posts-reviews';
import { launchPost, wordsBlue } from './posts-words';

const websiteSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the address bar glow, the globe icon, the search button and is now live',
    },
    surface: { value: VOLT.white, hint: 'Address bar, the cursor and the search icon' },
    secondary: { value: VOLT.ink, hint: 'Web address and the cursor outline' },
    text: { value: VOLT.white, hint: 'New Website, the Visit Today label and its button outline' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    address: { label: 'Web address', value: 'kestrel.ai' },
    title: { label: 'Title', value: 'New Website' },
    highlight: { label: 'Highlighted title', value: 'is now live' },
    button: { label: 'Button', value: 'Visit Today' },
  },
} as const satisfies ThemeSpec;

const newWebsite = themed(W, H, websiteSpec, (t) => {
  const say = words(t.font('heading'));
  return [
    backdrop(H, t.color('background'), t.shade('primary', GLOW)),
    rotateNodes(-6, 540, 300, [
      rect(170, 240, 740, 116, t.color('surface'), {
        name: 'Address bar',
        cornerRadius: 58,
        ...shadow(60, 10, t.shade('primary', 'rgba(61,123,255,0.8)')),
      }),
      icon('globe', 206, 276, 46, t.color('primary')),
      text(t.copy('address'), 272, 272, 420, {
        fontFamily: t.font('body'),
        fontSize: 44,
        fontWeight: 600,
        fill: t.color('secondary'),
      }),
      rect(778, 258, 112, 80, t.color('primary'), { name: 'Search button', cornerRadius: 40 }),
      icon('search', 812, 276, 44, t.color('surface')),
    ]),
    poly(
      [
        [840, 360],
        [840, 440],
        [860, 422],
        [876, 456],
        [892, 449],
        [876, 416],
        [904, 416],
      ],
      t.color('surface'),
      { name: 'Cursor', stroke: t.color('secondary'), strokeWidth: 3 },
    ),
    say(t.copy('title'), 600, 116, t.color('text'), 800),
    say(
      t.copy('highlight'),
      725,
      116,
      shine(t.shade('primary', VOLT.sky), t.color('primary')),
      800,
    ),
    rect(380, 920, 320, 90, t.shade('text', CLEAR), {
      name: 'Visit button',
      cornerRadius: 45,
      stroke: t.color('text'),
      strokeWidth: 3,
    }),
    text(t.copy('button'), 380, 943, 320, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
});

const architectSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the glowing bulb and the quote mark',
    },
    surface: {
      value: '#d5dbe6',
      hint: 'Metal screw base of the bulb; its darker shades color the base edges and tip',
    },
    text: {
      value: VOLT.white,
      hint: 'Architect and the bulb filament; its grey shade colors the description',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Architect' },
    description: {
      label: 'Description',
      value: 'Designing scalable systems with\ndata-driven creative strategy.',
    },
  },
} as const satisfies ThemeSpec;

export const architect = themed(W, H, architectSpec, (t) => [
  backdrop(H, t.color('background'), t.shade('primary', GLOW)),
  circle(
    540,
    450,
    340,
    radial(t.shade('primary', 'rgba(61,123,255,0.55)'), t.shade('primary', CLEAR)),
    { name: 'Glow' },
  ),
  circle(
    540,
    430,
    190,
    radial(t.shade('primary', '#f4f8ff'), t.shade('primary', VOLT.sky), t.color('primary')),
    { name: 'Bulb', ...shadow(90, 0, t.shade('primary', 'rgba(61,123,255,1)')) },
  ),
  path(
    'M 490 460 L 510 400 L 530 460 L 550 400 L 570 460 L 590 400',
    0,
    0,
    W,
    H,
    t.shade('text', CLEAR),
    POST_SIZE,
    { name: 'Filament', stroke: t.color('text'), strokeWidth: 6 },
  ),
  [0, 1, 2].map((index) =>
    rect(
      460,
      600 + index * 34,
      160,
      26,
      linear(90, t.shade('surface', '#5b6478'), t.color('surface'), t.shade('surface', '#5b6478')),
      { name: 'Bulb base', cornerRadius: 10 },
    ),
  ),
  rect(500, 702, 80, 34, t.shade('surface', '#2a3142'), { name: 'Bulb tip', cornerRadius: 14 }),
  icon('quote', 80, 830, 96, t.shade('primary', VOLT.sky), { strokeWidth: 2.4 }),
  words(t.font('heading'))(t.copy('title'), 950, 100, t.color('text'), 800, 80, 900, 'left'),
  text(t.copy('description'), 80, 1080, 900, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 400,
    fill: t.shade('text', VOLT.grey),
    lineHeight: 1.4,
  }),
]);

export const POSTS = [
  aiBeginners,
  wifiSpeed,
  wordsBlue,
  newWebsite,
  scaleGauge,
  launchPost,
  nowList,
  automationCard,
  architect,
  clientReviews,
  statsGlobe,
];
