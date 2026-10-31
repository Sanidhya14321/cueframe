import { photo, rating, rect, type ThemeSpec, text, themed } from '../../../kit';
import { BODY_FONT, background, body, EMBER, HEADING_FONT, heading, SH, SW, tag } from './deck-kit';

const E = EMBER;

const reviewsSpec = {
  colors: {
    background: { value: E.accent, hint: 'Page, and the stars and brand tags on the dark reviews' },
    primary: {
      value: E.ink,
      hint: 'Title, dark review cards, the rating text, and the stars, quotes and tags on the light reviews',
    },
    surface: {
      value: E.paper,
      hint: 'Light review cards, the rating card and the quotes on the dark reviews',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Hear From\nOur Clients!' },
    quotes: {
      label: 'Quote',
      value: [
        '"Their team rebuilt our funnel in a month."',
        '"The playbook transformed our outbound."',
        '"Clear reporting, real growth, zero fluff."',
        '"Pipeline doubled within two quarters."',
      ],
    },
    brands: { label: 'Brand', value: ['Kitebase', 'Orbitly', 'Pinewire', 'Halcyon'] },
    rated: { label: 'Rating label', value: 'Rated' },
    score: { label: 'Score', value: '4.7' },
  },
} as const satisfies ThemeSpec;

export const clientsSlide = themed(SW, SH, reviewsSpec, (t) => {
  const ink = t.color('primary');
  const paper = t.color('surface');
  const accent = t.color('background');
  const brands = t.list('brands');
  return [
    background(accent),
    heading(t.font('heading'))(t.copy('title'), 100, 80, 150, ink, 1000),
    t.list('quotes').map((quote, index) => {
      const x = 100 + (index % 2) * 520;
      const y = 470 + Math.floor(index / 2) * 260;
      const dark = index === 0 || index === 3;
      return [
        rect(x, y, 490, 230, dark ? ink : paper, { cornerRadius: 26, name: 'Review' }),
        rating(x + 30, y + 30, 26, 5, dark ? accent : ink),
        body(t.font('body'))(quote, x + 30, y + 76, 430, 26, dark ? paper : ink),
        tag(
          brands[index] ?? '',
          x + 30,
          y + 160,
          dark ? accent : ink,
          dark ? ink : paper,
          t.font('body'),
        ),
      ];
    }),
    photo('phone-hand-2', 1180, 0, 740, SH),
    rect(1330, 330, 360, 360, paper, { cornerRadius: 40, name: 'Rating card' }),
    text(t.copy('rated'), 1330, 370, 360, {
      fontFamily: t.font('body'),
      fontSize: 34,
      fontWeight: 700,
      fill: ink,
      align: 'center',
    }),
    text(t.copy('score'), 1330, 430, 360, {
      fontFamily: t.font('heading'),
      fontSize: 170,
      fontWeight: 400,
      fill: ink,
      align: 'center',
    }),
  ];
});
