import {
  circle,
  icon,
  photo,
  poly,
  rating,
  rect,
  STORY_SIZE,
  shadow,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  HEADING,
  lines,
  NAME_INK,
  PH,
  PW,
  type ReviewTheme,
  reviewCard,
  starShape,
  TAG,
} from './posts';

export const photoQuote = (theme: ReviewTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        background: {
          value: theme.deep,
          hint: 'Tint over the photo, the quote badge and the quote box',
        },
        primary: {
          value: theme.brand,
          hint: 'Photo frame, the tag, the quote icon and the reviewer line',
        },
        text: { value: theme.paper, hint: 'Tag label and the quote' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        tag: { label: 'Tag', value: TAG },
        quote: {
          label: 'Quote',
          value:
            'We replaced four tools with one workspace and shipped our roadmap a full month early. Our team loves it.',
        },
        reviewer: { label: 'Reviewer', value: 'Rosa Lindgren, COO at Fieldnote' },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, PW, PH, t.color('background'), { name: 'Background' }),
      photo('team-3', 0, 0, PW, PH, { name: 'Background photo' }),
      rect(0, 0, PW, PH, t.shade('background', 'rgba(10,15,38,0.18)'), { name: 'Tint' }),
      rect(80, 170, 920, 1040, t.shade('primary', 'rgba(0,0,0,0)'), {
        name: 'Frame',
        stroke: t.color('primary'),
        strokeWidth: 18,
      }),
      rect(80, 70, 300, 76, t.color('primary'), { name: 'Tag' }),
      text(t.copy('tag'), 80, 86, 300, {
        fontFamily: t.font('heading'),
        fontSize: 38,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        letterSpacing: 2,
      }),
      rect(800, 60, 200, 170, t.color('background'), { name: 'Quote badge', cornerRadius: 20 }),
      icon('quote', 840, 85, 120, t.color('primary'), { strokeWidth: 2.4 }),
      rect(140, 960, 800, 300, t.color('background'), { name: 'Quote box' }),
      text(t.copy('quote'), 190, 1000, 700, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.4,
      }),
      text(t.copy('reviewer'), 190, 1190, 700, {
        fontFamily: t.font('heading'),
        fontSize: 26,
        fontWeight: 700,
        fill: t.color('primary'),
      }),
    ],
  );

export const typewriter = (theme: ReviewTheme): Template =>
  themed(
    PW,
    PH,
    {
      colors: {
        primary: { value: theme.brand, hint: 'Page and the avatar dots on the paper' },
        surface: {
          value: theme.cream,
          hint: 'Paper sheet; its darker shade colors the text lines',
        },
        secondary: {
          value: theme.ink,
          hint: 'Typewriter body and knobs; its shades color the roller, the rule and the dark star',
        },
        accent: { value: theme.gold, hint: 'Rating stars on the paper' },
        text: { value: theme.paper, hint: 'Headline, subline, keys, space bar and the light star' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        headline: {
          label: 'Headline',
          value: ['Real', 'Results', 'from Real', 'Users'].join('\n'),
        },
        subline: {
          label: 'Subline',
          value: 'Unfiltered notes from the teams that use us every day.',
        },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      rect(0, 0, PW, PH, t.color('primary'), { name: 'Background' }),
      rect(150, 80, 340, 860, t.color('surface'), { name: 'Paper', ...shadow(20, 8) }),
      [0, 1, 2, 3, 4].map((row) => [
        circle(195, 140 + row * 150, 22, t.color('primary')),
        rating(232, 124 + row * 150, 16, 5, t.color('accent')),
        lines(180, 180 + row * 150, [270, 230], t.shade('surface', '#cdbfae'), 24),
      ]),
      rect(100, 880, 440, 64, t.shade('secondary', '#2e3866'), {
        name: 'Roller',
        cornerRadius: 32,
      }),
      circle(96, 912, 30, t.color('secondary')),
      circle(544, 912, 30, t.color('secondary')),
      rect(70, 940, 500, 270, t.color('secondary'), {
        name: 'Typewriter body',
        cornerRadius: 46,
        ...shadow(30, 14),
      }),
      [0, 1, 2].map((row) =>
        Array.from({ length: 8 - row }, (_, key) =>
          circle(140 + row * 26 + key * 52, 1000 + row * 52, 16, t.color('text')),
        ),
      ),
      rect(200, 1150, 240, 22, t.color('text'), { name: 'Space bar', cornerRadius: 11 }),
      text(t.copy('headline'), 620, 300, 420, {
        fontFamily: t.font('heading'),
        fontSize: 76,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.08,
      }),
      rect(620, 680, 110, 8, t.shade('secondary', theme.deep), { name: 'Rule', cornerRadius: 4 }),
      text(t.copy('subline'), 620, 720, 400, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 500,
        fill: t.color('text'),
        lineHeight: 1.4,
      }),
      starShape(560, 60, 90, t.shade('secondary', theme.deep)),
      starShape(860, 1100, 130, t.color('text')),
    ],
  );

const PHOTOS = ['woman-portrait-6', 'man-portrait-2', 'woman-portrait-3'] as const;
const CARDS = [
  [250, 390, -6],
  [300, 590, 4],
  [240, 790, -3],
] as const;

const envelope = (theme: ReviewTheme, height: number, story: boolean): Template =>
  themed(
    PW,
    height,
    {
      colors: {
        primary: { value: theme.brand, hint: 'Page' },
        secondary: {
          value: theme.deep,
          hint: 'USER and the envelope front; its lighter shade colors the envelope back and fold',
        },
        surface: { value: theme.paper, hint: 'Subtitle, review cards and the two big stars' },
        accent: { value: theme.gold, hint: 'Rating stars' },
        text: { value: NAME_INK, hint: 'Reviewer names; its lighter shade colors the quotes' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'USER' },
        subtitle: { label: 'Subtitle', value: 'reviews that ship' },
        names: { label: 'Reviewer', value: ['Amara Diallo', 'Felix Grant', 'June Park'] },
        quotes: {
          label: 'Quote',
          value: [
            'Onboarding our team took one afternoon.',
            'Reports that used to take days now run live.',
            'The cleanest product we pay for.',
          ],
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const shift = story ? 300 : 0;
      const bottom = height - 90;
      const quotes = t.list('quotes');
      const look = {
        card: t.color('surface'),
        name: t.color('text'),
        stars: t.color('accent'),
        quote: t.shade('text', theme.muted),
        heading: t.font('heading'),
        body: t.font('body'),
      };
      return [
        rect(0, 0, PW, height, t.color('primary'), { name: 'Background' }),
        text(t.copy('title'), 0, 90 + shift, PW, {
          fontFamily: t.font('heading'),
          fontSize: 120,
          fontWeight: 800,
          fill: t.color('secondary'),
          align: 'center',
          letterSpacing: 4,
        }),
        text(t.copy('subtitle'), 0, 230 + shift, PW, {
          fontFamily: t.font('heading'),
          fontSize: 50,
          fontWeight: 500,
          fill: t.color('surface'),
          align: 'center',
        }),
        rect(190, bottom - 380, 700, 380, t.shade('secondary', theme.ink), {
          name: 'Envelope back',
          cornerRadius: 30,
        }),
        t.list('names').map((name, index) => {
          const [x, y, degrees] = CARDS[index] ?? CARDS[0];
          return reviewCard(
            look,
            x,
            y + shift,
            560,
            { name, photo: PHOTOS[index] ?? PHOTOS[0], quote: quotes[index] ?? '' },
            degrees,
          );
        }),
        poly(
          [
            [190, bottom - 300],
            [540, bottom - 120],
            [890, bottom - 300],
            [890, bottom],
            [190, bottom],
          ],
          t.color('secondary'),
          { name: 'Envelope front' },
        ),
        poly(
          [
            [190, bottom],
            [540, bottom - 170],
            [890, bottom],
          ],
          t.shade('secondary', theme.ink),
          { name: 'Envelope fold' },
        ),
        starShape(860, 330 + shift, 110, t.color('surface')),
        starShape(90, bottom - 520, 80, t.color('surface')),
      ];
    },
  );

export const userEnvelope = (theme: ReviewTheme): Template => envelope(theme, PH, false);

export const userStory = (theme: ReviewTheme): Template => envelope(theme, STORY_SIZE.height, true);
