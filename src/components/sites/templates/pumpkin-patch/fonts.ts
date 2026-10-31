import { Caveat, Fraunces, Nunito } from 'next/font/google';

const display = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['SOFT', 'opsz'],
  variable: '--font-pp-display',
});

const body = Nunito({ subsets: ['latin'], variable: '--font-pp-body' });

const hand = Caveat({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-pp-hand' });

export const FONT_VARIABLES = `${display.variable} ${body.variable} ${hand.variable}`;

export const DISPLAY =
  "font-[family-name:var(--font-pp-display)] [font-variation-settings:'SOFT'_100]";
export const BODY = 'font-[family-name:var(--font-pp-body)]';
export const HAND = 'font-[family-name:var(--font-pp-hand)]';
export const LABEL =
  'font-[family-name:var(--font-pp-body)] font-extrabold uppercase tracking-[0.2em]';
