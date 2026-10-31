import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadPlayfair } from '@remotion/google-fonts/PlayfairDisplay';

export const titleFont = loadInter('normal', {
  weights: ['800', '900'],
  subsets: ['latin'],
}).fontFamily;

export const taglineFont = loadPlayfair('italic', {
  weights: ['400', '500'],
  subsets: ['latin'],
}).fontFamily;
