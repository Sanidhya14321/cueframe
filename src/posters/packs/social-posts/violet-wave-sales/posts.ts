import { linear } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  photo,
  pill,
  rect,
  rotateNodes,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const PW = {
  violet: '#5b3df5',
  violetDeep: '#3a22c4',
  ink: '#14112b',
  lilac: '#e4defe',
  white: '#ffffff',
  grey: '#7a7690',
};

export const W = POST_SIZE.width;
export const H = POST_SIZE.height;

export const HEADING = { label: 'Heading font', value: 'Poppins' } as const;
export const BODY = { label: 'Body font', value: 'Poppins' } as const;
export const HANDLE = { label: 'Handle', value: 'pulsewave.media' } as const;

type TextStyle = Parameters<typeof text>[4];

const font =
  (fontWeight: number, lineHeight: number) =>
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    style: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight,
      fill,
      lineHeight,
      ...style,
    });

export const heavy = font(800, 1.05);
export const bold = font(700, 1.2);
export const copy = font(400, 1.4);

export const tag = (
  label: string,
  x: number,
  y: number,
  fill: string,
  color: string,
  fontSize: number,
  fontFamily: string,
  stroke?: string,
) =>
  pill(label, x, y, {
    fill,
    color,
    fontSize,
    fontFamily,
    fontWeight: 700,
    stroke: stroke ?? fill,
    strokeWidth: stroke === undefined ? 0 : 4,
  });

export const handle = (label: string, y: number, color: string, fontFamily: string) =>
  copy(fontFamily)(label, 0, y, W, 26, color, {
    align: 'center',
    fontWeight: 600,
    letterSpacing: 2,
  });

const STACK = [
  { x: 200, angle: -4 },
  { x: 560, angle: 6 },
  { x: 170, angle: -2 },
  { x: 260, angle: 3 },
  { x: 200, angle: -3 },
  { x: 300, angle: 2 },
] as const;

const pillsSpec = {
  colors: {
    primary: {
      value: PW.violet,
      hint: 'Top of the page gradient; its shades color the bottom of the gradient and the handle',
    },
    surface: { value: PW.white, hint: 'Light pills, the labels on dark pills and the arrow' },
    text: { value: PW.ink, hint: 'Dark pills, the labels on light pills and every pill outline' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    pills: {
      label: 'Pill',
      value: ['Build', 'Your', 'Social Media', 'Branding', 'Through', 'Our Team'],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const buildPills = themed(W, H, pillsSpec, (t) => [
  rect(0, 0, W, H, linear(165, t.color('primary'), t.shade('primary', PW.violetDeep)), {
    name: 'Background',
  }),
  t.list('pills').map((label, index) => {
    const { x, angle } = STACK[index] ?? STACK[0];
    const y = 200 + index * 145;
    const light = index % 2 === 0;
    return rotateNodes(angle, x + 200, y + 76, [
      tag(
        label,
        x,
        y,
        light ? t.color('surface') : t.color('text'),
        light ? t.color('text') : t.color('surface'),
        64,
        t.font('heading'),
        t.color('text'),
      ),
    ]);
  }),
  icon('navigation', 700, 800, 110, t.color('surface'), { strokeWidth: 2, rotation: -90 }),
  handle(t.copy('handle'), 1230, t.shade('primary', PW.lilac), t.font('body')),
]);

const opportunitiesSpec = {
  colors: {
    background: { value: PW.white, hint: 'Page, the bell icons and the notification titles' },
    primary: {
      value: PW.violet,
      hint: 'Opportunities, the photo block and the bell dots; its lighter shade colors the notification details',
    },
    text: {
      value: PW.ink,
      hint: 'Tap into New and the notification pills; its lighter shade colors the handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Tap into New' },
    title: { label: 'Headline', value: 'Opportunities' },
    notices: { label: 'Notification title', value: ['Notification', 'Notification'] },
    details: {
      label: 'Notification detail',
      value: ['Engagement up 158%', 'Search traffic up 250%'],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const NOTICES = [
  [560, 700],
  [80, 930],
] as const;

export const opportunities = themed(W, H, opportunitiesSpec, (t) => {
  const details = t.list('details');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    copy(t.font('body'))(t.copy('intro'), 0, 110, W, 60, t.color('text'), { align: 'center' }),
    heavy(t.font('heading'))(t.copy('title'), 0, 195, W, 96, t.color('primary'), {
      align: 'center',
    }),
    rect(270, 400, 540, 760, t.color('primary'), { cornerRadius: 44, name: 'Photo block' }),
    photo('man-portrait-3', 300, 430, 480, 700, { cornerRadius: 30 }),
    t.list('notices').map((title, index) => {
      const [x, y] = NOTICES[index] ?? NOTICES[0];
      return [
        rect(x, y, 440, 104, t.color('text'), { cornerRadius: 52, name: 'Notification' }),
        circle(x + 52, y + 52, 34, t.color('primary')),
        icon('bell', x + 32, y + 32, 40, t.color('background'), { strokeWidth: 2.2 }),
        bold(t.font('heading'))(title, x + 104, y + 18, 320, 26, t.color('background')),
        copy(t.font('body'))(
          details[index] ?? '',
          x + 104,
          y + 52,
          320,
          22,
          t.shade('primary', PW.lilac),
        ),
      ];
    }),
    handle(t.copy('handle'), 1240, t.shade('text', PW.grey), t.font('body')),
  ];
});

const unlockSpec = {
  colors: {
    background: {
      value: PW.ink,
      hint: 'Shade over the photo, the two tags and the arrow icon',
    },
    primary: { value: PW.violet, hint: 'Card behind the headline' },
    text: { value: PW.white, hint: 'Headline, tag labels, the arrow circle and Learn More' },
  },
  fonts: { heading: { label: 'Tag font', value: 'Poppins' }, body: BODY },
  copy: {
    title: { label: 'Headline', value: 'Unlock\nExclusive' },
    tags: { label: 'Tag', value: ['Sales Insights', 'Delivered Daily'] },
    cta: { label: 'Link', value: 'Learn More' },
  },
} as const satisfies ThemeSpec;

export const unlockInsights = themed(W, H, unlockSpec, (t) => {
  const body = copy(t.font('body'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('woman-portrait-5', 0, 0, W, H, { crop: { zoom: 1, focusX: 0.6, focusY: 0.3 } }),
    rect(
      0,
      0,
      W,
      H,
      linear(
        90,
        t.shade('background', 'rgba(20,17,43,0.55)'),
        t.shade('background', 'rgba(20,17,43,0)'),
      ),
      { name: 'Shade' },
    ),
    rect(70, 380, 580, 580, t.color('primary'), { cornerRadius: 40, name: 'Card' }),
    body(t.copy('title'), 115, 420, 500, 66, t.color('text'), {
      fontWeight: 500,
      lineHeight: 1.15,
    }),
    t
      .list('tags')
      .map((label, index) =>
        tag(
          label,
          115,
          600 + index * 112,
          t.color('background'),
          t.color('text'),
          40,
          t.font('heading'),
        ),
      ),
    circle(143, 878, 28, t.color('text')),
    icon('arrow-right', 125, 860, 36, t.color('background'), { strokeWidth: 2.6 }),
    body(t.copy('cta'), 190, 856, 300, 34, t.color('text'), { fontWeight: 600 }),
  ];
});

const ALPHAS = [0.4, 0.65, 1, 0.65, 0.4, 0.22] as const;

const verbsSpec = {
  colors: {
    primary: {
      value: PW.violet,
      hint: 'Top of the page gradient; its shades color the bottom of the gradient and the handle',
    },
    text: {
      value: PW.white,
      hint: 'Highlighted word and its arrow; its faded shades color the other words',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    verbs: {
      label: 'Word',
      value: ['Convert', 'Engage', 'Authorize', 'Visualize', 'Position', 'Retain'],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const verbList = themed(W, H, verbsSpec, (t) => [
  rect(0, 0, W, H, linear(165, t.color('primary'), t.shade('primary', PW.violetDeep)), {
    name: 'Background',
  }),
  t.list('verbs').map((verb, index) => {
    const alpha = ALPHAS[index] ?? 1;
    const y = 200 + index * 150;
    const active = alpha === 1;
    return [
      active ? icon('arrow-right', 90, y + 18, 96, t.color('text'), { strokeWidth: 2.6 }) : [],
      heavy(t.font('heading'))(
        verb,
        active ? 210 : 90,
        y,
        860,
        104,
        t.shade('text', `rgba(255,255,255,${alpha})`),
      ),
    ];
  }),
  handle(t.copy('handle'), 1230, t.shade('primary', PW.lilac), t.font('body')),
]);
