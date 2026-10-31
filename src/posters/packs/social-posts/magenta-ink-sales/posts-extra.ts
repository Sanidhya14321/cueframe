import { linear } from '@/design';
import { icon, photo, poly, rect, rotateNodes, type ThemeSpec, themed } from '../../../kit';
import {
  BL,
  BODY,
  bold,
  brandingMistakes,
  campaignInsights,
  chatHero,
  copy,
  createBrands,
  H,
  HANDLE,
  HEADING,
  handle,
  heavy,
  W,
} from './posts';
import { boostViews, heyYou, mythTruth, rightLeads } from './posts-more';

const checklistSpec = {
  colors: {
    primary: {
      value: BL.magenta,
      hint: 'Page gradient and the check marks; its darker shade is the bottom of the gradient',
    },
    surface: { value: BL.white, hint: 'Note card and the Save this line' },
    text: {
      value: BL.ink,
      hint: 'Card behind the note, the back arrow, Notes, the title, the checklist items and the handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    back: { label: 'Back label', value: 'Notes' },
    title: { label: 'Title', value: 'Sales & Marketing\nDaily Checklist' },
    items: {
      label: 'Checklist item',
      value: [
        'Define your audience',
        'Sharpen the message',
        'Make a clear offer',
        'Track every result',
      ],
    },
    closing: { label: 'Closing line', value: 'Save this for Monday' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const dailyChecklist = themed(W, H, checklistSpec, (t) => {
  const body = copy(t.font('body'));
  return [
    rect(0, 0, W, H, linear(170, t.color('primary'), t.shade('primary', BL.magentaDeep)), {
      name: 'Background',
    }),
    rotateNodes(-8, 540, 640, [rect(190, 230, 700, 820, t.color('text'), { cornerRadius: 44 })]),
    rotateNodes(-3, 540, 640, [
      rect(190, 230, 700, 820, t.color('surface'), { cornerRadius: 44, name: 'Note card' }),
      icon('arrow-left', 240, 285, 36, t.color('text'), { strokeWidth: 2.6 }),
      body(t.copy('back'), 286, 280, 200, 30, t.color('text')),
      heavy(t.font('heading'))(t.copy('title'), 240, 370, 620, 52, t.color('text')),
      t.list('items').map((item, index) => [
        icon('circle-check', 240, 560 + index * 110, 56, t.color('primary'), {
          strokeWidth: 2.4,
        }),
        body(item, 320, 566 + index * 110, 540, 38, t.color('text')),
      ]),
    ]),
    bold(t.font('heading'))(t.copy('closing'), 0, 1160, W, 44, t.color('surface'), {
      align: 'center',
    }),
    handle(t.copy('handle'), 1240, t.color('text'), t.font('body')),
  ];
});

const BADGES = [
  { value: '20%', label: 'Higher\nretention' },
  { value: '3x', label: 'More\nqualified leads' },
  { value: '95%', label: 'Client\nsatisfaction' },
] as const;

const customerInsights = (height: number) =>
  themed(
    W,
    height,
    {
      colors: {
        background: { value: BL.ink, hint: 'Page and the fade over the photo' },
        primary: { value: BL.magenta, hint: 'into Insights and the stat badges' },
        text: {
          value: BL.white,
          hint: 'Turning Customer Data and the stat numbers and labels; its grey shade colors the handle',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'Turning\nCustomer Data' },
        highlight: { label: 'Highlighted line', value: 'into Insights' },
        values: { label: 'Stat', value: BADGES.map((badge) => badge.value) },
        labels: { label: 'Stat label', value: BADGES.map((badge) => badge.label) },
        handle: HANDLE,
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const top = height - 700;
      const heading = heavy(t.font('heading'));
      const labels = t.list('labels');
      return [
        rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
        photo('meeting-1', 0, 0, W, top + 190, { crop: { zoom: 1, focusX: 0.5, focusY: 0.4 } }),
        rect(
          0,
          top - 300,
          W,
          492,
          linear(180, t.shade('background', 'rgba(18,18,18,0)'), t.color('background')),
          { name: 'Fade' },
        ),
        bold(t.font('heading'))(t.copy('title'), 90, top, 900, 80, t.color('text'), {
          lineHeight: 1.1,
        }),
        heading(t.copy('highlight'), 90, top + 180, 900, 80, t.color('primary')),
        t.list('values').map((value, index) => {
          const x = 90 + index * 310;
          return [
            rect(x, top + 330, 280, 210, t.color('primary'), {
              cornerRadius: 28,
              name: 'Stat badge',
            }),
            poly(
              [
                [x + 110, top + 538],
                [x + 170, top + 538],
                [x + 140, top + 572],
              ],
              t.color('primary'),
              { name: 'Badge pointer' },
            ),
            heading(value, x, top + 350, 280, 76, t.color('text'), { align: 'center' }),
            copy(t.font('body'))(labels[index] ?? '', x, top + 440, 280, 24, t.color('text'), {
              align: 'center',
              lineHeight: 1.25,
            }),
          ];
        }),
        handle(t.copy('handle'), height - 90, t.shade('text', BL.grey), t.font('body')),
      ];
    },
  );

export const insightsPost = customerInsights(H);
export const insightsStory = customerInsights(1920);

export const POSTS = [
  brandingMistakes,
  createBrands,
  campaignInsights,
  chatHero,
  heyYou,
  boostViews,
  rightLeads,
  mythTruth,
  dailyChecklist,
];
