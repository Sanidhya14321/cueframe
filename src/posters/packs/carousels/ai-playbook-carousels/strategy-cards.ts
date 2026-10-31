import { avatar, circle, icon, rect, shadow, type ThemeSpec, text, themed } from '../../../kit';
import type { PosterPhotoName } from '../../../photos';
import { backdrop, DEEP, FONT, GREY, H, INK, MINT, TEAL, W, WHITE } from './comment-cards';

const searchSpec = {
  colors: {
    background: {
      value: TEAL,
      hint: 'Page gradient and the search button; its darker shade is the bottom of the gradient',
    },
    surface: { value: WHITE, hint: 'Headline, the search bar and the button arrow' },
    accent: { value: MINT, hint: 'Kicker above the headline' },
    text: { value: GREY, hint: 'Search icon and the search text' },
  },
  fonts: { body: FONT },
  copy: {
    kicker: { label: 'Kicker', value: 'PRACTICAL PLAYBOOK' },
    title: { label: 'Title', value: '4 Ways AI\nGives You Back\nYour Week' },
    query: { label: 'Search text', value: 'What should I automate?' },
  },
} as const satisfies ThemeSpec;

export const searchCover = themed(W, H, searchSpec, (t) => [
  backdrop(t.color('background'), t.shade('background', DEEP)),
  text(t.copy('kicker'), 90, 420, 900, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 700,
    fill: t.color('accent'),
    letterSpacing: 3,
  }),
  text(t.copy('title'), 90, 480, 920, {
    fontFamily: t.font('body'),
    fontSize: 96,
    fontWeight: 500,
    fill: t.color('surface'),
    lineHeight: 1.1,
  }),
  rect(90, 1040, 900, 112, t.color('surface'), { name: 'Search bar', cornerRadius: 56 }),
  icon('search', 132, 1070, 52, t.color('text'), { strokeWidth: 2.25 }),
  text(t.copy('query'), 204, 1074, 600, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.color('text'),
  }),
  circle(930, 1096, 40, t.color('background')),
  icon('arrow-right', 908, 1074, 44, t.color('surface'), { strokeWidth: 2.5 }),
]);

const ACTION_ICONS = ['thumbs-up', 'message-square', 'repeat', 'send'] as const;

interface StrategyCopy {
  way: string;
  photo: PosterPhotoName;
  name: string;
  role: string;
  title: string;
  body: string;
  progress: number;
}

const strategy = (step: StrategyCopy) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: TEAL,
          hint: 'Page gradient, the way number, Follow and the like icon; its darker shades color the bottom of the gradient and the card shadows, its pale shade the tab',
        },
        surface: {
          value: WHITE,
          hint: 'Post card and the progress bar; its see-through shade colors the progress track',
        },
        text: {
          value: INK,
          hint: 'Name and title; its softer shades color the role, body, counts, actions and divider',
        },
      },
      fonts: { body: FONT },
      copy: {
        way: { label: 'Tab', value: step.way },
        name: { label: 'Name', value: step.name },
        role: { label: 'Role', value: step.role },
        follow: { label: 'Follow button', value: '+ Follow' },
        title: { label: 'Title', value: step.title },
        body: { label: 'Body', value: step.body },
        likes: { label: 'Likes', value: '128' },
        comments: { label: 'Comment count', value: '24 comments' },
        actions: { label: 'Action', value: ['Like', 'Comment', 'Repost', 'Send'] },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('body');
      const muted = t.shade('text', GREY);
      const action = t.shade('text', '#334155');
      return [
        backdrop(t.color('background'), t.shade('background', DEEP)),
        rect(110, 190, 860, 840, t.color('surface'), {
          name: 'Post card',
          cornerRadius: 32,
          ...shadow(40, 16, t.shade('background', 'rgba(2,44,34,0.4)')),
        }),
        rect(400, 150, 280, 72, t.shade('background', '#ccfbf1'), {
          name: 'Tab',
          cornerRadius: 20,
          ...shadow(16, 6, t.shade('background', 'rgba(2,44,34,0.25)')),
        }),
        text(t.copy('way'), 400, 168, 280, {
          fontFamily: font,
          fontSize: 30,
          fontWeight: 800,
          fill: t.color('background'),
          align: 'center',
          letterSpacing: 2,
        }),
        avatar(step.photo, 206, 316, 44),
        text(t.copy('name'), 268, 282, 400, {
          fontFamily: font,
          fontSize: 32,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(t.copy('role'), 268, 324, 400, {
          fontFamily: font,
          fontSize: 24,
          fontWeight: 500,
          fill: muted,
        }),
        text(t.copy('follow'), 740, 296, 190, {
          fontFamily: font,
          fontSize: 30,
          fontWeight: 700,
          fill: t.color('background'),
          align: 'right',
        }),
        text(t.copy('title'), 162, 400, 760, {
          fontFamily: font,
          fontSize: 60,
          fontWeight: 800,
          fill: t.color('text'),
          lineHeight: 1.12,
        }),
        text(t.copy('body'), 162, 560, 760, {
          fontFamily: font,
          fontSize: 34,
          fontWeight: 400,
          fill: t.shade('text', '#475569'),
          lineHeight: 1.45,
        }),
        icon('thumbs-up', 162, 856, 28, t.color('background'), { strokeWidth: 2 }),
        text(t.copy('likes'), 200, 856, 200, {
          fontFamily: font,
          fontSize: 24,
          fontWeight: 500,
          fill: muted,
        }),
        text(t.copy('comments'), 620, 856, 300, {
          fontFamily: font,
          fontSize: 24,
          fontWeight: 500,
          fill: muted,
          align: 'right',
        }),
        rect(162, 900, 756, 3, t.shade('text', '#e2e8f0'), { name: 'Rule' }),
        t.list('actions').map((label, slot) => [
          icon(ACTION_ICONS[slot] ?? 'send', 222 + slot * 190, 924, 38, action, {
            strokeWidth: 2,
          }),
          text(label, 166 + slot * 190, 970, 150, {
            fontFamily: font,
            fontSize: 22,
            fontWeight: 500,
            fill: action,
            align: 'center',
          }),
        ]),
        rect(110, 1110, 860, 14, t.shade('surface', 'rgba(255,255,255,0.25)'), {
          name: 'Track',
          cornerRadius: 7,
        }),
        rect(110, 1110, 860 * step.progress, 14, t.color('surface'), {
          name: 'Progress',
          cornerRadius: 7,
        }),
      ];
    },
  );

export const STRATEGY_STEPS = [
  strategy({
    way: 'WAY 1',
    photo: 'man-portrait-2',
    name: 'Daniel Brooks',
    role: 'Operations Director',
    title: 'Start With Real\nPain Points',
    body: 'Do not add AI because it is new. List the slow, repetitive or error prone tasks your team hates and solve those first.',
    progress: 0.3,
  }),
  strategy({
    way: 'WAY 2',
    photo: 'man-portrait-1',
    name: 'Mason Webb',
    role: 'Customer Lead',
    title: 'Assist People,\nDo Not Replace Them',
    body: 'Strong teams let AI handle drafts and research so people can spend their time on judgement and relationships.',
    progress: 0.55,
  }),
  strategy({
    way: 'WAY 3',
    photo: 'woman-portrait-5',
    name: 'Grace Lin',
    role: 'Product Manager',
    title: 'Turn Wins Into\nShared Workflows',
    body: 'Once a prompt works, save it as a team template so everyone gets the same quality every single time.',
    progress: 0.8,
  }),
] as const;
