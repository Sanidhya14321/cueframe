import { linear } from '@/design';
import {
  circle,
  icon,
  POST_SIZE,
  pill,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { backdrop, backdropHint, type EventTheme, FONTS } from './posts';

const { width: W, height: H } = POST_SIZE;

interface FlipInk {
  caption: string;
  paper: string;
  brand: string;
  ink: string;
  heading: string;
  body: string;
}

const flipBox = (
  ink: FlipInk,
  x: number,
  y: number,
  caption: string,
  value: string,
  bold: boolean,
) => [
  rect(x, y, 170, 44, ink.caption, { name: 'Flip caption' }),
  text(caption, x, y + 9, 170, {
    fontFamily: ink.body,
    fontSize: 22,
    fontWeight: 700,
    fill: ink.paper,
    align: 'center',
    letterSpacing: 2,
  }),
  rect(x, y + 44, 170, 150, bold ? ink.brand : ink.paper, {
    name: 'Flip digit',
    stroke: ink.ink,
    strokeWidth: 6,
  }),
  text(value, x, y + 66, 170, {
    fontFamily: ink.heading,
    fontSize: 96,
    fontWeight: 800,
    fill: bold ? ink.paper : ink.ink,
    align: 'center',
    lineHeight: 1,
  }),
  rect(x, y + 117, 170, 4, bold ? ink.paper : ink.ink, { name: 'Flip seam' }),
];

const STEEL = '#b9bec7';

export const saveDate = (theme: EventTheme) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: STEEL,
          hint: 'Steel doors behind the poster; its shades color the door highlights, seam and floor',
        },
        surface: {
          value: '#fcfcfa',
          hint: 'Poster sheet; its white shade colors the light flip cards, the captions and the middle number',
        },
        primary: { value: theme.brand, hint: 'Date, the star and the middle flip card' },
        text: {
          value: theme.ink,
          hint: 'Save the, the call to action and the flip card caption bars, outlines and dark numbers; its grey shade colors the invite and question',
        },
        accent: { value: theme.accent, hint: 'Tape strips holding the poster' },
      },
      fonts: FONTS,
      copy: {
        kicker: { label: 'Kicker', value: 'Save the' },
        title: { label: 'Title', value: 'Date' },
        invite: {
          label: 'Invite',
          value: 'You are invited to our first\nin-person founder meetup',
        },
        captions: { label: 'Flip caption', value: ['DAY', 'MONTH', 'YEAR'] },
        values: { label: 'Flip number', value: ['14', '11', '26'] },
        question: { label: 'Question', value: 'Want a seat?' },
        cta: { label: 'Call to action', value: 'Comment “RSVP”' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const values = t.list('values');
      const ink: FlipInk = {
        caption: t.color('text'),
        paper: t.shade('surface', theme.paper),
        brand: t.color('primary'),
        ink: t.color('text'),
        heading: t.font('heading'),
        body: t.font('body'),
      };
      return [
        rect(
          0,
          0,
          W,
          H,
          linear(
            90,
            t.color('background'),
            t.shade('background', '#eef0f3'),
            t.shade('background', '#c4c9d1'),
            t.shade('background', '#e6e8ec'),
            t.shade('background', '#b3b9c2'),
          ),
          { name: 'Steel doors' },
        ),
        rect(538, 0, 4, H, t.shade('background', '#8f97a3'), { name: 'Door seam' }),
        rect(0, 1270, W, 80, t.shade('background', '#9aa1ab'), { name: 'Floor' }),
        rotateNodes(-2, 540, 690, [
          rect(190, 250, 700, 880, t.color('surface'), { name: 'Poster', ...shadow(30, 14) }),
          star(5, 220, 280, 56, t.color('primary'), { innerRatio: 0.42 }),
          text(t.copy('kicker'), 190, 320, 700, {
            fontFamily: t.font('heading'),
            fontSize: 84,
            fontWeight: 800,
            fill: t.color('text'),
            align: 'center',
          }),
          text(t.copy('title'), 190, 410, 700, {
            fontFamily: t.font('heading'),
            fontSize: 108,
            fontWeight: 800,
            fill: t.color('primary'),
            align: 'center',
          }),
          text(t.copy('invite'), 190, 560, 700, {
            fontFamily: t.font('body'),
            fontSize: 32,
            fontWeight: 500,
            fill: t.shade('text', '#4b5563'),
            align: 'center',
            lineHeight: 1.35,
          }),
          t
            .list('captions')
            .map((caption, index) =>
              flipBox(ink, 255 + index * 200, 700, caption, values[index] ?? '', index === 1),
            ),
          text(t.copy('question'), 190, 940, 700, {
            fontFamily: t.font('body'),
            fontSize: 32,
            fontWeight: 500,
            fill: t.shade('text', '#4b5563'),
            align: 'center',
          }),
          text(t.copy('cta'), 190, 990, 700, {
            fontFamily: t.font('heading'),
            fontSize: 52,
            fontWeight: 800,
            fill: t.color('text'),
            align: 'center',
          }),
        ]),
        rect(260, 210, 200, 64, t.shade('accent', 'rgba(255,193,69,0.8)'), {
          rotation: -8,
          name: 'Tape',
        }),
        rect(640, 196, 200, 64, t.shade('accent', 'rgba(255,193,69,0.8)'), {
          rotation: 6,
          name: 'Tape',
        }),
      ];
    },
  );

const WEEKS = Array.from(
  { length: 9 },
  (_, index) => `Week ${Math.floor(index / 3) + 1} · ${['Mon', 'Wed', 'Fri'][index % 3] ?? ''}`,
);

export const contentCalendar = (theme: EventTheme) =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: '#fbf7f9', hint: 'Page' },
        surface: {
          value: theme.paper,
          hint: 'Calendar sheet, the idea cells and the arrow',
        },
        primary: {
          value: theme.brand,
          hint: 'Calendar and the left star; its pale shade fills the cell headers',
        },
        text: {
          value: theme.ink,
          hint: 'First title line, the rings, cell outlines, week labels, ideas, the right star and the arrow button; its grey shade colors the subline',
        },
      },
      fonts: FONTS,
      copy: {
        title: { label: 'Title', value: 'Copy Our Content' },
        highlight: { label: 'Highlight', value: 'Calendar' },
        subline: { label: 'Subline', value: '9 ready post ideas for the month' },
        weeks: { label: 'Cell header', value: WEEKS },
        ideas: {
          label: 'Idea',
          value: [
            'Founder\nstory',
            'Feature\nquick tip',
            'Customer\nwin',
            'Poll your\nusers',
            'Meet the\nteam',
            'Roadmap\nteaser',
            'Live Q&A\nreminder',
            'Myth vs\nfact',
            'Launch\nrecap',
          ],
        },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const weeks = t.list('weeks');
      return [
        rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
        text(t.copy('title'), 0, 80, W, {
          fontFamily: t.font('heading'),
          fontSize: 72,
          fontWeight: 800,
          fill: t.color('text'),
          align: 'center',
        }),
        text(t.copy('highlight'), 0, 164, W, {
          fontFamily: t.font('heading'),
          fontSize: 72,
          fontWeight: 800,
          fill: t.color('primary'),
          align: 'center',
        }),
        text(t.copy('subline'), 0, 268, W, {
          fontFamily: t.font('body'),
          fontSize: 34,
          fontWeight: 600,
          fill: t.shade('text', '#4b5563'),
          align: 'center',
        }),
        rect(150, 380, 780, 860, t.color('surface'), {
          name: 'Calendar',
          cornerRadius: 12,
          ...shadow(40, 16),
        }),
        Array.from({ length: 9 }, (_, index) =>
          rect(200 + index * 82, 350, 22, 70, t.color('text'), { name: 'Ring', cornerRadius: 11 }),
        ),
        t.list('ideas').map((idea, index) => {
          const x = 180 + (index % 3) * 250;
          const y = 450 + Math.floor(index / 3) * 260;
          return [
            rect(x, y, 230, 240, t.color('surface'), {
              name: 'Idea cell',
              stroke: t.color('text'),
              strokeWidth: 4,
            }),
            rect(x, y, 230, 50, t.shade('primary', theme.tint), { name: 'Cell head' }),
            text(weeks[index] ?? '', x, y + 12, 230, {
              fontFamily: t.font('body'),
              fontSize: 22,
              fontWeight: 700,
              fill: t.color('text'),
              align: 'center',
            }),
            text(idea, x + 22, y + 80, 190, {
              fontFamily: t.font('heading'),
              fontSize: 32,
              fontWeight: 700,
              fill: t.color('text'),
              lineHeight: 1.2,
            }),
          ];
        }),
        star(5, 50, 620, 100, t.color('primary'), { innerRatio: 0.42 }),
        star(5, 950, 860, 90, t.color('text'), { innerRatio: 0.42 }),
        circle(980, 1260, 50, t.color('text')),
        icon('arrow-up-right', 956, 1236, 48, t.color('surface')),
      ];
    },
  );

export const eventStory = (theme: EventTheme) =>
  themed(
    STORY_SIZE.width,
    STORY_SIZE.height,
    {
      colors: {
        background: { value: theme.from, hint: backdropHint },
        surface: {
          value: theme.paper,
          hint: 'Title, agenda items, step numbers, the RSVP button and the bottom star',
        },
        text: { value: theme.ink, hint: 'Agenda card and the RSVP button label' },
        primary: { value: theme.brand, hint: 'Date line and the step circles' },
        accent: { value: theme.accent, hint: 'Top corner star' },
      },
      fonts: FONTS,
      copy: {
        kicker: { label: 'Kicker', value: 'Upcoming' },
        title: { label: 'Title', value: 'Demo\nNight' },
        date: { label: 'Date and time', value: 'Thu, 14 Nov · 6 pm' },
        steps: { label: 'Step number', value: ['1', '2', '3'] },
        items: {
          label: 'Agenda item',
          value: ['Live product walkthrough', 'Founder fireside chat', 'Early access giveaway'],
        },
        button: { label: 'Button', value: 'Tap to RSVP' },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const items = t.list('items');
      return [
        backdrop(
          t.color('background'),
          t.shade('background', theme.to),
          STORY_SIZE.width,
          STORY_SIZE.height,
        ),
        text(t.copy('kicker'), 90, 160, 900, {
          fontFamily: t.font('heading'),
          fontSize: 52,
          fontWeight: 500,
          fill: t.color('surface'),
        }),
        text(t.copy('title'), 90, 230, 900, {
          fontFamily: t.font('heading'),
          fontSize: 200,
          fontWeight: 800,
          fill: t.color('surface'),
          lineHeight: 1,
        }),
        star(5, 820, 140, 170, t.color('accent'), { innerRatio: 0.42 }),
        rect(90, 720, 900, 640, t.color('text'), { name: 'Agenda card', ...shadow(40, 16) }),
        text(t.copy('date'), 140, 780, 800, {
          fontFamily: t.font('heading'),
          fontSize: 64,
          fontWeight: 800,
          fill: t.color('primary'),
        }),
        t.list('steps').map((step, index) => [
          circle(170, 960 + index * 120, 26, t.color('primary')),
          text(step, 144, 942 + index * 120, 52, {
            fontFamily: t.font('heading'),
            fontSize: 32,
            fontWeight: 800,
            fill: t.color('surface'),
            align: 'center',
          }),
          text(items[index] ?? '', 230, 938 + index * 120, 720, {
            fontFamily: t.font('body'),
            fontSize: 42,
            fontWeight: 600,
            fill: t.color('surface'),
          }),
        ]),
        pill(t.copy('button'), 290, 1560, {
          fill: t.color('surface'),
          color: t.color('text'),
          fontSize: 52,
          fontFamily: t.font('heading'),
          fontWeight: 800,
          width: 500,
        }),
        star(5, 80, 1700, 120, t.color('surface'), { innerRatio: 0.42 }),
      ];
    },
  );
