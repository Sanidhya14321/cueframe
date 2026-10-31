import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadSora } from '@remotion/google-fonts/Sora';

export const titleFont = loadSora('normal', {
  weights: ['600', '700', '800'],
  subsets: ['latin'],
}).fontFamily;

export const serifFont = loadInstrumentSerif('italic', {
  weights: ['400'],
  subsets: ['latin'],
}).fontFamily;
