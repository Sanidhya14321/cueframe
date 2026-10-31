import { linear, radial } from '@/design';
import {
  circle,
  ellipse,
  poly,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { backdrop, CLEAR, H, HEADING, VOLT, W } from './posts';

const bigWords = (name: string, accent: string, deep: string) => {
  const spec = {
    colors: {
      background: { value: VOLT.black, hint: 'Dark top of the page and the fold shadow' },
      primary: {
        value: accent,
        hint: 'Glow at the bottom of the page, the light beam, the orb and the floor glow',
      },
      text: {
        value: VOLT.white,
        hint: 'Filled words; its translucent shade outlines the middle word',
      },
    },
    fonts: { heading: HEADING },
    copy: { word: { label: 'Word', value: name } },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => {
    const line = (y: number, fill: string, stroke: { stroke?: string; strokeWidth?: number }) =>
      text(t.copy('word'), 70, y, 960, {
        fontFamily: t.font('heading'),
        fontSize: 156,
        fontWeight: 800,
        italic: true,
        fill,
        lineHeight: 1,
        ...stroke,
      });
    const glow = t.color('primary');
    return [
      rect(
        0,
        0,
        W,
        H,
        linear(180, t.color('background'), t.color('background'), t.shade('primary', deep)),
        { name: 'Background' },
      ),
      poly(
        [
          [610, 0],
          [650, 0],
          [600, H],
          [560, H],
        ],
        linear(
          90,
          t.shade('background', CLEAR),
          t.shade('background', 'rgba(0,0,0,0.6)'),
          t.shade('background', CLEAR),
        ),
        { name: 'Crease' },
      ),
      line(300, t.color('text'), {}),
      line(500, t.shade('text', CLEAR), {
        stroke: t.shade('text', 'rgba(255,255,255,0.8)'),
        strokeWidth: 3,
      }),
      line(700, t.color('text'), {}),
      rect(0, 574, 330, 8, linear(90, t.shade('primary', CLEAR), glow), { name: 'Beam' }),
      circle(380, 578, 66, radial(t.shade('primary', VOLT.white), glow), {
        name: 'Orb',
        ...shadow(70, 0, glow),
      }),
      ellipse(240, 1180, 600, 120, radial(glow, t.shade('primary', CLEAR)), {
        name: 'Floor glow',
      }),
    ];
  });
};

const launchPoster = (height: number) => {
  const dy = (height - H) / 2;
  const spec = {
    colors: {
      background: { value: VOLT.black, hint: 'Dark top of the page' },
      primary: {
        value: VOLT.blue,
        hint: 'Page glow, the bottom of LAUNCH, the flame tail, the fins, stripe, window and the smoke clouds',
      },
      surface: {
        value: VOLT.white,
        hint: 'Rocket body and the top of the flame; its cool shades color the body edges',
      },
      text: { value: VOLT.white, hint: 'New Product, the top of LAUNCH and the date' },
    },
    fonts: { heading: HEADING, display: { label: 'Display font', value: 'Anton' } },
    copy: {
      kicker: { label: 'Kicker', value: 'New Product' },
      title: { label: 'Title', value: 'LAUNCH' },
      date: { label: 'Date', value: '10.24.27' },
    },
  } as const satisfies ThemeSpec;
  return themed(W, height, spec, (t) => {
    const sky = t.shade('primary', VOLT.sky);
    const blue = t.color('primary');
    const puff = (cx: number, cy: number, radius: number) =>
      circle(
        cx,
        cy + dy,
        radius,
        radial(t.shade('primary', '#c7dbff'), blue, t.shade('primary', '#1d3fa8')),
        { name: 'Smoke' },
      );
    const fin = (points: [number, number][]) =>
      poly(
        points.map(([x, y]) => [x, y + dy] as const),
        linear(180, sky, blue),
        { name: 'Fin' },
      );
    return [
      backdrop(height, t.color('background'), t.shade('primary', '#1b3d99')),
      text(t.copy('kicker'), 130, 150 + dy, 500, {
        fontFamily: t.font('heading'),
        fontSize: 52,
        fontWeight: 400,
        italic: true,
        fill: t.color('text'),
      }),
      text(t.copy('title'), 0, 200 + dy, W, {
        fontFamily: t.font('display'),
        fontSize: 270,
        fontWeight: 400,
        italic: true,
        fill: linear(180, t.color('text'), sky),
        align: 'center',
        lineHeight: 1,
      }),
      ellipse(
        490,
        860 + dy,
        100,
        200,
        linear(180, t.color('surface'), sky, t.shade('primary', CLEAR)),
        {
          name: 'Flame',
        },
      ),
      fin([
        [470, 640],
        [370, 800],
        [380, 900],
        [475, 820],
      ]),
      fin([
        [610, 640],
        [710, 800],
        [700, 900],
        [605, 820],
      ]),
      ellipse(
        450,
        330 + dy,
        180,
        560,
        linear(
          90,
          t.shade('surface', '#b9c8ef'),
          t.color('surface'),
          t.shade('surface', '#a8b8e6'),
        ),
        { name: 'Rocket body', ...shadow(40, 0, t.shade('primary', 'rgba(61,123,255,0.6)')) },
      ),
      rect(452, 470 + dy, 176, 26, blue, { name: 'Stripe' }),
      circle(540, 590 + dy, 50, t.shade('primary', VOLT.navy), {
        name: 'Window',
        stroke: sky,
        strokeWidth: 12,
      }),
      rect(528, 760 + dy, 24, 170, blue, { name: 'Centre fin', cornerRadius: 12 }),
      text(t.copy('date'), 720, 520 + dy, 300, {
        fontFamily: t.font('heading'),
        fontSize: 46,
        fontWeight: 600,
        italic: true,
        fill: t.color('text'),
      }),
      puff(200, 1240, 110),
      puff(880, 1240, 110),
      puff(330, 1170, 150),
      puff(750, 1170, 150),
      puff(540, 1130, 180),
      puff(430, 1250, 100),
      puff(650, 1250, 100),
    ];
  });
};

export const wordsBlue = bigWords('Kestrel AI', VOLT.blue, '#14307d');
export const wordsGreen = bigWords('Vela AI', VOLT.mint, '#064e3b');
export const launchPost = launchPoster(H);
export const launchStory = launchPoster(STORY_SIZE.height);
