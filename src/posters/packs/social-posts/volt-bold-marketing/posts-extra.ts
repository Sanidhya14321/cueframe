import { linear } from '@/design';
import { circle, icon, POST_SIZE, photo, rect, type ThemeSpec, text, themed } from '../../../kit';

import { BODY_FONT, DARK_BACKDROP, darkBackdrop, HEADING_FONT, VOLT } from './volt-kit';

const { width: W, height: H } = POST_SIZE;

const topSpec = {
  colors: {
    background: DARK_BACKDROP,
    text: { value: VOLT.white, hint: 'Headline, the question and the handles' },
    accent: { value: VOLT.lime, hint: 'Highlight behind top 2% and the social icon circles' },
    primary: { value: VOLT.black, hint: 'The top 2% words and the social icons' },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    lead: { label: 'Lead line', value: 'Only the' },
    highlight: { label: 'Highlight', value: 'top 2%' },
    headline: { label: 'Headline', value: 'of brands\nship weekly.' },
    question: { label: 'Question', value: '...so where do you stand?' },
    handle: { label: 'Handle', value: '@voltlab', hint: 'Shown next to every social icon' },
  },
} as const satisfies ThemeSpec;

export const topOnePercent = themed(W, H, topSpec, (t) => [
  darkBackdrop(t.color('background'), t.shade('background', VOLT.black)),
  text(t.copy('lead'), 0, 260, W, {
    fontFamily: t.font('heading'),
    fontSize: 96,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
  }),
  rect(300, 400, 480, 130, t.color('accent'), { cornerRadius: 8, name: 'Highlight' }),
  text(t.copy('highlight'), 300, 408, 480, {
    fontFamily: t.font('heading'),
    fontSize: 96,
    fontWeight: 400,
    fill: t.color('primary'),
    align: 'center',
  }),
  text(t.copy('headline'), 0, 560, W, {
    fontFamily: t.font('heading'),
    fontSize: 96,
    fontWeight: 400,
    fill: t.color('text'),
    align: 'center',
    lineHeight: 1.15,
  }),
  text(t.copy('question'), 0, 860, W, {
    fontFamily: t.font('body'),
    fontSize: 54,
    fontWeight: 600,
    italic: true,
    fill: t.color('text'),
    align: 'center',
  }),
  (['camera', 'globe', 'briefcase'] as const).map((name, index) => [
    circle(130 + index * 300, 1190, 22, t.color('accent')),
    icon(name, 116 + index * 300, 1176, 28, t.color('primary')),
    text(t.copy('handle'), 164 + index * 300, 1174, 200, {
      fontFamily: t.font('body'),
      fontSize: 28,
      fontWeight: 600,
      fill: t.color('text'),
    }),
  ]),
]);

const portraitSpec = {
  colors: {
    background: {
      value: VOLT.lime,
      hint: 'Page gradient (its darker shade is the bottom), the Market word and shifting signals',
    },
    text: {
      value: VOLT.black,
      hint: 'Side band, quote mark, the highlight bar and the quote lines',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    side: { label: 'Side word', value: 'Market' },
    lead: { label: 'Lead line', value: 'Read the' },
    highlight: { label: 'Highlight', value: 'shifting signals' },
    rest: { label: 'Closing lines', value: 'early and keep your\nbrand one step ahead.' },
  },
} as const satisfies ThemeSpec;

export const marketPortrait = themed(W, H, portraitSpec, (t) => [
  rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', VOLT.limeDeep)), {
    name: 'Background',
  }),
  rect(0, 0, 250, H, t.color('text'), { name: 'Side band' }),
  text(t.copy('side'), 30, 1290, 1240, {
    fontFamily: t.font('heading'),
    fontSize: 210,
    fontWeight: 400,
    fill: t.color('background'),
    rotation: -90,
    lineHeight: 1,
  }),
  photo('woman-portrait-4', 330, 560, 680, 790, { cornerRadius: 0 }),
  icon('quote', 330, 110, 90, t.color('text'), { strokeWidth: 2.6 }),
  text(t.copy('lead'), 450, 110, 560, {
    fontFamily: t.font('body'),
    fontSize: 50,
    fontWeight: 700,
    fill: t.color('text'),
  }),
  rect(450, 180, 470, 80, t.color('text'), { cornerRadius: 8, name: 'Highlight' }),
  text(t.copy('highlight'), 470, 190, 440, {
    fontFamily: t.font('body'),
    fontSize: 50,
    fontWeight: 800,
    fill: t.color('background'),
  }),
  text(t.copy('rest'), 450, 280, 580, {
    fontFamily: t.font('body'),
    fontSize: 50,
    fontWeight: 700,
    fill: t.color('text'),
    lineHeight: 1.2,
  }),
]);
