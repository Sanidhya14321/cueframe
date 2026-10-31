import { linear } from '@/design';
import { icon, POST_SIZE, rect, text } from '../../../kit';

export const MULBERRY = {
  deep: '#2b0716',
  wine: '#5c1233',
  berry: '#7a1d44',
  peach: '#ffb38a',
  blush: '#ffe1d3',
  cream: '#fff6f0',
  white: '#ffffff',
  ink: '#2a1019',
};

export const { width: W, height: H } = POST_SIZE;

export const HEADING = { label: 'Heading font', value: 'Outfit' } as const;
export const BODY = { label: 'Body font', value: 'Outfit' } as const;
export const CONDENSED = { label: 'Heading font', value: 'Barlow Condensed' } as const;
export const SCRIPT = { label: 'Script font', value: 'Caveat' } as const;
export const HANDLE = { label: 'Handle', value: 'fernway.studio' } as const;

export const BACKGROUND = {
  value: MULBERRY.berry,
  hint: 'Page gradient; its darker shade is the bottom of the gradient',
} as const;

type TextStyle = NonNullable<Parameters<typeof text>[4]>;

export const say =
  (fontFamily: string) =>
  (
    content: string,
    x: number,
    y: number,
    width: number,
    size: number,
    fill: string,
    weight = 400,
    extra: TextStyle = {},
  ) =>
    text(content, x, y, width, {
      fontFamily,
      fontSize: size,
      fontWeight: weight,
      fill,
      lineHeight: 1.3,
      ...extra,
    });

export const backdrop = (top: string, bottom: string) =>
  rect(0, 0, W, H, linear(180, top, bottom), { name: 'Background' });

export const nextArrow = (color: string) =>
  icon('arrow-right', 900, 1180, 96, color, { strokeWidth: 1.6 });
