import { linear } from '@/design';
import {
  avatar,
  icon,
  type Nodes,
  POST_SIZE,
  rect,
  rotateNodes,
  shadow,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PosterPhotoName } from '../../../photos';

export const { width: W, height: H } = POST_SIZE;
export const FONT = { label: 'Font', value: 'Plus Jakarta Sans' } as const;
export const INK = '#0b2b26';
export const TEAL = '#0f766e';
export const MINT = '#5eead4';
export const GREY = '#64748b';
export const WHITE = '#ffffff';
export const DEEP = '#064e3b';

export const backdrop = (from: string, to: string) =>
  rect(0, 0, W, H, linear(160, from, to), { name: 'Background' });

interface CommentStyle {
  font: string;
  card: string;
  shadow: string;
  ink: string;
  muted: string;
}

const comment = (
  style: CommentStyle,
  x: number,
  y: number,
  width: number,
  photo: PosterPhotoName,
  copy: { name: string; role: string; message: string },
  rotation: number,
): Nodes[] =>
  rotateNodes(rotation, x + width / 2, y + 75, [
    rect(x, y, width, 150, style.card, {
      name: 'Comment card',
      cornerRadius: 18,
      ...shadow(24, 10, style.shadow),
    }),
    avatar(photo, x + 46, y + 46, 26),
    text(copy.name, x + 86, y + 20, width - 100, {
      fontFamily: style.font,
      fontSize: 26,
      fontWeight: 700,
      fill: style.ink,
    }),
    text(copy.role, x + 86, y + 52, width - 100, {
      fontFamily: style.font,
      fontSize: 19,
      fontWeight: 500,
      fill: style.muted,
    }),
    text(copy.message, x + 28, y + 98, width - 56, {
      fontFamily: style.font,
      fontSize: 24,
      fontWeight: 500,
      fill: style.ink,
    }),
  ]);

const COVER_COMMENTS = [
  { x: 60, y: 170, width: 410, photo: 'woman-portrait-1', rotation: -6 },
  { x: 610, y: 130, width: 420, photo: 'man-portrait-1', rotation: 5 },
  { x: 60, y: 990, width: 400, photo: 'man-portrait-3', rotation: 4 },
  { x: 610, y: 1080, width: 410, photo: 'woman-portrait-4', rotation: -5 },
] as const;

const coverSpec = {
  colors: {
    background: {
      value: TEAL,
      hint: 'Page gradient and the verified badge; its darker shades color the bottom of the gradient and the card shadows',
    },
    surface: { value: WHITE, hint: 'Comment cards, the question card and the arrow' },
    text: {
      value: INK,
      hint: 'Names, comments, the page name, question and logo tile; its grey shade colors the roles, the verified label and the comment count',
    },
    accent: { value: MINT, hint: 'Logo icon and the sparkles' },
  },
  fonts: { body: FONT },
  copy: {
    names: {
      label: 'Commenter',
      value: ['Olivia Grant', 'Marco Silva', 'Daniel Kim', 'Hana Ito'],
    },
    roles: {
      label: 'Commenter role',
      value: ['Brand Strategist', 'Content Lead', 'Sales Director', 'Ops Manager'],
    },
    comments: {
      label: 'Comment',
      value: [
        'Start with a clear goal',
        'Context beats clever words',
        'Show it two good examples',
        'Ask it to critique a draft',
      ],
    },
    page: { label: 'Page name', value: 'Northpeak Labs' },
    verified: { label: 'Verified label', value: 'Verified page' },
    question: { label: 'Question', value: 'What is your favourite\nAI shortcut?' },
    count: { label: 'Comment count', value: '64 comments' },
  },
} as const satisfies ThemeSpec;

export const commentsCover = themed(W, H, coverSpec, (t) => {
  const font = t.font('body');
  const muted = t.shade('text', GREY);
  const style: CommentStyle = {
    font,
    card: t.color('surface'),
    shadow: t.shade('background', 'rgba(2,44,34,0.35)'),
    ink: t.color('text'),
    muted,
  };
  const names = t.list('names');
  const roles = t.list('roles');
  const comments = t.list('comments');
  const card = (index: number) => {
    const spot = COVER_COMMENTS[index] ?? COVER_COMMENTS[0];
    return comment(
      style,
      spot.x,
      spot.y,
      spot.width,
      spot.photo,
      { name: names[index] ?? '', role: roles[index] ?? '', message: comments[index] ?? '' },
      spot.rotation,
    );
  };
  return [
    backdrop(t.color('background'), t.shade('background', DEEP)),
    card(0),
    card(1),
    icon('move-up-right', 700, 340, 110, t.color('surface'), { strokeWidth: 1.75 }),
    rect(260, 480, 560, 330, t.color('surface'), {
      name: 'Question card',
      cornerRadius: 26,
      ...shadow(40, 16, t.shade('background', 'rgba(2,44,34,0.4)')),
    }),
    rect(300, 520, 96, 96, t.color('text'), { name: 'Logo', cornerRadius: 24 }),
    icon('layers', 322, 542, 52, t.color('accent'), { strokeWidth: 2 }),
    text(t.copy('page'), 420, 532, 380, {
      fontFamily: font,
      fontSize: 34,
      fontWeight: 700,
      fill: t.color('text'),
    }),
    icon('badge-check', 420, 580, 30, t.color('background'), { strokeWidth: 2.25 }),
    text(t.copy('verified'), 458, 580, 300, {
      fontFamily: font,
      fontSize: 22,
      fontWeight: 500,
      fill: muted,
    }),
    text(t.copy('question'), 300, 640, 500, {
      fontFamily: font,
      fontSize: 40,
      fontWeight: 600,
      fill: t.color('text'),
      lineHeight: 1.25,
    }),
    icon('message-square', 300, 755, 28, muted, { strokeWidth: 2 }),
    text(t.copy('count'), 340, 755, 300, {
      fontFamily: font,
      fontSize: 24,
      fontWeight: 500,
      fill: muted,
    }),
    card(2),
    card(3),
    icon('sparkles', 500, 900, 64, t.color('accent'), { strokeWidth: 2 }),
  ];
});

interface StepCopy {
  headline: string;
  body: string;
  photo: PosterPhotoName;
  name: string;
  role: string;
  tool: string;
  rest: string;
}

const commentStep = (step: StepCopy) =>
  themed(
    W,
    H,
    {
      colors: {
        background: {
          value: TEAL,
          hint: 'Page gradient and the tool name; its darker shades color the bottom of the gradient and the card shadows',
        },
        surface: {
          value: WHITE,
          hint: 'Comment cards, the quote card and the headline; its pale shade colors the body text',
        },
        text: {
          value: INK,
          hint: 'Names, comments and the quote; its grey shade colors the roles',
        },
      },
      fonts: { body: FONT },
      copy: {
        headline: { label: 'Headline', value: step.headline },
        body: { label: 'Body', value: step.body },
        names: { label: 'Name', value: ['Rosa Diaz', step.name, 'Ethan Moss'] },
        roles: { label: 'Role', value: ['Founder', step.role, 'Analyst'] },
        comments: { label: 'Comment', value: ['Saved me hours', 'Use it for structure'] },
        tool: { label: 'Tool name', value: step.tool },
        quote: { label: 'Quote', value: step.rest },
      },
    } as const satisfies ThemeSpec,
    (t) => {
      const font = t.font('body');
      const style: CommentStyle = {
        font,
        card: t.color('surface'),
        shadow: t.shade('background', 'rgba(2,44,34,0.35)'),
        ink: t.color('text'),
        muted: t.shade('text', GREY),
      };
      const [first = '', quoted = '', last = ''] = t.list('names');
      const [firstRole = '', quotedRole = '', lastRole = ''] = t.list('roles');
      const [saved = '', structure = ''] = t.list('comments');
      return [
        backdrop(t.color('background'), t.shade('background', DEEP)),
        comment(
          style,
          680,
          110,
          360,
          'woman-portrait-6',
          { name: first, role: firstRole, message: saved },
          5,
        ),
        text(t.copy('headline'), 90, 360, 900, {
          fontFamily: font,
          fontSize: 56,
          fontWeight: 800,
          fill: t.color('surface'),
          align: 'center',
        }),
        text(t.copy('body'), 130, 440, 820, {
          fontFamily: font,
          fontSize: 46,
          fontWeight: 400,
          fill: t.shade('surface', '#ecfdf5'),
          align: 'center',
          lineHeight: 1.35,
        }),
        rect(270, 720, 540, 260, t.color('surface'), {
          name: 'Quote card',
          cornerRadius: 22,
          ...shadow(36, 14, t.shade('background', 'rgba(2,44,34,0.4)')),
        }),
        avatar(step.photo, 330, 780, 34),
        text(quoted, 380, 752, 400, {
          fontFamily: font,
          fontSize: 30,
          fontWeight: 700,
          fill: t.color('text'),
        }),
        text(quotedRole, 380, 792, 400, {
          fontFamily: font,
          fontSize: 22,
          fontWeight: 500,
          fill: t.shade('text', GREY),
        }),
        text(t.copy('tool'), 300, 850, 480, {
          fontFamily: font,
          fontSize: 34,
          fontWeight: 800,
          fill: t.color('background'),
        }),
        text(t.copy('quote'), 300, 896, 480, {
          fontFamily: font,
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
        }),
        comment(
          style,
          50,
          1110,
          380,
          'man-portrait-2',
          { name: last, role: lastRole, message: structure },
          -4,
        ),
      ];
    },
  );

export const COMMENT_STEPS = [
  commentStep({
    headline: 'Skip the blank page.',
    body: 'Let AI draft a first version you can shape instead of staring at nothing.',
    photo: 'woman-portrait-2',
    name: 'Priya Nair',
    role: 'Head of Content',
    tool: 'Draftly',
    rest: 'is perfect for first outlines.',
  }),
  commentStep({
    headline: 'Stop guessing at trends.',
    body: 'Use AI to spot patterns in sales, churn and support tickets in minutes.',
    photo: 'man-portrait-1',
    name: 'Leo Hart',
    role: 'Growth Analyst',
    tool: 'Signalbox',
    rest: 'surfaces trends I would miss.',
  }),
  commentStep({
    headline: 'Untangle messy notes.',
    body: 'AI can turn scattered notes into clear tasks, owners and due dates.',
    photo: 'woman-portrait-5',
    name: 'Ana Ruiz',
    role: 'Operations Lead',
    tool: 'Tidynote',
    rest: 'turns notes into task lists.',
  }),
] as const;
