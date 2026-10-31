import { IMAGE_FILTER_PRESETS } from '@/design';
import {
  POST_SIZE,
  photo,
  rect,
  STORY_SIZE,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, backdrop, HANDLE, HEAD, MERIDIAN } from './posts';

const { width: W, height: H } = POST_SIZE;

const EVENT_DAYS = [4, 12, 19, 22, 26, 30];

const calendarSpec = {
  colors: {
    background: {
      value: MERIDIAN.mid,
      hint: 'Page gradient; its darker shades color the bottom of the gradient and the date numbers',
    },
    surface: {
      value: MERIDIAN.cream,
      hint: 'Date cells; its faint white shade colors the empty cells',
    },
    accent: { value: MERIDIAN.coral, hint: 'AUGUST, the event date cells and the handle' },
    text: {
      value: MERIDIAN.white,
      hint: 'Weekday names and the event lists; its sand shade colors Coming up',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'Coming up' },
    month: { label: 'Month', value: 'AUGUST' },
    weekdays: { label: 'Weekday', value: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] },
    dates: {
      label: 'Date',
      value: Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, '0')),
    },
    events: {
      label: 'Event column',
      value: [
        '04  Founder Q&A\n12  Growth Summit\n19  New Playbook',
        '22  Live Poll\n26  Product Demo\n30  Guest Talk',
      ],
    },
    handle: HANDLE,
  },
} as const satisfies ThemeSpec;

export const eventsCalendar = themed(W, H, calendarSpec, (t) => {
  const dates = t.list('dates');
  const [firstEvents = '', lastEvents = ''] = t.list('events');
  return [
    backdrop(H, t.color('background'), t.shade('background', MERIDIAN.deep), 165),
    text(t.copy('kicker'), 80, 90, 600, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 500,
      fill: t.shade('text', MERIDIAN.sand),
    }),
    text(t.copy('month'), 80, 140, 900, {
      fontFamily: t.font('heading'),
      fontSize: 104,
      fontWeight: 800,
      fill: t.color('accent'),
      letterSpacing: 4,
    }),
    t.list('weekdays').map((day, index) =>
      text(day, 80 + index * 134, 300, 124, {
        fontFamily: t.font('body'),
        fontSize: 24,
        fontWeight: 700,
        fill: t.color('text'),
        align: 'center',
      }),
    ),
    Array.from({ length: 35 }, (_, index) => {
      const day = index - 2;
      const x = 80 + (index % 7) * 134;
      const y = 350 + Math.floor(index / 7) * 112;
      const event = EVENT_DAYS.includes(day);
      if (day < 1 || day > 31) {
        return rect(x, y, 124, 100, t.shade('surface', 'rgba(255,255,255,0.08)'), {
          cornerRadius: 14,
          name: 'Blank',
        });
      }
      return [
        rect(x, y, 124, 100, event ? t.color('accent') : t.color('surface'), {
          cornerRadius: 14,
          name: 'Day',
        }),
        text(dates[day - 1] ?? '', x, y + 28, 124, {
          fontFamily: t.font('heading'),
          fontSize: 38,
          fontWeight: 600,
          fill: t.shade('background', MERIDIAN.navy),
          align: 'center',
        }),
      ];
    }),
    text(firstEvents, 80, 950, 460, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.6,
    }),
    text(lastEvents, 560, 950, 440, {
      fontFamily: t.font('body'),
      fontSize: 30,
      fontWeight: 500,
      fill: t.color('text'),
      lineHeight: 1.6,
    }),
    text(t.copy('handle'), 80, 1240, 400, {
      fontFamily: t.font('body'),
      fontSize: 26,
      fontWeight: 600,
      fill: t.color('accent'),
      letterSpacing: 2,
    }),
  ];
});

const statsSpec = {
  colors: {
    background: {
      value: MERIDIAN.coral,
      hint: 'Page gradient and the number on the dark card; its soft shade is the top of the gradient',
    },
    primary: {
      value: MERIDIAN.navy,
      hint: 'Kicker, the dark card, the label and number on the light card, the first closing line and the tint of the card shadows',
    },
    surface: {
      value: MERIDIAN.white,
      hint: 'Light card, the label on the dark card and we build.',
    },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    kicker: { label: 'Kicker', value: 'PROOF IN NUMBERS' },
    labels: { label: 'Stat label', value: ['Projects\ndelivered', 'Years helping\nteams scale'] },
    values: { label: 'Stat number', value: ['18x', '9+'] },
    closing: { label: 'Closing line', value: "We don't just advise," },
    highlight: { label: 'Highlight', value: 'we build.' },
  },
} as const satisfies ThemeSpec;

export const statsCards = themed(W, H, statsSpec, (t) => {
  const values = t.list('values');
  const statCard = (y: number, label: string, value: string, dark: boolean) => [
    rect(110, y, 860, 220, dark ? t.color('primary') : t.color('surface'), {
      cornerRadius: 30,
      name: 'Stat card',
      ...shadow(30, 14, t.shade('primary', 'rgba(11,20,38,0.2)')),
    }),
    text(label, 160, y + 62, 420, {
      fontFamily: t.font('body'),
      fontSize: 38,
      fontWeight: 500,
      fill: dark ? t.color('surface') : t.color('primary'),
      lineHeight: 1.2,
    }),
    text(value, 560, y + 50, 360, {
      fontFamily: t.font('heading'),
      fontSize: 116,
      fontWeight: 800,
      fill: dark ? t.color('background') : t.color('primary'),
      align: 'right',
      lineHeight: 1,
    }),
  ];
  return [
    backdrop(H, t.shade('background', MERIDIAN.coralSoft), t.color('background'), 160),
    text(t.copy('kicker'), 110, 180, 860, {
      fontFamily: t.font('body'),
      fontSize: 36,
      fontWeight: 600,
      fill: t.color('primary'),
      letterSpacing: 2,
    }),
    t
      .list('labels')
      .map((label, index) => statCard(330 + index * 260, label, values[index] ?? '', index === 0)),
    text(t.copy('closing'), 110, 920, 860, {
      fontFamily: t.font('heading'),
      fontSize: 62,
      fontWeight: 400,
      fill: t.color('primary'),
    }),
    text(t.copy('highlight'), 110, 996, 860, {
      fontFamily: t.font('heading'),
      fontSize: 62,
      fontWeight: 800,
      fill: t.color('surface'),
    }),
  ];
});

const webinarSpec = {
  colors: {
    background: {
      value: MERIDIAN.white,
      hint: 'Page gradient and the date number; its sand shade is the bottom of the gradient',
    },
    primary: {
      value: MERIDIAN.navy,
      hint: 'Date band at the top, Map Your and the tint of the photo shadow',
    },
    accent: { value: MERIDIAN.coral, hint: 'Month and Quarterly Targets' },
    text: { value: MERIDIAN.grey, hint: 'Session time line' },
  },
  fonts: { heading: HEAD, body: BODY },
  copy: {
    month: { label: 'Month', value: 'AUG' },
    day: { label: 'Day', value: '14' },
    intro: { label: 'Headline', value: 'Map Your' },
    highlight: { label: 'Highlight', value: 'Quarterly Targets' },
    time: { label: 'Session time', value: 'Live session at 6 PM GMT' },
  },
} as const satisfies ThemeSpec;

const webinar = (height: number, photoTop: number, photoWidth: number) =>
  themed(W, height, webinarSpec, (t) => {
    const photoHeight = photoWidth * 1.25;
    const band = photoTop + 120;
    const copyTop = photoTop + photoHeight + 70;
    return [
      backdrop(height, t.color('background'), t.shade('background', MERIDIAN.sand), 180),
      rect(400, 0, 280, band, t.color('primary'), { name: 'Band' }),
      text(t.copy('month'), 400, photoTop - 300, 280, {
        fontFamily: t.font('heading'),
        fontSize: 56,
        fontWeight: 600,
        fill: t.color('accent'),
        align: 'center',
        letterSpacing: 6,
      }),
      text(t.copy('day'), 400, photoTop - 230, 280, {
        fontFamily: t.font('heading'),
        fontSize: 200,
        fontWeight: 800,
        fill: t.color('background'),
        align: 'center',
        lineHeight: 1,
      }),
      photo('man-portrait-2', (W - photoWidth) / 2, photoTop, photoWidth, photoHeight, {
        cornerRadius: 40,
        filters: IMAGE_FILTER_PRESETS.mono,
        ...shadow(40, 18, t.shade('primary', 'rgba(11,20,38,0.3)')),
      }),
      text(t.copy('intro'), 0, copyTop, W, {
        fontFamily: t.font('heading'),
        fontSize: 76,
        fontWeight: 400,
        fill: t.color('primary'),
        align: 'center',
      }),
      text(t.copy('highlight'), 0, copyTop + 86, W, {
        fontFamily: t.font('heading'),
        fontSize: 76,
        fontWeight: 800,
        fill: t.color('accent'),
        align: 'center',
      }),
      text(t.copy('time'), 0, copyTop + 196, W, {
        fontFamily: t.font('body'),
        fontSize: 34,
        fontWeight: 500,
        fill: t.color('text'),
        align: 'center',
      }),
    ];
  });

export const webinarPost = webinar(H, 400, 420);

export const webinarStory = webinar(STORY_SIZE.height, 560, 600);
