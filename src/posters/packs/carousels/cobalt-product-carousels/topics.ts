import {
  circle,
  icon,
  photo,
  rect,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import { trail } from '../coral-tide-carousels/slide-kit';
import { BRAND, brandLine, COBALT, H, HEADING_FONT, inkBackground, W } from './palette';

const tag = (label: string, x: number, y: number, fill: string, color: string, font: string) => {
  const width = label.length * 40 * 0.6 + 56;
  return [
    rect(x, y, width, 76, fill, { cornerRadius: 8, name: 'Tag' }),
    text(label, x, y + 14, width, {
      fontFamily: font,
      fontSize: 40,
      fontWeight: 800,
      fill: color,
      align: 'center',
    }),
  ];
};

const coverSpec = {
  colors: {
    background: { value: COBALT.ink, hint: 'Page and the tag text' },
    primary: { value: COBALT.sky, hint: 'Swoosh and the tag' },
    text: { value: COBALT.white, hint: 'Brand line, the headline and the arrow' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    brand: BRAND,
    tag: { label: 'Tag', value: 'Product Mindset' },
    headline: { label: 'Headline', value: '4 Ways to Train\nYour Team to Think\nProduct First' },
  },
} as const satisfies ThemeSpec;

const mindsetCover = themed(W, H, coverSpec, (t) => [
  inkBackground(t.color('background')),
  trail(
    'M20 360 C200 420 420 300 400 160 C385 60 260 40 200 110',
    560,
    60,
    480,
    440,
    t.color('primary'),
    t.shade('primary', 'rgba(0,0,0,0)'),
    64,
  ),
  brandLine(t.copy('brand'), 80, 160, t.color('text'), t.font('heading')),
  tag(t.copy('tag'), 80, 600, t.color('primary'), t.color('background'), t.font('heading')),
  text(t.copy('headline'), 80, 720, 920, {
    fontFamily: t.font('heading'),
    fontSize: 76,
    fontWeight: 800,
    fill: t.color('text'),
    lineHeight: 1.15,
  }),
  icon('arrow-right', 900, 1110, 100, t.color('text'), { strokeWidth: 2.8 }),
]);

type Layout = 'trio' | 'duo' | 'single';

const FRAMES: Record<Layout, readonly (readonly [number, number, number, number])[]> = {
  trio: [
    [80, 540, 300, 700],
    [400, 540, 600, 340],
    [400, 900, 600, 340],
  ],
  duo: [
    [80, 540, 450, 700],
    [550, 540, 450, 700],
  ],
  single: [[80, 540, 920, 700]],
};

const topic = (
  label: string,
  headline: string,
  layout: Layout,
  progress: number,
  photos: readonly PosterPhotoName[],
) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: COBALT.ink, hint: 'Page and the tag text' },
        primary: { value: COBALT.sky, hint: 'Tag and the progress dot' },
        text: { value: COBALT.white, hint: 'Headline and the progress track' },
      },
      fonts: { heading: HEADING_FONT },
      copy: {
        tag: { label: 'Tag', value: label },
        headline: { label: 'Headline', value: headline },
      },
    } as const satisfies ThemeSpec,
    (t) => [
      inkBackground(t.color('background')),
      tag(t.copy('tag'), 80, 140, t.color('primary'), t.color('background'), t.font('heading')),
      text(t.copy('headline'), 80, 270, 920, {
        fontFamily: t.font('heading'),
        fontSize: 60,
        fontWeight: 700,
        fill: t.color('text'),
        lineHeight: 1.18,
      }),
      rect(80, 460, 920, 6, t.color('text'), { cornerRadius: 3, name: 'Progress track' }),
      circle(80 + 920 * progress, 463, 16, t.color('primary')),
      FRAMES[layout].map(([x, y, width, height], index) =>
        photo(photos[index % photos.length] ?? 'workspace-1', x, y, width, height, {
          cornerRadius: 28,
        }),
      ),
    ],
  );

export const MINDSET_SERIES: readonly Template[] = [
  mindsetCover,
  topic(
    'Knowledge',
    'Learn your product inside out:\nfeatures, limits and strengths.',
    'trio',
    0.25,
    ['designer-tablet', 'laptop-analytics', 'workspace-1'],
  ),
  topic('Objective', 'Make goals visible at every\nlevel of the team.', 'duo', 0.5, [
    'meeting-1',
    'team-1',
  ]),
  topic('Strategy', 'Shape the roadmap together,\nnot behind closed doors.', 'single', 0.75, [
    'team-3',
  ]),
  topic('Planning', 'Turn the plan into weekly\nwork everyone can see.', 'duo', 1, [
    'desk-imac',
    'team-2',
  ]),
];
