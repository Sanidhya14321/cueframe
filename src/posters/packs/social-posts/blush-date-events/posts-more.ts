import { linear } from '@/design';
import { rect, rotateNodes, star, type ThemeSpec, text, themed } from '../../../kit';
import { BODY, type EventPalette, H, HEADING, W } from './posts';

const AGENDA = [
  { day: '15', title: 'Creator Spotlight', body: 'Celebrate the makers behind your brand.' },
  { day: '20', title: 'Community Poll', body: 'Let your followers pick what comes next.' },
  { day: '24', title: 'Live Workshop', body: 'Teach one skill in thirty minutes flat.' },
  { day: '28', title: 'Early Access Night', body: 'Reward your most loyal customers first.' },
];

export const eventList = (p: EventPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: p.deep, hint: 'Page and the date numbers' },
        surface: {
          value: p.paper,
          hint: 'Date boxes, the month labels, the descriptions and the top star',
        },
        primary: { value: p.brand, hint: 'Date headers, the event titles and the side stars' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        month: { label: 'Card month', value: 'NOV', hint: 'Shown on every date box' },
        days: { label: 'Day', value: AGENDA.map((item) => item.day) },
        titles: { label: 'Event', value: AGENDA.map((item) => item.title) },
        details: { label: 'Description', value: AGENDA.map((item) => item.body) },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const titles = t.list('titles');
      const details = t.list('details');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        star(5, 470, 40, 80, t.color('surface'), { innerRatio: 0.45 }),
        t.list('days').map((day, index) => {
          const y = 150 + index * 285;
          return [
            rect(110, y, 160, 170, t.color('surface'), { cornerRadius: 10, name: 'Date box' }),
            rect(110, y, 160, 44, t.color('primary'), { cornerRadius: 10, name: 'Date header' }),
            text(t.copy('month'), 110, y + 6, 160, {
              fontFamily: t.font('body'),
              fontSize: 24,
              fontWeight: 800,
              fill: t.color('surface'),
              align: 'center',
              letterSpacing: 3,
            }),
            text(day, 110, y + 56, 160, {
              fontFamily: t.font('heading'),
              fontSize: 82,
              fontWeight: 800,
              fill: t.color('background'),
              align: 'center',
              lineHeight: 1,
            }),
            text(titles[index] ?? '', 310, y + 14, 700, {
              fontFamily: t.font('heading'),
              fontSize: 54,
              fontWeight: 800,
              fill: t.color('primary'),
            }),
            text(details[index] ?? '', 310, y + 86, 660, {
              fontFamily: t.font('body'),
              fontSize: 30,
              fontWeight: 500,
              fill: t.color('surface'),
              lineHeight: 1.35,
            }),
          ];
        }),
        star(5, 950, 130, 90, t.color('primary'), { innerRatio: 0.45 }),
        star(5, 940, 1230, 90, t.color('primary'), { innerRatio: 0.45 }),
      ];
    },
  );

export const saveTheDate = (p: EventPalette) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: '#8c959d',
          hint: 'Steel doors; its shades color the door shine, the seam and the handles',
        },
        surface: {
          value: '#f8f8f6',
          hint: 'Poster card; its lighter shade colors the countdown digits',
        },
        primary: { value: p.brand, hint: 'Title and the middle countdown tile' },
        secondary: {
          value: p.deep,
          hint: 'Outer countdown tiles, the call to action and the star; its translucent shade is the flip lines',
        },
        text: {
          value: '#1f2937',
          hint: 'Invitation; its lighter shade colors the prompt',
        },
        accent: { value: 'rgba(196,164,120,0.85)', hint: 'Tape strips holding the poster' },
      },
      fonts: { heading: HEADING, body: BODY },
      copy: {
        title: { label: 'Title', value: 'Save the Date' },
        invite: { label: 'Invitation', value: "You're invited to an\nunforgettable evening." },
        digits: { label: 'Countdown digit', value: ['08', '09', '10'] },
        prompt: { label: 'Prompt', value: 'Want to hear more?' },
        cta: { label: 'Call to action', value: 'Comment "GO"' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const head = t.font('heading');
      const body = t.font('body');
      const handle = t.shade('background', '#5b636b');
      return [
        rect(
          0,
          0,
          W,
          H,
          linear(
            90,
            t.color('background'),
            t.shade('background', '#dfe3e6'),
            t.shade('background', '#a3abb2'),
            t.shade('background', '#e6e9eb'),
            t.color('background'),
          ),
          { name: 'Steel doors' },
        ),
        rect(536, 0, 8, H, t.shade('background', 'rgba(0,0,0,0.25)'), { name: 'Door seam' }),
        rect(470, 560, 18, 220, handle, { cornerRadius: 9, name: 'Handle' }),
        rect(592, 560, 18, 220, handle, { cornerRadius: 9, name: 'Handle' }),
        rotateNodes(-2, 540, 700, [
          rect(200, 290, 680, 820, t.color('surface'), {
            name: 'Poster',
            shadow: { color: 'rgba(0,0,0,0.3)', blur: 30, offsetX: 0, offsetY: 14 },
          }),
          text(t.copy('title'), 200, 380, 680, {
            fontFamily: head,
            fontSize: 78,
            fontWeight: 800,
            fill: t.color('primary'),
            align: 'center',
          }),
          text(t.copy('invite'), 200, 490, 680, {
            fontFamily: body,
            fontSize: 32,
            fontWeight: 500,
            fill: t.color('text'),
            align: 'center',
            lineHeight: 1.35,
          }),
          t.list('digits').map((value, index) => [
            rect(
              262 + index * 192,
              640,
              172,
              190,
              index === 1 ? t.color('primary') : t.color('secondary'),
              { cornerRadius: 10, name: 'Countdown tile' },
            ),
            rect(262 + index * 192, 732, 172, 6, t.shade('secondary', 'rgba(0,0,0,0.3)'), {
              name: 'Flip line',
            }),
            text(value, 262 + index * 192, 668, 172, {
              fontFamily: head,
              fontSize: 100,
              fontWeight: 800,
              fill: t.shade('surface', p.paper),
              align: 'center',
              lineHeight: 1,
            }),
          ]),
          text(t.copy('prompt'), 200, 890, 680, {
            fontFamily: body,
            fontSize: 30,
            fontWeight: 500,
            fill: t.shade('text', '#4b5563'),
            align: 'center',
          }),
          text(t.copy('cta'), 200, 940, 680, {
            fontFamily: head,
            fontSize: 56,
            fontWeight: 800,
            fill: t.color('secondary'),
            align: 'center',
          }),
        ]),
        rotateNodes(-38, 250, 300, [rect(170, 270, 200, 64, t.color('accent'), { name: 'Tape' })]),
        rotateNodes(38, 830, 300, [rect(730, 270, 200, 64, t.color('accent'), { name: 'Tape' })]),
        star(5, 130, 140, 80, t.color('secondary'), { innerRatio: 0.45 }),
      ];
    },
  );
