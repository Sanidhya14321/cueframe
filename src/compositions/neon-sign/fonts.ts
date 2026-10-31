import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';
import { loadFont as loadTiltNeon } from '@remotion/google-fonts/TiltNeon';

export const neonFont = loadTiltNeon('normal', {
  weights: ['400'],
  subsets: ['latin'],
}).fontFamily;

export const labelFont = loadOutfit('normal', {
  weights: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
}).fontFamily;
