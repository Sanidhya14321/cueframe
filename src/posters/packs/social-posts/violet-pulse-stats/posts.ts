import {
  circle,
  icon,
  rect,
  rotateNodes,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { FONTS, kicker, PH, PW, type StatTheme } from './shared';

interface NoteStyle {
  paper: string;
  ink: string;
  font: string;
}

const note = (style: NoteStyle, label: string, x: number, y: number, degrees: number) =>
  rotateNodes(degrees, x, y, [
    rect(x, y, 640, 170, style.paper, { name: 'Note', cornerRadius: 20, ...shadow(30, 12) }),
    circle(x + 90, y + 85, 50, style.ink),
    icon('arrow-up-right', x + 62, y + 57, 56, style.paper, { strokeWidth: 2.6 }),
    text(label, x + 170, y + 38, 440, {
      fontFamily: style.font,
      fontSize: 36,
      fontWeight: 500,
      fill: style.ink,
      lineHeight: 1.25,
    }),
  ]);

const NOTE_SPOTS = [
  { x: 260, y: 470, degrees: -3 },
  { x: 340, y: 720, degrees: 2 },
  { x: 220, y: 960, degrees: -2 },
] as const;

export const resultsNotes = (theme: StatTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        background: { value: theme.brand, hint: 'Page' },
        surface: {
          value: theme.paper,
          hint: 'Kicker, headline, the three notes, their arrows and the bottom star',
        },
        accent: {
          value: theme.ink,
          hint: 'Top star, the arrow circles and the note text',
        },
      },
      fonts: FONTS,
      copy: {
        kicker: { label: 'Kicker', value: 'QUARTERLY GROWTH RECAP' },
        headline: { label: 'Headline', value: 'The wins we banked\nthis quarter' },
        notes: {
          label: 'Note',
          value: [
            'Qualified leads grew\nby 32%',
            'Churn rate dropped\nby 18%',
            'Demo bookings rose\nby 27%',
          ],
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const style = { paper: t.color('surface'), ink: t.color('accent'), font: t.font('body') };
      return [
        rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
        kicker(t.copy('kicker'), t.color('surface'), t.font('body')),
        text(t.copy('headline'), 90, 160, 940, {
          fontFamily: t.font('heading'),
          fontSize: 70,
          fontWeight: 800,
          fill: t.color('surface'),
          lineHeight: 1.12,
        }),
        star(5, 60, 560, 130, t.color('accent'), { innerRatio: 0.42 }),
        t.list('notes').map((label, index) => {
          const spot = NOTE_SPOTS[index] ?? NOTE_SPOTS[0];
          return note(style, label, spot.x, spot.y, spot.degrees);
        }),
        star(5, 880, 1160, 150, t.color('surface'), { innerRatio: 0.42 }),
      ];
    },
  );

export const bigStat = (theme: StatTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        background: { value: theme.brand, hint: 'Page' },
        surface: {
          value: theme.paper,
          hint: 'The big stat, headline, source line and the light bar bodies',
        },
        accent: { value: theme.ink, hint: 'Star, the dark bars and the bar caps' },
      },
      fonts: FONTS,
      copy: {
        stat: { label: 'Stat', value: '81%' },
        headline: {
          label: 'Headline',
          value: 'of teams lose 12+ hours a\nweek to manual reporting',
        },
        source: { label: 'Source', value: 'Ops Pulse Survey 2026. Automate the busywork.' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
      star(5, 820, 70, 170, t.color('accent'), { innerRatio: 0.42 }),
      text(t.copy('stat'), 90, 120, 700, {
        fontFamily: t.font('heading'),
        fontSize: 210,
        fontWeight: 800,
        fill: t.color('surface'),
        lineHeight: 1,
      }),
      text(t.copy('headline'), 90, 380, 940, {
        fontFamily: t.font('heading'),
        fontSize: 50,
        fontWeight: 700,
        fill: t.color('surface'),
        lineHeight: 1.2,
      }),
      text(t.copy('source'), 90, 530, 900, {
        fontFamily: t.font('body'),
        fontSize: 24,
        fontWeight: 500,
        fill: t.color('surface'),
        opacity: 0.8,
      }),
      rect(70, 790, 200, 560, t.color('accent'), { name: 'Bar' }),
      rect(320, 930, 200, 420, t.color('surface'), { name: 'Bar base' }),
      rect(320, 930, 200, 170, t.color('accent'), { name: 'Bar cap' }),
      rect(570, 850, 200, 500, t.color('accent'), { name: 'Bar' }),
      rect(820, 750, 200, 600, t.color('surface'), { name: 'Bar base' }),
      rect(820, 750, 200, 230, t.color('accent'), { name: 'Bar cap' }),
    ],
  );
