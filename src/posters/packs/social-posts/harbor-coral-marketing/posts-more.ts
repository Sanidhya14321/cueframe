import { linear, radial } from '@/design';
import {
  circle,
  icon,
  photo,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  themed,
} from '../../../kit';
import { BODY, brandTag, H, HANDLE, HARBOR, HEADING, say, W } from './posts';

const seoSpec = {
  colors: {
    background: { value: HARBOR.paper, hint: 'Page' },
    text: {
      value: HARBOR.ink,
      hint: 'Title, the lens line and the magnifier handle; its shades color the handle shine, the lens shadow and the handle text',
    },
    primary: {
      value: HARBOR.navy,
      hint: 'Highlight; its lighter shade colors the keyword',
    },
    accent: { value: HARBOR.coral, hint: 'Highlight box and its glow' },
    surface: {
      value: HARBOR.white,
      hint: 'Magnifier lens; its shades color the lens edge and the metal rim',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Optimise' },
    highlight: { label: 'Highlight', value: 'Your Content' },
    lead: { label: 'Lens line', value: 'With' },
    keyword: { label: 'Keyword', value: 'SEO' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const seoMagnifier = themed(W, H, seoSpec, (t) => {
  const head = t.font('heading');
  const metal = t.shade('text', '#222533');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    say(t.copy('title'), 0, 130, W, 116, t.color('text'), 500, 'center', head),
    rotateNodes(-2, 540, 320, [
      rect(210, 270, 660, 112, t.color('accent'), {
        name: 'Highlight',
        cornerRadius: 10,
        ...shadow(20, 8, t.shade('accent', 'rgba(255,107,87,0.35)')),
      }),
      say(t.copy('highlight'), 210, 280, 660, 82, t.color('primary'), 800, 'center', head),
    ]),
    poly(
      [
        [376, 910],
        [430, 964],
        [250, 1190],
        [196, 1136],
      ],
      linear(90, metal, t.shade('text', '#5a5e72'), metal),
      { name: 'Handle', ...shadow(20, 10, 'rgba(0,0,0,0.3)') },
    ),
    circle(
      570,
      760,
      265,
      linear(
        135,
        t.shade('surface', '#f2f2f2'),
        t.shade('surface', '#8d93a8'),
        t.shade('surface', '#fafafa'),
      ),
      {
        name: 'Lens rim',
        ...shadow(40, 18, t.shade('text', 'rgba(20,26,51,0.3)')),
      },
    ),
    circle(570, 760, 228, radial(t.color('surface'), t.shade('surface', '#e9ecf8')), {
      name: 'Lens',
    }),
    say(t.copy('lead'), 320, 640, 500, 116, t.color('text'), 800, 'center', head),
    say(
      t.copy('keyword'),
      320,
      765,
      500,
      132,
      t.shade('primary', HARBOR.indigo),
      800,
      'center',
      head,
    ),
    brandTag(t.copy('handle'), 1240, t.shade('text', HARBOR.grey), t.font('body')),
  ];
});

const statsSpec = {
  colors: {
    background: { value: HARBOR.paper, hint: 'Page' },
    accent: { value: HARBOR.coral, hint: 'Title and the middle stat box' },
    primary: {
      value: HARBOR.navy,
      hint: 'First stat box and the number and label in the middle box',
    },
    secondary: { value: HARBOR.indigo, hint: 'Wide stat box' },
    surface: {
      value: HARBOR.white,
      hint: 'Numbers in the first and wide stat boxes; its tint colors their labels',
    },
    text: { value: HARBOR.ink, hint: 'Subtitle; its lighter shade colors the handle' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Measurable' },
    subtitle: { label: 'Subtitle', value: 'Growth Stats' },
    stats: { label: 'Stat', value: ['6.2M', '8x', '184,000+'] },
    labels: {
      label: 'Stat label',
      value: [
        'Impressions earned\nacross campaigns',
        'Return on\nad spend',
        'Customers reached through\nmarketed campaigns',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const growthStats = themed(W, H, statsSpec, (t) => {
  const head = t.font('heading');
  const body = t.font('body');
  const [reach = '', roas = '', customers = ''] = t.list('stats');
  const [reachLabel = '', roasLabel = '', customersLabel = ''] = t.list('labels');
  const tint = t.shade('surface', '#d7dbf2');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    say(t.copy('title'), 80, 110, 900, 92, t.color('accent'), 800, 'left', head),
    say(t.copy('subtitle'), 80, 214, 900, 82, t.color('text'), 500, 'left', head),
    rect(80, 390, 570, 300, t.color('primary'), { name: 'Stat box', cornerRadius: 30 }),
    say(reach, 120, 430, 500, 130, t.color('surface'), 800, 'left', head),
    say(reachLabel, 120, 590, 500, 30, tint, 500, 'left', body),
    rect(680, 390, 320, 300, t.color('accent'), { name: 'Stat box', cornerRadius: 30 }),
    say(roas, 680, 430, 320, 130, t.color('primary'), 800, 'center', head),
    say(roasLabel, 680, 590, 320, 30, t.color('primary'), 600, 'center', body),
    rect(80, 720, 920, 300, t.color('secondary'), { name: 'Stat box', cornerRadius: 30 }),
    say(customers, 120, 760, 840, 150, t.color('surface'), 800, 'left', head),
    say(customersLabel, 120, 930, 840, 32, tint, 500, 'left', body),
    brandTag(t.copy('handle'), 1200, t.shade('text', HARBOR.grey), body),
  ];
});

const trendsSpec = {
  colors: {
    background: {
      value: HARBOR.navy,
      hint: 'Page gradient, the photo fade and the search icon; its lighter shade is the top of the gradient',
    },
    surface: {
      value: HARBOR.white,
      hint: 'Title and the search bar; its translucent shade colors the handle',
    },
    accent: { value: HARBOR.coral, hint: 'Highlight' },
    text: {
      value: HARBOR.ink,
      hint: 'Search line; its translucent shade is the shadow behind the title and highlight',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Market' },
    highlight: { label: 'Highlight', value: 'Trends' },
    search: { label: 'Search line', value: 'Discover what comes next' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const marketTrends = (height: number) => {
  const dy = (height - H) / 2;
  return themed(W, height, trendsSpec, (t) => {
    const head = t.font('heading');
    const glow = shadow(30, 6, t.shade('text', 'rgba(20,26,51,0.55)'));
    return [
      rect(
        0,
        0,
        W,
        height,
        linear(180, t.shade('background', HARBOR.indigo), t.color('background')),
        { name: 'Background' },
      ),
      photo('man-portrait-3', 220, 130 + dy, 640, 1000, { cornerRadius: 40 }),
      rect(
        220,
        480 + dy,
        640,
        650,
        linear(
          180,
          t.shade('background', 'rgba(31,42,92,0)'),
          t.shade('background', 'rgba(31,42,92,0.75)'),
        ),
        { name: 'Photo fade', cornerRadius: 40 },
      ),
      {
        ...say(t.copy('title'), 0, 400 + dy, W, 220, t.color('surface'), 800, 'center', head),
        ...glow,
      },
      {
        ...say(t.copy('highlight'), 0, 610 + dy, W, 220, t.color('accent'), 800, 'center', head),
        ...glow,
      },
      rect(200, 1010 + dy, 680, 100, t.color('surface'), {
        name: 'Search bar',
        cornerRadius: 50,
        ...shadow(30, 12, 'rgba(0,0,0,0.3)'),
      }),
      icon('search', 240, 1038 + dy, 44, t.color('background')),
      say(t.copy('search'), 305, 1040 + dy, 560, 34, t.color('text'), 500, 'left', t.font('body')),
      brandTag(
        t.copy('handle'),
        1230 + dy,
        t.shade('surface', 'rgba(255,255,255,0.75)'),
        t.font('body'),
      ),
    ];
  });
};

const timeSpec = {
  colors: {
    background: { value: HARBOR.navy, hint: 'Page frame and the clock icon' },
    surface: { value: HARBOR.cream, hint: 'Inner card' },
    primary: { value: HARBOR.indigo, hint: 'Title' },
    accent: {
      value: HARBOR.coral,
      hint: 'Rule and the clock disc; its lighter shade is the top of the disc and its glow',
    },
    text: { value: HARBOR.ink, hint: 'Subtitle; its lighter shade colors the body line' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Time Waits' },
    subtitle: { label: 'Subtitle', value: 'for nobody' },
    body: { label: 'Body', value: 'But you decide how to\nmake the most of it.' },
  },
} as const satisfies ThemeSpec;

export const timeWaits = themed(W, H, timeSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  rect(90, 90, 900, 1170, t.color('surface'), { name: 'Inner card', cornerRadius: 50 }),
  say(t.copy('title'), 0, 190, W, 100, t.color('primary'), 800, 'center', t.font('heading')),
  say(t.copy('subtitle'), 0, 300, W, 72, t.color('text'), 500, 'center', t.font('heading')),
  rect(440, 410, 200, 6, t.color('accent'), { name: 'Rule', cornerRadius: 3 }),
  say(t.copy('body'), 0, 450, W, 38, t.shade('text', HARBOR.grey), 500, 'center', t.font('body')),
  circle(540, 880, 250, linear(135, t.shade('accent', HARBOR.peach), t.color('accent')), {
    name: 'Clock disc',
    ...shadow(40, 16, t.shade('accent', 'rgba(255,107,87,0.45)')),
  }),
  icon('alarm-clock', 370, 710, 340, t.color('background'), { strokeWidth: 1.6 }),
]);
