import {
  circle,
  icon,
  photo,
  rating,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { AGENT, BODY, footerBar, H, HEADING, KEY, SCRIPT_FONT, SITE_COPY, W } from './palette';

const reviewSpec = {
  colors: {
    background: {
      value: KEY.cream,
      hint: 'Wash over the photo and the review card behind the quote',
    },
    primary: { value: KEY.forest, hint: 'Website and Client Review' },
    accent: { value: KEY.brass, hint: 'Stars and the reviewer names' },
    secondary: { value: KEY.sage, hint: 'Result line at the bottom of the card' },
    text: { value: KEY.ink, hint: 'Quote; its translucent shade tints the card shadow' },
  },
  fonts: { heading: HEADING, script: SCRIPT_FONT, body: BODY },
  copy: {
    site: SITE_COPY,
    title: { label: 'Title', value: 'Client Review' },
    quote: {
      label: 'Quote',
      value:
        '"Dana made selling our family home\nfeel calm and simple. She knew the\nneighbourhood, priced it right and had\nthree offers in the first weekend.\nWe could not have asked for a\nkinder or sharper agent."',
    },
    reviewer: { label: 'Reviewer', value: 'Priya & Tom Halden' },
    result: { label: 'Result', value: 'SOLD IN 9 DAYS' },
  },
} as const satisfies ThemeSpec;

const review = (height: number) =>
  themed(W, height, reviewSpec, (t) => {
    const top = height / 2 - 420;
    return [
      rect(0, 0, W, height, t.color('background'), { name: 'Background' }),
      photo('interior-1', 0, 0, W, height),
      rect(0, 0, W, height, t.shade('background', 'rgba(247,245,239,0.35)'), {
        name: 'Photo wash',
      }),
      text(t.copy('site'), 0, top - 110, W, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 600,
        fill: t.color('primary'),
        align: 'center',
        letterSpacing: 2,
      }),
      rect(140, top, 800, 840, t.shade('background', 'rgba(247,245,239,0.95)'), {
        cornerRadius: 30,
        name: 'Review card',
        ...shadow(50, 18, t.shade('text', 'rgba(31,38,32,0.18)')),
      }),
      rating(368, top + 70, 52, 5, t.color('accent'), 0.4),
      text(t.copy('title'), 140, top + 160, 800, {
        fontFamily: t.font('heading'),
        fontSize: 70,
        fontWeight: 500,
        fill: t.color('primary'),
        align: 'center',
      }),
      text(t.copy('quote'), 180, top + 290, 720, {
        fontFamily: t.font('body'),
        fontSize: 30,
        fontWeight: 400,
        fill: t.color('text'),
        align: 'center',
        lineHeight: 1.55,
      }),
      text(t.copy('reviewer'), 140, top + 640, 800, {
        fontFamily: t.font('script'),
        fontSize: 66,
        fontWeight: 400,
        fill: t.color('accent'),
        align: 'center',
      }),
      text(t.copy('result'), 140, top + 750, 800, {
        fontFamily: t.font('body'),
        fontSize: 24,
        fontWeight: 700,
        fill: t.color('secondary'),
        align: 'center',
        letterSpacing: 5,
      }),
    ];
  });

export const clientReview = review(H);

export const clientReviewStory = review(STORY_SIZE.height);

const TOGGLES = [true, true, true, true, true, false];

const checklistSpec = {
  colors: {
    primary: { value: KEY.forest, hint: 'Title and the tint over the photo' },
    surface: {
      value: KEY.cream,
      hint: 'Checklist card and the website; its white shade colors the toggle knobs and its pale shade the page behind the photo',
    },
    secondary: {
      value: KEY.sage,
      hint: 'Toggles that are on; its pale shade colors the off toggle',
    },
    text: { value: KEY.ink, hint: 'Tips; its faint shade colors the dividers' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: "First Home Buyer\nDo's and Don'ts" },
    tips: {
      label: 'Tip',
      value: [
        'Get pre-approved first',
        'Check your credit score',
        'Save for closing costs',
        'Budget for repairs',
        'Work with a local agent',
        'Skip the home inspection',
      ],
    },
    site: SITE_COPY,
  },
} as const satisfies ThemeSpec;

export const buyerChecklist = themed(W, H, checklistSpec, (t) => {
  const tips = t.list('tips');
  return [
    rect(0, 0, W, H, t.shade('surface', KEY.mist), { name: 'Background' }),
    photo('interior-2', 0, 0, W, H),
    rect(0, 0, W, H, t.shade('primary', 'rgba(47,61,51,0.35)'), { name: 'Photo tint' }),
    rect(120, 200, 840, 870, t.shade('surface', 'rgba(247,245,239,0.96)'), {
      cornerRadius: 30,
      name: 'Checklist card',
      ...shadow(40, 16, 'rgba(0,0,0,0.25)'),
    }),
    text(t.copy('title'), 120, 240, 840, {
      fontFamily: t.font('heading'),
      fontSize: 58,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'center',
      lineHeight: 1.15,
    }),
    tips.map((tip, index) => {
      const y = 470 + index * 100;
      const on = TOGGLES[index] ?? true;
      return [
        text(tip, 190, y, 560, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        rect(780, y - 6, 100, 50, on ? t.color('secondary') : t.shade('secondary', '#cfd3cb'), {
          cornerRadius: 25,
          name: 'Toggle',
        }),
        circle(on ? 855 : 805, y + 19, 19, t.shade('surface', KEY.white)),
        index < tips.length - 1
          ? rect(190, y + 70, 690, 2, t.shade('text', 'rgba(31,38,32,0.1)'), { name: 'Divider' })
          : [],
      ];
    }),
    text(t.copy('site'), 0, 1190, W, {
      fontFamily: t.font('body'),
      fontSize: 32,
      fontWeight: 600,
      fill: t.color('surface'),
      align: 'center',
      letterSpacing: 2,
    }),
  ];
});

const townSpec = {
  colors: {
    background: { value: KEY.sage, hint: 'Page' },
    surface: {
      value: KEY.cream,
      hint: 'Title, For Sale, the price and the room counts; its shades color the room labels and dividers',
    },
    primary: { value: KEY.forest, hint: 'Price tag' },
  },
  fonts: { heading: HEADING, script: SCRIPT_FONT, body: BODY },
  copy: {
    title: { label: 'Title', value: 'TOWNHOMES' },
    script: { label: 'Script line', value: 'For Sale!' },
    price: { label: 'Price', value: '$ 412,000' },
    counts: { label: 'Room count', value: ['3', '2', '1'] },
    rooms: { label: 'Room', value: ['Bedrooms', 'Bathrooms', 'Garage'] },
  },
} as const satisfies ThemeSpec;

export const townhomes = themed(W, H, townSpec, (t) => {
  const rooms = t.list('rooms');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    text(t.copy('title'), 0, 90, W, {
      fontFamily: t.font('body'),
      fontSize: 64,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
      letterSpacing: 10,
    }),
    text(t.copy('script'), 0, 170, W, {
      fontFamily: t.font('script'),
      fontSize: 140,
      fontWeight: 400,
      fill: t.color('surface'),
      align: 'center',
    }),
    photo('house-2', 0, 400, W, 580),
    rect(290, 930, 500, 104, t.color('primary'), { cornerRadius: 52, name: 'Price tag' }),
    text(t.copy('price'), 290, 950, 500, {
      fontFamily: t.font('body'),
      fontSize: 56,
      fontWeight: 800,
      fill: t.color('surface'),
      align: 'center',
    }),
    t.list('counts').map((count, index) => [
      text(count, 90 + index * 300, 1090, 300, {
        fontFamily: t.font('heading'),
        fontSize: 72,
        fontWeight: 600,
        fill: t.color('surface'),
        align: 'center',
        lineHeight: 1,
      }),
      text(rooms[index] ?? '', 90 + index * 300, 1180, 300, {
        fontFamily: t.font('body'),
        fontSize: 28,
        fontWeight: 600,
        fill: t.shade('surface', KEY.mist),
        align: 'center',
      }),
    ]),
    rect(388, 1100, 3, 130, t.shade('surface', 'rgba(247,245,239,0.5)'), { name: 'Divider' }),
    rect(688, 1100, 3, 130, t.shade('surface', 'rgba(247,245,239,0.5)'), { name: 'Divider' }),
  ];
});

const faqSpec = {
  colors: {
    background: { value: KEY.cream, hint: 'Page, the photo wash and the footer text' },
    primary: { value: KEY.forest, hint: 'Website, the search button and the footer bar' },
    surface: { value: KEY.white, hint: 'Search bar and the results card' },
    secondary: { value: KEY.sage, hint: 'Search icons beside each question' },
    text: {
      value: KEY.ink,
      hint: 'Search text and questions; its faint shades color the dividers and card shadows',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE_COPY,
    query: { label: 'Search text', value: 'Home buying questions' },
    questions: {
      label: 'Question',
      value: [
        'What is the first step to buying?',
        'How much should I save for a deposit?',
        'Is now a good time to sell?',
        'What does an inspection cover?',
        'How do I know what my home is worth?',
        'How long does closing usually take?',
      ],
    },
    footer: { label: 'Footer', value: `Ask me anything at ${AGENT.phone}` },
  },
} as const satisfies ThemeSpec;

export const faqSearch = themed(W, H, faqSpec, (t) => {
  const questions = t.list('questions');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    photo('interior-1', 0, 0, W, 520),
    rect(0, 0, W, 520, t.shade('background', 'rgba(247,245,239,0.45)'), { name: 'Photo wash' }),
    text(t.copy('site'), 0, 80, W, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 600,
      fill: t.color('primary'),
      align: 'center',
      letterSpacing: 2,
    }),
    rect(120, 210, 840, 104, t.color('surface'), {
      cornerRadius: 52,
      name: 'Search bar',
      ...shadow(30, 10, t.shade('text', 'rgba(31,38,32,0.18)')),
    }),
    text(t.copy('query'), 180, 240, 640, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    icon('search', 870, 236, 52, t.color('primary'), { strokeWidth: 2.4 }),
    rect(120, 360, 840, 760, t.color('surface'), {
      cornerRadius: 30,
      name: 'Results card',
      ...shadow(30, 10, t.shade('text', 'rgba(31,38,32,0.12)')),
    }),
    questions.map((question, index) => {
      const y = 410 + index * 118;
      return [
        icon('search', 170, y + 4, 34, t.color('secondary'), { strokeWidth: 2.2 }),
        text(question, 230, y + 2, 660, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        index < questions.length - 1
          ? rect(170, y + 74, 740, 2, t.shade('text', 'rgba(31,38,32,0.08)'), { name: 'Divider' })
          : [],
      ];
    }),
    footerBar(
      1200,
      150,
      t.copy('footer'),
      t.color('primary'),
      t.color('background'),
      t.font('heading'),
    ),
  ];
});
