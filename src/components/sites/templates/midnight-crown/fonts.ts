import { Bodoni_Moda, EB_Garamond, Poiret_One } from 'next/font/google';

const display = Bodoni_Moda({
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mc-display',
});

const deco = Poiret_One({ weight: '400', subsets: ['latin'], variable: '--font-mc-deco' });

const body = EB_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-mc-body',
});

export const FONT_VARIABLES = `${display.variable} ${deco.variable} ${body.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-mc-display)]';
export const DECO = 'font-[family-name:var(--font-mc-deco)] uppercase tracking-[0.28em]';
export const BODY = 'font-[family-name:var(--font-mc-body)]';
export const FOIL =
  'bg-(image:--mc-foil) bg-[length:220%_100%] bg-clip-text text-transparent animate-[mc-shimmer_9s_ease-in-out_infinite] motion-reduce:animate-none';
