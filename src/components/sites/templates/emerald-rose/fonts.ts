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
  variable: '--font-er-display',
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
  variable: '--font-er-body',
});

const label = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-er-label',
});

export const FONT_VARIABLES = `${display.variable} ${body.variable} ${label.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-er-display)]';
export const BODY = 'font-[family-name:var(--font-er-body)]';
export const LABEL = 'font-[family-name:var(--font-er-label)] uppercase tracking-[0.28em]';
