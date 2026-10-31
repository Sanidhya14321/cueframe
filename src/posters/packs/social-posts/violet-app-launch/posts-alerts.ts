import { linear } from '@/design';
import {
  card,
  circle,
  icon,
  paint,
  photo,
  pill,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { APP_COPY, type AppPalette, BODY, device, HEADING, VIOLET } from './device';
import { centered, H, headline, W } from './posts';

const alertsSpec = (p: AppPalette) =>
  ({
    colors: {
      background: {
        value: p.ink,
        hint: 'Page; its shades color the phone frame, app rows, the card shadow, Order shipped and Arrives Friday',
      },
      primary: {
        value: p.brand,
        hint: 'Stage, the bell disc and the phone app header and chart; its shades color by Text Message, the stage gradient and the app row icons',
      },
      accent: { value: p.accent, hint: 'Highlighted chart bar in the phone' },
      text: {
        value: '#ffffff',
        hint: 'Get Alerts and the bell; its faint shade colors the grid lines',
      },
      surface: {
        value: '#ffffff',
        hint: 'Notification card and the phone screen, card and balance',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Get Alerts' },
      subtitle: { label: 'Subtitle', value: 'by Text Message' },
      alert: { label: 'Notification title', value: 'Order shipped' },
      detail: { label: 'Notification detail', value: 'Arrives Friday' },
      ...APP_COPY,
    },
  }) as const satisfies ThemeSpec;

export const textAlerts = (p: AppPalette) =>
  themed(W, H, alertsSpec(p), (t) => {
    const heading = t.font('heading');
    const body = t.font('body');
    const grid = t.shade('text', 'rgba(255,255,255,0.06)');
    const ink = {
      dark: (exact: string) => t.shade('background', exact),
      light: (exact: string) => t.shade('surface', exact),
    };
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      Array.from({ length: 15 }, (_, index) =>
        rect(0, index * 90, W, 2, grid, { name: 'Grid line' }),
      ),
      Array.from({ length: 12 }, (_, index) =>
        rect(index * 90, 0, 2, H, grid, { name: 'Grid line' }),
      ),
      centered(t.copy('title'), 120, t.color('text'), heading, 100, 600),
      centered(t.copy('subtitle'), 235, t.shade('primary', p.soft), heading, 88),
      rect(140, 760, 800, 590, linear(160, t.color('primary'), t.shade('primary', p.deep)), {
        cornerRadius: 60,
        name: 'Stage',
      }),
      device(t, ink, p, 340, 440, 400),
      paint([card(600, 620, 420, 130, { radius: 28, shadowBlur: 30, fill: t.color('surface') })], {
        'rgba(15,23,42,0.14)': t.shade('background', 'rgba(15,23,42,0.14)'),
      }),
      circle(660, 685, 36, t.color('primary')),
      icon('message-circle', 640, 665, 40, t.color('text')),
      text(t.copy('alert'), 716, 645, 290, {
        fontFamily: body,
        fontSize: 28,
        fontWeight: 700,
        fill: t.shade('background', p.ink),
      }),
      text(t.copy('detail'), 716, 685, 290, {
        fontFamily: body,
        fontSize: 24,
        fontWeight: 500,
        fill: t.shade('background', p.muted),
      }),
    ];
  });

const futureSpec = {
  colors: {
    background: { value: VIOLET.paper, hint: 'Page' },
    primary: { value: VIOLET.brand, hint: 'Work is Automated and the Learn more button' },
    text: { value: VIOLET.ink, hint: 'The Future of; its grey shade colors the body text' },
    surface: { value: '#ffffff', hint: 'Button label' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'The Future of' },
    highlight: { label: 'Highlighted title', value: 'Work is Automated' },
    body: { label: 'Body', value: 'Your AI teammate handles the\nrepetitive work for you.' },
    cta: { label: 'Button', value: 'Learn more' },
  },
} as const satisfies ThemeSpec;

export const futureHand = themed(W, H, futureSpec, (t) => {
  const heading = t.font('heading');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    headline(t.copy('title'), 80, 130, t.color('text'), heading, 78, 500),
    headline(t.copy('highlight'), 80, 222, t.color('primary'), heading, 78),
    text(t.copy('body'), 80, 350, 800, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 400,
      fill: t.shade('text', VIOLET.muted),
      lineHeight: 1.4,
    }),
    pill(t.copy('cta'), 80, 480, {
      fill: t.color('primary'),
      color: t.color('surface'),
      fontSize: 30,
      fontFamily: t.font('body'),
    }),
    photo('phone-hand-1', 80, 640, 920, 630, { cornerRadius: 40 }),
  ];
});

export const ALERTS = textAlerts(VIOLET);
