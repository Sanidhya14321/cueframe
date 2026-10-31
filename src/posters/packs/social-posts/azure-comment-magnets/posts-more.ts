import {
  ellipse,
  group,
  POST_SIZE,
  pill,
  poly,
  rect,
  STORY_SIZE,
  shadow,
  star,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY, type CommentTheme, clear, DISPLAY, HEAD } from './posts';

const { width: W, height: H } = POST_SIZE;
const MAILBOX_DOOR = '#2a3350';
const SHINE = 'rgba(255,255,255,0.18)';

const mailSpec = (theme: CommentTheme) =>
  ({
    colors: {
      background: {
        value: theme.paper,
        hint: 'Page, the letter, the button text and the faint shine on the mailbox',
      },
      primary: { value: theme.brand, hint: 'NEW MAIL, FOR YOU!, the flag and both buttons' },
      secondary: {
        value: theme.ink,
        hint: 'Mailbox, post, ground, letter outline and the stars; its lighter shade colors the mailbox door',
      },
    },
    fonts: { heading: DISPLAY, body: { ...HEAD, label: 'Body font' } },
    copy: {
      title: { label: 'Title', value: 'NEW MAIL' },
      subtitle: { label: 'Second title line', value: 'FOR YOU!' },
      offer: { label: 'Offer button', value: 'Get member-only deals' },
      cta: { label: 'Comment button', value: 'Comment “mail” to\njoin the newsletter' },
    },
  }) as const satisfies ThemeSpec;

export const gotMail = (theme: CommentTheme) =>
  themed(W, H, mailSpec(theme), (t) => {
    const title = (content: string, y: number) =>
      text(content, 0, y, W, {
        fontFamily: t.font('heading'),
        fontSize: 116,
        fontWeight: 400,
        fill: t.color('primary'),
        align: 'center',
      });
    const ink = t.color('secondary');
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      title(t.copy('title'), 80),
      title(t.copy('subtitle'), 220),
      rect(400, 760, 64, 480, ink, { name: 'Post' }),
      rect(300, 1236, 264, 22, ink, { name: 'Ground', cornerRadius: 11 }),
      ellipse(200, 450, 460, 200, ink, { name: 'Mailbox dome' }),
      rect(200, 550, 460, 220, ink, { name: 'Mailbox body' }),
      rect(250, 600, 360, 12, t.shade('background', SHINE), { name: 'Shine', cornerRadius: 6 }),
      ellipse(160, 470, 110, 300, t.shade('secondary', MAILBOX_DOOR), { name: 'Mailbox door' }),
      group(
        rect(110, 560, 200, 130, t.color('background'), {
          name: 'Letter',
          stroke: ink,
          strokeWidth: 6,
          rotation: -10,
        }),
        poly(
          [
            [118, 572],
            [216, 612],
            [295, 538],
          ],
          t.shade('secondary', clear(theme.ink)),
          { name: 'Letter flap', stroke: ink, strokeWidth: 6 },
        ),
      ),
      rect(660, 420, 22, 230, t.color('primary'), { name: 'Flag pole' }),
      rect(682, 420, 110, 70, t.color('primary'), { name: 'Flag' }),
      rect(600, 960, 420, 90, t.color('primary'), { name: 'Button' }),
      text(t.copy('offer'), 600, 986, 420, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('background'),
        align: 'center',
      }),
      rect(600, 1070, 420, 130, t.color('primary'), { name: 'Button' }),
      text(t.copy('cta'), 600, 1092, 420, {
        fontFamily: t.font('body'),
        fontSize: 32,
        fontWeight: 700,
        fill: t.color('background'),
        align: 'center',
        lineHeight: 1.25,
      }),
      star(5, 40, 1180, 120, ink, { innerRatio: 0.42 }),
      star(5, 890, 700, 80, ink, { innerRatio: 0.42 }),
    ];
  });

const folder = (x: number, y: number, width: number, height: number, fill: string) =>
  group(
    rect(x, y, width * 0.42, height * 0.24, fill, { name: 'Folder tab', cornerRadius: 14 }),
    rect(x, y + height * 0.12, width, height * 0.88, fill, {
      name: 'Folder body',
      cornerRadius: 18,
    }),
  );

const folderSpec = (theme: CommentTheme) =>
  ({
    colors: {
      background: { value: theme.ink, hint: 'Page and the comment prompt text' },
      primary: {
        value: theme.brand,
        hint: 'The big folder and two small folders; its darker shade colors the other two folders',
      },
      text: {
        value: theme.paper,
        hint: 'ONLY PROS KNOW THIS, the body lines, the stars and the prompt label',
      },
    },
    fonts: {
      heading: DISPLAY,
      body: BODY,
      label: { ...HEAD, label: 'Prompt font' },
    },
    copy: {
      title: { label: 'Title', value: 'ONLY PROS\nKNOW THIS' },
      body: {
        label: 'Body',
        value: 'Most founders learn this the hard way.\nHere is the shortcut nobody shares.',
      },
      prompt: { label: 'Comment prompt', value: 'Comment: “pro”' },
    },
  }) as const satisfies ThemeSpec;

export const expertsFolder = (theme: CommentTheme) =>
  themed(W, H, folderSpec(theme), (t) => {
    const deep = t.shade('primary', theme.deep);
    return [
      rect(0, 0, W, H, t.color('background'), { name: 'Background' }),
      folder(70, 80, 220, 170, t.color('primary')),
      folder(800, 130, 180, 140, deep),
      folder(60, 1090, 240, 180, deep),
      folder(860, 1000, 150, 300, t.color('primary')),
      star(5, 560, 120, 90, t.color('text'), { innerRatio: 0.42 }),
      star(5, 470, 1190, 70, t.color('text'), { innerRatio: 0.42 }),
      group(
        rect(160, 400, 300, 90, t.color('primary'), { name: 'Folder tab', cornerRadius: 22 }),
        rect(160, 450, 760, 520, t.color('primary'), {
          name: 'Folder body',
          cornerRadius: 28,
          ...shadow(40, 16, 'rgba(0,0,0,0.45)'),
        }),
        text(t.copy('title'), 220, 520, 660, {
          fontFamily: t.font('heading'),
          fontSize: 92,
          fontWeight: 400,
          fill: t.color('text'),
          lineHeight: 1.08,
        }),
        text(t.copy('body'), 220, 760, 660, {
          fontFamily: t.font('body'),
          fontSize: 32,
          fontWeight: 500,
          fill: t.color('text'),
          lineHeight: 1.4,
        }),
      ),
      rect(480, 1010, 400, 80, t.color('text'), { name: 'Prompt label' }),
      text(t.copy('prompt'), 480, 1030, 400, {
        fontFamily: t.font('label'),
        fontSize: 36,
        fontWeight: 800,
        fill: t.color('background'),
        align: 'center',
      }),
    ];
  });

const pollSpec = (theme: CommentTheme) =>
  ({
    colors: {
      background: { value: theme.brand, hint: 'Page' },
      primary: {
        value: theme.ink,
        hint: 'The stars, option A card, option B text and the reply pill',
      },
      text: {
        value: theme.paper,
        hint: 'QUICK QUESTION, the question, option A text, option B card and the pill text',
      },
    },
    fonts: { heading: DISPLAY, body: { ...HEAD, label: 'Body font' } },
    copy: {
      title: { label: 'Title', value: 'QUICK\nQUESTION' },
      question: { label: 'Question', value: 'Which one is holding your\nsocial growth back?' },
      options: {
        label: 'Option',
        value: ['A  ·  No time to post', 'B  ·  No idea what to say'],
      },
      cta: { label: 'Reply pill', value: 'Reply with A or B' },
    },
  }) as const satisfies ThemeSpec;

export const pollStory = (theme: CommentTheme) =>
  themed(STORY_SIZE.width, STORY_SIZE.height, pollSpec(theme), (t) => {
    const [first = '', second = ''] = t.list('options');
    const option = (content: string, y: number, fill: string) =>
      text(content, 140, y, 820, {
        fontFamily: t.font('body'),
        fontSize: 60,
        fontWeight: 700,
        fill,
      });
    return [
      rect(0, 0, STORY_SIZE.width, STORY_SIZE.height, t.color('background'), {
        name: 'Background',
      }),
      star(5, 860, 120, 140, t.color('primary'), { innerRatio: 0.42 }),
      text(t.copy('title'), 90, 240, 900, {
        fontFamily: t.font('heading'),
        fontSize: 150,
        fontWeight: 400,
        fill: t.color('text'),
        lineHeight: 1.05,
      }),
      text(t.copy('question'), 90, 610, 900, {
        fontFamily: t.font('body'),
        fontSize: 54,
        fontWeight: 600,
        fill: t.color('text'),
        lineHeight: 1.25,
      }),
      rect(90, 840, 900, 220, t.color('primary'), { name: 'Option A', cornerRadius: 24 }),
      option(first, 910, t.color('text')),
      rect(90, 1100, 900, 220, t.color('text'), { name: 'Option B', cornerRadius: 24 }),
      option(second, 1170, t.color('primary')),
      pill(t.copy('cta'), 240, 1520, {
        fill: t.color('primary'),
        color: t.color('text'),
        fontSize: 52,
        fontFamily: t.font('body'),
        fontWeight: 800,
        width: 600,
      }),
      star(5, 80, 1720, 110, t.color('primary'), { innerRatio: 0.42 }),
    ];
  });
