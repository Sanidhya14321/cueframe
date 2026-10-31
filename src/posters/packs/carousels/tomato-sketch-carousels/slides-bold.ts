import { circle, icon, line, rect, type ThemeSpec, themed } from '../../../kit';
import { boxed, estimateWidth, FONT, H, TOMATO, W, writer } from './palette';

const sidePanel = (page: string, panel: string, button: string, arrow: string) => [
  rect(0, 0, W, H, page, { name: 'Background' }),
  rect(950, 140, 130, 1070, panel, { name: 'Side panel', cornerRadius: 56 }),
  rect(1010, 140, 70, 1070, panel, { name: 'Side panel edge' }),
  circle(1000, 675, 36, button),
  icon('chevron-right', 978, 653, 44, arrow, { strokeWidth: 3 }),
];

const brandCoverSpec = {
  colors: {
    primary: {
      value: TOMATO.red,
      hint: 'Page, the boxed word and the arrow; its darker shade colors the side panel',
    },
    surface: { value: TOMATO.white, hint: 'Box behind the highlighted word and the arrow button' },
    text: { value: TOMATO.white, hint: 'Headline lines above and below the box' },
  },
  fonts: { body: FONT },
  copy: {
    headline: { label: 'Headline', value: 'Your\nPersonal\nBrand Is\nYour' },
    highlight: { label: 'Boxed word', value: 'Strongest' },
    closing: { label: 'Last line', value: 'Advantage' },
  },
} as const satisfies ThemeSpec;

export const brandCover = themed(W, H, brandCoverSpec, (t) => {
  const say = writer(t.font('body'));
  return [
    sidePanel(
      t.color('primary'),
      t.shade('primary', TOMATO.deep),
      t.color('surface'),
      t.color('primary'),
    ),
    say(t.copy('headline'), 90, 190, 840, 104, t.color('text'), 700, { lineHeight: 1.02 }),
    boxed(say, t.copy('highlight'), 90, 640, 104, t.color('surface'), t.color('primary')),
    say(t.copy('closing'), 90, 790, 840, 104, t.color('text'), 700, { lineHeight: 1.02 }),
  ];
});

const brandStep = (label: string, body: string) => {
  const spec = {
    colors: {
      primary: {
        value: TOMATO.red,
        hint: 'Page, the label text and the arrow; its shades color the side panel and the label outline',
      },
      surface: { value: TOMATO.white, hint: 'Label pill and the arrow button' },
      text: { value: TOMATO.white, hint: 'Body text' },
    },
    fonts: { body: FONT },
    copy: {
      label: { label: 'Label', value: label },
      body: { label: 'Body', value: body },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => {
    const say = writer(t.font('body'));
    const title = t.copy('label');
    const width = estimateWidth(title, 54) + 60;
    return [
      sidePanel(
        t.color('primary'),
        t.shade('primary', TOMATO.deep),
        t.color('surface'),
        t.color('primary'),
      ),
      rect(90, 300, width, 92, t.color('surface'), {
        name: 'Label pill',
        cornerRadius: 46,
        stroke: t.shade('primary', TOMATO.ink),
        strokeWidth: 3,
      }),
      say(title, 90, 314, width, 54, t.color('primary'), 700, {
        align: 'center',
        lineHeight: 1.1,
      }),
      say(t.copy('body'), 90, 460, 800, 42, t.color('text'), 500, { lineHeight: 1.45 }),
    ];
  });
};

export const brandPeople = brandStep(
  'Your People:',
  'Your audience is not just buying\na service. They are choosing you.\n\nTrust, familiarity and a clear\npoint of view drive every choice.',
);

export const brandGap = brandStep(
  'The Gap:',
  "If you aren't visible, consistent\nand clear...\n\nYou get overlooked.\nYou get underpriced.\nYou get forgotten.",
);

export const brandNext = brandStep(
  'Next Steps:',
  "Build with intention every day\n\n•  Share useful insights\n•  Show your perspective\n•  Stay consistent over time\n•  Engage, don't just post",
);

const sentencesCoverSpec = {
  colors: {
    background: { value: TOMATO.red, hint: 'Page' },
    secondary: { value: TOMATO.ink, hint: 'Boxes behind Sentences and Swipe to read' },
    text: { value: TOMATO.white, hint: 'Big number, headline, arrow and the words in the boxes' },
  },
  fonts: { body: FONT },
  copy: {
    number: { label: 'Number', value: '3' },
    title: { label: 'Boxed title', value: 'Sentences' },
    headline: { label: 'Headline', value: 'marketers\nshould\nremember' },
    cta: { label: 'Swipe prompt', value: 'Swipe to read' },
  },
} as const satisfies ThemeSpec;

export const sentencesCover = themed(W, H, sentencesCoverSpec, (t) => {
  const say = writer(t.font('body'));
  return [
    rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
    say(t.copy('number'), 70, 400, 300, 440, t.color('text'), 700, { lineHeight: 1 }),
    boxed(say, t.copy('title'), 360, 500, 60, t.color('secondary'), t.color('text')),
    say(t.copy('headline'), 360, 590, 640, 60, t.color('text'), 500, { lineHeight: 1.1 }),
    icon('corner-down-right', 300, 880, 110, t.color('text'), { strokeWidth: 2 }),
    boxed(say, t.copy('cta'), 430, 940, 36, t.color('secondary'), t.color('text')),
  ];
});

const cropMarks = (color: string) => [
  line(110, 0, H, color, 2, { name: 'Frame line', rotation: 90 }),
  line(970, 0, H, color, 2, { name: 'Frame line', rotation: 90 }),
  line(0, 150, W, color, 2, { name: 'Frame line' }),
  line(0, 1200, W, color, 2, { name: 'Frame line' }),
];

const sentence = (lead: string, punch: string) => {
  const size = 64;
  const spec = {
    colors: {
      background: { value: TOMATO.red, hint: 'Page' },
      secondary: { value: TOMATO.ink, hint: 'Box behind the punchline' },
      text: {
        value: TOMATO.white,
        hint: 'Sentence and punchline; its faint shade draws the frame lines',
      },
    },
    fonts: { body: FONT },
    copy: {
      lead: { label: 'Sentence', value: lead },
      punch: { label: 'Punchline', value: punch },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => {
    const say = writer(t.font('body'));
    const word = t.copy('punch');
    const punchWidth = estimateWidth(word, size) + size * 0.5;
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      cropMarks(t.shade('text', 'rgba(255,255,255,0.75)')),
      say(t.copy('lead'), 110, 460, 860, size, t.color('text'), 500, {
        align: 'center',
        lineHeight: 1.3,
      }),
      boxed(say, word, (W - punchWidth) / 2, 640, size, t.color('secondary'), t.color('text')),
    ];
  });
};

export const sentenceClear = sentence('If your message is fuzzy,\nyour audience', "won't care.");
export const sentenceEngage = sentence("If your audience isn't\ninterested, they", "won't engage.");
export const sentenceConvert = sentence("If people don't engage,\nthey will", 'never convert.');
