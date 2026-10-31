import { linear } from '@/design';
import { avatar, bars, circle, type Nodes, path, rect, text } from '../../../kit';
import type { Fonts } from './deck-kit';

export const CHART_TITLE = { label: 'Chart screen title', value: 'Performance\nDigest' } as const;
export const CHART_CAPTION = { label: 'Chart screen caption', value: 'Live team charts' } as const;
export const DASH_TITLE = { label: 'Dashboard title', value: 'My Overview' } as const;
export const DASH_STATS = {
  label: 'Dashboard stat',
  value: ['$18.4k', '$12.2k', '3.9%', '+24%', '82%'],
} as const;
export const PROFILE_NAME = { label: 'Profile name', value: 'Nora Lindqvist' } as const;
export const PROFILE_STATS = { label: 'Profile stat', value: ['48', '12', '96%'] } as const;
export const SCREEN_TITLES = {
  label: 'Screen title',
  value: ['My Overview', 'User Profile'],
} as const;

export interface ChartPaint {
  screen: string;
  title: string;
  caption: string;
  chart: string;
  fade: string;
  clear: string;
  tab: string;
}

export const chartScreen =
  (c: ChartPaint, f: Fonts, heading: string, caption: string) =>
  (width: number, height: number): Nodes[] => {
    const x = 0;
    const y = height * 0.32;
    const areaWidth = width;
    const areaHeight = height * 0.22;
    return [
      rect(0, 0, width, height, c.screen, { cornerRadius: width * 0.12, name: 'Screen' }),
      text(heading, width * 0.1, height * 0.1, width * 0.8, {
        fontFamily: f.head,
        fontSize: width * 0.1,
        fontWeight: 800,
        fill: c.title,
        lineHeight: 1.05,
      }),
      text(caption, width * 0.1, height * 0.23, width * 0.8, {
        fontFamily: f.body,
        fontSize: width * 0.055,
        fontWeight: 500,
        fill: c.caption,
      }),
      path(
        'M0 80 C 40 70 60 42 100 52 S 160 20 200 34 S 262 8 300 14 L300 100 L0 100 Z',
        x,
        y,
        areaWidth,
        areaHeight,
        linear(180, c.chart, c.fade),
        { width: 300, height: 100 },
      ),
      path(
        'M0 80 C 40 70 60 42 100 52 S 160 20 200 34 S 262 8 300 14',
        x,
        y,
        areaWidth,
        areaHeight,
        c.clear,
        { width: 300, height: 100 },
        { stroke: c.chart, strokeWidth: 4 },
      ),
      bars(
        width * 0.08,
        height * 0.62,
        width * 0.84,
        height * 0.2,
        [40, 62, 48, 80, 66, 92],
        c.chart,
      ),
      rect(width * 0.08, height * 0.87, width * 0.84, height * 0.06, c.tab, {
        cornerRadius: height * 0.03,
        name: 'Tab bar',
      }),
    ];
  };

export interface DashboardPaint {
  top: string;
  bottom: string;
  text: string;
  tiles: readonly [string, string, string, string];
  ring: string;
  hole: string;
  row: string;
}

export const dashboardScreen =
  (c: DashboardPaint, f: Fonts, heading: string, stats: readonly string[]) =>
  (width: number, height: number): Nodes[] => {
    const tile = (x: number, y: number, value: string, fill: string) => [
      rect(x, y, width * 0.39, height * 0.11, fill, { cornerRadius: width * 0.05, name: 'Tile' }),
      text(value, x + width * 0.04, y + height * 0.035, width * 0.33, {
        fontFamily: f.head,
        fontSize: width * 0.07,
        fontWeight: 800,
        fill: c.text,
      }),
    ];
    const [first = '', second = '', third = '', fourth = '', ring = ''] = stats;
    return [
      rect(0, 0, width, height, linear(180, c.top, c.bottom), {
        cornerRadius: width * 0.12,
        name: 'Screen',
      }),
      text(heading, width * 0.08, height * 0.08, width * 0.8, {
        fontFamily: f.head,
        fontSize: width * 0.075,
        fontWeight: 800,
        fill: c.text,
      }),
      tile(width * 0.08, height * 0.16, first, c.tiles[0]),
      tile(width * 0.53, height * 0.16, second, c.tiles[1]),
      tile(width * 0.08, height * 0.29, third, c.tiles[2]),
      tile(width * 0.53, height * 0.29, fourth, c.tiles[3]),
      circle(width * 0.5, height * 0.56, width * 0.2, c.ring),
      circle(width * 0.5, height * 0.56, width * 0.13, c.hole),
      text(ring, width * 0.3, height * 0.545, width * 0.4, {
        fontFamily: f.head,
        fontSize: width * 0.07,
        fontWeight: 800,
        fill: c.text,
        align: 'center',
      }),
      [0, 1, 2].map((index) =>
        rect(width * 0.08, height * (0.72 + index * 0.07), width * 0.84, height * 0.05, c.row, {
          cornerRadius: width * 0.03,
          name: 'Row',
        }),
      ),
    ];
  };

export interface ProfilePaint {
  screen: string;
  text: string;
  ring: string;
  stat: string;
  card: string;
  dot: string;
  line: string;
}

export const profileScreen =
  (c: ProfilePaint, f: Fonts, heading: string, name: string, stats: readonly string[]) =>
  (width: number, height: number): Nodes[] => [
    rect(0, 0, width, height, c.screen, { cornerRadius: width * 0.12, name: 'Screen' }),
    text(heading, 0, height * 0.08, width, {
      fontFamily: f.head,
      fontSize: width * 0.08,
      fontWeight: 800,
      fill: c.text,
      align: 'center',
    }),
    avatar('woman-portrait-1', width / 2, height * 0.24, width * 0.13, c.ring),
    text(name, 0, height * 0.33, width, {
      fontFamily: f.body,
      fontSize: width * 0.06,
      fontWeight: 700,
      fill: c.text,
      align: 'center',
    }),
    stats.map((value, index) =>
      text(value, width * (0.08 + index * 0.29), height * 0.41, width * 0.26, {
        fontFamily: f.head,
        fontSize: width * 0.075,
        fontWeight: 800,
        fill: c.stat,
        align: 'center',
      }),
    ),
    [0, 1, 2].map((index) => [
      rect(width * 0.08, height * (0.52 + index * 0.13), width * 0.84, height * 0.1, c.card, {
        cornerRadius: width * 0.05,
        name: 'Card',
      }),
      circle(width * 0.18, height * (0.57 + index * 0.13), width * 0.05, c.dot),
      rect(width * 0.3, height * (0.555 + index * 0.13), width * 0.48, height * 0.025, c.line, {
        cornerRadius: 6,
        name: 'Line',
      }),
    ]),
  ];
