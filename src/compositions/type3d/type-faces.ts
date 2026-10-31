import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';
import { loadFont as loadOnest } from '@remotion/google-fonts/Onest';
import { loadFont as loadPoppins } from '@remotion/google-fonts/Poppins';

const montserrat = loadMontserrat('normal', {
  weights: ['500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const onest = loadOnest('normal', {
  weights: ['300', '500', '600', '700', '800'],
  subsets: ['latin'],
});

const poppins = loadPoppins('normal', {
  weights: ['500', '600', '700', '800'],
  subsets: ['latin'],
});

export const typeFaces = {
  montserrat: { family: montserrat.fontFamily, ready: montserrat.waitUntilDone },
  onest: { family: onest.fontFamily, ready: onest.waitUntilDone },
  poppins: { family: poppins.fontFamily, ready: poppins.waitUntilDone },
} as const;
