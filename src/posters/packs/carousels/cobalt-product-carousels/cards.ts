import type { DesignIconName } from '@/design';
import { circle, icon, rect, type Template, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  BRAND,
  brandLine,
  COBALT,
  glow,
  H,
  HEADING_FONT,
  inkBackground,
  SITE,
  W,
} from './palette';

const coverSpec = {
  colors: {
    background: { value: COBALT.ink, hint: 'Page' },
    primary: {
      value: COBALT.sky,
      hint: 'Subline and the top of the button gradient; its deeper shade is the bottom of the button',
    },
    text: {
      value: COBALT.white,
      hint: 'Brand line, the headline, the button label, the dots and the arrow',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    brand: BRAND,
    headline: { label: 'Headline', value: 'How Product-\nLed Teams\nShip a Plan' },
    subline: {
      label: 'Subline',
      value: 'Where strategy aligns the team and\nexecution earns the results.',
    },
    button: { label: 'Button', value: 'GET STARTED' },
  },
} as const satisfies ThemeSpec;

const planCover = themed(W, H, coverSpec, (t) => [
  inkBackground(t.color('background')),
  brandLine(t.copy('brand'), 80, 160, t.color('text'), t.font('heading')),
  text(t.copy('headline'), 80, 380, 920, {
    fontFamily: t.font('heading'),
    fontSize: 104,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.1,
  }),
  text(t.copy('subline'), 80, 770, 900, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.color('primary'),
    lineHeight: 1.4,
  }),
  rect(80, 1080, 340, 92, glow(t.color('primary'), t.shade('primary', COBALT.deepBlue)), {
    cornerRadius: 46,
    name: 'Button',
  }),
  text(t.copy('button'), 80, 1106, 340, {
    fontFamily: t.font('heading'),
    fontSize: 34,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
    letterSpacing: 2,
  }),
  [0, 1, 2].map((index) => circle(812 + index * 30, 1126, 9, t.color('text'))),
  icon('arrow-right', 900, 1080, 92, t.color('text'), { strokeWidth: 2.8 }),
]);

const glowCard = (name: DesignIconName, title: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: COBALT.ink, hint: 'Page and the icon' },
        primary: {
          value: COBALT.sky,
          hint: 'Top of the card gradients; its deeper shade is the bottom of the cards',
        },
        text: {
          value: COBALT.white,
          hint: 'Icon circle, the title, the body and the website',
        },
      },
      fonts: { heading: HEADING_FONT, body: BODY_FONT },
      copy: {
        title: { label: 'Title', value: title },
        body: { label: 'Body', value: body },
        site: SITE,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const fill = glow(t.color('primary'), t.shade('primary', COBALT.deepBlue));
      return [
        inkBackground(t.color('background')),
        rect(0, 420, 56, 480, fill, { cornerRadius: 22, name: 'Side card' }),
        rect(1024, 420, 56, 480, fill, { cornerRadius: 22, name: 'Side card' }),
        rect(130, 300, 820, 760, fill, { cornerRadius: 56, name: 'Card' }),
        circle(540, 300, 76, t.color('text')),
        icon(name, 502, 262, 76, t.color('background'), { strokeWidth: 2.2 }),
        text(t.copy('title'), 170, 420, 740, {
          fontFamily: t.font('heading'),
          fontSize: 64,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.12,
        }),
        text(t.copy('body'), 190, 690, 700, {
          fontFamily: t.font('body'),
          fontSize: 38,
          fontWeight: 500,
          fill: t.color('text'),
          align: 'center',
          lineHeight: 1.5,
        }),
        text(t.copy('site'), 0, 1150, W, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 600,
          fill: t.color('text'),
          align: 'center',
        }),
      ];
    },
  );

export const PLAN_SERIES: readonly Template[] = [
  planCover,
  glowCard(
    'search',
    'Spot the Problems,\nDefine Outcomes,\nThen Prioritise',
    'Name the issues users face, decide what success looks like and dig into research before you build.',
  ),
  glowCard(
    'message-square',
    'Listen to\nCustomers and\nthe Market',
    'Every product call affects real people. Put them at the centre by talking to them early and often.',
  ),
  glowCard(
    'building-2',
    'Know the Company\nand the Product\nVision',
    'Your mission and long term vision shape every decision. Keep them visible in each planning session.',
  ),
  glowCard(
    'map',
    'Build a Roadmap\nEveryone Can\nRead',
    'Share one simple plan so design, sales and engineering pull in the same direction.',
  ),
];
