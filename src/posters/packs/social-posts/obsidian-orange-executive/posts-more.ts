import { linear } from '@/design';
import { icon, photo, poly, rect, type ThemeSpec, themed } from '../../../kit';
import { button, copy, DISPLAY, display, H, head, MAIN, SCRIPT, VG, W } from './posts';

const funnelSpec = {
  colors: {
    background: { value: VG.black, hint: 'Page' },
    primary: {
      value: VG.orange,
      hint: 'Funnel stages; its shades give each stage its own orange',
    },
    text: { value: VG.white, hint: 'Title and stage labels; its shade colors the footer line' },
  },
  fonts: { main: MAIN },
  copy: {
    title: { label: 'Title', value: 'Winning Funnel' },
    stages: {
      label: 'Stage',
      value: ['Show Value Fast', 'Capture Attention', 'Spark Real Desire', 'Close the Deal'],
    },
    footer: { label: 'Footer', value: 'Four stages. One clear path to revenue.' },
  },
} as const satisfies ThemeSpec;

const STAGE_FILLS = [VG.orangeLight, VG.orange, VG.orangeDeep, '#a83a08'] as const;

export const funnel = themed(W, H, funnelSpec, (t) => {
  const heading = head(t.font('main'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    heading(t.copy('title'), 0, 100, W, 82, t.color('text'), 800, { align: 'center' }),
    t.list('stages').map((label, index) => {
      const top = 900 - index * 180;
      const bottom = top - 180;
      const y = 270 + index * 214;
      return [
        poly(
          [
            [540 - top / 2, y],
            [540 + top / 2, y],
            [540 + bottom / 2, y + 190],
            [540 - bottom / 2, y + 190],
          ],
          t.shade('primary', STAGE_FILLS[index % STAGE_FILLS.length] ?? VG.orange),
          { name: 'Funnel stage' },
        ),
        heading(label, 0, y + 70, W, 36, t.color('text'), 600, { align: 'center' }),
      ];
    }),
    copy(t.font('main'))(t.copy('footer'), 0, 1200, W, 32, t.shade('text', VG.grey), {
      align: 'center',
    }),
  ];
});

const statSpec = {
  colors: {
    background: {
      value: VG.orangeDeep,
      hint: 'Bottom of the page gradient; its lighter shade colors the top',
    },
    text: { value: VG.white, hint: 'Every line of text and the rule' },
  },
  fonts: { display: DISPLAY, main: MAIN },
  copy: {
    hashtag: { label: 'Hashtag', value: '#GainInsights' },
    intro: { label: 'Intro', value: 'The training and software\nmarket is projected to reach' },
    stat: { label: 'Stat', value: '$24B' },
    source: { label: 'Source', value: 'Industry outlook 2027' },
    handle: { label: 'Handle', value: 'vantor.group' },
  },
} as const satisfies ThemeSpec;

export const bigStat = themed(W, H, statSpec, (t) => {
  const body = copy(t.font('main'));
  const ink = t.color('text');
  return [
    rect(0, 0, W, H, linear(165, t.shade('background', VG.orangeLight), t.color('background')), {
      name: 'Background',
    }),
    body(t.copy('hashtag'), 580, 100, 410, 30, ink, { align: 'right', fontWeight: 600 }),
    body(t.copy('intro'), 90, 380, 900, 42, ink, { fontWeight: 500, lineHeight: 1.3 }),
    display(t.font('display'))(t.copy('stat'), 76, 540, 1000, 480, ink),
    rect(90, 1130, 900, 3, t.shade('text', 'rgba(255,255,255,0.6)'), { name: 'Rule' }),
    body(t.copy('source'), 90, 1170, 500, 28, ink),
    body(t.copy('handle'), 590, 1170, 400, 28, ink, { align: 'right', fontWeight: 600 }),
  ];
});

const standSpec = {
  colors: {
    background: { value: VG.paper, hint: 'Page' },
    primary: { value: VG.orange, hint: 'from the crowd and the stripe above the photo' },
    text: {
      value: VG.black,
      hint: 'STAND OUT and the tagline; its shade darkens the bottom of the photo',
    },
    secondary: { value: VG.white, hint: 'Handle over the photo' },
  },
  fonts: { display: DISPLAY, script: SCRIPT, main: MAIN },
  copy: {
    title: { label: 'Title', value: 'STAND OUT' },
    script: { label: 'Script line', value: 'from the crowd' },
    tagline: { label: 'Tagline', value: 'BE THE NAME THEY REMEMBER' },
    handle: { label: 'Handle', value: 'vantor.group' },
  },
} as const satisfies ThemeSpec;

export const standOut = themed(W, H, standSpec, (t) => {
  const body = copy(t.font('main'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    display(t.font('display'))(t.copy('title'), 0, 90, W, 200, t.color('text'), {
      align: 'center',
    }),
    head(t.font('script'))(t.copy('script'), 0, 300, W, 120, t.color('primary'), 400, {
      align: 'center',
      lineHeight: 1,
    }),
    body(t.copy('tagline'), 0, 450, W, 34, t.color('text'), {
      align: 'center',
      fontWeight: 700,
      letterSpacing: 4,
    }),
    rect(0, 560, W, 14, t.color('primary'), { name: 'Stripe' }),
    photo('team-3', 0, 574, W, 776, { crop: { zoom: 1, focusX: 0.5, focusY: 0.4 } }),
    rect(
      0,
      1150,
      W,
      200,
      linear(180, t.shade('text', 'rgba(12,12,12,0)'), t.shade('text', 'rgba(12,12,12,0.75)')),
      { name: 'Shade' },
    ),
    body(t.copy('handle'), 0, 1260, W, 28, t.color('secondary'), {
      align: 'center',
      fontWeight: 600,
    }),
  ];
});

const aiSpec = {
  colors: {
    background: { value: VG.black, hint: 'Page and the button label' },
    primary: { value: VG.orange, hint: 'Highlighted people and the Read the Report button' },
    text: {
      value: VG.white,
      hint: 'Four out of 5; its shades color the rest of the headline, the muted people and the source line',
    },
  },
  fonts: { main: MAIN },
  copy: {
    title: { label: 'Headline', value: 'Four out of 5' },
    statement: { label: 'Statement', value: 'businesses use AI\nin their daily\nworkflows' },
    source: { label: 'Source', value: 'Source: Vantor Workplace Study 2027' },
    button: { label: 'Button', value: 'Read the Report' },
  },
} as const satisfies ThemeSpec;

export const aiStat = themed(W, H, aiSpec, (t) => {
  const heading = head(t.font('main'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    heading(t.copy('title'), 90, 110, 900, 84, t.color('text'), 800),
    heading(t.copy('statement'), 90, 210, 900, 84, t.shade('text', '#6f6a66'), 800, {
      lineHeight: 1.1,
    }),
    Array.from({ length: 10 }, (_, index) =>
      icon(
        'user-round',
        90 + (index % 5) * 190,
        640 + Math.floor(index / 5) * 220,
        140,
        index % 5 === 4 ? t.shade('text', '#4a4643') : t.color('primary'),
        { strokeWidth: 2.2 },
      ),
    ),
    copy(t.font('main'))(t.copy('source'), 90, 1110, 900, 28, t.shade('text', VG.grey)),
    button(t.copy('button'), 90, 1180, t.color('primary'), t.color('background'), t.font('main')),
  ];
});

const marketSpec = {
  colors: {
    background: { value: VG.black, hint: 'Page and the fade over the top of the photo' },
    primary: { value: VG.orange, hint: 'Trends and the side hashtag' },
    text: { value: VG.white, hint: 'MAR and KET' },
  },
  fonts: { script: SCRIPT, display: DISPLAY },
  copy: {
    script: { label: 'Script line', value: 'Trends' },
    top: { label: 'Title start', value: 'MAR' },
    bottom: { label: 'Title end', value: 'KET' },
    tag: { label: 'Side hashtag', value: '#vantorgroup' },
  },
} as const satisfies ThemeSpec;

const marketTrends = (height: number) =>
  themed(W, height, marketSpec, (t) => {
    const tall = height > 1500;
    const top = tall ? 260 : 90;
    const photoTop = tall ? 820 : 560;
    const big = display(t.font('display'));
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      photo('man-portrait-2', 0, photoTop, W, height - photoTop, {
        crop: { zoom: 1, focusX: 0.5, focusY: 0.2 },
      }),
      rect(
        0,
        photoTop,
        W,
        320,
        linear(180, t.color('background'), t.shade('background', 'rgba(12,12,12,0)')),
        { name: 'Fade' },
      ),
      head(t.font('script'))(t.copy('script'), 0, top, W, 100, t.color('primary'), 400, {
        align: 'center',
        lineHeight: 1,
      }),
      big(t.copy('top'), 0, top + 120, W, 330, t.color('text'), {
        align: 'center',
        lineHeight: 0.92,
      }),
      big(t.copy('bottom'), 0, top + 420, W, 330, t.color('text'), {
        align: 'center',
        lineHeight: 0.92,
      }),
      copy(t.font('display'))(t.copy('tag'), 1000, height - 120, 420, 30, t.color('primary'), {
        rotation: -90,
        fontWeight: 600,
        letterSpacing: 4,
      }),
    ];
  });

export const marketPost = marketTrends(H);
export const marketStory = marketTrends(1920);
