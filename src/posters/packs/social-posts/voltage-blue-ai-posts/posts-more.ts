import { linear, radial } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  path,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, backdrop, CLEAR, GLOW, H, HEADING, VOLT, W, words } from './posts';

const gaugeSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the icon tile, your business and the bottom of the big stat',
    },
    text: {
      value: VOLT.white,
      hint: 'Sparkles icon, Scale AI across, the dial ticks and the top of the big stat; its grey shade colors the tagline',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Scale AI across' },
    highlight: { label: 'Highlighted line', value: 'your business' },
    stat: { label: 'Stat', value: '72%' },
    tagline: { label: 'Tagline', value: 'faster rollouts with smart agents' },
  },
} as const satisfies ThemeSpec;

const scaleGauge = themed(W, H, gaugeSpec, (t) => [
  backdrop(H, t.color('background'), t.shade('primary', GLOW)),
  rect(150, 150, 130, 130, linear(135, t.shade('primary', VOLT.sky), t.color('primary')), {
    name: 'Icon tile',
    cornerRadius: 32,
    ...shadow(40, 0, t.shade('primary', 'rgba(61,123,255,0.7)')),
  }),
  icon('sparkles', 180, 180, 70, t.color('text')),
  text(t.copy('intro'), 310, 160, 650, {
    fontFamily: t.font('heading'),
    fontSize: 46,
    fontWeight: 400,
    fill: t.color('text'),
  }),
  text(t.copy('highlight'), 310, 216, 650, {
    fontFamily: t.font('heading'),
    fontSize: 46,
    fontWeight: 700,
    fill: t.shade('primary', VOLT.sky),
  }),
  Array.from({ length: 41 }, (_, index) => {
    const long = index % 5 === 0;
    const length = long ? 70 : 40;
    return rotateNodes(190 + index * 4, 540, 1000, [
      rect(
        540 + 440 - length,
        998,
        length,
        4,
        long ? t.color('text') : t.shade('text', 'rgba(255,255,255,0.45)'),
        { name: 'Tick' },
      ),
    ]);
  }),
  words(t.font('heading'))(
    t.copy('stat'),
    740,
    280,
    linear(180, t.color('text'), t.shade('primary', VOLT.sky)),
    800,
  ),
  text(t.copy('tagline'), 0, 1100, W, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.shade('text', VOLT.grey),
    align: 'center',
  }),
]);

const globeSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the globe and its outline, and the bottom of every stat',
    },
    text: {
      value: VOLT.white,
      hint: 'Top of every stat and the globe grid lines; its grey shade colors the stat labels',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    labels: {
      label: 'Stat label',
      value: ['Organisations', 'Repositories', 'Contributors', 'Integrations'],
    },
    values: { label: 'Stat', value: ['512K', '284M', '21.4K', '16.8K'] },
  },
} as const satisfies ThemeSpec;

const statsGlobe = themed(W, H, globeSpec, (t) => {
  const meridians = [110, 230, 340].map(
    (spread) => `M ${540 - spread} 1350 A ${spread} 420 0 0 1 ${540 + spread} 1350`,
  );
  const parallels = [0.3, 0.58, 0.82].map((ratio) => {
    const y = 1350 - 420 * ratio;
    const half = 420 * Math.sqrt(1 - ratio * ratio);
    return `M ${(540 - half).toFixed(1)} ${y.toFixed(1)} L ${(540 + half).toFixed(1)} ${y.toFixed(1)}`;
  });
  const values = t.list('values');
  const say = words(t.font('heading'));
  return [
    backdrop(H, t.color('background'), t.shade('primary', GLOW)),
    t.list('labels').map((label, index) => {
      const x = 90 + (index % 2) * 470;
      const y = 150 + Math.floor(index / 2) * 260;
      return [
        text(label, x, y, 430, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: 500,
          fill: t.shade('text', VOLT.grey),
          align: 'center',
        }),
        say(
          values[index] ?? '',
          y + 50,
          130,
          linear(180, t.color('text'), t.shade('primary', VOLT.sky)),
          800,
          x,
          430,
        ),
      ];
    }),
    path(
      'M 120 1350 A 420 420 0 0 1 960 1350 Z',
      0,
      0,
      W,
      H,
      linear(180, t.color('primary'), t.shade('primary', '#0a1440')),
      POST_SIZE,
      {
        name: 'Globe',
        stroke: t.shade('primary', VOLT.sky),
        strokeWidth: 4,
        ...shadow(80, 0, t.shade('primary', 'rgba(61,123,255,0.8)')),
      },
    ),
    path([...meridians, ...parallels].join(' '), 0, 0, W, H, t.shade('text', CLEAR), POST_SIZE, {
      name: 'Globe lines',
      stroke: t.shade('text', 'rgba(255,255,255,0.35)'),
      strokeWidth: 3,
    }),
  ];
});

const ACTIVE = [false, false, true] as const;

const pollSpec = {
  colors: {
    background: { value: VOLT.black, hint: 'Dark top of the page' },
    primary: {
      value: VOLT.blue,
      hint: 'Page glow, the picked answer radio and its ring, and the handle',
    },
    text: {
      value: VOLT.white,
      hint: 'Question, the picked answer and the radio highlight; its grey shades color the other answers and their rings',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    question: { label: 'Question', value: 'When should your team\nstart using AI?' },
    answers: { label: 'Answer', value: ['Next quarter', 'Tomorrow', 'Right NOW'] },
    handle: { label: 'Handle', value: 'kestrel.ai' },
  },
} as const satisfies ThemeSpec;

const nowList = themed(W, H, pollSpec, (t) => [
  backdrop(H, t.color('background'), t.shade('primary', GLOW)),
  words(t.font('heading'))(t.copy('question'), 170, 68, t.color('text'), 700),
  t.list('answers').map((answer, index) => {
    const y = 560 + index * 170;
    const active = ACTIVE[index] ?? false;
    return [
      circle(
        330,
        y + 40,
        38,
        active ? radial(t.shade('text', VOLT.white), t.color('primary')) : t.shade('text', CLEAR),
        {
          name: 'Radio',
          stroke: active ? t.shade('primary', VOLT.sky) : t.shade('text', 'rgba(255,255,255,0.5)'),
          strokeWidth: 5,
          ...(active ? shadow(40, 0, t.color('primary')) : {}),
        },
      ),
      text(answer, 410, y, 600, {
        fontFamily: t.font('heading'),
        fontSize: 68,
        fontWeight: active ? 800 : 400,
        fill: active ? t.color('text') : t.shade('text', VOLT.grey),
      }),
    ];
  }),
  text(t.copy('handle'), 0, 1200, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.shade('primary', VOLT.sky),
    align: 'center',
    letterSpacing: 2,
  }),
]);

export { nowList, scaleGauge, statsGlobe };
