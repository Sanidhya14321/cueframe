import {
  circle,
  icon,
  photo,
  pill,
  rating,
  rect,
  rotateNodes,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { DISPLAY, type GrowthPalette, H, HEADING, STUDIO, W, WHITE } from './posts';

export const unscramble = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page' },
        text: {
          value: p.paper,
          hint: 'Title and the comment prompt; its grey shade colors the hint line',
        },
        primary: {
          value: p.brand,
          hint: 'Arrow, letter tiles and the outlines of the answer circles',
        },
        surface: { value: WHITE, hint: 'Tile letters and the answer circles' },
        accent: { value: p.accent, hint: 'Star in the top right' },
      },
      fonts: { heading: HEADING },
      copy: {
        title: { label: 'Title', value: 'UNSCRAMBLE THIS' },
        letters: { label: 'Letter', value: ['D', 'N', 'A', 'R', 'G', 'I', 'B', 'N'] },
        prompt: { label: 'Prompt', value: 'COMMENT BELOW:' },
        hint: { label: 'Hint', value: 'Hint: every brand needs it' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('title'), 0, 200, W, {
          fontFamily: font,
          fontSize: 70,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
        icon('arrow-down', 505, 310, 70, t.color('primary'), { strokeWidth: 3 }),
        t.list('letters').map((letter, item) => {
          const rowIndex = Math.floor(item / 4);
          const index = item % 4;
          return [
            rect(170 + index * 190, 420 + rowIndex * 190, 160, 160, t.color('primary'), {
              cornerRadius: 30,
              name: 'Letter tile',
            }),
            text(letter, 170 + index * 190, 452 + rowIndex * 190, 160, {
              fontFamily: font,
              fontSize: 84,
              fontWeight: 800,
              fill: t.color('surface'),
              align: 'center',
              lineHeight: 1,
            }),
          ];
        }),
        text(t.copy('prompt'), 0, 880, W, {
          fontFamily: font,
          fontSize: 48,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
        Array.from({ length: 8 }, (_, index) =>
          circle(190 + index * 100, 1030, 36, t.color('surface'), {
            stroke: t.color('primary'),
            strokeWidth: 4,
          }),
        ),
        text(t.copy('hint'), 0, 1140, W, {
          fontFamily: font,
          fontSize: 32,
          fontWeight: 500,
          fill: t.shade('text', '#9ca3af'),
          align: 'center',
        }),
        star(5, 900, 90, 90, t.color('accent'), { innerRatio: 0.45 }),
      ];
    },
  );

export const toggleBoost = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.brand, hint: 'Page and the label of the switched off toggle' },
        secondary: {
          value: p.ink,
          hint: 'Switched on toggles and the knob of the switched off toggle',
        },
        surface: {
          value: WHITE,
          hint: 'Switched off toggle and the knobs of the switched on toggles',
        },
        text: { value: WHITE, hint: 'Headline, switched on toggle labels and the mouse icon' },
        accent: { value: p.accent, hint: 'Star in the top right' },
      },
      fonts: { heading: HEADING },
      copy: {
        toggles: {
          label: 'Toggle',
          value: ['More visibility', 'More results', 'More engagement', 'Get started'],
        },
        headline: { label: 'Headline', value: 'SOCIAL MEDIA\nMANAGEMENT' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        t.list('toggles').map((label, index) => {
          const y = 150 + index * 150;
          const on = index < 3;
          return [
            rect(80, y, 620, 110, on ? t.color('secondary') : t.color('surface'), {
              cornerRadius: 55,
              name: 'Toggle row',
            }),
            text(label, 130, y + 30, 440, {
              fontFamily: font,
              fontSize: 40,
              fontWeight: 700,
              fill: on ? t.color('text') : t.color('background'),
            }),
            circle(640, y + 55, 38, on ? t.color('surface') : t.color('secondary')),
          ];
        }),
        text(t.copy('headline'), 80, 1040, 920, {
          fontFamily: font,
          fontSize: 80,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'right',
          lineHeight: 1.05,
        }),
        star(5, 860, 220, 140, t.color('accent'), { innerRatio: 0.45 }),
        icon('mouse', 680, 680, 90, t.color('text'), { strokeWidth: 2 }),
      ];
    },
  );

export const dontCheck = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.brand, hint: 'Page behind the photo' },
        text: {
          value: WHITE,
          hint: 'Both vertical headline lines (outlined and solid) and the pill label',
        },
        secondary: { value: p.ink, hint: 'Studio pill' },
      },
      fonts: { display: DISPLAY, heading: HEADING },
      copy: {
        outline: { label: 'Outlined line', value: "DON'T CHECK" },
        solid: { label: 'Solid line', value: 'THE COMMENTS' },
        studio: STUDIO,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const display = t.font('display');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        photo('woman-portrait-4', 320, 0, 760, H),
        text(t.copy('outline'), 30, 1300, 1260, {
          fontFamily: display,
          fontSize: 118,
          fontWeight: 400,
          fill: t.shade('text', 'rgba(0,0,0,0)'),
          stroke: t.color('text'),
          strokeWidth: 3,
          rotation: -90,
        }),
        text(t.copy('solid'), 170, 1300, 1260, {
          fontFamily: display,
          fontSize: 118,
          fontWeight: 400,
          fill: t.color('text'),
          rotation: -90,
        }),
        pill(t.copy('studio'), 700, 80, {
          fill: t.color('secondary'),
          color: t.color('text'),
          fontSize: 28,
          fontFamily: t.font('heading'),
          fontWeight: 700,
        }),
      ];
    },
  );

export const reviewWall = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page' },
        primary: { value: p.brand, hint: 'The big REV and IEW letters and the avatar circle' },
        secondary: { value: p.paper, hint: 'The #REVIEW tag and the two stars' },
        surface: { value: WHITE, hint: 'Review card and the avatar icon' },
        text: {
          value: p.ink,
          hint: 'Reviewer name and the tag label; its grey shade colors the review',
        },
        accent: { value: p.accent, hint: 'Rating stars' },
      },
      fonts: { display: DISPLAY, heading: HEADING },
      copy: {
        top: { label: 'Title top', value: 'REV' },
        bottom: { label: 'Title bottom', value: 'IEW' },
        tag: { label: 'Tag', value: '#REVIEW' },
        name: { label: 'Reviewer', value: 'Jordan Ellis' },
        review: {
          label: 'Review',
          value: 'Our feed finally looks like one brand. Bookings went up within the first month.',
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const display = t.font('display');
      const font = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('top'), 40, 40, 1000, {
          fontFamily: display,
          fontSize: 340,
          fontWeight: 400,
          fill: t.color('primary'),
          lineHeight: 1,
        }),
        text(t.copy('bottom'), 40, 930, 1000, {
          fontFamily: display,
          fontSize: 340,
          fontWeight: 400,
          fill: t.color('primary'),
          align: 'right',
          lineHeight: 1,
        }),
        rotateNodes(-90, 980, 860, [
          pill(t.copy('tag'), 980, 860, {
            fill: t.color('secondary'),
            color: t.color('text'),
            fontSize: 34,
            fontFamily: font,
            fontWeight: 800,
          }),
        ]),
        rect(150, 470, 780, 380, t.color('surface'), {
          cornerRadius: 24,
          name: 'Review card',
          shadow: { color: 'rgba(0,0,0,0.5)', blur: 40, offsetX: 0, offsetY: 16 },
        }),
        circle(240, 560, 46, t.color('primary')),
        icon('user', 216, 536, 48, t.color('surface')),
        text(t.copy('name'), 310, 520, 560, {
          fontFamily: font,
          fontSize: 40,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        rating(310, 578, 34, 5, t.color('accent'), 0.2),
        text(t.copy('review'), 200, 660, 680, {
          fontFamily: font,
          fontSize: 32,
          fontWeight: 500,
          fill: t.shade('text', '#374151'),
          lineHeight: 1.4,
        }),
        star(5, 860, 380, 120, t.color('secondary'), { innerRatio: 0.45 }),
        star(5, 90, 900, 80, t.color('secondary'), { innerRatio: 0.45 }),
      ];
    },
  );

const WALKERS = [130, 160, 120, 170, 140, 150, 125, 165];
const HEADLINE_ROWS = [
  { y: 260, width: 900, brand: false },
  { y: 390, width: 900, brand: true },
  { y: 520, width: 900, brand: false },
  { y: 650, width: 500, brand: true },
];

export const stopCreating = (p: GrowthPalette): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.paper, hint: 'Page' },
        text: {
          value: p.ink,
          hint: 'Kicker, the first and third headline lines, the year note and the walking crowd; its grey shade colors the ground line',
        },
        primary: {
          value: p.brand,
          hint: 'Second and fourth headline lines, the one standout walker head and the star',
        },
      },
      fonts: { heading: HEADING },
      copy: {
        kicker: { label: 'Kicker', value: 'Digital Marketing' },
        lines: { label: 'Headline line', value: ['STOP', 'CREATING', 'ONE POST', 'A DAY'] },
        note: { label: 'Note', value: 'in 2026.' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('heading');
      const ink = t.color('text');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('kicker'), 90, 110, 800, {
          fontFamily: font,
          fontSize: 34,
          fontWeight: 500,
          fill: ink,
        }),
        t.list('lines').map((line, index) => {
          const row = HEADLINE_ROWS[index] ?? { y: 0, width: 900, brand: false };
          return text(line, 90, row.y, row.width, {
            fontFamily: font,
            fontSize: 120,
            fontWeight: 800,
            fill: row.brand ? t.color('primary') : ink,
          });
        }),
        text(t.copy('note'), 500, 712, 300, {
          fontFamily: font,
          fontSize: 48,
          fontWeight: 600,
          fill: ink,
        }),
        WALKERS.map((size, index) => {
          const cx = 150 + index * 112;
          return [
            rect(cx - size * 0.15, 1220 - size * 1.3, size * 0.3, size * 0.8, ink, {
              cornerRadius: size * 0.1,
              name: 'Walker body',
            }),
            rect(cx - size * 0.12, 1220 - size * 0.55, size * 0.1, size * 0.55, ink, {
              name: 'Walker leg',
            }),
            rect(cx + size * 0.02, 1220 - size * 0.55, size * 0.1, size * 0.55, ink, {
              name: 'Walker leg',
            }),
            circle(cx, 1220 - size * 1.45, size * 0.14, index === 5 ? t.color('primary') : ink),
          ];
        }),
        rect(80, 1226, 920, 4, t.shade('text', '#d1d5db'), { name: 'Ground' }),
        star(5, 880, 90, 110, t.color('primary'), { innerRatio: 0.45 }),
      ];
    },
  );
