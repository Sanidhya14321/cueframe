import {
  avatar,
  circle,
  icon,
  photo,
  pill,
  rating,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  base,
  brandMark,
  H,
  HEADING,
  page,
  type SaasPalette,
  tagCopy,
  W,
} from './posts';

const FEEDBACK_TAG = 'User reviews';

const feedbackSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow'),
      surface: { value: p.paper, hint: 'Review card' },
      secondary: { value: '#111827', hint: 'Reviewer name; its lighter shade colors the review' },
      accent: { value: '#f59e0b', hint: 'Rating stars' },
      text: {
        value: p.paper,
        hint: 'Section tag; its faded shade colors the Feedback watermark and its softer shade the tag outline, rule and brand',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(FEEDBACK_TAG),
      watermark: { label: 'Watermark', value: 'Feedback' },
      name: { label: 'Reviewer', value: 'Lena Ortiz' },
      review: {
        label: 'Review',
        value:
          'Clear, fast and easy to set\nup. Our reports now take\nminutes instead of days.\nA real time saver.',
      },
      brand: BRAND,
    },
  }) as const satisfies ThemeSpec;

export const feedbackWall = (p: SaasPalette) =>
  themed(W, H, feedbackSpec(p), (t) => [
    base(t, p, FEEDBACK_TAG),
    Array.from({ length: 5 }, (_, index) =>
      text(t.copy('watermark'), 40, 170 + index * 230, 1040, {
        fontFamily: t.font('heading'),
        fontSize: 200,
        fontWeight: 700,
        fill: t.shade('text', 'rgba(255,255,255,0.08)'),
        lineHeight: 1,
      }),
    ),
    rect(250, 440, 620, 470, t.color('surface'), {
      cornerRadius: 26,
      name: 'Review card',
      ...shadow(40, 18, 'rgba(0,0,0,0.4)'),
    }),
    avatar('woman-portrait-4', 335, 530, 50),
    text(t.copy('name'), 405, 488, 400, {
      fontFamily: t.font('heading'),
      fontSize: 34,
      fontWeight: 700,
      fill: t.color('secondary'),
    }),
    rating(405, 538, 28, 5, t.color('accent')),
    text(t.copy('review'), 295, 620, 540, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.shade('secondary', '#374151'),
      lineHeight: 1.4,
    }),
    brandMark(t.copy('brand'), 800, 1260, t.shade('text', p.soft), t.font('heading')),
  ]);

const CLIENTS_TAG = 'Client stories';

const clientsSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, the button label and the arrow'),
      primary: { value: p.accent, hint: 'Big number and the Let us talk button' },
      text: {
        value: p.paper,
        hint: 'Section tag, body text and the arrow circle; its softer shade colors the tag outline, rule and brand',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(CLIENTS_TAG),
      count: { label: 'Number', value: '300+' },
      body: { label: 'Body', value: 'happy clients use our\ngrowth services' },
      cta: { label: 'Button', value: 'Let us talk' },
      brand: BRAND,
    },
  }) as const satisfies ThemeSpec;

export const clientsCount = (p: SaasPalette) =>
  themed(W, H, clientsSpec(p), (t) => [
    base(t, p, CLIENTS_TAG),
    text(t.copy('count'), 70, 250, 800, {
      fontFamily: t.font('heading'),
      fontSize: 230,
      fontWeight: 700,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
    text(t.copy('body'), 70, 520, 900, {
      fontFamily: t.font('heading'),
      fontSize: 54,
      fontWeight: 600,
      fill: t.color('text'),
      lineHeight: 1.15,
    }),
    pill(t.copy('cta'), 70, 720, {
      fill: t.color('primary'),
      color: t.shade('background', p.onAccent),
      fontSize: 34,
      fontFamily: t.font('body'),
      fontWeight: 700,
      width: 260,
    }),
    circle(380, 760, 40, t.color('text')),
    icon('arrow-right', 358, 738, 44, t.shade('background', p.onAccent), { strokeWidth: 2.5 }),
    photo('man-portrait-2', 600, 780, 400, 500, { cornerRadius: 30 }),
    brandMark(t.copy('brand'), 80, 1260, t.shade('text', p.soft), t.font('heading')),
  ]);

const LEADS_TAG = 'Growth';

const leadsSpec = (p: SaasPalette) =>
  ({
    colors: {
      background: page(p, 'lighter bottom glow, and the pill label'),
      primary: { value: p.accent, hint: 'That Matter and the customers pill' },
      text: {
        value: p.paper,
        hint: 'Section tag and Build Leads; its softer shade colors the tag outline, rule and brand',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      tag: tagCopy(LEADS_TAG),
      headline: { label: 'Headline', value: 'Build Leads' },
      title: { label: 'Highlighted line', value: 'That Matter' },
      cta: { label: 'Pill', value: 'Join 200+ customers' },
      brand: BRAND,
    },
  }) as const satisfies ThemeSpec;

export const buildLeads = (p: SaasPalette) =>
  themed(W, H, leadsSpec(p), (t) => [
    base(t, p, LEADS_TAG),
    text(t.copy('headline'), 80, 190, 920, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    text(t.copy('title'), 80, 295, 920, {
      fontFamily: t.font('heading'),
      fontSize: 92,
      fontWeight: 700,
      fill: t.color('primary'),
    }),
    photo('meeting-1', 80, 470, 920, 560, { cornerRadius: 28 }),
    pill(t.copy('cta'), 80, 1090, {
      fill: t.color('primary'),
      color: t.shade('background', p.onAccent),
      fontSize: 36,
      fontFamily: t.font('body'),
      fontWeight: 700,
      width: 440,
    }),
    brandMark(t.copy('brand'), 800, 1260, t.shade('text', p.soft), t.font('heading')),
  ]);
