import localFont from 'next/font/local';

const display = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-standard-normal.woff2',
      weight: '400 900',
      style: 'normal',
    },
    {
      path: '../../../../../node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-standard-italic.woff2',
      weight: '400 900',
      style: 'italic',
    },
  ],
  variable: '--font-mc-display',
});

const deco = localFont({
  src: '../../../../../node_modules/@fontsource/poiret-one/files/poiret-one-latin-400-normal.woff2',
  weight: '400',
  variable: '--font-mc-deco',
});

const body = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-normal.woff2',
      weight: '400 800',
      style: 'normal',
    },
    {
      path: '../../../../../node_modules/@fontsource-variable/eb-garamond/files/eb-garamond-latin-wght-italic.woff2',
      weight: '400 800',
      style: 'italic',
    },
  ],
  variable: '--font-mc-body',
});

export const FONT_VARIABLES = `${display.variable} ${deco.variable} ${body.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-mc-display)]';
export const DECO = 'font-[family-name:var(--font-mc-deco)] uppercase tracking-[0.28em]';
export const BODY = 'font-[family-name:var(--font-mc-body)]';
export const FOIL =
  'bg-(image:--mc-foil) bg-[length:220%_100%] bg-clip-text text-transparent animate-[mc-shimmer_9s_ease-in-out_infinite] motion-reduce:animate-none';
