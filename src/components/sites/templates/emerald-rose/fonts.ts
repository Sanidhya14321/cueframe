import { Bodoni_Moda, EB_Garamond, Jost } from 'next/font/google';

const display = Bodoni_Moda({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-er-display',
});

const body = EB_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-er-body',
});

const label = Jost({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-er-label' });

export const FONT_VARIABLES = `${display.variable} ${body.variable} ${label.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-er-display)]';
export const BODY = 'font-[family-name:var(--font-er-body)]';
export const LABEL = 'font-[family-name:var(--font-er-label)] uppercase tracking-[0.28em]';
