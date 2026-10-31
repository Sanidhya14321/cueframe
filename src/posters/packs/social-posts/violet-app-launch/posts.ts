import { linear, radial } from '@/design';
import {
  card,
  circle,
  icon,
  POST_SIZE,
  paint,
  photo,
  pill,
  rating,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { APP_COPY, BADGE_COPY, BODY, badges, device, HEADING, SITE, VIOLET } from './device';

export const { width: W, height: H } = POST_SIZE;

const site = (content: string, x: number, y: number, fill: string, fontFamily: string) =>
  text(content, x, y, 400, { fontFamily, fontSize: 28, fontWeight: 600, fill });

export const headline = (
  content: string,
  x: number,
  y: number,
  fill: string,
  fontFamily: string,
  size = 96,
  weight = 800,
) =>
  text(content, x, y, W - x - 60, {
    fontFamily,
    fontSize: size,
    fontWeight: weight,
    fill,
    lineHeight: 1.05,
  });

export const centered = (
  content: string,
  y: number,
  fill: string,
  fontFamily: string,
  size: number,
  weight = 800,
  width: number = W,
) =>
  text(content, 0, y, width, {
    fontFamily,
    fontSize: size,
    fontWeight: weight,
    fill,
    align: 'center',
    lineHeight: 1.05,
  });

const addsUpSpec = {
  colors: {
    background: { value: VIOLET.paper, hint: 'Page' },
    primary: {
      value: VIOLET.brand,
      hint: 'Highlighted title, the brand line, the download band and the phone app header and chart; its shades color the band gradient and the app row icons',
    },
    accent: { value: VIOLET.accent, hint: 'Highlighted chart bar in the phone' },
    text: {
      value: VIOLET.ink,
      hint: 'It adds up, Automate every flow and the arrow; its shades color the website, the phone frame, app rows and the store badges',
    },
    surface: {
      value: '#ffffff',
      hint: 'DOWNLOAD TODAY!, the website on the band, the badge text and the phone screen, card and balance',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE,
    title: { label: 'Title', value: 'It adds up' },
    highlight: { label: 'Highlighted title', value: 'quickly,' },
    line: { label: 'Tagline', value: 'Automate every flow' },
    brandLine: { label: 'Brand line', value: 'with Nimbly' },
    download: { label: 'Download call', value: 'DOWNLOAD TODAY!' },
    ...APP_COPY,
    ...BADGE_COPY,
  },
} as const satisfies ThemeSpec;

export const addsUp = themed(W, H, addsUpSpec, (t) => {
  const heading = t.font('heading');
  const body = t.font('body');
  const ink = {
    dark: (exact: string) => t.shade('text', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    site(t.copy('site'), 80, 90, t.shade('text', VIOLET.muted), body),
    headline(t.copy('title'), 80, 200, t.color('text'), heading, 118),
    headline(t.copy('highlight'), 80, 330, t.color('primary'), heading, 118),
    device(t, ink, VIOLET, 640, 470, 320, 12),
    text(t.copy('line'), 80, 640, 520, {
      fontFamily: body,
      fontSize: 40,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    text(t.copy('brandLine'), 80, 694, 520, {
      fontFamily: body,
      fontSize: 40,
      fontWeight: 800,
      fill: t.color('primary'),
    }),
    icon('corner-down-right', 300, 790, 110, t.color('text'), { strokeWidth: 1.6 }),
    rect(0, 1150, W, 200, linear(90, t.color('primary'), t.shade('primary', VIOLET.deep)), {
      name: 'Download band',
    }),
    text(t.copy('download'), 80, 1172, 500, {
      fontFamily: body,
      fontSize: 24,
      fontWeight: 800,
      fill: t.color('surface'),
      letterSpacing: 2,
    }),
    badges(t, ink, 80, 1222),
    text(t.copy('site'), 640, 1246, 360, {
      fontFamily: body,
      fontSize: 30,
      fontWeight: 700,
      fill: t.color('surface'),
      align: 'right',
    }),
  ];
});

const downloadSpec = {
  colors: {
    primary: {
      value: VIOLET.brand,
      hint: 'Page gradient and the phone app header and chart; its shades color the bottom of the gradient and the app row icons',
    },
    accent: { value: VIOLET.accent, hint: 'Rating stars and the highlighted chart bar' },
    text: {
      value: VIOLET.ink,
      hint: 'today! button and the 4.9 score; its shades color the installs line, the card shadow, the phone frame and app rows',
    },
    surface: {
      value: '#ffffff',
      hint: 'Download our mobile app, the today! label, the rating card, the sparkles and the phone screen, card and balance',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Download our' },
    subtitle: { label: 'Second title line', value: 'mobile app' },
    tag: { label: 'Button', value: 'today!' },
    score: { label: 'Rating', value: '4.9' },
    installs: { label: 'Installs', value: '120K happy installs' },
    ...APP_COPY,
  },
} as const satisfies ThemeSpec;

export const downloadApp = themed(W, H, downloadSpec, (t) => {
  const heading = t.font('heading');
  const white = t.color('surface');
  const ink = {
    dark: (exact: string) => t.shade('text', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, W, H, linear(160, t.color('primary'), t.shade('primary', VIOLET.deep)), {
      name: 'Background',
    }),
    centered(t.copy('title'), 110, white, heading, 96),
    centered(t.copy('subtitle'), 215, white, heading, 96),
    pill(t.copy('tag'), 380, 340, {
      fill: t.color('text'),
      color: white,
      fontSize: 60,
      fontFamily: heading,
      fontWeight: 800,
      width: 320,
    }),
    device(t, ink, VIOLET, 150, 560, 330, -14),
    paint([card(600, 720, 400, 250, { radius: 32, shadowBlur: 40, fill: white })], {
      'rgba(15,23,42,0.14)': t.shade('text', 'rgba(15,23,42,0.14)'),
    }),
    text(t.copy('score'), 640, 750, 200, {
      fontFamily: heading,
      fontSize: 80,
      fontWeight: 800,
      fill: t.color('text'),
    }),
    rating(780, 778, 34, 5, t.color('accent'), 0.15),
    text(t.copy('installs'), 640, 875, 340, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 600,
      fill: t.shade('text', VIOLET.muted),
    }),
    icon('sparkles', 880, 1100, 110, white, { strokeWidth: 1.6 }),
  ];
});

const ideasSpec = {
  colors: {
    background: {
      value: VIOLET.night,
      hint: 'Page gradient; its darker shades color the bottom of the gradient, the phone frame, app rows and the store badges',
    },
    primary: {
      value: VIOLET.brand,
      hint: 'Learn more button and the phone app header and chart; its light shade colors the website and Ideas',
    },
    accent: { value: VIOLET.accent, hint: 'Highlighted chart bar in the phone' },
    text: {
      value: '#ffffff',
      hint: 'Headline, the button label and DOWNLOAD TODAY!; its faint shade colors the rings',
    },
    surface: {
      value: '#ffffff',
      hint: 'Store badge text and outlines and the phone screen, card and balance',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE,
    headline: { label: 'Headline line', value: ['Where', 'Your', 'Ideas', 'Take Off'] },
    cta: { label: 'Button', value: 'Learn more' },
    download: { label: 'Download call', value: 'DOWNLOAD TODAY!' },
    ...APP_COPY,
    ...BADGE_COPY,
  },
} as const satisfies ThemeSpec;

export const ideasHappen = themed(W, H, ideasSpec, (t) => {
  const heading = t.font('heading');
  const body = t.font('body');
  const soft = t.shade('primary', VIOLET.soft);
  const ink = {
    dark: (exact: string) => t.shade('background', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', VIOLET.ink)), {
      name: 'Background',
    }),
    [150, 220, 290].map((radius) =>
      circle(770, 650, radius, t.shade('text', 'rgba(0,0,0,0)'), {
        stroke: t.shade('text', 'rgba(255,255,255,0.12)'),
        strokeWidth: 2,
        name: 'Ring',
      }),
    ),
    site(t.copy('site'), 80, 90, soft, body),
    t
      .list('headline')
      .map((line, index) =>
        headline(
          line,
          80,
          290 + index * 105,
          index === 2 ? soft : t.color('text'),
          heading,
          96,
          index < 2 ? 600 : 800,
        ),
      ),
    pill(t.copy('cta'), 80, 780, {
      fill: t.color('primary'),
      color: t.color('text'),
      fontSize: 30,
      fontFamily: body,
    }),
    device(t, ink, VIOLET, 620, 330, 300, 10),
    text(t.copy('download'), 80, 1100, 500, {
      fontFamily: body,
      fontSize: 24,
      fontWeight: 800,
      fill: t.color('text'),
      letterSpacing: 2,
    }),
    badges(t, ink, 80, 1150),
  ];
});

const workspaceSpec = {
  colors: {
    background: {
      value: VIOLET.ink,
      hint: 'Page behind the photo and the dark wash over it; its shades color the phone frame, app rows and the store badges',
    },
    primary: {
      value: VIOLET.brand,
      hint: 'Download band and the phone app header and chart; its translucent shade colors the glow behind the phone',
    },
    accent: { value: VIOLET.accent, hint: 'Highlighted chart bar in the phone' },
    text: { value: '#ffffff', hint: 'Headline and Start free today' },
    surface: {
      value: '#ffffff',
      hint: 'Store badge text and outlines and the phone screen, card and balance',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Your all-in-one,' },
    title: { label: 'Title', value: 'Digital HQ.' },
    cta: { label: 'Call to action', value: 'Start free today' },
    ...APP_COPY,
    ...BADGE_COPY,
  },
} as const satisfies ThemeSpec;

export const workspace = themed(W, H, workspaceSpec, (t) => {
  const heading = t.font('heading');
  const ink = {
    dark: (exact: string) => t.shade('background', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('desk-imac', 0, 0, W, H, { name: 'Office photo' }),
    rect(
      0,
      0,
      W,
      H,
      linear(
        180,
        t.shade('background', 'rgba(20,15,46,0.55)'),
        t.shade('background', 'rgba(20,15,46,0.9)'),
      ),
      { name: 'Shade' },
    ),
    centered(t.copy('kicker'), 110, t.color('text'), heading, 64, 500),
    centered(t.copy('title'), 190, t.color('text'), heading, 92),
    circle(
      540,
      700,
      260,
      radial(t.shade('primary', 'rgba(109,74,255,0.6)'), t.shade('primary', 'rgba(109,74,255,0)')),
      { name: 'Glow' },
    ),
    device(t, ink, VIOLET, 380, 360, 320),
    rect(0, 1180, W, 170, t.color('primary'), { name: 'Download band' }),
    badges(t, ink, 80, 1229),
    text(t.copy('cta'), 600, 1246, 400, {
      fontFamily: heading,
      fontSize: 36,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'right',
      italic: true,
    }),
  ];
});
