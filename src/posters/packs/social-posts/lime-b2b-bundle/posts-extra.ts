import {
  avatar,
  circle,
  photo,
  rating,
  rect,
  rotateNodes,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, DISPLAY, footer, H, HANDLE, HEADING, heavy, LIME, W } from './posts';

const eventsSpec = {
  colors: {
    primary: { value: LIME.primary, hint: 'Page and the day numbers' },
    text: {
      value: LIME.ink,
      hint: 'Upcoming, the title, date boxes, event names and the handle; its softer shade colors the event details',
    },
    surface: { value: LIME.paper, hint: 'Month under each day' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'UPCOMING' },
    title: { label: 'Title', value: 'October Events' },
    month: { label: 'Month', value: 'OCT' },
    days: { label: 'Day', value: ['04', '12', '19', '27'] },
    events: {
      label: 'Event',
      value: ['Growth Breakfast', 'Live Q&A', 'Partner Webinar', 'Client Awards'],
    },
    details: {
      label: 'Event details',
      value: [
        'Founders meetup, 8:30 AM',
        'Pricing pages that convert',
        'Scaling outbound in 2027',
        'Celebrating our best launches',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const eventsList = themed(W, H, eventsSpec, (t) => {
  const events = t.list('events');
  const details = t.list('details');
  return [
    rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
    text(t.copy('kicker'), 80, 90, 500, {
      fontFamily: t.font('heading'),
      fontSize: 34,
      fontWeight: 800,
      fill: t.color('text'),
      letterSpacing: 6,
    }),
    heavy(t.font('heading'))(t.copy('title'), 80, 140, 100, t.color('text')),
    t.list('days').map((day, index) => {
      const y = 320 + index * 225;
      return [
        rect(80, y, 170, 180, t.color('text'), { cornerRadius: 20, name: 'Date box' }),
        text(day, 80, y + 22, 170, {
          fontFamily: t.font('heading'),
          fontSize: 90,
          fontWeight: 900,
          fill: t.color('primary'),
          align: 'center',
          lineHeight: 1,
        }),
        text(t.copy('month'), 80, y + 124, 170, {
          fontFamily: t.font('body'),
          fontSize: 26,
          fontWeight: 700,
          fill: t.color('surface'),
          align: 'center',
          letterSpacing: 4,
        }),
        text(events[index] ?? '', 290, y + 34, 700, {
          fontFamily: t.font('heading'),
          fontSize: 52,
          fontWeight: 900,
          fill: t.color('text'),
        }),
        text(details[index] ?? '', 290, y + 104, 700, {
          fontFamily: t.font('body'),
          fontSize: 30,
          fontWeight: 500,
          fill: t.shade('text', '#2f3a12'),
        }),
      ];
    }),
    footer(t.copy('handle'), t.color('text'), t.font('body')),
  ];
});

const quizSpec = {
  colors: {
    background: { value: LIME.paper, hint: 'Page and the option numbers' },
    surface: { value: '#f1f2f4', hint: 'Unpicked answer cards' },
    primary: { value: LIME.primary, hint: 'TIME tag and the picked answer card' },
    text: {
      value: LIME.ink,
      hint: 'Title, question, number boxes, answers, call to action and star; its grey shade colors the handle',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Quick Quiz' },
    tag: { label: 'Tag', value: 'TIME!' },
    question: {
      label: 'Question',
      value: 'Which channel brings you the most\nqualified B2B leads?',
    },
    numbers: { label: 'Option number', value: ['1', '2', '3', '4'] },
    options: {
      label: 'Answer',
      value: ['Search and SEO', 'LinkedIn content', 'Cold email', 'Referrals'],
    },
    cta: { label: 'Call to action', value: 'Drop your answer in the comments' },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const quizTime = themed(W, H, quizSpec, (t) => {
  const options = t.list('options');
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    heavy(t.font('heading'))(t.copy('title'), 80, 100, 120, t.color('text')),
    rotateNodes(-8, 760, 150, [
      rect(700, 110, 260, 96, t.color('primary'), { cornerRadius: 16, name: 'Time tag' }),
      text(t.copy('tag'), 700, 124, 260, {
        fontFamily: t.font('heading'),
        fontSize: 60,
        fontWeight: 900,
        fill: t.color('text'),
        align: 'center',
      }),
    ]),
    text(t.copy('question'), 80, 300, 920, {
      fontFamily: t.font('heading'),
      fontSize: 50,
      fontWeight: 800,
      fill: t.color('text'),
      lineHeight: 1.2,
    }),
    t.list('numbers').map((number, index) => {
      const y = 500 + index * 150;
      return [
        rect(80, y, 920, 120, index === 1 ? t.color('primary') : t.color('surface'), {
          cornerRadius: 22,
          name: 'Option',
        }),
        rect(104, y + 20, 80, 80, t.color('text'), { cornerRadius: 16, name: 'Option number' }),
        text(number, 104, y + 34, 80, {
          fontFamily: t.font('heading'),
          fontSize: 44,
          fontWeight: 900,
          fill: t.color('background'),
          align: 'center',
        }),
        text(options[index] ?? '', 220, y + 36, 740, {
          fontFamily: t.font('body'),
          fontSize: 40,
          fontWeight: 600,
          fill: t.color('text'),
        }),
      ];
    }),
    text(t.copy('cta'), 0, 1150, W, {
      fontFamily: t.font('heading'),
      fontSize: 40,
      fontWeight: 800,
      fill: t.color('text'),
      align: 'center',
    }),
    star(5, 880, 1200, 110, t.color('text'), { innerRatio: 0.42 }),
    footer(t.copy('handle'), t.shade('text', '#6b7280'), t.font('body')),
  ];
});

const reviewSpec = {
  colors: {
    background: { value: LIME.ink, hint: 'Page' },
    primary: { value: LIME.primary, hint: 'CLIENT and the REVIEW outline' },
    surface: { value: LIME.paper, hint: 'Review card' },
    accent: { value: '#f5b400', hint: 'Rating stars' },
    text: {
      value: LIME.ink,
      hint: 'Quote and reviewer name; its grey shade colors the job title',
    },
  },
  fonts: { display: DISPLAY, heading: HEADING, body: BODY },
  copy: {
    top: { label: 'Top word', value: 'CLIENT' },
    bottom: { label: 'Outline word', value: 'REVIEW' },
    quote: {
      label: 'Quote',
      value: '"Kestrel rebuilt our content engine. Demo requests doubled in one quarter."',
    },
    name: { label: 'Reviewer', value: 'Lena Ortiz' },
    role: { label: 'Job title', value: 'COO, Brightfold Labs' },
  },
} as const satisfies ThemeSpec;

export const reviewWords = themed(W, H, reviewSpec, (t) => [
  rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
  rotateNodes(-8, 540, 300, [
    text(t.copy('top'), 140, 70, 900, {
      fontFamily: t.font('display'),
      fontSize: 230,
      fontWeight: 400,
      fill: t.color('primary'),
      lineHeight: 1,
    }),
  ]),
  rotateNodes(-8, 540, 1100, [
    text(t.copy('bottom'), 120, 1010, 900, {
      fontFamily: t.font('display'),
      fontSize: 230,
      fontWeight: 400,
      fill: t.shade('primary', 'rgba(0,0,0,0)'),
      stroke: t.color('primary'),
      strokeWidth: 4,
      lineHeight: 1,
    }),
  ]),
  rect(120, 470, 840, 470, t.color('surface'), { cornerRadius: 30, name: 'Review card' }),
  rating(180, 530, 46, 5, t.color('accent'), 0.2),
  text(t.copy('quote'), 180, 610, 720, {
    fontFamily: t.font('heading'),
    fontSize: 42,
    fontWeight: 700,
    fill: t.color('text'),
    lineHeight: 1.3,
  }),
  avatar('woman-portrait-5', 230, 850, 50),
  text(t.copy('name'), 300, 812, 500, {
    fontFamily: t.font('body'),
    fontSize: 32,
    fontWeight: 800,
    fill: t.color('text'),
  }),
  text(t.copy('role'), 300, 856, 500, {
    fontFamily: t.font('body'),
    fontSize: 26,
    fontWeight: 500,
    fill: t.shade('text', '#6b7280'),
  }),
]);

const commentsSpec = {
  colors: {
    primary: { value: LIME.primary, hint: 'Page and the star' },
    text: {
      value: LIME.ink,
      hint: 'Sideways headline, the caption card and the circle behind the star',
    },
    surface: { value: LIME.paper, hint: 'Caption' },
  },
  fonts: { display: DISPLAY, heading: HEADING },
  copy: {
    title: { label: 'Sideways headline', value: 'CHECK THE COMMENTS' },
    caption: { label: 'Caption', value: 'Tell us your biggest\nmarketing win this year' },
  },
} as const satisfies ThemeSpec;

export const checkComments = themed(W, H, commentsSpec, (t) => [
  rect(0, 0, W, H, t.color('primary'), { name: 'Background' }),
  text(t.copy('title'), 70, 1270, 1180, {
    fontFamily: t.font('display'),
    fontSize: 130,
    fontWeight: 400,
    fill: t.color('text'),
    rotation: -90,
    lineHeight: 1,
  }),
  photo('woman-portrait-6', 300, 80, 700, 1000, { cornerRadius: 30 }),
  rect(300, 1110, 700, 160, t.color('text'), { cornerRadius: 24, name: 'Caption card' }),
  text(t.copy('caption'), 340, 1135, 640, {
    fontFamily: t.font('heading'),
    fontSize: 40,
    fontWeight: 800,
    fill: t.color('surface'),
    lineHeight: 1.2,
  }),
  circle(930, 110, 70, t.color('text')),
  star(5, 880, 60, 100, t.color('primary'), { innerRatio: 0.42 }),
]);
