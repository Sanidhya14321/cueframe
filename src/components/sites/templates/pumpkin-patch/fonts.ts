import localFont from 'next/font/local';

const display = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../../../../node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-italic.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-pp-display',
});

const body = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2',
      weight: '200 1000',
      style: 'normal',
    },
  ],
  variable: '--font-pp-body',
});

const hand = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/caveat/files/caveat-latin-wght-normal.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
  variable: '--font-pp-hand',
});

export const FONT_VARIABLES = `${display.variable} ${body.variable} ${hand.variable}`;

export const DISPLAY =
  "font-[family-name:var(--font-pp-display)] [font-variation-settings:'SOFT'_100]";
export const BODY = 'font-[family-name:var(--font-pp-body)]';
export const HAND = 'font-[family-name:var(--font-pp-hand)]';
export const LABEL =
  'font-[family-name:var(--font-pp-body)] font-extrabold uppercase tracking-[0.2em]';
