import { type Template, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY,
  BRAND,
  bodyText,
  brandMark,
  H,
  HEAD,
  LEAF,
  leafBackground,
  SCRIPT,
  titleLine,
  trail,
  W,
} from './palette';

const STROKE = 14;
const LOW = 1150;
const HIGH = 200;
const RISE = 190;

const coverSpec = {
  colors: {
    background: {
      value: LEAF.top,
      hint: 'Backdrop gradient; its darker shade is the bottom of the gradient',
    },
    primary: {
      value: LEAF.mint,
      hint: 'Trusted Voice headline and the faint swoosh across the backdrop',
    },
    text: {
      value: LEAF.white,
      hint: 'Becoming a line, the 5-Stage subtitle, Swipe and the brand name',
    },
    accent: { value: LEAF.white, hint: 'Curved swipe arrow under Swipe' },
  },
  fonts: { heading: HEAD, body: BODY, script: SCRIPT },
  copy: {
    title: { label: 'Title', value: 'Becoming a' },
    highlight: { label: 'Highlight', value: 'Trusted Voice:' },
    subtitle: { label: 'Subtitle', value: 'The 5-Stage\nCreator Path' },
    swipe: { label: 'Swipe cue', value: 'Swipe' },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const stagesCover = themed(W, H, coverSpec, (t) => [
  leafBackground(t),
  titleLine(t.copy('title'), t.font('heading'), 90, 250, 88, t.color('text')),
  titleLine(t.copy('highlight'), t.font('heading'), 90, 355, 88, t.color('primary')),
  text(t.copy('subtitle'), 90, 490, 800, {
    fontFamily: t.font('body'),
    fontSize: 64,
    fontWeight: 500,
    fill: t.color('text'),
    lineHeight: 1.25,
  }),
  text(t.copy('swipe'), 690, 740, 300, {
    fontFamily: t.font('script'),
    fontSize: 96,
    fontWeight: 600,
    fill: t.color('text'),
    rotation: -10,
  }),
  trail(
    'M40 0 C80 190 260 270 480 270',
    600,
    LOW - 270,
    480,
    270,
    t.color('accent'),
    t.shade('accent', LEAF.clear),
    STROKE,
  ),
  brandMark(t.copy('brand'), t.font('heading'), t.color('text'), 90, 1170),
]);

const stageSpec = (title: string, body: string) =>
  ({
    colors: {
      background: {
        value: LEAF.top,
        hint: 'Backdrop gradient; its darker shade is the bottom of the gradient',
      },
      primary: {
        value: LEAF.mint,
        hint: 'Stage title and the faint swoosh across the backdrop',
      },
      text: { value: LEAF.white, hint: 'Stage description' },
      accent: { value: LEAF.white, hint: 'Stage path arrows climbing across the slide' },
    },
    fonts: { heading: HEAD, body: BODY },
    copy: {
      title: { label: 'Stage title', value: title },
      body: { label: 'Description', value: body },
    },
  }) as const satisfies ThemeSpec;

const stage = (title: string, body: string, entry: 'low' | 'high') =>
  themed(W, H, stageSpec(title, body), (t) => {
    const arrow = (data: string, x: number, y: number, width: number, height: number) =>
      trail(data, x, y, width, height, t.color('accent'), t.shade('accent', LEAF.clear), STROKE);
    const chevron = (tipX: number, tipY: number) =>
      arrow('M0 0 L36 30 L0 60', tipX - 36, tipY - 30, 36, 60);
    return [
      leafBackground(t),
      entry === 'low'
        ? [
            arrow('M0 190 C170 190 280 0 460 0', 0, LOW - RISE, 460, RISE),
            chevron(476, LOW - RISE),
            arrow('M0 190 C140 190 300 0 500 0', 580, HIGH, 500, RISE),
          ]
        : [
            arrow('M0 0 C170 0 280 190 460 190', 0, HIGH, 460, RISE),
            chevron(476, HIGH + RISE),
            arrow('M0 0 C140 0 300 190 500 190', 580, LOW - RISE, 500, RISE),
          ],
      titleLine(t.copy('title'), t.font('heading'), 90, 540, 86, t.color('primary')),
      bodyText(t.copy('body'), t.font('body'), t.color('text'), 90, 670, 860),
    ];
  });

export const STAGE_SERIES: readonly Template[] = [
  stagesCover,
  stage(
    'Spark Stage:',
    'You start sharing what you know and find the topics that make people stop scrolling.',
    'low',
  ),
  stage(
    'Growth Stage:',
    'Posting turns into a rhythm. Your audience starts to recognise your name and your ideas.',
    'high',
  ),
  stage(
    'Authority Stage:',
    'Peers quote your work and clients arrive already convinced you are the right fit.',
    'low',
  ),
  stage(
    'Legacy Stage:',
    'Your ideas travel without you. Others teach your frameworks and the brand runs on trust.',
    'high',
  ),
];
