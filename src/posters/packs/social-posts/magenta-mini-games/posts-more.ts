import { rect, star, type Template, type ThemeSpec, text, themed } from '../../../kit';
import { type GameTheme, HEADING, PH, PW, tile } from './posts';

const CROSSWORD: readonly (readonly [number, number, string, boolean])[] = [
  ...[...'REFERRAL'].map((glyph, index): [number, number, string, boolean] => [
    index,
    1,
    glyph,
    index % 3 !== 1,
  ]),
  ...[...'BRAND'].map((glyph, index): [number, number, string, boolean] => [
    4,
    index,
    glyph,
    index !== 2 && index !== 3,
  ]),
  ...[...'EALS'].map((glyph, index): [number, number, string, boolean] => [
    5 + index,
    4,
    glyph,
    index === 1,
  ]),
];

const wordsSpec = (theme: GameTheme) =>
  ({
    colors: {
      background: { value: theme.night, hint: 'Page; its shade colors the tile letters' },
      surface: { value: theme.paper, hint: 'Crossword tiles' },
      primary: { value: theme.brand, hint: 'Headline, the small star and the answer panel' },
      text: { value: theme.paper, hint: 'Answer panel text and its star' },
    },
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Headline', value: 'Can you spot the 3\nhidden words?' },
      letters: {
        label: 'Tile letter',
        hint: 'Leave a letter blank to hide it',
        value: CROSSWORD.map(([, , glyph, shown]) => (shown ? glyph : '')),
      },
      prompt: { label: 'Answer prompt', value: 'Found all three?\nDrop them in the comments' },
    },
  }) as const satisfies ThemeSpec;

export const hiddenWords = (theme: GameTheme): Template =>
  themed(PW, PH, wordsSpec(theme), (t) => {
    const letters = t.list('letters');
    return [
      rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 90, 110, 900, {
        fontFamily: t.font('heading'),
        fontSize: 62,
        fontWeight: 800,
        fill: t.color('primary'),
        lineHeight: 1.15,
      }),
      CROSSWORD.map(([column, row], index) =>
        tile(
          letters[index] ?? '',
          134 + column * 92,
          380 + row * 92,
          84,
          t.color('surface'),
          t.shade('background', theme.ink),
          t.font('heading'),
        ),
      ),
      star(5, 900, 860, 90, t.color('primary'), { innerRatio: 0.42 }),
      rect(0, 1010, PW, 340, t.color('primary'), { name: 'Answer panel' }),
      text(t.copy('prompt'), 90, 1080, 760, {
        fontFamily: t.font('heading'),
        fontSize: 44,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.2,
      }),
      star(5, 900, 1190, 110, t.color('text'), { innerRatio: 0.42 }),
    ];
  });

const scrambleSpec = (theme: GameTheme) =>
  ({
    colors: {
      background: { value: theme.night, hint: 'Page; its shade colors the answer dashes' },
      surface: { value: theme.paper, hint: 'Answer boxes and the tile letters' },
      primary: {
        value: theme.brand,
        hint: 'Letter tiles, the answer box outlines and the top star',
      },
      text: { value: theme.nightText, hint: 'Headline, COMMENT BELOW and the bottom star' },
    },
    fonts: { heading: HEADING },
    copy: {
      title: { label: 'Headline', value: 'CAN YOU\nUNSCRAMBLE THIS?' },
      letters: { label: 'Tile letter', value: ['D', 'K', 'E', 'C', 'B', 'E', 'F', 'A'] },
      prompt: { label: 'Answer prompt', value: 'COMMENT BELOW:' },
    },
  }) as const satisfies ThemeSpec;

export const unscramble = (theme: GameTheme): Template =>
  themed(PW, PH, scrambleSpec(theme), (t) => {
    const letters = t.list('letters');
    return [
      rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 0, 140, PW, {
        fontFamily: t.font('heading'),
        fontSize: 66,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1.15,
      }),
      letters.map((glyph, index) =>
        tile(
          glyph,
          150 + (index % 4) * 210,
          420 + Math.floor(index / 4) * 210,
          150,
          t.color('primary'),
          t.color('surface'),
          t.font('heading'),
        ),
      ),
      text(t.copy('prompt'), 0, 880, PW, {
        fontFamily: t.font('heading'),
        fontSize: 40,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 2,
      }),
      letters.map((_, index) => [
        rect(150 + index * 100, 970, 80, 80, t.color('surface'), {
          name: 'Answer box',
          cornerRadius: 8,
          stroke: t.color('primary'),
          strokeWidth: 3,
        }),
        rect(170 + index * 100, 1020, 40, 5, t.shade('background', theme.ink), {
          name: 'Answer dash',
          cornerRadius: 2,
        }),
      ]),
      star(5, 900, 60, 100, t.color('primary'), { innerRatio: 0.42 }),
      star(5, 90, 1180, 100, t.color('text'), { innerRatio: 0.42 }),
    ];
  });
