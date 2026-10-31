import { Bodoni_Moda, Jost } from 'next/font/google';

const display = Bodoni_Moda({
  style: ['normal', 'italic'],
  axes: ['opsz'],
  subsets: ['latin'],
  variable: '--font-il-display',
});

const sans = Jost({ subsets: ['latin'], variable: '--font-il-sans' });

export const FONT_VARIABLES = `${display.variable} ${sans.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-il-display)]';
export const SANS = 'font-[family-name:var(--font-il-sans)]';
export const LABEL =
  'font-[family-name:var(--font-il-sans)] font-medium text-[10px] uppercase tracking-[0.3em]';
