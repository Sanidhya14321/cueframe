import { type DesignIconName, linear } from '@/design';
import {
  checklist,
  circle,
  icon,
  type Nodes,
  pill,
  rect,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  type ChipPaint,
  chip,
  copy,
  device,
  FRAME,
  HEADING,
  iconTile,
  LAGOON,
  pageGradient,
  SH,
  SW,
  title,
  WHITE,
} from './deck-kit';

const T = LAGOON;

interface NotificationPaint {
  top: string;
  bottom: string;
  text: string;
  card: string;
  outline: string;
  dots: readonly [string, string];
  line: string;
  subline: string;
}

const notificationScreen =
  (c: NotificationPaint, font: string, heading: string) =>
  (width: number, height: number): Nodes[] => [
    rect(0, 0, width, height, linear(180, c.top, c.bottom), {
      cornerRadius: width * 0.12,
      name: 'Screen',
    }),
    text(heading, width * 0.08, height * 0.08, width * 0.84, {
      fontFamily: font,
      fontSize: width * 0.08,
      fontWeight: 800,
      fill: c.text,
    }),
    [0, 1, 2, 3].map((index) => {
      const y = height * (0.17 + index * 0.17);
      return [
        rect(width * 0.06, y, width * 0.88, height * 0.14, c.card, {
          cornerRadius: width * 0.06,
          stroke: c.outline,
          strokeWidth: 2,
          name: 'Notification',
        }),
        circle(width * 0.17, y + height * 0.07, width * 0.06, c.dots[index % 2] ?? c.dots[0]),
        rect(width * 0.28, y + height * 0.04, width * 0.5, height * 0.02, c.line, {
          cornerRadius: 4,
          name: 'Line',
        }),
        rect(width * 0.28, y + height * 0.08, width * 0.58, height * 0.016, c.subline, {
          cornerRadius: 4,
          name: 'Line',
        }),
      ];
    }),
  ];

const ALERT_ICONS: readonly DesignIconName[] = ['bell', 'user-check', 'zap'];
const CHIPS = [
  { x: 1400, y: 100, width: 420, icon: 'trophy' },
  { x: 1480, y: 560, width: 380, icon: 'bell' },
] as const;

const alertsSpec = {
  colors: {
    background: {
      value: T.deep,
      hint: 'Page and the alert icons; its shades color the far end of the page gradient, the phone frame and the chip shadows',
    },
    primary: { value: T.mid, hint: 'Chip icon tiles' },
    accent: { value: T.glow, hint: 'Alert icon tiles and the teal notification dots' },
    secondary: { value: T.warm, hint: 'Amber notification dots' },
    text: {
      value: WHITE,
      hint: 'Title and the alert titles; its mint shade colors the body and alert text',
    },
    surface: {
      value: WHITE,
      hint: 'Chips, chip icons, the phone screen and notification cards; its tints color the screen fade and card outlines, its dark shades the chip and screen text',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Smart Alerts\nFramework' },
    body: {
      label: 'Body',
      value: 'Context-aware nudges that keep users informed, active and moving.',
    },
    alerts: {
      label: 'Alert',
      value: ['Real-Time Alerts', 'Personal Context', 'One-Tap Actions'],
    },
    details: {
      label: 'Alert text',
      value: [
        'Time-critical updates delivered in under 300ms.',
        'Messages tailored to each user and moment.',
        'Deep links straight into the right workflow.',
      ],
    },
    screen: { label: 'Screen title', value: 'Notifications' },
    chips: { label: 'Chip title', value: ['Milestone Reached', 'Weekly Digest'] },
    chipSubs: {
      label: 'Chip subline',
      value: ['Your team closed 1,000 tasks', 'Fresh insights are ready'],
    },
  },
} as const satisfies ThemeSpec;

export const alertsSlide = themed(SW, SH, alertsSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const details = t.list('details');
  const chipSubs = t.list('chipSubs');
  const chipPaint: ChipPaint = {
    card: t.color('surface'),
    shadow: t.shade('background', 'rgba(4,38,58,0.18)'),
    tile: t.color('primary'),
    icon: t.color('surface'),
    heading: t.shade('surface', T.ink),
    sub: t.shade('surface', T.muted),
  };
  return [
    pageGradient(t.color('background'), t.shade('background', T.mid)),
    title(f.head)(t.copy('title'), 120, 110, 900, 92, t.color('text')),
    copy(f.body)(t.copy('body'), 120, 340, 720, 30, t.shade('text', T.soft)),
    t.list('alerts').map((alert, index) => {
      const y = 520 + index * 140;
      return [
        iconTile(
          ALERT_ICONS[index] ?? 'bell',
          120,
          y,
          84,
          t.color('accent'),
          t.color('background'),
        ),
        text(alert, 230, y + 4, 640, {
          fontFamily: f.head,
          fontSize: 32,
          fontWeight: 800,
          fill: t.color('text'),
        }),
        copy(f.body)(details[index] ?? '', 230, y + 48, 640, 24, t.shade('text', T.soft)),
      ];
    }),
    device(
      1150,
      180,
      360,
      16,
      t.color('background'),
      t.shade('background', FRAME),
      notificationScreen(
        {
          top: t.color('surface'),
          bottom: t.shade('surface', T.surface),
          text: t.shade('surface', T.ink),
          card: t.color('surface'),
          outline: t.shade('surface', T.soft),
          dots: [t.color('accent'), t.color('secondary')],
          line: t.shade('surface', T.ink),
          subline: t.shade('surface', T.soft),
        },
        f.head,
        t.copy('screen'),
      ),
    ),
    t.list('chips').map((heading, index) => {
      const spot = CHIPS[index] ?? CHIPS[0];
      return chip(
        chipPaint,
        f,
        spot.x,
        spot.y,
        spot.width,
        heading,
        chipSubs[index] ?? '',
        spot.icon,
      );
    }),
  ];
});

const RIVALS: readonly (readonly boolean[])[] = [
  [true, true, true, true, true],
  [true, true, false, true, false],
  [false, true, false, false, true],
];

const matrixSpec = {
  colors: {
    background: {
      value: T.surface,
      hint: 'Page gradient; its shades are the white top and the mint bottom',
    },
    primary: {
      value: T.mid,
      hint: 'Nimbo header and the check marks; its pale tint is the highlight column',
    },
    accent: { value: '#e11d48', hint: 'Cross marks' },
    text: {
      value: T.ink,
      hint: 'Title, row names and rival header labels; its translucent shade colors the row rules',
    },
    surface: { value: WHITE, hint: 'Rival headers and the Nimbo header label' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Competitive Matrix' },
    columns: { label: 'Column header', value: ['Nimbo', 'Rival A', 'Rival B'] },
    rows: {
      label: 'Row name',
      value: ['Strategy', 'Onboarding', 'Performance', 'Integration', 'Pricing'],
    },
  },
} as const satisfies ThemeSpec;

export const matrixSlide = themed(SW, SH, matrixSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  return [
    pageGradient(
      t.shade('background', WHITE),
      t.color('background'),
      t.shade('background', T.soft),
    ),
    title(f.head)(t.copy('title'), 0, 80, SW, 84, t.color('text'), 'center'),
    rect(720, 220, 300, 790, t.shade('primary', T.soft), {
      cornerRadius: 28,
      name: 'Highlight column',
    }),
    t.list('columns').map((label, index) => [
      rect(730 + index * 320, 230, 280, 80, index === 0 ? t.color('primary') : t.color('surface'), {
        cornerRadius: 20,
        name: 'Header',
      }),
      text(label, 730 + index * 320, 252, 280, {
        fontFamily: f.head,
        fontSize: 30,
        fontWeight: 800,
        fill: index === 0 ? t.color('surface') : t.color('text'),
        align: 'center',
      }),
    ]),
    t.list('rows').map((row, rowIndex) => {
      const y = 360 + rowIndex * 130;
      return [
        text(row, 320, y + 28, 380, {
          fontFamily: f.body,
          fontSize: 32,
          fontWeight: 600,
          fill: t.color('text'),
        }),
        rect(320, y + 110, 1300, 2, t.shade('text', 'rgba(6,36,51,0.12)'), { name: 'Row rule' }),
        RIVALS.map((marks, column) => {
          const yes = marks[rowIndex] ?? false;
          return icon(
            yes ? 'check' : 'x',
            845 + column * 320,
            y + 22,
            50,
            yes ? t.color('primary') : t.color('accent'),
            { strokeWidth: 3 },
          );
        }),
      ];
    }),
  ];
});

const pricingSpec = {
  colors: {
    background: {
      value: T.deep,
      hint: 'Page; its lighter shade is the far end of the page gradient',
    },
    primary: {
      value: T.mid,
      hint: 'Prices and check marks; its dark shade colors plan names, features and the badge label, its muted shade the per seat line',
    },
    accent: { value: T.glow, hint: 'Outline of the featured plan' },
    secondary: { value: T.warm, hint: 'Most popular badge' },
    text: { value: WHITE, hint: 'Title; its mint shade colors the intro' },
    surface: {
      value: WHITE,
      hint: 'Featured plan card; its mint tint colors the other plan cards',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Pricing Options' },
    intro: {
      label: 'Intro',
      value: 'Simple plans that grow with your product. Switch any time.',
    },
    plans: { label: 'Plan', value: ['Starter', 'Growth', 'Scale'] },
    prices: { label: 'Price', value: ['$0', '$19', '$49'] },
    period: { label: 'Price period', value: 'per seat / month', hint: 'Shown under every price' },
    features: {
      label: 'Feature',
      value: [
        '1 workspace',
        'Core analytics',
        'Email support',
        '10 workspaces',
        'Smart alerts',
        'Priority chat',
        'Unlimited seats',
        'Custom models',
        'Success manager',
      ],
      hint: 'Three per plan, in plan order',
    },
    badge: { label: 'Badge', value: 'Most popular' },
  },
} as const satisfies ThemeSpec;

export const pricingSlide = themed(SW, SH, pricingSpec, (t) => {
  const f = { head: t.font('heading'), body: t.font('body') };
  const ink = t.shade('primary', T.ink);
  const prices = t.list('prices');
  const features = t.list('features');
  return [
    pageGradient(t.color('background'), t.shade('background', T.mid)),
    title(f.head)(t.copy('title'), 0, 80, SW, 84, t.color('text'), 'center'),
    copy(f.body)(t.copy('intro'), 0, 190, SW, 30, t.shade('text', T.soft), 'center'),
    t.list('plans').map((plan, index) => {
      const featured = index === 1;
      const x = 290 + index * 470;
      const y = featured ? 300 : 340;
      const card = featured ? t.color('surface') : t.shade('surface', T.surface);
      return [
        rect(x, y, 400, featured ? 700 : 640, card, {
          cornerRadius: 36,
          stroke: featured ? t.color('accent') : card,
          strokeWidth: featured ? 6 : 0,
          name: 'Plan card',
        }),
        text(plan, x, y + 50, 400, {
          fontFamily: f.head,
          fontSize: 40,
          fontWeight: 800,
          fill: ink,
          align: 'center',
        }),
        text(prices[index] ?? '', x, y + 120, 400, {
          fontFamily: f.head,
          fontSize: 96,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
        }),
        text(t.copy('period'), x, y + 240, 400, {
          fontFamily: f.body,
          fontSize: 22,
          fontWeight: 500,
          fill: t.shade('primary', T.muted),
          align: 'center',
        }),
        checklist(features.slice(index * 3, index * 3 + 3), x + 60, y + 330, 320, {
          color: ink,
          iconColor: t.color('primary'),
          fontSize: 26,
          gap: 66,
          fontFamily: f.body,
        }),
      ];
    }),
    pill(t.copy('badge'), 845, 270, {
      fill: t.color('secondary'),
      color: ink,
      fontSize: 24,
      fontFamily: f.body,
      fontWeight: 700,
    }),
  ];
});
