import { linear } from '@/design';
import {
  circle,
  ellipse,
  laptop,
  paint,
  poly,
  rect,
  rotateNodes,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, CLEAR, FLARE, glow, H, HEAD, headline, W } from './posts';

const pageSpec = {
  colors: {
    background: { value: FLARE.black, hint: 'Page, the sticker text and the base of the stand' },
    primary: {
      value: FLARE.amber,
      hint: 'is live now and the sticker; its orange shade colors the glow',
    },
    surface: {
      value: '#2a241f',
      hint: 'Laptop body; its darker shade colors the stand',
    },
    accent: {
      value: '#ff8a3d',
      hint: 'Sunset scene on the laptop screen; its shades color the sky, sun and hills',
    },
    text: {
      value: FLARE.white,
      hint: 'New Page; its shades color the site address, the laptop screen frame and the laptop base',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    site: { label: 'Site', value: 'halogen.ai' },
    title: { label: 'Title', value: 'New Page' },
    subtitle: { label: 'Subtitle', value: 'is live now' },
    sticker: { label: 'Sticker', value: 'Visit today!' },
  },
} as const satisfies ThemeSpec;

export const newPage = themed(W, H, pageSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  glow(540, 760, 480, t.shade('primary', 'rgba(255,140,40,0.25)'), t.shade('background', CLEAR)),
  text(t.copy('site'), 0, 90, W, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 500,
    fill: t.shade('text', FLARE.grey),
    align: 'center',
  }),
  headline(t.font('heading'), t.copy('title'), 160, 112, t.color('text'), 800),
  headline(t.font('heading'), t.copy('subtitle'), 280, 112, t.color('primary'), 800),
  ellipse(200, 1090, 680, 110, t.shade('surface', '#1d1713'), { name: 'Stand top' }),
  rect(200, 1145, 680, 140, linear(180, t.shade('surface', '#1d1713'), t.color('background')), {
    name: 'Stand',
  }),
  paint(
    [
      laptop(250, 580, 580, {
        body: t.color('surface'),
        screen: t.shade('text', '#ffffff'),
        content: [
          rect(0, 0, 551, 331, linear(180, t.shade('accent', '#ffcf8a'), t.color('accent')), {
            name: 'Sky',
          }),
          circle(400, 120, 50, t.shade('accent', '#fff3dc'), { name: 'Sun' }),
          poly(
            [
              [0, 230],
              [200, 160],
              [380, 220],
              [551, 170],
              [551, 331],
              [0, 331],
            ],
            t.shade('accent', '#7a3a1a'),
            { name: 'Hill' },
          ),
          poly(
            [
              [0, 290],
              [300, 240],
              [551, 280],
              [551, 331],
              [0, 331],
            ],
            t.shade('accent', '#4a2312'),
            { name: 'Hill' },
          ),
        ],
      }),
    ],
    { '#cbd5e1': t.shade('text', '#cbd5e1') },
  ),
  rotateNodes(-12, 740, 560, [
    rect(740, 560, 230, 70, t.color('primary'), { name: 'Sticker', cornerRadius: 35 }),
    text(t.copy('sticker'), 740, 578, 230, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 700,
      fill: t.color('background'),
      align: 'center',
    }),
  ]),
]);
