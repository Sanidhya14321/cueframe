import {
  circle,
  icon,
  photo,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  themed,
} from '../../../kit';
import {
  BODY,
  brandTag,
  H,
  HANDLE,
  HARBOR,
  HEADING,
  ideasFlight,
  leadTrend,
  portfolio,
  say,
  W,
} from './posts';
import { growthStats, marketTrends, seoMagnifier, timeWaits } from './posts-more';

const checklistSpec = {
  colors: {
    background: { value: HARBOR.indigo, hint: 'Page and the title' },
    surface: {
      value: HARBOR.white,
      hint: 'Checklist card and the third tab number; its shades color the first tab and the handle',
    },
    accent: { value: HARBOR.coral, hint: 'Second tab and the check icons' },
    primary: { value: HARBOR.navy, hint: 'Third tab and the second tab number' },
    text: {
      value: HARBOR.ink,
      hint: 'Kicker, the checklist rows and the first tab number',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    tabs: { label: 'Tab number', value: ['1.', '2.', '3.'] },
    kicker: { label: 'Kicker', value: 'Your Marketing' },
    title: { label: 'Title', value: 'Checklist' },
    items: {
      label: 'Checklist row',
      value: [
        'Define your audience',
        'Plan useful content',
        'Optimise for search',
        'Track every campaign',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const checklist = themed(W, H, checklistSpec, (t) => {
  const body = t.font('body');
  const tabs = [
    { x: 150, fill: t.shade('surface', HARBOR.cream), color: t.color('text') },
    { x: 400, fill: t.color('accent'), color: t.color('primary') },
    { x: 650, fill: t.color('primary'), color: t.color('surface') },
  ];
  const labels = t.list('tabs');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    tabs.map((tab, index) => [
      rect(tab.x, 220, 260, 110, tab.fill, { name: 'Tab', cornerRadius: 20 }),
      say(labels[index] ?? '', tab.x + 30, 236, 200, 34, tab.color, 800, 'left', body),
    ]),
    rect(130, 290, 820, 820, t.color('surface'), {
      name: 'Checklist card',
      cornerRadius: 30,
      ...shadow(40, 18, 'rgba(0,0,0,0.3)'),
    }),
    say(t.copy('kicker'), 200, 380, 700, 50, t.color('text'), 600, 'left', t.font('heading')),
    say(t.copy('title'), 200, 440, 700, 116, t.color('background'), 800, 'left', t.font('heading')),
    t.list('items').map((item, index) => {
      const y = 650 + index * 100;
      return [
        icon('square-check', 200, y, 54, t.color('accent'), { strokeWidth: 2.4 }),
        say(item, 285, y + 6, 620, 38, t.color('text'), 500, 'left', body),
      ];
    }),
    brandTag(t.copy('handle'), 1200, t.shade('surface', 'rgba(255,255,255,0.75)'), body),
  ];
});

interface WebinarStyle {
  card: string;
  sticker: string;
  label: string;
  title: string;
  date: string;
}

const webinarCard = (style: WebinarStyle) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: HARBOR.paper, hint: 'Page' },
        primary: {
          value: style.card,
          hint: 'Player card, the play icon and the sticker text; its translucent shade tints the card shadow',
        },
        accent: { value: style.sticker, hint: 'Sticker' },
        surface: {
          value: HARBOR.white,
          hint: 'Title, date, times and player controls; its translucent shade is the track',
        },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        label: { label: 'Sticker', value: style.label },
        title: { label: 'Title', value: style.title },
        date: { label: 'Date', value: style.date },
        elapsed: { label: 'Elapsed time', value: '0:52' },
        remaining: { label: 'Remaining time', value: '-3:06' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const body = t.font('body');
      const light = t.color('surface');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        rect(260, 250, 560, 900, t.color('primary'), {
          name: 'Player card',
          cornerRadius: 50,
          ...shadow(40, 18, t.shade('primary', 'rgba(20,26,51,0.3)')),
        }),
        photo('woman-portrait-6', 300, 290, 480, 440, { cornerRadius: 30 }),
        say(t.copy('title'), 260, 770, 560, 54, light, 800, 'center', t.font('heading')),
        say(t.copy('date'), 260, 845, 560, 34, light, 500, 'center', body),
        rect(320, 940, 440, 8, t.shade('surface', 'rgba(255,255,255,0.35)'), {
          name: 'Track',
          cornerRadius: 4,
        }),
        rect(320, 940, 200, 8, light, { name: 'Progress', cornerRadius: 4 }),
        circle(520, 944, 16, light, { name: 'Scrubber' }),
        say(t.copy('elapsed'), 320, 966, 120, 22, light, 500, 'left', body),
        say(t.copy('remaining'), 640, 966, 120, 22, light, 500, 'right', body),
        rotateNodes(180, 400, 1050, [icon('chevrons-right', 370, 1020, 60, light)]),
        circle(540, 1050, 52, light, { name: 'Play button' }),
        icon('play', 516, 1026, 50, t.color('primary')),
        icon('chevrons-right', 650, 1020, 60, light),
        rotateNodes(-8, 330, 230, [
          rect(170, 190, 330, 90, t.color('accent'), {
            name: 'Sticker',
            cornerRadius: 14,
            ...shadow(16, 8, 'rgba(0,0,0,0.2)'),
          }),
          say(t.copy('label'), 170, 214, 330, 34, t.color('primary'), 700, 'center', body),
        ]),
      ];
    },
  );

export const webinarNavy = webinarCard({
  card: HARBOR.navy,
  sticker: HARBOR.coral,
  label: 'Online Webinar',
  title: 'Marketing 201',
  date: 'March 9 at 7 PM GMT',
});

export const webinarDark = webinarCard({
  card: HARBOR.charcoal,
  sticker: HARBOR.mint,
  label: 'Live Session',
  title: 'Funnel Studio',
  date: 'June 21 at 4 PM GMT',
});

const empowerSpec = {
  colors: {
    background: { value: HARBOR.cream, hint: 'Page' },
    primary: { value: HARBOR.navy, hint: 'Side panel and the button label' },
    accent: { value: HARBOR.coral, hint: 'Highlight and the button' },
    text: { value: HARBOR.ink, hint: 'Headline lines; its lighter shade colors the handle' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    headline: { label: 'Headline', value: 'Empower\nIdeas, Build' },
    highlight: { label: 'Highlight', value: 'Stronger' },
    closing: { label: 'Closing line', value: 'Business\nLeads' },
    cta: { label: 'Button', value: 'Learn More' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

const empowerIdeas = themed(W, H, empowerSpec, (t) => {
  const head = t.font('heading');
  const body = t.font('body');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    rect(0, 0, 440, H, t.color('primary'), { name: 'Side panel' }),
    photo('woman-portrait-3', 100, 230, 400, 900, { cornerRadius: 30 }),
    say(t.copy('headline'), 560, 330, 480, 70, t.color('text'), 500, 'left', head),
    say(t.copy('highlight'), 560, 490, 480, 78, t.color('accent'), 800, 'left', head),
    say(t.copy('closing'), 560, 580, 480, 70, t.color('text'), 500, 'left', head),
    rect(560, 800, 260, 76, t.color('accent'), { name: 'Button', cornerRadius: 38 }),
    say(t.copy('cta'), 560, 819, 260, 32, t.color('primary'), 700, 'center', body),
    say(t.copy('handle'), 560, 1200, 440, 28, t.shade('text', HARBOR.grey), 500, 'left', body),
  ];
});

export const trendsPost = marketTrends(H);
export const trendsStory = marketTrends(STORY_SIZE.height);

export const POSTS = [
  ideasFlight,
  portfolio,
  leadTrend,
  seoMagnifier,
  growthStats,
  trendsPost,
  timeWaits,
  checklist,
  webinarNavy,
  empowerIdeas,
];
