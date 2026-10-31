import { linear } from '@/design';
import { icon, POST_SIZE, rect, type Theme, text } from '../../../kit';

export const BERRY = {
  hot: '#ff3f7f',
  deep: '#9e1046',
  ink: '#1c0a14',
  white: '#ffffff',
  blush: '#ffe1ec',
  sun: '#ffd23f',
  top: '#ff5a8f',
  bottom: '#b0124f',
};

const FONT = 'Plus Jakarta Sans';

export const { width: W, height: H } = POST_SIZE;

interface Role {
  value: string;
  hint: string;
}

export const FONTS = {
  heading: { label: 'Heading font', value: FONT },
  body: { label: 'Body font', value: FONT },
} as const;

export const PAGE = {
  value: BERRY.top,
  hint: 'Page gradient; its darker shade colors the bottom of the gradient',
} as const;

export const BRAND_COPY = {
  brand: { label: 'Brand', value: 'LUMEN LABS' },
  tagline: { label: 'Brand tagline', value: 'AI STUDIO' },
} as const;

export const FOOTER_COPY = {
  site: { label: 'Website', value: 'lumenlabs.ai' },
  swipe: { label: 'Swipe label', value: 'Swipe' },
} as const;

interface BaseSpec {
  colors: { background: Role; primary: Role; secondary: Role };
  fonts: typeof FONTS;
}

type BrandTheme = Theme<BaseSpec & { copy: typeof BRAND_COPY }>;
type FooterTheme = Theme<BaseSpec & { copy: typeof FOOTER_COPY }>;
type PageTheme = Theme<{ colors: { background: Role } }>;

export const berryBackground = (t: PageTheme) =>
  rect(0, 0, W, H, linear(155, t.color('background'), t.shade('background', BERRY.bottom)), {
    name: 'Background',
  });

export const brandMark = (
  t: BrandTheme,
  x: number,
  y: number,
  align: 'left' | 'center' = 'left',
) => {
  const width = align === 'center' ? W - x * 2 : 500;
  return [
    text(t.copy('brand'), x, y, width, {
      fontFamily: t.font('heading'),
      fontSize: 44,
      fontWeight: 800,
      fill: t.color('primary'),
      align,
      letterSpacing: 1,
    }),
    text(t.copy('tagline'), x, y + 56, width, {
      fontFamily: t.font('body'),
      fontSize: 22,
      fontWeight: 600,
      fill: t.color('secondary'),
      align,
      letterSpacing: 6,
    }),
  ];
};

export const swipeFooter = (t: FooterTheme) => [
  rect(80, 1200, 920, 3, t.shade('primary', 'rgba(255,255,255,0.35)'), { name: 'Footer rule' }),
  text(t.copy('site'), 80, 1240, 500, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 600,
    fill: t.color('secondary'),
  }),
  text(t.copy('swipe'), 700, 1240, 220, {
    fontFamily: t.font('body'),
    fontSize: 30,
    fontWeight: 700,
    fill: t.color('primary'),
    align: 'right',
  }),
  icon('chevrons-right', 936, 1236, 44, t.color('primary'), { strokeWidth: 2.6 }),
];
