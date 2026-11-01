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
  variable: '--font-il-display',
});

const sans = localFont({
  src: [
    {
      path: '../../../../../node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-il-sans',
});

export const FONT_VARIABLES = `${display.variable} ${sans.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-il-display)]';
export const SANS = 'font-[family-name:var(--font-il-sans)]';
export const LABEL =
  'font-[family-name:var(--font-il-sans)] font-medium text-[10px] uppercase tracking-[0.3em]';
