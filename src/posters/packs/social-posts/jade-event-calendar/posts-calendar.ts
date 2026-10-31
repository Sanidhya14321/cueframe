import { circle, icon, rect, star, type ThemeSpec, text, themed } from '../../../kit';
import { type EventPalette, FONTS, H, W } from './palette';

const calendarSpec = (p: EventPalette) =>
  ({
    colors: {
      background: { value: '#f4f7f6', hint: 'Page' },
      primary: { value: p.top, hint: 'Title and the two stars' },
      surface: {
        value: p.paper,
        hint: 'Notebook, the day labels and the arrow; its grey shades color the notebook edge, the ring holes and the idea cells',
      },
      text: {
        value: p.ink,
        hint: 'Subtitle, the cell headers and the arrow button; its lighter shade colors the rings, cell outlines and ideas',
      },
    },
    fonts: FONTS,
    copy: {
      title: { label: 'Title', value: 'Plan Your Content\nCalendar' },
      subtitle: { label: 'Subtitle', value: '12 ready post ideas for the month' },
      days: {
        label: 'Day label',
        value: Array.from(
          { length: 12 },
          (_, index) => `DAY ${String(index * 2 + 1).padStart(2, '0')}`,
        ),
      },
      ideas: {
        label: 'Post idea',
        value: [
          'Behind the\nscenes reel',
          'Customer\nshout-out',
          'Weekly tip\ncarousel',
          'Team photo\nFriday',
          'Product\nteaser',
          'Poll: pick\nthe colour',
          'Founder\nstory',
          'Event\nreminder',
          'Before and\nafter',
          'FAQ\nanswered',
          'Giveaway\nlaunch',
          'Monthly\nrecap',
        ],
      },
    },
  }) satisfies ThemeSpec;

export const contentCalendar = (p: EventPalette) =>
  themed(W, H, calendarSpec(p), (t) => {
    const body = t.font('body');
    const days = t.list('days');
    const grey = t.shade('surface', '#d1d5db');
    const charcoal = t.shade('text', '#1f2937');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      text(t.copy('title'), 0, 60, W, {
        fontFamily: t.font('heading'),
        fontSize: 70,
        fontWeight: 800,
        fill: t.color('primary'),
        align: 'center',
        lineHeight: 1.1,
      }),
      text(t.copy('subtitle'), 0, 236, W, {
        fontFamily: body,
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
      }),
      rect(170, 340, 740, 920, t.color('surface'), {
        cornerRadius: 20,
        stroke: grey,
        strokeWidth: 3,
        shadow: { color: 'rgba(0,0,0,0.12)', blur: 30, offsetX: 0, offsetY: 12 },
        name: 'Notebook',
      }),
      Array.from({ length: 9 }, (_, index) => [
        circle(222 + index * 80, 378, 11, grey),
        rect(213 + index * 80, 312, 18, 70, charcoal, { cornerRadius: 9, name: 'Ring' }),
      ]),
      t.list('ideas').map((idea, index) => {
        const x = 210 + (index % 3) * 225;
        const y = 420 + Math.floor(index / 3) * 205;
        return [
          rect(x, y, 210, 190, t.shade('surface', '#f3f4f6'), {
            cornerRadius: 8,
            stroke: charcoal,
            strokeWidth: 2,
            name: 'Idea cell',
          }),
          rect(x, y, 210, 40, t.color('text'), { cornerRadius: 8, name: 'Idea header' }),
          text(days[index] ?? '', x + 16, y + 9, 180, {
            fontFamily: body,
            fontSize: 18,
            fontWeight: 700,
            fill: t.color('surface'),
            letterSpacing: 2,
          }),
          text(idea, x + 16, y + 62, 180, {
            fontFamily: body,
            fontSize: 26,
            fontWeight: 600,
            fill: charcoal,
            lineHeight: 1.25,
          }),
        ];
      }),
      star(5, 50, 520, 90, t.color('primary'), { innerRatio: 0.42, rotation: -12 }),
      star(5, 945, 780, 80, t.color('primary'), { innerRatio: 0.42 }),
      circle(960, 1270, 46, t.color('text')),
      icon('arrow-up-right', 936, 1246, 48, t.color('surface')),
    ];
  });
