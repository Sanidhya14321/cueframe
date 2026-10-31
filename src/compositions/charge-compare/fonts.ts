import { loadFont as loadDMMono } from '@remotion/google-fonts/DMMono';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';

export const CHARGE_FONTS = {
  display: loadSora('normal', { weights: ['500', '600', '700', '800'], subsets: ['latin'] })
    .fontFamily,
  wordmark: loadOutfit('normal', { weights: ['300'], subsets: ['latin'] }).fontFamily,
  mono: loadDMMono('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily,
} as const;
