import { linear } from '@/design';
import { circle, rect, STORY_SIZE, star, type ThemeSpec, text, themed } from '../../../kit';
import { type EventPalette, FONTS, H, JADE, W } from './palette';

const listSpec = (p: EventPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Page gradient; its lighter shade colors the bottom of the gradient',
      },
      surface: {
        value: p.paper,
        hint: "What's On, the date tiles and the event titles; its translucent shade colors the bottom star",
      },
      accent: { value: p.accent, hint: 'Kicker line, the top star and the event dots' },
      text: { value: p.ink, hint: 'Day numbers; its lighter shade colors the month on the tiles' },
      secondary: { value: p.soft, hint: 'Event descriptions' },
    },
    fonts: FONTS,
    copy: {
      kicker: { label: 'Kicker', value: 'This month at Fernway' },
      title: { label: 'Title', value: "What's On" },
      month: { label: 'Month', value: 'NOV' },
      days: { label: 'Day', value: ['06', '12', '19', '27'] },
      events: {
        label: 'Event',
        value: ['Maker Spotlight', 'Community Poll', 'Live Workshop', 'VIP Preview Night'],
      },
      details: {
        label: 'Event detail',
        value: [
          'Celebrate the people who\nbuild your brand every day.',
          'Let your audience pick the\nnext product colour.',
          'How small teams use AI to\nsave ten hours a week.',
          'Thank your most loyal\ncustomers first.',
        ],
      },
    },
  }) as const satisfies ThemeSpec;

const eventListAt = (p: EventPalette, height: number) => {
  const story = height > H;
  const top = story ? 520 : 300;
  const pitch = story ? 330 : 250;
  return themed(W, height, listSpec(p), (t) => {
    const heading = t.font('heading');
    const body = t.font('body');
    const paper = t.color('surface');
    const events = t.list('events');
    const details = t.list('details');
    return [
      rect(0, 0, W, height, linear(160, t.color('background'), t.shade('background', p.top)), {
        name: 'Background',
      }),
      text(t.copy('kicker'), 80, story ? 200 : 90, 800, {
        fontFamily: body,
        fontSize: 34,
        fontWeight: 600,
        fill: t.color('accent'),
      }),
      text(t.copy('title'), 80, story ? 250 : 140, 800, {
        fontFamily: heading,
        fontSize: story ? 120 : 84,
        fontWeight: 800,
        fill: paper,
      }),
      star(5, 880, story ? 160 : 70, 120, t.color('accent'), { innerRatio: 0.42 }),
      t.list('days').map((day, index) => {
        const y = top + index * pitch;
        return [
          rect(80, y, 180, 180, paper, { cornerRadius: 18, name: `${day} date` }),
          text(day, 80, y + 26, 180, {
            fontFamily: heading,
            fontSize: 80,
            fontWeight: 800,
            fill: t.color('text'),
            align: 'center',
          }),
          text(t.copy('month'), 80, y + 124, 180, {
            fontFamily: body,
            fontSize: 24,
            fontWeight: 700,
            fill: t.shade('text', '#6b7280'),
            align: 'center',
            letterSpacing: 4,
          }),
          circle(250, y + 10, 18, t.color('accent')),
          text(events[index] ?? '', 300, y + 14, 720, {
            fontFamily: heading,
            fontSize: 50,
            fontWeight: 800,
            fill: paper,
          }),
          text(details[index] ?? '', 300, y + 84, 720, {
            fontFamily: body,
            fontSize: 32,
            fontWeight: 400,
            fill: t.color('secondary'),
            lineHeight: 1.3,
          }),
        ];
      }),
      star(5, 860, height - 200, 140, t.shade('surface', 'rgba(255,255,255,0.9)'), {
        innerRatio: 0.42,
      }),
    ];
  });
};

export const eventList = (p: EventPalette) => eventListAt(p, H);

export const eventStory = eventListAt(JADE, STORY_SIZE.height);

const daySpec = (p: EventPalette) =>
  ({
    colors: {
      background: {
        value: p.deep,
        hint: 'Page gradient; its lighter shade colors the bottom of the gradient',
      },
      surface: {
        value: p.paper,
        hint: 'Back card, the date, the reserve box and the big star; its grey shade colors the time',
      },
      accent: { value: p.accent, hint: 'Small star, Event Day and the event headline' },
      text: { value: p.ink, hint: 'Front card and the reserve line' },
    },
    fonts: FONTS,
    copy: {
      kicker: { label: 'Kicker', value: 'Event Day' },
      date: { label: 'Date', value: 'Thu, 14 Nov' },
      time: { label: 'Time', value: 'From 6 pm to 9 pm' },
      headline: { label: 'Headline', value: 'Founder meetup\nand live Q&A' },
      cta: { label: 'Reserve line', value: 'Reserve your free\nseat today' },
    },
  }) as const satisfies ThemeSpec;

export const eventDay = (p: EventPalette) =>
  themed(W, H, daySpec(p), (t) => {
    const heading = t.font('heading');
    const body = t.font('body');
    const paper = t.color('surface');
    return [
      rect(0, 0, W, H, linear(150, t.color('background'), t.shade('background', p.top)), {
        name: 'Background',
      }),
      star(5, 90, 110, 110, t.color('accent'), { innerRatio: 0.42 }),
      rect(150, 290, 700, 720, paper, { rotation: -8, cornerRadius: 6, name: 'Back card' }),
      rect(220, 330, 680, 700, t.color('text'), {
        cornerRadius: 6,
        shadow: { color: 'rgba(0,0,0,0.4)', blur: 40, offsetX: 0, offsetY: 18 },
        name: 'Front card',
      }),
      text(t.copy('kicker'), 270, 384, 580, {
        fontFamily: body,
        fontSize: 34,
        fontWeight: 600,
        fill: t.color('accent'),
      }),
      text(t.copy('date'), 270, 434, 580, {
        fontFamily: heading,
        fontSize: 76,
        fontWeight: 800,
        fill: paper,
      }),
      text(t.copy('time'), 270, 540, 580, {
        fontFamily: body,
        fontSize: 34,
        fontWeight: 400,
        fill: t.shade('surface', '#d1d5db'),
      }),
      text(t.copy('headline'), 270, 624, 580, {
        fontFamily: heading,
        fontSize: 48,
        fontWeight: 800,
        fill: t.color('accent'),
        lineHeight: 1.15,
      }),
      rect(270, 800, 580, 160, paper, { cornerRadius: 8, name: 'Reserve box' }),
      text(t.copy('cta'), 300, 830, 520, {
        fontFamily: heading,
        fontSize: 40,
        fontWeight: 800,
        fill: t.color('text'),
        lineHeight: 1.2,
      }),
      star(5, 760, 1000, 240, paper, { innerRatio: 0.42 }),
    ];
  });
