import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';
import { loadFont as loadSyne } from '@remotion/google-fonts/Syne';
import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import { loadFont as loadYellowtail } from '@remotion/google-fonts/Yellowtail';

export const TEASER_FONTS = {
  caller: loadUnbounded('normal', { weights: ['600'], subsets: ['latin'] }).fontFamily,
  subtitle: loadSora('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily,
  label: loadInter('normal', { weights: ['400', '700'], subsets: ['latin'] }).fontFamily,
  word: loadSyne('normal', {
    weights: ['500', '600', '700', '800'],
    subsets: ['latin'],
  }).fontFamily,
  print: loadSpaceGrotesk('normal', { weights: ['700'], subsets: ['latin'] }).fontFamily,
  script: loadYellowtail('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily,
} as const;
