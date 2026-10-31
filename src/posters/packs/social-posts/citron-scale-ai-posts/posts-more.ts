import { linear } from '@/design';
import {
  circle,
  icon,
  rect,
  shadow,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import {
  BODY,
  BRAND,
  brandMark,
  CITRON,
  counterGrow,
  darkBg,
  H,
  HEADING,
  levelUp,
  limeGlow,
  versionLive,
  W,
} from './posts';
import { flowmindPost, roadmapShines, smartEngines } from './posts-mid';

const SPACE_ICONS = ['megaphone', 'palette', 'code', 'headphones'] as const;
const ACTIVE_SPACE = 1;

const workspacesSpec = {
  colors: {
    background: { value: CITRON.night, hint: 'Page and the count on the active badge' },
    surface: { value: '#262a1d', hint: 'Panel; its darker shade colors the bottom of the panel' },
    primary: { value: CITRON.lime, hint: 'Glow, the active row icon and its count badge' },
    text: {
      value: CITRON.white,
      hint: 'Workspaces title, plus, row icons, labels, counts and brand; its faded shades color the panel edge, active row and other badges',
    },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Workspaces' },
    spaces: { label: 'Workspace', value: ['Growth', 'Product', 'Engineering', 'Support'] },
    counts: { label: 'Count', value: ['3', '5', '2', '4'] },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const workspaces = themed(W, H, workspacesSpec, (t) => {
  const counts = t.list('counts');
  return [
    darkBg(t, H),
    limeGlow(t, 500, 120, 580, 700, 0.3),
    rect(170, 320, 740, 680, linear(180, t.color('surface'), t.shade('surface', '#14160e')), {
      name: 'Panel',
      cornerRadius: 40,
      stroke: t.shade('text', 'rgba(255,255,255,0.2)'),
      strokeWidth: 2,
      ...shadow(60, 24, 'rgba(0,0,0,0.6)'),
    }),
    text(t.copy('title'), 230, 380, 500, {
      fontFamily: t.font('heading'),
      fontSize: 46,
      fontWeight: 600,
      fill: t.color('text'),
    }),
    icon('plus', 810, 384, 48, t.color('text'), { strokeWidth: 2.4 }),
    t.list('spaces').map((space, index) => {
      const y = 520 + index * 118;
      const active = index === ACTIVE_SPACE;
      return [
        active
          ? rect(200, y - 22, 680, 96, t.shade('text', 'rgba(255,255,255,0.09)'), {
              name: 'Active row',
              cornerRadius: 22,
            })
          : [],
        icon(
          SPACE_ICONS[index] ?? 'code',
          240,
          y,
          48,
          active ? t.color('primary') : t.color('text'),
          { strokeWidth: 2 },
        ),
        text(space, 316, y + 4, 420, {
          fontFamily: t.font('body'),
          fontSize: 38,
          fontWeight: 600,
          fill: t.color('text'),
        }),
        circle(
          830,
          y + 25,
          22,
          active ? t.color('primary') : t.shade('text', 'rgba(255,255,255,0.14)'),
          { name: 'Badge' },
        ),
        text(counts[index] ?? '', 808, y + 9, 44, {
          fontFamily: t.font('body'),
          fontSize: 24,
          fontWeight: 700,
          fill: active ? t.color('background') : t.color('text'),
          align: 'center',
        }),
      ];
    }),
    brandMark(t, 1240),
  ];
});

const CAPSULES = [
  { x: 110, height: 320, active: false },
  { x: 350, height: 460, active: false },
  { x: 590, height: 720, active: true },
  { x: 830, height: 420, active: false },
];

const insightsSpec = {
  colors: {
    background: { value: CITRON.night, hint: 'Page, with a lighter glow at the top' },
    surface: {
      value: '#3b4030',
      hint: 'Short capsules; its faded shade fades them out at the bottom',
    },
    primary: {
      value: CITRON.lime,
      hint: 'Insights title and the tall capsule; its lighter shade tops the capsule',
    },
    text: { value: CITRON.white, hint: 'Brand; its faded shade colors the body text' },
  },
  fonts: { heading: HEADING, body: BODY },
  copy: {
    title: { label: 'Title', value: 'Insights' },
    body: {
      label: 'Body',
      value: 'Spot the patterns that sharpen\nevery decision you make',
    },
    brand: BRAND,
  },
} as const satisfies ThemeSpec;

const insightsBars = themed(W, H, insightsSpec, (t) => [
  darkBg(t, H),
  text(t.copy('title'), 80, 110, 920, {
    fontFamily: t.font('heading'),
    fontSize: 116,
    fontWeight: 800,
    fill: t.color('primary'),
  }),
  text(t.copy('body'), 80, 270, 920, {
    fontFamily: t.font('body'),
    fontSize: 38,
    fontWeight: 500,
    fill: t.shade('text', CITRON.muted),
    lineHeight: 1.4,
  }),
  CAPSULES.map((capsule) =>
    rect(
      capsule.x,
      1180 - capsule.height,
      150,
      capsule.height,
      capsule.active
        ? linear(180, t.shade('primary', CITRON.bright), t.color('primary'))
        : linear(180, t.color('surface'), t.shade('surface', 'rgba(37,41,29,0.4)')),
      {
        name: 'Capsule',
        cornerRadius: 75,
        ...(capsule.active ? shadow(70, 0, t.shade('primary', 'rgba(163,230,53,0.55)')) : {}),
      },
    ),
  ),
  brandMark(t, 1250),
]);

export const POSTS: readonly Template[] = [
  levelUp,
  counterGrow,
  versionLive,
  roadmapShines,
  smartEngines,
  flowmindPost,
  workspaces,
  insightsBars,
];
