import { linear } from '@/design';
import { rect, type ThemeSpec, themed } from '../../../kit';
import {
  H,
  HAWKS,
  HEADING,
  iceBackground,
  LABEL,
  RINK_HINT,
  SCRIPT,
  say,
  toned,
  W,
} from './palette';

interface QuoteStyle {
  background: string;
  fade: string;
  ink: string;
  accent: string;
  portrait: 'man-portrait-2' | 'man-portrait-3';
  name: string;
  number: string;
  quote: string;
}

const quoteSpec = (style: QuoteStyle) =>
  ({
    colors: {
      background: { value: style.background, hint: 'Page and the fade under the portrait' },
      text: { value: style.ink, hint: 'Player name and the quote' },
      accent: { value: style.accent, hint: 'Jersey number and the quote marks' },
    },
    fonts: { heading: HEADING, label: LABEL, script: SCRIPT },
    copy: {
      name: { label: 'Player name', value: style.name },
      number: { label: 'Jersey number', value: style.number },
      open: { label: 'Opening mark', value: '“' },
      quote: { label: 'Quote', value: style.quote },
      close: { label: 'Closing mark', value: '”' },
    },
  }) satisfies ThemeSpec;

const quote = (style: QuoteStyle) =>
  themed(W, H, quoteSpec(style), (t) => {
    const heading = t.font('heading');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      toned(style.portrait, 240, 60, 600, 800, t.shade('background', HAWKS.clear)),
      rect(
        240,
        520,
        600,
        340,
        linear(180, t.shade('background', style.fade), t.color('background')),
        {
          name: 'Fade',
        },
      ),
      say(t.copy('name'), 560, 680, 440, t.font('script'), 64, 400, t.color('text'), {
        rotation: -8,
      }),
      say(t.copy('number'), 880, 560, 140, t.font('label'), 52, 600, t.color('accent'), {
        italic: true,
      }),
      say(t.copy('open'), 90, 790, 200, heading, 300, 400, t.color('accent')),
      say(t.copy('quote'), 140, 900, 800, heading, 110, 400, t.color('text'), {
        align: 'center',
        lineHeight: 1.05,
      }),
      say(t.copy('close'), 850, 1110, 200, heading, 300, 400, t.color('accent')),
    ];
  });

export const quoteNight = quote({
  background: HAWKS.deep,
  fade: 'rgba(5,12,29,0)',
  ink: HAWKS.white,
  accent: HAWKS.amber,
  portrait: 'man-portrait-2',
  name: 'Lukas Brandt',
  number: '#19',
  quote: 'EVERY SHIFT IS A\nCHANCE TO PROVE IT',
});

export const quoteFrost = quote({
  background: HAWKS.frost,
  fade: 'rgba(238,245,251,0)',
  ink: HAWKS.navy,
  accent: HAWKS.blue,
  portrait: 'man-portrait-3',
  name: 'Ari Lindqvist',
  number: '#44',
  quote: 'HARD WORK BEATS\nTALENT EVERY TIME',
});

const lineupSpec = {
  colors: {
    background: {
      value: HAWKS.steel,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    text: { value: HAWKS.white, hint: 'STARTING' },
    secondary: { value: HAWKS.ice, hint: 'LINEUP' },
    surface: { value: HAWKS.white, hint: 'Player rows' },
    primary: {
      value: HAWKS.navy,
      hint: 'Last names, jersey numbers and positions; its grey shade colors the first names',
    },
    accent: { value: HAWKS.amber, hint: 'Position boxes' },
  },
  fonts: { heading: HEADING, label: LABEL },
  copy: {
    title: { label: 'Title', value: 'STARTING' },
    subtitle: { label: 'Second title line', value: 'LINEUP' },
    firsts: { label: 'First name', value: ['ELI', 'NOAH', 'OWEN', 'DANTE', 'SAMI', 'JONAS'] },
    lasts: {
      label: 'Last name',
      value: ['MARSH', 'KESSLER', 'PARK', 'RUIZ', 'KORHONEN', 'VALE'],
    },
    numbers: { label: 'Jersey number', value: ['9', '17', '22', '4', '6', '31'] },
    positions: { label: 'Position', value: ['C', 'LW', 'RW', 'LD', 'RD', 'G'] },
  },
} as const satisfies ThemeSpec;

export const startingLineup = themed(W, H, lineupSpec, (t) => {
  const heading = t.font('heading');
  const lasts = t.list('lasts');
  const numbers = t.list('numbers');
  const positions = t.list('positions');
  return [
    rect(0, 0, W, H, linear(160, t.color('background'), t.shade('background', HAWKS.deep)), {
      name: 'Background',
    }),
    say(t.copy('title'), 80, 70, 900, heading, 160, 400, t.color('text'), {
      lineHeight: 1,
      letterSpacing: 4,
    }),
    say(t.copy('subtitle'), 80, 220, 900, heading, 160, 400, t.color('secondary'), {
      lineHeight: 1,
      letterSpacing: 4,
    }),
    t.list('firsts').map((first, index) => {
      const y = 420 + index * 140;
      return [
        rect(80, y, 920, 116, t.color('surface'), { cornerRadius: 14, name: 'Player row' }),
        say(first, 115, y + 10, 400, t.font('label'), 28, 600, t.shade('primary', '#64748b'), {
          letterSpacing: 3,
        }),
        say(lasts[index] ?? '', 115, y + 46, 500, heading, 60, 400, t.color('primary'), {
          lineHeight: 1,
          letterSpacing: 2,
        }),
        say(numbers[index] ?? '', 650, y + 14, 210, heading, 96, 400, t.color('primary'), {
          align: 'right',
          lineHeight: 1,
        }),
        rect(890, y, 110, 116, t.color('accent'), { cornerRadius: 14, name: 'Position' }),
        say(positions[index] ?? '', 890, y + 30, 110, heading, 60, 400, t.color('primary'), {
          align: 'center',
          lineHeight: 1,
        }),
      ];
    }),
  ];
});

const scheduleSpec = {
  colors: {
    background: { value: HAWKS.rinkTop, hint: RINK_HINT },
    primary: {
      value: HAWKS.navy,
      hint: 'Title, home game rows, away row outlines and text, and the footer',
    },
    surface: { value: HAWKS.white, hint: 'Away game rows and the opponent on home rows' },
    secondary: {
      value: HAWKS.blue,
      hint: 'Away game dates and the skate marks; its light tint colors the venue on home rows',
    },
    accent: { value: HAWKS.amber, hint: 'Home game dates' },
  },
  fonts: { heading: HEADING, label: LABEL },
  copy: {
    title: { label: 'Title', value: 'NOV GAMES' },
    dates: { label: 'Date', value: ['NOV 3', 'NOV 7', 'NOV 12', 'NOV 16', 'NOV 21', 'NOV 27'] },
    opponents: {
      label: 'Opponent',
      value: [
        'vs RAVENS',
        'vs IRONCLADS',
        'vs NORTH STARS',
        'vs BLIZZARD',
        'vs TIMBERWOLVES',
        'vs RAVENS',
      ],
    },
    venues: {
      label: 'Venue and time',
      value: [
        'HOME\n7:00 PM',
        'AWAY\n7:00 PM',
        'HOME\n7:00 PM',
        'AWAY\n7:00 PM',
        'HOME\n7:00 PM',
        'AWAY\n7:00 PM',
      ],
    },
    footer: { label: 'Footer', value: 'Tickets and streams at frosthawks.club' },
  },
} as const satisfies ThemeSpec;

export const schedule = themed(W, H, scheduleSpec, (t) => {
  const heading = t.font('heading');
  const opponents = t.list('opponents');
  const venues = t.list('venues');
  return [
    iceBackground(W, H, {
      top: t.color('background'),
      bottom: t.shade('background', HAWKS.rinkBottom),
      mark: t.shade('secondary', HAWKS.skate),
    }),
    say(t.copy('title'), 0, 60, W, heading, 190, 400, t.color('primary'), {
      align: 'center',
      letterSpacing: 6,
    }),
    t.list('dates').map((date, index) => {
      const y = 300 + index * 150;
      const home = index % 2 === 0;
      return [
        rect(110, y, 860, 110, home ? t.color('primary') : t.color('surface'), {
          cornerRadius: 14,
          stroke: t.color('primary'),
          strokeWidth: home ? 0 : 4,
          name: 'Game row',
        }),
        say(
          date,
          145,
          y + 22,
          200,
          heading,
          72,
          400,
          home ? t.color('accent') : t.color('secondary'),
          {
            lineHeight: 1,
          },
        ),
        say(
          opponents[index] ?? '',
          360,
          y + 22,
          420,
          heading,
          72,
          400,
          home ? t.color('surface') : t.color('primary'),
          { lineHeight: 1 },
        ),
        say(
          venues[index] ?? '',
          790,
          y + 18,
          150,
          t.font('label'),
          32,
          700,
          home ? t.shade('secondary', HAWKS.ice) : t.color('primary'),
          { align: 'right', lineHeight: 1.15 },
        ),
      ];
    }),
    say(t.copy('footer'), 0, 1240, W, t.font('label'), 38, 600, t.color('primary'), {
      align: 'center',
    }),
  ];
});
