import { type DesignIconName, linear } from '@/design';
import {
  circle,
  ellipse,
  group,
  icon,
  line,
  POST_SIZE,
  photo,
  pill,
  rect,
  rotateNodes,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, bat, COND, CRYPT, SPOOKY } from './palette';

const { width: W, height: H } = POST_SIZE;

const SERVICES: readonly (readonly [string, DesignIconName])[] = [
  ['Branding', 'sparkles'],
  ['Website', 'globe'],
  ['Interface', 'mouse'],
  ['Illustration', 'pen-tool'],
  ['Animation', 'zap'],
];

const servicesSpec = {
  colors: {
    background: { value: CRYPT.mustard, hint: 'Page and the icons on the dark tags' },
    text: {
      value: CRYPT.ink,
      hint: 'Spiders, WHAT WE CONJURE, the dark tags and the icons and labels on the light tags',
    },
    surface: { value: CRYPT.bone, hint: 'Light tags and the labels on the dark tags' },
  },
  fonts: { heading: COND, body: BODY },
  copy: {
    title: { label: 'Title', value: 'WHAT WE CONJURE' },
    services: { label: 'Service', value: SERVICES.map(([label]) => label) },
  },
} as const satisfies ThemeSpec;

const spider = (t: Theme<typeof servicesSpec>, x: number, length: number) => [
  line(x, 0, length, t.color('text'), 3, { rotation: 90, name: 'Thread' }),
  circle(x, length + 16, 18, t.color('text')),
  line(x - 34, length + 4, 68, t.color('text'), 4, { name: 'Legs' }),
  line(x - 30, length + 26, 60, t.color('text'), 4, { name: 'Legs' }),
];

export const servicesTags = themed(W, H, servicesSpec, (t) => {
  const labels = t.list('services');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    spider(t, 180, 120),
    spider(t, 900, 220),
    text(t.copy('title'), 0, 110, W, {
      fontFamily: t.font('heading'),
      fontSize: 64,
      fontWeight: 400,
      fill: t.color('text'),
      align: 'center',
      letterSpacing: 8,
    }),
    SERVICES.map(([name, glyph], index) => {
      const dark = index % 2 === 0;
      const x = index % 2 === 0 ? 150 : 330;
      const y = 300 + index * 180;
      return rotateNodes(index % 2 === 0 ? -6 : 5, x + 300, y + 60, [
        rect(x, y, 600, 120, dark ? t.color('text') : t.color('surface'), {
          cornerRadius: 60,
          name: `${name} tag`,
        }),
        icon(glyph, x + 50, y + 30, 60, dark ? t.color('background') : t.color('text'), {
          strokeWidth: 2.4,
        }),
        text(labels[index] ?? '', x + 140, y + 26, 440, {
          fontFamily: t.font('body'),
          fontSize: 54,
          fontWeight: 700,
          fill: dark ? t.color('surface') : t.color('text'),
        }),
      ]);
    }),
  ];
});

const frightSpec = {
  colors: {
    background: { value: CRYPT.blood, hint: 'Blood red page gradient' },
    secondary: { value: CRYPT.ink, hint: 'Pumpkin silhouette, its stem and the bats' },
    accent: { value: CRYPT.mustard, hint: 'FRIGHT NIGHT title' },
    text: { value: CRYPT.bone, hint: 'Date, invitation line and the details' },
  },
  fonts: { spooky: SPOOKY, heading: COND, body: BODY },
  copy: {
    date: { label: 'Date', value: 'OCTOBER 31, 2027' },
    title: { label: 'Title', value: 'FRIGHT\nNIGHT' },
    invite: { label: 'Invitation', value: 'JOIN US FOR GAMES, CANDY & PRIZES' },
    details: { label: 'Details', value: 'Doors open at 7 PM  ·  Hollow Hall' },
  },
} as const satisfies ThemeSpec;

export const frightNight = themed(W, H, frightSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', CRYPT.wine)), {
    name: 'Background',
  }),
  text(t.copy('date'), 0, 80, W, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'center',
    letterSpacing: 6,
  }),
  bat(90, 200, 160, t.color('secondary')),
  bat(820, 170, 130, t.color('secondary')),
  bat(240, 300, 80, t.color('secondary')),
  rect(510, 230, 60, 120, t.color('secondary'), { cornerRadius: 14, rotation: 12, name: 'Stem' }),
  ellipse(150, 330, 400, 660, t.color('secondary'), { name: 'Pumpkin' }),
  ellipse(530, 330, 400, 660, t.color('secondary'), { name: 'Pumpkin' }),
  ellipse(320, 310, 440, 700, t.color('secondary'), { name: 'Pumpkin' }),
  text(t.copy('title'), 150, 470, 780, {
    fontFamily: t.font('spooky'),
    fontSize: 170,
    fontWeight: 400,
    fill: t.color('accent'),
    align: 'center',
    lineHeight: 1,
  }),
  text(t.copy('invite'), 0, 1110, W, {
    fontFamily: t.font('heading'),
    fontSize: 54,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    letterSpacing: 4,
  }),
  text(t.copy('details'), 0, 1200, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
  }),
]);

const TASKS = [
  ['Define your target audience', true],
  ['Plan a spooky offer', true],
  ['Refresh your landing page', false],
  ['Schedule October posts', true],
  ['Track campaign results', false],
] as const;

const checklistSpec = {
  colors: {
    background: {
      value: CRYPT.mustard,
      hint: 'Page gradient, the checklist title and the knobs of done toggles',
    },
    surface: {
      value: CRYPT.bone,
      hint: 'Checklist card; its shades color the open toggles and their knobs',
    },
    text: {
      value: CRYPT.ink,
      hint: 'Bat, card header, tasks, done toggles and the footer line',
    },
  },
  fonts: { heading: COND, body: BODY },
  copy: {
    title: { label: 'Title', value: 'OCTOBER CHECKLIST' },
    tasks: { label: 'Task', value: TASKS.map(([task]) => task) },
    footer: { label: 'Footer', value: 'Save this for your Q4 plan' },
  },
} as const satisfies ThemeSpec;

export const octoberChecklist = themed(W, H, checklistSpec, (t) => {
  const tasks = t.list('tasks');
  return [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', CRYPT.amber)), {
      name: 'Background',
    }),
    bat(820, 90, 140, t.color('text')),
    rect(130, 220, 820, 860, t.color('surface'), { cornerRadius: 36, name: 'Card' }),
    rect(130, 220, 820, 150, t.color('text'), { cornerRadius: 36, name: 'Card header' }),
    rect(130, 330, 820, 40, t.color('text'), { name: 'Card header edge' }),
    text(t.copy('title'), 130, 258, 820, {
      fontFamily: t.font('heading'),
      fontSize: 76,
      fontWeight: 400,
      fill: t.color('background'),
      align: 'center',
      letterSpacing: 4,
    }),
    TASKS.map(([, done], index) => {
      const y = 430 + index * 126;
      return group(
        text(tasks[index] ?? '', 190, y + 8, 560, {
          fontFamily: t.font('body'),
          fontSize: 36,
          fontWeight: 600,
          fill: t.color('text'),
        }),
        rect(770, y, 120, 64, done ? t.color('text') : t.shade('surface', '#cfc6b2'), {
          cornerRadius: 32,
          name: 'Toggle',
        }),
        circle(
          done ? 858 : 802,
          y + 32,
          24,
          done ? t.color('background') : t.shade('surface', '#ffffff'),
        ),
      );
    }),
    text(t.copy('footer'), 0, 1150, W, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 700,
      fill: t.color('text'),
      align: 'center',
    }),
  ];
});

const dealSpec = {
  colors: {
    background: { value: CRYPT.night, hint: 'Page and the fade over the pumpkin photo' },
    accent: { value: CRYPT.mustard, hint: 'TAKE AN EXTRA kicker' },
    text: { value: CRYPT.bone, hint: 'Discount, the offer line and the button label' },
    primary: { value: CRYPT.blood, hint: 'Claim button' },
  },
  fonts: { heading: COND, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'TAKE AN EXTRA' },
    discount: { label: 'Discount', value: '15% OFF' },
    offer: { label: 'Offer', value: 'Every brand package booked this October' },
    button: { label: 'Button', value: 'CLAIM THE OFFER' },
  },
} as const satisfies ThemeSpec;

export const spookyDeal = themed(W, H, dealSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('pumpkins', 0, 700, W, 650, { name: 'Pumpkins' }),
  rect(
    0,
    690,
    W,
    260,
    linear(180, t.color('background'), t.shade('background', 'rgba(12,35,40,0)')),
    { name: 'Fade' },
  ),
  text(t.copy('kicker'), 0, 110, W, {
    fontFamily: t.font('heading'),
    fontSize: 60,
    fontWeight: 400,
    fill: t.color('accent'),
    align: 'center',
    letterSpacing: 12,
  }),
  text(t.copy('discount'), 0, 170, W, {
    fontFamily: t.font('heading'),
    fontSize: 300,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
  }),
  text(t.copy('offer'), 0, 500, W, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
  }),
  pill(t.copy('button'), 360, 590, {
    width: 360,
    fill: t.color('primary'),
    color: t.color('text'),
    fontSize: 36,
    fontFamily: t.font('heading'),
    fontWeight: 400,
    letterSpacing: 4,
  }),
]);
