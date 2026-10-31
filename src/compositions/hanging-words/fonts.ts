import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadSaira } from '@remotion/google-fonts/Saira';
import type { HangingFont } from '@/schemas';

const saira = loadSaira('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const montserrat = loadMontserrat('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const fontFamily = (font: HangingFont): string =>
  font === 'square' ? saira.fontFamily : montserrat.fontFamily;
