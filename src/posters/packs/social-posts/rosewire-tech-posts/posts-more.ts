import { type Fill, linear } from '@/design';
import { ellipse, icon, rect, rotateNodes, shadow, text, themed } from '../../../kit';
import { BODY, BRAND, brand, cursor, glow, H, HEADING, ROSE, roseFill, W } from './posts';

const fileButton = (
  label: string,
  fontFamily: string,
  y: number,
  width: number,
  fill: Fill,
  ink: string,
  struck: boolean,
) => [
  rect((W - width) / 2, y, width, 100, fill, {
    cornerRadius: 26,
    name: 'File',
    ...shadow(30, 12, 'rgba(0,0,0,0.45)'),
  }),
  text(label, (W - width) / 2, y + 28, width, {
    fontFamily,
    fontSize: 38,
    fontWeight: 700,
    fill: ink,
    align: 'center',
    strikethrough: struck,
  }),
];

export const newFeature = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ROSE.black,
        hint: 'Page and the new file name; its lighter shade colors the top of the page',
      },
      surface: {
        value: '#2a2130',
        hint: 'Old file buttons; its darker shade colors the oldest one',
      },
      primary: {
        value: ROSE.rose,
        hint: 'Glow, Smart Inbox, the new file button and the button outline',
      },
      text: {
        value: ROSE.white,
        hint: 'Brand, Just Shipped, the cursor and the button; its grey shades color the body and old file names',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      brand: BRAND,
      kicker: { label: 'Kicker', value: 'Just Shipped' },
      title: { label: 'Title', value: 'Smart Inbox' },
      body: {
        label: 'Body',
        value:
          'Our latest release sorts, tags and answers routine\nrequests, so your team can focus on real work.',
      },
      files: {
        label: 'File name',
        value: ['inbox_final.app', 'inbox_v2.app', 'SmartInbox.app'],
      },
      cta: { label: 'Button', value: 'Try it free' },
    },
  },
  (t) => {
    const [oldest = '', older = '', latest = ''] = t.list('files');
    const head = t.font('heading');
    return [
      rect(0, 0, W, H, linear(180, t.shade('background', '#150e18'), t.color('background')), {
        name: 'Background',
      }),
      glow((exact) => t.shade('primary', exact), 540, 860, 420, 0.4),
      brand(t.copy('brand'), head, 90, t.color('text'), 'left'),
      text(t.copy('kicker'), 80, 190, 920, {
        fontFamily: head,
        fontSize: 80,
        fontWeight: 500,
        fill: t.color('text'),
      }),
      text(t.copy('title'), 80, 284, 920, {
        fontFamily: head,
        fontSize: 96,
        fontWeight: 800,
        fill: roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
      }),
      text(t.copy('body'), 80, 430, 920, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 400,
        fill: t.shade('text', ROSE.grey),
        lineHeight: 1.45,
      }),
      fileButton(
        oldest,
        head,
        1000,
        380,
        t.shade('surface', '#1e1722'),
        t.shade('text', '#6f6270'),
        true,
      ),
      fileButton(older, head, 880, 460, t.color('surface'), t.shade('text', ROSE.grey), true),
      fileButton(
        latest,
        head,
        740,
        580,
        roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
        t.color('background'),
        false,
      ),
      cursor(760, 800, 1.3, t.color('text')),
      rect(80, 1200, 230, 68, t.shade('text', 'rgba(255,255,255,0.06)'), {
        cornerRadius: 34,
        stroke: t.shade('primary', ROSE.pink),
        strokeWidth: 2,
        name: 'Button',
      }),
      text(t.copy('cta'), 80, 1218, 230, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 600,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  },
);

const ACTIVE_ROW = 2;

export const searchList = themed(
  W,
  H,
  {
    colors: {
      background: { value: ROSE.black, hint: 'Page, the search icon and the query' },
      surface: { value: ROSE.pale, hint: 'Search bar' },
      primary: {
        value: ROSE.rose,
        hint: 'Glow, build more., the caret and the highlighted row; its pink shade colors the results border',
      },
      text: {
        value: ROSE.white,
        hint: 'Search less, the highlighted suggestion and the brand; its tints color the other suggestions and icons',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      intro: { label: 'Intro', value: 'Search less,' },
      title: { label: 'Title', value: 'build more.' },
      query: { label: 'Search query', value: 'Remote teams' },
      suggestions: {
        label: 'Suggestion',
        value: [
          'remote teams playbook',
          'remote teams onboarding',
          'remote teams tools',
          'remote teams rituals',
          'remote teams pricing',
        ],
      },
      brand: BRAND,
    },
  },
  (t) => [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow((exact) => t.shade('primary', exact), 540, 760, 460, 0.32),
    text(t.copy('intro'), 0, 130, W, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('title'), 0, 214, W, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 800,
      fill: roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
      align: 'center',
    }),
    rect(120, 380, 840, 100, t.color('surface'), { cornerRadius: 50, name: 'Search bar' }),
    icon('search', 166, 408, 44, t.color('background'), { strokeWidth: 2.4 }),
    text(t.copy('query'), 236, 406, 600, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 600,
      fill: t.color('background'),
    }),
    rect(498, 404, 4, 52, t.color('primary'), { name: 'Caret' }),
    rect(120, 520, 840, 560, t.shade('text', 'rgba(255,255,255,0.04)'), {
      cornerRadius: 30,
      stroke: t.shade('primary', 'rgba(255,156,191,0.4)'),
      strokeWidth: 2,
      name: 'Results',
    }),
    t.list('suggestions').map((item, index) => {
      const y = 560 + index * 100;
      const active = index === ACTIVE_ROW;
      return [
        active
          ? rect(150, y - 6, 780, 84, t.shade('primary', 'rgba(255,79,139,0.28)'), {
              cornerRadius: 18,
              name: 'Active',
            })
          : [],
        icon('search', 186, y + 18, 34, active ? t.color('text') : t.shade('text', ROSE.grey), {
          strokeWidth: 2.2,
        }),
        text(item, 246, y + 16, 640, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: active ? 700 : 500,
          fill: active ? t.color('text') : t.shade('text', ROSE.pale),
        }),
      ];
    }),
    brand(t.copy('brand'), t.font('heading'), 1220, t.color('text')),
  ],
);

export const newVersion = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ROSE.white,
        hint: 'Page; its pink shade colors the bottom of the page',
      },
      primary: {
        value: ROSE.rose,
        hint: "Screen, Version 4.0, both buttons and the See what's new label; its pink shade colors the gradient ends",
      },
      text: {
        value: '#2a1d26',
        hint: 'The is now available! line, the brand, the laptop frame and its shadow',
      },
      surface: { value: ROSE.white, hint: 'Sparkles on the screen and the Update now label' },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Version 4.0' },
      subtitle: { label: 'Subtitle', value: 'is now available!' },
      secondary: { label: 'Secondary button', value: "See what's new" },
      cta: { label: 'Button', value: 'Update now' },
      brand: BRAND,
    },
  },
  (t) => {
    const gradient = () => roseFill(t.color('primary'), t.shade('primary', ROSE.pink));
    return [
      rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', '#fbe0ea')), {
        name: 'Background',
      }),
      ellipse(290, 590, 500, 50, t.shade('text', 'rgba(61,40,52,0.16)'), { name: 'Shadow' }),
      rotateNodes(-6, 540, 400, [
        rect(310, 220, 460, 340, t.shade('text', '#3b2d36'), {
          cornerRadius: 30,
          name: 'Screen frame',
        }),
        rect(334, 244, 412, 292, linear(150, t.shade('primary', ROSE.pink), t.color('primary')), {
          cornerRadius: 18,
          name: 'Screen',
        }),
        icon('sparkles', 480, 330, 120, t.color('surface'), { strokeWidth: 1.8 }),
      ]),
      text(t.copy('title'), 0, 680, W, {
        fontFamily: t.font('heading'),
        fontSize: 96,
        fontWeight: 800,
        fill: gradient(),
        align: 'center',
      }),
      text(t.copy('subtitle'), 0, 800, W, {
        fontFamily: t.font('heading'),
        fontSize: 66,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
      }),
      rect(200, 960, 320, 84, t.shade('primary', 'rgba(0,0,0,0)'), {
        cornerRadius: 42,
        stroke: t.color('primary'),
        strokeWidth: 3,
        name: 'Secondary button',
      }),
      text(t.copy('secondary'), 200, 984, 320, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 600,
        fill: t.color('primary'),
        align: 'center',
      }),
      rect(560, 960, 320, 84, gradient(), { cornerRadius: 42, name: 'Primary button' }),
      text(t.copy('cta'), 560, 984, 320, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 700,
        fill: t.color('surface'),
        align: 'center',
      }),
      brand(t.copy('brand'), t.font('heading'), 1220, t.color('text')),
    ];
  },
);
