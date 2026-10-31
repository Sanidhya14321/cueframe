import { circle, line, photo, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  background,
  body,
  EMBER,
  HEADING_FONT,
  heading,
  SH,
  SW,
  strong,
  tag,
  wordmark,
} from './deck-kit';

const E = EMBER;

const caseStudySpec = {
  colors: {
    background: {
      value: E.ink,
      hint: 'Page, the kitebase name and the numbers and labels on the result cards',
    },
    text: {
      value: E.paper,
      hint: 'Title, timeline heading and quarters, the logo box and result cards; its dimmer shade colors the paragraphs',
    },
    accent: { value: E.accent, hint: 'Logo mark, timeline line and dots, and the featured result' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Case Study Spotlight' },
    brand: { label: 'Client', value: 'kitebase' },
    story: {
      label: 'Story',
      value:
        'How a Series B software company rebuilt its go-to-market motion, widened outbound pipeline and lifted acquisition velocity within 90 days.',
    },
    timeline: { label: 'Timeline heading', value: 'CLIENT TIMELINE' },
    timelineNote: {
      label: 'Timeline note',
      value: 'End-to-end rollout, from first audit to scaled revenue.',
    },
    quarters: { label: 'Quarter', value: ['Q1', 'Q2', 'Q3', 'Q4'] },
    results: { label: 'Result', value: ['312%', '1.4M', '4.2x'] },
    labels: {
      label: 'Result label',
      value: ['Qualified pipeline', 'Pipeline generated', 'Campaign return'],
    },
  },
} as const satisfies ThemeSpec;

export const caseStudySlide = themed(SW, SH, caseStudySpec, (t) => {
  const head = heading(t.font('heading'));
  const copy = body(t.font('body'));
  const bold = strong(t.font('body'));
  const paper = t.color('text');
  const ink = t.color('background');
  const labels = t.list('labels');
  return [
    background(ink),
    head(t.copy('title'), 100, 70, 130, paper),
    rect(100, 300, 620, 200, paper, { cornerRadius: 28, name: 'Logo box' }),
    wordmark(
      t.copy('brand'),
      170,
      355,
      84,
      { text: ink, mark: t.color('accent'), cut: paper },
      t.font('body'),
    ),
    copy(t.copy('story'), 100, 560, 640, 30, t.shade('text', E.mist)),
    bold(t.copy('timeline'), 900, 300, 700, 32, paper),
    copy(t.copy('timelineNote'), 900, 350, 900, 28, t.shade('text', E.mist)),
    line(900, 500, 900, t.color('accent'), 6),
    t.list('quarters').map((quarter, index) => [
      text(quarter, 860 + index * 290, 430, 80, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 800,
        fill: paper,
        align: 'center',
      }),
      circle(900 + index * 290, 503, 18, t.color('accent')),
    ]),
    t.list('results').map((result, index) => {
      const x = 900 + index * 310;
      return [
        rect(x, 620, 280, 300, index === 0 ? t.color('accent') : paper, {
          cornerRadius: 26,
          name: 'Result',
        }),
        head(result, x + 30, 660, 100, ink, 240),
        bold(labels[index] ?? '', x + 30, 800, 220, 26, ink),
      ];
    }),
  ];
});

const marketSizeSpec = {
  colors: {
    background: { value: E.paper, hint: 'Page, and the TAM label and value' },
    primary: {
      value: E.ink,
      hint: 'Title, legend labels, the TAM circle and dot, and the SAM, SOM and ICP labels; its lighter shade colors the paragraph',
    },
    accent: {
      value: E.accent,
      hint: 'SAM circle and dot; its lighter tints color the SOM and ICP circles and dots',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Market Size' },
    paragraph: {
      label: 'Paragraph',
      value:
        'Measured benchmarks show where demand is real, how fast it grows and which accounts we can win first.',
    },
    legend: {
      label: 'Legend',
      value: [
        'Total addressable market',
        'Serviceable market',
        'Obtainable market',
        'Ideal customer profile',
      ],
    },
    markets: { label: 'Market', value: ['TAM', 'SAM', 'SOM', 'ICP'] },
    total: { label: 'TAM value', value: '$180M' },
  },
} as const satisfies ThemeSpec;

export const marketSizeSlide = themed(SW, SH, marketSizeSpec, (t) => {
  const head = heading(t.font('heading'));
  const ink = t.color('primary');
  const fills = [ink, t.color('accent'), t.shade('accent', E.peach), t.shade('accent', E.soft)];
  const [tam = '', sam = '', som = '', icp = ''] = t.list('markets');
  return [
    background(t.color('background')),
    head(t.copy('title'), 100, 80, 130, ink),
    body(t.font('body'))(t.copy('paragraph'), 100, 270, 720, 32, t.shade('primary', E.grey)),
    t
      .list('legend')
      .map((label, index) => [
        circle(118, 640 + index * 80, 18, fills[index] ?? ''),
        body(t.font('body'))(label, 160, 620 + index * 80, 600, 30, ink),
      ]),
    circle(1200, 560, 320, ink),
    head(tam, 1000, 440, 140, t.color('background'), 400, 'center'),
    text(t.copy('total'), 1000, 600, 400, {
      fontFamily: t.font('body'),
      fontSize: 44,
      fontWeight: 800,
      fill: t.color('background'),
      align: 'center',
    }),
    circle(1640, 290, 150, fills[1] ?? ''),
    head(sam, 1540, 220, 80, ink, 200, 'center'),
    circle(1700, 660, 120, fills[2] ?? ''),
    head(som, 1600, 610, 70, ink, 200, 'center'),
    circle(1530, 920, 90, fills[3] ?? ''),
    head(icp, 1430, 880, 60, ink, 200, 'center'),
  ];
});

const roadmapSpec = {
  colors: {
    background: { value: E.ink, hint: 'Page, the phase tags and the phase titles and text' },
    surface: { value: E.paper, hint: 'Title, the later phase cards and the tag text' },
    accent: { value: E.accent, hint: 'Timeline, its dots and the first phase card' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Implementation Roadmap' },
    tags: { label: 'Phase dates', value: ['Days 1-30', 'Days 31-60', 'Days 61-90'] },
    phases: { label: 'Phase', value: ['Foundation', 'Activation', 'Scaling'] },
    details: {
      label: 'Phase detail',
      value: [
        'Clean the data, audit attribution and agree on targets with every team.',
        'Launch targeted multi-channel campaigns and capture in-market intent.',
        'Reinvest in the best channels and automate the winning sequences.',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const roadmapSlide = themed(SW, SH, roadmapSpec, (t) => {
  const head = heading(t.font('heading'));
  const ink = t.color('background');
  const paper = t.color('surface');
  const phases = t.list('phases');
  const details = t.list('details');
  return [
    background(ink),
    head(t.copy('title'), 0, 70, 120, paper, SW, 'center'),
    line(200, 300, 1520, t.color('accent'), 6),
    t.list('tags').map((label, index) => {
      const x = 150 + index * 560;
      return [
        circle(x + 250, 303, 20, t.color('accent')),
        rect(x, 370, 500, 600, index === 0 ? t.color('accent') : paper, {
          cornerRadius: 30,
          name: 'Phase',
        }),
        tag(label, x + 40, 410, ink, paper, t.font('body')),
        head(phases[index] ?? '', x + 40, 520, 76, ink, 420),
        body(t.font('body'))(details[index] ?? '', x + 40, 640, 420, 30, ink),
      ];
    }),
  ];
});

const WORD_ROWS = [3, 2, 2, 3, 2, 3] as const;

const wordsSpec = {
  colors: {
    background: { value: E.ink, hint: 'Page' },
    text: { value: E.paper, hint: 'Alternating words, including the very first word' },
    accent: { value: E.accent, hint: 'The words between the white ones' },
  },
  fonts: { heading: HEADING_FONT },
  copy: {
    words: {
      label: 'Word',
      hint: 'Rows hold 3, 2, 2, 3, 2 and 3 words',
      value: [
        'ENGAGEMENT,',
        'BRANDING,',
        'SEO',
        'OPTIMIZATION,',
        'GROWTH',
        'ADVERTISING,',
        'WEB DESIGN',
        'STRATEGY,',
        'CONTENT,',
        'DATA',
        'ANALYTICS,',
        'OUTREACH',
        'PIPELINE,',
        'SOCIAL,',
        'EMAIL',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const wordsSlide = themed(SW, SH, wordsSpec, (t) => {
  const words = t.list('words');
  let next = 0;
  return [
    background(t.color('background')),
    WORD_ROWS.map((count, row) => {
      let x = row % 2 === 0 ? 40 : 150;
      return Array.from({ length: count }, (_, index) => {
        const word = words[next] ?? '';
        next += 1;
        const start = x;
        x += word.length * 74 + 36;
        return text(word, start, 50 + row * 170, word.length * 74 + 20, {
          fontFamily: t.font('heading'),
          fontSize: 150,
          fontWeight: 400,
          fill: (row + index) % 2 === 0 ? t.color('text') : t.color('accent'),
          lineHeight: 1,
        });
      });
    }),
  ];
});

const customerSpec = {
  colors: {
    background: { value: E.paper, hint: 'Page and the persona name' },
    text: {
      value: E.ink,
      hint: 'Title, name card, profile headings and pain points; its lighter shade colors the profile details',
    },
    accent: { value: E.accent, hint: 'Circle behind the photo, the job title and the bullet dots' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Ideal Customer Profile' },
    name: { label: 'Persona name', value: 'Maya Okonjo' },
    role: { label: 'Job title', value: 'VP MARKETING' },
    facts: { label: 'Profile heading', value: ['B2B SOFTWARE', '$5M-$50M ARR', 'PAIN POINTS'] },
    details: {
      label: 'Profile detail',
      value: [
        'Mid-market companies selling to operations and finance teams.',
        'Scaling with a proven product and a stretched marketing team.',
      ],
    },
    points: {
      label: 'Pain point',
      value: [
        'High acquisition cost and slow sales cycles',
        'Too little pipeline to hit revenue targets',
      ],
    },
  },
} as const satisfies ThemeSpec;

export const customerSlide = themed(SW, SH, customerSpec, (t) => {
  const head = heading(t.font('heading'));
  const copy = body(t.font('body'));
  const bold = strong(t.font('body'));
  const ink = t.color('text');
  const grey = t.shade('text', E.grey);
  const [software = '', revenue = '', pains = ''] = t.list('facts');
  const [market = '', stage = ''] = t.list('details');
  return [
    background(t.color('background')),
    head(t.copy('title'), 100, 70, 120, ink),
    circle(430, 640, 260, t.color('accent')),
    photo('woman-portrait-5', 190, 300, 480, 640, { cornerRadius: 32 }),
    rect(560, 800, 440, 160, ink, { cornerRadius: 22, name: 'Name card' }),
    head(t.copy('name'), 600, 830, 54, t.color('background'), 380),
    bold(t.copy('role'), 600, 900, 380, 24, t.color('accent')),
    bold(software, 1100, 300, 700, 44, ink),
    copy(market, 1100, 360, 700, 28, grey),
    bold(revenue, 1100, 490, 700, 44, ink),
    copy(stage, 1100, 550, 700, 28, grey),
    bold(pains, 1100, 680, 700, 44, ink),
    t
      .list('points')
      .map((point, index) => [
        circle(1112, 768 + index * 60, 8, t.color('accent')),
        copy(point, 1140, 750 + index * 60, 680, 28, ink),
      ]),
  ];
});
