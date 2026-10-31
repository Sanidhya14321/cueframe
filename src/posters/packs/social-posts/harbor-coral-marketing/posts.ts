import { type Fill, linear } from '@/design';
import {
  avatar,
  circle,
  icon,
  POST_SIZE,
  photo,
  poly,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const HARBOR = {
  navy: '#1f2a5c',
  indigo: '#33428a',
  lilac: '#8c98e0',
  coral: '#ff6b57',
  peach: '#ffb4a2',
  cream: '#fbf6f1',
  paper: '#f3eee8',
  ink: '#141a33',
  white: '#ffffff',
  grey: '#5f6475',
  mint: '#2dd4bf',
  charcoal: '#18191d',
};

export const HEADING = { label: 'Heading font', value: 'Bricolage Grotesque' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const HANDLE = { label: 'Handle', value: 'lumora.studio' } as const;
export const { width: W, height: H } = POST_SIZE;

export const say = (
  content: string,
  x: number,
  y: number,
  width: number,
  size: number,
  fill: Fill,
  weight: number,
  align: 'left' | 'center' | 'right',
  family: string,
) =>
  text(content, x, y, width, {
    fontFamily: family,
    fontSize: size,
    fontWeight: weight,
    fill,
    align,
    lineHeight: 1.08,
  });

export const brandTag = (label: string, y: number, color: string, family: string) =>
  say(label, 0, y, W, 28, color, 500, 'center', family);

const ideasSpec = {
  colors: {
    background: { value: HARBOR.paper, hint: 'Page' },
    primary: {
      value: HARBOR.navy,
      hint: 'Hero card, members bar, the tag text and the plus icon',
    },
    accent: {
      value: HARBOR.coral,
      hint: 'Tag, the highlight and the join button',
    },
    surface: { value: HARBOR.white, hint: 'Headline, the members line and the avatar rings' },
    text: { value: HARBOR.grey, hint: 'Handle at the bottom' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    tag: { label: 'Tag', value: 'COMMUNITY' },
    headline: { label: 'Headline', value: 'Ideas\nthat' },
    highlight: { label: 'Highlight', value: 'take\nflight' },
    members: { label: 'Members line', value: 'Join thousands\nof members' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const ideasFlight = themed(W, H, ideasSpec, (t) => {
  const head = t.font('heading');
  const body = t.font('body');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(80, 110, 300, 64, t.color('accent'), { name: 'Tag', cornerRadius: 32 }),
    say(t.copy('tag'), 80, 126, 300, 28, t.color('primary'), 700, 'center', body),
    rect(80, 230, 920, 640, t.color('primary'), { name: 'Hero card', cornerRadius: 48 }),
    photo('woman-portrait-2', 560, 230, 440, 640, { cornerRadius: 48 }),
    say(t.copy('headline'), 140, 320, 420, 104, t.color('surface'), 500, 'left', head),
    say(t.copy('highlight'), 140, 545, 420, 104, t.color('accent'), 800, 'left', head),
    rect(80, 920, 920, 150, t.color('primary'), { name: 'Members bar', cornerRadius: 75 }),
    say(t.copy('members'), 150, 952, 460, 36, t.color('surface'), 500, 'left', body),
    avatar('woman-portrait-5', 650, 995, 44, t.color('surface')),
    avatar('man-portrait-1', 730, 995, 44, t.color('surface')),
    avatar('woman-portrait-4', 810, 995, 44, t.color('surface')),
    circle(905, 995, 48, t.color('accent'), { name: 'Join button' }),
    icon('plus', 883, 973, 44, t.color('primary'), { strokeWidth: 3 }),
    brandTag(t.copy('handle'), 1210, t.color('text'), body),
  ];
});

const portfolioSpec = {
  colors: {
    background: {
      value: HARBOR.coral,
      hint: 'Page gradient; its lighter shade is the top of the gradient',
    },
    primary: {
      value: HARBOR.navy,
      hint: 'Title and the menu highlight; its translucent shade tints the folder and menu shadows',
    },
    secondary: {
      value: HARBOR.lilac,
      hint: 'Front of the folder; its darker shade colors the folder tab and back',
    },
    surface: {
      value: HARBOR.white,
      hint: 'Menu card, the highlighted menu item and the cursor outline',
    },
    text: { value: HARBOR.ink, hint: 'Script word, the menu items and the cursor' },
  },
  fonts: { heading: HEADING, script: { label: 'Script font', value: 'Caveat' }, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Port' },
    kicker: { label: 'Script word', value: 'folio' },
    menu: {
      label: 'Menu item',
      value: ['Branding', 'Website', 'Interface', 'Illustration', 'Motion'],
    },
  },
} as const satisfies ThemeSpec;

export const portfolio = themed(W, H, portfolioSpec, (t) => {
  const folderBack = t.shade('secondary', '#4a5aaa');
  const menuShadow = t.shade('primary', 'rgba(31,42,92,0.35)');
  return [
    rect(0, 0, W, H, linear(160, t.shade('background', '#ff8a75'), t.color('background')), {
      name: 'Background',
    }),
    say(t.copy('title'), 0, 140, W, 190, t.color('primary'), 800, 'center', t.font('heading')),
    say(t.copy('kicker'), 400, 300, 600, 170, t.color('text'), 700, 'left', t.font('script')),
    rect(230, 540, 220, 90, folderBack, { name: 'Folder tab', cornerRadius: 22 }),
    rect(230, 580, 560, 400, folderBack, { name: 'Folder back', cornerRadius: 30 }),
    rect(230, 650, 560, 330, t.color('secondary'), {
      name: 'Folder front',
      cornerRadius: 30,
      ...shadow(30, 12, menuShadow),
    }),
    rect(640, 820, 320, 330, t.color('surface'), {
      name: 'Menu',
      cornerRadius: 18,
      ...shadow(30, 14, menuShadow),
    }),
    rect(654, 836, 292, 52, t.color('primary'), { name: 'Menu highlight', cornerRadius: 10 }),
    t
      .list('menu')
      .map((item, index) =>
        say(
          item,
          680,
          846 + index * 58,
          260,
          28,
          index === 0 ? t.color('surface') : t.color('text'),
          500,
          'left',
          t.font('body'),
        ),
      ),
    poly(
      [
        [600, 760],
        [600, 840],
        [620, 822],
        [636, 856],
        [652, 849],
        [636, 816],
        [664, 816],
      ],
      t.color('text'),
      { name: 'Cursor', stroke: t.color('surface'), strokeWidth: 3 },
    ),
  ];
});

const trendSpec = {
  colors: {
    background: {
      value: HARBOR.navy,
      hint: 'Page gradient and the highlight word; its lighter shade is the top of the gradient',
    },
    surface: {
      value: HARBOR.white,
      hint: 'Headline; its translucent shades color the column tiles and the handle',
    },
    accent: {
      value: HARBOR.coral,
      hint: 'Highlight box and the tilted tile; its lighter shade is the top of the tile',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    headline: { label: 'Headline', value: "Don't\nfollow,\nlead the" },
    highlight: { label: 'Highlight', value: 'Trend' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const leadTrend = themed(W, H, trendSpec, (t) => [
  rect(0, 0, W, H, linear(160, t.shade('background', HARBOR.indigo), t.color('background')), {
    name: 'Background',
  }),
  Array.from({ length: 6 }, (_, index) =>
    rect(820, 30 + index * 220, 220, 200, t.shade('surface', 'rgba(255,255,255,0.12)'), {
      name: 'Column tile',
      cornerRadius: 10,
    }),
  ),
  rotateNodes(-18, 830, 610, [
    rect(700, 480, 260, 260, linear(135, t.shade('accent', HARBOR.peach), t.color('accent')), {
      name: 'Tilted tile',
      cornerRadius: 22,
      ...shadow(40, 18, 'rgba(0,0,0,0.35)'),
    }),
  ]),
  say(t.copy('headline'), 80, 410, 700, 104, t.color('surface'), 700, 'left', t.font('heading')),
  rect(80, 770, 340, 124, t.color('accent'), { name: 'Highlight', cornerRadius: 12 }),
  say(
    t.copy('highlight'),
    80,
    778,
    340,
    100,
    t.color('background'),
    800,
    'center',
    t.font('heading'),
  ),
  brandTag(t.copy('handle'), 1230, t.shade('surface', 'rgba(255,255,255,0.75)'), t.font('body')),
]);
