import { icon, rect, STORY_SIZE, type ThemeSpec, text, themed } from '../../../kit';
import {
  ART_HINT,
  BODY,
  duskArt,
  EMBER as E,
  FRAME_HINT,
  glow,
  H,
  HEADING,
  inkOf,
  laptopDevice,
  monitor,
  pedestal,
  phoneDevice,
  type ScreenArt,
  SITE,
  SITE_COPY,
  siteLine,
  storeArt,
  tablet,
  W,
} from './devices';

interface LaunchStyle {
  site: string;
  title: string;
  tail: string;
  sticker: string;
  accent: string;
  glowColor: string;
  artColor: string;
  artHint: string;
  art: ScreenArt;
}

const launch = (height: number, style: LaunchStyle) =>
  themed(
    W,
    height,
    {
      colors: {
        background: {
          value: E.black,
          hint: 'Page and the sticker text; its clear shade is the outer edge of the glow',
        },
        primary: {
          value: style.accent,
          hint: 'Second title line, the sticker, the glow and the rim of the pedestal',
        },
        text: { value: E.white, hint: 'Website and the first title line' },
        surface: { value: E.metal, hint: `Laptop lid and pedestal; ${FRAME_HINT}` },
        accent: { value: style.artColor, hint: style.artHint },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        site: { label: 'Website', value: style.site },
        title: { label: 'Title', value: style.title },
        tail: { label: 'Second title line', value: style.tail },
        sticker: { label: 'Sticker', value: style.sticker },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const top = height > H ? 400 : 90;
      const ink = inkOf(t.shade);
      return [
        rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
        glow(
          540,
          top + 760,
          620,
          t.shade('primary', style.glowColor),
          t.shade('background', E.fade),
          height,
        ),
        text(t.copy('site'), 0, top, W, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 600,
          fill: t.color('text'),
          align: 'center',
        }),
        text(t.copy('title'), 0, top + 60, W, {
          fontFamily: t.font('heading'),
          fontSize: 120,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1,
        }),
        text(t.copy('tail'), 0, top + 190, W, {
          fontFamily: t.font('heading'),
          fontSize: 120,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
          lineHeight: 1,
        }),
        rect(700, top + 330, 270, 72, t.color('primary'), {
          cornerRadius: 36,
          rotation: -8,
          name: 'Sticker',
        }),
        text(t.copy('sticker'), 700, top + 348, 270, {
          fontFamily: t.font('heading'),
          fontSize: 30,
          fontWeight: 800,
          fill: t.color('background'),
          align: 'center',
          rotation: -8,
        }),
        pedestal(
          ink,
          t.shade('primary', 'rgba(255,162,74,0.35)'),
          220,
          top + 790,
          640,
          height - top - 900,
        ),
        laptopDevice(ink, 250, top + 440, 580, style.art),
      ];
    },
  );

const EMBER_LAUNCH: LaunchStyle = {
  site: SITE,
  title: 'New Page',
  tail: 'is live',
  sticker: 'Visit today!',
  accent: E.glow,
  glowColor: E.glowSoft,
  artColor: E.sky,
  artHint: ART_HINT,
  art: duskArt,
};

export const newPage = launch(H, EMBER_LAUNCH);

export const newPageStory = launch(STORY_SIZE.height, EMBER_LAUNCH);

export const newStore = launch(H, {
  site: 'brightloop.shop',
  title: 'New Store',
  tail: 'is open',
  sticker: 'Shop today!',
  accent: '#38e1ff',
  glowColor: 'rgba(56,225,255,0.45)',
  artColor: '#38e1ff',
  artHint: 'Store page on the laptop screen: logo, header, page and product tiles',
  art: storeArt,
});

const releaseSpec = {
  colors: {
    background: {
      value: E.black,
      hint: 'Page and the button label; its clear shade is the outer edge of the glow',
    },
    primary: {
      value: E.glow,
      hint: 'Button and the glow; its translucent shade colors the side title',
    },
    text: { value: E.white, hint: 'Website and the description' },
    surface: { value: E.silver, hint: `Monitor stand; ${FRAME_HINT}` },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Side title', value: 'New Release' },
    site: SITE_COPY,
    body: { label: 'Description', value: 'Our biggest update yet.\nFaster, lighter, smarter.' },
    button: { label: 'Button', value: 'See what is new' },
  },
} as const satisfies ThemeSpec;

export const bigRelease = themed(W, H, releaseSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(700, 560, 520, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
  text(t.copy('title'), 30, 1310, 1270, {
    fontFamily: t.font('heading'),
    fontSize: 176,
    fontWeight: 800,
    fill: t.shade('primary', 'rgba(255,106,26,0.85)'),
    rotation: -90,
    lineHeight: 1,
  }),
  text(t.copy('site'), 600, 90, 420, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'right',
  }),
  monitor(inkOf(t.shade), 320, 260, 700),
  text(t.copy('body'), 320, 1000, 700, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 600,
    fill: t.color('text'),
    lineHeight: 1.35,
  }),
  rect(320, 1160, 330, 74, t.color('primary'), { cornerRadius: 37, name: 'Button' }),
  text(t.copy('button'), 320, 1180, 330, {
    fontFamily: t.font('heading'),
    fontSize: 30,
    fontWeight: 800,
    fill: t.color('background'),
    align: 'center',
  }),
]);

const upgradeSpec = {
  colors: {
    background: {
      value: E.black,
      hint: 'Page and the perk text; its clear shade is the outer edge of the glow',
    },
    primary: { value: E.glow, hint: 'with AI, the perk checks and the glow behind the tablet' },
    text: { value: E.white, hint: 'Upgrade your flow and the perk pills' },
    secondary: { value: E.grey, hint: 'Website at the bottom' },
    surface: { value: E.tablet, hint: `Tablet body; ${FRAME_HINT}` },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Upgrade\nyour flow' },
    highlight: { label: 'Highlight', value: 'with AI.' },
    perks: {
      label: 'Perk',
      value: ['Fast, reliable workflows', 'Always up to date', 'Support around the clock'],
    },
    site: SITE_COPY,
  },
} as const satisfies ThemeSpec;

export const upgradeFlow = themed(W, H, upgradeSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(820, 760, 500, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
  text(t.copy('title'), 80, 150, 620, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.05,
  }),
  text(t.copy('highlight'), 80, 370, 620, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('primary'),
    lineHeight: 1.05,
  }),
  tablet(inkOf(t.shade), 640, 470, 380, 580, { rotation: 10 }),
  t.list('perks').map((perk, index) => [
    rect(80, 580 + index * 104, 520, 78, t.color('text'), { cornerRadius: 39, name: 'Perk' }),
    icon('circle-check', 104, 597 + index * 104, 44, t.color('primary'), { strokeWidth: 2.4 }),
    text(perk, 164, 602 + index * 104, 420, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 700,
      fill: t.color('background'),
    }),
  ]),
  siteLine(t.copy('site'), 1230, t.color('secondary'), t.font('body')),
]);

const everySpec = {
  colors: {
    background: {
      value: E.black,
      hint: 'Page and the button label; its clear shade is the outer edge of the glow',
    },
    primary: { value: E.glow, hint: 'every device, the button and the glow behind the devices' },
    text: { value: E.white, hint: 'Available on' },
    secondary: { value: E.grey, hint: 'Website at the bottom' },
    surface: { value: E.metal, hint: `Laptop lid, tablet and phone bodies; ${FRAME_HINT}` },
    accent: { value: E.sky, hint: ART_HINT },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    lead: { label: 'Headline', value: 'Available on' },
    highlight: { label: 'Highlight', value: 'every device' },
    button: { label: 'Button', value: 'Learn more today' },
    site: SITE_COPY,
  },
} as const satisfies ThemeSpec;

export const everyDevice = themed(W, H, everySpec, (t) => {
  const ink = inkOf(t.shade);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    glow(540, 840, 560, t.shade('primary', E.glowSoft), t.shade('background', E.fade)),
    text(t.copy('lead'), 0, 120, W, {
      fontFamily: t.font('heading'),
      fontSize: 88,
      fontWeight: 600,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('highlight'), 0, 225, W, {
      fontFamily: t.font('heading'),
      fontSize: 88,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    rect(380, 370, 320, 68, t.color('primary'), { cornerRadius: 34, name: 'Button' }),
    text(t.copy('button'), 380, 388, 320, {
      fontFamily: t.font('heading'),
      fontSize: 28,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
    }),
    laptopDevice(ink, 190, 580, 560),
    tablet(ink, 640, 680, 300, 420),
    phoneDevice(ink, 110, 790, 150),
    siteLine(t.copy('site'), 1230, t.color('secondary'), t.font('body')),
  ];
});
