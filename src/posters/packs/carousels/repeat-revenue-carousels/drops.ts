import { linear } from '@/design';
import { ellipse, icon, type Nodes, path, rect, type ThemeSpec, themed } from '../../../kit';
import { textWidth } from '../momentum-carousel-kit/text-width';
import { BLUSH, BODY, CLEAR, H, HEADING, MINT, NIGHT, PLUM, SITE, say, W, WHITE } from './style';

const TEXTURE = 'rgba(255,255,255,0.035)';

const texture = (fill: string): Nodes[] =>
  Array.from({ length: 34 }, (_, index) =>
    rect(0, 20 + index * 40, W, 2, fill, { name: 'Texture line' }),
  );

const dropCoverSpec = {
  colors: {
    background: {
      value: PLUM,
      hint: 'Page gradient; its darker shade is the bottom of the gradient',
    },
    accent: { value: MINT, hint: 'Circle around the key word, the underline and the arrow' },
    text: {
      value: WHITE,
      hint: 'Website and headline; its shades color the body and the faint texture lines',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    site: SITE,
    intro: { label: 'Headline', value: 'Habits to' },
    word: { label: 'Circled word', value: 'Drop' },
    last: { label: 'Last word', value: 'Today' },
    body: { label: 'Body', value: 'Small habits add up. Are you\nslowing your own week down?' },
  },
} as const satisfies ThemeSpec;

export const dropCover = themed(W, H, dropCoverSpec, (t) => {
  const heading = t.font('heading');
  const word = t.copy('word');
  return [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NIGHT)), {
      name: 'Background',
    }),
    texture(t.shade('text', TEXTURE)),
    say(t.copy('site'), 90, 140, 600, t.font('body'), 34, 700, t.color('text')),
    say(t.copy('intro'), 90, 470, 900, heading, 96, 800, t.color('text')),
    ellipse(64, 586, textWidth(word, 96) + 64, 140, t.shade('accent', CLEAR), {
      name: 'Circle mark',
      stroke: t.color('accent'),
      strokeWidth: 6,
    }),
    say(word, 96, 594, 400, heading, 96, 800, t.color('text')),
    say(t.copy('last'), 150 + textWidth(word, 96), 594, 600, heading, 96, 800, t.color('text')),
    say(t.copy('body'), 90, 790, 900, t.font('body'), 44, 500, t.shade('text', BLUSH), {
      lineHeight: 1.35,
    }),
    rect(90, 920, 260, 8, t.color('accent'), { name: 'Underline', cornerRadius: 4 }),
    icon('arrow-right', 900, 1160, 96, t.color('accent'), { strokeWidth: 2.5 }),
  ];
});

interface DropCopy {
  number: string;
  title: string;
  body: string;
}

const dropStepSpec = (copy: DropCopy) =>
  ({
    colors: {
      background: {
        value: PLUM,
        hint: 'Page gradient; its darker shade is the bottom of the gradient',
      },
      accent: { value: MINT, hint: 'Ring around the number and the corner arc' },
      text: {
        value: WHITE,
        hint: 'Number and title; its shades color the body and the faint texture lines',
      },
    },
    fonts: { heading: HEADING, body: BODY },
    copy: {
      number: { label: 'Step number', value: copy.number },
      title: { label: 'Title', value: copy.title },
      body: { label: 'Body', value: copy.body },
    },
  }) satisfies ThemeSpec;

const dropStep = (copy: DropCopy) =>
  themed(W, H, dropStepSpec(copy), (t) => [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', NIGHT)), {
      name: 'Background',
    }),
    texture(t.shade('text', TEXTURE)),
    ellipse(90, 250, 180, 96, t.shade('accent', CLEAR), {
      name: 'Number ring',
      stroke: t.color('accent'),
      strokeWidth: 5,
    }),
    say(t.copy('number'), 90, 268, 180, t.font('heading'), 52, 800, t.color('text'), {
      align: 'center',
    }),
    say(t.copy('title'), 90, 420, 900, t.font('heading'), 84, 800, t.color('text'), {
      lineHeight: 1.1,
    }),
    say(t.copy('body'), 90, 660, 880, t.font('body'), 40, 400, t.shade('text', BLUSH), {
      lineHeight: 1.45,
    }),
    path(
      'M10 110 A100 100 0 0 0 110 10',
      880,
      1100,
      120,
      120,
      t.shade('accent', CLEAR),
      { width: 120, height: 120 },
      { name: 'Arc', stroke: t.color('accent'), strokeWidth: 12 },
    ),
  ]);

export const DROP_STEPS = [
  dropStep({
    number: '01',
    title: 'Opening Email\nFirst Thing',
    body: 'Starting the day in your inbox puts you in reactive mode. Guard the first hour for your most important task.',
  }),
  dropStep({
    number: '02',
    title: 'Switching Tasks\nAll Day',
    body: 'Jumping between jobs drains focus and adds mistakes. Finish one thing before you start the next.',
  }),
  dropStep({
    number: '03',
    title: 'Scrolling\nBetween Tasks',
    body: 'Short scroll breaks quietly eat an hour a day. Set app limits and take real breaks instead.',
  }),
] as const;
