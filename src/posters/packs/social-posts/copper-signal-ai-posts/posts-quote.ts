import { linear } from '@/design';
import { circle, icon, rect, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, BRAND, brand, COPPER, copperFill, H, HEADING, W } from './posts';

const quoteSpec = {
  colors: {
    background: {
      value: COPPER.black,
      hint: 'Page gradient; its warmer shade colors the top of the page',
    },
    primary: {
      value: COPPER.copper,
      hint: 'Quote mark and their time.; its amber shades color the dot grid and the gradient end',
    },
    secondary: { value: COPPER.grey, hint: 'Stay inspired and the author name' },
    text: {
      value: COPPER.white,
      hint: 'Quote, the brand name and, faded, the rule under the quote',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Stay inspired' },
    quote: { label: 'Quote', value: 'Good AI hands\npeople back' },
    ending: { label: 'Quote ending', value: 'their time.' },
    author: { label: 'Author', value: 'Rhea Sandoval' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

export const quotePost = themed(W, H, quoteSpec, (t) => [
  rect(0, 0, W, H, linear(150, t.shade('background', '#24170e'), t.color('background')), {
    name: 'Background',
  }),
  Array.from({ length: 70 }, (_, index) => {
    const column = index % 10;
    const row = Math.floor(index / 10);
    return circle(
      620 + column * 44,
      80 + row * 44,
      3 + (column + row) * 0.35,
      t.shade('primary', 'rgba(255,192,122,0.25)'),
      {
        name: 'Dot',
      },
    );
  }),
  text(t.copy('kicker'), 100, 300, 600, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 500,
    fill: t.color('secondary'),
  }),
  icon('quote', 250, 620, 150, t.color('primary'), { strokeWidth: 2.4, rotation: 180 }),
  text(t.copy('quote'), 290, 480, 720, {
    fontFamily: t.font('heading'),
    fontSize: 82,
    fontWeight: 600,
    fill: t.color('text'),
    lineHeight: 1.12,
  }),
  text(t.copy('ending'), 290, 664, 720, {
    fontFamily: t.font('heading'),
    fontSize: 82,
    fontWeight: 800,
    fill: copperFill(t.color('primary'), t.shade('primary', COPPER.amber)),
  }),
  rect(290, 820, 620, 3, t.shade('text', 'rgba(255,255,255,0.3)'), { name: 'Rule' }),
  text(t.copy('author'), 290, 850, 600, {
    fontFamily: t.font('body'),
    fontSize: 34,
    fontWeight: 600,
    fill: t.color('secondary'),
  }),
  brand(t.copy('brand'), 1220, t.color('text'), t.font('heading')),
]);
