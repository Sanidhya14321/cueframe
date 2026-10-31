import { linear } from '@/design';
import { icon, rect, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  BRAND,
  backdrop,
  brand,
  centered,
  cursor,
  H,
  HEADING_FONT,
  IRIS,
  tag,
  W,
} from './posts';

const systemSpec = {
  colors: {
    background: { value: IRIS.royal, hint: 'Violet page gradient' },
    text: {
      value: IRIS.white,
      hint: 'Title lines, the glass prompt field with its words and search icon, the cursor and the brand name',
    },
    accent: { value: IRIS.lilac, hint: 'Worth Keeping line' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    lead: { label: 'Lead line', value: "Let's Help You" },
    title: { label: 'Title', value: 'Build A System' },
    highlight: { label: 'Highlight', value: 'Worth Keeping' },
    prompt: { label: 'Prompt', value: 'Ask anything...' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const buildSystem = themed(W, H, systemSpec, (t) => {
  const heading = centered(t.font('heading'));
  return [
    backdrop(H, linear(160, t.color('background'), t.shade('background', IRIS.deep))),
    heading(t.copy('lead'), 220, 72, 500, t.color('text')),
    heading(t.copy('title'), 306, 72, 500, t.color('text')),
    heading(t.copy('highlight'), 394, 80, 800, t.color('accent')),
    rect(230, 620, 620, 100, t.shade('text', 'rgba(255,255,255,0.08)'), {
      cornerRadius: 50,
      stroke: t.color('text'),
      strokeWidth: 3,
      name: 'Prompt field',
    }),
    text(t.copy('prompt'), 290, 650, 460, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 500,
      fill: t.color('text'),
    }),
    icon('search', 766, 646, 48, t.color('text'), { strokeWidth: 2.4 }),
    cursor(560, 700, 1.4, t.color('text')),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const stackedSpec = {
  colors: {
    background: {
      value: IRIS.royal,
      hint: 'Violet page gradient, the tag labels and the tag shadows',
    },
    text: {
      value: IRIS.white,
      hint: 'Stacked words (every other one slightly faded), the tag borders and the brand name',
    },
    accent: { value: IRIS.lilac, hint: 'Tag gradients' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    words: { label: 'Stacked word', value: ['Draft.', 'Plan.', 'Ship.', 'Grow.'] },
    tags: { label: 'Tag', value: ['Live examples', 'Templates', 'Smart prompts', 'Commands'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const STACKED_TAGS = [
  [520, 300, -6, 240],
  [690, 520, 5, 200],
  [110, 720, -4, 250],
  [560, 930, 4, 200],
] as const;

export const stackedWords = themed(W, H, stackedSpec, (t) => {
  const tags = t.list('tags');
  const tagStyle = {
    from: t.color('accent'),
    to: t.shade('accent', IRIS.pale),
    stroke: t.color('text'),
    shade: t.shade('background', 'rgba(36,18,126,0.35)'),
    color: t.shade('background', IRIS.ink),
    fontFamily: t.font('body'),
  };
  return [
    backdrop(H, linear(160, t.color('background'), t.shade('background', IRIS.deep))),
    t.list('words').map((word, index) =>
      text(word, 70, 130 + index * 210, 940, {
        fontFamily: t.font('heading'),
        fontSize: 190,
        fontWeight: 800,
        fill: index % 2 === 0 ? t.color('text') : t.shade('text', 'rgba(255,255,255,0.82)'),
        lineHeight: 1,
      }),
    ),
    STACKED_TAGS.map(([x, y, rotation, width], index) =>
      tag(tags[index] ?? '', x, y, rotation, width, tagStyle),
    ),
    brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
  ];
});

const statsSpec = {
  colors: {
    background: {
      value: IRIS.royal,
      hint: 'Violet page gradient and the figure and label on the featured card',
    },
    text: {
      value: IRIS.white,
      hint: 'Title, the brand name, the figures on the glass cards, their glass tint and the featured card border',
    },
    accent: {
      value: IRIS.lilac,
      hint: 'Platform line, the labels and borders on the glass cards and the featured card gradient',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    brand: BRAND,
    title: { label: 'Title', value: 'Why teams\nchoose our' },
    highlight: { label: 'Highlight', value: 'Platform' },
    values: { label: 'Stat', value: ['12+', '6%', '3x', '250+'] },
    labels: {
      label: 'Stat label',
      value: [
        'Years of product experience',
        'Lower churn\nthis quarter',
        'Faster\nonboarding',
        'Teams onboarded\nthis year',
      ],
    },
  },
} as const satisfies ThemeSpec;

const STAT_CARDS = [
  [80, 600, 560, 240, false],
  [80, 870, 270, 280, false],
  [370, 870, 270, 280, false],
  [670, 740, 330, 410, true],
] as const;

export const statsGrid = themed(W, H, statsSpec, (t) => {
  const labels = t.list('labels');
  const values = t.list('values');
  const featuredInk = t.shade('background', IRIS.ink);
  return [
    backdrop(H, linear(160, t.color('background'), t.shade('background', IRIS.deep))),
    brand(t.copy('brand'), 90, t.color('text'), t.font('heading'), 'right'),
    text(t.copy('title'), 80, 200, 900, {
      fontFamily: t.font('heading'),
      fontSize: 80,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.12,
    }),
    text(t.copy('highlight'), 80, 380, 900, {
      fontFamily: t.font('heading'),
      fontSize: 88,
      fontWeight: 800,
      fill: t.color('accent'),
    }),
    STAT_CARDS.map(([x, y, width, height, featured], index) => [
      rect(
        x,
        y,
        width,
        height,
        featured
          ? linear(160, t.color('accent'), t.shade('accent', IRIS.pale))
          : t.shade('text', 'rgba(255,255,255,0.08)'),
        {
          cornerRadius: 26,
          stroke: featured ? t.color('text') : t.shade('accent', 'rgba(201,188,255,0.6)'),
          strokeWidth: 2,
          name: 'Stat card',
        },
      ),
      text(values[index] ?? '', x + 36, y + 34, width - 60, {
        fontFamily: t.font('heading'),
        fontSize: 96,
        fontWeight: 800,
        fill: featured ? featuredInk : t.color('text'),
        lineHeight: 1,
      }),
      text(labels[index] ?? '', x + 36, y + 146, width - 60, {
        fontFamily: t.font('body'),
        fontSize: 26,
        fontWeight: 600,
        fill: featured ? featuredInk : t.color('accent'),
        lineHeight: 1.3,
      }),
    ]),
  ];
});
