import { linear } from '@/design';
import { estimateTextWidth, icon, photo, pill, rect, type ThemeSpec, themed } from '../../../kit';
import { backdrop, body, FONTS, head, marker, NV, SH, SW } from './theme';

const coverSpec = {
  colors: {
    background: {
      value: NV.plum,
      hint: 'Page edge and the shade over the photo; its darker shade colors the website pill text',
    },
    primary: { value: NV.coral, hint: 'Logo tile and the accent bar' },
    text: { value: NV.white, hint: 'Brand name, title and the logo bolt' },
    secondary: { value: NV.peach, hint: 'Subtitle' },
    surface: { value: NV.white, hint: 'Website pill' },
  },
  fonts: FONTS,
  copy: {
    website: { label: 'Website', value: 'northvale.agency' },
    brand: { label: 'Brand', value: 'NORTHVALE' },
    title: { label: 'Title', value: 'Growth\nPitch Deck' },
    subtitle: { label: 'Subtitle', value: 'B2B marketing strategy for 2027' },
  },
} as const satisfies ThemeSpec;

export const coverSlide = themed(SW, SH, coverSpec, (t) => [
  backdrop(t.color('background')),
  photo('team-1', 60, 60, 1800, 960, { cornerRadius: 40 }),
  rect(
    60,
    60,
    1800,
    960,
    linear(
      90,
      t.shade('background', 'rgba(43,18,54,0.94)'),
      t.shade('background', 'rgba(43,18,54,0.1)'),
    ),
    { name: 'Shade', cornerRadius: 40 },
  ),
  pill(t.copy('website'), 1440, 120, {
    fill: t.color('surface'),
    color: t.shade('background', NV.ink),
    fontSize: 30,
    fontFamily: t.font('body'),
  }),
  rect(140, 150, 96, 96, t.color('primary'), { name: 'Logo mark', cornerRadius: 24 }),
  icon('zap', 164, 174, 48, t.color('text')),
  head(t.font('heading'))(t.copy('brand'), 264, 172, 600, 48, t.color('text'), {
    letterSpacing: 6,
  }),
  head(t.font('heading'))(t.copy('title'), 140, 540, 1100, 170, t.color('text'), {
    fontWeight: 800,
    lineHeight: 0.98,
  }),
  marker(140, 900, t.color('primary')),
  body(t.font('body'))(t.copy('subtitle'), 240, 880, 900, 40, t.color('secondary')),
]);

const CURRENT_CHAPTER = 2;

const contentsSpec = {
  colors: {
    background: { value: NV.plum, hint: 'Page' },
    primary: { value: NV.coral, hint: 'Accent bar and the arrow' },
    text: {
      value: NV.white,
      hint: 'Contents title and the current chapter; its faded shade colors the other chapters',
    },
    secondary: { value: NV.peach, hint: 'Subtitle' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'Contents' },
    subtitle: { label: 'Subtitle', value: 'Five chapters, one clear plan.' },
    chapters: {
      label: 'Chapter',
      value: ['About us', 'Our work', 'Revenue plan', 'Value props', 'Next steps'],
    },
  },
} as const satisfies ThemeSpec;

export const contentsSlide = themed(SW, SH, contentsSpec, (t) => {
  const heading = head(t.font('heading'));
  return [
    backdrop(t.color('background')),
    marker(140, 170, t.color('primary')),
    heading(t.copy('title'), 140, 210, 800, 150, t.color('text'), { fontWeight: 800 }),
    body(t.font('body'))(t.copy('subtitle'), 140, 390, 700, 38, t.color('secondary')),
    t
      .list('chapters')
      .map((chapter, index) =>
        heading(
          chapter,
          1080,
          150 + index * 160,
          760,
          100,
          index === CURRENT_CHAPTER ? t.color('text') : t.shade('text', 'rgba(255,255,255,0.26)'),
        ),
      ),
    icon('arrow-right', 950, 470, 100, t.color('primary'), { strokeWidth: 2.6 }),
  ];
});

const aboutSpec = {
  colors: {
    background: { value: NV.cream, hint: 'Page' },
    primary: { value: NV.coral, hint: 'Accent bar and the first stat card' },
    text: {
      value: NV.ink,
      hint: 'About us and the second stat; its lighter shade colors the intro and its label',
    },
    surface: { value: NV.white, hint: 'Stat and label on the coral card' },
  },
  fonts: FONTS,
  copy: {
    title: { label: 'Title', value: 'About us' },
    intro: {
      label: 'Intro',
      value:
        'We help ambitious B2B teams cut through the noise, turn complex offers into clear stories and build brand equity at every touchpoint.',
    },
    stats: { label: 'Stat', value: ['9+ yrs', '97%'] },
    labels: { label: 'Stat label', value: ['Agency experience', 'Client retention'] },
  },
} as const satisfies ThemeSpec;

export const aboutSlide = themed(SW, SH, aboutSpec, (t) => {
  const heading = head(t.font('heading'));
  const copy = body(t.font('body'));
  const [lead = '', second = ''] = t.list('stats');
  const [leadLabel = '', secondLabel = ''] = t.list('labels');
  return [
    backdrop(t.color('background')),
    marker(140, 150, t.color('primary')),
    heading(t.copy('title'), 140, 190, 900, 130, t.color('text'), { fontWeight: 800 }),
    copy(t.copy('intro'), 140, 380, 880, 38, t.shade('text', NV.grey)),
    rect(140, 700, 370, 220, t.color('primary'), { name: 'Stat card', cornerRadius: 28 }),
    heading(lead, 180, 735, 310, 84, t.color('surface')),
    copy(leadLabel, 180, 845, 310, 28, t.color('surface')),
    heading(second, 580, 735, 300, 84, t.color('text')),
    copy(secondLabel, 580, 845, 300, 28, t.shade('text', NV.grey)),
    photo('meeting-1', 1140, 120, 660, 840, { cornerRadius: 40 }),
  ];
});

const KEYWORD_ROWS = [
  ['seo', 'content', 'paid social'],
  ['abm', 'analytics', 'webinars'],
  ['intent data', 'crm', 'events'],
  ['nurture', 'pipeline', 'email'],
  ['outbound', 'ppc', 'attribution'],
  ['funnels', 'partners', 'retention'],
  ['ads', 'lifecycle', 'reviews'],
];

const HOT = ['seo', 'webinars', 'pipeline', 'attribution', 'lifecycle'];
const KEYWORDS = KEYWORD_ROWS.flat();
const HOT_INDEXES = KEYWORDS.flatMap((word, index) => (HOT.includes(word) ? [index] : []));
const PER_ROW = 3;

const keywordSpec = {
  colors: {
    background: {
      value: NV.plum,
      hint: 'Page and the text on the highlighted keywords',
    },
    primary: { value: NV.coral, hint: 'Bolt tile and the highlighted keyword pills' },
    text: { value: NV.white, hint: 'Bolt, headline, keyword outlines and keyword text' },
  },
  fonts: FONTS,
  copy: {
    headline: { label: 'Headline', value: 'Access the sharpest\ndemand-gen toolkit\nin B2B.' },
    keywords: { label: 'Keyword', value: KEYWORDS },
  },
} as const satisfies ThemeSpec;

export const keywordSlide = themed(SW, SH, keywordSpec, (t) => {
  const words = t.list('keywords');
  const rows = KEYWORD_ROWS.map((_, row) => words.slice(row * PER_ROW, row * PER_ROW + PER_ROW));
  return [
    backdrop(t.color('background')),
    rect(140, 140, 120, 120, t.color('primary'), { name: 'Icon tile', cornerRadius: 30 }),
    icon('zap', 170, 170, 60, t.color('text')),
    head(t.font('heading'))(t.copy('headline'), 140, 640, 860, 70, t.color('text'), {
      fontWeight: 800,
    }),
    rows.map((row, rowIndex) => {
      const widths = row.map((word) => estimateTextWidth(word, 34) + 75);
      return row.map((word, index) => {
        const x =
          1010 + (rowIndex % 2) * 70 + widths.slice(0, index).reduce((sum, w) => sum + w + 24, 0);
        const hot = HOT_INDEXES.includes(rowIndex * PER_ROW + index);
        return pill(word, x, 90 + rowIndex * 130, {
          fill: hot ? t.color('primary') : t.shade('background', NV.clear),
          color: hot ? t.color('background') : t.color('text'),
          stroke: t.color('text'),
          strokeWidth: hot ? 0 : 3,
          fontSize: 34,
          fontFamily: t.font('body'),
          fontWeight: 500,
        });
      });
    }),
  ];
});
