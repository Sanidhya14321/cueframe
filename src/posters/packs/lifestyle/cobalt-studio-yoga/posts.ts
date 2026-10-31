import { linear } from '@/design';
import {
  icon,
  line,
  POST_SIZE,
  photo,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, BRAND, CO, centeredMark, HEADING } from './palette';

const { width: W, height: H } = POST_SIZE;

const breatheSpec = {
  colors: {
    background: {
      value: CO.ink,
      hint: 'Page behind the photo and the dark fade at the bottom',
    },
    primary: { value: CO.deep, hint: 'Blue tint over the photo' },
    text: { value: CO.white, hint: 'Studio name, stop & breathe and the brand mark' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    studio: { label: 'Studio name', value: 'Driftwood\nYoga Studio' },
    title: { label: 'Title', value: 'stop &\nbreathe' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const stopBreathe = themed(W, H, breatheSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('yoga-2', 0, 0, W, H, { name: 'Backdrop' }),
  rect(0, 0, W, H, t.shade('primary', 'rgba(26,43,184,0.4)'), { name: 'Cobalt tint' }),
  rect(
    0,
    800,
    W,
    550,
    linear(
      180,
      t.shade('background', 'rgba(13,15,26,0)'),
      t.shade('background', 'rgba(13,15,26,0.7)'),
    ),
    { name: 'Fade' },
  ),
  text(t.copy('studio'), 0, 180, W, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.15,
  }),
  text(t.copy('title'), 0, 400, W, {
    fontFamily: t.font('heading'),
    fontSize: 190,
    fontWeight: 800,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 0.95,
    letterSpacing: -6,
  }),
  centeredMark(540, 1220, t.color('text'), t.copy('brand'), t.font('heading')),
]);

const flowSpec = {
  colors: {
    background: { value: CO.paper, hint: 'Page' },
    primary: { value: CO.cobalt, hint: "Repeated LET'S FLOW lines behind the photo" },
    text: { value: CO.ink, hint: 'Brand mark and the message at the bottom' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    brand: BRAND,
    title: { label: 'Repeated title', value: "LET'S FLOW" },
    body: {
      label: 'Message',
      value: 'Take a moment to move your body,\nbreathe deeply and reset.',
    },
  },
} as const satisfies ThemeSpec;

export const letsFlow = themed(W, H, flowSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  centeredMark(540, 60, t.color('text'), t.copy('brand'), t.font('heading')),
  Array.from({ length: 6 }, (_, index) =>
    text(t.copy('title'), 0, 160 + index * 150, W, {
      fontFamily: t.font('heading'),
      fontSize: 150,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1,
      letterSpacing: -4,
    }),
  ),
  photo('woman-portrait-3', 380, 150, 320, 930, { cornerRadius: 160 }),
  text(t.copy('body'), 0, 1150, W, {
    fontFamily: t.font('body'),
    fontSize: 36,
    fontWeight: 500,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.35,
  }),
]);

const reminderSpec = {
  colors: {
    background: { value: CO.ink, hint: 'Page behind the photo and the dim over it' },
    surface: {
      value: CO.white,
      hint: 'Reminder card and the brand mark; its grey tint colors the card dividers',
    },
    primary: { value: CO.cobalt, hint: 'Got it! button label' },
    text: {
      value: CO.ink,
      hint: 'Daily Reminder title; its grey shade colors the message and Dismiss',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Daily Reminder' },
    message: {
      label: 'Message',
      value: 'Pause today to move gently, breathe\nslowly and notice how your body feels.',
    },
    dismiss: { label: 'Left button', value: 'Dismiss' },
    confirm: { label: 'Right button', value: 'Got it!' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const dailyReminder = themed(W, H, reminderSpec, (t) => {
  const divider = t.shade('surface', '#e3e5ee');
  const grey = t.shade('text', CO.grey);
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('yoga-1', 0, 0, W, H, { name: 'Backdrop' }),
    rect(0, 0, W, H, t.shade('background', 'rgba(13,15,26,0.35)'), { name: 'Dim' }),
    rect(170, 500, 740, 360, t.color('surface'), {
      cornerRadius: 32,
      name: 'Reminder card',
      ...shadow(40, 18, 'rgba(0,0,0,0.35)'),
    }),
    text(t.copy('title'), 170, 545, 740, {
      fontFamily: t.font('heading'),
      fontSize: 44,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    text(t.copy('message'), 210, 620, 660, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 500,
      fill: grey,
      align: 'center',
      lineHeight: 1.4,
    }),
    line(170, 760, 740, divider, 2),
    line(540, 760, 100, divider, 2, { rotation: 90 }),
    text(t.copy('dismiss'), 170, 788, 370, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 600,
      fill: grey,
      align: 'center',
    }),
    text(t.copy('confirm'), 540, 788, 370, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 800,
      fill: t.color('primary'),
      align: 'center',
    }),
    centeredMark(540, 1220, t.color('surface'), t.copy('brand'), t.font('heading')),
  ];
});

const verticalSpec = {
  colors: {
    background: { value: CO.ink, hint: 'Page and the fade over the photo edge' },
    accent: { value: CO.lilac, hint: 'Stacked YOGA letters and the flower icon' },
    text: { value: CO.white, hint: 'Tagline and the rotated brand name' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Stacked title', value: 'Y\nO\nG\nA' },
    tagline: {
      label: 'Tagline',
      value: 'Build strength,\nbalance and focus\none breath at a time',
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const yogaVertical = themed(W, H, verticalSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  photo('yoga-1', 380, 0, 700, H, { name: 'Pose' }),
  rect(
    380,
    0,
    360,
    H,
    linear(90, t.color('background'), t.shade('background', 'rgba(13,15,26,0)')),
    {
      name: 'Fade',
    },
  ),
  text(t.copy('title'), 60, 70, 360, {
    fontFamily: t.font('heading'),
    fontSize: 260,
    fontWeight: 800,
    fill: t.color('accent'),
    lineHeight: 0.98,
  }),
  text(t.copy('tagline'), 560, 90, 460, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 600,
    fill: t.color('text'),
    align: 'right',
    lineHeight: 1.35,
  }),
  text(t.copy('brand'), 950, 1230, 600, {
    fontFamily: t.font('heading'),
    fontSize: 72,
    fontWeight: 800,
    fill: t.color('text'),
    rotation: -90,
  }),
  icon('flower-2', 958, 1250, 66, t.color('accent'), { strokeWidth: 2 }),
]);

const eatSpec = {
  colors: {
    background: { value: CO.cobalt, hint: 'Page gradient; its darker shade ends it' },
    text: { value: CO.white, hint: 'Eat Sleep Yoga Repeat and the brand mark' },
  },
  fonts: { heading: HEADING },
  copy: {
    title: { label: 'Title', value: 'Eat\nSleep\nYoga\nRepeat' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const eatSleep = themed(W, H, eatSpec, (t) => [
  rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', CO.deep)), {
    name: 'Background',
  }),
  photo('woman-portrait-4', 660, 140, 420, 1210, { name: 'Portrait' }),
  text(t.copy('title'), 50, 80, 1000, {
    fontFamily: t.font('heading'),
    fontSize: 210,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 0.98,
    letterSpacing: -8,
  }),
  centeredMark(300, 1230, t.color('text'), t.copy('brand'), t.font('heading')),
]);
