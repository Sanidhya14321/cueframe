import { linear } from '@/design';
import {
  bars,
  circle,
  ellipse,
  laptop,
  line,
  paint,
  photo,
  pill,
  poly,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY_FONT,
  BRAND,
  backdrop,
  footerMark,
  H,
  HEADING_FONT,
  headerLink,
  type SaasTheme,
  W,
} from './posts';

export const quotePhone = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: { value: theme.background, hint: 'Page' },
      surface: { value: theme.panel, hint: 'Quote card' },
      primary: {
        value: theme.brand,
        hint: 'Orbit rings, the quote card border, the reviewer name and the logo tile',
      },
      text: { value: theme.text, hint: 'Quote, brand name and the logo arrow' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      quote: {
        label: 'Quote',
        value:
          '“The launch kit paid for itself in a week. Our trial signups jumped and the team finally had one voice.”',
      },
      reviewer: { label: 'Reviewer', value: 'Priya Raman, COO' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(t.color('background')),
    ellipse(540, 40, 500, 500, t.shade('primary', 'rgba(0,0,0,0)'), {
      stroke: t.color('primary'),
      strokeWidth: 4,
      name: 'Orbit',
    }),
    ellipse(660, 160, 260, 260, t.shade('primary', 'rgba(0,0,0,0)'), {
      stroke: t.color('primary'),
      strokeWidth: 4,
      name: 'Orbit',
    }),
    rect(150, 380, 640, 420, t.color('surface'), {
      name: 'Quote card',
      cornerRadius: 30,
      stroke: t.color('primary'),
      strokeWidth: 3,
    }),
    text(t.copy('quote'), 200, 430, 540, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.4,
    }),
    text(t.copy('reviewer'), 200, 720, 540, {
      fontFamily: t.font('heading'),
      fontSize: 30,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    photo('phone-hand-1', 560, 760, 440, 440, { cornerRadius: 220 }),
    footerMark(
      80,
      1240,
      { tile: t.color('primary'), arrow: t.color('text'), name: t.color('text') },
      t.copy('brand'),
      t.font('heading'),
    ),
  ]);
};

export const bookDemo = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: {
        value: theme.brand,
        hint: 'Page gradient and the logo tile; its lighter shade ends the gradient',
      },
      surface: { value: '#0d0d10', hint: 'Dark frame around the photo' },
      text: {
        value: theme.onBrand,
        hint: 'Title, subtitle, body text, brand name and the logo arrow',
      },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      title: { label: 'Title', value: 'Book' },
      subtitle: { label: 'Subtitle', value: 'a Demo' },
      body: { label: 'Body', value: 'Launch, optimize and scale\nfrom one simple dashboard.' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', theme.glow)), {
      name: 'Background',
    }),
    text(t.copy('title'), 0, 90, W, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      ...shadow(30, 0, 'rgba(255,255,255,0.6)'),
    }),
    text(t.copy('subtitle'), 0, 290, W, {
      fontFamily: t.font('heading'),
      fontSize: 70,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    rect(150, 430, 780, 520, t.color('surface'), { name: 'Photo frame', cornerRadius: 24 }),
    photo('desk-imac', 170, 450, 740, 480, { cornerRadius: 16 }),
    text(t.copy('body'), 0, 1010, W, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.4,
    }),
    footerMark(
      80,
      1240,
      { tile: t.color('background'), arrow: t.color('text'), name: t.color('text') },
      t.copy('brand'),
      t.font('heading'),
    ),
  ]);
};

const wedge = (cx: number, cy: number, radius: number, fromDeg: number, toDeg: number) => {
  const steps = 8;
  return [
    [cx, cy] as [number, number],
    ...Array.from({ length: steps + 1 }, (_, index): [number, number] => {
      const angle = ((fromDeg + ((toDeg - fromDeg) * index) / steps) * Math.PI) / 180;
      return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
    }),
  ];
};

export const statDonut = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: {
        value: theme.background,
        hint: 'Page, the empty slice of the donut and its hole',
      },
      primary: { value: theme.brand, hint: 'Donut ring and the logo tile' },
      text: {
        value: theme.text,
        hint: 'Top link, percentage, headline, brand name and the logo arrow; its grey shade colors the body line under the headline',
      },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      link: { label: 'Top link', value: 'Join us' },
      stat: { label: 'Stat', value: '83%' },
      headline: { label: 'Headline', value: 'Of users want\nsimpler tools' },
      body: { label: 'Body', value: 'Keep your product clear.' },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(t.color('background')),
    headerLink(t.copy('link'), 'right', t.color('text'), t.font('body')),
    circle(340, 440, 260, t.color('primary')),
    poly(wedge(340, 440, 270, -90, -29), t.shade('background', theme.base), {
      name: 'Remaining share',
    }),
    circle(340, 440, 180, t.shade('background', theme.base)),
    text(t.copy('stat'), 160, 380, 360, {
      fontFamily: t.font('heading'),
      fontSize: 110,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('headline'), 90, 790, 900, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.05,
    }),
    text(t.copy('body'), 90, 1010, 900, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: t.shade('text', theme.muted),
    }),
    footerMark(
      90,
      1240,
      { tile: t.color('primary'), arrow: t.color('text'), name: t.color('text') },
      t.copy('brand'),
      t.font('heading'),
    ),
  ]);
};

const BENEFIT_SPOTS = [
  { x: 90, y: 470 },
  { x: 760, y: 420 },
  { x: 90, y: 900 },
  { x: 740, y: 960 },
] as const;

export const benefitsApp = (theme: SaasTheme) => {
  const spec = {
    colors: {
      background: { value: theme.background, hint: 'Page' },
      surface: {
        value: theme.panel,
        hint: 'Laptop screen; its shades color the laptop lid and base',
      },
      primary: {
        value: theme.brand,
        hint: 'App bar and chart bars on the screen and the logo tile; its lighter shade colors the top tile',
      },
      text: {
        value: theme.text,
        hint: 'Headline, connector lines, benefit pills, brand name, logo arrow and the faint tile on the screen',
      },
    },
    fonts: { heading: HEADING_FONT },
    copy: {
      headline: { label: 'Headline', value: 'Why teams switch\nto our app' },
      benefits: { label: 'Benefit', value: ['Faster', 'Secure', 'Automated', 'Insightful'] },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(t.color('background')),
    text(t.copy('headline'), 0, 110, W, {
      fontFamily: t.font('heading'),
      fontSize: 72,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
      lineHeight: 1.1,
    }),
    line(250, 505, 120, t.color('text'), 3),
    line(700, 455, 70, t.color('text'), 3),
    line(290, 935, 110, t.color('text'), 3),
    line(670, 995, 80, t.color('text'), 3),
    paint(
      [
        laptop(330, 520, 420, {
          screen: t.color('surface'),
          body: t.shade('surface', '#2a2a33'),
          content: [
            rect(0, 0, 399, 26, t.color('primary'), { name: 'App bar' }),
            bars(30, 70, 220, 160, [3, 5, 4, 7, 6, 9], t.color('primary')),
            rect(270, 70, 110, 70, t.shade('primary', theme.glow), {
              cornerRadius: 10,
              name: 'Tile',
            }),
            rect(270, 160, 110, 70, t.shade('text', 'rgba(255,255,255,0.18)'), {
              cornerRadius: 10,
              name: 'Tile',
            }),
          ],
        }),
      ],
      { '#cbd5e1': t.shade('surface', '#cbd5e1') },
    ),
    t.list('benefits').map((label, index) => {
      const spot = BENEFIT_SPOTS[index] ?? BENEFIT_SPOTS[0];
      return pill(label, spot.x, spot.y, {
        fill: t.shade('background', 'rgba(0,0,0,0)'),
        stroke: t.color('text'),
        strokeWidth: 3,
        color: t.color('text'),
        fontSize: 32,
        fontFamily: t.font('heading'),
        fontWeight: 600,
        width: 230,
      });
    }),
    footerMark(
      380,
      1220,
      { tile: t.color('primary'), arrow: t.color('text'), name: t.color('text') },
      t.copy('brand'),
      t.font('heading'),
    ),
  ]);
};
