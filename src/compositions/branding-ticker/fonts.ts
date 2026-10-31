import { loadFont as loadPlayfairDisplay } from '@remotion/google-fonts/PlayfairDisplay';
import { roundedFont, roundedFontReady } from '../promo/fonts';

export const tickerFont = roundedFont;

export const tickerFontReady = roundedFontReady;

export const leadSerifFont = loadPlayfairDisplay('italic', {
  weights: ['600'],
  subsets: ['latin'],
}).fontFamily;
