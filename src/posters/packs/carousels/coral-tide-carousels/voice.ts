import { circle, icon, type Template, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, BRAND, darkBackground, H, HEAD, TIDE, W } from './palette';
import { trail } from './slide-kit';

const CLEAR = 'rgba(0,0,0,0)';
const LOW = 1180;
const TITLE_Y = 300;
const TITLE_SIZE = 110;
const ACCENT_MID = TITLE_Y + TITLE_SIZE * 1.15 + TITLE_SIZE * 0.6;

const coverSpec = {
  colors: {
    background: {
      value: TIDE.teal,
      hint: 'Page gradient and the arrow; its darker shade is the bottom of the gradient',
    },
    primary: { value: TIDE.coral, hint: 'Voice and the connector line' },
    secondary: { value: TIDE.mist, hint: 'Subtitle' },
    text: { value: TIDE.white, hint: 'Brand name, the title and the round arrow button' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    brand: BRAND,
    title: { label: 'Title', value: 'Find\nYour\nBrand' },
    highlight: { label: 'Highlight', value: 'Voice' },
    subtitle: { label: 'Subtitle', value: 'How to sound clear, warm\nand unmistakably you.' },
  },
} as const satisfies ThemeSpec;

const voiceCover = themed(W, H, coverSpec, (t) => [
  darkBackground(t.color('background'), t.shade('background', TIDE.night)),
  text(t.copy('brand'), 480, 110, 510, {
    fontFamily: t.font('heading'),
    fontSize: 30,
    fontWeight: 700,
    fill: t.color('text'),
    align: 'right',
    letterSpacing: 3,
  }),
  text(t.copy('title'), 90, 300, 800, {
    fontFamily: t.font('heading'),
    fontSize: 130,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.1,
  }),
  text(t.copy('highlight'), 90, 730, 600, {
    fontFamily: t.font('heading'),
    fontSize: 130,
    fontWeight: 800,
    fill: t.color('primary'),
  }),
  trail(
    'M0 0 H300 Q360 0 360 60 V300 Q360 360 420 360 H540',
    540,
    820,
    540,
    360,
    t.color('primary'),
    t.shade('primary', CLEAR),
    10,
  ),
  text(t.copy('subtitle'), 90, 940, 760, {
    fontFamily: t.font('body'),
    fontSize: 42,
    fontWeight: 500,
    fill: t.color('secondary'),
    lineHeight: 1.35,
  }),
  circle(140, 1170, 56, t.color('text')),
  icon('arrow-right', 106, 1136, 68, t.shade('background', TIDE.deep), { strokeWidth: 2.6 }),
]);

const voicePoint = (lead: string, accent: string, body: string) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: TIDE.teal,
          hint: 'Page gradient; its darker shade is the bottom of the gradient',
        },
        primary: { value: TIDE.coral, hint: `${accent} and the connector lines` },
        text: { value: TIDE.white, hint: `${lead} and the body text` },
      },
      fonts: { heading: HEAD, body: BODY },
      copy: {
        lead: { label: 'Title', value: lead },
        accent: { label: 'Highlight', value: accent },
        body: { label: 'Body', value: body },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const accentEnd = 130 + accent.length * TITLE_SIZE * 0.64 + 30;
      const line = t.color('primary');
      const clear = t.shade('primary', CLEAR);
      const title = (label: string, y: number, fill: string) =>
        text(label, 130, y, 900, {
          fontFamily: t.font('heading'),
          fontSize: TITLE_SIZE,
          fontWeight: 800,
          fill,
          lineHeight: 1.15,
        });
      return [
        darkBackground(t.color('background'), t.shade('background', TIDE.night)),
        trail(
          `M0 ${LOW - ACCENT_MID} H40 Q80 ${LOW - ACCENT_MID} 80 ${LOW - ACCENT_MID - 40} V40 Q80 0 110 0`,
          0,
          ACCENT_MID,
          110,
          LOW - ACCENT_MID,
          line,
          clear,
          10,
        ),
        title(t.copy('lead'), TITLE_Y, t.color('text')),
        title(t.copy('accent'), TITLE_Y + TITLE_SIZE * 1.15, t.color('primary')),
        trail(
          `M0 0 H${900 - accentEnd} Q${960 - accentEnd} 0 ${960 - accentEnd} 60 V${LOW - ACCENT_MID - 60} Q${960 - accentEnd} ${LOW - ACCENT_MID} ${1020 - accentEnd} ${LOW - ACCENT_MID} H${W - accentEnd}`,
          accentEnd,
          ACCENT_MID,
          W - accentEnd,
          LOW - ACCENT_MID,
          line,
          clear,
          10,
        ),
        text(t.copy('body'), 130, 620, 700, {
          fontFamily: t.font('body'),
          fontSize: 44,
          fontWeight: 500,
          fill: t.color('text'),
          lineHeight: 1.4,
        }),
      ];
    },
  );

export const VOICE_SERIES: readonly Template[] = [
  voiceCover,
  voicePoint(
    'Why It',
    'Matters',
    'Your voice is the personality behind every post. It makes you familiar, human and easy to remember.',
  ),
  voicePoint(
    'Pick Your',
    'Traits',
    'Choose three words that describe how you want to sound, then check every caption against them.',
  ),
  voicePoint(
    'Know Your',
    'Readers',
    'Learn the words your audience already uses and meet them there, in their language.',
  ),
  voicePoint(
    'Collect',
    'Examples',
    'Save posts that feel right, note why they work and build a simple guide your team can share.',
  ),
];
