import { linear } from '@/design';
import { group, pill, rect, rotateNodes, shadow, type ThemeSpec, text, themed } from '../../../kit';
import {
  BODY_FONT,
  BRAND,
  backdrop,
  backdropFill,
  footerMark,
  H,
  HEADING_FONT,
  headerLink,
  type SaasTheme,
  trend,
  W,
} from './posts';

const ROTATIONS = [-8, 10, -14, 18, -6, 12, -10, 6] as const;

export const ourServices = (theme: SaasTheme, title: string, words: readonly string[]) => {
  const spec = {
    colors: {
      background: {
        value: theme.brand,
        hint: 'Page gradient; its lighter shade ends the gradient',
      },
      text: { value: theme.onBrand, hint: 'Outlined title, the word pill outlines and the words' },
    },
    fonts: {
      heading: { label: 'Heading font', value: 'Bebas Neue' },
      body: { label: 'Word font', value: 'Outfit' },
    },
    copy: {
      title: { label: 'Title', value: title },
      words: { label: 'Word', value: words },
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    rect(0, 0, W, H, linear(180, t.color('background'), t.shade('background', theme.glow)), {
      name: 'Background',
    }),
    text(t.copy('title'), 0, 70, W, {
      fontFamily: t.font('heading'),
      fontSize: 200,
      fontWeight: 400,
      fill: t.shade('text', 'rgba(0,0,0,0)'),
      stroke: t.color('text'),
      strokeWidth: 4,
      align: 'center',
      ...shadow(24, 0, 'rgba(255,255,255,0.7)'),
    }),
    t.list('words').map((word, index) => {
      const x = index % 2 === 0 ? 70 : 560;
      const y = 380 + Math.floor(index / 2) * 220;
      const degrees = ROTATIONS[index] ?? 0;
      return rotateNodes(degrees, x + 210, y + 50, [
        rect(x, y, 420, 100, t.shade('text', 'rgba(0,0,0,0)'), {
          name: 'Word pill',
          cornerRadius: 50,
          stroke: t.color('text'),
          strokeWidth: 4,
        }),
        text(word, x, y + 24, 420, {
          fontFamily: t.font('body'),
          fontSize: 46,
          fontWeight: 600,
          fill: t.color('text'),
          align: 'center',
        }),
      ]);
    }),
  ]);
};

export const fromZero = (
  theme: SaasTheme,
  copy: { left: string; right: string; tag: string; word: string },
) => {
  const spec = {
    colors: {
      background: {
        value: theme.background,
        hint:
          theme.backgroundEnd === undefined
            ? 'Page'
            : 'Page gradient; its deeper shade ends the gradient',
      },
      primary: { value: theme.brand, hint: 'Trend arrow, the tag pill and the logo tile' },
      text: { value: theme.text, hint: 'Top links, the big word and the brand name' },
      secondary: { value: theme.onBrand, hint: 'Tag pill label and the arrow in the logo tile' },
    },
    fonts: { heading: HEADING_FONT, body: BODY_FONT },
    copy: {
      left: { label: 'Top left link', value: copy.left },
      right: { label: 'Top right link', value: copy.right },
      tag: { label: 'Tag', value: copy.tag },
      word: { label: 'Big word', value: copy.word },
      brand: BRAND,
    },
  } as const satisfies ThemeSpec;
  return themed(W, H, spec, (t) => [
    backdrop(backdropFill(theme, t.color('background'), (exact) => t.shade('background', exact))),
    headerLink(t.copy('left'), 'left', t.color('text'), t.font('body')),
    headerLink(t.copy('right'), 'right', t.color('text'), t.font('body')),
    trend(
      [
        [0, 1080],
        [300, 830],
        [520, 900],
        [960, 360],
      ],
      30,
      t.color('primary'),
    ),
    group(
      pill(t.copy('tag'), 340, 520, {
        fill: t.color('primary'),
        color: t.color('secondary'),
        fontSize: 40,
        fontFamily: t.font('heading'),
        fontWeight: 600,
        width: 300,
      }),
      text(t.copy('word'), 0, 600, W, {
        fontFamily: t.font('heading'),
        fontSize: 190,
        fontWeight: 800,
        fill: t.color('text'),
        align: 'center',
        ...shadow(20, 6, 'rgba(0,0,0,0.35)'),
      }),
    ),
    footerMark(
      380,
      1220,
      { tile: t.color('primary'), arrow: t.color('secondary'), name: t.color('text') },
      t.copy('brand'),
      t.font('heading'),
    ),
  ]);
};
