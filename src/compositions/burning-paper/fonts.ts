import { loadFont as loadCaveat } from '@remotion/google-fonts/Caveat';
import { loadFont as loadSerif } from '@remotion/google-fonts/DMSerifDisplay';
import { loadFont as loadGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

export const serifFont = loadSerif('normal', {
  weights: ['400'],
  subsets: ['latin'],
}).fontFamily;

export const groteskFont = loadGrotesk('normal', {
  weights: ['600'],
  subsets: ['latin'],
}).fontFamily;

export const scriptFont = loadCaveat('normal', {
  weights: ['600'],
  subsets: ['latin'],
}).fontFamily;
