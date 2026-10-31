import { linear, radial } from '@/design';
import { circle, photo, poly, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import {
  BLOCK,
  BODY,
  BRAND,
  brandMark,
  DISPLAY,
  H,
  MONO,
  SIGNAL as S,
  SCRIPT,
  W,
  waveform,
} from './palette';

const pulseSpec = {
  colors: {
    background: {
      value: S.amber,
      hint: 'Page gradient and the metric numbers; its orange shade is the bottom of the gradient',
    },
    primary: {
      value: S.ink,
      hint: 'AUDIENCE box, PULSE, the number boxes, metric titles and the brand mark',
    },
    surface: { value: S.white, hint: 'PULSE box, metric cards and the word AUDIENCE' },
    text: { value: S.slate, hint: 'Metric descriptions' },
  },
  fonts: { heading: BLOCK, body: BODY },
  copy: {
    title: { label: 'Title', value: 'AUDIENCE' },
    subtitle: { label: 'Second title line', value: 'PULSE' },
    values: { label: 'Metric number', value: ['88%', '71%', '64%', '49%'] },
    titles: {
      label: 'Metric title',
      value: ['STAY FOR ADS', 'DAILY HABIT', 'SHARE CLIPS', 'BUY FROM HOSTS'],
    },
    bodies: {
      label: 'Metric description',
      value: [
        'Most listeners keep the\nsponsor reads playing.',
        'Tune in at least five\ndays every week.',
        'Send a favourite moment\nto a friend.',
        'Tried a product a host\nrecommended on air.',
      ],
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const audiencePulse = themed(W, H, pulseSpec, (t) => {
  const titles = t.list('titles');
  const bodies = t.list('bodies');
  return [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', S.flame)), {
      name: 'Background',
    }),
    rect(100, 120, 600, 140, t.color('primary'), { cornerRadius: 6, name: 'Title box' }),
    text(t.copy('title'), 100, 138, 600, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 400,
      fill: t.color('surface'),
      align: 'center',
      lineHeight: 1.1,
    }),
    rect(380, 250, 600, 140, t.color('surface'), { cornerRadius: 6, name: 'Title box' }),
    text(t.copy('subtitle'), 380, 268, 600, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1.1,
    }),
    t.list('values').map((value, index) => {
      const x = 100 + (index % 2) * 460;
      const y = 500 + Math.floor(index / 2) * 330;
      return [
        rect(x, y, 420, 270, t.color('surface'), { cornerRadius: 18, name: 'Metric card' }),
        rect(x + 28, y - 36, 190, 76, t.color('primary'), {
          cornerRadius: 8,
          name: 'Metric value box',
        }),
        text(value, x + 28, y - 28, 190, {
          fontFamily: t.font('heading'),
          fontSize: 50,
          fontWeight: 400,
          fill: t.color('background'),
          align: 'center',
          lineHeight: 1.2,
        }),
        text(titles[index] ?? '', x + 32, y + 70, 360, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 800,
          fill: t.color('primary'),
          letterSpacing: 1,
        }),
        text(bodies[index] ?? '', x + 32, y + 124, 360, {
          fontFamily: t.font('body'),
          fontSize: 27,
          fontWeight: 500,
          fill: t.color('text'),
          lineHeight: 1.35,
        }),
      ];
    }),
    brandMark(t.copy('brand'), t.font('body'), t.color('primary'), 1210),
  ];
});

const onAirSpec = {
  colors: {
    background: {
      value: S.ink,
      hint: 'Page, the photo tint, the edge of the glow and the frequency label text',
    },
    primary: {
      value: S.amber,
      hint: 'Outlined LIVE words, the warm glow behind the mic and the frequency label',
    },
    text: { value: S.white, hint: 'ON AIR, NIGHTLY and the brand mark' },
  },
  fonts: { heading: DISPLAY, body: BODY },
  copy: {
    backdrop: { label: 'Backdrop word', value: 'LIVE' },
    title: { label: 'Title', value: 'ON AIR' },
    label: { label: 'Frequency label', value: 'STREAMING ON 92.1 FM' },
    subtitle: { label: 'Second title line', value: 'NIGHTLY' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const onAirNightly = themed(W, H, onAirSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  [0, 1].map((index) =>
    text(t.copy('backdrop'), 0, 90 + index * 590, W, {
      fontFamily: t.font('heading'),
      fontSize: 560,
      fontWeight: 400,
      fill: t.shade('primary', 'rgba(255,180,60,0)'),
      stroke: t.shade('primary', 'rgba(255,180,60,0.32)'),
      strokeWidth: 3,
      align: 'center',
      lineHeight: 1,
    }),
  ),
  circle(
    540,
    640,
    420,
    radial(t.shade('primary', 'rgba(255,122,61,0.55)'), t.shade('background', 'rgba(20,15,38,0)')),
    { name: 'Glow' },
  ),
  photo('microphone-1', 300, 220, 480, 840, { cornerRadius: 240 }),
  rect(300, 220, 480, 840, t.shade('background', 'rgba(20,15,38,0.25)'), {
    cornerRadius: 240,
    name: 'Photo tint',
  }),
  text(t.copy('title'), 0, 430, W, {
    fontFamily: t.font('heading'),
    fontSize: 240,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1,
    ...shadow(30, 8, 'rgba(0,0,0,0.5)'),
  }),
  rect(300, 690, 480, 66, t.color('primary'), { cornerRadius: 8, name: 'Label' }),
  text(t.copy('label'), 300, 704, 480, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 800,
    fill: t.color('background'),
    align: 'center',
    letterSpacing: 2,
  }),
  text(t.copy('subtitle'), 0, 770, W, {
    fontFamily: t.font('heading'),
    fontSize: 240,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1,
    ...shadow(30, 8, 'rgba(0,0,0,0.5)'),
  }),
  brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1200),
]);

const thanksSpec = {
  colors: {
    background: { value: S.paper, hint: 'Page; its white tint colors the big number' },
    primary: {
      value: S.amber,
      hint: 'Top of the number box gradient and the soft dot in the top corner',
    },
    accent: {
      value: S.flame,
      hint: 'Monthly, the bottom of the number box gradient and the soft dot in the bottom corner',
    },
    text: { value: S.ink, hint: 'Thank you!, FOR LISTENING IN, Listeners and the brand mark' },
  },
  fonts: { script: SCRIPT, heading: DISPLAY, body: BODY },
  copy: {
    thanks: { label: 'Script line', value: 'Thank you!' },
    title: { label: 'Title', value: 'FOR LISTENING IN' },
    kicker: { label: 'Kicker', value: 'Monthly' },
    number: { label: 'Number', value: '180K' },
    label: { label: 'Number label', value: 'Listeners' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const thankYou = themed(W, H, thanksSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  circle(930, 150, 150, t.shade('primary', 'rgba(255,180,60,0.18)'), { name: 'Dot' }),
  circle(150, 1200, 150, t.shade('accent', 'rgba(255,122,61,0.14)'), { name: 'Dot' }),
  text(t.copy('thanks'), 0, 150, W, {
    fontFamily: t.font('script'),
    fontSize: 140,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('title'), 0, 340, W, {
    fontFamily: t.font('heading'),
    fontSize: 124,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('kicker'), 150, 560, 400, {
    fontFamily: t.font('body'),
    fontSize: 60,
    fontWeight: 800,
    fill: t.color('accent'),
  }),
  rect(150, 650, 780, 290, linear(90, t.color('primary'), t.color('accent')), {
    cornerRadius: 22,
    name: 'Number box',
  }),
  text(t.copy('number'), 150, 665, 780, {
    fontFamily: t.font('heading'),
    fontSize: 250,
    fontWeight: 400,
    fill: t.shade('background', S.white),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('label'), 430, 960, 500, {
    fontFamily: t.font('body'),
    fontSize: 64,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'right',
  }),
  brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1200),
]);

const lateSpec = {
  colors: {
    background: { value: S.ink, hint: 'Page and the dark fade over the photo' },
    primary: { value: S.amber, hint: 'New Episode and the waveform' },
    accent: { value: S.flame, hint: 'Progress marker at the top of the side line' },
    text: { value: S.white, hint: 'Episode title, air time, the side line and the brand mark' },
  },
  fonts: { heading: BLOCK, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'New Episode' },
    title: { label: 'Episode title', value: 'Late Night\nSessions' },
    time: { label: 'Air time', value: 'Live at 11PM EST' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const lateNight = themed(W, H, lateSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  text(t.copy('kicker'), 90, 100, 500, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 600,
    fill: t.color('primary'),
  }),
  photo('man-portrait-3', 90, 180, 820, 880, { cornerRadius: 36, filters: MONO }),
  rect(
    90,
    520,
    820,
    540,
    linear(
      180,
      t.shade('background', 'rgba(20,15,38,0)'),
      t.shade('background', 'rgba(20,15,38,0.96)'),
    ),
    { cornerRadius: 36, name: 'Fade' },
  ),
  text(t.copy('title'), 140, 620, 720, {
    fontFamily: t.font('heading'),
    fontSize: 98,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1.05,
  }),
  text(t.copy('time'), 140, 850, 600, {
    fontFamily: t.font('body'),
    fontSize: 46,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  waveform(140, 980, 720, 90, 36, t.color('primary')),
  rect(966, 130, 6, 1080, t.color('text'), { name: 'Progress line' }),
  poly(
    [
      [934, 104],
      [1004, 104],
      [969, 160],
    ],
    t.color('accent'),
    { name: 'Progress marker' },
  ),
  brandMark(t.copy('brand'), t.font('body'), t.color('text'), 1180, 500),
]);
