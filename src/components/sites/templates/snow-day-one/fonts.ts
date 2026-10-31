import { Fredoka, Gochi_Hand, Nunito } from 'next/font/google';

const display = Fredoka({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sd-display',
});

const body = Nunito({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sd-body',
});

const hand = Gochi_Hand({ weight: '400', subsets: ['latin'], variable: '--font-sd-hand' });

export const FONT_VARIABLES = `${display.variable} ${body.variable} ${hand.variable}`;

export const DISPLAY = 'font-[family-name:var(--font-sd-display)]';
export const BODY = 'font-[family-name:var(--font-sd-body)]';
export const HAND = 'font-[family-name:var(--font-sd-hand)]';
export const LABEL =
  'font-[family-name:var(--font-sd-body)] font-extrabold uppercase tracking-[0.16em]';

export const GIANT_NUMBER =
  'font-bold leading-[0.8] text-white [text-shadow:0_7px_0_var(--sd-primary-deep),0_22px_36px_rgba(20,24,70,0.28)]';
