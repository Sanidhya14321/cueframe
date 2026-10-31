import {
  circle,
  ellipse,
  poly,
  rating,
  rect,
  rotateNodes,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { H, HEADING_FONT, type ReviewPalette, reviewCard, STAR_GOLD, W } from './posts';

const scrollSpec = (p: ReviewPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Bottom of the page and the that speak line; its darker shade colors the reviewer bars and key outlines',
      },
      primary: {
        value: p.brand,
        hint: 'Top block, the typewriter body and the avatar dots',
      },
      surface: {
        value: '#fdf3e4',
        hint: 'Paper scroll, keys and space bar; its shades color the review cards, review lines and typewriter base',
      },
      secondary: { value: '#2b2f3a', hint: 'Roller; its darker shade colors the roller knobs' },
      accent: { value: STAR_GOLD, hint: 'Rating stars' },
      text: { value: p.paper, hint: 'Headline, the two stars and the review count' },
    },
    fonts: { heading: HEADING_FONT },
    copy: {
      headline: { label: 'Headline', value: ['Digital', 'Growth', 'Results'].join('\n') },
      tail: { label: 'Headline end', value: 'that speak' },
      note: { label: 'Review count', value: '48 five star\nreviews in 2026' },
    },
  }) as const satisfies ThemeSpec;

export const typewriterScroll = (p: ReviewPalette): Template =>
  themed(W, H, scrollSpec(p), (t) => {
    const paper = t.color('surface');
    const knob = t.shade('secondary', '#1f232c');
    const line = t.shade('surface', '#e7e5e4');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      rect(0, 0, W, 780, t.color('primary'), { name: 'Top block' }),
      rect(150, 50, 340, 860, paper, {
        name: 'Paper scroll',
        shadow: { color: 'rgba(0,0,0,0.25)', blur: 24, offsetX: 0, offsetY: 8 },
      }),
      Array.from({ length: 5 }, (_, index) => {
        const y = 90 + index * 158;
        return [
          rect(176, y, 288, 132, t.shade('surface', '#ffffff'), {
            cornerRadius: 10,
            name: 'Scroll review',
          }),
          circle(206, y + 30, 16, t.color('primary')),
          rect(234, y + 22, 120, 14, t.shade('background', p.ink), {
            cornerRadius: 7,
            name: 'Reviewer',
          }),
          rating(196, y + 56, 20, 5, t.color('accent'), 0.2),
          rect(196, y + 92, 248, 10, line, { cornerRadius: 5, name: 'Review line' }),
          rect(196, y + 110, 170, 10, line, { cornerRadius: 5, name: 'Review line' }),
        ];
      }),
      rect(110, 880, 420, 54, t.color('secondary'), { cornerRadius: 27, name: 'Roller' }),
      circle(100, 907, 30, knob),
      circle(540, 907, 30, knob),
      poly(
        [
          [130, 940],
          [510, 940],
          [580, 1180],
          [60, 1180],
        ],
        t.color('primary'),
        { name: 'Typewriter body' },
      ),
      rect(40, 1170, 560, 60, t.shade('surface', '#e8e3dc'), {
        cornerRadius: 16,
        name: 'Typewriter base',
      }),
      [0, 1, 2].map((row) =>
        Array.from({ length: 9 - row }, (_, index) =>
          circle(150 + row * 22 + index * 44, 1000 + row * 52, 17, paper, {
            stroke: t.shade('background', p.ink),
            strokeWidth: 4,
          }),
        ),
      ),
      rect(220, 1140, 200, 20, paper, { cornerRadius: 10, name: 'Space bar' }),
      text(t.copy('headline'), 590, 250, 450, {
        fontFamily: t.font('heading'),
        fontSize: 84,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.04,
      }),
      text(t.copy('tail'), 590, 512, 450, {
        fontFamily: t.font('heading'),
        fontSize: 84,
        fontWeight: 800,
        fill: t.color('background'),
      }),
      star(5, 860, 90, 110, t.color('text'), { innerRatio: 0.45 }),
      star(5, 860, 960, 120, t.color('text'), { innerRatio: 0.45 }),
      text(t.copy('note'), 640, 1110, 400, {
        fontFamily: t.font('heading'),
        fontSize: 34,
        fontWeight: 600,
        fill: t.color('text'),
        lineHeight: 1.25,
      }),
    ];
  });

const envelopeSpec = (p: ReviewPalette) =>
  ({
    colors: {
      background: { value: p.brand, hint: 'Page and the avatar circles on the review cards' },
      primary: {
        value: p.deep,
        hint: 'CLIENT, the envelope and the left star; its shades color the envelope pocket, its shadow and the reviewer names',
      },
      surface: {
        value: '#ffffff',
        hint: 'Review cards and the user icons; its grey shade colors the review lines',
      },
      text: { value: p.paper, hint: 'The reviews subtitle and the right star' },
      accent: { value: STAR_GOLD, hint: 'Rating stars' },
    },
    fonts: { heading: HEADING_FONT },
    copy: {
      title: { label: 'Title', value: 'CLIENT' },
      subtitle: { label: 'Subtitle', value: 'reviews' },
      reviewers: { label: 'Reviewer', value: ['Priya Shah', 'Marco Lind'] },
    },
  }) as const satisfies ThemeSpec;

export const envelopeReviews = (p: ReviewPalette): Template =>
  themed(W, H, envelopeSpec(p), (t) => {
    const [first = '', second = ''] = t.list('reviewers');
    const pocket = t.shade('primary', '#232a4d');
    const card = {
      card: t.color('surface'),
      badge: t.color('background'),
      icon: t.color('surface'),
      name: t.shade('primary', p.ink),
      stars: t.color('accent'),
      line: t.shade('surface', '#e5e7eb'),
      font: t.font('heading'),
    };
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 0, 110, W, {
        fontFamily: t.font('heading'),
        fontSize: 140,
        fontWeight: 800,
        fill: t.color('primary'),
        align: 'center',
        letterSpacing: 4,
      }),
      text(t.copy('subtitle'), 0, 270, W, {
        fontFamily: t.font('heading'),
        fontSize: 60,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
      }),
      ellipse(240, 1180, 600, 70, t.shade('primary', 'rgba(0,0,0,0.18)'), {
        name: 'Envelope shadow',
      }),
      rect(250, 760, 580, 420, t.color('primary'), { cornerRadius: 40, name: 'Envelope back' }),
      rotateNodes(-8, 400, 720, reviewCard(150, 610, 520, first, card, 2)),
      rotateNodes(6, 700, 820, reviewCard(400, 730, 520, second, card, 2)),
      poly(
        [
          [250, 840],
          [540, 1010],
          [830, 840],
          [830, 1140],
          [250, 1140],
        ],
        pocket,
        { name: 'Envelope pocket' },
      ),
      rect(250, 1100, 580, 80, pocket, { cornerRadius: 40, name: 'Envelope base' }),
      star(5, 110, 500, 90, t.color('primary'), { innerRatio: 0.45 }),
      star(5, 880, 1060, 120, t.color('text'), { innerRatio: 0.45 }),
    ];
  });
