import { type Fill, linear } from '@/design';
import { avatar, icon, type Nodes, rating, rect, shadow, text, themed } from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import { BODY, BRAND, brand, glow, H, HEADING, ROSE, roseFill, W } from './posts';

const REVIEW_PHOTOS: readonly PosterPhotoName[] = [
  'man-portrait-3',
  'woman-portrait-5',
  'woman-portrait-2',
];

export const clientReviews = themed(
  W,
  H,
  {
    colors: {
      background: { value: ROSE.black, hint: 'Page' },
      surface: {
        value: '#33243a',
        hint: 'Front review card; its darker shades color the back cards and the bottom of every card',
      },
      primary: {
        value: ROSE.rose,
        hint: 'Glow and the second title line; its pink shade colors the card borders, photo rings, stars and the pink placeholder bars',
      },
      text: {
        value: ROSE.white,
        hint: 'First title line, reviewer name, the rule, grey placeholder bars and the brand; its pink tint colors the quote',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      intro: { label: 'Intro', value: 'See why teams' },
      title: { label: 'Title', value: 'love working with us' },
      name: { label: 'Reviewer', value: 'Ava Brennan' },
      quote: {
        label: 'Quote',
        value: 'The cleanest tool our\nteam has used. Setup\ntook one afternoon.',
      },
      brand: BRAND,
    },
  },
  (t) => {
    const card = (index: number): Nodes[] => {
      const x = 90 + index * 170;
      const y = 660 - index * 100;
      const front = index === REVIEW_PHOTOS.length - 1;
      return [
        rect(
          x,
          y,
          460,
          460,
          linear(
            160,
            front ? t.color('surface') : t.shade('surface', '#241a29'),
            t.shade('surface', '#150f18'),
          ),
          {
            cornerRadius: 30,
            stroke: t.shade('primary', front ? 'rgba(255,156,191,0.75)' : 'rgba(255,156,191,0.35)'),
            strokeWidth: 2,
            name: 'Review card',
            ...shadow(40, 20, 'rgba(0,0,0,0.6)'),
          },
        ),
        avatar(
          REVIEW_PHOTOS[index] ?? 'man-portrait-3',
          x + 80,
          y + 90,
          46,
          t.shade('primary', ROSE.pink),
        ),
        front
          ? [
              text(t.copy('name'), x + 146, y + 60, 290, {
                fontFamily: t.font('heading'),
                fontSize: 32,
                fontWeight: 800,
                fill: t.color('text'),
              }),
              rating(x + 148, y + 108, 24, 5, t.shade('primary', ROSE.pink)),
              rect(x + 40, y + 180, 380, 2, t.shade('text', 'rgba(255,255,255,0.12)'), {
                name: 'Rule',
              }),
              text(t.copy('quote'), x + 40, y + 216, 390, {
                fontFamily: t.font('body'),
                fontSize: 30,
                fontWeight: 500,
                fill: t.shade('text', ROSE.pale),
                lineHeight: 1.45,
              }),
            ]
          : [
              rect(x + 146, y + 70, 150, 22, t.shade('text', 'rgba(255,255,255,0.18)'), {
                cornerRadius: 11,
              }),
              rect(x + 146, y + 108, 110, 18, t.shade('primary', 'rgba(255,156,191,0.4)'), {
                cornerRadius: 9,
              }),
            ],
      ];
    };
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      glow((exact) => t.shade('primary', exact), 540, 820, 460, 0.4),
      text(t.copy('intro'), 0, 150, W, {
        fontFamily: t.font('heading'),
        fontSize: 70,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('title'), 0, 232, W, {
        fontFamily: t.font('heading'),
        fontSize: 70,
        fontWeight: 800,
        fill: roseFill(t.color('primary'), t.shade('primary', ROSE.pink)),
        align: 'center',
      }),
      REVIEW_PHOTOS.map((_, index) => card(index)),
      brand(t.copy('brand'), t.font('heading'), 1220, t.color('text')),
    ];
  },
);

const folderShape = (x: number, y: number, width: number, fill: Fill) => [
  rect(x, y, width * 0.42, width * 0.18, fill, { cornerRadius: width * 0.05, name: 'Folder tab' }),
  rect(x, y + width * 0.1, width, width * 0.7, fill, {
    cornerRadius: width * 0.07,
    name: 'Folder',
    ...shadow(30, 14, 'rgba(0,0,0,0.5)'),
  }),
];

const SIDE_FOLDERS = [
  { x: 60, y: 170 },
  { x: 820, y: 130 },
  { x: 40, y: 690 },
  { x: 850, y: 640 },
];

export const folderHero = themed(
  W,
  H,
  {
    colors: {
      background: {
        value: ROSE.black,
        hint: 'Page; its lighter shade colors the top of the page',
      },
      surface: {
        value: '#4a3f4f',
        hint: 'Side folders; its darker shade colors their bottom edge',
      },
      primary: {
        value: ROSE.rose,
        hint: 'Glow and the front folder; its pink shade colors the folder top and the open folder icon',
      },
      text: {
        value: ROSE.white,
        hint: 'First message line and the brand; its tints color the second line and the folder labels',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      folders: {
        label: 'Folder label',
        value: ['Brand Kit', 'Launch Plan', 'Contracts', 'Analytics'],
      },
      title: { label: 'Title', value: 'Keep every project' },
      subtitle: { label: 'Second line', value: 'organized and\npurpose-driven.' },
      brand: BRAND,
    },
  },
  (t) => {
    const labels = t.list('folders');
    return [
      rect(0, 0, W, H, linear(160, t.shade('background', '#1d1420'), t.color('background')), {
        name: 'Background',
      }),
      glow((exact) => t.shade('primary', exact), 540, 520, 360, 0.45),
      SIDE_FOLDERS.map((item, index) => [
        folderShape(
          item.x,
          item.y,
          190,
          linear(180, t.color('surface'), t.shade('surface', '#231c27')),
        ),
        text(labels[index] ?? '', item.x - 20, item.y + 170, 230, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 500,
          fill: t.shade('text', ROSE.grey),
          align: 'center',
        }),
      ]),
      folderShape(370, 380, 340, linear(160, t.shade('primary', ROSE.pink), t.color('primary'))),
      text(t.copy('title'), 0, 760, W, {
        fontFamily: t.font('heading'),
        fontSize: 50,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
      }),
      text(t.copy('subtitle'), 0, 828, W, {
        fontFamily: t.font('heading'),
        fontSize: 50,
        fontWeight: 400,
        fill: t.shade('text', ROSE.pale),
        align: 'center',
        lineHeight: 1.2,
      }),
      icon('folder-open', 500, 1030, 80, t.shade('primary', ROSE.pink), { strokeWidth: 1.8 }),
      brand(t.copy('brand'), t.font('heading'), 1220, t.color('text')),
    ];
  },
);
