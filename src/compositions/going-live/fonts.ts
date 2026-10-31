import { loadFont } from '@remotion/google-fonts/Outfit';

const outfit = loadFont('normal', {
  weights: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const teaserFont = outfit.fontFamily;
