import {
  poly,
  rect,
  rotateNodes,
  STORY_SIZE,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  CONDENSED,
  centered,
  DISPLAY,
  GOLD,
  H,
  priceTag,
  type SalePalette,
  saleMegaphone,
  stackedWords,
  tag,
  W,
} from './posts';

const TAG_SPOTS = [
  { x: 730, y: 165, rotation: -8 },
  { x: 110, y: 470, rotation: -10 },
  { x: 800, y: 760, rotation: 8 },
  { x: 480, y: 900, rotation: -6 },
] as const;

const HEADLINE = ['Last', 'Day For', 'Black', 'Friday', 'Deals'].join('\n');

const lastDayAt = (p: SalePalette, height: number) => {
  const shift = height > H ? 285 : 0;
  return themed(
    W,
    height,
    {
      colors: {
        background: { value: p.ink, hint: 'Page' },
        surface: { value: p.paper, hint: 'Headline, the closing line and the big star' },
        accent: { value: p.main, hint: 'Word tags and the small star' },
        text: { value: p.onMain, hint: 'Words on the tags' },
      },
      fonts: { display: DISPLAY, body: BODY },
      copy: {
        headline: { label: 'Headline', value: HEADLINE },
        tags: { label: 'Tag', value: ['Hurry', 'Before', "It's", 'Gone'] },
        closing: { label: 'Closing line', value: 'Shop before midnight' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const tags = t.list('tags');
      return [
        rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
        centered(t.copy('headline'), 200 + shift, t.font('display'), 140, 400, t.color('surface'), {
          lineHeight: 1,
        }),
        TAG_SPOTS.map((spot, index) =>
          tag(
            tags[index] ?? '',
            spot.x,
            spot.y + shift,
            spot.rotation,
            t.color('accent'),
            t.color('text'),
            t.font('body'),
          ),
        ),
        centered(t.copy('closing'), 1060 + shift, t.font('body'), 38, 700, t.color('surface')),
        star(5, 850, 1150 + shift, 120, t.color('surface'), { innerRatio: 0.42 }),
        star(5, 110, 80 + shift, 70, t.color('accent'), { innerRatio: 0.42 }),
      ];
    },
  );
};

export const lastDay = (p: SalePalette) => lastDayAt(p, H);

export const lastDayStory = lastDayAt(GOLD, STORY_SIZE.height);

const TAPE = Array.from({ length: 7 }, () => 'BLACK FRIDAY').join('   /   ');

const comingSoon = (p: SalePalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: p.ink,
          hint: 'Page, the countdown text and the lettering on the grey tape',
        },
        accent: {
          value: p.main,
          hint: 'First and second words, the corner star and the bright tape',
        },
        surface: { value: p.paper, hint: 'Intro line, the event name and the countdown tag' },
        secondary: { value: '#d4d4d8', hint: 'Grey tape' },
        text: { value: p.onMain, hint: 'Lettering on the bright tape' },
      },
      fonts: { display: DISPLAY, condensed: CONDENSED, body: BODY },
      copy: {
        intro: { label: 'Intro', value: 'Check out our best offers' },
        event: { label: 'Event', value: 'Black Friday' },
        top: { label: 'First word', value: 'COMING' },
        countdown: { label: 'Countdown', value: 'Only 10 days left' },
        bottom: { label: 'Second word', value: 'SOON' },
        tape: { label: 'Tape text', value: TAPE, hint: 'Repeated on both tapes' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const display = t.font('display');
      const tapeText = (y: number, fill: string, rotation: number) =>
        text(t.copy('tape'), 10, y, 1070, {
          fontFamily: t.font('condensed'),
          fontSize: 30,
          fontWeight: 400,
          fill,
          rotation,
        });
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        star(5, 70, 70, 100, t.color('accent'), { innerRatio: 0.42 }),
        centered(t.copy('intro'), 200, t.font('body'), 32, 600, t.color('surface')),
        centered(t.copy('event'), 260, display, 92, 400, t.color('surface')),
        centered(t.copy('top'), 410, display, 160, 400, t.color('accent'), { lineHeight: 1 }),
        rotateNodes(-6, 540, 620, [
          rect(330, 588, 420, 64, t.color('surface'), { cornerRadius: 8, name: 'Countdown tag' }),
          text(t.copy('countdown'), 330, 600, 420, {
            fontFamily: t.font('body'),
            fontSize: 34,
            fontWeight: 800,
            fill: t.color('background'),
            align: 'center',
          }),
        ]),
        centered(t.copy('bottom'), 660, display, 160, 400, t.color('accent'), { lineHeight: 1 }),
        poly(
          [
            [0, 1000],
            [W, 900],
            [W, 970],
            [0, 1070],
          ],
          t.color('secondary'),
          { name: 'Tape' },
        ),
        tapeText(1040, t.color('background'), -5.3),
        poly(
          [
            [0, 1140],
            [W, 1240],
            [W, 1310],
            [0, 1210],
          ],
          t.color('accent'),
          { name: 'Tape' },
        ),
        tapeText(1150, t.color('text'), 5.3),
      ];
    },
  );

export const POSTS: readonly [Template, Template, Template, Template, Template] = [
  saleMegaphone(GOLD),
  stackedWords(GOLD),
  priceTag(GOLD),
  lastDay(GOLD),
  comingSoon(GOLD),
];
