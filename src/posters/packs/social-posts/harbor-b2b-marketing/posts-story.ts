import {
  photo,
  pill,
  rect,
  rotateNodes,
  STORY_SIZE,
  shadow,
  type Theme,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import { BODY_FONT, H, HARBOR, HEADING_FONT, W } from './posts';

const messagingSpec = {
  colors: {
    background: {
      value: HARBOR.navy,
      hint: 'Page behind the photo and the dark tint over it',
    },
    surface: { value: HARBOR.white, hint: 'Card over the photo' },
    primary: { value: HARBOR.coral, hint: 'Sticker on the card' },
    text: {
      value: HARBOR.navy,
      hint: 'Card title and the sticker label; its grey shade colors the card text',
    },
  },
  fonts: { heading: HEADING_FONT, body: BODY_FONT },
  copy: {
    title: { label: 'Title', value: 'Marketing\nMessaging' },
    body: {
      label: 'Body',
      value: 'Line up your brand, message and\naudience at every touchpoint.',
    },
    sticker: { label: 'Sticker', value: 'Ideas welcome' },
  },
} as const satisfies ThemeSpec;

type MessagingTheme = Theme<typeof messagingSpec>;

const messagingCard = (t: MessagingTheme, x: number, y: number, width: number, height: number) => [
  rect(x, y, width, height, t.color('surface'), {
    name: 'Card',
    cornerRadius: 36,
    ...shadow(40, 16),
  }),
  text(t.copy('title'), x + 50, y + 50, width - 100, {
    fontFamily: t.font('heading'),
    fontSize: 76,
    fontWeight: 700,
    fill: t.color('text'),
    lineHeight: 1.12,
  }),
  text(t.copy('body'), x + 50, y + 250, width - 100, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 400,
    fill: t.shade('text', HARBOR.slate),
    lineHeight: 1.4,
  }),
  photo('meeting-1', x + 50, y + 360, width - 100, height - 410, { cornerRadius: 24 }),
  rotateNodes(-8, x + width - 330, y + 330, [
    pill(t.copy('sticker'), x + width - 330, y + 330, {
      fill: t.color('primary'),
      color: t.color('text'),
      fontSize: 30,
      fontFamily: t.font('heading'),
      fontWeight: 700,
    }),
  ]),
];

const messagingPage = (width: number, height: number, card: readonly number[]) =>
  themed(width, height, messagingSpec, (t) => {
    const [x = 0, y = 0, cardWidth = 0, cardHeight = 0] = card;
    return [
      rect(0, 0, width, height, t.color('background'), { name: 'Background' }),
      photo('team-2', 0, 0, width, height),
      rect(0, 0, width, height, t.shade('background', 'rgba(10,20,41,0.55)'), { name: 'Shade' }),
      messagingCard(t, x, y, cardWidth, cardHeight),
    ];
  });

export const messaging = messagingPage(W, H, [150, 140, 780, 1070]);

export const messagingStory = messagingPage(
  STORY_SIZE.width,
  STORY_SIZE.height,
  [110, 300, 860, 1300],
);
