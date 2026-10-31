import { loadFont } from '@remotion/google-fonts/Montserrat';

export const dominoFont = loadFont('normal', {
  weights: ['500', '600', '700', '800', '900'],
  subsets: ['latin'],
}).fontFamily;
