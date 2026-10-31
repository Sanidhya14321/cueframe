import { IMAGE_FILTER_PRESETS, linear } from '@/design';
import {
  circle,
  group,
  icon,
  type Nodes,
  POST_SIZE,
  photo,
  poly,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export const MERIDIAN = {
  navy: '#16233f',
  deep: '#0b1426',
  mid: '#24375f',
  coral: '#ff7a59',
  coralSoft: '#ffa184',
  cream: '#f6f1ea',
  sand: '#e7dfd4',
  white: '#ffffff',
  grey: '#5b6475',
};

export const HEAD = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'DM Sans' } as const;
export const HANDLE = { label: 'Handle', value: 'meridian.co' } as const;

const { width: W, height: H } = POST_SIZE;

export const backdrop = (height: number, from: string, to: string, angle: number) =>
  rect(0, 0, W, height, linear(angle, from, to), { name: 'Background' });

export const cta = (
  label: string,
  fontFamily: string,
  x: number,
  y: number,
  style: { fill: string; color: string; dot: string; dotIcon: string },
): Nodes[] => {
  const width = label.length * 15 + 120;
  return group(
    rect(x, y, width, 68, style.fill, { cornerRadius: 34, name: `${label} button` }),
    circle(x + 34, y + 34, 24, style.dot),
    icon('arrow-up-right', x + 20, y + 20, 28, style.dotIcon, { strokeWidth: 2.6 }),
    text(label, x + 72, y + 19, width - 84, {
      fontFamily,
      fontSize: 26,
      fontWeight: 600,
      fill: style.color,
    }),
  );
};

const ideasSpec = {
  colors: {
    background: {
      value: MERIDIAN.white,
      hint: 'Page gradient and the button label; its sand shade is the bottom of the gradient',
    },
    primary: {
      value: MERIDIAN.navy,
      hint: 'Where Plans Become, the button and the arrow on the button',
    },
    accent: { value: MERIDIAN.coral, hint: 'Real Momentum and the dot on the button' },
    text: { value: MERIDIAN.grey, hint: 'Handle at the bottom' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    intro: { label: 'Headline', value: 'Where Plans\nBecome' },
    highlight: { label: 'Highlight', value: 'Real\nMomentum' },
    button: { label: 'Button', value: 'Scale with us' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const ideasHeights = themed(W, H, ideasSpec, (t) => [
  backdrop(H, t.color('background'), t.shade('background', MERIDIAN.sand), 180),
  photo('city-night', 650, 90, 370, 1170, {
    cornerRadius: 185,
    filters: { ...IMAGE_FILTER_PRESETS.mono, brightness: 1.15 },
    crop: { zoom: 2, focusX: 0.5, focusY: 0.5 },
  }),
  text(t.copy('intro'), 80, 380, 560, {
    fontFamily: t.font('heading'),
    fontSize: 84,
    fontWeight: 400,
    fill: t.color('primary'),
    lineHeight: 1.08,
  }),
  text(t.copy('highlight'), 80, 562, 560, {
    fontFamily: t.font('heading'),
    fontSize: 92,
    fontWeight: 800,
    fill: t.color('accent'),
    lineHeight: 1.04,
  }),
  cta(t.copy('button'), t.font('body'), 80, 820, {
    fill: t.color('primary'),
    color: t.color('background'),
    dot: t.color('accent'),
    dotIcon: t.color('primary'),
  }),
  text(t.copy('handle'), 80, 1220, 400, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 600,
    fill: t.color('text'),
    letterSpacing: 2,
  }),
]);

const BARCODE = [6, 3, 9, 3, 4, 10, 3, 6, 3, 8, 4, 3, 10, 5, 3, 7, 3, 9, 4, 6, 3, 10, 3, 5, 8];

const receiptSpec = {
  colors: {
    background: {
      value: MERIDIAN.coral,
      hint: 'Page gradient and the word Lasting; its soft shade is the top of the gradient',
    },
    surface: {
      value: MERIDIAN.white,
      hint: 'Receipt; its shades color the printer slot and the rules on the receipt',
    },
    primary: {
      value: MERIDIAN.navy,
      hint: 'We Craft, Alliances and the call line; its darker shade colors the slit and the barcode and tints the receipt shadow',
    },
    text: { value: MERIDIAN.grey, hint: 'Handle and the tagline on the receipt' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    handle: HANDLE,
    intro: { label: 'Headline', value: 'We Craft' },
    highlight: { label: 'Highlight', value: 'Lasting' },
    closing: { label: 'Headline end', value: 'Alliances' },
    tagline: { label: 'Tagline', value: 'Partners who stay for years' },
    call: { label: 'Call to action', value: 'Book a partner call this week' },
  },
} as const satisfies ThemeSpec;

export const receiptPartners = themed(W, H, receiptSpec, (t) => {
  const rule = (y: number) =>
    rect(350, y, 380, 3, t.shade('surface', MERIDIAN.sand), { name: 'Rule' });
  const teeth = 12;
  const step = 480 / teeth;
  const bottom: [number, number][] = Array.from({ length: teeth * 2 + 1 }, (_, index) => [
    300 + 480 - (index * step) / 2,
    306 + 760 - (index % 2 === 0 ? 0 : 20),
  ]);
  return [
    backdrop(H, t.shade('background', MERIDIAN.coralSoft), t.color('background'), 160),
    rect(
      220,
      260,
      640,
      70,
      linear(180, t.shade('surface', '#f8fafc'), t.shade('surface', '#a3acb9')),
      {
        cornerRadius: 18,
        name: 'Slot',
        ...shadow(24, 10, 'rgba(0,0,0,0.25)'),
      },
    ),
    rect(260, 300, 560, 12, t.shade('primary', MERIDIAN.deep), { cornerRadius: 6, name: 'Slit' }),
    poly([[300, 306], [780, 306], ...bottom], t.color('surface'), {
      name: 'Receipt',
      ...shadow(30, 16, t.shade('primary', 'rgba(11,20,38,0.22)')),
    }),
    text(t.copy('handle'), 300, 360, 480, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    rule(410),
    text(t.copy('intro'), 300, 450, 480, {
      fontFamily: t.font('heading'),
      fontSize: 56,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    text(t.copy('highlight'), 300, 515, 480, {
      fontFamily: t.font('heading'),
      fontSize: 66,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
    }),
    text(t.copy('closing'), 300, 592, 480, {
      fontFamily: t.font('heading'),
      fontSize: 56,
      fontWeight: 400,
      fill: t.color('primary'),
      align: 'center',
    }),
    rule(700),
    text(t.copy('tagline'), 300, 726, 480, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
    }),
    rule(790),
    BARCODE.reduce<{ x: number; nodes: Nodes[] }>(
      (state, size, index) => ({
        x: state.x + size + 5,
        nodes: [
          ...state.nodes,
          index % 2 === 0
            ? rect(state.x, 830, size, 140, t.shade('primary', MERIDIAN.deep), { name: 'Bar' })
            : [],
        ],
      }),
      { x: 380, nodes: [] },
    ).nodes,
    text(t.copy('call'), 0, 1180, W, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'center',
    }),
  ];
});

const bigNumberSpec = {
  colors: {
    background: {
      value: MERIDIAN.mid,
      hint: 'Page gradient; its darker shades color the bottom of the gradient and the fade over the photo',
    },
    accent: {
      value: MERIDIAN.coral,
      hint: 'Big number and Next Decade; its soft shade is the top of the number gradient',
    },
    text: {
      value: MERIDIAN.white,
      hint: 'Moves That Define the; its sand shade colors the playbook line',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    number: { label: 'Number', value: '7' },
    intro: { label: 'Headline', value: 'Moves That\nDefine the' },
    highlight: { label: 'Highlight', value: 'Next Decade' },
    link: { label: 'Link line', value: 'Read the full playbook' },
  },
} as const satisfies ThemeSpec;

export const bigNumber = themed(W, H, bigNumberSpec, (t) => [
  backdrop(H, t.color('background'), t.shade('background', MERIDIAN.deep), 165),
  photo('man-portrait-1', 0, 230, 560, 1120, { filters: IMAGE_FILTER_PRESETS.mono }),
  rect(
    360,
    230,
    200,
    1120,
    linear(90, t.shade('background', 'rgba(14,25,48,0)'), t.shade('background', '#0f1a32')),
    { name: 'Fade' },
  ),
  text(t.copy('number'), 500, 90, 540, {
    fontFamily: t.font('heading'),
    fontSize: 640,
    fontWeight: 800,
    fill: linear(180, t.shade('accent', MERIDIAN.coralSoft), t.color('accent')),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('intro'), 580, 860, 460, {
    fontFamily: t.font('heading'),
    fontSize: 60,
    fontWeight: 400,
    fill: t.color('text'),
    lineHeight: 1.1,
  }),
  text(t.copy('highlight'), 580, 992, 460, {
    fontFamily: t.font('heading'),
    fontSize: 60,
    fontWeight: 800,
    fill: t.color('accent'),
  }),
  text(t.copy('link'), 580, 1120, 440, {
    fontFamily: t.font('body'),
    fontSize: 28,
    fontWeight: 500,
    fill: t.shade('text', MERIDIAN.sand),
  }),
]);

const tabsSpec = {
  colors: {
    background: {
      value: MERIDIAN.mid,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    surface: {
      value: MERIDIAN.white,
      hint: 'Our Plan and the white folders; its cream shade colors the other folders',
    },
    accent: {
      value: MERIDIAN.coral,
      hint: 'Powers Growth and the bottom strip; its soft shade is the end of the strip',
    },
    text: { value: MERIDIAN.navy, hint: 'Folder tab labels' },
  },
  fonts: { heading: HEAD },
  copy: {
    intro: { label: 'Headline', value: 'Our Plan' },
    highlight: { label: 'Highlight', value: 'Powers Growth' },
    tabs: {
      label: 'Folder tab',
      value: ['Audience Insight', 'Budget Planning', 'Workflow Design', 'Risk Review'],
    },
  },
} as const satisfies ThemeSpec;

export const strategyTabs = themed(W, H, tabsSpec, (t) => [
  backdrop(H, t.color('background'), t.shade('background', MERIDIAN.deep), 165),
  text(t.copy('intro'), 0, 150, W, {
    fontFamily: t.font('heading'),
    fontSize: 86,
    fontWeight: 400,
    fill: t.color('surface'),
    align: 'center',
  }),
  text(t.copy('highlight'), 0, 248, W, {
    fontFamily: t.font('heading'),
    fontSize: 86,
    fontWeight: 800,
    fill: t.color('accent'),
    align: 'center',
  }),
  t.list('tabs').map((label, index) => {
    const y = 560 + index * 150;
    const tabX = index % 2 === 0 ? 110 : 560;
    const fill = index % 2 === 0 ? t.shade('surface', MERIDIAN.cream) : t.color('surface');
    return [
      rect(tabX, y - 62, 410, 80, fill, { cornerRadius: 18, name: 'Tab' }),
      rect(70, y, 940, H - y, fill, {
        cornerRadius: 22,
        name: 'Folder',
        ...shadow(24, -6, 'rgba(0,0,0,0.18)'),
      }),
      text(label, tabX + 30, y - 46, 360, {
        fontFamily: t.font('heading'),
        fontSize: 36,
        fontWeight: 700,
        fill: t.color('text'),
      }),
    ];
  }),
  rect(0, 1230, W, 120, linear(90, t.color('accent'), t.shade('accent', MERIDIAN.coralSoft)), {
    name: 'Strip',
  }),
]);
