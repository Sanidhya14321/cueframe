import { linear } from '@/design';
import {
  avatar,
  circle,
  group,
  icon,
  photo,
  rating,
  rect,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, backdrop, CLAY, H, HEADING, SCRIPT, W } from './clay';

const reviewSpec = {
  colors: {
    primary: {
      value: CLAY.brand,
      hint: 'Page gradient, #review on the side tag and the stars; its lighter shade colors the top of the page',
    },
    surface: {
      value: CLAY.paper,
      hint: 'Review card, side tag and the big REVIEW letters',
    },
    text: {
      value: CLAY.ink,
      hint: 'Reviewer name; its shades color the role, the quote and the card shadow',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    word: { label: 'Big word line', value: ['rev', 'iew'] },
    tag: { label: 'Side tag', value: '#review' },
    name: { label: 'Reviewer', value: 'Daniel Okafor' },
    role: { label: 'Reviewer role', value: 'Head of Growth, Brightmill' },
    quote: {
      label: 'Quote',
      value:
        'Our pipeline doubled in one quarter. They listened first, then built a plan that fit our brand.',
    },
  },
} as const satisfies ThemeSpec;

export const reviewWords = themed(W, H, reviewSpec, (t) => {
  const heading = t.font('heading');
  const [first = '', second = ''] = t.list('word');
  const bigWord = t.shade('surface', 'rgba(255,255,255,0.92)');
  return [
    rect(0, 0, W, H, linear(160, t.shade('primary', '#e48a6a'), t.color('primary')), {
      name: 'Background',
    }),
    text(first, 40, 10, 1000, {
      fontFamily: heading,
      fontSize: 400,
      fontWeight: 800,
      fill: bigWord,
      lineHeight: 1,
      letterSpacing: -16,
    }),
    text(second, 300, 900, 760, {
      fontFamily: heading,
      fontSize: 400,
      fontWeight: 800,
      fill: bigWord,
      lineHeight: 1,
      letterSpacing: -16,
    }),
    group(
      rect(930, 80, 90, 360, t.color('surface'), { cornerRadius: 45, name: 'Tag' }),
      text(t.copy('tag'), 954, 410, 320, {
        fontFamily: heading,
        fontSize: 40,
        fontWeight: 700,
        fill: t.color('primary'),
        rotation: -90,
      }),
    ),
    group(
      rect(110, 500, 860, 360, t.color('surface'), {
        cornerRadius: 32,
        name: 'Review card',
        ...shadow(40, 18, t.shade('text', 'rgba(74,31,23,0.3)')),
      }),
      avatar('man-portrait-3', 200, 590, 50),
      text(t.copy('name'), 275, 552, 400, {
        fontFamily: heading,
        fontSize: 34,
        fontWeight: 700,
        fill: t.color('text'),
      }),
      text(t.copy('role'), 275, 598, 420, {
        fontFamily: t.font('body'),
        fontSize: 24,
        fontWeight: 500,
        fill: t.shade('text', '#7a5a50'),
      }),
      rating(730, 566, 34, 5, t.color('primary'), 0.2),
      text(t.copy('quote'), 160, 680, 760, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 500,
        fill: t.shade('text', '#3d2a24'),
        lineHeight: 1.4,
      }),
    ),
  ];
});

const portraitSpec = {
  colors: {
    background: {
      value: CLAY.light,
      hint: 'Top of the page gradient; its deeper shade colors the bottom',
    },
    primary: {
      value: CLAY.deep,
      hint: 'Vertical market word, the plan card and the contact icons',
    },
    accent: { value: CLAY.brand, hint: 'Solutions card' },
    surface: { value: CLAY.paper, hint: 'Text on both cards' },
    text: { value: CLAY.ink, hint: 'Phone and address lines' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    word: { label: 'Vertical word', value: 'market' },
    plan: { label: 'Plan card', value: 'A Plan\nThat Keeps\nYou Moving' },
    solutions: { label: 'Solutions card', value: 'Solut\nions' },
    contacts: {
      label: 'Contact',
      value: ['Call us\n(555) 014-2290', 'Visit us\n48 Harbor Lane'],
    },
  },
} as const satisfies ThemeSpec;

export const marketPortrait = themed(W, H, portraitSpec, (t) => {
  const heading = t.font('heading');
  const [call = '', visit = ''] = t.list('contacts');
  const contact = (label: string, x: number, width: number) =>
    text(label, x, 1124, width, {
      fontFamily: t.font('body'),
      fontSize: 24,
      fontWeight: 600,
      fill: t.color('text'),
      lineHeight: 1.3,
    });
  return [
    backdrop(t.color('background'), t.shade('background', CLAY.soft)),
    text(t.copy('word'), 70, 1240, 1100, {
      fontFamily: heading,
      fontSize: 230,
      fontWeight: 800,
      fill: t.color('primary'),
      rotation: -90,
      lineHeight: 1,
      letterSpacing: -6,
    }),
    photo('woman-portrait-5', 330, 110, 470, 960, { cornerRadius: 40 }),
    group(
      rect(700, 230, 320, 280, t.color('primary'), { cornerRadius: 28, name: 'Strategy card' }),
      text(t.copy('plan'), 740, 300, 260, {
        fontFamily: heading,
        fontSize: 42,
        fontWeight: 700,
        fill: t.color('surface'),
        lineHeight: 1.1,
      }),
    ),
    group(
      rect(700, 560, 320, 260, t.color('accent'), { cornerRadius: 28, name: 'Solutions card' }),
      text(t.copy('solutions'), 740, 600, 260, {
        fontFamily: heading,
        fontSize: 84,
        fontWeight: 800,
        fill: t.color('surface'),
        lineHeight: 1,
      }),
    ),
    icon('phone', 330, 1130, 44, t.color('primary')),
    contact(call, 390, 300),
    icon('map-pin', 700, 1130, 44, t.color('primary')),
    contact(visit, 760, 280),
  ];
});

const doorSpec = {
  colors: {
    background: {
      value: '#6b2e22',
      hint: 'Door behind the hanger; its darker shades color the bottom of the door, the door edge and the hanger hole',
    },
    surface: {
      value: '#f7d9c7',
      hint: 'Door hanger card; its shades color the bottom of the card, the door seam and the button label',
    },
    secondary: {
      value: '#e9e2dc',
      hint: 'Door handle lever; its shades color the lever bottom and the knob',
    },
    primary: { value: CLAY.deep, hint: 'Online and the Save your seat button' },
    accent: { value: CLAY.brand, hint: 'Webinar' },
    text: { value: CLAY.ink, hint: 'Webinar topic; its lighter shade colors the date' },
  },
  fonts: { script: SCRIPT, heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Online' },
    title: { label: 'Title', value: 'Webinar' },
    topic: { label: 'Topic', value: 'Growth Basics 101' },
    date: { label: 'Date', value: 'Thursday, May 22\nat 7 PM CET' },
    cta: { label: 'Button', value: 'Save your seat' },
  },
} as const satisfies ThemeSpec;

export const doorHanger = themed(W, H, doorSpec, (t) => {
  const heading = t.font('heading');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', CLAY.deep)), {
      name: 'Background',
    }),
    rect(
      0,
      0,
      250,
      H,
      linear(90, t.shade('background', '#3a170f'), t.shade('background', '#5a261b')),
      { name: 'Door edge' },
    ),
    rect(240, 0, 12, H, t.shade('surface', 'rgba(255,255,255,0.08)'), { name: 'Door seam' }),
    group(
      rect(310, 110, 460, 1120, linear(180, t.color('surface'), t.shade('surface', CLAY.soft)), {
        cornerRadius: 60,
        name: 'Door hanger',
        ...shadow(50, 24, 'rgba(0,0,0,0.4)'),
      }),
      circle(540, 290, 92, t.shade('background', '#5f281d'), { name: 'Hanger hole' }),
      rect(140, 270, 480, 40, linear(180, t.color('secondary'), t.shade('secondary', '#9c928b')), {
        cornerRadius: 20,
        name: 'Handle lever',
        ...shadow(20, 8, 'rgba(0,0,0,0.35)'),
      }),
      circle(
        540,
        290,
        44,
        linear(180, t.shade('secondary', '#f1ebe6'), t.shade('secondary', '#8f857e')),
        { name: 'Handle knob' },
      ),
      text(t.copy('kicker'), 310, 450, 460, {
        fontFamily: t.font('script'),
        fontSize: 92,
        fontWeight: 700,
        fill: t.color('primary'),
        align: 'center',
      }),
      text(t.copy('title'), 310, 556, 460, {
        fontFamily: heading,
        fontSize: 72,
        fontWeight: 800,
        fill: t.color('accent'),
        align: 'center',
      }),
      text(t.copy('topic'), 310, 680, 460, {
        fontFamily: heading,
        fontSize: 36,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('date'), 310, 742, 460, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 500,
        fill: t.shade('text', '#5b3a31'),
        align: 'center',
        lineHeight: 1.35,
      }),
      rect(390, 900, 300, 76, t.color('primary'), { cornerRadius: 38, name: 'Join button' }),
      text(t.copy('cta'), 390, 920, 300, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 700,
        fill: t.shade('surface', CLAY.paper),
        align: 'center',
      }),
    ),
  ];
});
