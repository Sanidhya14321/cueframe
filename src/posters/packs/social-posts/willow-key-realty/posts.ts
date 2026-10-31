import { linear } from '@/design';
import {
  avatar,
  icon,
  photo,
  pill,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  AGENT,
  BODY,
  contactLine,
  contactRow,
  DISPLAY_FONT,
  footerBar,
  H,
  HEADING,
  KEY,
  SCRIPT_FONT,
  SITE_COPY,
  W,
} from './palette';

const quizSpec = {
  colors: {
    background: {
      value: KEY.cream,
      hint: 'Page, the photo wash, the answer buttons and the text on the tag and footer',
    },
    surface: { value: KEY.mist, hint: 'Quiz card' },
    primary: {
      value: KEY.forest,
      hint: 'Quiz tag, the answer outlines and labels, and the footer bar',
    },
    text: { value: KEY.ink, hint: 'Question; its translucent shade tints the card shadow' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    tag: { label: 'Tag', value: 'True or False?' },
    question: {
      label: 'Question',
      value: 'Waiting for spring always\ngets you a better price\non your first home.',
    },
    answers: { label: 'Answer', value: ['TRUE', 'FALSE'] },
    footer: { label: 'Footer', value: `Have a question? Call us today at ${AGENT.phone}` },
  },
} as const satisfies ThemeSpec;

export const trueFalse = themed(W, H, quizSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('interior-2', 0, 0, W, 1200),
  rect(0, 0, W, 1200, t.shade('background', 'rgba(247,245,239,0.3)'), { name: 'Photo wash' }),
  rect(170, 380, 740, 500, t.shade('surface', 'rgba(228,233,222,0.95)'), {
    cornerRadius: 26,
    name: 'Quiz card',
    ...shadow(40, 16, t.shade('text', 'rgba(31,38,32,0.2)')),
  }),
  rect(340, 340, 400, 84, t.color('primary'), { cornerRadius: 14, name: 'Quiz tag' }),
  text(t.copy('tag'), 340, 357, 400, {
    fontFamily: t.font('heading'),
    fontSize: 42,
    fontWeight: 600,
    italic: true,
    fill: t.color('background'),
    align: 'center',
  }),
  text(t.copy('question'), 210, 480, 660, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.4,
  }),
  t.list('answers').map((answer, index) =>
    pill(answer, 270 + index * 300, 740, {
      fill: t.color('background'),
      color: t.color('primary'),
      stroke: t.color('primary'),
      strokeWidth: 3,
      fontSize: 32,
      fontFamily: t.font('body'),
      width: 240,
      letterSpacing: 6,
    }),
  ),
  footerBar(
    1200,
    150,
    t.copy('footer'),
    t.color('primary'),
    t.color('background'),
    t.font('heading'),
  ),
]);

const listingSpec = {
  colors: {
    background: {
      value: KEY.mist,
      hint: 'Top of the page gradient; its lighter shade is the bottom of the gradient and the contact details on the footer bar',
    },
    primary: { value: KEY.forest, hint: 'NEW and the footer bar' },
    accent: { value: KEY.brass, hint: 'Listing script word' },
    text: { value: KEY.ink, hint: 'Address; its translucent shade is the shadow under Listing' },
  },
  fonts: { display: DISPLAY_FONT, script: SCRIPT_FONT, body: BODY },
  copy: {
    title: { label: 'Title', value: 'NEW' },
    script: { label: 'Script word', value: 'Listing' },
    address: { label: 'Address', value: '48 Alder Lane, Brookfield' },
    contacts: { label: 'Contact', value: [AGENT.name, AGENT.site, AGENT.phone] },
  },
} as const satisfies ThemeSpec;

export const newListing = themed(W, H, listingSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', KEY.cream)), {
    name: 'Background',
  }),
  text(t.copy('title'), 0, 60, W, {
    fontFamily: t.font('display'),
    fontSize: 380,
    fontWeight: 700,
    fill: t.color('primary'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('script'), 0, 250, W, {
    fontFamily: t.font('script'),
    fontSize: 170,
    fontWeight: 400,
    fill: t.color('accent'),
    align: 'center',
    rotation: -6,
    ...shadow(12, 4, t.shade('text', 'rgba(31,38,32,0.25)')),
  }),
  text(t.copy('address'), 0, 560, W, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
  }),
  photo('house-2', 70, 640, 940, 570, { cornerRadius: 20 }),
  rect(0, 1240, W, 110, t.color('primary'), { name: 'Footer bar' }),
  contactRow(t.list('contacts'), 1280, t.shade('background', KEY.cream), t.font('body')),
]);

const openSpec = {
  colors: {
    background: { value: KEY.forest, hint: 'Page and the date on the footer' },
    surface: {
      value: KEY.cream,
      hint: 'Open House, the features, the photo frames and the footer bar',
    },
    accent: { value: KEY.brass, hint: 'Join our and the feature checks' },
    secondary: { value: KEY.mist, hint: 'Description' },
  },
  fonts: { heading: HEADING, script: SCRIPT_FONT, body: BODY },
  copy: {
    intro: { label: 'Intro', value: 'Join our' },
    title: { label: 'Title', value: 'Open\nHouse' },
    description: {
      label: 'Description',
      value: 'Tour the light filled rooms,\nthe garden and the new\nchef kitchen in person.',
    },
    features: {
      label: 'Feature',
      value: ['4 Bedrooms', '2 Stories', '3 Bathrooms', '2,850 Sq Ft'],
    },
    date: { label: 'Date and time', value: 'Saturday, May 18  ·  10AM to 2PM' },
  },
} as const satisfies ThemeSpec;

export const openHouse = themed(W, H, openSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('house-1', 0, 0, W, 560),
  text(t.copy('intro'), 70, 600, 520, {
    fontFamily: t.font('script'),
    fontSize: 84,
    fontWeight: 400,
    fill: t.color('accent'),
  }),
  text(t.copy('title'), 70, 700, 540, {
    fontFamily: t.font('heading'),
    fontSize: 124,
    fontWeight: 500,
    fill: t.color('surface'),
    lineHeight: 1,
  }),
  text(t.copy('description'), 70, 970, 540, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 400,
    fill: t.color('secondary'),
    lineHeight: 1.5,
  }),
  t.list('features').map((feature, index) => [
    icon(
      'circle-check',
      70 + (index % 2) * 270,
      1110 + Math.floor(index / 2) * 52,
      30,
      t.color('accent'),
      { strokeWidth: 2.4 },
    ),
    text(feature, 112 + (index % 2) * 270, 1112 + Math.floor(index / 2) * 52, 220, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 600,
      fill: t.color('surface'),
    }),
  ]),
  (['interior-1', 'interior-2', 'house-2'] as const).map((name, index) =>
    photo(name, 650, 610 + index * 205, 370, 185, { stroke: t.color('surface'), strokeWidth: 8 }),
  ),
  rect(0, 1240, W, 110, t.color('surface'), { name: 'Footer bar' }),
  text(t.copy('date'), 0, 1274, W, {
    fontFamily: t.font('heading'),
    fontSize: 34,
    fontWeight: 600,
    fill: t.color('background'),
    align: 'center',
  }),
]);

const soldSpec = {
  colors: {
    background: {
      value: KEY.sage,
      hint: 'Top of the page gradient; its lighter shade is the bottom of the gradient',
    },
    surface: {
      value: KEY.cream,
      hint: 'Website, the agent panel and the photo ring; its white shade colors JUST',
    },
    primary: { value: KEY.forest, hint: 'Sold, the agent name and the contact details' },
    text: { value: KEY.grey, hint: 'Agent role' },
  },
  fonts: { display: DISPLAY_FONT, script: SCRIPT_FONT, body: BODY },
  copy: {
    site: SITE_COPY,
    title: { label: 'Title', value: 'JUST' },
    script: { label: 'Script word', value: 'Sold' },
    name: { label: 'Agent name', value: AGENT.name },
    role: { label: 'Agent role', value: AGENT.role },
    phone: { label: 'Phone', value: AGENT.phone },
    mail: { label: 'Email', value: AGENT.mail },
  },
} as const satisfies ThemeSpec;

export const justSold = themed(W, H, soldSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', KEY.mist)), {
    name: 'Background',
  }),
  text(t.copy('site'), 0, 60, W, {
    fontFamily: t.font('body'),
    fontSize: 28,
    fontWeight: 500,
    fill: t.color('surface'),
    align: 'center',
    letterSpacing: 2,
  }),
  text(t.copy('title'), 0, 110, W, {
    fontFamily: t.font('display'),
    fontSize: 390,
    fontWeight: 700,
    fill: t.shade('surface', 'rgba(255,255,255,0.92)'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('script'), 0, 270, W, {
    fontFamily: t.font('script'),
    fontSize: 220,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
    rotation: -8,
  }),
  photo('house-1', 60, 540, 960, 540, { cornerRadius: 20 }),
  rect(0, 1130, W, 220, t.color('surface'), { name: 'Agent panel' }),
  avatar('woman-portrait-1', 160, 1130, 90, t.color('surface')),
  text(t.copy('name'), 280, 1160, 360, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 700,
    fill: t.color('primary'),
  }),
  text(t.copy('role'), 280, 1214, 360, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  contactLine('phone', t.copy('phone'), 640, 1166, t.color('primary'), t.font('body')),
  contactLine('mail', t.copy('mail'), 640, 1220, t.color('primary'), t.font('body')),
]);
