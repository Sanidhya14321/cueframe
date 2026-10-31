import { rect, type ThemeSpec, themed } from '../../../kit';
import { BODY, backdrop, fade, fonts, HEADING, K, SH, SW } from './theme';

const PRICE_WIDTHS = ['$0', '$12', '$29'].map((price) => price.length * 58);

export const pricingSlide = themed(
  SW,
  SH,
  {
    colors: {
      background: {
        value: K.black,
        hint: 'Page, Most popular, the Scale button and the text on the Scale card and Pro button; its grey shade colors the Scale plan details',
      },
      surface: {
        value: K.panel,
        hint: 'Starter and Pro cards; its lighter shade colors the Start free button',
      },
      primary: {
        value: K.lime,
        hint: 'Most popular frame, the Pro button and the green wash',
      },
      text: {
        value: K.white,
        hint: 'Pricing, the Scale card, the Talk to sales label, the text on the Starter and Pro cards and their outlines; its grey shade colors their plan details',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      title: { label: 'Title', value: 'Pricing' },
      badge: { label: 'Badge', value: 'Most popular' },
      names: { label: 'Plan', value: ['Starter', 'Pro', 'Scale'] },
      details: {
        label: 'Plan details',
        value: [
          'Try the core agent with\nstarter monthly credits.',
          'Unlimited workflows, faster\nruns and priority support.',
          'Team seats, custom models\nand admin controls.',
        ],
      },
      prices: { label: 'Price', value: ['$0', '$12', '$29'] },
      period: { label: 'Billing period', value: '/month' },
      ctas: { label: 'Button', value: ['Start free', 'Upgrade now', 'Talk to sales'] },
    },
  } as const satisfies ThemeSpec,
  (t) => {
    const { head, body } = fonts(t);
    const muted = t.shade('text', K.muted);
    const looks = [
      {
        card: t.color('surface'),
        ink: t.color('text'),
        soft: muted,
        button: t.shade('surface', K.panelSoft),
        label: t.color('text'),
        stroke: 2,
      },
      {
        card: t.color('surface'),
        ink: t.color('text'),
        soft: muted,
        button: t.color('primary'),
        label: t.color('background'),
        stroke: 2,
      },
      {
        card: t.color('text'),
        ink: t.color('background'),
        soft: t.shade('background', K.dim),
        button: t.color('background'),
        label: t.color('text'),
        stroke: 0,
      },
    ];
    const details = t.list('details');
    const prices = t.list('prices');
    const ctas = t.list('ctas');
    return [
      backdrop(t),
      head(t.copy('title'), 0, 30, SW, 300, fade(t, 'rgba(255,255,255,0.45)'), {
        align: 'center',
      }),
      rect(694, 284, 532, 682, t.color('primary'), { name: 'Popular frame', cornerRadius: 34 }),
      body(t.copy('badge'), 700, 300, 520, 30, t.color('background'), {
        align: 'center',
        fontWeight: 700,
      }),
      t.list('names').map((name, index) => {
        const x = 160 + index * 540;
        const look = looks[index] ?? looks[0];
        if (look === undefined) {
          return [];
        }
        return [
          rect(x, 360, 520, 600, look.card, {
            name: 'Tier card',
            cornerRadius: 28,
            stroke: look.stroke > 0 ? t.shade('text', K.line) : K.line,
            strokeWidth: look.stroke,
          }),
          head(name, x + 40, 400, 440, 44, look.ink),
          body(details[index] ?? '', x + 40, 470, 440, 28, look.soft),
          head(prices[index] ?? '', x + 40, 610, 200, 96, look.ink),
          body(t.copy('period'), x + 60 + (PRICE_WIDTHS[index] ?? 0), 662, 200, 30, look.soft),
          rect(x + 40, 840, 440, 80, look.button, { name: 'Tier button', cornerRadius: 40 }),
          body(ctas[index] ?? '', x + 40, 860, 440, 28, look.label, {
            align: 'center',
            fontWeight: 700,
          }),
        ];
      }),
    ];
  },
);
