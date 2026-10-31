import localFont from 'next/font/local';

const display = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/fredoka/files/fredoka-latin-wght-normal.woff2',
      weight: '300 700',
      style: 'normal',
    },
  ],
  variable: '--font-sd-display',
});

const body = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2',
      weight: '200 1000',
      style: 'normal',
    },
  ],
  variable: '--font-sd-body',
});

const hand = localFont({
  src: '../../../../../node_modules/@fontsource/gochi-hand/files/gochi-hand-latin-400-normal.woff2',
  weight: '400',
  variable: '--font-sd-hand',
});

export const FONT_VARIABLES = `${display.variable} ${body.variable} ${hand.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-sd-display)]';
export const BODY = 'font-[family-name:var(--font-sd-body)]';
export const HAND = 'font-[family-name:var(--font-sd-hand)]';
export const LABEL =
  'font-[family-name:var(--font-sd-body)] font-extrabold uppercase tracking-[0.16em]';

export const GIANT_NUMBER =
  'font-bold leading-[0.8] text-white [text-shadow:0_7px_0_var(--sd-primary-deep),0_22px_36px_rgba(20,24,70,0.28)]';
