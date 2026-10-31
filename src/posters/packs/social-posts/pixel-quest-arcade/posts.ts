import { circle, photo, poly, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import {
  H,
  HEADING_FONT,
  HEART,
  MONO_FONT,
  PIXEL_FONT,
  PX,
  scanlines,
  siteFooter,
  sprite,
  W,
  WEBSITE,
} from './pixel';

const clientsSpec = {
  colors: {
    background: { value: PX.night, hint: 'Page and the shadow under NEW CLIENTS' },
    primary: {
      value: PX.pink,
      hint: 'HI-SCORE label, the hearts, the top stripe and the answer pointer',
    },
    secondary: {
      value: PX.sun,
      hint: 'Yellow stripe; its orange shade colors the stripe above it',
    },
    accent: {
      value: PX.mint,
      hint: 'YES answer and the mint stripe; its blue shade colors the bottom stripe',
    },
    text: {
      value: PX.white,
      hint: 'Score, UNLOCK NEW CLIENTS, the question and NO; its grey shade colors the website',
    },
  },
  fonts: { heading: HEADING_FONT, pixel: PIXEL_FONT },
  copy: {
    scoreLabel: { label: 'Score label', value: 'HI-SCORE' },
    score: { label: 'Score', value: '098000' },
    kicker: { label: 'Kicker', value: 'UNLOCK' },
    title: { label: 'Title', value: 'NEW' },
    subtitle: { label: 'Second title line', value: 'CLIENTS' },
    question: { label: 'Question', value: 'READY TO LEVEL UP?' },
    answers: { label: 'Answer', value: ['YES', 'NO'] },
    site: WEBSITE,
  },
} as const satisfies ThemeSpec;

export const newClients = themed(W, H, clientsSpec, (t) => {
  const stripes = [
    t.color('primary'),
    t.shade('secondary', PX.orange),
    t.color('secondary'),
    t.color('accent'),
    t.shade('accent', PX.sky),
  ];
  const [yes = '', no = ''] = t.list('answers');
  const pixel = t.font('pixel');
  const heading = t.font('heading');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('scoreLabel'), 80, 86, 400, {
      fontFamily: pixel,
      fontSize: 34,
      fontWeight: 400,
      fill: t.color('primary'),
    }),
    text(t.copy('score'), 80, 132, 400, {
      fontFamily: pixel,
      fontSize: 34,
      fontWeight: 400,
      fill: t.color('text'),
    }),
    [0, 1, 2].map((index) => sprite(HEART, 790 + index * 72, 104, 8, { P: t.color('primary') })),
    stripes.map((color, index) =>
      poly(
        [
          [0, 800 + index * 36],
          [W, 560 + index * 36],
          [W, 590 + index * 36],
          [0, 830 + index * 36],
        ],
        color,
        { name: 'Stripe' },
      ),
    ),
    text(t.copy('kicker'), 80, 360, 600, {
      fontFamily: heading,
      fontSize: 60,
      fontWeight: 400,
      fill: t.color('text'),
    }),
    text(t.copy('title'), 70, 430, 900, {
      fontFamily: heading,
      fontSize: 240,
      fontWeight: 400,
      fill: t.color('text'),
      lineHeight: 1,
      ...shadow(0, 10, t.color('background')),
    }),
    text(t.copy('subtitle'), 70, 690, 940, {
      fontFamily: heading,
      fontSize: 150,
      fontWeight: 400,
      fill: t.color('text'),
      lineHeight: 1,
      ...shadow(0, 10, t.color('background')),
    }),
    text(t.copy('question'), 0, 1030, W, {
      fontFamily: pixel,
      fontSize: 44,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
    }),
    text(yes, 340, 1110, 160, {
      fontFamily: pixel,
      fontSize: 48,
      fontWeight: 400,
      fill: t.color('accent'),
    }),
    poly(
      [
        [530, 1136],
        [565, 1116],
        [565, 1156],
      ],
      t.color('primary'),
      { name: 'Pointer' },
    ),
    text(no, 600, 1110, 160, {
      fontFamily: pixel,
      fontSize: 48,
      fontWeight: 400,
      fill: t.color('text'),
    }),
    siteFooter(t.copy('site'), 1250, t.shade('text', PX.grey), pixel),
  ];
});

const workshopSpec = {
  colors: {
    background: {
      value: PX.night,
      hint: 'Tint over the photo and LIVE WORKSHOP on the screen; its lighter shades color the screen bezel and d-pad',
    },
    surface: { value: '#dcd6ca', hint: 'Handheld console body' },
    primary: {
      value: '#b9f2a2',
      hint: 'Console screen; its darker shade colors GROWTH SECRETS',
    },
    secondary: {
      value: '#9a5a34',
      hint: 'Leather patch; its lighter shade colors the stitching',
    },
    accent: {
      value: PX.mint,
      hint: 'Date line and the mint button; its pink shade colors the other button',
    },
    text: { value: PX.cream, hint: 'SAVE YOUR SEAT TODAY on the leather patch' },
  },
  fonts: { pixel: PIXEL_FONT, mono: MONO_FONT },
  copy: {
    date: { label: 'Date line', value: 'FREE  ·  THU 6PM' },
    title: { label: 'Title', value: 'LIVE' },
    subtitle: { label: 'Subtitle', value: 'WORKSHOP' },
    topic: { label: 'Topic', value: 'GROWTH SECRETS' },
    cta: { label: 'Call to action', value: 'SAVE YOUR\nSEAT TODAY!' },
  },
} as const satisfies ThemeSpec;

export const liveWorkshop = themed(W, H, workshopSpec, (t) => {
  const pixel = t.font('pixel');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('console-1', 0, 0, W, H),
    rect(0, 0, W, H, t.shade('background', 'rgba(22,10,43,0.55)'), { name: 'Photo tint' }),
    text(t.copy('date'), 0, 100, W, {
      fontFamily: pixel,
      fontSize: 40,
      fontWeight: 400,
      fill: t.color('accent'),
      align: 'center',
    }),
    rect(250, 210, 580, 720, t.color('surface'), {
      cornerRadius: 40,
      name: 'Handheld body',
      ...shadow(50, 20, 'rgba(0,0,0,0.5)'),
    }),
    rect(290, 250, 500, 400, t.shade('background', '#55526a'), {
      cornerRadius: 18,
      name: 'Screen bezel',
    }),
    rect(330, 285, 420, 330, t.color('primary'), { name: 'Screen' }),
    text(t.copy('title'), 330, 320, 420, {
      fontFamily: pixel,
      fontSize: 86,
      fontWeight: 400,
      fill: t.color('background'),
      align: 'center',
    }),
    text(t.copy('subtitle'), 330, 440, 420, {
      fontFamily: pixel,
      fontSize: 58,
      fontWeight: 400,
      fill: t.color('background'),
      align: 'center',
    }),
    text(t.copy('topic'), 330, 540, 420, {
      fontFamily: pixel,
      fontSize: 28,
      fontWeight: 400,
      fill: t.shade('primary', '#2f6b3a'),
      align: 'center',
    }),
    rect(330, 760, 130, 40, t.shade('background', PX.road), { cornerRadius: 6, name: 'D-pad' }),
    rect(375, 715, 40, 130, t.shade('background', PX.road), { cornerRadius: 6, name: 'D-pad' }),
    circle(700, 750, 36, t.shade('accent', PX.pink)),
    circle(620, 810, 36, t.color('accent')),
    rect(260, 990, 560, 230, t.color('secondary'), {
      cornerRadius: 22,
      stroke: t.shade('secondary', '#e2b48a'),
      strokeWidth: 5,
      dashed: true,
      name: 'Leather patch',
    }),
    text(t.copy('cta'), 260, 1030, 560, {
      fontFamily: t.font('mono'),
      fontSize: 62,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.15,
    }),
  ];
});

const servicesSpec = {
  colors: {
    background: { value: PX.night, hint: 'Page' },
    primary: { value: PX.pink, hint: 'Offset shadow behind OUR SERVICES' },
    secondary: { value: PX.sun, hint: 'PRESS START line' },
    accent: { value: PX.mint, hint: 'Selected service and its cursor' },
    text: {
      value: PX.white,
      hint: 'OUR SERVICES and the scanlines; its lilac shade colors the other services and its grey shade the website',
    },
  },
  fonts: { pixel: PIXEL_FONT },
  copy: {
    title: { label: 'Title line', value: ['OUR', 'SERVICES'] },
    services: {
      label: 'Service',
      value: ['PAID ADS', 'BRAND IDENTITY', 'WEB DESIGN', 'GROWTH STRATEGY'],
    },
    cta: { label: 'Call to action', value: 'PRESS START TO BOOK A CALL' },
    site: WEBSITE,
  },
} as const satisfies ThemeSpec;

export const ourServices = themed(W, H, servicesSpec, (t) => {
  const pixel = t.font('pixel');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    scanlines(H, t.shade('text', 'rgba(255,255,255,0.035)')),
    t.list('title').map((word, index) => [
      text(word, 88, 238 + index * 150, 960, {
        fontFamily: pixel,
        fontSize: 120,
        fontWeight: 400,
        fill: t.color('primary'),
      }),
      text(word, 80, 230 + index * 150, 960, {
        fontFamily: pixel,
        fontSize: 120,
        fontWeight: 400,
        fill: t.color('text'),
      }),
    ]),
    t.list('services').map((service, index) => [
      index === 0
        ? poly(
            [
              [86, 660],
              [120, 680],
              [86, 700],
            ],
            t.color('accent'),
            { name: 'Cursor' },
          )
        : [],
      text(service, 150, 650 + index * 110, 880, {
        fontFamily: pixel,
        fontSize: 54,
        fontWeight: 400,
        fill: index === 0 ? t.color('accent') : t.shade('text', PX.lilac),
      }),
    ]),
    text(t.copy('cta'), 0, 1120, W, {
      fontFamily: pixel,
      fontSize: 32,
      fontWeight: 400,
      fill: t.color('secondary'),
      align: 'center',
    }),
    siteFooter(t.copy('site'), 1250, t.shade('text', PX.grey), pixel),
  ];
});
