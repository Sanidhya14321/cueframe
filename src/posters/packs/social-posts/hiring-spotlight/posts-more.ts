import { linear } from '@/design';
import { icon, photo, pill, polygon, rect, star, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  DISPLAY,
  GREY,
  HEADING,
  type HiringTheme,
  POST,
  SILVER,
  spotlightBadge,
  verticalHiring,
  weAreHiring,
} from './posts';

const takeTheSeat = (theme: HiringTheme) =>
  themed(
    POST.width,
    POST.height,
    {
      colors: {
        background: { value: theme.ink, hint: "Page and the IT'S word" },
        surface: {
          value: theme.paper,
          hint: "Spotlight beam, armchair, the IT'S label, the TIME word and the Apply today label",
        },
        primary: {
          value: theme.brand,
          hint: 'TIME label, the TO CLAIM THAT SEAT headline and the Apply today button',
        },
        accent: { value: theme.accent, hint: 'Star' },
        text: { value: SILVER, hint: 'Paragraph under the headline' },
      },
      fonts: { display: DISPLAY, body: BODY },
      copy: {
        its: { label: 'First label', value: "IT'S" },
        time: { label: 'Second label', value: 'TIME' },
        title: { label: 'Headline', value: 'TO CLAIM\nTHAT SEAT' },
        body: {
          label: 'Paragraph',
          value:
            'We are looking for curious people who love solving problems for small businesses.',
        },
        cta: { label: 'Button', value: 'Apply today' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, POST.width, POST.height, t.color('background'), { name: 'Background' }),
      polygon(
        3,
        160,
        120,
        640,
        1150,
        linear(
          180,
          t.shade('surface', 'rgba(255,255,255,0.05)'),
          t.shade('surface', 'rgba(255,255,255,0.32)'),
        ),
        { rotation: -14, name: 'Spotlight' },
      ),
      icon('armchair', 300, 860, 300, t.color('surface'), { strokeWidth: 1.4 }),
      rect(560, 120, 200, 70, t.color('surface'), { name: 'Label' }),
      text(t.copy('its'), 575, 128, 180, {
        fontFamily: t.font('display'),
        fontSize: 52,
        fontWeight: 400,
        fill: t.color('background'),
      }),
      rect(560, 200, 260, 90, t.color('primary'), { name: 'Label' }),
      text(t.copy('time'), 575, 205, 240, {
        fontFamily: t.font('display'),
        fontSize: 72,
        fontWeight: 400,
        fill: t.color('surface'),
      }),
      text(t.copy('title'), 560, 300, 460, {
        fontFamily: t.font('display'),
        fontSize: 92,
        fontWeight: 400,
        fill: t.color('primary'),
        lineHeight: 1,
      }),
      text(t.copy('body'), 560, 520, 420, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 400,
        fill: t.color('text'),
        lineHeight: 1.45,
      }),
      star(5, 860, 900, 90, t.color('accent'), { innerRatio: 0.42 }),
      pill(t.copy('cta'), 560, 1150, {
        fill: t.color('primary'),
        color: t.color('surface'),
        fontSize: 32,
        fontFamily: t.font('body'),
      }),
    ],
  );

const welcomePost = (theme: HiringTheme) =>
  themed(
    POST.width,
    POST.height,
    {
      colors: {
        background: { value: theme.brand, hint: 'Page behind the photo' },
        surface: { value: theme.paper, hint: 'WELCOME, the photo frame and the name card' },
        secondary: { value: theme.ink, hint: 'Name on the card' },
        text: { value: GREY, hint: 'Job title on the card' },
        accent: { value: theme.accent, hint: 'Sparkles in the corner' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'WELCOME' },
        name: { label: 'Name', value: 'DANIEL OKAFOR' },
        role: { label: 'Job title', value: 'Head of Customer Success' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, POST.width, POST.height, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 0, 90, POST.width, {
        fontFamily: t.font('heading'),
        fontSize: 120,
        fontWeight: 800,
        fill: t.color('surface'),
        align: 'center',
        letterSpacing: 4,
      }),
      rect(170, 270, 740, 860, t.shade('surface', 'rgba(0,0,0,0)'), {
        stroke: t.color('surface'),
        strokeWidth: 14,
        name: 'Frame',
      }),
      photo('man-portrait-3', 220, 320, 640, 760),
      rect(220, 1000, 420, 150, t.color('surface'), { name: 'Name card' }),
      text(t.copy('name'), 250, 1025, 380, {
        fontFamily: t.font('heading'),
        fontSize: 40,
        fontWeight: 800,
        fill: t.color('secondary'),
      }),
      text(t.copy('role'), 250, 1085, 380, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 500,
        fill: t.color('text'),
      }),
      icon('sparkles', 860, 1150, 110, t.color('accent'), { strokeWidth: 2 }),
    ],
  );

export const MINI_POSTS = [weAreHiring, spotlightBadge, verticalHiring, takeTheSeat, welcomePost];
