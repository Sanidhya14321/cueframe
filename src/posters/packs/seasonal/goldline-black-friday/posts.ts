import {
  circle,
  ellipse,
  group,
  line,
  POST_SIZE,
  pill,
  poly,
  rect,
  rotateNodes,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';

export interface SalePalette {
  main: string;
  ink: string;
  paper: string;
  dim: string;
  onMain: string;
}

export const GOLD: SalePalette = {
  main: '#ffc400',
  ink: '#0a0a0a',
  paper: '#ffffff',
  dim: '#2b2b2b',
  onMain: '#0a0a0a',
};

export const VIOLET: SalePalette = {
  main: '#8b5cf6',
  ink: '#120a24',
  paper: '#ffffff',
  dim: '#2e2546',
  onMain: '#ffffff',
};

export const DISPLAY = { label: 'Display font', value: 'Archivo Black' } as const;
export const CONDENSED = { label: 'Condensed font', value: 'Anton' } as const;
export const BODY = { label: 'Body font', value: 'Montserrat' } as const;
export const { width: W, height: H } = POST_SIZE;

export const tag = (
  label: string,
  x: number,
  y: number,
  rotation: number,
  fill: string,
  color: string,
  fontFamily: string,
) => {
  const width = label.length * 20 + 44;
  return group(
    rotateNodes(rotation, x + width / 2, y + 28, [
      rect(x, y, width, 56, fill, { cornerRadius: 6, name: `${label} tag` }),
      text(label, x, y + 9, width, {
        fontFamily,
        fontSize: 30,
        fontWeight: 800,
        fill: color,
        align: 'center',
      }),
    ]),
  );
};

export const centered = (
  content: string,
  y: number,
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  fill: string,
  style: Parameters<typeof text>[4] = {},
) =>
  text(content, 0, y, W, {
    fontFamily,
    fontSize,
    fontWeight,
    fill,
    align: 'center',
    ...style,
  });

export const saleMegaphone = (p: SalePalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.main, hint: 'Page' },
        primary: {
          value: p.ink,
          hint: 'Kicker, title, event name, offer line, the megaphone and the percent badges; its lighter shades color the megaphone rim and mouth',
        },
        surface: {
          value: p.paper,
          hint: 'Percent signs; its translucent shade is the megaphone highlight',
        },
      },
      fonts: { display: DISPLAY, body: BODY },
      copy: {
        kicker: { label: 'Kicker', value: 'Only for 24 hours' },
        title: { label: 'Title', value: 'SALE' },
        badge: { label: 'Badge symbol', value: '%', hint: 'Shown on both round badges' },
        event: { label: 'Event', value: 'Black Friday' },
        offer: { label: 'Offer', value: 'Save up to 70% sitewide' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const percentBadge = (cx: number, cy: number, r: number) => [
        circle(cx, cy, r, t.color('primary')),
        text(t.copy('badge'), cx - r, cy - r * 0.62, r * 2, {
          fontFamily: t.font('display'),
          fontSize: r * 1.05,
          fontWeight: 400,
          fill: t.color('surface'),
          align: 'center',
        }),
      ];
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        centered(t.copy('kicker'), 70, t.font('body'), 32, 700, t.color('primary')),
        centered(t.copy('title'), 120, t.font('display'), 300, 400, t.color('primary'), {
          lineHeight: 1,
        }),
        poly(
          [
            [330, 600],
            [740, 420],
            [740, 940],
            [330, 760],
          ],
          t.color('primary'),
          { name: 'Megaphone cone' },
        ),
        ellipse(690, 420, 110, 520, t.shade('primary', '#262626'), { name: 'Megaphone rim' }),
        ellipse(710, 450, 70, 460, t.shade('primary', '#3f3f46'), { name: 'Megaphone mouth' }),
        rect(250, 600, 100, 160, t.color('primary'), { cornerRadius: 24, name: 'Megaphone back' }),
        rect(400, 770, 70, 190, t.color('primary'), {
          cornerRadius: 18,
          rotation: -12,
          name: 'Megaphone grip',
        }),
        rect(380, 620, 300, 14, t.shade('surface', 'rgba(255,255,255,0.18)'), {
          cornerRadius: 7,
          rotation: -22,
          name: 'Highlight',
        }),
        percentBadge(190, 520, 70),
        percentBadge(860, 960, 56),
        centered(t.copy('event'), 1060, t.font('display'), 92, 400, t.color('primary')),
        centered(t.copy('offer'), 1200, t.font('body'), 36, 700, t.color('primary')),
      ];
    },
  );

export const stackedWords = (p: SalePalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.ink, hint: 'Page and the tag text' },
        secondary: { value: p.dim, hint: 'Giant first and second words in the backdrop' },
        accent: { value: p.main, hint: 'First word in front and the tag' },
        surface: {
          value: p.paper,
          hint: 'Date, second word in front, the offer line and the star',
        },
      },
      fonts: { heading: CONDENSED, body: BODY },
      copy: {
        date: { label: 'Date', value: 'NOVEMBER 27' },
        first: { label: 'First word', value: 'BLACK', hint: 'Shown as the backdrop and in front' },
        second: {
          label: 'Second word',
          value: 'FRIDAY',
          hint: 'Shown as the backdrop and in front',
        },
        tag: { label: 'Tag', value: 'Sale' },
        offer: { label: 'Offer', value: 'UP TO 70% OFF' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const heading = t.font('heading');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        centered(t.copy('date'), 70, t.font('body'), 32, 800, t.color('surface'), {
          letterSpacing: 4,
        }),
        centered(t.copy('first'), 130, heading, 320, 400, t.color('secondary'), { lineHeight: 1 }),
        centered(t.copy('first'), 470, heading, 180, 400, t.color('accent'), { lineHeight: 1 }),
        centered(t.copy('second'), 650, heading, 150, 400, t.color('surface'), { lineHeight: 1 }),
        tag(t.copy('tag'), 640, 780, -10, t.color('accent'), t.color('background'), t.font('body')),
        centered(t.copy('second'), 820, heading, 320, 400, t.color('secondary'), { lineHeight: 1 }),
        centered(t.copy('offer'), 1210, t.font('body'), 40, 800, t.color('surface'), {
          letterSpacing: 3,
        }),
        star(5, 880, 1170, 110, t.color('surface'), { innerRatio: 0.42 }),
      ];
    },
  );

export const priceTag = (p: SalePalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.main, hint: 'Page, the hole in the tag and the discount pill' },
        primary: { value: p.ink, hint: 'Price tag, its strings and the pins' },
        surface: { value: p.paper, hint: 'Title, the detail line and the stars' },
        text: {
          value: p.onMain,
          hint: 'Kicker, the discount text, the date and the note',
        },
      },
      fonts: { display: DISPLAY, body: BODY },
      copy: {
        kicker: { label: 'Kicker', value: "It's here" },
        title: { label: 'Title', value: 'BLACK\nFRIDAY' },
        discount: { label: 'Discount', value: 'UP TO 50%' },
        detail: { label: 'Detail', value: 'On every product' },
        date: { label: 'Date', value: 'THIS FRIDAY, 27 NOV' },
        note: { label: 'Note', value: 'Doors open at 8 am' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const body = t.font('body');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        centered(t.copy('kicker'), 70, body, 32, 700, t.color('text')),
        circle(90, 240, 14, t.color('primary')),
        circle(990, 240, 14, t.color('primary')),
        line(90, 240, 485, t.color('primary'), 4, { rotation: 21.8 }),
        line(990, 240, 485, t.color('primary'), 4, { rotation: 158.2 }),
        poly(
          [
            [440, 380],
            [640, 380],
            [800, 540],
            [800, 1000],
            [280, 1000],
            [280, 540],
          ],
          t.color('primary'),
          { name: 'Price tag' },
        ),
        circle(540, 450, 24, t.color('background')),
        text(t.copy('title'), 280, 540, 520, {
          fontFamily: t.font('display'),
          fontSize: 92,
          fontWeight: 400,
          fill: t.color('surface'),
          align: 'center',
          lineHeight: 1.05,
        }),
        pill(t.copy('discount'), 380, 790, {
          fill: t.color('background'),
          color: t.color('text'),
          fontSize: 40,
          fontFamily: body,
          fontWeight: 800,
          width: 320,
        }),
        text(t.copy('detail'), 280, 900, 520, {
          fontFamily: body,
          fontSize: 30,
          fontWeight: 600,
          fill: t.color('surface'),
          align: 'center',
        }),
        centered(t.copy('date'), 1050, t.font('display'), 58, 400, t.color('text')),
        centered(t.copy('note'), 1135, body, 32, 600, t.color('text')),
        star(5, 490, 1210, 100, t.color('surface'), { innerRatio: 0.42 }),
        star(5, 840, 120, 90, t.color('surface'), { innerRatio: 0.42 }),
      ];
    },
  );
