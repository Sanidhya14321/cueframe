import type { DesignIconName } from '@/design';
import { circle, icon, rect, type Template, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  BRAND,
  bodyText,
  brandMark,
  H,
  HEAD,
  LEAF,
  leafBackground,
  titleLine,
  W,
} from './palette';

const LINE_Y = 300;
const LINE = 'rgba(209,250,229,0.7)';

const coverSpec = {
  colors: {
    background: {
      value: LEAF.top,
      hint: 'Backdrop gradient; its darker shade is the bottom of the gradient',
    },
    primary: {
      value: LEAF.mint,
      hint: 'Lasting Trust headline; its pale tints color the divider line and the faint backdrop swoosh',
    },
    text: {
      value: LEAF.white,
      hint: 'How to Build line, the earn it prompt and its arrow, the closing lines and the brand name',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    prompt: { label: 'Prompt', value: "Here's how to earn it" },
    title: { label: 'Title', value: 'How to Build' },
    highlight: { label: 'Highlight', value: 'Lasting Trust\nWith Readers' },
    body: { label: 'Closing line', value: 'Because attention fades,\nbut trust compounds.' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const trustCover = themed(W, H, coverSpec, (t) => [
  leafBackground(t),
  text(t.copy('prompt'), 300, 218, 630, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'right',
  }),
  icon('arrow-right', 944, 218, 52, t.color('text'), { strokeWidth: 2.6 }),
  rect(0, LINE_Y - 2, W, 4, t.shade('primary', LINE), { name: 'Line' }),
  titleLine(t.copy('title'), t.font('heading'), 90, 420, 88, t.color('text')),
  titleLine(t.copy('highlight'), t.font('heading'), 90, 521, 88, t.color('primary')),
  bodyText(t.copy('body'), t.font('body'), t.color('text'), 90, 800, 800),
  brandMark(t.copy('brand'), t.font('heading'), t.color('text'), 90, 1170),
]);

const cardSpec = (lead: string, accent: string, body: string) =>
  ({
    colors: {
      background: {
        value: LEAF.top,
        hint: 'Backdrop gradient; its darker shade is the bottom of the gradient and its mid shade colors the badge icon',
      },
      primary: {
        value: LEAF.mint,
        hint: 'Second headline line; its pale tints color the divider line, the card border and the faint backdrop swoosh',
      },
      surface: {
        value: LEAF.white,
        hint: 'Icon badge circle; its faint tint fills the card panel',
      },
      text: { value: LEAF.white, hint: 'First headline line and the description' },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      lead: { label: 'Headline', value: lead },
      highlight: { label: 'Highlight', value: accent },
      body: { label: 'Description', value: body },
    },
  }) as const satisfies ThemeSpec;

const trustCard = (name: DesignIconName, lead: string, accent: string, body: string) =>
  themed(W, H, cardSpec(lead, accent, body), (t) => [
    leafBackground(t),
    rect(0, LINE_Y - 2, W, 4, t.shade('primary', LINE), { name: 'Line' }),
    rect(150, 440, 780, 720, t.shade('surface', 'rgba(255,255,255,0.04)'), {
      cornerRadius: 40,
      stroke: t.shade('primary', 'rgba(209,250,229,0.75)'),
      strokeWidth: 4,
      name: 'Panel',
    }),
    circle(540, LINE_Y, 72, t.color('surface')),
    icon(name, 505, LINE_Y - 35, 70, t.shade('background', LEAF.mid), { strokeWidth: 2 }),
    text(t.copy('lead'), 150, 560, 780, {
      fontFamily: t.font('heading'),
      fontSize: 66,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('highlight'), 150, 645, 780, {
      fontFamily: t.font('heading'),
      fontSize: 66,
      fontWeight: 700,
      fill: t.color('primary'),
      align: 'center',
    }),
    bodyText(t.copy('body'), t.font('body'), t.color('text'), 210, 790, 660, 'center'),
  ]);

export const TRUST_SERIES: readonly Template[] = [
  trustCover,
  trustCard(
    'calendar-days',
    'Show Up Often,',
    'Not Loudly',
    'Trust grows when your tone, timing and values stay steady. Consistency beats volume.',
  ),
  trustCard(
    'send',
    'Share the',
    'Real Process',
    'Show the drafts, the lessons and the misses. Honesty turns content into connection.',
  ),
  trustCard(
    'lightbulb',
    'Teach First,',
    'Sell Second',
    'When you teach, people lean in. Pitch too early and they scroll right past.',
  ),
  trustCard(
    'badge-check',
    'Prove It',
    'With Results',
    'Back every claim with numbers, client stories and examples people can check.',
  ),
];
