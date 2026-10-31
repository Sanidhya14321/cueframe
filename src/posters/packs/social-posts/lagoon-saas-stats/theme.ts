import { type Fill, linear } from '@/design';
import type { ColorKey } from '../../../kit';

export interface PostTheme {
  background: string;
  backgroundEnd?: string;
  surface: string;
  ink: string;
  text: string;
  muted: string;
  brand: string;
  brandText: string;
  deep: string;
  star: string;
  headFont: string;
  bodyFont: string;
}

export const POST = { width: 1080, height: 1350 } as const;
export const STORY = { width: 1080, height: 1920 } as const;

export type Roles = Partial<Record<ColorKey, { value: string; hint: string }>>;

export const roles = (colors: Roles): Roles => colors;

export interface Painter {
  color: (key: ColorKey) => string;
  shade: (key: ColorKey, exact: string) => string;
}

export interface Paint {
  background: Fill;
  text: string;
  muted: string;
  brand: string;
  deep: string;
  surface: string;
  star: string;
  ink: string;
  brandText: string;
}

export const hasDeep = (theme: PostTheme) => theme.deep !== theme.brand;
export const hasInk = (theme: PostTheme) => theme.ink !== theme.text;

export const backgroundHint = (theme: PostTheme) =>
  theme.backgroundEnd === undefined
    ? 'Page'
    : 'Page gradient; its darker shade is the bottom of the gradient';

export const paintOf = (t: Painter, theme: PostTheme): Paint => {
  const ink = () => (hasInk(theme) ? t.color('accent') : t.color('text'));
  return {
    get background(): Fill {
      const start = t.color('background');
      return theme.backgroundEnd === undefined
        ? start
        : linear(200, start, t.shade('background', theme.backgroundEnd));
    },
    get text() {
      return t.color('text');
    },
    get muted() {
      return t.shade('text', theme.muted);
    },
    get brand() {
      return t.color('primary');
    },
    get deep() {
      return hasDeep(theme) ? t.color('secondary') : t.color('primary');
    },
    get surface() {
      return t.color('surface');
    },
    get star() {
      return t.shade('surface', theme.star);
    },
    get ink() {
      return ink();
    },
    get brandText() {
      return theme.brandText === theme.ink ? ink() : t.shade('surface', theme.brandText);
    },
  };
};
