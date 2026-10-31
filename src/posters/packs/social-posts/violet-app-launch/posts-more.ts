import { linear, radial } from '@/design';
import { circle, icon, pill, rect, type ThemeSpec, text, themed } from '../../../kit';
import { APP_COPY, BADGE_COPY, BODY, badges, device, HEADING, SITE, VIOLET } from './device';
import { centered, H, headline, W } from './posts';

const tasksSpec = {
  colors: {
    background: { value: VIOLET.paper, hint: 'Page' },
    primary: {
      value: VIOLET.brand,
      hint: 'Your Tasks, the list card, the check marks and the phone app header and chart; its shades color the card gradient and the app row icons',
    },
    accent: { value: VIOLET.accent, hint: 'Highlighted chart bar in the phone' },
    text: {
      value: VIOLET.ink,
      hint: 'Headline, the list rows and the download line; its shades color the website, the phone frame, app rows and the store badges',
    },
    surface: {
      value: '#ffffff',
      hint: 'List row pills, the badge text and outlines and the phone screen, card and balance',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE,
    headline: { label: 'Headline line', value: ['Plan, Track', '& Finish', 'Your Tasks'] },
    features: {
      label: 'Feature',
      value: ['Fast and focused', 'Always in sync', 'Help around the clock'],
    },
    cta: { label: 'Download line', value: 'Download it free today' },
    ...APP_COPY,
    ...BADGE_COPY,
  },
} as const satisfies ThemeSpec;

export const trackTasks = themed(W, H, tasksSpec, (t) => {
  const heading = t.font('heading');
  const body = t.font('body');
  const ink = {
    dark: (exact: string) => t.shade('text', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('site'), 600, 90, 400, {
      fontFamily: body,
      fontSize: 28,
      fontWeight: 600,
      fill: t.shade('text', VIOLET.muted),
      align: 'right',
    }),
    t
      .list('headline')
      .map((line, index) =>
        headline(
          line,
          80,
          210 + index * 90,
          index === 2 ? t.color('primary') : t.color('text'),
          heading,
          76,
        ),
      ),
    rect(60, 600, 600, 340, linear(135, t.color('primary'), t.shade('primary', VIOLET.deep)), {
      cornerRadius: 32,
      name: 'List card',
    }),
    t.list('features').map((label, index) => [
      rect(90, 630 + index * 98, 440, 74, t.color('surface'), { cornerRadius: 37, name: 'Row' }),
      icon('circle-check', 108, 645 + index * 98, 44, t.color('primary')),
      text(label, 166, 650 + index * 98, 360, {
        fontFamily: body,
        fontSize: 28,
        fontWeight: 600,
        fill: t.color('text'),
      }),
    ]),
    device(t, ink, VIOLET, 620, 220, 330),
    centered(t.copy('cta'), 1060, t.color('text'), heading, 46, 700),
    badges(t, ink, 300, 1160),
  ];
});

const updateSpec = {
  colors: {
    background: {
      value: VIOLET.night,
      hint: 'Page gradient; its darker shades color the bottom of the gradient, the button label, the phone frame and app rows',
    },
    primary: {
      value: VIOLET.brand,
      hint: 'Phone app header and chart; its shades color the website, is now live and the glow behind the phone',
    },
    accent: { value: VIOLET.accent, hint: 'See what changed button and the highlighted chart bar' },
    text: { value: '#ffffff', hint: 'Fresh Update' },
    surface: { value: '#ffffff', hint: 'Phone screen, card and balance' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE,
    title: { label: 'Title', value: 'Fresh Update' },
    subtitle: { label: 'Subtitle', value: 'is now live' },
    cta: { label: 'Button', value: 'See what changed' },
    ...APP_COPY,
  },
} as const satisfies ThemeSpec;

export const freshUpdate = themed(W, H, updateSpec, (t) => {
  const heading = t.font('heading');
  const body = t.font('body');
  const soft = t.shade('primary', VIOLET.soft);
  const ink = {
    dark: (exact: string) => t.shade('background', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', VIOLET.ink)), {
      name: 'Background',
    }),
    text(t.copy('site'), 0, 80, W, {
      fontFamily: body,
      fontSize: 28,
      fontWeight: 600,
      fill: soft,
      align: 'center',
    }),
    centered(t.copy('title'), 160, t.color('text'), heading, 96),
    centered(t.copy('subtitle'), 270, soft, heading, 96),
    circle(
      540,
      860,
      300,
      radial(t.shade('primary', 'rgba(109,74,255,0.55)'), t.shade('primary', 'rgba(109,74,255,0)')),
      { name: 'Glow' },
    ),
    device(t, ink, VIOLET, 380, 450, 320),
    pill(t.copy('cta'), 365, 1170, {
      fill: t.color('accent'),
      color: t.shade('background', VIOLET.ink),
      fontSize: 30,
      fontFamily: body,
    }),
  ];
});

const growthSpec = {
  colors: {
    background: { value: '#ffffff', hint: 'Page and the arc over the lower panel' },
    primary: {
      value: VIOLET.brand,
      hint: 'Business Growth, the lower panel and the phone app header and chart; its shades color the top of the panel and the app row icons',
    },
    accent: { value: VIOLET.accent, hint: 'Highlighted chart bars in the phones' },
    text: {
      value: VIOLET.ink,
      hint: 'Fuel Faster; its shades color the body text, the phone frames and app rows',
    },
    surface: { value: '#ffffff', hint: 'Phone screens, cards and balances' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Fuel Faster' },
    title: { label: 'Title', value: 'Business Growth' },
    body: { label: 'Body', value: 'Let smart automations make\nthe busywork disappear.' },
    ...APP_COPY,
  },
} as const satisfies ThemeSpec;

export const growth = themed(W, H, growthSpec, (t) => {
  const heading = t.font('heading');
  const ink = {
    dark: (exact: string) => t.shade('text', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(0, 560, W, 790, linear(160, t.shade('primary', VIOLET.soft), t.color('primary')), {
      name: 'Lower panel',
    }),
    circle(540, 560, 380, t.color('background'), { name: 'Arc' }),
    centered(t.copy('kicker'), 110, t.color('text'), heading, 70, 500),
    centered(t.copy('title'), 195, t.color('primary'), heading, 84),
    text(t.copy('body'), 0, 320, W, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 400,
      fill: t.shade('text', VIOLET.muted),
      align: 'center',
      lineHeight: 1.4,
    }),
    device(t, ink, VIOLET, 250, 600, 280, -12),
    device(t, ink, VIOLET, 520, 650, 280, -12),
  ];
});

const storySpec = {
  colors: {
    ...growthSpec.colors,
    text: {
      value: VIOLET.ink,
      hint: 'Fuel Faster and the Try it free button; its shades color the body text, the phone frames and app rows',
    },
    surface: { value: '#ffffff', hint: 'Button label and the phone screens, cards and balances' },
  },
  fonts: growthSpec.fonts,
  copy: { ...growthSpec.copy, cta: { label: 'Button', value: 'Try it free' } },
} as const satisfies ThemeSpec;

export const growthStory = themed(1080, 1920, storySpec, (t) => {
  const heading = t.font('heading');
  const ink = {
    dark: (exact: string) => t.shade('text', exact),
    light: (exact: string) => t.shade('surface', exact),
  };
  return [
    rect(0, 0, 1080, 1920, t.color('background'), { name: 'Background' }),
    rect(0, 820, 1080, 1100, linear(160, t.shade('primary', VIOLET.soft), t.color('primary')), {
      name: 'Lower panel',
    }),
    circle(540, 820, 420, t.color('background'), { name: 'Arc' }),
    centered(t.copy('kicker'), 230, t.color('text'), heading, 80, 500, 1080),
    centered(t.copy('title'), 330, t.color('primary'), heading, 92, 800, 1080),
    text(t.copy('body'), 0, 470, 1080, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 400,
      fill: t.shade('text', VIOLET.muted),
      align: 'center',
      lineHeight: 1.4,
    }),
    device(t, ink, VIOLET, 210, 820, 340, -12),
    device(t, ink, VIOLET, 530, 880, 340, -12),
    pill(t.copy('cta'), 400, 1720, {
      fill: t.color('text'),
      color: t.color('surface'),
      fontSize: 34,
      fontFamily: t.font('body'),
    }),
  ];
});
