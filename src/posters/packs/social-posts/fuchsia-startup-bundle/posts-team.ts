import { type Fill, linear } from '@/design';
import {
  photo,
  pill,
  rect,
  rotateNodes,
  shadow,
  star,
  type Template,
  type ThemeSpec,
  text,
  themed,
} from '../../../kit';
import type { PostTheme } from '../lagoon-saas-stats/theme';
import { backdrop, copyStyle, fontsOf, H, head, pageFill, W } from './posts';

const folder = (x: number, y: number, width: number, height: number, fill: Fill, name: string) => [
  rect(x, y - 54, width * 0.34, 80, fill, { name: `${name} tab`, cornerRadius: 18 }),
  rect(x, y, width, height, fill, { name, cornerRadius: 24 }),
];

export const expertsFolder = (theme: PostTheme): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.background, hint: 'Page gradient' },
        surface: {
          value: theme.surface,
          hint: 'Paper sheet and the button; its grey shade colors the sheet lines',
        },
        primary: {
          value: theme.brand,
          hint: 'Front folder; its purple shade colors the lower end of the folder',
        },
        secondary: {
          value: '#4c0b5c',
          hint: 'Back folder; its dark shade colors the button label',
        },
        text: {
          value: '#ffffff',
          hint: 'Headline and paragraph on the front folder; its pale shade colors Insider notes',
        },
      },
      fonts: fontsOf(theme),
      copy: {
        kicker: { label: 'Kicker', value: 'Insider notes' },
        title: { label: 'Headline', value: 'ONLY EXPERTS\nKNOW THIS' },
        body: {
          label: 'Paragraph',
          value:
            'Your expertise is your real value. It is the lens that lets clients see things your way. Want to learn more?',
        },
        button: { label: 'Button', value: 'Read the full guide' },
      },
    } satisfies ThemeSpec,
    (t) => [
      backdrop(t, pageFill(theme)),
      text(
        t.copy('kicker'),
        80,
        100,
        600,
        copyStyle(t.font('body'), 30, t.shade('text', theme.muted), 600),
      ),
      folder(160, 260, 760, 520, t.color('secondary'), 'Back folder'),
      rotateNodes(-4, 540, 520, [
        rect(230, 340, 620, 420, t.color('surface'), { name: 'Sheet', cornerRadius: 8 }),
        [0, 1, 2, 3].map((index) =>
          rect(280, 400 + index * 60, 420 - index * 60, 16, t.shade('surface', '#e5e7eb'), {
            name: 'Sheet line',
            cornerRadius: 8,
          }),
        ),
      ]),
      folder(
        80,
        600,
        920,
        640,
        linear(160, t.color('primary'), t.shade('primary', '#7e22ce')),
        'Front folder',
      ),
      text(t.copy('title'), 140, 700, 820, head(t.font('heading'), 84, t.color('text'))),
      text(t.copy('body'), 140, 920, 800, copyStyle(t.font('body'), 32, t.color('text'))),
      pill(t.copy('button'), 140, 1100, {
        fill: t.color('surface'),
        color: t.shade('secondary', theme.ink),
        fontSize: 30,
        fontFamily: t.font('body'),
        fontWeight: 700,
      }),
    ],
  );

export const employeeBadge = (theme: PostTheme): Template =>
  themed(
    W,
    H,
    {
      colors: {
        background: { value: theme.background, hint: 'Page gradient' },
        surface: {
          value: theme.surface,
          hint: 'Front badge; its grey shade colors the metal clip',
        },
        primary: { value: theme.brand, hint: 'The big star' },
        secondary: {
          value: theme.deep,
          hint: 'Lanyard, the back badge and the badge slot; its dark shades color the badge title and name',
        },
        text: {
          value: theme.text,
          hint: 'Welcome line; its pale shade colors the company name on the back badge',
        },
      },
      fonts: fontsOf(theme),
      copy: {
        company: { label: 'Company', value: 'Orbitly' },
        title: { label: 'Badge title', value: 'EMPLOYEE\nSPOTLIGHT' },
        name: { label: 'Name', value: 'Meet Anya Rivera' },
        welcome: { label: 'Welcome line', value: 'Our new SEO lead says hello. Welcome!' },
      },
    } satisfies ThemeSpec,
    (t) => [
      backdrop(t, pageFill(theme)),
      rect(500, 0, 80, 250, t.color('secondary'), { name: 'Lanyard' }),
      rect(512, 236, 56, 80, t.shade('surface', '#9ca3af'), { name: 'Clip', cornerRadius: 10 }),
      rotateNodes(-10, 400, 640, [
        rect(200, 330, 420, 640, t.color('secondary'), { name: 'Back badge', cornerRadius: 28 }),
        text(t.copy('company'), 195, 930, 400, {
          ...head(t.font('heading'), 56, t.shade('text', theme.muted)),
          rotation: -90,
        }),
      ]),
      rect(320, 300, 460, 700, t.color('surface'), {
        name: 'Badge',
        cornerRadius: 30,
        ...shadow(40, 16, 'rgba(0,0,0,0.35)'),
      }),
      rect(490, 326, 120, 22, t.color('secondary'), { name: 'Badge slot', cornerRadius: 11 }),
      photo('woman-portrait-2', 360, 380, 380, 400, { cornerRadius: 18 }),
      text(
        t.copy('title'),
        360,
        806,
        380,
        head(t.font('heading'), 52, t.shade('secondary', theme.ink)),
      ),
      text(
        t.copy('name'),
        360,
        930,
        380,
        copyStyle(t.font('body'), 28, t.shade('secondary', '#4b5563'), 500),
      ),
      star(5, 820, 260, 150, t.color('primary'), { innerRatio: 0.45, name: 'Star' }),
      text(t.copy('welcome'), 0, 1120, W, {
        ...head(t.font('heading'), 44, t.color('text')),
        align: 'center',
      }),
    ],
  );
