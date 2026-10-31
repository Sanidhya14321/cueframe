import { linear } from '@/design';
import { circle, icon, path, rect, type ThemeSpec, themed } from '../../../kit';
import {
  answerCall,
  copy,
  H,
  head,
  leadershipTips,
  MAIN,
  powerFull,
  trackRecord,
  VG,
  W,
} from './posts';
import { aiStat, bigStat, funnel, marketPost, standOut } from './posts-more';

interface DayStyle {
  from: string;
  to: string;
  accent: string;
  day: string;
  time: string;
  date: string;
  message: string;
}

const frame = (width: number, height: number, radius: number) =>
  `M0 ${radius} Q0 0 ${radius} 0 L${width - radius} 0 Q${width} 0 ${width} ${radius} L${width} ${height} L0 ${height} Z`;

const daySpec = (style: DayStyle) =>
  ({
    colors: {
      background: {
        value: style.to,
        hint: 'Bottom of the page and phone screen gradients and the app icon; its lighter shade colors their tops',
      },
      primary: {
        value: VG.black,
        hint: 'Phone frame, the dynamic island, the message, the bell and the count; its shade colors MESSAGES',
      },
      accent: { value: style.accent, hint: 'Day name' },
      secondary: { value: '#ffd23f', hint: 'Bell badge' },
      text: {
        value: VG.white,
        hint: 'Hello!, the clock, the date, the notification card, the message icon and the count bubble; its shade colors the glow arc',
      },
    },
    fonts: { main: MAIN },
    copy: {
      greeting: { label: 'Greeting', value: 'Hello!' },
      day: { label: 'Day', value: style.day },
      time: { label: 'Time', value: style.time },
      date: { label: 'Date', value: style.date },
      app: { label: 'App name', value: 'MESSAGES' },
      message: { label: 'Message', value: style.message },
      count: { label: 'Count', value: '1' },
    },
  }) as const satisfies ThemeSpec;

const helloDay = (style: DayStyle) =>
  themed(W, H, daySpec(style), (t) => {
    const heading = head(t.font('main'));
    const body = copy(t.font('main'));
    const gradient = linear(165, t.shade('background', style.from), t.color('background'));
    const screen = linear(180, t.shade('background', style.from), t.color('background'));
    const white = t.color('text');
    const ink = t.color('primary');
    return [
      rect(0, 0, W, H, gradient, { name: 'Background' }),
      path(
        'M0 220 Q540 -40 1080 220 L1080 420 L0 420 Z',
        0,
        930,
        W,
        420,
        t.shade('text', 'rgba(255,255,255,0.14)'),
        { width: 1080, height: 420 },
        { name: 'Glow arc' },
      ),
      heading(t.copy('greeting'), 90, 100, 800, 110, white, 800),
      heading(t.copy('day'), 90, 220, 900, 110, t.color('accent'), 800),
      path(frame(700, 900, 100), 190, 450, 700, 900, ink, { width: 700, height: 900 }),
      path(frame(660, 880, 82), 210, 470, 660, 880, screen, { width: 660, height: 880 }),
      rect(445, 495, 190, 54, ink, { cornerRadius: 27, name: 'Dynamic island' }),
      heading(t.copy('time'), 190, 590, 700, 170, white, 700, { align: 'center', lineHeight: 1 }),
      body(t.copy('date'), 190, 780, 700, 34, white, { align: 'center', fontWeight: 500 }),
      rect(240, 870, 600, 250, white, { cornerRadius: 32, name: 'Notification' }),
      rect(272, 900, 44, 44, t.color('background'), { cornerRadius: 12, name: 'App icon' }),
      icon('message-circle', 280, 908, 28, white, { strokeWidth: 2.4 }),
      body(t.copy('app'), 332, 904, 300, 24, t.shade('primary', VG.grey), { letterSpacing: 2 }),
      body(t.copy('message'), 272, 965, 540, 32, ink, { lineHeight: 1.35 }),
      circle(150, 600, 80, t.color('secondary'), { name: 'Bell badge' }),
      icon('bell', 108, 558, 84, ink, { strokeWidth: 2.2 }),
      circle(212, 530, 28, white, { name: 'Count' }),
      heading(t.copy('count'), 184, 510, 56, 30, ink, 800, { align: 'center' }),
    ];
  });

export const helloMonday = helloDay({
  from: VG.orangeLight,
  to: VG.orangeDeep,
  accent: '#ffe2cc',
  day: 'Monday',
  time: '10:30',
  date: 'Monday, March 2027',
  message: 'New week, fresh start. Set the\nagenda and drive real results.',
});

export const helloTuesday = helloDay({
  from: '#2fb3a8',
  to: '#0f5d63',
  accent: '#c8fff7',
  day: 'Tuesday',
  time: '12:00',
  date: 'Tuesday, March 2027',
  message: 'Small steps today add up to\nbig wins for your team.',
});

export const POSTS = [
  trackRecord,
  leadershipTips,
  funnel,
  powerFull,
  standOut,
  answerCall,
  bigStat,
  aiStat,
  marketPost,
];
